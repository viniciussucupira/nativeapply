import assert from "node:assert/strict";
import { test } from "node:test";
import { createAccessCache } from "./access-cache.ts";
const free = { pro: false, needsRestore: false }, paid = { pro: true, needsRestore: false };
test("access is shared in flight and expires instead of remaining stale for the whole visit", async () => {
  let now = 0, calls = 0;
  const cache = createAccessCache(async () => { calls++; return calls === 1 ? free : paid; }, () => now);
  assert.equal(cache.get(), cache.get());
  assert.deepEqual(await cache.get(), free);
  now = 30001;
  assert.deepEqual(await cache.get(), paid);
  assert.equal(calls, 2);
});
test("temporary access failure is retried after a short cooldown", async () => {
  let now = 0, calls = 0;
  const cache = createAccessCache(async () => { if (++calls === 1) throw new Error(); return paid; }, () => now);
  assert.equal((await cache.get()).unavailable, true);
  now = 3001;
  assert.deepEqual(await cache.get(), paid);
});
test("a stale response cannot replace the cache after an access refresh", async () => {
  let complete, calls = 0;
  const cache = createAccessCache(() => ++calls === 1 ? new Promise(resolve => { complete = resolve; }) : Promise.resolve(paid));
  const old = cache.get(); cache.invalidate();
  assert.deepEqual(await cache.get(), paid);
  complete(free); await old;
  assert.deepEqual(await cache.get(), paid);
  assert.equal(calls, 2);
});
