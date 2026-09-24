import {
  clearSubscriptionId,
  getSubscriptionId,
  grantLifetimePro,
  grantMonthlyPro,
  revokeProForTransaction,
  setSubscriptionId,
} from "./redis";

// The Nimbus Labs Paddle account is shared by several products (Retone,
// NativeApply, ...). Paddle sends every product's events to every webhook
// destination, so a transaction only unlocks NativeApply Pro when it contains
// one of NativeApply's own prices.
const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID ?? "";
const LIFETIME_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID ?? "";

// Grace period after a monthly billing period ends, so a renewal that
// arrives a little late never locks a paying customer out.
const MONTHLY_GRACE_SECONDS = 3 * 24 * 60 * 60;
const MONTHLY_FALLBACK_SECONDS = 31 * 24 * 60 * 60;

export type PaddleTransaction = {
  id: string;
  status: string;
  customer_id?: string | null;
  subscription_id?: string | null;
  billing_period?: { starts_at?: string; ends_at?: string } | null;
  items?: { price?: { id?: string } | null; price_id?: string }[];
};

export type Plan = "monthly" | "lifetime";

function apiBase(): string {
  return process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
    ? "https://sandbox-api.paddle.com"
    : "https://api.paddle.com";
}

async function paddleGet<T>(path: string): Promise<T | null> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    throw new Error("Payment verification unavailable");
  }
  const res = await fetch(`${apiBase()}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Payment provider unavailable (${res.status})`);
  }
  const json = await res.json();
  return (json?.data ?? null) as T | null;
}

export function fetchTransaction(transactionId: string): Promise<PaddleTransaction | null> {
  if (!/^txn_[a-z0-9]+$/i.test(transactionId)) return Promise.resolve(null);
  return paddleGet<PaddleTransaction>(`/transactions/${transactionId}`);
}

export async function fetchCustomerEmail(customerId: string): Promise<string | null> {
  const customer = await paddleGet<{ email?: string }>(`/customers/${customerId}`);
  return customer?.email?.trim().toLowerCase() ?? null;
}

/** Which NativeApply plan this transaction bought, or null if it's another product. */
export function planForTransaction(tx: PaddleTransaction): Plan | null {
  const priceIds = (tx.items ?? []).map((item) => item.price?.id ?? item.price_id ?? "");
  if (LIFETIME_PRICE_ID && priceIds.includes(LIFETIME_PRICE_ID)) return "lifetime";
  if (MONTHLY_PRICE_ID && priceIds.includes(MONTHLY_PRICE_ID)) return "monthly";
  return null;
}

type PaddleSubscription = {
  status?: string;
  current_billing_period?: { ends_at?: string } | null;
};

function isActive(sub: PaddleSubscription | null): boolean {
  return sub?.status === "active" || sub?.status === "past_due" || sub?.status === "trialing";
}

function toExpiry(endsAtIso: string | undefined): number {
  const endsAt = endsAtIso ? Date.parse(endsAtIso) : NaN;
  const base = Number.isFinite(endsAt)
    ? Math.floor(endsAt / 1000)
    : Math.floor(Date.now() / 1000) + MONTHLY_FALLBACK_SECONDS;
  return base + MONTHLY_GRACE_SECONDS;
}

async function monthlyExpiry(tx: PaddleTransaction): Promise<number> {
  // The subscription's current period is the source of truth (it already
  // reflects later renewals); the transaction's own period is the fallback.
  let endsAtIso = tx.billing_period?.ends_at;
  if (tx.subscription_id) {
    const sub = await paddleGet<PaddleSubscription>(`/subscriptions/${tx.subscription_id}`);
    if (isActive(sub) && sub?.current_billing_period?.ends_at) endsAtIso = sub.current_billing_period.ends_at;
  }
  return toExpiry(endsAtIso);
}

/**
 * For a monthly customer whose access key ran out: asks Paddle whether the
 * subscription is still active and, if so, extends access to the end of the
 * current paid period. Returns true when Pro was restored.
 */
export async function refreshMonthlyPro(email: string): Promise<boolean> {
  const subscriptionId = await getSubscriptionId(email);
  if (!subscriptionId) return false;
  const sub = await paddleGet<PaddleSubscription>(`/subscriptions/${subscriptionId}`);
  if (!sub) return false;
  if (!isActive(sub) || !sub.current_billing_period?.ends_at) {
    await clearSubscriptionId(email);
    return false;
  }
  const expiresAt = toExpiry(sub.current_billing_period.ends_at);
  if (expiresAt <= Math.floor(Date.now() / 1000)) return false;
  await grantMonthlyPro(email, subscriptionId, expiresAt);
  return true;
}

/**
 * Grants Pro for a completed NativeApply transaction and returns the buyer's
 * email, or null when the transaction isn't a completed NativeApply purchase.
 */
export async function grantProForTransaction(tx: PaddleTransaction): Promise<string | null> {
  if (tx.status !== "completed" && tx.status !== "paid") return null;
  const plan = planForTransaction(tx);
  if (!plan || !tx.customer_id) return null;

  const email = await fetchCustomerEmail(tx.customer_id);
  if (!email) return null;

  if (plan === "lifetime") {
    await grantLifetimePro(email, tx.id);
  } else {
    const expiresAt = await monthlyExpiry(tx);
    // An old renewal must not grant access that has already run out.
    if (expiresAt <= Math.floor(Date.now() / 1000)) return null;
    await grantMonthlyPro(email, tx.id, expiresAt);
    if (tx.subscription_id) await setSubscriptionId(email, tx.subscription_id);
  }
  return email;
}

/** Removes Pro that was granted by a transaction that was fully refunded or charged back. */
export async function revokeProForRefund(transactionId: string): Promise<void> {
  const tx = await fetchTransaction(transactionId);
  if (!tx || !planForTransaction(tx) || !tx.customer_id) return;
  const email = await fetchCustomerEmail(tx.customer_id);
  if (email) await revokeProForTransaction(email, tx.id);
}
