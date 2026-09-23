import type { Metadata } from "next";
import { SUPPORT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy | NativeApply",
  description: "Privacy Policy for NativeApply.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col gap-6 text-sm text-neutral-700 leading-6">
      <h1 className="text-2xl font-semibold text-black">Privacy Policy</h1>
      <p className="text-neutral-500">Last updated: September 2026</p>

      <p>NativeApply is operated by Nimbus Labs (&quot;we&quot;, &quot;us&quot;). This page explains what data we collect and why.</p>

      <h2 className="text-lg font-semibold text-black mt-4">1. Text you submit</h2>
      <p>
        The text you paste into NativeApply is sent to our AI provider (Anthropic) solely to generate a
        rewritten version. We don&apos;t store it on our servers, and it is not used to train any AI model.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">2. Your email address</h2>
      <p>
        To use NativeApply you enter your email address. We store it so we know who uses the product and can
        contact you about NativeApply (for example, important changes to the service). We never sell it or
        share it with advertisers. To have it deleted, email us at the address below.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">3. Usage limits</h2>
      <p>
        To enforce the daily limit, we keep a count of rewrites per IP address for 24 hours. It is then
        deleted automatically.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">4. Payment information</h2>
      <p>
        If you purchase NativeApply Pro, your payment is handled entirely by Paddle.com, our Merchant of
        Record. We never see or store your card details. Paddle shares your email address with us so we can
        activate your Pro access.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">5. Cookies, local storage, and analytics</h2>
      <p>
        We set one secure, httpOnly cookie after a purchase to remember that your browser has Pro access. We
        also save a small flag in your browser&apos;s local storage so you don&apos;t have to enter your email
        again. We use Vercel Web Analytics to count page views; it doesn&apos;t use cookies and doesn&apos;t
        identify you. We don&apos;t use advertising cookies.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">6. Browser extension (Gmail)</h2>
      <p>
        NativeApply also offers an optional browser extension for Gmail. The extension only reads the text
        inside a Gmail compose window when you click the &quot;NativeApply&quot; button — it does not read your
        inbox, other emails, or any other tab or website. The text you choose to rewrite is sent only to the
        same NativeApply API described in Section 1 above, processed the same way, and is not shared with any
        additional third party. The extension does not track your browsing activity and does not run on any
        site other than Gmail and nativeapply.net.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">7. Contact</h2>
      <p>
        Questions about this policy, or requests to access or delete your data, can be sent to{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
