import type { Metadata } from "next";
import CheckoutPlans from "./CheckoutPlans";

export const metadata: Metadata = {
  title: "Pricing — NativeApply Pro",
  description:
    "NativeApply Pro is $14 a month or $49 once for lifetime access, both with unlimited rewrites. Secure payment by Paddle, full refund within 14 days.",
  alternates: { canonical: "/checkout" },
};

export default function CheckoutPage() {
  return <CheckoutPlans />;
}
