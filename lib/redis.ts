import { Redis } from "@upstash/redis";

// Reuses the SAME Upstash Redis instance as Retone. Every key this product
// touches is namespaced with "na:" so it never collides with other products.
let redis: Redis | null = null;

function firstNonEmptyEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim().length > 0) return value;
  }
  return undefined;
}

function getRedis(): Redis | null {
  // Prefer the vars auto-provisioned by the Vercel/Upstash integration; the
  // plain UPSTASH_REDIS_REST_* vars have been empty in this project before.
  const url = firstNonEmptyEnv("UPSTASH_REDIS_REST_KV_REST_API_URL", "UPSTASH_REDIS_REST_URL");
  const token = firstNonEmptyEnv("UPSTASH_REDIS_REST_KV_REST_API_TOKEN", "UPSTASH_REDIS_REST_TOKEN");
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

const DAY_SECONDS = 60 * 60 * 24;

/** Returned by incrementDailyUsage when the count could not be read at all. */
export const USAGE_UNVERIFIABLE = -1;

function usageKey(ip: string): string {
  return `na:usage:${ip}:${new Date().toISOString().slice(0, 10)}`;
}

/**
 * Increments today's free-rewrite count for this IP and returns the new count.
 * Without Redis (local dev) it always returns 1 so testing is never blocked.
 */
export async function incrementDailyUsage(ip: string): Promise<number> {
  const client = getRedis();
  if (!client) {
    console.error("na:rate-limit: no Redis client (missing env vars)");
    return 1;
  }
  const key = usageKey(ip);
  try {
    const count = await client.incr(key);
    if (count === 1) await client.expire(key, DAY_SECONDS);
    return count;
  } catch (err) {
    console.error(`na:rate-limit: incr failed for key=${key}`, err);
    // Fail closed, but distinguishably: -1 means "we could not check", which
    // is our problem, not the visitor's. Telling them they have used up a
    // rewrite they never got would be a lie, so the route says what happened.
    return USAGE_UNVERIFIABLE;
  }
}

/** Gives back a free rewrite that was counted but never delivered (AI error). */
export async function refundDailyUsage(ip: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  try {
    await client.decr(usageKey(ip));
  } catch (err) {
    console.error("na:rate-limit: decr failed", err);
  }
}

// ---------------------------------------------------------------------------
// Pro access
//
// Value stored at na:pro:<email>:
//   "lifetime:<txn_id>"  — one-time Lifetime purchase, no expiry
//   "monthly:<txn_id>"   — monthly subscription, expires at the end of the
//                          paid billing period (+ grace). Every renewal
//                          (transaction.completed) pushes the expiry forward,
//                          so a cancelled subscription lapses on its own.
//   "1"                  — legacy value written before this scheme existed
// ---------------------------------------------------------------------------

function proKey(email: string): string {
  return `na:pro:${email.trim().toLowerCase()}`;
}

export async function isPro(email: string): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  const value = await client.get(proKey(email));
  return Boolean(value);
}

export async function grantLifetimePro(email: string, transactionId: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.set(proKey(email), `lifetime:${transactionId}`);
}

export async function grantMonthlyPro(
  email: string,
  transactionId: string,
  expiresAtSeconds: number
): Promise<void> {
  const client = getRedis();
  if (!client) return;
  const current = await client.get<string>(proKey(email));
  // Never downgrade a Lifetime customer to an expiring key.
  if (typeof current === "string" && current.startsWith("lifetime:")) return;
  await client.set(proKey(email), `monthly:${transactionId}`, { exat: expiresAtSeconds });
}

// Remembers which Paddle subscription a monthly customer has, so access can
// be re-checked with Paddle even if a renewal webhook never arrives.
export async function setSubscriptionId(email: string, subscriptionId: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.set(`na:sub:${email.trim().toLowerCase()}`, subscriptionId);
}

export async function getSubscriptionId(email: string): Promise<string | null> {
  const client = getRedis();
  if (!client) return null;
  const value = await client.get<string>(`na:sub:${email.trim().toLowerCase()}`);
  return typeof value === "string" && value ? value : null;
}

export async function clearSubscriptionId(email: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.del(`na:sub:${email.trim().toLowerCase()}`);
}

/** Revokes Pro only if it was granted by this exact transaction (refund/chargeback). */
export async function revokeProForTransaction(email: string, transactionId: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  const current = await client.get<string>(proKey(email));
  if (typeof current === "string" && current.endsWith(`:${transactionId}`)) {
    await client.del(proKey(email));
  }
}

// ---------------------------------------------------------------------------
// Leads and stats
// ---------------------------------------------------------------------------

export async function saveLeadEmail(email: string): Promise<boolean> {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return false;
  const client = getRedis();
  if (!client) return true;
  try {
    await client.sadd("na:captured_emails", trimmed);
  } catch (err) {
    console.error("na:leads: failed to save email", err);
  }
  return true;
}

const TOTAL_REWRITES_KEY = "na:stats:totalRewrites";

function toRewriteCount(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export async function getTotalRewrites(): Promise<number> {
  try {
    const client = getRedis();
    if (!client) return 0;
    return toRewriteCount(await client.get(TOTAL_REWRITES_KEY));
  } catch (error) {
    console.error("na:stats: failed to read total rewrites", error);
    return 0;
  }
}

export async function incrementTotalRewrites(): Promise<number> {
  try {
    const client = getRedis();
    if (!client) return 0;
    return await client.incr(TOTAL_REWRITES_KEY);
  } catch (error) {
    console.error("na:stats: failed to increment total rewrites", error);
    return 0;
  }
}
