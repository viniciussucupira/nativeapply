import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Make Your Resume Sound Native | NativeApply",
  description:
    "Free AI tool that rewrites your resume bullet points to match the concise, native English style US and European recruiters expect — without changing your facts or achievements.",
  alternates: { canonical: "/native-sounding-resume" },
  openGraph: {
    title: "Make Your Resume Sound Native",
    description: "Paste your resume bullet points and get them back sounding natural and native — free.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="resume-bullet"
      heading="Make your resume sound native"
      subheading="Paste your resume bullet points. Get them back polished in the concise, native English style recruiters expect — free, no signup."
    />
  );
}
