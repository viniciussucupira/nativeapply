import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Job Application Letter Rewriter | NativeApply",
  description:
        "AI tool that rewrites your job application letter so it reads naturally and professionally in English, without changing your facts or experience. Free to try, Pro unlocks unlimited rewrites.",
  alternates: { canonical: "/job-application-letter-rewriter" },
  openGraph: {
    title: "Job Application Letter Rewriter",
        description: "Paste your job application letter and get it back sounding natural and confident. Free to try, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="cover-letter"
      heading="Rewrite your job application letter in native English"
            subheading="Paste the letter you're about to send. Get it back polished, natural, and professional. Free to try, no signup required."
    />
  );
}
