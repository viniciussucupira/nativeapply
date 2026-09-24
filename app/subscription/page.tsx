import BillingManager from "./BillingManager";
import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Access & Billing | NativeApply",
  description: "Subscribe, recover Pro access, or find out how to cancel NativeApply. No NativeApply password to remember.",
  alternates: { canonical: "/subscription" },
};

export default function SubscriptionPage() {
  const cancelHelp = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Cancel NativeApply subscription")}&body=${encodeURIComponent("Hi, I would like to cancel my NativeApply subscription. I am writing from the email address I used to pay. Please confirm when cancellation is complete.")}`;
  return (
    <Section tone="white">
      <Container className="py-12 sm:py-16">
        <div className="max-w-2xl">
          <Eyebrow>Access & billing</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-navy sm:text-4xl">Your Pro access, without a password</h1>
          <p className="mt-4 text-lg leading-7 text-muted">NativeApply has no username, password, or separate account to create. Free rewrites need no sign-in. When you subscribe, Paddle handles payment and Pro is activated in this browser.</p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="flex flex-col rounded-2xl border border-line p-5">
            <h2 className="text-lg font-semibold text-navy">New to Pro?</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted">Choose the monthly plan, enter your email and payment details in secure checkout, and return to the editor. Save your Paddle receipt.</p>
            <ButtonLink href="/checkout" className="mt-5">See pricing & subscribe</ButtonLink>
          </article>
          <article className="flex flex-col rounded-2xl border border-line p-5">
            <h2 className="text-lg font-semibold text-navy">Already paid?</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted">New device or cleared cookies? Enter your purchase email on the Pro access page and we will send a secure link automatically. No password, purchase code, or new payment needed.</p>
            <ButtonLink href="/restore" variant="secondary" className="mt-5">Restore Pro access</ButtonLink>
          </article>
          <article className="flex flex-col rounded-2xl border border-line p-5">
            <h2 className="text-lg font-semibold text-navy">Want to cancel?</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted">Cancel right here. Confirm your purchase email, view your subscription, and stop renewal. No Paddle login or support message required.</p>
            <ButtonLink href="#cancel" variant="secondary" className="mt-5">Cancel subscription</ButtonLink>
          </article>
        </div>
        <section id="cancel" className="mt-10 scroll-mt-24 rounded-2xl border border-line bg-ivory p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-navy">Cancel your subscription</h2>
          <p className="mt-3 text-muted">Verify your email, then confirm cancellation below. No reason required.</p>
          <BillingManager />
          <p className="mt-5 text-sm leading-6 text-muted">Cancellation stops future renewals; your access continues until the end of the period already paid for. Closing this site or clearing cookies does not cancel a subscription. A refund is a separate request: see our <Link href="/refunds" className="font-semibold text-brand-700 underline">refund policy</Link>.</p>
          <details className="mt-6 border-t border-line pt-5"><summary className="cursor-pointer font-semibold text-navy">Other cancellation options &amp; support</summary>
            <h3 className="font-semibold text-navy">Need another way to cancel?</h3>
            <p className="mt-2 text-sm leading-6 text-muted">Paddle buyer support can help locate your purchase and cancel it. You can also email us from the address you used to pay. A support request is not a completed cancellation until you receive confirmation.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonLink href="https://paddle.net/contact" external variant="secondary">Open Paddle billing help</ButtonLink>
              <ButtonLink href={cancelHelp} variant="secondary">Email cancellation request</ButtonLink>
            </div>
            <p className="mt-3 text-sm text-muted">No email app? Write to <a href={`mailto:${SUPPORT_EMAIL}`} className="font-medium text-brand-700 underline">{SUPPORT_EMAIL}</a>. Do not send your password or full card number.</p>
          </details>
        </section>
        <section className="mt-8 max-w-3xl">
          <h2 className="text-xl font-semibold text-navy">Forgot your password?</h2>
          <p className="mt-3 leading-7 text-muted">There is no NativeApply password to forget or reset. If your paid access is missing, use <Link href="/restore" className="font-semibold text-brand-700 underline">Restore Pro access</Link>. If you cannot access your purchase email, contact support so we can help verify the purchase. Do not buy another subscription to fix an access problem.</p>
          <h2 className="mt-7 text-xl font-semibold text-navy">Update a payment method or download an invoice</h2>
          <p className="mt-3 leading-7 text-muted">Use the same Paddle customer-portal link in your receipt. Billing details are managed securely by Paddle; NativeApply does not store your card details.</p>
        </section>
      </Container>
    </Section>
  );
}
