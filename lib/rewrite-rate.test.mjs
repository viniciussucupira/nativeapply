import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import vm from "node:vm";
import ts from "typescript";
import * as constants from "./constants.ts";
import { protectCompanyNames } from "./rewrite-names.ts";

const source = ts.transpileModule(readFileSync(new URL("../app/api/rewrite/route.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function fixture({ outage = false } = {}) {
  let email = "buyer@example.test", calls = 0, freeReservations = 0;
  const counts = new Map(), limits = [], exports = {};
  class Anthropic {
    static APIError = Error;
    messages = { create: async () => { calls++; return { content: [{ type: "text", text: "Edited draft." }], usage: {}, stop_reason: "end_turn" }; } };
  }
  const json = (body, init) => { const result = Response.json(body, init); result.cookies = { set() {} }; return result; };
  const modules = {
    "node:crypto": { randomBytes },
    "next/server": { NextResponse: { json } },
    "@anthropic-ai/sdk": { default: Anthropic },
    "@/lib/constants": constants,
    "@/lib/free-session": { FREE_COOKIE: "free", freeBrowserSession: () => ({ id: "fixture", fresh: false }) },
    "@/lib/pro-cookie": { sessionSecret: () => "fixture" },
    "@/lib/pro": { getProStatus: async () => ({ pro: true, email }) },
    "@/lib/rewrite-review": { ENGLISH_VARIANTS: [{ value: "en-US", instruction: "American English" }] },
    "@/lib/ai-cost": { REWRITE_MODEL: "fixture" },
    "@/lib/rewrite-names": { protectCompanyNames },
    "@/lib/redis": {
      allowRecoveryAttempt: async (scope, identity, limit, seconds) => {
        limits.push({ scope, identity, limit, seconds });
        if (outage) throw Error("Storage unavailable");
        const key = scope + identity, n = (counts.get(key) || 0) + 1; counts.set(key, n); return n <= limit;
      },
      incrementDailyUsage: async () => { freeReservations++; return 1; },
      recordRewriteCost: async () => {}, incrementTotalRewrites: async () => 1,
    },
  };
  vm.runInNewContext(source, { exports, require: name => { if (!(name in modules)) throw Error(name); return modules[name]; }, process: { env: {} }, console, AbortSignal, Date });
  return {
    send: (ip = "203.0.113.1") => exports.POST({ cookies: { get() {} }, headers: new Headers({ "x-forwarded-for": ip }), json: async () => ({ text: "Draft.", context: "cover-letter", englishVariant: "en-US" }) }),
    account: value => { email = value; }, calls: () => calls, freeReservations: () => freeReservations, limits,
  };
}

test("Pro burst guard stops provider calls after 20 requests even across different IPs", async () => {
  const f = fixture();
  for (let i = 0; i < 20; i++) assert.equal((await f.send()).status, 200);
  const denied = await f.send("203.0.113.99");
  assert.equal(denied.status, 429);
  assert.equal(denied.headers.get("Retry-After"), "60");
  assert.match((await denied.json()).message, /not reached a daily limit/);
  assert.equal(f.calls(), 20);
  assert.equal(f.freeReservations(), 0);
  assert.ok(f.limits.every(item => item.seconds === 60 && item.scope === "pro-rewrite-burst"));
});

test("one Pro account's burst does not block another account on the same IP", async () => {
  const f = fixture();
  for (let i = 0; i < 21; i++) await f.send();
  f.account("another@example.test");
  assert.equal((await f.send()).status, 200);
  assert.equal(f.calls(), 21);
});

test("failed safeguard storage cannot create unbounded paid API calls", async () => {
  const f = fixture({ outage: true });
  const response = await f.send();
  assert.equal(response.status, 503);
  assert.match((await response.json()).message, /draft is still here/);
  assert.equal(f.calls(), 0);
});
