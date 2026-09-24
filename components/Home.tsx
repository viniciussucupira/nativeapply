import Link from "next/link";
import Rewriter from "@/components/rewriter/Rewriter";
import HeroDemo from "@/components/marketing/HeroDemo";
import AnnotatedLetter from "@/components/marketing/AnnotatedLetter";
import TrustStrip from "@/components/marketing/TrustStrip";
import BeforeAfterTabs from "@/components/marketing/BeforeAfterTabs";
import DeviceShowcase from "@/components/marketing/DeviceShowcase";
import FinalCta from "@/components/marketing/FinalCta";
import Faq from "@/components/marketing/Faq";
import Reveal from "@/components/ui/Reveal";
import {
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  Pill,
  Section,
  SectionHeading,
} from "@/components/ui/Primitives";
import {
  IconCheck,
  IconCoverLetter,
  IconFacts,
  IconFollowUpEmail,
  IconLock,
  IconRecruiterMessage,
  IconResumeBullets,
  IconShield,
  IconClock,
} from "@/components/ui/Icons";
import { FREE_PLAN, MONTHLY_PLAN } from "@/lib/plans";
import { HOME_FAQ } from "@/lib/faq";

const USE_CASES = [
  {
    Icon: IconCoverLetter,
    title: "Cover letters",
    body: "The opening paragraph that decides whether a hiring manager keeps reading.",
    href: "/cover-letter-for-non-native-speakers",
    tint: "bg-brand-50 text-brand",
    hover: "hover:border-brand-300 hover:bg-brand-50/40",
    link: "text-brand-700",
  },
  {
    Icon: IconResumeBullets,
    title: "Resume and CV bullets",
    body: "Short, direct lines that start with a verb and keep every number you earned.",
    href: "/native-sounding-resume",
    tint: "bg-jade-50 text-jade",
    hover: "hover:border-jade-100 hover:bg-jade-50/40",
    link: "text-jade",
  },
  {
    Icon: IconRecruiterMessage,
    title: "Recruiter and LinkedIn messages",
    body: "Brief, warm notes that read like a colleague wrote them, not a template.",
    href: "/recruiter-message-rewriter",
    tint: "bg-violet-50 text-violet",
    hover: "hover:border-violet-100 hover:bg-violet-50/40",
    link: "text-violet",
  },
  {
    Icon: IconFollowUpEmail,
    title: "Interview follow-ups",
    body: "Polite thank-you notes that stay on the right side of persistent.",
    href: "/interview-follow-up-email-generator",
    tint: "bg-amber-50 text-amber",
    hover: "hover:border-amber-100 hover:bg-amber-50/40",
    link: "text-amber",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Paste",
    body: "Drop in your cover letter, resume bullets, LinkedIn note, or follow-up email — in the English you already wrote.",
    badge: "bg-brand-50 text-brand-700",
    rule: "from-brand to-brand-300",
  },
  {
    n: "02",
    title: "Rewrite",
    body: "Grammar, word choice, and tone are corrected to the register a native professional uses. Your facts stay untouched.",
    badge: "bg-violet-50 text-violet",
    rule: "from-violet to-violet-100",
  },
  {
    n: "03",
    title: "Apply",
    body: "Copy the result, or send it straight to email or WhatsApp, and get on with the application.",
    badge: "bg-jade-50 text-jade",
    rule: "from-jade to-jade-100",
  },
];

const PRIVACY_POINTS = [
  {
    Icon: IconShield,
    title: "Nothing is kept",
    body: "Your draft is not written to any NativeApply database or log. Close the tab and there is nothing of it on our side.",
    tint: "bg-jade-50 text-jade",
  },
  {
    Icon: IconLock,
    title: "Sent only to produce the rewrite",
    body: "Your text goes to our AI provider, Anthropic, for the single purpose of rewriting it — and to nobody else.",
    tint: "bg-brand-50 text-brand",
  },
  {
    Icon: IconFacts,
    title: "Never used for training",
    body: "We train nothing on your writing, and under Anthropic's API terms neither do they.",
    tint: "bg-violet-50 text-violet",
  },
  {
    Icon: IconClock,
    title: "Card details never touch us",
    body: "Payments run through Paddle.com, our Merchant of Record. We never see your card.",
    tint: "bg-amber-50 text-amber",
  },
];

function PlanCard({
  name,
  price,
  cadence,
  summary,
  features,
  highlight = false,
  cta,
  href,
  footnote,
}: {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  highlight?: boolean;
  cta: string;
  href: string;
  footnote?: string;
}) {
  return (
    <div
      className={
        "relative flex flex-col rounded-2xl border p-6 sm:p-7 " +
        (highlight
          ? "border-brand bg-white shadow-[0_28px_70px_-50px_rgba(16,35,63,0.6)] lg:-my-3 lg:py-9"
          : "border-line bg-white")
      }
    >
      {highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-brand px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white">
          Cancel anytime
        </span>
      )}
      <p className="text-[0.9375rem] font-semibold text-navy">{name}</p>
      <p className="mt-3 flex items-baseline gap-1.5">
        <span className="text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-navy">{price}</span>
        <span className="text-sm text-muted">{cadence}</span>
      </p>
      <p className="mt-3 text-[0.9375rem] leading-6 text-muted">{summary}</p>
      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem] leading-6 text-ink">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            {feature}
          </li>
        ))}
      </ul>
      <ButtonLink
        href={href}
        size="lg"
        variant={highlight ? "primary" : "secondary"}
        className="mt-7 w-full"
      >
        {cta}
      </ButtonLink>
      {footnote && <p className="mt-3 text-center text-[0.8125rem] text-muted">{footnote}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------------- hero ---------------- */}
      <Section tone="white" className="relative overflow-hidden">
        <div className="na-aurora" aria-hidden="true">
          <span className="na-orb-blue" />
          <span className="na-orb-jade" />
          <span className="na-orb-amber" />
        </div>
        <Container size="wide" className="relative py-12 sm:py-16 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div className="na-rise flex flex-col items-start gap-6">
              <Pill>
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                For professionals whose first language is not English
              </Pill>
              <h1 className="text-[2.25rem] font-semibold leading-[1.08] tracking-[-0.03em] text-navy sm:text-[3rem] lg:text-[3.5rem]">
                Send job applications that read like{" "}
                <span className="na-accent-text">native English</span>.
              </h1>
              <p className="max-w-xl text-[1.0625rem] leading-7 text-muted sm:text-lg">
                NativeApply rewrites your cover letters, resume bullets, and recruiter messages into the English a
                hiring manager in the US, UK, Canada, or Europe expects — without changing a single fact you wrote.
              </p>

              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <ButtonLink href="#tool" size="lg" className="w-full sm:w-auto">
                  Rewrite my text
                </ButtonLink>
                <ButtonLink href="#examples" size="lg" variant="secondary" className="w-full sm:w-auto">
                  See an example
                </ButtonLink>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.875rem] text-muted">
                {[
                  "No password required",
                  "1 free rewrite every day",
                  "Your text is not stored",
                  "Your facts and numbers stay unchanged",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <IconCheck className="h-4 w-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="na-rise" style={{ animationDelay: "0.12s" }}>
              <HeroDemo />
            </div>
          </div>
        </Container>
      </Section>

      <TrustStrip />

      {/* ---------------- the tool ---------------- */}
      <Section tone="white" id="tool" className="scroll-mt-20">
        <Container size="wide" className="py-14 sm:py-20">
          <SectionHeading
            eyebrow="Try it on your own words"
            title="Paste your draft. Read the difference."
            description="One rewrite a day is free, with just your email. Unlimited rewrites are $14 a month, cancel anytime."
          />
          <div className="mt-9">
            <Rewriter />
          </div>
        </Container>
      </Section>

      {/* ---------------- narrative ---------------- */}
      <Section tone="ivory">
        <Container size="wide" className="py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <AnnotatedLetter />
            </Reveal>

            <Reveal delay={80}>
              <div className="flex flex-col gap-5">
                <Eyebrow>From draft to confident English</Eyebrow>
                <h2 className="text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.022em] text-navy sm:text-[2.125rem]">
                  You know what you want to say. This makes it sound that way.
                </h2>
                <p className="text-[1.0625rem] leading-7 text-muted">
                  A strong application can still land badly for reasons that have nothing to do with the experience
                  behind it — a preposition out of place, a phrase translated word for word, a tone that reads
                  stiffer than you meant it.
                </p>
                <p className="text-[1.0625rem] leading-7 text-muted">
                  NativeApply fixes exactly that layer and nothing else. It does not write your application for you,
                  invent achievements, or inflate what you did. It takes your meaning and puts it in the English a
                  native professional would have used.
                </p>
                <ul className="mt-1 flex flex-col gap-3">
                  {[
                    "Grammar, articles, and prepositions corrected",
                    "Translated-sounding phrasing replaced with natural wording",
                    "Tone matched to the document — a cover letter is not a LinkedIn note",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-6 text-ink">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------- steps ---------------- */}
      <Section tone="white" id="how-it-works" className="scroll-mt-20">
        <Container size="wide" className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps, about a minute"
            description="No account to create, no onboarding, no template library to learn."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <Reveal key={step.n} delay={index * 70}>
                <div className="relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-line bg-white p-6">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${step.rule}`}
                  />
                  <span
                    className={`mt-1 grid h-10 w-10 place-items-center rounded-full text-[0.8125rem] font-semibold tracking-[0.08em] ${step.badge}`}
                  >
                    {step.n}
                  </span>
                  <h3 className="text-lg font-semibold text-navy">{step.title}</h3>
                  <p className="text-[0.9375rem] leading-6 text-muted">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------- before and after ---------------- */}
      <Section tone="ivory" id="examples" className="relative overflow-hidden scroll-mt-20">
        <div className="na-aurora" aria-hidden="true">
          <span className="na-orb-violet" />
          <span className="na-orb-jade" />
        </div>
        <Container size="wide" className="relative py-16 sm:py-24">
          <SectionHeading
            eyebrow="Before and after"
            title="Before and after, four kinds of document"
            description="Worked examples, one per document type. Marked words show what the rewrite changes; names, dates and numbers are identical on both sides."
          />
          <div className="mt-10">
            <BeforeAfterTabs />
          </div>
        </Container>
      </Section>

      {/* ---------------- use cases ---------------- */}
      <Section tone="white" id="use-cases" className="scroll-mt-20">
        <Container size="wide" className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="What it handles"
            title="The four documents a job search actually needs"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {USE_CASES.map(({ Icon, title, body, href, tint, hover, link }, index) => (
              <Reveal key={title} delay={index * 60}>
                <Link
                  href={href}
                  className={`group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-6 transition-[background-color,border-color,transform] duration-200 hover:-translate-y-0.5 ${hover}`}
                >
                  <span className={`na-blob grid h-12 w-12 shrink-0 place-items-center ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[1.0625rem] font-semibold text-navy">{title}</span>
                    <span className="text-[0.9375rem] leading-6 text-muted">{body}</span>
                    <span className={`mt-1 text-[0.875rem] font-semibold underline-offset-4 group-hover:underline ${link}`}>
                      Open this rewriter
                    </span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------------- meaning preserved ---------------- */}
      <Section tone="navy" className="relative overflow-hidden">
        <div className="na-aurora" aria-hidden="true">
          <span className="na-orb-night-blue" />
          <span className="na-orb-night-jade" />
        </div>
        <Container size="wide" className="relative py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <SectionHeading
              align="left"
              onDark
              eyebrow="What never changes"
              title="Your name, your dates, your numbers."
              description="A rewriting tool that quietly edits a figure on your resume is worse than no tool at all. NativeApply changes how a sentence reads, never what it claims."
            />
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-300">You wrote</p>
                <p className="mt-2 text-[0.9375rem] leading-7 text-white/85">
                  “I was responsible for the reduction of 23% in the costs of the logistic team in 2024.”
                </p>
              </div>
              <div className="rounded-2xl border border-white/12 bg-white/[0.06] p-5">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-brand-300">
                  It comes back
                </p>
                <p className="mt-2 text-[0.9375rem] leading-7 text-white">
                  “Cut logistics team costs by 23% in 2024.”
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {["23% kept", "2024 kept", "No claim added"].map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-2.5 py-1 text-[0.6875rem] font-medium text-white/85"
                    >
                      <IconCheck className="h-3 w-3" />
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-[0.875rem] leading-6 text-brand-100/70">
                Read every rewrite before you send it. It is your application, and you are the last check.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* ---------------- privacy ---------------- */}
      <Section tone="white">
        <Container size="wide" className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="Privacy"
            title="Your job search is nobody else's business"
            description="You are pasting the most personal document of your professional life. Here is exactly where it goes."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVACY_POINTS.map(({ Icon, title, body, tint }, index) => (
              <Reveal key={title} delay={index * 60}>
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className={`na-blob grid h-11 w-11 place-items-center ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-[1rem] font-semibold text-navy">{title}</h3>
                  <p className="text-[0.9375rem] leading-6 text-muted">{body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-center text-[0.875rem] text-muted">
            The full detail is in the{" "}
            <Link href="/privacy" className="font-medium text-brand-700 underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </Container>
      </Section>

      {/* ---------------- devices ---------------- */}
      <Section tone="ivory" className="relative overflow-hidden">
        <div className="na-aurora" aria-hidden="true">
          <span className="na-orb-amber" />
        </div>
        <Container size="wide" className="relative py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="flex flex-col gap-5">
              <Eyebrow>Anywhere you apply</Eyebrow>
              <h2 className="text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.022em] text-navy sm:text-[2.125rem]">
                On the laptop at home, on the phone on the way to the interview.
              </h2>
              <p className="text-[1.0625rem] leading-7 text-muted">
                The same editor, the same result, no app to install. Rewrite a recruiter message while you wait for
                the train and send it from the phone you are holding.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Works in any modern browser",
                  "Copy it, or send it by email or WhatsApp in one tap",
                  "Pro follows you: switch it on elsewhere with your Paddle receipt",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.9375rem] leading-6 text-ink">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Reveal>
              <DeviceShowcase />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ---------------- plans ---------------- */}
      <Section tone="white" id="pricing" className="scroll-mt-20">
        <Container size="wide" className="py-16 sm:py-24">
          <SectionHeading
            eyebrow="Pricing"
            title="Unlimited rewrites for $14 a month"
            description="One paid plan, everything included. Try it free first, and cancel whenever your job search ends."
          />
          <div className="mx-auto mt-12 max-w-md">
            <PlanCard
              name={MONTHLY_PLAN.name}
              price={MONTHLY_PLAN.price}
              cadence={MONTHLY_PLAN.cadence}
              summary={MONTHLY_PLAN.summary}
              features={MONTHLY_PLAN.features}
              cta="Subscribe monthly"
              href="/checkout"
              highlight
              footnote="Full refund within 14 days of your first payment."
            />
          </div>
          <div className="mx-auto mt-6 flex max-w-md flex-col gap-2 rounded-2xl border border-line bg-ivory p-5 text-center">
            <p className="text-[0.9375rem] font-semibold text-navy">Want to see it on your own text first?</p>
            <p className="text-[0.9375rem] leading-6 text-muted">
              {FREE_PLAN.features[0]}, with just your email — no password, no card. Then decide.
            </p>
            <Link
              href="#tool"
              className="mt-1 text-[0.9375rem] font-semibold text-brand-700 underline underline-offset-4"
            >
              Try one rewrite now
            </Link>
          </div>
          <p className="mt-8 text-center text-[0.875rem] text-muted">
            Secure payment by Paddle.com, our Merchant of Record. NativeApply never stores your card details.{" "}
            <Link href="/checkout" className="font-medium text-brand-700 underline underline-offset-4">
              Full pricing details
            </Link>
          </p>
        </Container>
      </Section>

      {/* ---------------- faq ---------------- */}
      <Section tone="ivory">
        <Container size="wide" className="py-16 sm:py-24">
          <SectionHeading eyebrow="Questions" title="Before you paste anything" />
          <div className="mt-10">
            <Faq items={HOME_FAQ} withSchema />
          </div>
        </Container>
      </Section>

      <FinalCta />
    </>
  );
}
