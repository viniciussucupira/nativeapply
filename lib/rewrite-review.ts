export const ENGLISH_VARIANTS = [
  { value: "en-US", label: "American English", instruction: "Use American English spelling and phrasing." },
  { value: "en-GB", label: "British English", instruction: "Use British English spelling and phrasing." },
] as const;

export type EnglishVariant = (typeof ENGLISH_VARIANTS)[number]["value"];

/** Compare digit-based expressions, including repetitions, signs and units.
 * This is deliberately a review aid, not a claim that all facts were verified.
 */
export function reviewNumbers(original: string, rewritten: string) {
  const extract = (text: string) => (text.match(/[-+−]?(?:[$£€]\s*)?\d+(?:[.,:/-]\d+)*(?:\s*(?:%|USD|GBP|EUR|million|billion|thousand|k\b|m\b))?/gi) ?? [])
    .map((value) => value.replace(/\s+/g, "").toLowerCase()).sort();
  const before = extract(original);
  const after = extract(rewritten);
  return {
    hasNumbers: before.length > 0 || after.length > 0,
    changed: before.length !== after.length || before.some((value, index) => value !== after[index]),
  };
}
