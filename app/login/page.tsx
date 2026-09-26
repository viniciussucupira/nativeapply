import type { Metadata } from "next";
import LoginForm from "@/app/restore/RestoreForm";
import SignedInPanel from "./SignedInPanel";
import { getProStatus } from "@/lib/pro";
import { recoveryEmailReady } from "@/lib/recovery-email";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Log in | NativeApply",
  description: "Log in to NativeApply Pro on any device with the email you used to pay. No password.",
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { notice } = await searchParams;
  let session: { email: string; pro: boolean } | null = null;
  try {
    const status = await getProStatus();
    if (status.email) session = { email: status.email, pro: status.pro };
  } catch {
    // If the session cannot be checked, offering the login form is the safe answer.
  }
  if (session) return <SignedInPanel email={session.email} pro={session.pro} />;
  return <LoginForm emailEnabled={recoveryEmailReady()} notice={typeof notice === "string" ? notice : ""} />;
}
