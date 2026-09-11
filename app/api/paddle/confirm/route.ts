import { NextRequest, NextResponse } from "next/server";
import { PRO_COOKIE_NAME, PRO_COOKIE_MAX_AGE_SECONDS } from "@/lib/pro-cookie";
import { setPro } from "@/lib/redis";

// Called from the client right after Paddle's checkout.completed event fires,
// so the Pro cookie is set immediately without waiting for the webhook.
// SECURITY: this route used to trust a bare client-supplied email, which let
// anyone grant themselves Pro with a POST request and no payment at all. It
// now verifies the transaction directly with Paddle's API before granting
// Pro, and the email always comes from Paddle's own response, never from
// the client. The webhook (app/api/paddle/webhook) remains a second,
// independent source of truth in Redis.
export async function POST(req: NextRequest) {
  const { transactionId } = await req.json();
  if (!transactionId || typeof transactionId !== "string") {
    return NextResponse.json({ error: "missing_transaction_id" }, { status: 400 });
  }

const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }

const paddleApiBase =
  process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
  ? "https://sandbox-api.paddle.com"
  : "https://api.paddle.com";

const txRes = await fetch(`${paddleApiBase}/transactions/${transactionId}`, {
  headers: { Authorization: `Bearer ${apiKey}` },
});
  if (!txRes.ok) {
    return NextResponse.json({ error: "transaction_not_found" }, { status: 400 });
  }
  const txJson = await txRes.json();
  const tx = txJson?.data;
  if (!tx || tx.status !== "completed") {
    return NextResponse.json({ error: "transaction_not_completed" }, { status: 400 });
  }

const customerId = tx.customer_id;
  if (!customerId) {
    return NextResponse.json({ error: "no_customer_id" }, { status: 400 });
  }

const custRes = await fetch(`${paddleApiBase}/customers/${customerId}`, {
  headers: { Authorization: `Bearer ${apiKey}` },
});
  if (!custRes.ok) {
    return NextResponse.json({ error: "customer_lookup_failed" }, { status: 400 });
  }
  const custJson = await custRes.json();
  const email: string | undefined = custJson?.data?.email;
  if (!email) {
    return NextResponse.json({ error: "no_customer_email" }, { status: 400 });
  }

await setPro(email);

const res = NextResponse.json({ ok: true });
  res.cookies.set(PRO_COOKIE_NAME, email.toLowerCase(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: PRO_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });
  return res;
}
