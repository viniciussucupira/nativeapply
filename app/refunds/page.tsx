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
      <p>
        You can cancel your monthly subscription at any time; you will keep access until the end of the current
        billing period, with no further charges after that. If you believe you were charged in error, contact us
        within 14 days of the charge and we&apos;ll review it with Paddle.
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
