import assert from "node:assert/strict";
import { test } from "node:test";
import { textSharing, MAX_HANDOFF_URL } from "./text-sharing.ts";

test("email preserves paragraphs using RFC 6068 CRLF without duplicating returns", () => {
  const share = textSharing("Hello\n\nFirst\r\nSecond\rThird", "Cover letter");
  assert.equal(new URL(share.email).searchParams.get("body"), "Hello\r\n\r\nFirst\r\nSecond\r\nThird");
  assert.ok(share.email.includes("%0D%0A"));
});
test("sharing preserves edited text, unicode and punctuation without injecting recipients", () => {
  const text = "Edited: José & Zoë + 23% #ready?\n招聘 ✅", share = textSharing(text, "Message\nBcc: nobody");
  assert.equal(new URL(share.whatsapp).searchParams.get("text"), text);
  assert.equal(new URL(share.email).searchParams.get("body"), text.replaceAll("\n", "\r\n"));
  assert.equal(new URL(share.email).searchParams.has("bcc"), false);
  assert.equal(new URL(share.email).searchParams.get("subject").includes("\n"), false);
});
test("empty or erased results have no forwarding links", () => {
  for (const text of ["", " \n\t "]) assert.deepEqual(textSharing(text, "Message"), { email: null, whatsapp: null, tooLong: false });
});

test("malformed Unicode cannot crash the editable result or sharing links", () => {
  const text = "Hello \ud800 world \udfff 😀";
  const share = textSharing(text, "Draft \ud800");
  assert.equal(new URL(share.whatsapp).searchParams.get("text"), "Hello � world � 😀");
  assert.equal(new URL(share.email).searchParams.get("subject"), "Draft �");
  assert.equal(new URL(share.email).searchParams.get("body"), "Hello � world � 😀");
});
test("long results cannot silently become truncated application links", () => {
  for (const text of ["a".repeat(6000), "😀".repeat(400)]) {
    const share = textSharing(text, "Message");
    assert.equal(share.tooLong, true);
    assert.equal(share.email, null);
    assert.equal(share.whatsapp, null);
  }
  const share = textSharing("Short message", "Message");
  assert.equal(share.tooLong, false);
  assert.ok(share.email.length <= MAX_HANDOFF_URL && share.whatsapp.length <= MAX_HANDOFF_URL);
});
