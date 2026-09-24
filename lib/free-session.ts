import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
export const FREE_COOKIE = "na_free_browser";
function signature(id: string, secret: string) { return createHmac("sha256", secret).update(`nativeapply:free:v1:${id}`).digest("base64url"); }
export function freeBrowserSession(value: string | undefined, secret: string) {
  if (!secret) throw new Error("Signing unavailable");
  const [id = "", sig = "", extra] = (value || "").split(".");
  if (/^[a-f0-9]{48}$/.test(id) && !extra) {
    const expected = Buffer.from(signature(id, secret)), supplied = Buffer.from(sig);
    if (expected.length === supplied.length && timingSafeEqual(expected, supplied)) return { id, value: value!, fresh: false };
  }
  const created = randomBytes(24).toString("hex");
  return { id: created, value: `${created}.${signature(created, secret)}`, fresh: true };
}
export const RESERVE_FREE_SCRIPT = "local current = redis.call('GET', KEYS[1]); if current then return 2 end; redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[2]); return 1";
export const REFUND_FREE_SCRIPT = "if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) end; return 0";
