import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Container } from "@/components/ui/Primitives";
import { SUPPORT_EMAIL } from "@/lib/constants";

type FooterLink = { href: string; label: string; external?: boolean };

const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { href: "/#tool", label: "Rewrite your text" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#examples", label: "Before and after" },
      { href: "/checkout", label: "Pricing" },
      { href: "/restore", label: "Restore Pro" },
    ],
  },
  {
    title: "Use cases",
    links: [
      { href: "/cover-letter-for-non-native-speakers", label: "Cover letter rewriter" },
      { href: "/native-sounding-resume", label: "Resume rewriter" },
      { href: "/cv-english-rewriter", label: "CV rewriter" },
      { href: "/ats-friendly-resume-bullet-points", label: "ATS resume bullet points" },
      { href: "/recruiter-message-rewriter", label: "Recruiter message rewriter" },
      { href: "/linkedin-connection-message-rewriter", label: "LinkedIn message rewriter" },
      { href: "/interview-follow-up-email-generator", label: "Interview follow-up email" },
      { href: "/job-application-letter-rewriter", label: "Job application letter" },
      { href: "/visa-sponsorship-cover-letter", label: "Visa sponsorship cover letter" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "https://www.nimbuslabsai.com", label: "Nimbus Labs", external: true },
      { href: "https://www.retoneai.net", label: "Retone — AI text rewriter", external: true },
      { href: `mailto:${SUPPORT_EMAIL}`, label: "Contact support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refunds", label: "Refund Policy" },
    ],
  },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  const className =
    "inline-flex min-h-[2.25rem] items-center text-[0.9375rem] text-muted transition-colors hover:text-navy";
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={className}>
        {link.label}
      </a>
    );
  }
  if (link.href.startsWith("mailto:")) {
    return (
      <a href={link.href} className={className}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ivory">
      <Container size="wide" className="py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_repeat(4,1fr)] lg:gap-8">
          <div className="max-w-xs">
            <Logo size={34} />
            <p className="mt-4 text-[0.9375rem] leading-6 text-muted">
              Professional English for job applications — without changing a single fact you wrote.
            </p>
            <p className="mt-5 text-sm text-muted-soft">
              A{" "}
              <a
                href="https://www.nimbuslabsai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-muted underline decoration-line-strong underline-offset-4 hover:text-navy"
              >
                Nimbus Labs
              </a>{" "}
              product.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-navy">
                {column.title}
              </h2>
              <ul className="mt-3 flex flex-col gap-0.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-7 text-sm text-muted-soft sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NativeApply. All rights reserved.</p>
          <p>Payments processed by Paddle.com, our Merchant of Record.</p>
        </div>
      </Container>
    </footer>
  );
}
