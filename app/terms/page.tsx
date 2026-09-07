import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | NativeApply",
  description: "Terms of Service for NativeApply.",
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col gap-6 text-sm text-neutral-700 leading-6">
      <h1 className="text-2xl font-semibold text-black">Terms of Service</h1>
      <p className="text-neutral-400">Last updated: September 2026</p>

      <p>
        NativeApply is a product operated by Nimbus Labs (&quot;we&quot;, &quot;us&quot;). By using
        nativeapply.net (the &quot;Service&quot;), you agree to these Terms.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">1. The Service</h2>
      <p>
        NativeApply rewrites text you submit — such as cover letters, resume bullet points, and messages
        to recruiters — using artificial intelligence, so it reads more naturally to a native English
        speaker. Free accounts are limited to 5 rewrites per day. Paid plans remove this limit.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">2. Your content</h2>
      <p>
        You retain all rights to the text you submit. We do not claim ownership over your content, and we
        do not use your submissions to train AI models. Do not submit content you don&apos;t have the
        right to share, or content that is unlawful, defamatory, or infringes on someone else&apos;s
        rights.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">3. No guaranteed outcome</h2>
      <p>
        NativeApply helps you write clearer, more natural English. It does not guarantee that you will get
        an interview, an offer, or any specific job-search outcome.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">4. Payments</h2>
      <p>
        Payments are processed by Paddle.com, our Merchant of Record. Paddle handles billing, taxes, and
        payment security for all transactions. See our{" "}
        <a href="/refunds" className="underline">
          Refund Policy
        </a>{" "}
        for details on cancellations and refunds.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">5. Changes</h2>
      <p>We may update these Terms from time to time. Continued use of the Service means you accept the changes.</p>

      <h2 className="text-lg font-semibold text-black mt-4">6. Contact</h2>
      <p>Questions about these Terms can be sent to the support address listed on our homepage.</p>
    </div>
  );
}
