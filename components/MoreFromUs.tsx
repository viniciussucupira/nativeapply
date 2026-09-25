"use client";

import { usePathname } from "next/navigation";

const products = [
  [
    "Retone",
    "https://retoneai.net/",
    "Polish everyday work emails and messages."
  ],
  [
    "NativeReply",
    "https://nativereply.net/",
    "Help your team write clear customer replies."
  ],
  ["Nimbus Labs","https://nimbuslabsai.com/","Create a store for digital products and services."],
  ["Kudobox","https://getkudobox.com/","Collect and display customer testimonials."]
];

export default function MoreFromUs() {
  const pathname = usePathname() || "/";
  // Keep purchase, account, recovery, and customer-facing flows focused.
  if (/^\/(checkout|subscription|restore|access|activate|signin|sign-in|welcome|join|team|studio|dashboard|start|thanks|success|recover|f|s|wall|embed|add|save)(\/|$)/.test(pathname) || pathname === "/products") return null;

  return (
    <nav aria-label="More from us" className="mt-10 border-t border-line pt-7">
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <div><h2 className="text-sm font-semibold text-ink">More from Nimbus Labs</h2><p className="family-products-intro">Thoughtful tools for your next step.</p></div>
        <a href="https://nimbuslabsai.com/products" className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-4" style={{ display: "inline-flex", alignItems: "center", minHeight: 44, fontSize: 13, textDecoration: "underline", textUnderlineOffset: 4 }}>Explore all our products <span aria-hidden="true" style={{ marginLeft: 6 }}>→</span></a>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {products.map(([name, href, description]) => (
          <li key={href}>
            <a href={href} className="block h-full rounded-lg border border-line bg-white p-4 text-[0.8125rem] leading-relaxed transition-colors hover:border-brand/40 hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-4">
              <span className="family-product-heading"><span aria-hidden="true" className="family-product-mark" data-product={name}>{name === "NativeApply" ? "NA" : name === "NativeReply" ? "NR" : name === "Nimbus Labs" ? "N" : name === "Kudobox" ? "K" : "R"}</span><span>{name}</span><span aria-hidden="true" className="family-product-arrow">↗</span></span>
              <span className="mt-1.5 block text-muted">{description}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
