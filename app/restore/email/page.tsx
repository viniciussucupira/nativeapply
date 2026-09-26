import type { Metadata } from "next";
import { EmailVerify } from "../EmailAccess";

export const metadata: Metadata = { title: "Log in | NativeApply", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default function VerifyPage() { return <EmailVerify />; }
