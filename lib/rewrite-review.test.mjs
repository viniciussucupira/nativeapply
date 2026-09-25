import assert from "node:assert/strict";
import { test } from "node:test";
import { reviewNumbers } from "./rewrite-review.ts";

test("allows reordering without claiming to verify meaning", () => {
  assert.deepEqual(reviewNumbers("In 2024 I cut costs by 23% for 12 people", "For 12 people, cut costs by 23% in 2024"), { hasNumbers: true, changed: false });
});

test("flags altered, added, removed, spelled-out, repeated and reformatted numbers", () => {
  for (const [before, after] of [
    ["23%", "32%"], ["No metrics", "10 clients"], ["6 years", "six years"],
    ["2024 and 2024", "2024"], ["$1,200", "$1200"], ["12/04/2024", "04/12/2024"],
    ["-23%", "23%"], ["23%", "23"], ["$14", "€14"], ["2 million", "2 billion"],
  ]) assert.equal(reviewNumbers(before, after).changed, true, `${before} -> ${after}`);
});

test("recognizes no digit-based expressions and tolerates spacing around units", () => {
  assert.deepEqual(reviewNumbers("Hello Sarah", "Hi Sarah"), { hasNumbers: false, changed: false });
  assert.deepEqual(reviewNumbers("$ 14 and 23 %", "$14 and 23%"), { hasNumbers: true, changed: false });
});

test("flags changes to currencies, time and measurement units", () => {
  for (const [before, after] of [
    ["R$ 15000", "US$ 15000"], ["CAD 500", "USD 500"],
    ["A$ 20", "C$ 20"], ["₹500", "$500"], ["BRL 20", "20"],
    ["R$ -50", "R$ 50"], ["500 CHF", "500 EUR"],
    ["20 hours", "20 years"], ["5 months", "5 years"],
    ["2 kg", "2 pounds"], ["10 km", "10 miles"], ["7 days", "7"],
  ]) assert.equal(reviewNumbers(before, after).changed, true, `${before} -> ${after}`);
  assert.equal(reviewNumbers("R$ -50 and CAD 500", "CAD500 and R$-50").changed, false);
  assert.equal(reviewNumbers("5 years and 20 hours", "20 hours and 5 years").changed, false);
});
