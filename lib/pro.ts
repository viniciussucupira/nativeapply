import { cookies } from "next/headers";
import { PRO_COOKIE_NAME } from "./pro-cookie";
import { isPro as isProInRedis } from "./redis";
import { refreshMonthlyPro } from "./paddle";

/**
 * Reads the Pro cookie (set after a successful Paddle checkout or manual
 * activation) and confirms the email is actually marked Pro in Redis.
 * Never trust the cookie alone — Redis is the source of truth.
 */
export async function getProStatus(): Promise<{ pro: boolean; email: string | null }> {
  const cookieStore = await cookies();
  const email = cookieStore.get(PRO_COOKIE_NAME)?.value ?? null;
  if (!email) return { pro: false, email: null };

  let pro = await isProInRedis(email);
  if (!pro) {
    // Monthly access lapsed in Redis: confirm with Paddle before locking out
    // a customer whose renewal simply hasn't been recorded yet.
    try {
      pro = await refreshMonthlyPro(email);
    } catch (err) {
      console.error("na:pro: failed to refresh monthly subscription", err);
    }
  }
  return { pro, email };
}
