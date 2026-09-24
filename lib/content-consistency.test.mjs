import assert from "node:assert/strict";
import { test } from "node:test";
import { EXAMPLES } from "./examples.ts";
import { TOOL_PAGES } from "./tool-pages.ts";
import { DOC_TYPES, professionExample } from "./profession-content.ts";
import { PROFESSIONS } from "./professions.ts";
import { reviewNumbers } from "./rewrite-review.ts";

const plain = (text) => text.replace(/\[\[(?:cut|add):(.*?)\]\]/gs, "$1");

test("marketing examples preserve digit-based facts across all tool and profession pages", () => {
  const examples = [...EXAMPLES, ...Object.values(TOOL_PAGES).map((page) => page.example),
    ...PROFESSIONS.flatMap((profession) => Object.values(DOC_TYPES).map((doc) => professionExample(doc, profession)))];
  for (const example of examples) {
    assert.equal(reviewNumbers(plain(example.before), plain(example.after)).changed, false, example.caption);
  }
});

test("tool pages use a matching document example and valid related destinations", () => {
  for (const page of Object.values(TOOL_PAGES)) {
    assert.equal(page.context, page.example.context, page.slug);
    for (const related of page.related) assert.ok(TOOL_PAGES[related.href.slice(1)], related.href);
  }
});
