import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 py-8 mt-auto">
      <div className="max-w-2xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-400">
        <span>
          © {new Date().getFullYear()} NativeApply — a{" "}
          <a
            href="https://www.nimbuslabsai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black"
          >
            Nimbus Labs
          </a>{" "}
          product
        </span>
        <Link href="/cover-letter-for-non-native-speakers" className="hover:text-black">
          Cover Letter Rewriter
        </Link>
        <Link href="/native-sounding-resume" className="hover:text-black">
          Resume Rewriter
        </Link>
        <Link href="/recruiter-message-rewriter" className="hover:text-black">
          Recruiter Message Rewriter
        </Link>
        <Link href="/visa-sponsorship-cover-letter" className="hover:text-black">
          Visa Sponsorship Cover Letter
        </Link>
        <Link href="/job-application-letter-rewriter" className="hover:text-black">
          Job Application Letter Rewriter
        </Link>
        <Link href="/cv-english-rewriter" className="hover:text-black">
          CV Rewriter
        </Link>
        <Link href="/ats-friendly-resume-bullet-points" className="hover:text-black">
          ATS Resume Bullet Points
        </Link>
        <Link href="/linkedin-connection-message-rewriter" className="hover:text-black">
          LinkedIn Message Rewriter
        </Link>
        <Link href="/interview-follow-up-email-generator" className="hover:text-black">
          Interview Follow-Up Email
        </Link>
        <a href="/terms" className="hover:text-black">
          Terms
        </a>
        <a href="/privacy" className="hover:text-black">
          Privacy
        </a>
        <a href="/refunds" className="hover:text-black">
          Refunds
        </a>
      </div>
    </footer>
  );
}
