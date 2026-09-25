import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { Container } from "@/components/ui/Primitives";
import MoreFromUs from "@/components/MoreFromUs";

type FooterLink = { href: string; label: string; external?: boolean };
const PRODUCT: FooterLink[] = [
  { href: "/#tool", label: "Rewrite your text" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#examples", label: "Before & after" },
  { href: "/checkout", label: "Pricing" },
];
const DOCUMENTS: FooterLink[] = [
  { href: "/cover-letter-for-non-native-speakers", label: "Cover letters" },
  { href: "/native-sounding-resume", label: "Resume bullets" },
  { href: "/cv-english-rewriter", label: "CV writing" },
  { href: "/ats-friendly-resume-bullet-points", label: "ATS-friendly bullets" },
  { href: "/visa-sponsorship-cover-letter", label: "Visa sponsorship" },
  { href: "/job-application-letter-rewriter", label: "Application letters" },
];
const MESSAGES: FooterLink[] = [
  { href: "/recruiter-message-rewriter", label: "Recruiter messages" },
  { href: "/linkedin-connection-message-rewriter", label: "LinkedIn messages" },
  { href: "/interview-follow-up-email-generator", label: "Interview follow-ups" },
];
const HELP: FooterLink[] = [
  { href: "/restore", label: "Restore Pro access" },
  { href: "/subscription", label: "Access & billing" },
  { href: "/subscription#cancel", label: "Cancel subscription" },
  { href: "/subscription#refund", label: "Request a refund" },
  { href: "/support", label: "Contact support" },
];
const LEGAL: FooterLink[] = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refunds", label: "Refund Policy" },
];
function FooterAnchor({ link }: { link: FooterLink }) {
  const className = "inline-flex min-h-11 items-center rounded-sm py-2 text-sm leading-5 text-muted transition-colors hover:text-brand-700 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 lg:min-h-9 lg:py-1.5";
  if (link.external || link.href.startsWith("mailto:")) return <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noopener noreferrer" : undefined} className={className}>{link.label}</a>;
  return <Link href={link.href} className={className}>{link.label}</Link>;
}
function LinkList({ links }: { links: FooterLink[] }) {
  return <ul>{links.map(link => <li key={link.href}><FooterAnchor link={link} /></li>)}</ul>;
}
const headingClass = "mb-3 text-xs font-semibold leading-5 text-navy";

export default function Footer() {
  return <footer className="border-t border-line bg-brand-50/40">
    <Container size="wide" className="pt-12 sm:pt-16">
      <div className="grid items-start gap-x-8 gap-y-7 pb-6 sm:grid-cols-2 lg:grid-cols-[1.1fr_.75fr_2fr_1fr] lg:gap-x-7">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo size={36} />
          <p className="mt-4 max-w-64 text-sm leading-6 text-muted">Clear, natural English.<br />More confidence in your next application.</p>
          <div className="mt-4 border-l-2 border-brand-100 pl-3 text-xs leading-6 text-muted">
            <p>A <a href="https://nimbuslabsai.com/products" className="font-medium text-navy underline decoration-line-strong underline-offset-4 hover:text-brand-700">Nimbus Labs</a> product.</p>
          </div>
        </div>
        <nav aria-label="Product">
          <h2 className={headingClass}>Explore</h2>
          <LinkList links={PRODUCT} />
        </nav>
        <nav aria-label="Writing tools" className="order-last sm:col-span-2 lg:order-none lg:col-span-1">
          <div className="grid grid-cols-2 gap-x-5 lg:gap-x-4">
            <div>
              <h2 className={headingClass}>Resumes &amp; letters</h2>
              <LinkList links={DOCUMENTS} />
            </div>
            <div>
              <h2 className={headingClass}>Messages &amp; follow-ups</h2>
              <LinkList links={MESSAGES} />
            </div>
          </div>
        </nav>
        <nav aria-label="Access and support" className="rounded-2xl border border-brand-100 bg-white p-5 lg:-mt-4 lg:p-4">
          <h2 className={headingClass}>Access & help</h2>
          <LinkList links={HELP} />
        </nav>
      </div>
      <div className="text-muted"><MoreFromUs /></div>
      <div className="border-t border-line py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted">© {new Date().getFullYear()} NativeApply. All rights reserved.</p>
          <nav aria-label="Legal"><ul className="flex flex-wrap gap-x-5">{LEGAL.map(link => <li key={link.href}><FooterAnchor link={link} /></li>)}</ul></nav>
        </div>
        <p className="mt-1 text-xs leading-6 text-muted">Payments securely processed by Paddle, our Merchant of Record.</p>
      </div>
    </Container>
  </footer>;
}
