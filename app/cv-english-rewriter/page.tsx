import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "CV English Rewriter | NativeApply",
  description:
    "AI tool that rewrites your CV bullet points in the concise, native English style UK and European recruiters expect — without changing your facts or achievements. $14/month or $49 lifetime, with a free daily rewrite to try it first.",
  alternates: { canonical: "/cv-english-rewriter" },
  openGraph: {
    title: "CV English Rewriter",
    description: "Paste your CV bullet points and get them back sounding natural and native. $14/month or $49 lifetime — try it free first, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="resume-bullet"
      heading="Make your CV sound native"
      subheading="Paste your CV bullet points. Get them back polished in the concise, native English style recruiters expect. $14/month or $49 lifetime — try it free first, no signup required."
      />
    );
}
