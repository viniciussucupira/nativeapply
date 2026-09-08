import type { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "LinkedIn Connection Message Rewriter | NativeApply",
  description:
        "AI tool that rewrites your LinkedIn connection request or networking message so it sounds natural, confident, and native — not stiff or overly formal. Free to try, Pro unlocks unlimited rewrites.",
  alternates: { canonical: "/linkedin-connection-message-rewriter" },
  openGraph: {
    title: "LinkedIn Connection Message Rewriter",
    description:
            "Paste your LinkedIn connection request or networking message and get it back sounding natural and native. Free to try, no signup required.",
  },
};

export default function Page() {
  return (
    <Home
      initialContext="linkedin-message"
      heading="Write LinkedIn connection messages like a native speaker"
            subheading="Paste your connection request or networking message. Get it back sounding natural and confident. Free to try, no signup required."
    />
  );
}
