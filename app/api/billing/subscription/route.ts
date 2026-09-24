import { NextRequest, NextResponse } from "next/server";
import { BILLING_COOKIE, readBillingSession, listBillingSubscriptions, cancelBillingSubscription } from "@/lib/billing";
import { sessionSecret } from "@/lib/pro-cookie";
import { allowRecoveryAttempt, revokeMonthlyForSubscription, capMonthlyForSubscription } from "@/lib/redis";
import { RECOVERY_ORIGIN } from "@/lib/recovery";

const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
function identity(req: NextRequest) { return readBillingSession(req.cookies.get(BILLING_COOKIE)?.value || "", sessionSecret()); }
export async function GET(req: NextRequest) {
  try {
    const email = identity(req);
    if (!email) return reply({ error: "verify_email" }, 401);
    if (!await allowRecoveryAttempt("billing-read", email, 60)) return reply({ error: "too_many_requests" }, 429);
    return reply({ subscriptions: await listBillingSubscriptions(email, process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || "") });
  } catch { return reply({ error: "unavailable" }, 503); }
}
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== (process.env.NODE_ENV === "production" ? RECOVERY_ORIGIN : req.nextUrl.origin)) return reply({ error: "invalid_origin" }, 403);
  try {
    const email = identity(req);
    if (!email) return reply({ error: "verify_email" }, 401);
    let body;
    try { body = await req.json(); } catch { return reply({ error: "invalid_request" }, 400); }
    if (body?.confirmed !== true || typeof body.subscriptionId !== "string" || !/^sub_[a-z0-9]{26}$/.test(body.subscriptionId)) return reply({ error: "invalid_request" }, 400);
    if (!await allowRecoveryAttempt("billing-cancel", email, 20)) return reply({ error: "too_many_requests" }, 429);
    const subscription = await cancelBillingSubscription(email, body.subscriptionId, process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || "");
    // Payment cancellation is confirmed; a cache outage must not claim it failed.
    try {
      if (subscription.status === "canceled") await revokeMonthlyForSubscription(email, subscription.id);
      else if (subscription.cancellationScheduled && subscription.endsAt) {
        const end = Date.parse(subscription.endsAt);
        if (Number.isFinite(end)) await capMonthlyForSubscription(email, subscription.id, Math.floor(end / 1000));
      }
    } catch { console.error("na:billing: access cache reconciliation pending"); }
    return reply({ subscription });
  } catch { return reply({ error: "cancellation_not_confirmed" }, 503); }
}
