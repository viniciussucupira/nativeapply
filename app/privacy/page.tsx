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
        Anthropic processes the text under its <a href="https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data">API data-retention terms</a>; our no-storage policy does not
        mean the provider has zero retention. We do not use your submissions to train AI models. The result
        stays in the open page so you can review and copy it. Only include personal information needed for
        the rewrite. NativeApply does not make hiring decisions about you.
      </p>
    ),
  },
  {
    id: "email",
    heading: "2. Your email address",
    body: (
      <p>
        Free rewrites do not require an email address. If you previously supplied one through our free-rewrite
        form, it remains separate from your drafts and usage counts; these legacy records do not have an
        automatic expiry. You can request deletion at the address below. Marketing messages require an
        appropriate legal basis, including consent where required. We never sell your email or share it with advertisers.
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
        Your free daily allowance is linked to a random browser identifier, not shared with everyone on your
        internet connection. Daily allowance records expire within 48 hours. Hashed IP counters used separately
        to prevent automated abuse expire after one hour. We also record token counts and estimated AI costs,
        separated into free and paid usage. Daily totals and monthly pseudonymous paid-usage totals are kept
        for up to 400 days. These records do not contain your drafts or rewritten text.
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
        access. We also receive transaction and subscription identifiers and status information to verify
        purchases, renewals, cancellations, and refunds. Monthly access records expire after the paid period
        plus a short processing grace period. Lifetime access records and some purchase references do not
        have an automatic expiry. We keep these records as needed to provide purchased access, resolve
        payment issues, and meet applicable recordkeeping obligations. Deletion requests are reviewed against those needs.
      </p>
    ),
  },
  {
    id: "cookies",
    heading: "5. Cookies, local storage, and analytics",
    body: (
      <p>
        We use secure, httpOnly cookies for your browser&apos;s free allowance and purchased Pro access, lasting
        up to one year. A separate billing cookie lasts 15 minutes after you verify your email to manage a subscription.
        An older version saved a local flag after email entry; free rewrites no longer use that flag. We
        use <a href="https://vercel.com/docs/analytics/privacy-policy">Vercel Web Analytics</a> for cookie-free
        traffic statistics, such as page views, referring sites, device types, and countries. We
        don&apos;t use advertising cookies.
      </p>
    ),
  },
  {
    id: "providers",
    heading: "6. Providers and international processing",
    body: (
      <>
        <p>Vercel hosts NativeApply and processes technical request information. Upstash stores access,
          subscription, security, and usage records. Anthropic generates rewrites, Resend delivers access
          emails, and Paddle handles purchases. Support messages are processed to respond to your request.
          Hosting and delivery providers may retain operational logs under their own policies, separately
          from the application-record lifetimes listed above.</p>
        <p>These providers may process information outside your country, where data-protection laws may differ.
          Their own privacy and contractual terms also apply to their processing. Contact us for information
          about the providers and safeguards relevant to your data. We may disclose information when legally
          required or necessary to investigate fraud or protect the service.</p>
      </>
    ),
  },
  {
    id: "purposes",
    heading: "7. Why we process information",
    body: (
      <p>Where data-protection law requires a legal basis, we process information necessary to provide
        requested rewrites, purchased access, billing management, and support to perform our contract with
        you. Security controls, abuse prevention, and service-cost monitoring support our legitimate
        interests in operating a reliable service, subject to your rights. We process records required by
        law to meet legal obligations and rely on consent where required for optional processing.</p>
    ),
  },
  {
    id: "contact",
    heading: "8. Your choices and contact",
    body: (
      <>
        <p>Contact Nimbus Labs at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> for privacy questions
          or requests. Depending on applicable law, you may have rights to access, correct, delete, or obtain
          a copy of your information, restrict processing, or object to it. You can withdraw consent for
          processing based on consent without affecting earlier lawful processing, and complain to your
          local data-protection authority.</p>
        <p>We may need to verify your identity before disclosing or changing purchase records. Do not send
          passwords or full payment-card details. Clearing browser cookies removes remembered access on
          that browser; it does not cancel a subscription or delete payment records. To stop renewals,
          use <a href="/subscription#cancel">Cancel subscription</a>.</p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      updated="September 24, 2026"
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
