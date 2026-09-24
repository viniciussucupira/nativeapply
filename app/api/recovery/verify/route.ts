import { NextRequest, NextResponse } from "next/server";
import { redeemRecovery, RECOVERY_ORIGIN } from "@/lib/recovery";
import { allowRecoveryAttempt, isPro, recoveryStore, billingRecoveryStore } from "@/lib/redis";
import { BILLING_COOKIE, BILLING_SESSION_SECONDS, createBillingSession } from "@/lib/billing";
import { restoreProByEmail } from "@/lib/paddle";
import { createProSession, PRO_COOKIE_MAX_AGE_SECONDS, PRO_COOKIE_NAME, sessionSecret } from "@/lib/pro-cookie";

export async function POST(req: NextRequest) {
  const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (req.headers.get("origin") !== (process.env.NODE_ENV === "production" ? RECOVERY_ORIGIN : req.nextUrl.origin)) return reply({ error: "invalid_origin" }, 403);
  let token: unknown;
  let purpose: unknown;
  try { ({ token, purpose } = await req.json()); } catch { return reply({ error: "invalid_link" }, 400); }
  try {
    const secret = sessionSecret();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (!await allowRecoveryAttempt("verify-ip", ip, 30)) return reply({ error: "too_many_requests" }, 429);
    const billing = purpose === "billing";
    const result = await redeemRecovery(token, billing ? billingRecoveryStore : recoveryStore, async (email) => billing || await isPro(email) || await restoreProByEmail(email));
    if (result.status === "invalid") return reply({ error: "invalid_link" }, 400);
    if (result.status === "inactive") return reply({ error: "no_active_purchase" }, 403);
    const response = reply({ ok: true });
    response.cookies.set(billing ? BILLING_COOKIE : PRO_COOKIE_NAME, billing ? createBillingSession(result.email, secret) : createProSession(result.email, secret), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: billing ? BILLING_SESSION_SECONDS : PRO_COOKIE_MAX_AGE_SECONDS,
    });
    return response;
  } catch { return reply({ error: "unavailable" }, 503); }
}
