import { cookies } from "next/headers";
import { PRO_COOKIE_NAME, readProSession, sessionSecret } from "./pro-cookie";
import { isPro as isProInRedis } from "./redis";
import { refreshMonthlyPro } from "./paddle";

/**
 * Reads the Pro cookie (set after a successful Paddle checkout or manual
 * activation) and confirms the email is actually marked Pro in Redis.
 * Never trust the cookie alone — Redis is the source of truth.
 */
export async function getProStatus(): Promise<{ pro: boolean; email: string | null; needsRestore?: boolean }> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PRO_COOKIE_NAME)?.value;
  if (!raw) return { pro: false, email: null };
  const email = readProSession(raw, sessionSecret());
  // Older unsigned email cookies must be re-verified using a Paddle receipt.
  if (!email) return { pro: false, email: null, needsRestore: true };

  let pro = await isProInRedis(email);
  if (!pro) {
    // Monthly access lapsed in Redis: confirm with Paddle before locking out
    // a customer whose renewal simply hasn't been recorded yet.
    pro = await refreshMonthlyPro(email);
  }
  return { pro, email };
}
