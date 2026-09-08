import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "ATS-Friendly Resume Bullet Points | NativeApply",
  description:
        "AI tool that rewrites your resume bullet points in clear, keyword-friendly native English that reads well to both applicant tracking systems and hiring managers. Free to try, Pro unlocks unlimited rewrites.",
  alternates: { canonical: "/ats-friendly-resume-bullet-points" },
  openGraph: {
    title: "ATS-Friendly Resume Bullet Points",
    description:
            "Paste your resume bullet points and get them back concise, native-sounding, and easy for ATS software to parse. Free to try, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="resume-bullet"
      heading="Write ATS-friendly resume bullet points that sound native"
            subheading="Paste your resume bullet points. Get them back in the concise, native English style both applicant tracking systems and recruiters expect. Free to try, no signup required."
    />
  );
}
