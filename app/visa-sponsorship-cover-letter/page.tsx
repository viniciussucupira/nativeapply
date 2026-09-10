import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Visa Sponsorship Cover Letter Rewriter | NativeApply",
  description:
    "AI tool that polishes the English in your cover letter for jobs that offer visa sponsorship, so it reads like a native speaker wrote it. $14/month or $49 lifetime, with a free daily rewrite to try it first.",
  alternates: { canonical: "/visa-sponsorship-cover-letter" },
  openGraph: {
    title: "Visa Sponsorship Cover Letter Rewriter",
    description:
      "Applying to a job that sponsors visas? Paste your cover letter and get it back sounding natural and professional. $14/month or $49 lifetime — try it free first, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="cover-letter"
      heading="Cover letters for visa-sponsorship jobs, in native English"
      subheading="Applying abroad for a role that sponsors your visa? Paste your cover letter draft. Get it back polished, natural, and professional. $14/month or $49 lifetime — try it free first, no signup required."
      />
    );
}
