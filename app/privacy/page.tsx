import type { Metadata } from "next";
import LegalLayout, { type LegalSection } from "@/components/legal/LegalLayout";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | NativeApply",
  description: "Privacy Policy for NativeApply.",
  alternates: { canonical: "/privacy" },
};

const sections: LegalSection[] = [
  {
    id: "text",
    heading: "1. Text you submit",
    body: (
      <p>
        The text you paste into NativeApply is sent to our AI provider (Anthropic) solely to generate a rewritten
        version. We do not save drafts or rewrites in NativeApply databases or application logs.
        Anthropic processes the text under its own API data-retention terms; our no-storage policy does not
        mean the provider has zero retention. The result stays in the open page so you can review and copy it.
      </p>
    ),
  },
  {
    id: "email",
    heading: "2. Your email address",
    body: (
      <p>
        Free rewrites do not require an email address. If you previously supplied one through our free-rewrite
        form, it remains separate from your drafts and usage counts and may be used to contact you about
        NativeApply. We never sell it or share it with advertisers. You can request deletion at the address below.
        Paid access and support may require your email address. When you request an access link, we use Resend
        to deliver it to your email address. The link expires after 15 minutes and can be used once. We store
        its hashed token and your email for up to 15 minutes, and hashed email/IP request counters for up to
        one hour to prevent abuse. Resend processes delivery data under its own retention terms. Access-link
        requests do not subscribe you to marketing emails.
      </p>
    ),
  },
  {
    id: "limits",
    heading: "3. Usage limits",
    body: (
      <p>
        To enforce the daily limit, we keep a count of rewrites per IP address for 24 hours. It is then deleted
        automatically.
      </p>
    ),
  },
  {
    id: "payment",
    heading: "4. Payment information",
    body: (
      <p>
        If you purchase NativeApply Pro, your payment is handled entirely by Paddle.com, our Merchant of Record. We
        never see or store your card details. Paddle shares your email address with us so we can activate your Pro
        access.
      </p>
    ),
  },
  {
    id: "cookies",
    heading: "5. Cookies, local storage, and analytics",
    body: (
      <p>
        We set one secure, httpOnly cookie after a purchase to remember that your browser has Pro access.
        An older version saved a local flag after email entry; free rewrites no longer use that flag. We
        use Vercel Web Analytics to count page views; it doesn&apos;t use cookies and doesn&apos;t identify you. We
        don&apos;t use advertising cookies.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "6. Contact",
    body: (
      <p>
        Questions about this policy, or requests to access or delete your data, can be sent to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="September 2026"
      intro={
        <>
          NativeApply is operated by Nimbus Labs (&quot;we&quot;, &quot;us&quot;). This page explains what data we
          collect and why.
        </>
      }
      sections={sections}
    />
  );
}
