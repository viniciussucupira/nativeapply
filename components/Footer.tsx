import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-gradient-to-b from-white to-violet-50/60 py-8">
      <div className="max-w-2xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-500">
        <span>
          © {new Date().getFullYear()} NativeApply — a{" "}
          <a
            href="https://www.nimbuslabsai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-violet-700"
          >
            Nimbus Labs
          </a>{" "}
          product
        </span>
        <a
          href="https://www.retoneai.net"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-violet-700"
        >
          Retone — AI Text Rewriter
        </a>
        <Link href="/cover-letter-for-non-native-speakers" className="hover:text-violet-700">
          Cover Letter Rewriter
        </Link>
        <Link href="/native-sounding-resume" className="hover:text-violet-700">
          Resume Rewriter
        </Link>
        <Link href="/recruiter-message-rewriter" className="hover:text-violet-700">
          Recruiter Message Rewriter
        </Link>
        <Link href="/visa-sponsorship-cover-letter" className="hover:text-violet-700">
          Visa Sponsorship Cover Letter
        </Link>
        <Link href="/job-application-letter-rewriter" className="hover:text-violet-700">
          Job Application Letter Rewriter
        </Link>
        <Link href="/cv-english-rewriter" className="hover:text-violet-700">
          CV Rewriter
        </Link>
        <Link href="/ats-friendly-resume-bullet-points" className="hover:text-violet-700">
          ATS Resume Bullet Points
        </Link>
        <Link href="/linkedin-connection-message-rewriter" className="hover:text-violet-700">
          LinkedIn Message Rewriter
        </Link>
        <Link href="/interview-follow-up-email-generator" className="hover:text-violet-700">
          Interview Follow-Up Email
        </Link>
        <Link href="/checkout" className="hover:text-violet-700">
          Pricing
        </Link>
        <Link href="/restore" className="hover:text-violet-700">
          Restore Pro
        </Link>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-violet-700">
          Contact
        </a>
        <a href="/terms" className="hover:text-violet-700">
          Terms
        </a>
        <a href="/privacy" className="hover:text-violet-700">
          Privacy
        </a>
        <a href="/refunds" className="hover:text-violet-700">
          Refunds
        </a>
      </div>
    </footer>
  );
}
