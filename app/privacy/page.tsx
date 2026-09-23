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
        To use NativeApply you enter your email address. We store it so we know who uses the product and can contact
        you about NativeApply (for example, important changes to the service). We never sell it or share it with
        advertisers. To have it deleted, email us at the address below.
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
    id: "extension",
    heading: "6. Browser extension (Gmail)",
    body: (
      <p>
        NativeApply also offers an optional browser extension for Gmail. The extension only reads the text inside a
        Gmail compose window when you click the &quot;NativeApply&quot; button — it does not read your inbox, other
        emails, or any other tab or website. The text you choose to rewrite is sent only to the same NativeApply API
        described in Section 1 above, processed the same way, and is not shared with any additional third party. The
        extension does not track your browsing activity and does not run on any site other than Gmail and
        nativeapply.net.
      </p>
    ),
  },
  {
    id: "contact",
    heading: "7. Contact",
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
