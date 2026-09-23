import type { ReactNode } from "react";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { IconChevronDown } from "@/components/ui/Icons";

export type LegalSection = {
  id: string;
  heading: string;
  body: ReactNode;
};

export default function LegalLayout({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Section tone="ivory">
        <Container size="wide" className="py-12 sm:py-16">
          <div className="max-w-3xl">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-navy sm:text-[2.5rem]">
              {title}
            </h1>
            <p className="mt-4 text-[1.0625rem] leading-7 text-muted">{intro}</p>
            <p className="mt-5 inline-flex items-center rounded-full border border-line bg-white px-3 py-1.5 text-[0.8125rem] font-medium text-muted">
              Last updated: {updated}
            </p>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container size="wide" className="py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
            {/* desktop table of contents */}
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted-soft">
                  On this page
                </p>
                <ol className="mt-4 flex flex-col gap-1 border-l border-line">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l border-transparent py-1.5 pl-4 text-[0.875rem] leading-6 text-muted transition-colors hover:border-brand hover:text-navy"
                      >
                        {section.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {/* mobile table of contents */}
            <details className="group rounded-2xl border border-line bg-white lg:hidden">
              <summary className="flex min-h-[3.25rem] cursor-pointer list-none items-center justify-between px-5 py-3.5 text-[0.9375rem] font-semibold text-navy [&::-webkit-details-marker]:hidden">
                On this page
                <IconChevronDown className="h-5 w-5 text-muted transition-transform group-open:-rotate-180" />
              </summary>
              <ol className="flex flex-col gap-0.5 px-5 pb-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="flex min-h-11 items-center text-[0.9375rem] text-muted hover:text-navy"
                    >
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <article className="max-w-[44rem]">
              {sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-line py-7 first:pt-0 last:border-0">
                  <h2 className="text-[1.25rem] font-semibold tracking-[-0.015em] text-navy">{section.heading}</h2>
                  <div className="mt-3 flex flex-col gap-4 text-[1rem] leading-7 text-muted [&_a]:font-medium [&_a]:text-brand-700 [&_a]:underline [&_a]:underline-offset-4">
                    {section.body}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
