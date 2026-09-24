import { NextRequest, NextResponse } from "next/server";
import { PRO_COOKIE_NAME, PRO_COOKIE_MAX_AGE_SECONDS, createProSession, sessionSecret } from "@/lib/pro-cookie";
import { fetchTransaction, grantProForTransaction } from "@/lib/paddle";

// Called right after Paddle's checkout.completed event, and by the /restore
// page. The transaction is always verified with Paddle's API, it must contain
// a NativeApply price, and the email always comes from Paddle — never from
// the client. The webhook stays an independent second source of truth.
export async function POST(req: NextRequest) {
  let transactionId: unknown;
  try {
    ({ transactionId } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }
  if (!transactionId || typeof transactionId !== "string") {
    return NextResponse.json({ error: "missing_transaction_id" }, { status: 400 });
  }

  try {
  const secret = sessionSecret();
  const tx = await fetchTransaction(transactionId.trim());
  if (!tx) {
    return NextResponse.json({ error: "transaction_not_found" }, { status: 400 });
  }

  const email = await grantProForTransaction(tx);
  if (!email) {
    return NextResponse.json({ error: "not_an_active_purchase" }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PRO_COOKIE_NAME, createProSession(email, secret), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: PRO_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
  } catch {
    return NextResponse.json({ error: "restore_unavailable", message: "We could not check your purchase. Please try again shortly." }, { status: 503 });
  }
}
