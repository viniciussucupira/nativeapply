import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | NativeApply",
  description: "Refund Policy for NativeApply.",
};

export default function RefundsPage() {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col gap-6 text-sm text-neutral-700 leading-6">
      <h1 className="text-2xl font-semibold text-black">Refund Policy</h1>
      <p className="text-neutral-400">Last updated: September 2026</p>

      <p>
        All payments for NativeApply are processed by Paddle.com, acting as Merchant of Record. Paddle
        handles billing and refunds on our behalf.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">Monthly plan</h2>
      <p>
        You can cancel your monthly subscription at any time; you will keep access until the end of the
        current billing period, with no further charges after that. If you believe you were charged in
        error, contact us within 14 days of the charge and we&apos;ll review it with Paddle.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">Lifetime plan</h2>
      <p>
        The Lifetime plan is a one-time payment. We offer a full refund if requested within 14 days of
        purchase, no questions asked.
      </p>

      <h2 className="text-lg font-semibold text-black mt-4">How to request a refund</h2>
      <p>
        Contact us at the support address listed on our homepage with your order/receipt email from
        Paddle, and we&apos;ll process it promptly.
      </p>
    </div>
  );
}
