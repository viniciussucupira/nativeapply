import { createHmac, timingSafeEqual } from "node:crypto";

export const BILLING_COOKIE = "na_billing_session";
export const BILLING_SESSION_SECONDS = 15 * 60;
const idPattern = /^sub_[a-z0-9]{26}$/;

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(`nativeapply:billing:v1:${payload}`).digest("base64url");
}
export function createBillingSession(email: string, secret: string, now = Date.now()) {
  if (!secret) throw new Error("Signing unavailable");
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), expires: Math.floor(now / 1000) + BILLING_SESSION_SECONDS })).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}
export function readBillingSession(value: string, secret: string, now = Date.now()): string | null {
  if (!secret || value.length > 2048) return null;
  const [payload, supplied, extra] = value.split(".");
  if (!payload || !supplied || extra !== undefined) return null;
  const a = Buffer.from(signature(payload, secret)), b = Buffer.from(supplied);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) && typeof data.expires === "number" && data.expires > Math.floor(now / 1000) ? data.email : null;
  } catch { return null; }
}

type Subscription = {
  id: string; customer_id: string; status: string;
  current_billing_period?: { ends_at?: string } | null;
  next_billed_at?: string | null;
  scheduled_change?: { action: string; effective_at?: string } | null;
  items?: { price?: { id?: string } }[];
};
export type BillingSummary = { id: string; status: string; endsAt: string | null; cancellationScheduled: boolean; canCancel: boolean };
type PaddleResult<T> = { data: T; meta?: { pagination?: { has_more?: boolean } } };
export type BillingTransport = <T>(path: string, body?: object) => Promise<PaddleResult<T>>;

export function isNativeSubscription(sub: Subscription, price: string): boolean {
  return Boolean(price && idPattern.test(sub.id) && sub.items?.length && sub.items.every(item => item.price?.id === price));
}
export function billingSummary(sub: Subscription): BillingSummary {
  const scheduled = sub.scheduled_change?.action === "cancel";
  return { id: sub.id, status: sub.status, endsAt: (scheduled ? sub.scheduled_change?.effective_at : sub.current_billing_period?.ends_at) || null,
    cancellationScheduled: scheduled, canCancel: !scheduled && ["active", "trialing", "past_due", "paused"].includes(sub.status) };
}

export const paddleBillingRequest: BillingTransport = async <T>(path: string, body?: object): Promise<PaddleResult<T>> => {
  const key = process.env.PADDLE_BILLING_API_KEY || process.env.PADDLE_API_KEY;
  if (!key) throw new Error("Billing not configured");
  const base = process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com";
  const response = await fetch(`${base}${path}`, {
    method: body ? "POST" : "GET", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error("Billing provider unavailable");
  return response.json();
};

async function allPages<T extends { id: string }>(path: string, request: BillingTransport): Promise<T[]> {
  const result: T[] = [];
  let cursor = "";
  for (let page = 0; page < 5; page++) {
    const response = await request<T[]>(`${path}&per_page=200${cursor ? `&after=${encodeURIComponent(cursor)}` : ""}`);
    if (!Array.isArray(response.data)) throw new Error("Invalid billing response");
    result.push(...response.data);
    if (!response.meta?.pagination?.has_more) return result;
    const next = response.data.at(-1)?.id;
    if (!next || next === cursor) throw new Error("Incomplete billing response");
    cursor = next;
  }
  throw new Error("Too many subscriptions to list safely");
}

export async function listBillingSubscriptions(email: string, price: string, request = paddleBillingRequest): Promise<BillingSummary[]> {
  if (!price) throw new Error("Product not configured");
  const customers = await allPages<{ id: string; email: string }>(`/customers?email=${encodeURIComponent(email)}&status=active,archived`, request);
  const found: BillingSummary[] = [];
  for (const customer of customers) {
    if (customer.email.trim().toLowerCase() !== email.trim().toLowerCase() || !/^ctm_[a-z0-9]{26}$/.test(customer.id)) continue;
    const subscriptions = await allPages<Subscription>(`/subscriptions?customer_id=${encodeURIComponent(customer.id)}`, request);
    for (const sub of subscriptions) if (sub.customer_id === customer.id && isNativeSubscription(sub, price)) found.push(billingSummary(sub));
  }
  return found;
}

export async function cancelBillingSubscription(email: string, subscriptionId: string, price: string, request = paddleBillingRequest): Promise<BillingSummary> {
  if (!idPattern.test(subscriptionId)) throw new Error("Invalid subscription");
  const getOwned = async () => {
    const { data: sub } = await request<Subscription>(`/subscriptions/${subscriptionId}`);
    if (!sub || sub.id !== subscriptionId || !isNativeSubscription(sub, price) || !/^ctm_[a-z0-9]{26}$/.test(sub.customer_id)) throw new Error("Subscription unavailable");
    const { data: customer } = await request<{ email?: string }>(`/customers/${sub.customer_id}`);
    if (customer?.email?.trim().toLowerCase() !== email.trim().toLowerCase()) throw new Error("Subscription unavailable");
    return sub;
  };
  const sub = await getOwned();
  if (sub.status === "canceled" || sub.scheduled_change?.action === "cancel") return billingSummary(sub);
  if (!billingSummary(sub).canCancel) throw new Error("Subscription unavailable");
  try {
    // Paused subscriptions have no active billing period. Other plans retain the paid period.
    await request<Subscription>(`/subscriptions/${subscriptionId}/cancel`, { effective_from: sub.status === "paused" ? "immediately" : "next_billing_period" });
  } catch {
    // A timeout or concurrent click may follow a successful provider operation.
    const latest = await getOwned();
    if (latest.status === "canceled" || latest.scheduled_change?.action === "cancel") return billingSummary(latest);
    throw new Error("Cancellation not confirmed");
  }
  const confirmed = await getOwned();
  if (confirmed.status !== "canceled" && confirmed.scheduled_change?.action !== "cancel") throw new Error("Cancellation not confirmed");
  return billingSummary(confirmed);
}
