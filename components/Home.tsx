"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { CONTEXT_TYPES, ContextType } from "@/lib/constants";

type Props = {
  heading?: string;
  subheading?: string;
  initialContext?: ContextType;
};

const CONTEXT_STYLES: Record<ContextType, { idle: string; active: string; dot: string }> = {
  "cover-letter": {
    idle: "border-sky-200 text-sky-700 hover:bg-sky-50",
    active: "border-sky-500 bg-sky-500 text-white shadow-sm shadow-sky-200",
    dot: "bg-sky-400",
  },
  "resume-bullet": {
    idle: "border-violet-200 text-violet-700 hover:bg-violet-50",
    active: "border-violet-500 bg-violet-500 text-white shadow-sm shadow-violet-200",
    dot: "bg-violet-400",
  },
  "linkedin-message": {
    idle: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    active: "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-200",
    dot: "bg-emerald-400",
  },
  "follow-up-email": {
    idle: "border-amber-200 text-amber-700 hover:bg-amber-50",
    active: "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200",
    dot: "bg-amber-400",
  },
};

const MAX_CHARS = 6000;

export default function Home({
  heading,
  subheading = "Paste your cover letter, resume bullets, or a message to a recruiter. Get it back polished, natural, and professional. $14/month or $49 lifetime — 1 free rewrite a day to try it first, with just your email.",
  initialContext = "cover-letter",
}: Props) {
  const [text, setText] = useState("");
  const [context, setContext] = useState<ContextType>(initialContext);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [gateEmail, setGateEmail] = useState("");
  const [gateSubmitting, setGateSubmitting] = useState(false);
  const [gateError, setGateError] = useState("");
  const [totalRewrites, setTotalRewrites] = useState<number | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const [stats, me] = await Promise.all([
        fetch("/api/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch("/api/me").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);
      if (cancelled) return;

      if (stats && typeof stats.totalRewrites === "number") setTotalRewrites(stats.totalRewrites);

      let unlocked = false;
      try {
        unlocked = window.localStorage.getItem("na_unlocked") === "true";
      } catch {
        /* storage unavailable */
      }
      if (me?.pro === true) {
        setIsPro(true);
        unlocked = true;
      }
      setEmailUnlocked(unlocked);

      if (new URLSearchParams(window.location.search).get("upgraded") === "1") {
        setJustUpgraded(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleGateSubmit(event: FormEvent) {
    event.preventDefault();
    setGateError("");
    const trimmed = gateEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setGateError("Enter a valid email.");
      return;
    }
    setGateSubmitting(true);
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
      setEmailUnlocked(true);
      setGateSubmitting(false);
    }
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the text. Select it and copy it manually.");
    }
  }

  async function handleRewrite() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setLimitReached(false);
    setResult("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) setLimitReached(true);
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setResult(data.rewritten);
      if (typeof data.totalRewrites === "number" && data.totalRewrites > 0) {
        setTotalRewrites(data.totalRewrites);
      }
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const contextLabel = CONTEXT_TYPES.find((c) => c.value === context)?.label ?? "Message";
  const tooLong = text.length > MAX_CHARS;

  return (
    <div className="relative isolate w-full overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="na-blob left-[-6rem] top-[-4rem] h-72 w-72 bg-sky-200" />
        <div className="na-blob right-[-5rem] top-24 h-80 w-80 bg-violet-200" style={{ animationDelay: "-6s" }} />
        <div className="na-blob left-1/3 top-[26rem] h-64 w-64 bg-amber-100" style={{ animationDelay: "-12s" }} />
        <div className="na-blob right-1/4 top-[40rem] h-56 w-56 bg-emerald-100" style={{ animationDelay: "-3s" }} />
      </div>

      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-sky-500 via-violet-500 to-rose-500 text-xs font-bold text-white">
            NA
          </span>
          NativeApply
        </Link>
        {isPro ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
            Pro · unlimited rewrites
          </span>
        ) : (
          <Link
            href="/checkout"
            className="rounded-full border border-neutral-300 bg-white/70 px-4 py-1.5 text-xs font-medium text-neutral-800 backdrop-blur hover:border-neutral-900"
          >
            Pricing
          </Link>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-6 pb-16 pt-12">
        <section className="na-rise flex flex-col items-center gap-4 text-center">
          <span className="rounded-full border border-violet-200 bg-white/70 px-3 py-1 text-xs font-medium text-violet-700 backdrop-blur">
            For non-native speakers applying for jobs in English
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            {heading ?? (
              <>
                Sound like a <span className="na-gradient-text">native English speaker</span> in your job
                application
              </>
            )}
          </h1>
          <p className="max-w-xl text-base text-neutral-600">{subheading}</p>
          {totalRewrites !== null && totalRewrites > 0 && (
            <p className="text-xs text-neutral-500">
              {totalRewrites.toLocaleString("en-US")} {totalRewrites === 1 ? "application" : "applications"} rewritten
              so far
            </p>
          )}
        </section>

        {justUpgraded && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-900">
            {isPro
              ? "Payment received — NativeApply Pro is active on this browser. Unlimited rewrites."
              : "Payment received. If Pro isn't active yet, refresh this page in a minute."}
          </div>
        )}

        <section
          className="na-rise flex flex-col gap-5 rounded-3xl border border-neutral-200 bg-white/90 p-5 shadow-xl shadow-violet-100/60 backdrop-blur sm:p-7"
          style={{ animationDelay: "0.1s" }}
        >
          {!emailUnlocked && (
            <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-violet-50 to-rose-50 p-5">
              <p className="mb-3 text-sm font-medium text-neutral-800">
                Enter your email to use NativeApply — 1 free rewrite a day, no password.
              </p>
              <form onSubmit={handleGateSubmit} className="flex flex-col gap-2 sm:flex-row">
                <label htmlFor="gate-email" className="sr-only">
                  Email
                </label>
                <input
                  id="gate-email"
                  type="email"
                  required
                  value={gateEmail}
                  onChange={(e) => setGateEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-300 sm:flex-1"
                />
                <button
                  type="submit"
                  disabled={gateSubmitting}
                  className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-60"
                >
                  {gateSubmitting ? "..." : "Continue"}
                </button>
              </form>
              {gateError && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {gateError}
                </p>
              )}
              <p className="mt-3 text-xs text-neutral-500">
                Already paid on another device?{" "}
                <Link href="/restore" className="underline hover:text-neutral-900">
                  Restore Pro
                </Link>
              </p>
            </div>
          )}

          <fieldset
            disabled={!emailUnlocked}
            className={"flex flex-col gap-5" + (!emailUnlocked ? " pointer-events-none select-none opacity-40" : "")}
          >
            <div className="flex flex-col gap-2">
              <p id="na-context-label" className="text-sm font-medium text-neutral-800">What are you writing?</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="na-context-label">
                {CONTEXT_TYPES.map((c) => {
                  const selected = c.value === context;
                  const style = CONTEXT_STYLES[c.value];
                  return (
                    <button
                      key={c.value}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setContext(c.value)}
                      className={
                        "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition " +
                        (selected ? style.active : "bg-white " + style.idle)
                      }
                    >
                      <span className={"h-2 w-2 rounded-full " + (selected ? "bg-white" : style.dot)} />
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="na-text" className="sr-only">
                Your text
              </label>
              <textarea
                id="na-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                rows={8}
                className="w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-300"
              />
              <p className={"text-right text-xs " + (tooLong ? "text-red-600" : "text-neutral-400")}>
                {text.length.toLocaleString("en-US")} / {MAX_CHARS.toLocaleString("en-US")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleRewrite}
              disabled={loading || !text.trim() || tooLong}
              className="self-center rounded-full bg-gradient-to-r from-sky-500 via-violet-500 to-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-200 transition hover:brightness-110 disabled:opacity-40"
            >
              {loading ? "Rewriting..." : "Make it sound native"}
            </button>
          </fieldset>

          {error && (
            <div className="text-center text-sm text-red-600" role="alert">
              <p>{error}</p>
              {limitReached && (
                <Link
                  href="/checkout"
                  className="mt-2 inline-block rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium text-white hover:bg-neutral-700"
                >
                  See Pro plans — $14/month or $49 lifetime
                </Link>
              )}
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-emerald-900">Rewritten</span>
                <button onClick={handleCopy} className="text-xs font-medium text-emerald-800 underline hover:text-emerald-950">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="whitespace-pre-wrap text-base text-neutral-900">{result}</p>
              <div className="flex items-center gap-4 border-t border-emerald-200 pt-2">
                <span className="text-xs text-neutral-500">Send it:</span>
                <a
                  href={`mailto:?subject=${encodeURIComponent(contextLabel)}&body=${encodeURIComponent(result)}`}
                  className="text-xs text-neutral-600 underline hover:text-neutral-900"
                >
                  Email
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(result)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-neutral-600 underline hover:text-neutral-900"
                >
                  WhatsApp
                </a>
                <a
                  href={`sms:?&body=${encodeURIComponent(result)}`}
                  className="text-xs text-neutral-600 underline hover:text-neutral-900"
                >
                  Messages
                </a>
              </div>
            </div>
          )}

          {!isPro && (
            <p className="text-center text-xs text-neutral-500">
              $14/month or $49 lifetime for unlimited rewrites —{" "}
              <Link href="/checkout" className="font-medium text-violet-700 underline hover:text-violet-900">
                Upgrade to Pro
              </Link>
              . 1 free rewrite a day to try it first.
            </p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { n: "1", title: "Paste", body: "Your cover letter, resume bullets, LinkedIn note, or follow-up email.", color: "bg-sky-100 text-sky-700" },
            { n: "2", title: "Rewrite", body: "Grammar, word choice, and tone fixed — your facts and numbers stay exactly as written.", color: "bg-violet-100 text-violet-700" },
            { n: "3", title: "Send", body: "Copy it, or send it by email, WhatsApp, or text in one tap.", color: "bg-amber-100 text-amber-700" },
          ].map((step) => (
            <div key={step.n} className="rounded-2xl border border-neutral-200 bg-white/80 p-5 backdrop-blur">
              <span className={"grid h-8 w-8 place-items-center rounded-full text-sm font-semibold " + step.color}>
                {step.n}
              </span>
              <p className="mt-3 text-sm font-semibold text-neutral-900">{step.title}</p>
              <p className="mt-1 text-sm text-neutral-600">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Example
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">Before</p>
              <p className="mt-2 text-sm text-neutral-800">
                I am writing for apply to the position of data analyst. I have 5 years of experience in make
                reports and I am very motivated for work in your company.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">After</p>
              <p className="mt-2 text-sm text-neutral-800">
                I&apos;m writing to apply for the Data Analyst position. I have five years of experience
                building reports, and I&apos;m very motivated to work at your company.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
