import { NextRequest, NextResponse } from "next/server";
import { BILLING_COOKIE, readBillingSession } from "@/lib/billing";
import { getRefundView, requestFirstPaymentRefund } from "@/lib/refunds";
import { refundIntentStore, allowRecoveryAttempt } from "@/lib/redis";
import { sessionSecret } from "@/lib/pro-cookie";
import { RECOVERY_ORIGIN } from "@/lib/recovery";
import { revokeProForRefund } from "@/lib/paddle";

const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });
function identity(req: NextRequest) { return readBillingSession(req.cookies.get(BILLING_COOKIE)?.value || "", sessionSecret()); }
export async function GET(req: NextRequest) {
  try {
    const email = identity(req);
    if (!email) return reply({ error: "verify_email" }, 401);
    if (!await allowRecoveryAttempt("refund-read", email, 30)) return reply({ error: "too_many_requests" }, 429);
    return reply({ refund: await getRefundView(email, process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || "", refundIntentStore) });
  } catch { return reply({ error: "unavailable" }, 503); }
}
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== (process.env.NODE_ENV === "production" ? RECOVERY_ORIGIN : req.nextUrl.origin)) return reply({ error: "invalid_origin" }, 403);
  try {
    const email = identity(req);
    if (!email) return reply({ error: "verify_email" }, 401);
    let body;
    try { body = await req.json(); } catch { return reply({ error: "invalid_request" }, 400); }
    if (body?.confirmRefundAndCancellation !== true || typeof body.transactionId !== "string" || !/^txn_[a-z0-9]{26}$/.test(body.transactionId)) return reply({ error: "invalid_request" }, 400);
    if (!await allowRecoveryAttempt("refund-write", email, 10)) return reply({ error: "too_many_requests" }, 429);
    const refund = await requestFirstPaymentRefund(email, body.transactionId, process.env.NEXT_PUBLIC_PADDLE_PRICE_ID || "", refundIntentStore);
    if (refund.state === "approved") {
      try { await revokeProForRefund(body.transactionId); }
      catch { console.error("na:refund: access reconciliation pending"); }
    }
    return reply({ refund });
  } catch { return reply({ error: "refund_not_confirmed" }, 503); }
}
