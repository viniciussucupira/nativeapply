import { createHmac, timingSafeEqual } from "node:crypto";

export const PRO_COOKIE_NAME = "na_pro_email";

export const PRO_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

export function sessionSecret(): string {
  const secret = process.env.PRO_SESSION_SECRET || process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Pro session signing is not configured");
  return secret;
}

function signature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(`nativeapply:pro:v1:${payload}`).digest("base64url");
}

export function createProSession(email: string, secret: string, now = Date.now()): string {
  if (!secret) throw new Error("Session secret required");
  const payload = Buffer.from(JSON.stringify({ email: email.trim().toLowerCase(), expires: Math.floor(now / 1000) + PRO_COOKIE_MAX_AGE_SECONDS })).toString("base64url");
  return `${payload}.${signature(payload, secret)}`;
}

export function readProSession(value: string, secret: string, now = Date.now()): string | null {
  if (!secret || value.length > 2048) return null;
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [payload, supplied] = parts;
  const expected = Buffer.from(signature(payload, secret));
  const actual = Buffer.from(supplied);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof data?.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
      typeof data.expires === "number" && data.expires > Math.floor(now / 1000) ? data.email : null;
  } catch {
    return null;
  }
}
