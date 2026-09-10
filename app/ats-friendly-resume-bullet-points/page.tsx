import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "ATS-Friendly Resume Bullet Points | NativeApply",
  description:
    "AI tool that rewrites your resume bullet points in clear, keyword-friendly native English that reads well to both applicant tracking systems and hiring managers. $14/month or $49 lifetime, with a free daily rewrite to try it first.",
  alternates: { canonical: "/ats-friendly-resume-bullet-points" },
  openGraph: {
    title: "ATS-Friendly Resume Bullet Points",
    description:
      "Paste your resume bullet points and get them back concise, native-sounding, and easy for ATS software to parse. $14/month or $49 lifetime — try it free first, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="resume-bullet"
      heading="Write ATS-friendly resume bullet points that sound native"
      subheading="Paste your resume bullet points. Get them back in the concise, native English style both applicant tracking systems and recruiters expect. $14/month or $49 lifetime — try it free first, no signup required."
      />
    );
}
