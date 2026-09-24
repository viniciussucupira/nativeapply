import type { Metadata } from "next";
import { BillingVerify } from "../BillingManager";
export const metadata: Metadata = { title: "Verify your email | NativeApply", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function Page() { return <BillingVerify />; }
