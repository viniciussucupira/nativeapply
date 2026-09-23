import { IconChevronDown } from "@/components/ui/Icons";

export type FaqItem = { q: string; a: string };

export default function Faq({
  items,
  withSchema = false,
}: {
  items: FaqItem[];
  withSchema?: boolean;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="mx-auto max-w-3xl">
      {withSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.q}>
            <details className="group rounded-2xl border border-line bg-white open:border-brand-100 open:bg-brand-50/30">
              <summary className="flex min-h-[3.5rem] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-[1.0625rem] font-medium text-navy [&::-webkit-details-marker]:hidden">
                {item.q}
                <IconChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:-rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-[0.9375rem] leading-7 text-muted">{item.a}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
