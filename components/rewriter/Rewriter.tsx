"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CONTEXT_TYPES, ContextType, FREE_LIMIT_PER_DAY } from "@/lib/constants";
import { Button, ButtonLink, Pill } from "@/components/ui/Primitives";
import {
  IconAlert,
  IconCheck,
  IconCopy,
  IconCoverLetter,
  IconFacts,
  IconFollowUpEmail,
  IconLock,
  IconRecruiterMessage,
  IconResumeBullets,
  IconSparkle,
} from "@/components/ui/Icons";
import { useProStatus } from "@/components/ui/useProStatus";

const MAX_CHARS = 6000;

const CONTEXT_ICONS: Record<ContextType, typeof IconCoverLetter> = {
  "cover-letter": IconCoverLetter,
  "resume-bullet": IconResumeBullets,
  "linkedin-message": IconRecruiterMessage,
  "follow-up-email": IconFollowUpEmail,
};

const PLACEHOLDERS: Record<ContextType, string> = {
  "cover-letter":
    "Dear Hiring Manager,\n\nI am writing for apply to the position of Data Analyst that I saw in your website…",
  "resume-bullet":
    "• Was responsible for the making of monthly reports for the sales team\n• Participated in the migration of the database…",
  "linkedin-message":
    "Hello Sarah, I saw your announce about the open position in your team and I would like very much to be considered…",
  "follow-up-email":
    "Dear Mr. Chen,\n\nI want to thank you for the interview of yesterday. I am still very interest in the position…",
};

type Phase = "idle" | "loading" | "done" | "error";

type Props = {
  initialContext?: ContextType;
  /** Locks the tool to one document type (used on single-purpose pages). */
  lockContext?: boolean;
  placeholder?: string;
  className?: string;
};

export default function Rewriter({
  initialContext = "cover-letter",
  lockContext = false,
  placeholder,
  className = "",
}: Props) {
  const [context, setContext] = useState<ContextType>(initialContext);
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);

  const [askEmail, setAskEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);

  const [justUpgraded, setJustUpgraded] = useState(false);
  const { isPro } = useProStatus();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [ctaVisible, setCtaVisible] = useState(true);

  const tooLong = text.length > MAX_CHARS;
  const hasText = text.trim().length > 0;

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("upgraded") === "1") {
        setJustUpgraded(true);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  // Keeps the sticky mobile action bar off screen while the real button shows.
  useEffect(() => {
    const node = ctaRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setCtaVisible(entry.isIntersecting),
      { threshold: 0.6 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const runRewrite = useCallback(
    async (body: string, contextValue: ContextType) => {
      setPhase("loading");
      setError("");
      setLimitReached(false);
      setResult("");
      try {
        const res = await fetch("/api/rewrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: body, context: contextValue }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 429) setLimitReached(true);
          setError(data.message || "Something went wrong. Please try again.");
          setPhase("error");
          return;
        }
        setResult(data.rewritten);
        setPhase("done");
      } catch {
        setError("Could not reach the server. Check your connection and try again.");
        setPhase("error");
      }
    },
    []
  );

  function hasUnlocked() {
    try {
      return window.localStorage.getItem("na_unlocked") === "true";
    } catch {
      return false;
    }
  }

  function handleSubmit() {
    if (!hasText || tooLong || phase === "loading") return;
    if (!isPro && !hasUnlocked()) {
      setAskEmail(true);
      window.setTimeout(() => emailRef.current?.focus(), 60);
      return;
    }
    runRewrite(text, context);
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault();
    setEmailError("");
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setSavingEmail(true);
    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
    } catch {
      /* the gate never blocks on a network error */
    } finally {
      try {
        window.localStorage.setItem("na_unlocked", "true");
      } catch {
        /* storage unavailable */
      }
      setSavingEmail(false);
      setAskEmail(false);
      if (text.trim()) runRewrite(text, context);
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError("Could not copy automatically. Select the text and copy it manually.");
    }
  }

  function handleReset() {
    setText("");
    setResult("");
    setPhase("idle");
    setError("");
    setLimitReached(false);
    textareaRef.current?.focus();
  }

  const contextLabel = CONTEXT_TYPES.find((c) => c.value === context)?.label ?? "Message";
  const activePlaceholder = placeholder ?? PLACEHOLDERS[context];

  return (
    <div className={className}>
      {justUpgraded && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-success/25 bg-success-50 p-4 text-[0.9375rem] text-navy">
          <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
          <p>
            {isPro
              ? "Payment received — Pro is active on this browser. Your rewrites are unlimited from now on."
              : "Payment received. If Pro is not active yet, refresh this page in a minute."}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-white shadow-[0_28px_70px_-50px_rgba(16,35,63,0.55)]">
        {/* ---------- document type ---------- */}
        <div className="border-b border-line bg-ivory/70 px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p id="na-context-label" className="text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-navy">
              {lockContext ? "Document type" : "What are you writing?"}
            </p>
            {isPro && (
              <Pill tone="success">
                <IconCheck className="h-3.5 w-3.5" /> Pro · unlimited rewrites
              </Pill>
            )}
          </div>

          <div
            className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4"
            role={lockContext ? undefined : "radiogroup"}
            aria-labelledby="na-context-label"
          >
            {CONTEXT_TYPES.map((item) => {
              const Icon = CONTEXT_ICONS[item.value];
              const selected = item.value === context;
              if (lockContext && !selected) return null;
              return (
                <button
                  key={item.value}
                  type="button"
                  role={lockContext ? undefined : "radio"}
                  aria-checked={lockContext ? undefined : selected}
                  disabled={lockContext}
                  onClick={() => setContext(item.value)}
                  className={
                    "flex min-h-[3.25rem] items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[0.875rem] font-medium transition-colors duration-200 " +
                    (selected
                      ? "border-brand bg-white text-navy shadow-[0_0_0_1px_rgba(39,100,231,0.55)]"
                      : "border-line bg-white/70 text-muted hover:border-brand-300 hover:bg-white hover:text-navy") +
                    (lockContext ? " col-span-2 md:col-span-1 cursor-default" : "")
                  }
                >
                  <Icon className={"h-[1.15rem] w-[1.15rem] shrink-0 " + (selected ? "text-brand" : "text-muted-soft")} />
                  <span className="leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- editor ---------- */}
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="flex flex-col border-b border-line p-4 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="flex items-baseline justify-between gap-3">
              <label htmlFor="na-text" className="text-sm font-semibold text-navy">
                Your draft
              </label>
              <span
                className={"text-xs tabular-nums " + (tooLong ? "font-semibold text-flag" : "text-muted-soft")}
              >
                {text.length.toLocaleString("en-US")} / {MAX_CHARS.toLocaleString("en-US")}
              </span>
            </div>

            <textarea
              id="na-text"
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={activePlaceholder}
              rows={10}
              spellCheck={false}
              aria-describedby="na-text-help"
              aria-invalid={tooLong}
              className="mt-3 w-full flex-1 resize-y rounded-xl border border-line bg-white px-4 py-3.5 text-base leading-7 text-ink placeholder:text-muted-soft focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15"
            />

            <p id="na-text-help" className="mt-2 text-[0.8125rem] text-muted">
              {tooLong
                ? `That is ${(text.length - MAX_CHARS).toLocaleString("en-US")} characters over the limit. Rewrite it in two parts.`
                : "Paste it exactly as you wrote it. Your names, dates, numbers and facts stay unchanged."}
            </p>

            {!askEmail ? (
              <div ref={ctaRef} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!hasText || tooLong || phase === "loading"}
                  className="w-full sm:w-auto"
                >
                  {phase === "loading" ? (
                    <>
                      <span className="flex items-center gap-1" aria-hidden="true">
                        <span className="na-dot-1 h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="na-dot-2 h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="na-dot-3 h-1.5 w-1.5 rounded-full bg-white" />
                      </span>
                      Rewriting
                    </>
                  ) : (
                    <>
                      <IconSparkle className="h-[1.1rem] w-[1.1rem]" />
                      Rewrite my text
                    </>
                  )}
                </Button>
                {!isPro && (
                  <p className="text-[0.8125rem] leading-5 text-muted">
                    {FREE_LIMIT_PER_DAY === 1 ? "1 free rewrite a day" : `${FREE_LIMIT_PER_DAY} free rewrites a day`}.
                    No password required.
                  </p>
                )}
              </div>
            ) : (
              <form
                onSubmit={handleEmailSubmit}
                className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4"
              >
                <div className="flex items-start gap-2.5">
                  <IconLock className="mt-0.5 h-[1.15rem] w-[1.15rem] shrink-0 text-brand-700" />
                  <div className="flex-1">
                    <label htmlFor="na-email" className="text-sm font-semibold text-navy">
                      Enter your email to run your first rewrite
                    </label>
                    <p className="mt-1 text-[0.8125rem] leading-5 text-muted">
                      No password, no credit card. We use it only to contact you about NativeApply.
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <input
                        id="na-email"
                        ref={emailRef}
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        aria-describedby={emailError ? "na-email-error" : undefined}
                        aria-invalid={Boolean(emailError)}
                        className="h-12 w-full rounded-full border border-line-strong bg-white px-4 text-base text-ink placeholder:text-muted-soft focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/15 sm:flex-1"
                      />
                      <Button type="submit" disabled={savingEmail} className="sm:w-auto">
                        {savingEmail ? "One moment…" : "Continue"}
                      </Button>
                    </div>
                    {emailError && (
                      <p id="na-email-error" role="alert" className="mt-2 text-[0.8125rem] font-medium text-flag">
                        {emailError}
                      </p>
                    )}
                    <p className="mt-3 text-[0.8125rem] text-muted">
                      Already paid on another device?{" "}
                      <Link href="/restore" className="font-medium text-brand-700 underline underline-offset-4">
                        Restore Pro
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* ---------- result ---------- */}
          <div className="flex flex-col bg-ivory/50 p-4 sm:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold text-navy">Native English</h3>
              {phase === "done" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
                  <IconFacts className="h-3.5 w-3.5" /> Facts preserved
                </span>
              )}
            </div>

            <div
              ref={resultRef}
              aria-live="polite"
              aria-atomic="false"
              className="mt-3 flex flex-1 flex-col rounded-xl border border-line bg-white"
            >
              {phase === "loading" && (
                <div className="relative flex-1 overflow-hidden rounded-xl p-5">
                  <div className="na-sweep pointer-events-none absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-navy">Rewriting your {contextLabel.toLowerCase()}…</p>
                  <div className="mt-4 flex flex-col gap-2.5" aria-hidden="true">
                    <span className="h-3 w-[92%] rounded-full bg-brand-50" />
                    <span className="h-3 w-[84%] rounded-full bg-brand-50" />
                    <span className="h-3 w-[96%] rounded-full bg-brand-50" />
                    <span className="h-3 w-[62%] rounded-full bg-brand-50" />
                  </div>
                  <p className="mt-5 text-[0.8125rem] text-muted">This usually takes a few seconds.</p>
                </div>
              )}

              {phase === "done" && (
                <div className="na-fade flex flex-1 flex-col">
                  <p className="flex-1 whitespace-pre-wrap px-5 py-5 text-base leading-7 text-ink">{result}</p>
                  <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
                    <Button type="button" onClick={handleCopy} variant={copied ? "secondary" : "primary"}>
                      {copied ? <IconCheck className="h-4 w-4 text-success" /> : <IconCopy className="h-4 w-4" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(contextLabel)}&body=${encodeURIComponent(result)}`}
                      className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted hover:text-navy"
                    >
                      Email
                    </a>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(result)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted hover:text-navy"
                    >
                      WhatsApp
                    </a>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="ml-auto inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted hover:text-navy"
                    >
                      Start another text
                    </button>
                  </div>
                </div>
              )}

              {phase === "error" && (
                <div className="flex flex-1 flex-col justify-center gap-3 p-5" role="alert">
                  <span
                    className={
                      "inline-flex h-10 w-10 items-center justify-center rounded-full " +
                      (limitReached ? "bg-brand-50 text-brand-700" : "bg-flag-50 text-flag")
                    }
                  >
                    {limitReached ? <IconSparkle className="h-5 w-5" /> : <IconAlert className="h-5 w-5" />}
                  </span>
                  <p className="text-[0.9375rem] leading-6 text-navy">{error}</p>
                  {limitReached ? (
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <ButtonLink href="/checkout">See Pro plans</ButtonLink>
                      <ButtonLink href="/restore" variant="secondary">
                        Restore a purchase
                      </ButtonLink>
                    </div>
                  ) : (
                    <Button type="button" variant="secondary" onClick={handleSubmit} className="self-start">
                      Try again
                    </Button>
                  )}
                </div>
              )}

              {phase === "idle" && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
                  <svg
                    viewBox="0 0 120 88"
                    className="h-20 w-28 text-brand-100"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  >
                    <rect x="10" y="8" width="66" height="72" rx="8" />
                    <path d="M24 28h38M24 40h38M24 52h24" />
                    <circle cx="94" cy="58" r="20" className="text-brand-50" />
                    <path d="m85 58 6.5 6.5L103 52" className="text-brand-300" strokeWidth="3.2" />
                  </svg>
                  <p className="max-w-[22rem] text-[0.9375rem] leading-6 text-muted">
                    {hasText
                      ? "Press “Rewrite my text” and your polished version appears here."
                      : "Paste your draft on the left. Your polished version appears here, ready to copy."}
                  </p>
                </div>
              )}
            </div>

            <ul className="mt-4 flex flex-col gap-2 text-[0.8125rem] leading-5 text-muted">
              <li className="flex items-start gap-2">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Your text is not stored on NativeApply servers.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Names, dates, numbers and facts remain unchanged.
              </li>
              <li className="flex items-start gap-2">
                <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                Professional English without changing your meaning.
              </li>
            </ul>
          </div>
        </div>

        {!isPro && (
          <div className="flex flex-col items-center gap-1 border-t border-line bg-white px-4 py-4 text-center sm:flex-row sm:justify-center sm:gap-2 sm:py-3.5">
            <p className="text-[0.875rem] text-muted">
              Unlimited rewrites: <span className="font-semibold text-navy">$14/month</span> or{" "}
              <span className="font-semibold text-navy">$49 lifetime</span>.
            </p>
            <Link
              href="/checkout"
              className="text-[0.875rem] font-semibold text-brand-700 underline underline-offset-4 hover:text-brand"
            >
              See the plans
            </Link>
          </div>
        )}
      </div>

      {/* Sticky action bar, only while the person is editing and the real button is off screen. */}
      {hasText && !ctaVisible && phase !== "loading" && !askEmail && (
        <>
          <div aria-hidden="true" className="h-[5.25rem] lg:hidden" />
          <div
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden"
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          >
            <Button type="button" size="lg" onClick={handleSubmit} disabled={tooLong} className="w-full">
              <IconSparkle className="h-[1.1rem] w-[1.1rem]" />
              Rewrite my text
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
