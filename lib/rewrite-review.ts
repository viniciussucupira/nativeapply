export const ENGLISH_VARIANTS = [
  { value: "en-US", label: "American English", instruction: "Use American English spelling and phrasing." },
  { value: "en-GB", label: "British English", instruction: "Use British English spelling and phrasing." },
] as const;

export type EnglishVariant = (typeof ENGLISH_VARIANTS)[number]["value"];

/** Compare digit-based expressions, including repetitions, signs and units.
 * This is deliberately a review aid, not a claim that all facts were verified.
 */
export function reviewNumbers(original: string, rewritten: string) {
  const currency = String.raw`(?:US\$|CA\$|C\$|AU\$|A\$|NZ\$|HK\$|S\$|R\$|\p{Sc}|(?:USD|CAD|AUD|NZD|HKD|SGD|BRL|GBP|EUR|CHF|JPY|CNY|INR|SEK|NOK|DKK|PLN|MXN|ZAR)(?![A-Za-z]))`;
  const magnitude = String.raw`(?:million|billion|thousand|k|m)\b`;
  const unit = String.raw`(?:years?|months?|weeks?|days?|hours?|minutes?|seconds?|hrs?|mins?|secs?|kg|km|cm|mm|miles?|pounds?|lbs?)\b`;
  const expression = new RegExp(String.raw`[-+−]?\s*(?:${currency}\s*)?[-+−]?\s*\d+(?:[.,:/-]\d+)*(?:\s*(?:%|${currency}|${magnitude}))?(?:\s*${unit})?`, "giu");
  const extract = (text: string) => (text.match(expression) ?? [])
    .map((value) => value.replace(/\s+/g, "").toLowerCase()).sort();
  const before = extract(original);
  const after = extract(rewritten);
  return {
    hasNumbers: before.length > 0 || after.length > 0,
    changed: before.length !== after.length || before.some((value, index) => value !== after[index]),
  };
}
