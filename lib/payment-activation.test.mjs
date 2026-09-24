import assert from "node:assert/strict";
import { test } from "node:test";
import { activatePurchase } from "./payment-activation.ts";

test("activation survives a lost response and a pending payment without creating another payment", async () => {
  const calls = [], delays = [];
  const request = async (path, init) => {
    calls.push([path, JSON.parse(init.body)]);
    if (calls.length === 1) throw new TypeError("Connection lost after server success");
    return new Response(null, { status: calls.length === 2 ? 409 : 200 });
  };
  assert.equal(await activatePurchase("txn_fixture", request, async ms => delays.push(ms)), true);
  assert.equal(calls.length, 3);
  for (const call of calls) assert.deepEqual(call, ["/api/paddle/confirm", { transactionId: "txn_fixture" }]);
  assert.deepEqual(delays, [1500, 3000]);
});
test("activation retries temporary server failures but remains bounded", async () => {
  let calls = 0;
  assert.equal(await activatePurchase("txn_fixture", async () => { calls++; return new Response(null, { status: 502 }); }, async () => {}), false);
  assert.equal(calls, 3);
});
test("activation never retries rejected receipts or rate limits", async () => {
  for (const status of [400, 403, 429]) {
    let calls = 0;
    assert.equal(await activatePurchase("txn_fixture", async () => { calls++; return new Response(null, { status }); }, async () => {}), false);
    assert.equal(calls, 1);
  }
});
