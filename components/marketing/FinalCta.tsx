import { ButtonLink, Container } from "@/components/ui/Primitives";

export default function FinalCta({
  title = "Send the version you would have written in your first language.",
  body = "Paste your draft, read the rewrite, and decide for yourself. Unlimited rewrites are $14 a month, cancel anytime. One free rewrite a day to start.",
  href = "/#tool",
  cta = "Rewrite my text",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
}) {
  return (
    <section className="bg-navy">
      <Container size="wide" className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
          <h2 className="text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.022em] text-white sm:text-[2.125rem]">
            {title}
          </h2>
          <p className="text-[1.0625rem] leading-7 text-brand-100/80">{body}</p>
          <div className="mt-1 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={href} size="lg" variant="onNavy">
              {cta}
            </ButtonLink>
            <ButtonLink
              href="/checkout"
              size="lg"
              className="border border-white/25 bg-transparent text-white hover:bg-white/10"
              variant="ghost"
            >
              See pricing
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
