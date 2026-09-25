import type { Metadata } from "next";
import CheckoutPlans from "./CheckoutPlans";

export const metadata: Metadata = {
  title: "Pricing — NativeApply Pro",
  description:
    "NativeApply Pro is $19 a month with unlimited rewrites, cancel anytime. Secure payment by Paddle, full refund within 14 days of each payment, including renewals.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return <CheckoutPlans />;
}
