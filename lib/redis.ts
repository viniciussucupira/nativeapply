import { Redis } from "@upstash/redis";

// Reuses the SAME Upstash Redis instance as Retone (same env vars) —
// no new database needed. Keys are namespaced with "na:" so this product
// never reads or writes Retone's keys, and vice versa.
let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url =
        process.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
    const token =
          process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
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
  if (!client) return 1;

  const key = `na:usage:${ip}:${new Date().toISOString().slice(0, 10)}`;
  const count = await client.incr(key);
  if (count === 1) {
    await client.expire(key, DAY_SECONDS);
  }
  return count;
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
  await client.set(`na:pro:${email.toLowerCase()}`, "1");
}
