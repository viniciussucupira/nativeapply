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
        version. We don&apos;t store it on our servers, and it is not used to train any AI model.
      </p>
    ),
  },
  {
    id: "email",
    heading: "2. Your email address",
    body: (
      <p>
        Before your first free rewrite, the tool asks for your email address and we store it, so we can reach you
        about NativeApply itself — for example, an important change to the service. The unlock is then a flag saved
        in your own browser, so your email is not attached to the text you rewrite or to the usage count described
        below. We never sell it or share it with advertisers. To have it deleted, email us at the address below.
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
        We set one secure, httpOnly cookie after a purchase to remember that your browser has Pro access. We also
        save a small flag in your browser&apos;s local storage so you don&apos;t have to enter your email again. We
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
