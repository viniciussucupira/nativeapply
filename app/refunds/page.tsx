import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { LIFETIME_FULL } from "@/lib/lifetime-policy";

export const metadata: Metadata = {
  title: "Refund Policy | NativeApply",
  description: "Refund Policy for NativeApply.",
  alternates: { canonical: "/refunds" },
};

const sections: LegalSection[] = [
  {
    id: "monthly",
    heading: "Monthly plan",
    body: (
      <>
        <p>
          Your first payment is fully refundable for 14 days. Ask within 14 days of that charge and you get the
          whole amount back, no questions asked and no reason needed.
        </p>
        <p>
          You can cancel at any time; you keep access until the end of the billing period you already paid for,
          with no further renewals once cancellation is confirmed. The first-payment guarantee does not
          automatically apply to renewal payments. If a renewal charge looks wrong, contact us within 14 days
          and we&apos;ll review it with Paddle. This review window does not limit your statutory rights.
        </p>
      </>
    ),
  },
  {
    id: "cancel",
    heading: "How to cancel",
    body: (
      <>
        <ol className="list-decimal space-y-2 pl-5">
          <li>Open <a href="/subscription#cancel">Access &amp; billing</a> and enter the email used for your purchase.</li>
          <li>Open the secure link in your email to verify access. No NativeApply password or Paddle login is required.</li>
          <li>Select your subscription, choose Cancel subscription, and confirm. Check the confirmation and access end date.</li>
        </ol>
        <p>Cancel before your next renewal. A confirmed cancellation stops future renewals; it does not refund
          an existing charge. If you want a refund as well, follow the instructions below. A refund may end the
          Pro access associated with the refunded payment.</p>
        <p>If you cannot access your email or the cancellation fails, contact <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          You can also use the management link in your Paddle receipt or <a href="https://paddle.net">Paddle payment support</a>.
          A support request is not a completed cancellation until you receive confirmation.</p>
      </>
    ),
  },
  {
    id: "lifetime",
    heading: "Lifetime plan (no longer sold)",
    body: (
      <>
        <p>
          The Lifetime plan is no longer offered to new customers, and nothing changes for the people who bought it.
          It was a one-time payment with a full refund if requested within 14 days of purchase, no questions asked.
        </p>
        <p>{LIFETIME_FULL}</p>
      </>
    ),
  },
  {
    id: "how",
    heading: "How to request a refund",
    body: (
      <>
        <p>Email <a href={`mailto:${SUPPORT_EMAIL}?subject=NativeApply%20refund%20request`}>{SUPPORT_EMAIL}</a> from
          your purchase email, with the payment date or receipt reference so we can locate the charge.
          No explanation is needed for the first-payment guarantee. If you also want to cancel future renewals,
          say so or cancel directly above.</p>
        <p>We will confirm the outcome by email. Paddle processes approved refunds; the time for the credit
          to appear depends on the payment method and provider. Never send a password or full card number.</p>
      </>
    ),
  },
  {
    id: "rights",
    heading: "Your consumer rights",
    body: (
      <p>This policy is in addition to any refund, withdrawal, or other consumer rights provided by applicable
        law. It does not remove those rights or shorten mandatory deadlines. See the <a href="https://www.paddle.com/legal/buyer-terms">Paddle Buyer Terms</a> for
        the terms that apply to your payment.</p>
    ),
  },
];

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="September 24, 2026"
      intro="All payments for NativeApply are processed by Paddle.com, acting as Merchant of Record. Paddle handles billing and refunds on our behalf."
      sections={sections}
    />
  );
}
