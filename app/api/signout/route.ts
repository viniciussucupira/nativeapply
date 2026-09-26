import { NextRequest, NextResponse } from "next/server";
import { PRO_COOKIE_NAME, readProSessionDetails, sessionSecret } from "@/lib/pro-cookie";
import { BILLING_COOKIE, readBillingSessionDetails } from "@/lib/billing";
import { sessionIsLive } from "@/lib/pro";
import { allowRecoveryAttempt, signOutEverywhere } from "@/lib/redis";
import { RECOVERY_ORIGIN } from "@/lib/recovery";

// Log out of this browser, or of every browser at once.
//
// "This device" removes the cookies here and needs nothing else. "All
// devices" records one timestamp for the address; every Pro or billing
// session issued before it is refused from then on, wherever it lives. Only
// someone holding a live session for that address may ask, and only from our
// own pages.
const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

function clear(response: NextResponse) {
  for (const name of [PRO_COOKIE_NAME, BILLING_COOKIE]) {
    response.cookies.set(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  }
  return response;
}

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== (process.env.NODE_ENV === "production" ? RECOVERY_ORIGIN : req.nextUrl.origin)) return reply({ error: "invalid_origin" }, 403);
  let everywhere = false;
  try { everywhere = (await req.json())?.everywhere === true; } catch { /* An empty body means this device only. */ }
  if (!everywhere) return clear(reply({ ok: true, everywhere: false }));

  try {
    const secret = sessionSecret();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (!await allowRecoveryAttempt("signout-ip", ip, 30)) return reply({ error: "too_many_requests" }, 429);
    const candidates = [
      readProSessionDetails(req.cookies.get(PRO_COOKIE_NAME)?.value || "", secret),
      readBillingSessionDetails(req.cookies.get(BILLING_COOKIE)?.value || "", secret),
    ];
    let email: string | null = null;
    for (const session of candidates) {
      if (session && await sessionIsLive(session)) { email = session.email; break; }
    }
    if (!email) return clear(reply({ error: "not_signed_in" }, 401));
    await signOutEverywhere(email);
    return clear(reply({ ok: true, everywhere: true }));
  } catch {
    return reply({ error: "unavailable" }, 503);
  }
}
