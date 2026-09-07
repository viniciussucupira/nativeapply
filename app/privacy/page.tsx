import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | NativeApply",
  description: "Privacy Policy for NativeApply.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col gap-6 text-sm text-neutral-700 leading-6">
      <h1 className="text-2xl font-semibold text-black">Privacy Policy</h1>
      <p className="text-neutral-400">Last updated: September 2026</p>

      <p>NativeApply is operated by Nimbus Labs (&quot;we&quot;, &quot;us&quot;). This page explains what data we collect and why.</p>

      <h2 className="text-lg font-semibold text-black mt-4">1. Text you submit</h2>
      <p>
        The text you paste into NativeApply is sent to our AI provider (Anthropic) solely to generate a
        rewritten version, and is not stored permanently on our servers or used to train any AI model.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">2. Usage limits</h2>
      <p>
        To enforce our free daily limit, we temporarily store a count of requests associated with your IP
        address for 24 hours. This is deleted automatically and is not linked to any other personal
        information.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">3. Payment information</h2>
      <p>
        If you purchase NativeApply Pro, your payment is handled entirely by Paddle.com, our Merchant of
        Record. We never see or store your card details. Paddle shares your email address with us so we
        can activate your Pro access.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">4. Cookies</h2>
      <p>
        We use a single, secure, httpOnly cookie to remember that you&apos;re a Pro subscriber. We don&apos;t
        use tracking or advertising cookies.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">5. Contact</h2>
      <p>Questions about this policy can be sent to the support address listed on our homepage.</p>
    </div>
  );
}
