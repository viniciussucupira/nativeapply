import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "CV English Rewriter | NativeApply",
  description:
    "Free AI tool that rewrites your CV bullet points in the concise, native English style UK and European recruiters expect — without changing your facts or achievements.",
  alternates: { canonical: "/cv-english-rewriter" },
  openGraph: {
    title: "CV English Rewriter",
    description: "Paste your CV bullet points and get them back sounding natural and native — free.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="resume-bullet"
      heading="Make your CV sound native"
      subheading="Paste your CV bullet points. Get them back polished in the concise, native English style recruiters expect — free, no signup."
    />
  );
}
