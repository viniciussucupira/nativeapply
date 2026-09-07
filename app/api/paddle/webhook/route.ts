import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { setPro } from "@/lib/redis";

// Same verification + "fetch email by customer id" pattern used for Retone,
// because Paddle's transaction.completed event includes customer_id but not
// the customer's email — a second API call is required to resolve it.

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(";").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    })
  );
  const ts = parts.ts;
  const h1 = parts.h1;
  if (!ts || !h1) return false;

  const signedPayload = `${ts}:${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
}

async function fetchCustomerEmail(customerId: string): Promise<string | null> {
  const apiKey = process.env.PADDLE_API_KEY;
  if (!apiKey) return null;

  const paddleApiBase =
    process.env.NEXT_PUBLIC_PADDLE_ENV === "sandbox"
      ? "https://sandbox-api.paddle.com"
      : "https://api.paddle.com";

  const res = await fetch(`${paddleApiBase}/customers/${customerId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data?.email ?? null;
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  const rawBody = await req.text();

  if (secret) {
    const signatureHeader = req.headers.get("paddle-signature");
    const valid = verifySignature(rawBody, signatureHeader, secret);
    if (!valid) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(rawBody);

  if (event.event_type === "transaction.completed") {
    const customerId = event.data?.customer_id;
    if (customerId) {
      const email = await fetchCustomerEmail(customerId);
      if (email) {
        await setPro(email);
      }
    }
  }

  return NextResponse.json({ received: true });
}
