import Home from "@/components/Home";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "NativeApply",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI tool that rewrites cover letters, resume bullet points, and recruiter messages so they sound like a native English speaker wrote them.",
  offers: [
    { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
    { "@type": "Offer", price: "14", priceCurrency: "USD", name: "Monthly" },
    { "@type": "Offer", price: "49", priceCurrency: "USD", name: "Lifetime" },
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
