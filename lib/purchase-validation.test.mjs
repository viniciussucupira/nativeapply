import assert from "node:assert/strict";
import { test } from "node:test";
import { purchasePlan, purchaseRefunded, paidMonthlyExpiry } from "./purchase-validation.ts";

const now = Date.parse("2026-09-24T12:00:00Z");
const end = "2026-10-24T12:00:00Z";
const tx = { id: "txn_test", status: "completed", customer_id: "ctm_test", subscription_id: "sub_test", items: [{ price: { id: "monthly" } }], billing_period: { ends_at: end }, details: { totals: { total: "1900" } } };
const sub = { id: "sub_test", customer_id: "ctm_test", status: "active", items: [{ price: { id: "monthly" } }] };
test("only configured NativeApply prices unlock access, including grandfathered lifetime", () => {
  assert.equal(purchasePlan(tx, "monthly", "lifetime"), "monthly");
  assert.equal(purchasePlan(tx, "", ""), null);
  assert.equal(purchasePlan({ ...tx, items: [{ price_id: "another-product" }] }, "monthly", "lifetime"), null);
  assert.equal(purchasePlan({ ...tx, items: [{ price_id: "lifetime" }] }, "monthly", "lifetime"), "lifetime");
});
test("full approved refunds and chargebacks block completed purchases", () => {
  for (const a of [{ action: "refund", type: "full" }, { action: "chargeback", type: "partial" }]) {
    assert.equal(purchaseRefunded({ ...tx, adjustments: [{ ...a, status: "approved" }] }), true);
  }
});
test("partial refunds revoke only when their approved total reaches the full payment", () => {
  const refund = amount => ({ action: "refund", type: "partial", status: "approved", totals: { total: amount } });
  assert.equal(purchaseRefunded({ ...tx, adjustments: [refund("900")] }), false);
  assert.equal(purchaseRefunded({ ...tx, adjustments: [refund("900"), refund("1000")] }), true);
  assert.equal(purchaseRefunded({ ...tx, adjustments: [refund("900"), { ...refund("1000"), status: "rejected" }] }), false);
});
test("pending, rejected and reversed adjustments never revoke access", () => {
  for (const status of ["pending_approval", "rejected", "reversed"]) {
    assert.equal(purchaseRefunded({ ...tx, adjustments: [{ action: "chargeback", type: "full", status }] }), false);
  }
  assert.equal(purchaseRefunded({ ...tx, adjustments: null }), false);
});
test("active access uses the transaction's paid period, not an invented renewal", () => {
  assert.equal(paidMonthlyExpiry(tx, sub, "monthly", now), Date.parse(end) / 1000);
  assert.equal(paidMonthlyExpiry({ ...tx, billing_period: null }, sub, "monthly", now), null);
  assert.equal(paidMonthlyExpiry({ ...tx, billing_period: { ends_at: "2026-09-23T12:00:00Z" } }, sub, "monthly", now), null);
});
test("only overdue renewals receive a bounded three-day retry grace period", () => {
  const overdue = { ...tx, billing_period: { ends_at: "2026-09-23T12:00:00Z" } };
  assert.equal(paidMonthlyExpiry(overdue, { ...sub, status: "past_due" }, "monthly", now), Date.parse("2026-09-26T12:00:00Z") / 1000);
  assert.equal(paidMonthlyExpiry(overdue, { ...sub, status: "past_due" }, "monthly", now + 3 * 86400000), null);
});
test("cancellation or pause ends access at the confirmed date without renewal grace", () => {
  for (const action of ["cancel", "pause"]) {
    const stopping = { ...sub, status: "past_due", scheduled_change: { action, effective_at: end } };
    assert.equal(paidMonthlyExpiry(tx, stopping, "monthly", now), Date.parse(end) / 1000);
    assert.equal(paidMonthlyExpiry(tx, stopping, "monthly", Date.parse(end)), null);
    assert.equal(paidMonthlyExpiry(tx, { ...stopping, scheduled_change: { action } }, "monthly", now), null);
  }
});
test("unrelated, missing, paused or canceled subscriptions cannot grant access", () => {
  for (const invalid of [null, { ...sub, id: "other" }, { ...sub, customer_id: "other" }, { ...sub, items: [] }, { ...sub, status: "paused" }, { ...sub, status: "canceled" }]) {
    assert.equal(paidMonthlyExpiry(tx, invalid, "monthly", now), null);
  }
});
