import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Make Your Resume Sound Native | NativeApply",
  description:
    "AI tool that rewrites your resume bullet points to match the concise, native English style US and European recruiters expect — without changing your facts or achievements. $14/month or $49 lifetime, with a free daily rewrite to try it first.",
  alternates: { canonical: "/native-sounding-resume" },
  openGraph: {
    title: "Make Your Resume Sound Native",
    description: "Paste your resume bullet points and get them back sounding natural and native. $14/month or $49 lifetime — try it free first, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="resume-bullet"
      heading="Make your resume sound native"
      subheading="Paste your resume bullet points. Get them back polished in the concise, native English style recruiters expect. $14/month or $49 lifetime — try it free first, no signup required."
      />
    );
}
