import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Recruiter Message Rewriter | NativeApply",
  description:
        "AI tool that rewrites your LinkedIn message or follow-up email to a recruiter so it sounds natural, confident, and native — not stiff or overly formal. Free to try, Pro unlocks unlimited rewrites.",
  alternates: { canonical: "/recruiter-message-rewriter" },
  openGraph: {
    title: "Recruiter Message Rewriter",
        description: "Paste your message to a recruiter and get it back sounding natural and native. Free to try, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="linkedin-message"
      heading="Message recruiters like a native speaker"
            subheading="Paste your LinkedIn message or follow-up email. Get it back sounding natural and confident. Free to try, no signup required."
    />
  );
}
