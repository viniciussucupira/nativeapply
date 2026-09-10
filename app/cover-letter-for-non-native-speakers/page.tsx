import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Cover Letter Help for Non-Native English Speakers | NativeApply",
  description:
    "AI tool that rewrites your cover letter so it sounds like a native English-speaking professional wrote it. $14/month or $49 lifetime, with a free daily rewrite to try it first. Built for non-native speakers applying for jobs in the US, UK, and Europe.",
  alternates: { canonical: "/cover-letter-for-non-native-speakers" },
  openGraph: {
    title: "Cover Letter Help for Non-Native English Speakers",
    description: "Paste your cover letter and get it back sounding natural and professional. $14/month or $49 lifetime — try it free first, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="cover-letter"
      heading="Write a cover letter that sounds native"
      subheading="Paste your cover letter draft. Get it back polished, natural, and professional. $14/month or $49 lifetime — try it free first, no signup required."
      />
    );
}
