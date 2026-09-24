import { createHmac, timingSafeEqual } from "node:crypto";

export function verifyPaddleSignature(body: string, header: string | null, secret: string, now = Date.now()): boolean {
  if (!header || !secret) return false;
  const timestamps: string[] = [], signatures: string[] = [];
  for (const part of header.split(";")) {
    const [key, value] = part.trim().split("=");
    if (key === "ts") timestamps.push(value);
    if (key === "h1") signatures.push(value);
  }
  if (timestamps.length !== 1 || !/^\d+$/.test(timestamps[0])) return false;
  const ts = timestamps[0];
  if (Math.abs(now / 1000 - Number(ts)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${ts}:${body}`).digest();
  // Paddle can provide multiple signatures during secret rotation.
  return signatures.some(value => /^[a-f0-9]{64}$/i.test(value) && timingSafeEqual(expected, Buffer.from(value, "hex")));
}
