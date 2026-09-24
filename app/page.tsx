import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NativeApply",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI tool that rewrites cover letters, resume bullet points, and recruiter messages so they sound like a native English speaker wrote them.",
  offers: [
    { "@type": "Offer", price: "14", priceCurrency: "USD", name: "Monthly" },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home />
    </>
  );
}
