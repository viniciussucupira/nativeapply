import { createHash, randomBytes } from "node:crypto";

export const RECOVERY_TTL = 15 * 60;
export const RECOVERY_ORIGIN = "https://nativeapply.net";

export function normalizeRecoveryEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : null;
}

export function recoveryHash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function validRecoveryToken(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

export type RecoveryStore = {
  put: (hash: string, email: string, ttl: number) => Promise<void>;
  read: (hash: string) => Promise<string | null>;
  consume: (hash: string) => Promise<string | null>;
  remove: (hash: string) => Promise<void>;
};

export async function issueRecovery(email: string, store: RecoveryStore, send: (email: string, url: string) => Promise<void>) {
  const token = randomBytes(32).toString("hex");
  const hash = recoveryHash(token);
  await store.put(hash, email, RECOVERY_TTL);
  try {
    // Fragment keeps the bearer token out of HTTP request URLs and referrers.
    await send(email, `${RECOVERY_ORIGIN}/restore/email#token=${token}`);
  } catch {
    await store.remove(hash);
    throw new Error("Recovery delivery unavailable");
  }
}

export async function redeemRecovery(token: unknown, store: RecoveryStore, entitled: (email: string) => Promise<boolean>) {
  if (!validRecoveryToken(token)) return { status: "invalid" as const };
  const hash = recoveryHash(token);
  const email = await store.read(hash);
  if (!email) return { status: "invalid" as const };
  // Keep the link usable if the purchase service is temporarily unavailable.
  const active = await entitled(email);
  // Atomic GETDEL: only one concurrent request may establish a session.
  if (await store.consume(hash) !== email) return { status: "invalid" as const };
  return active ? { status: "active" as const, email } : { status: "inactive" as const };
}
