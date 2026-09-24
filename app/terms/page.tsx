import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/lib/constants";
import { LIFETIME_FULL } from "@/lib/lifetime-policy";

export const metadata: Metadata = {
  title: "Terms of Service | NativeApply",
  description: "Terms of Service for NativeApply.",
  alternates: { canonical: "/terms" },
};

const sections: LegalSection[] = [
  {
    id: "service",
    heading: "1. The Service",
    body: (
      <p>
        NativeApply rewrites text you submit — such as cover letters, resume bullet points, and messages to
        recruiters — using artificial intelligence, so it reads more naturally to a native English speaker. Without a
        paid plan, use is limited to 1 rewrite per day. NativeApply Pro ($14/month) removes this limit.
      </p>
    ),
  },
  {
    id: "content",
    heading: "2. Your content",
    body: (
      <p>
        You retain all rights to the text you submit. We do not claim ownership over your content, and we do not use
        your submissions to train AI models. Do not submit content you don&apos;t have the right to share, or content
        that is unlawful, defamatory, or infringes on someone else&apos;s rights.
      </p>
    ),
  },
  {
    id: "no-guarantee",
    heading: "3. No guaranteed outcome",
    body: (
      <p>
        NativeApply helps you write clearer, more natural English. It does not guarantee that you will get an
        interview, an offer, or any specific job-search outcome.
      </p>
    ),
  },
  {
    id: "payments",
    heading: "4. Payments",
    body: (
      <p>
        Payments are processed by Paddle.com, our Merchant of Record. Paddle handles billing, taxes, and payment
        security for all transactions. See our <a href="/refunds">Refund Policy</a> for details on cancellations and
        refunds.
      </p>
    ),
  },
  {
    id: "lifetime",
    heading: "5. Lifetime plan (no longer sold)",
    body: (
      <>
        <p>
          The Lifetime plan is no longer offered to new customers. Everyone who bought it keeps it, on exactly the
          terms it was sold under:
        </p>
        <p>{LIFETIME_FULL}</p>
      </>
    ),
  },
  {
    id: "changes",
    heading: "6. Changes",
    body: (
      <p>
        We may update these Terms from time to time. Continued use of the Service means you accept the changes.
        Changes never reduce what you already paid for.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "7. Contact",
    body: (
      <p>
        Questions about these Terms can be sent to <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      updated="September 2026"
      intro={
        <>
          NativeApply is a product operated by Nimbus Labs (&quot;we&quot;, &quot;us&quot;). By using nativeapply.net
          (the &quot;Service&quot;), you agree to these Terms.
        </>
      }
      sections={sections}
    />
  );
}
