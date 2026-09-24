import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { grantProForTransaction, revokeProForRefund, fetchTransaction, reconcileSubscription, planForTransaction, type PaddleTransaction } from "@/lib/paddle";

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const parts: Record<string, string> = {};
  for (const part of signatureHeader.split(";")) {
    const [k, v] = part.split("=");
    if (k && v) parts[k.trim()] = v.trim();
  }
  const { ts, h1 } = parts;
  if (!ts || !h1) return false;

  // Reject replays of old events (Paddle recommends a 5-second tolerance;
  // 5 minutes leaves room for clock skew and retries).
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(ageSeconds) || ageSeconds > 300) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${ts}:${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(h1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  const rawBody = await req.text();

  if (!secret) {
    // Fail closed: without a secret anyone could POST a fake purchase.
    return NextResponse.json({ error: "server_misconfigured" }, { status: 500 });
  }
  if (!verifySignature(rawBody, req.headers.get("paddle-signature"), secret)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let event: { event_type?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
    if (!event || typeof event !== "object" || typeof event.event_type !== "string" || !event.data || typeof event.data !== "object") throw new Error("Invalid event");
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    if (event.event_type === "transaction.completed" && event.data) {
      // Purchases of other Nimbus Labs products are ignored inside.
      const incoming = event.data as unknown as PaddleTransaction;
      if (planForTransaction(incoming)) {
        // Read current adjustments so a delayed completed event cannot restore a refund.
        const current = await fetchTransaction(incoming.id);
        if (!current) throw new Error("Transaction unavailable");
        await grantProForTransaction(current);
      }
    }

    if (
      (event.event_type === "adjustment.created" || event.event_type === "adjustment.updated") &&
      event.data
    ) {
      const adj = event.data as { action?: string; status?: string; type?: string; transaction_id?: string };
      if (["refund", "chargeback", "chargeback_reverse"].includes(adj.action || "") && adj.transaction_id) {
        await revokeProForRefund(adj.transaction_id);
      }
    }
    if (event.event_type?.startsWith("subscription.") && typeof event.data?.id === "string") {
      await reconcileSubscription(event.data.id);
    }
  } catch (err) {
    console.error("na:webhook: failed to process event", event.event_type, err);
    // 500 makes Paddle retry the event later.
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
