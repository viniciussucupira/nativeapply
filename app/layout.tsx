import type { Metadata, Viewport } from "next";
// Inter, served from our own domain instead of fonts.googleapis.com: one
// less third party in the request path of a page that promises privacy,
// and no render-blocking stylesheet on someone else's server. Each
// @font-face carries a unicode-range, so a visitor downloads only the
// subset their text needs.
import "@fontsource-variable/inter/wght.css";
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
      "Polish your cover letter, resume, or LinkedIn message in American or British English. Try one rewrite a day free, no email or card. Pro is $14/month.",
    url: SITE_URL,
    siteName: "NativeApply",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NativeApply — Sound Native in Your Job Application",
    description:
      "Polish your cover letter, resume, or LinkedIn message in American or British English. Try one rewrite a day free, no email or card. Pro is $14/month.",
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
