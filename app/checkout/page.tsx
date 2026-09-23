"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { LIFETIME_SHORT } from "@/lib/lifetime-policy";

type PaddleCheckoutEvent = {
  name: string;
    data?: { transaction_id?: string };
};

type PaddleClient = {
  Environment: { set: (env: string) => void };
  Setup: (options: { token?: string; eventCallback: (event: PaddleCheckoutEvent) => void }) => void;
  Checkout: {
    open: (options: {
      items: { priceId: string; quantity: number }[];
      settings?: { locale?: string };
    }) => void;
  };
};

declare global {
  interface Window {
    Paddle: PaddleClient;
  }
}

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID!;
const LIFETIME_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_LIFETIME_PRICE_ID!;

export default function CheckoutPage() {
  const [paddleReady, setPaddleReady] = useState(false);

  function initializePaddle() {
    if (window.Paddle) {
      const env = process.env.NEXT_PUBLIC_PADDLE_ENV;
      if (env === "sandbox") {
        window.Paddle.Environment.set("sandbox");
      }
      window.Paddle.Setup({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        eventCallback: eventCallback,
      });
      setPaddleReady(true);
    }
  }

  function eventCallback(event: PaddleCheckoutEvent) {
    if (event.name !== "checkout.completed") return;
    const transactionId = event.data?.transaction_id;
    const done = () => {
      // Full page navigation (not router.push) is intentional: it makes the
      // home page re-read the Pro cookie that /api/paddle/confirm just set.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/?upgraded=1");
    };
    if (!transactionId) return done();
    fetch("/api/paddle/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    }).finally(done);
  }

  function handleCheckout(priceId: string) {
    if (!window.Paddle || !priceId) return;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: { locale: "en" },
    });
  }

  return (
    <>
      <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" onLoad={initializePaddle} strategy="afterInteractive" />

      <div className="relative isolate w-full overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="na-blob left-[-5rem] top-[-3rem] h-72 w-72 bg-violet-200" />
          <div className="na-blob right-[-4rem] top-40 h-72 w-72 bg-sky-200" style={{ animationDelay: "-7s" }} />
          <div className="na-blob left-1/3 top-[28rem] h-56 w-56 bg-rose-100" style={{ animationDelay: "-13s" }} />
        </div>

        <header className="mx-auto flex w-full max-w-3xl items-center px-6 pt-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-sky-500 via-violet-500 to-rose-500 text-xs font-bold text-white">
              NA
            </span>
            NativeApply
          </Link>
        </header>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 pb-16 pt-12">
          <div className="na-rise flex flex-col gap-2 text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
              NativeApply <span className="na-gradient-text">Pro</span>
            </h1>
            <p className="text-sm text-neutral-600">
              Unlimited rewrites for your cover letters, resume, and recruiter messages.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="na-rise relative flex flex-col gap-4 rounded-3xl border-2 border-violet-500 bg-white/90 p-6 shadow-xl shadow-violet-100 backdrop-blur">
              <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-violet-500 to-rose-500 px-3 py-1 text-xs font-medium text-white">
                Recommended — no subscription
              </span>
              <div>
                <p className="text-sm font-medium text-violet-700">Lifetime</p>
                <p className="text-4xl font-semibold text-neutral-900">
                  $49 <span className="text-base font-normal text-neutral-500">once</span>
                </p>
              </div>
              <ul className="flex flex-col gap-1.5 text-sm text-neutral-700">
                <li>✓ Unlimited rewrites</li>
                <li>✓ All 4 document types</li>
                <li>✓ Pay once, no recurring charge</li>
                <li>✓ Full refund within 14 days</li>
              </ul>
              <button
                onClick={() => handleCheckout(LIFETIME_PRICE_ID)}
                disabled={!paddleReady}
                className="mt-auto w-full rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-rose-500 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 hover:brightness-110 disabled:opacity-40"
              >
                Get lifetime access
              </button>
            </div>

            <div className="na-rise flex flex-col gap-4 rounded-3xl border border-neutral-200 bg-white/90 p-6 backdrop-blur" style={{ animationDelay: "0.1s" }}>
              <div>
                <p className="text-sm font-medium text-sky-700">Monthly</p>
                <p className="text-4xl font-semibold text-neutral-900">
                  $14 <span className="text-base font-normal text-neutral-500">/month</span>
                </p>
              </div>
              <ul className="flex flex-col gap-1.5 text-sm text-neutral-700">
                <li>✓ Unlimited rewrites</li>
                <li>✓ All 4 document types</li>
                <li>✓ Cancel anytime, keep access to the end of the paid month</li>
              </ul>
              <button
                onClick={() => handleCheckout(MONTHLY_PRICE_ID)}
                disabled={!paddleReady}
                className="mt-auto w-full rounded-full border border-neutral-900 bg-white py-3 text-sm font-medium text-neutral-900 hover:bg-neutral-900 hover:text-white disabled:opacity-40"
              >
                Subscribe monthly
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 text-center text-xs text-neutral-500">
            <p>Lifetime: {LIFETIME_SHORT}</p>
            <p>
              Payment processed securely by Paddle.com, our Merchant of Record. Already paid on another device?{" "}
              <Link href="/restore" className="underline hover:text-neutral-900">
                Restore Pro
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
