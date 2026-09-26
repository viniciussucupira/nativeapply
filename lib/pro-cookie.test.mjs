import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import { createProSession, readProSession, readProSessionDetails, PRO_COOKIE_MAX_AGE_SECONDS } from "./pro-cookie.ts";

const secret = "test-only-session-signing-secret";
const now = 1_700_000_000_000;

test("accepts a signed session and normalizes its email", () => {
  assert.equal(readProSession(createProSession(" Person@example.com ", secret, now), secret, now), "person@example.com");
});

test("rejects unsigned email cookies, tampering, wrong keys and expired sessions", () => {
  const token = createProSession("person@example.com", secret, now);
  const [, sig] = token.split(".");
  const fake = Buffer.from(JSON.stringify({ email: "other@example.com", expires: now })).toString("base64url");
  for (const value of ["person@example.com", "", `${fake}.${sig}`, `${token}.extra`, "x".repeat(3000)]) {
    assert.equal(readProSession(value, secret, now), null);
  }
  assert.equal(readProSession(token, "wrong-key", now), null);
  assert.equal(readProSession(token, secret, now + PRO_COOKIE_MAX_AGE_SECONDS * 1000), null);
  assert.equal(readProSession(token, "", now), null);
});

test("carries the moment it was issued, for signing out on all devices", () => {
  assert.deepEqual(readProSessionDetails(createProSession("person@example.com", secret, now), secret, now), { email: "person@example.com", issuedAt: now });
});

test("a session made before issue times existed still works and dates itself from its expiry", () => {
  const payload = Buffer.from(JSON.stringify({ email: "person@example.com", expires: Math.floor(now / 1000) + PRO_COOKIE_MAX_AGE_SECONDS })).toString("base64url");
  const legacy = `${payload}.${createHmac("sha256", secret).update(`nativeapply:pro:v1:${payload}`).digest("base64url")}`;
  assert.equal(readProSession(legacy, secret, now), "person@example.com");
  assert.deepEqual(readProSessionDetails(legacy, secret, now), { email: "person@example.com", issuedAt: Math.floor(now / 1000) * 1000 });
});
