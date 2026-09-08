import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Visa Sponsorship Cover Letter Rewriter | NativeApply",
  description:
    "Free AI tool that polishes the English in your cover letter for jobs that offer visa sponsorship, so it reads like a native speaker wrote it — no signup required.",
  alternates: { canonical: "/visa-sponsorship-cover-letter" },
  openGraph: {
    title: "Visa Sponsorship Cover Letter Rewriter",
    description:
      "Applying to a job that sponsors visas? Paste your cover letter and get it back sounding natural and professional — free.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="cover-letter"
      heading="Cover letters for visa-sponsorship jobs, in native English"
      subheading="Applying abroad for a role that sponsors your visa? Paste your cover letter draft. Get it back polished, natural, and professional — free, no signup."
    />
  );
}
