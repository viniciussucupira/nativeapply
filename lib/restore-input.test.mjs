import assert from "node:assert/strict";
import { test } from "node:test";
import { parseRestoreInput } from "./restore-input.ts";
test("accepts a purchase code, copied code label or restore link", () => {
  const code = "txn_" + "a".repeat(26);
  for (const input of [code, ` ${code} `, code.slice(4), `Transaction ID: ${code}`, `https://nativeapply.net/restore?txn=${code}`]) assert.equal(parseRestoreInput(input), code);
});
test("rejects missing, incomplete, overlong and ambiguous codes", () => {
  for (const input of ["", "hello", "txn_abc", "txn_" + "a".repeat(27), `txn_${"a".repeat(26)} txn_${"b".repeat(26)}`]) assert.equal(parseRestoreInput(input), null);
});
