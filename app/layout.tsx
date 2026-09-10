import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import { Analytics } from '@vercel/analytics/next';

const SITE_URL = "https://www.nativeapply.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
    title: "NativeApply — Sound Native in Your Job Application",
  description:
        "AI tool that rewrites your cover letter, resume bullets, and recruiter messages so they sound like a native English speaker wrote them. Free to try, Pro unlocks unlimited rewrites. Built for non-native professionals applying for jobs in the US, UK, Canada, and Europe.",
  openGraph: {
    title: "NativeApply — Sound Native in Your Job Application",
    description:
            "Paste your cover letter, resume, or LinkedIn message. Get it back polished and natural. Free to try, no signup required.",
    url: SITE_URL,
    siteName: "NativeApply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NativeApply — Sound Native in Your Job Application",
    description:
            "Paste your cover letter, resume, or LinkedIn message. Get it back polished and natural. Free to try, no signup required.",
  },
  verification: {
      google: "PPtQILt6oZAUpSMtxJiEetgcxi5jLKAXjkpSLPreuk0",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white font-sans">
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
