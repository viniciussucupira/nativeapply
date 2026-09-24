import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { Analytics } from "@vercel/analytics/next";

const SITE_URL = "https://www.nativeapply.net";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "NativeApply — Sound Native in Your Job Application",
  description:
    "AI tool that rewrites your cover letter, resume bullets, and recruiter messages so they sound like a native English speaker wrote them. $14/month, with a free daily rewrite to try it first. Built for non-native professionals applying for jobs in the US, UK, Canada, and Europe.",
  openGraph: {
    title: "NativeApply — Sound Native in Your Job Application",
    description:
      "Paste your cover letter, resume, or LinkedIn message. Get it back polished and natural. $14/month — try it free first with just your email, no password.",
    url: SITE_URL,
    siteName: "NativeApply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NativeApply — Sound Native in Your Job Application",
    description:
      "Paste your cover letter, resume, or LinkedIn message. Get it back polished and natural. $14/month — try it free first with just your email, no password.",
  },
  verification: {
    google: "PPtQILt6oZAUpSMtxJiEetgcxi5jLKAXjkpSLPreuk0",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Inter is loaded here, in the root layout, so it applies to every
            route. The rule below is written for the pages router, where a font
            link in a single page would not be shared — not the case here. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="flex min-h-full flex-col bg-white text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
