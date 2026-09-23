import Link from "next/link";
import Rewriter from "@/components/rewriter/Rewriter";
import ExamplePair from "@/components/marketing/ExamplePair";
import Faq from "@/components/marketing/Faq";
import FinalCta from "@/components/marketing/FinalCta";
import TrustStrip from "@/components/marketing/TrustStrip";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Primitives";
import { IconArrowRight } from "@/components/ui/Icons";
import { PROFESSIONS, type Profession } from "@/lib/professions";
import {
  DOC_TYPES,
  professionBenefits,
  professionExample,
  professionFaq,
  professionIntro,
  professionPlaceholder,
  type DocKey,
} from "@/lib/profession-content";

const SITE_URL = "https://www.nativeapply.net";

export default function ProfessionPage({
  docKey,
  profession,
}: {
  docKey: DocKey;
  profession: Profession;
}) {
  const doc = DOC_TYPES[docKey];
  const title = `${doc.labelCapitalized} for ${profession.label}`;
  const example = professionExample(doc, profession);
  const benefits = professionBenefits(doc, profession);
  const faq = professionFaq(doc, profession);

  const otherProfessions = PROFESSIONS.filter((p) => p.slug !== profession.slug).slice(0, 8);
  const otherDocs = Object.values(DOC_TYPES).filter((d) => d.key !== doc.key);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "NativeApply", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: title,
        item: `${SITE_URL}/${doc.urlPrefix}/${profession.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <Section tone="white" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(70%_60%_at_50%_0%,rgba(39,100,231,0.07),transparent_70%)]"
        />
        <Container size="wide" className="relative pb-10 pt-8 sm:pb-14 sm:pt-12">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 text-[0.8125rem] text-muted-soft">
              <li>
                <Link href="/" className="hover:text-navy">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-muted">{title}</li>
            </ol>
          </nav>

          <div className="na-rise mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <Eyebrow>{doc.labelCapitalized} rewriter</Eyebrow>
            <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-navy sm:text-[2.75rem]">
              {doc.labelCapitalized} for <span className="na-accent-text">{profession.label}</span>
            </h1>
            <p className="max-w-2xl text-[1.0625rem] leading-7 text-muted sm:text-lg">
              {professionIntro(doc, profession)}
            </p>
            <div className="mt-1 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <ButtonLink href="#tool" size="lg" className="w-full sm:w-auto">
                {doc.ctaLabel}
              </ButtonLink>
              <ButtonLink href="#example" size="lg" variant="secondary" className="w-full sm:w-auto">
                See the example
              </ButtonLink>
            </div>
            <p className="text-[0.875rem] text-muted">
              One free rewrite a day with just your email. Unlimited is $14/month or $49 once.
            </p>
          </div>
        </Container>
      </Section>

      <TrustStrip />

      <Section tone="white" id="tool" className="scroll-mt-20">
        <Container size="wide" className="py-12 sm:py-16">
          <Rewriter
            initialContext={doc.context}
            lockContext
            placeholder={professionPlaceholder(doc, profession)}
          />
        </Container>
      </Section>

      <Section tone="ivory">
        <Container size="wide" className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="What changes"
            title={`What the rewrite does to a ${profession.singular.replace(/^an? /, "")}'s ${doc.label}`}
          />
          <div className="mt-11 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.title} delay={index * 60}>
                <div className="flex h-full flex-col gap-2.5 rounded-2xl border border-line bg-white p-6">
                  <h3 className="text-[1.0625rem] font-semibold text-navy">{benefit.title}</h3>
                  <p className="text-[0.9375rem] leading-6 text-muted">{benefit.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white" id="example" className="scroll-mt-20">
        <Container size="wide" className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Before and after"
            title="The same content, in native English"
            description="Marked words show what changed. Every name, date, and number is identical on both sides."
          />
          <div className="mt-10">
            <ExamplePair example={example} />
          </div>
        </Container>
      </Section>

      <Section tone="ivory">
        <Container size="wide" className="py-16 sm:py-20">
          <SectionHeading eyebrow="Questions" title={`${title}: common questions`} />
          <div className="mt-10">
            <Faq items={faq} withSchema />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container size="wide" className="py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">
                Other documents for {profession.label.toLowerCase()}
              </h2>
              <ul className="mt-5 flex flex-wrap gap-3">
                {otherDocs.map((other) => (
                  <li key={other.key}>
                    <Link
                      href={`/${other.urlPrefix}/${profession.slug}`}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 text-[0.875rem] font-medium text-navy transition-colors hover:border-brand-300 hover:bg-brand-50/60"
                    >
                      {other.labelCapitalized}
                      <IconArrowRight className="h-4 w-4 text-brand" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-muted">
                {doc.labelCapitalized} for other professions
              </h2>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {otherProfessions.map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/${doc.urlPrefix}/${other.slug}`}
                      className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3.5 py-1.5 text-[0.8125rem] font-medium text-muted transition-colors hover:border-brand-300 hover:text-navy"
                    >
                      {other.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <FinalCta href="#tool" cta={doc.ctaLabel} />
    </>
  );
}
