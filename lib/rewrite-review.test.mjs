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
