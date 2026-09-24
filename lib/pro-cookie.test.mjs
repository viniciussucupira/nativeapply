import assert from "node:assert/strict";
import { test } from "node:test";
import { createProSession, readProSession, PRO_COOKIE_MAX_AGE_SECONDS } from "./pro-cookie.ts";

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
