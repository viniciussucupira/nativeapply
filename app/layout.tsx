import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

const SITE_URL = "https://www.nativeapply.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NativeApply — Sound Native in Your Job Application | Free AI Tool",
  description:
    "Free AI tool that rewrites your cover letter, resume bullets, and recruiter messages so they sound like a native English speaker wrote them. Built for non-native professionals applying for jobs in the US, UK, Canada, and Europe.",
  openGraph: {
    title: "NativeApply — Sound Native in Your Job Application",
    description:
      "Paste your cover letter, resume, or LinkedIn message. Get it back polished and natural — free, no signup.",
    url: SITE_URL,
    siteName: "NativeApply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NativeApply — Sound Native in Your Job Application",
    description:
      "Paste your cover letter, resume, or LinkedIn message. Get it back polished and natural — free, no signup.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}
