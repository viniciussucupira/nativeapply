import assert from "node:assert/strict";
import { test } from "node:test";
import { createHmac } from "node:crypto";
import { verifyPaddleSignature } from "./webhook-signature.ts";
const now = 1700000000000, ts = now / 1000, body = '{"event_type":"transaction.completed"}', secret = "fixture";
const sig = createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex");
test("accepts a valid Paddle signature in either position during secret rotation", () => {
  const other = "a".repeat(64);
  for (const values of [sig, `${sig};h1=${other}`, `${other};h1=${sig}`]) assert.equal(verifyPaddleSignature(body, `ts=${ts};h1=${values}`, secret, now), true);
});
test("rejects altered payloads, malformed signatures, old events and ambiguous timestamps", () => {
  assert.equal(verifyPaddleSignature(body + " ", `ts=${ts};h1=${sig}`, secret, now), false);
  assert.equal(verifyPaddleSignature(body, `ts=${ts};h1=${sig}`, secret, now + 301000), false);
  for (const header of [null, `ts=${ts};h1=invalid`, `ts=${ts};ts=${ts};h1=${sig}`, `ts=Infinity;h1=${sig}`]) assert.equal(verifyPaddleSignature(body, header, secret, now), false);
});
