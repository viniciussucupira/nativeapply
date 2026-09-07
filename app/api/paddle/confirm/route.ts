import { NextRequest, NextResponse } from "next/server";
import { PRO_COOKIE_NAME, PRO_COOKIE_MAX_AGE_SECONDS } from "@/lib/pro-cookie";
import { setPro } from "@/lib/redis";

// Called from the client right after Paddle's checkout.completed event fires,
// so the Pro cookie is set immediately without waiting for the webhook.
// The webhook (app/api/paddle/webhook) remains the source of truth in Redis
// and is what actually unlocks Pro server-side — this route only sets the
// cookie for a fast client-side experience.
export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "missing_email" }, { status: 400 });
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
