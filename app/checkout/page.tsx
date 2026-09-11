"use client";

import Script from "next/script";
import { useState } from "react";

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
    if (event.name === "checkout.completed") {
const transactionId = event.data?.transaction_id;
            if (transactionId) {
                      fetch("/api/paddle/confirm", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ transactionId }),
                      }).finally(() => {
                                  // Full page navigation (not router.push) is intentional: it forces
                                  // the server component on "/" to re-read the now-set Pro cookie.
                                  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
                                  window.location.assign("/?upgraded=1");
                      });
            } else {
                      window.location.assign("/?upgraded=1");
            }
    }
  }

  function handleCheckout(priceId: string) {
    if (!window.Paddle) return;
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      settings: { locale: "en" },
    });
  }

  return (
    <>
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        onLoad={initializePaddle}
        strategy="afterInteractive"
      />

      <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">NativeApply Pro</h1>
          <p className="text-sm text-neutral-500">
            Unlimited rewrites for your cover letters, resume, and recruiter messages.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="border-2 border-black rounded-2xl p-6 flex flex-col gap-4 relative">
            <span className="absolute -top-3 left-6 bg-black text-white text-xs font-medium px-3 py-1 rounded-full">
              Recommended — no subscription
            </span>
            <div>
              <p className="text-sm font-medium text-neutral-500">Lifetime</p>
              <p className="text-3xl font-semibold text-black">
                $49 <span className="text-base font-normal text-neutral-400">once</span>
              </p>
            </div>
            <ul className="text-sm text-neutral-600 flex flex-col gap-1">
              <li>Unlimited rewrites, forever</li>
              <li>All content types</li>
              <li>Pay once, no recurring charge</li>
            </ul>
            <button
              onClick={() => handleCheckout(LIFETIME_PRICE_ID)}
              disabled={!paddleReady}
              className="mt-auto w-full py-3 rounded-full bg-black text-white text-sm font-medium disabled:opacity-40"
            >
              Get lifetime access
            </button>
          </div>

          <div className="border border-neutral-200 rounded-2xl p-6 flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-500">Monthly</p>
              <p className="text-3xl font-semibold text-black">
                $14 <span className="text-base font-normal text-neutral-400">/month</span>
              </p>
            </div>
            <ul className="text-sm text-neutral-600 flex flex-col gap-1">
              <li>Unlimited rewrites</li>
              <li>All content types</li>
              <li>Cancel anytime</li>
            </ul>
            <button
              onClick={() => handleCheckout(MONTHLY_PRICE_ID)}
              disabled={!paddleReady}
              className="mt-auto w-full py-3 rounded-full border border-black text-black text-sm font-medium disabled:opacity-40"
            >
              Subscribe monthly
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-400">
          No subscription required for the Lifetime plan — pay once and keep it forever. Payment processed
          securely by Paddle.com, our Merchant of Record.
        </p>
      </div>
    </>
  );
}
