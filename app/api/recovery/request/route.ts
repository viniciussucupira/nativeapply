import { NextRequest, NextResponse } from "next/server";
import { issueRecovery, normalizeRecoveryEmail, RECOVERY_ORIGIN } from "@/lib/recovery";
import { recoveryEmailReady, sendRecoveryEmail } from "@/lib/recovery-email";
import { allowRecoveryAttempt, recoveryStore } from "@/lib/redis";
import { sessionSecret } from "@/lib/pro-cookie";

export async function POST(req: NextRequest) {
  const reply = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (req.headers.get("origin") !== (process.env.NODE_ENV === "production" ? RECOVERY_ORIGIN : req.nextUrl.origin)) return reply({ error: "invalid_origin" }, 403);
  if (!recoveryEmailReady()) return reply({ error: "unavailable" }, 503);
  let email: string | null;
  try { email = normalizeRecoveryEmail((await req.json()).email); } catch { return reply({ error: "invalid_email" }, 400); }
  if (!email) return reply({ error: "invalid_email" }, 400);
  try {
    sessionSecret();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (!await allowRecoveryAttempt("request-ip", ip, 10) || !await allowRecoveryAttempt("request-email", email, 3) || !await allowRecoveryAttempt("request-global", "all", 100)) return reply({ error: "too_many_requests" }, 429);
    // Same delivery and response regardless of purchase status; no account enumeration.
    await issueRecovery(email, recoveryStore, sendRecoveryEmail);
    return reply({ ok: true });
  } catch {
    return reply({ error: "unavailable" }, 503);
  }
}
