import assert from "node:assert/strict";
import { test } from "node:test";
import { createBillingSession, readBillingSession, cancelBillingSubscription, listBillingSubscriptions, billingSummary } from "./billing.ts";
import { createProSession } from "./pro-cookie.ts";

const email = "buyer@example.test", price = "pri_native", id = `sub_${"a".repeat(26)}`, customer = `ctm_${"b".repeat(26)}`;
test("an overdue billing period is never presented as guaranteed paid access", () => {
  const ends = "2026-10-24T12:00:00Z";
  const sub = { id, customer_id: customer, status: "active", current_billing_period: { ends_at: ends } };
  assert.equal(billingSummary(sub).paidAccessEndsAt, ends);
  for (const status of ["past_due", "paused", "trialing", "canceled"]) {
    assert.equal(billingSummary({ ...sub, status, scheduled_change: { action: "cancel", effective_at: ends } }).paidAccessEndsAt, null);
  }
});
function fixture(overrides = {}, options = {}) {
  let sub = { id, customer_id: customer, status: "active", current_billing_period: { ends_at: "2026-10-24T12:00:00Z" }, items: [{ price: { id: price } }], ...overrides };
  const writes = [];
  const request = async (path, body) => {
    if (body) {
      writes.push(body);
      if (!options.fail) sub = { ...sub, scheduled_change: { action: "cancel", effective_at: sub.current_billing_period.ends_at } };
      if (options.fail || options.timeout) throw new Error("Provider failure");
      return { data: sub };
    }
    if (path.startsWith("/customers?")) return { data: [{ id: customer, email: options.email || email }] };
    if (path.startsWith("/subscriptions?")) return { data: [sub] };
    if (path.startsWith("/customers/")) return { data: { email: options.email || email } };
    return { data: sub };
  };
  return { request, writes };
}
test("billing session is short lived, signed and separate from Pro access", () => {
  const now = 1700000000000, secret = "fixture";
  const token = createBillingSession(email, secret, now);
  assert.equal(readBillingSession(token, secret, now), email);
  assert.equal(readBillingSession(token, secret, now + 900000), null);
  assert.equal(readBillingSession(token, "wrong", now), null);
  assert.equal(readBillingSession(createProSession(email, secret, now), secret, now), null);
});
test("cancels at period end, reads back confirmation and handles repeated requests", async () => {
  const f = fixture();
  const result = await cancelBillingSubscription(email, id, price, f.request);
  assert.equal(result.cancellationScheduled, true);
  assert.equal(result.endsAt, "2026-10-24T12:00:00Z");
  assert.deepEqual(f.writes, [{ effective_from: "next_billing_period" }]);
  await cancelBillingSubscription(email, id, price, f.request);
  assert.equal(f.writes.length, 1);
});
test("never modifies another customer's or another product's subscription", async () => {
  for (const f of [fixture({}, { email: "other@example.test" }), fixture({ items: [{ price: { id: "other" } }] }), fixture({ items: [{ price: { id: price } }, { price: { id: "other" } }] })]) {
    await assert.rejects(cancelBillingSubscription(email, id, price, f.request));
    assert.equal(f.writes.length, 0);
    assert.deepEqual(await listBillingSubscriptions(email, price, f.request), []);
  }
});
test("provider failures never produce false confirmation; timeouts reconcile confirmed state", async () => {
  const failed = fixture({}, { fail: true });
  await assert.rejects(cancelBillingSubscription(email, id, price, failed.request), /not confirmed/);
  const timeout = fixture({}, { timeout: true });
  assert.equal((await cancelBillingSubscription(email, id, price, timeout.request)).cancellationScheduled, true);
});
test("paused subscriptions cancel immediately, canceled ones are not submitted again", async () => {
  const paused = fixture({ status: "paused" });
  await cancelBillingSubscription(email, id, price, paused.request);
  assert.deepEqual(paused.writes, [{ effective_from: "immediately" }]);
  const canceled = fixture({ status: "canceled" });
  assert.equal((await cancelBillingSubscription(email, id, price, canceled.request)).status, "canceled");
  assert.equal(canceled.writes.length, 0);
});
