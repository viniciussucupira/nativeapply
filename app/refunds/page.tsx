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
          whole amount back, no questions asked and no reason needed. This is the same 14-day refund promised on
          the pricing page, written here so the wording matches.
        </p>
        <p>
          You can cancel at any time; you keep access until the end of the billing period you already paid for,
          with no further charges after that. If a later charge looks wrong to you, contact us within 14 days of
          it and we&apos;ll review it with Paddle.
        </p>
      </>
    ),
  },
  {
    id: "cancel",
    heading: "How to cancel",
    body: (
      <p>
        Open the receipt Paddle emailed you after the payment and use the link in it to manage your subscription —
        cancelling there stops any future charge immediately. If you cannot find the receipt, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the address you paid with and we&apos;ll
        cancel it for you.
      </p>
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
      <p>
        Email <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> from the address you paid with (or include your
        Paddle receipt), and we&apos;ll process it promptly. You can also reply to your Paddle receipt email.
      </p>
    ),
  },
];

export default function RefundsPage() {
  return (
    <LegalLayout
      title="Refund Policy"
      updated="September 2026"
      intro="All payments for NativeApply are processed by Paddle.com, acting as Merchant of Record. Paddle handles billing and refunds on our behalf."
      sections={sections}
    />
  );
}
