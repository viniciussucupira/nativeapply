import { NextRequest, NextResponse } from "next/server";
import { PRO_COOKIE_NAME, PRO_COOKIE_MAX_AGE_SECONDS, createProSession, sessionSecret } from "@/lib/pro-cookie";
import { fetchTransaction, grantProForTransaction } from "@/lib/paddle";
import { allowRecoveryAttempt } from "@/lib/redis";
import { RECOVERY_ORIGIN } from "@/lib/recovery";
import { recoveryEmailReady } from "@/lib/recovery-email";

// A purchase code (txn_…) is printed on every receipt, and a receipt is
// forwarded, archived and searchable for years. So it logs a browser in only
// while the purchase is fresh — long enough to finish a checkout, retry after
// a dropped connection, or open the receipt on a phone the same day. After
// that, logging in is by a one-time link sent to the purchase email, which
// proves the inbox rather than possession of an old receipt. Without email
// login configured there is no other way in, so the code keeps working.
const RECENT_PURCHASE_MS = 24 * 60 * 60 * 1000;

// Called right after Paddle's checkout.completed event, and by the /login
// page. The transaction is always verified with Paddle's API, it must contain
// a NativeApply price, and the email always comes from Paddle — never from
// the client. The webhook stays an independent second source of truth.
export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== (process.env.NODE_ENV === "production" ? RECOVERY_ORIGIN : req.nextUrl.origin)) {
    return NextResponse.json({ error: "invalid_origin" }, { status: 403 });
  }
  let transactionId: unknown;
  try {
    ({ transactionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (typeof transactionId !== "string" || !/^txn_[a-z0-9]{26}$/.test(transactionId.trim())) {
    return NextResponse.json({ error: "missing_transaction_id" }, { status: 400 });
  }

  try {
  const secret = sessionSecret();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (!await allowRecoveryAttempt("purchase-confirm", ip, 60)) return NextResponse.json({ error: "too_many_requests" }, { status: 429 });
  const tx = await fetchTransaction(transactionId.trim());
  if (!tx) {
    return NextResponse.json({ error: "transaction_not_found" }, { status: 400 });
  }
  if (tx.status === "paid") {
    return NextResponse.json({ error: "activation_pending", message: "Your payment is still being processed. Please retry shortly; do not pay again." }, { status: 409 });
  }

  if (recoveryEmailReady()) {
    const paidAt = Date.parse(tx.billed_at || tx.created_at || "");
    if (!Number.isFinite(paidAt) || Date.now() - paidAt > RECENT_PURCHASE_MS) {
      return NextResponse.json({ error: "login_required", message: "Purchase codes work for 24 hours after payment. Log in with the email you used to pay." }, { status: 403, headers: { "Cache-Control": "private, no-store" } });
    }
  }

  const email = await grantProForTransaction(tx);
  if (!email) {
    return NextResponse.json({ error: "not_an_active_purchase" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "private, no-store" } });
  res.cookies.set(PRO_COOKIE_NAME, createProSession(email, secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: PRO_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
  } catch {
    return NextResponse.json({ error: "restore_unavailable", message: "We could not check your purchase. Please try again shortly." }, { status: 503 });
  }

}
