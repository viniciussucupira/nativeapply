import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Interview Follow-Up Email Generator | NativeApply",
  description:
    "Free AI tool that rewrites your post-interview thank-you or follow-up email so it sounds polite, natural, and native — not stiff or overly formal.",
  alternates: { canonical: "/interview-follow-up-email-generator" },
  openGraph: {
    title: "Interview Follow-Up Email Generator",
    description: "Paste your follow-up email draft and get it back sounding natural and native — free.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="follow-up-email"
      heading="Write an interview follow-up email that sounds native"
      subheading="Paste your thank-you or follow-up email draft. Get it back polite, brief, and natural — free, no signup."
    />
  );
}
