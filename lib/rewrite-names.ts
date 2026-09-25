/** Protect recognizable legal company names from dialect spelling changes.
 * This is deliberately not a general named-entity detector: review is still needed.
 */
export function protectCompanyNames(text: string, nonce: string) {
  const names: { token: string; original: string }[] = [];
  const company = /\b[\p{Lu}][\p{L}\p{M}\d&'’.-]*(?:[ \t]+(?:[\p{Lu}][\p{L}\p{M}\d&'’.-]*|of|the|and|&)){0,7}[ \t]+(?:Ltd\.?|Limited|Inc\.?|Incorporated|LLC|LLP|PLC|Corp\.?|Corporation)(?![\p{L}\d])/gu;
  const protectedText = text.replace(company, (original) => {
    const token = `NATIVEAPPLY_NAME_${nonce}_${names.length}_END`;
    names.push({ token, original });
    return token;
  });
  return {
    text: protectedText,
    restore(rewritten: string) {
      let result = rewritten;
      for (const { token, original } of names) {
        // Missing or duplicated placeholders are not safe to show as a rewrite.
        if (result.split(token).length !== 2) throw new Error("company name preservation failed");
        result = result.replace(token, () => original);
      }
      return result;
    },
  };
}
