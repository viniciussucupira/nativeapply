import { Redis } from "@upstash/redis";

// Reuses the SAME Upstash Redis instance as Retone (same env vars) —
// no new database needed. Keys are namespaced with "na:" so this product
// never reads or writes Retone's keys, and vice versa.
let redis: Redis | null = null;

function firstNonEmptyEnv(...names: string[]): string | undefined {
    for (const name of names) {
          const value = process.env[name];
          if (value && value.trim().length > 0) return value;
    }
    return undefined;
}

function getRedis(): Redis | null {
    // Prefer the KV_REST_API_* vars (auto-provisioned by the Vercel/Upstash
    // integration) since the plain UPSTASH_REDIS_REST_URL/TOKEN vars have
    // been empty in this project before — ?? doesn't fall through on "".
    const url = firstNonEmptyEnv(
          "UPSTASH_REDIS_REST_KV_REST_API_URL",
          "UPSTASH_REDIS_REST_URL"
        );
    const token = firstNonEmptyEnv(
          "UPSTASH_REDIS_REST_KV_REST_API_TOKEN",
          "UPSTASH_REDIS_REST_TOKEN"
        );
    if (!url || !token) return null;
    if (!redis) redis = new Redis({ url, token });
    return redis;
}

const DAY_SECONDS = 60 * 60 * 24;

/**
 * Increments today's rewrite count for this IP and returns the new count.
 * If Redis isn't configured (e.g. local dev), rate limiting is skipped
 * and this always returns 1 so the free limit never blocks local testing.
 */
export async function incrementDailyUsage(ip: string): Promise<number> {
    const client = getRedis();
    if (!client) {
          console.error("na:rate-limit: no Redis client (missing env vars)");
          return 1;
    }

    const key = `na:usage:${ip}:${new Date().toISOString().slice(0, 10)}`;
    try {
          const count = await client.incr(key);
          if (count === 1) {
                  await client.expire(key, DAY_SECONDS);
          }
          console.log(`na:rate-limit: ip=${ip} key=${key} count=${count}`);
          return count;
    } catch (err) {
          console.error(`na:rate-limit: incr failed for key=${key}`, err);
          // Fail closed: if we can't verify usage, don't silently grant unlimited free use.
          return Number.MAX_SAFE_INTEGER;
    }
}

export async function isPro(email: string): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  const value = await client.get(`na:pro:${email.toLowerCase()}`);
  return Boolean(value);
}

export async function setPro(email: string): Promise<void> {
  const client = getRedis();
  if (!client) return;
  await client.set(`na:pro:${email.toLowerCase()}`, "1");}export async function saveLeadEmail(email: string): Promise<boolean> {  const trimmed = email.trim().toLowerCase();  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return false;  const client = getRedis();  if (!client) return true;  try {    await client.sadd("na:captured_emails", trimmed);  } catch (err) {    console.error("na:leads: failed to save email", err);  }  return true; } const TOTAL_REWRITES_KEY = "na:stats:totalRewrites"; function toRewriteCount(value: unknown): number { const n = typeof value === "number" ? value : Number(value); return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0; } export async function getTotalRewrites(): Promise<number> { try { const client = getRedis(); if (!client) return 0; const value = await client.get(TOTAL_REWRITES_KEY); return toRewriteCount(value); } catch (error) { console.error("na:stats: failed to read total rewrites", error); return 0; } } export async function incrementTotalRewrites(): Promise<number> { try { const client = getRedis(); if (!client) return 0; return await client.incr(TOTAL_REWRITES_KEY); } catch (error) { console.error("na:stats: failed to increment total rewrites", error); return 0; }
}
