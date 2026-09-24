/** Extract one unambiguous purchase code from a code or restore link. */
export function parseRestoreInput(value: string): string | null {
  const input = value.trim();
  if (/^[a-z0-9]{26}$/i.test(input)) return `txn_${input.toLowerCase()}`;
  const codes = [...new Set((input.match(/(?<![a-z0-9])txn_[a-z0-9]{26}(?![a-z0-9])/gi) ?? []).map((code) => code.toLowerCase()))];
  return codes.length === 1 ? codes[0] : null;
}
