"use client";

import { FormEvent, useEffect, useState } from "react";
import { CONTEXT_TYPES, ContextType } from "@/lib/constants";

type Props = {
  heading?: string;
  subheading?: string;
  initialContext?: ContextType;
};

export default function Home({
  heading = "Sound like a native English speaker in your job application",
  subheading = "Paste your cover letter, resume bullets, or a message to a recruiter. Get it back polished, natural, and professional. $14/month or $49 lifetime — 1 free rewrite a day to try it first, no signup needed.",
  initialContext = "cover-letter",
}: Props) {
  const [text, setText] = useState("");
  const [context, setContext] = useState<ContextType>(initialContext);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false); const [emailUnlocked, setEmailUnlocked] = useState(false); const [gateEmail, setGateEmail] = useState(""); const [gateSubmitting, setGateSubmitting] = useState(false); const [gateError, setGateError] = useState("");

  useEffect(() => { try { if (window.localStorage.getItem("na_unlocked") === "true") { setEmailUnlocked(true); } } catch { /* ignore */ } }, []);async function handleGateSubmit(event: FormEvent) {  event.preventDefault();  setGateError("");  const trimmed = gateEmail.trim();  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {    setGateError("Enter a valid email.");    return;  }  setGateSubmitting(true);  try {    await fetch("/api/capture-email", {      method: "POST",      headers: { "Content-Type": "application/json" },      body: JSON.stringify({ email: trimmed }),    });  } catch {  } finally {    try {      window.localStorage.setItem("na_unlocked", "true");    } catch {    }    setEmailUnlocked(true);    setGateSubmitting(false);  } } async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy the text.");
    }
  }

  async function handleRewrite() {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, context }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong. Please try again.");
        return;
      }
      setResult(data.rewritten);
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 flex flex-col gap-8">
      <div className="text-center flex flex-col gap-3">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-black">{heading}</h1>
        <p className="text-neutral-500 text-base">{subheading}</p>
      </div>

      {!emailUnlocked && (<div className="mb-6 rounded border border-neutral-300 bg-neutral-50 p-6"><p className="mb-3 text-sm font-medium text-neutral-800">Enter your email to use NativeApply — 1 free rewrite a day.</p><form onSubmit={handleGateSubmit} className="flex flex-col gap-2 sm:flex-row"><label htmlFor="gate-email" className="sr-only">Email</label><input id="gate-email" type="email" required value={gateEmail} onChange={(e) => setGateEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded border border-neutral-300 bg-white px-3 py-2 text-sm text-black focus:outline-none sm:flex-1" /><button type="submit" disabled={gateSubmitting} className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60">{gateSubmitting ? "..." : "Continue"}</button></form>{gateError && (<p className="mt-2 text-sm text-red-600" role="alert">{gateError}</p>)}</div>)}<div className={"flex flex-col gap-3" + (!emailUnlocked ? " pointer-events-none opacity-40 select-none" : "")}>
        <label htmlFor="context" className="text-sm font-medium text-neutral-700">
          What are you writing?
        </label>
        <select
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value as ContextType)}
          className="w-full sm:w-64 border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white"
        >
          {CONTEXT_TYPES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <textarea disabled={!emailUnlocked}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste your text here..."
        rows={8}
        className={"w-full border border-neutral-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black/10" + (!emailUnlocked ? " opacity-40" : "")}
      />

      <button
        onClick={handleRewrite}
        disabled={loading || !text.trim() || !emailUnlocked}
        className="w-full sm:w-auto self-center px-8 py-3 rounded-full bg-black text-white font-medium text-sm disabled:opacity-40 hover:bg-neutral-800 transition"
      >
        {loading ? "Rewriting..." : "Make it sound native"}
      </button>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {result && (
        <div className="flex flex-col gap-3 border border-neutral-200 rounded-xl p-4 bg-neutral-50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">Rewritten</span>
            <button
              onClick={handleCopy}
              className="text-xs text-neutral-500 hover:text-black underline"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="whitespace-pre-wrap text-base text-black">{result}</p>
          <div className="flex items-center gap-4 pt-2 border-t border-neutral-200">
            <span className="text-xs text-neutral-400">Send it:</span>
            <a
              href={`mailto:?subject=${encodeURIComponent(
                CONTEXT_TYPES.find((c) => c.value === context)?.label ?? "Message"
              )}&body=${encodeURIComponent(result)}`}
              className="text-xs text-neutral-500 hover:text-black underline"
            >
              Email
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(result)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-black underline"
            >
              WhatsApp
            </a>
            <a
              href={`sms:&body=${encodeURIComponent(result)}`}
              className="text-xs text-neutral-500 hover:text-black underline"
            >
              Messages
            </a>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-neutral-400">
        $14/month or $49 lifetime for unlimited rewrites —{" "}
        <a href="/checkout" className="underline hover:text-black">
          Upgrade to Pro
        </a>
        . 1 free rewrite a day to try it first.
      </p>
    </div>
  );
}
