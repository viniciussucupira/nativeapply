"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { FREE_PLAN, MONTHLY_PLAN, type Plan } from "@/lib/plans";
import { Button, ButtonLink, Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { IconCheck, IconLock, IconClock, IconShield, IconReceipt } from "@/components/ui/Icons";

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

function PlanColumn({
  plan,
  highlight = false,
  children,
  footnote,
}: {
  plan: Plan;
  highlight?: boolean;
  children: React.ReactNode;
  footnote?: string;
}) {
  return (
    <div
      className={
        "relative flex flex-col rounded-2xl border p-6 sm:p-7 " +
        (highlight
          ? "border-brand bg-white shadow-[0_28px_70px_-50px_rgba(16,35,63,0.6)] lg:-my-4 lg:py-10"
          : "border-line bg-white")
      }
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white">
          Best value
        </span>
      )}
      <p className="text-[0.9375rem] font-semibold text-navy">{plan.name}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.03em] text-navy">
          {plan.price}
        </span>
        <span className="text-sm text-muted">{plan.cadence}</span>
      </p>
      <p className="mt-3 text-[0.9375rem] leading-6 text-muted">{plan.summary}</p>
      <ul className="mt-6 flex flex-1 flex-col gap-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem] leading-6 text-ink">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-7">{children}</div>
      {footnote && <p className="mt-3 text-center text-[0.8125rem] text-muted">{footnote}</p>}
    </div>
  );
}

export default function CheckoutPlans() {
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

      <Section tone="white" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(39,100,231,0.07),transparent_70%)]"
        />
        <Container size="wide" className="relative py-14 sm:py-20">
          <div className="na-rise mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-navy sm:text-[2.75rem]">
              Unlimited rewrites for <span className="na-accent-text">$14 a month</span>
            </h1>
            <p className="text-[1.0625rem] leading-7 text-muted">
              One paid plan with everything in it. Try it free first, and cancel the moment your job search ends —
              access runs to the end of the month you already paid for.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
            <PlanColumn plan={FREE_PLAN}>
              <ButtonLink href="/#tool" size="lg" variant="secondary" className="w-full">
                Start with one rewrite
              </ButtonLink>
            </PlanColumn>

            <PlanColumn plan={MONTHLY_PLAN} highlight footnote="Full refund within 14 days of your first payment.">
              <Button
                size="lg"
                onClick={() => handleCheckout(MONTHLY_PRICE_ID)}
                disabled={!paddleReady}
                className="w-full"
              >
                {paddleReady ? "Subscribe monthly" : "Loading checkout…"}
              </Button>
            </PlanColumn>
          </div>

          <ul className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[0.875rem] text-muted">
            {[
              { Icon: IconLock, text: "Secure payment by Paddle" },
              { Icon: IconShield, text: "NativeApply never stores your card" },
              { Icon: IconClock, text: "14-day refund policy" },
              { Icon: IconCheck, text: "Cancel the monthly plan anytime" },
            ].map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-2">
                <Icon className="h-[1.1rem] w-[1.1rem] text-brand" />
                {text}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="ivory">
        <Container size="wide" className="py-14 sm:py-18">
          <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="text-[1.0625rem] font-semibold text-navy">What you are paying for</h2>
              <p className="mt-2.5 text-[0.9375rem] leading-6 text-muted">
                Unlimited rewrites while the subscription is active, all four document types, and no lock-in: you
                cancel from your Paddle receipt and keep access until the end of the month you paid for.
              </p>
              <p className="mt-3 text-[0.9375rem] leading-6 text-muted">
                The full wording is in the{" "}
                <Link href="/terms" className="font-medium text-brand-700 underline underline-offset-4">
                  Terms
                </Link>{" "}
                and the{" "}
                <Link href="/refunds" className="font-medium text-brand-700 underline underline-offset-4">
                  Refund Policy
                </Link>
                . We would rather write the exact terms down than promise more than we can deliver.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6">
              <h2 className="flex items-center gap-2 text-[1.0625rem] font-semibold text-navy">
                <IconReceipt className="h-5 w-5 text-brand" />
                Already paid on another device?
              </h2>
              <p className="mt-2.5 text-[0.9375rem] leading-6 text-muted">
                Pro is remembered in the browser you paid from. To switch it on somewhere else, use the transaction
                ID from your Paddle receipt — it takes one step.
              </p>
              <ButtonLink href="/restore" variant="secondary" className="mt-5">
                Restore Pro
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
