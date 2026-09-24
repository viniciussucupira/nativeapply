import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Exercise the actual checkout handlers without creating a provider transaction.
function fixture() {
  let cursor = 0, tree, callback, opens = 0, failOpen = false;
  const hooks = [], exports = {};
  const jsx = (type, props) => ({ type, props });
  const source = ts.transpileModule(readFileSync(new URL("../app/checkout/CheckoutPlans.tsx", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const react = {
    useEffect() {},
    useRef(value) { const i = cursor++; return hooks[i] ??= { current: value }; },
    useState(value) { const i = cursor++; if (!(i in hooks)) hooks[i] = value; return [hooks[i], value => { hooks[i] = value; }]; },
  };
  const client = { Setup(options) { callback = options.eventCallback; }, Checkout: { open() { opens++; if (failOpen) throw Error("Fixture"); } } };
  vm.runInNewContext(source, { exports, process: { env: { NEXT_PUBLIC_PADDLE_PRICE_ID: "price", NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: "fixture" } },
    window: { Paddle: client, location: { assign() {} } },
    require(name) {
      if (name === "react") return react;
      if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
      if (name.endsWith("useProStatus")) return { useProStatus: () => ({ isPro: false, ready: true, unavailable: false }) };
      if (name.endsWith("payment-activation")) return { activatePurchase: async () => true };
      if (name.endsWith("plans")) return { FREE_PLAN: {}, MONTHLY_PLAN: {} };
      return new Proxy({}, { get: (_, key) => key });
    },
  });
  function find(node, predicate) {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) { for (const child of node) { const hit = find(child, predicate); if (hit) return hit; } }
    else { if (predicate(node)) return node; return find(node.props?.children, predicate); }
  }
  const render = () => { cursor = 0; tree = exports.default(); };
  render(); find(tree, n => Boolean(n.props?.onReady)).props.onReady(); render();
  return {
    button: () => find(tree, n => n.type === "Button" && Boolean(n.props?.onClick)),
    render, event: event => callback(event), opens: () => opens,
    fail: value => { failOpen = value; },
  };
}

test("rapid repeated subscription clicks open one checkout; closing allows a new attempt", async () => {
  const f = fixture(), click = f.button().props.onClick;
  click(); click(); assert.equal(f.opens(), 1);
  f.render(); assert.equal(f.button().props.disabled, true);
  await f.event({ name: "checkout.closed" }); f.render();
  assert.equal(f.button().props.disabled, false);
  f.button().props.onClick(); assert.equal(f.opens(), 2);
});

test("synchronous and asynchronous opening errors allow retry", async () => {
  const f = fixture(); f.fail(true); f.button().props.onClick(); f.render();
  assert.equal(f.button().props.disabled, false);
  f.fail(false); f.button().props.onClick();
  await f.event({ name: "checkout.error" }); f.render();
  assert.equal(f.button().props.disabled, false);
});

test("successful payment keeps purchasing disabled even after checkout closes", async () => {
  const f = fixture(); f.button().props.onClick();
  await f.event({ name: "checkout.completed", data: { transaction_id: "txn_fixture" } });
  await f.event({ name: "checkout.closed" }); f.render();
  assert.equal(f.button().props.disabled, true);
  f.button().props.onClick(); assert.equal(f.opens(), 1);
});
