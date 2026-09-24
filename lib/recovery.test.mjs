import assert from "node:assert/strict";
import { test } from "node:test";
import { issueRecovery, redeemRecovery, normalizeRecoveryEmail, recoveryHash, RECOVERY_TTL } from "./recovery.ts";

function fixture() {
  let now = 0;
  const records = new Map();
  return {
    records, advance: () => { now += RECOVERY_TTL; },
    store: {
      async put(hash, email, ttl) { records.set(hash, { email, expires: now + ttl }); },
      async read(hash) { const item = records.get(hash); return item && item.expires > now ? item.email : null; },
      async consume(hash) { const item = records.get(hash); records.delete(hash); return item && item.expires > now ? item.email : null; },
      async remove(hash) { records.delete(hash); },
    },
  };
}

test("normalizes email and rejects malformed or oversized input", () => {
  assert.equal(normalizeRecoveryEmail(" Person@example.com "), "person@example.com");
  for (const input of [null, {}, "a@b", "a\nb@example.com", "<a>@example.com", "a".repeat(255) + "@example.com"]) assert.equal(normalizeRecoveryEmail(input), null);
});

test("delivers a fragment-only token, stores only its hash, and allows one concurrent redemption", async () => {
  const { store, records } = fixture();
  let token;
  await issueRecovery("paid@example.com", store, async (email, url) => {
    assert.equal(email, "paid@example.com");
    const parsed = new URL(url);
    assert.equal(parsed.origin, "https://nativeapply.net");
    assert.equal(parsed.search, "");
    token = new URLSearchParams(parsed.hash.slice(1)).get("token");
  });
  assert.equal(records.has(token), false);
  assert.equal(records.has(recoveryHash(token)), true);
  const results = await Promise.all([redeemRecovery(token, store, async () => true), redeemRecovery(token, store, async () => true)]);
  assert.deepEqual(results.map(r => r.status).sort(), ["active", "invalid"]);
});

test("expired, malformed and unpaid links never grant Pro", async () => {
  const fixture1 = fixture();
  let token;
  const send = async (_email, url) => { token = new URLSearchParams(new URL(url).hash.slice(1)).get("token"); };
  await issueRecovery("test@example.com", fixture1.store, send);
  fixture1.advance();
  assert.equal((await redeemRecovery(token, fixture1.store, async () => true)).status, "invalid");
  assert.equal((await redeemRecovery("invalid", fixture1.store, async () => true)).status, "invalid");
  await issueRecovery("test@example.com", fixture1.store, send);
  assert.equal((await redeemRecovery(token, fixture1.store, async () => false)).status, "inactive");
  assert.equal((await redeemRecovery(token, fixture1.store, async () => true)).status, "invalid");
});

test("delivery failure removes tokens; temporary entitlement failure preserves retry", async () => {
  const { store, records } = fixture();
  await assert.rejects(issueRecovery("test@example.com", store, async () => { throw new Error("provider failure"); }));
  assert.equal(records.size, 0);
  let token;
  await issueRecovery("test@example.com", store, async (_email, url) => { token = new URLSearchParams(new URL(url).hash.slice(1)).get("token"); });
  await assert.rejects(redeemRecovery(token, store, async () => { throw new Error("storage failure"); }));
  assert.equal((await redeemRecovery(token, store, async () => true)).status, "active");
});
