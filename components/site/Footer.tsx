import Link from "next/link";
import Logo from "@/components/ui/Logo";
import MoreFromUs from "@/components/MoreFromUs";

const EXPLORE = [
  ["/#tool", "Rewrite your text"],
  ["/#how-it-works", "How it works"],
  ["/#examples", "Before & after"],
  ["/checkout", "Plans & pricing"],
];
const WRITING = [
  ["/cover-letter-for-non-native-speakers", "Cover letters"],
  ["/recruiter-message-rewriter", "Recruiter messages"],
  ["/native-sounding-resume", "Resume bullets"],
  ["/linkedin-connection-message-rewriter", "LinkedIn messages"],
  ["/cv-english-rewriter", "CV writing"],
  ["/interview-follow-up-email-generator", "Interview follow-ups"],
  ["/ats-friendly-resume-bullet-points", "ATS-friendly bullets"],
  ["/job-application-letter-rewriter", "Application letters"],
  ["/visa-sponsorship-cover-letter", "Visa sponsorship"],
];
const HELP = [
  ["/restore", "Restore Pro access"],
  ["/subscription", "Access & billing"],
  ["/subscription#cancel", "Cancel subscription"],
  ["/subscription#refund", "Request a refund"],
  ["/support", "Contact support"],
];
const LEGAL = [["/terms", "Terms of Service"], ["/privacy", "Privacy Policy"], ["/refunds", "Refund Policy"]];
const linkClass = "inline-flex min-h-11 items-center rounded-sm text-sm leading-6 text-muted transition-colors hover:text-brand-700 hover:underline underline-offset-4";
const headingClass = "mb-3 text-sm font-semibold leading-6 text-ink";
function Links({ items, columns = false }: { items: string[][]; columns?: boolean }) {
  return <ul className={columns ? "grid grid-cols-2 gap-x-5" : "grid"}>{items.map(([href, label]) => <li key={href}><Link href={href} className={linkClass}>{label}</Link></li>)}</ul>;
}
export default function Footer() {
  return <footer className="family-footer mt-auto border-t border-line bg-white">
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="family-footer-grid">
        <div className="footer-brand">
          <Link href="/" aria-label="NativeApply — home" className="inline-flex"><Logo size={34} href={null}/></Link>
          <p className="mt-5 max-w-[15rem] text-sm leading-7 text-muted">Clear, natural English.<br/>More confidence in your next application.</p>
          <p className="mt-6 border-l-2 border-line pl-3 text-xs leading-6 text-muted">A <a href="https://nimbuslabsai.com/products" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-4">Nimbus Labs</a> product.</p>
        </div>
        <nav aria-label="Explore NativeApply"><h2 className={headingClass}>Explore</h2><Links items={EXPLORE}/></nav>
        <nav aria-label="Writing tools" className="footer-writing"><h2 className={headingClass}>Writing tools</h2><Links items={WRITING} columns/></nav>
        <nav aria-label="Access and help" className="footer-help"><h2 className={headingClass}>Access &amp; help</h2><Links items={HELP}/></nav>
      </div>
      <div className="text-muted"><MoreFromUs/></div>
      <div className="mt-8 border-t border-line pt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs leading-6 text-muted">© {new Date().getFullYear()} NativeApply. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6">{LEGAL.map(([href,label])=><Link key={href} href={href} className={linkClass}>{label}</Link>)}</nav>
        </div>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-6 text-muted">Payments processed by Paddle, our merchant of record.</p>

        </div>
      </div>
    </div>
  </footer>;
}
