"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, ButtonLink } from "@/components/ui/Primitives";
import { refreshProStatus } from "@/components/ui/useProStatus";

export function EmailRequest({ purpose = "pro" }: { purpose?: "pro" | "billing" }) {
  const billing = purpose === "billing";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("working");
    setMessage("");
    try {
      const response = await fetch("/api/recovery/request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, purpose }), signal: AbortSignal.timeout(20000) });
      if (!response.ok) {
        setStatus("error");
        setMessage(response.status === 429 ? "Too many requests. Please wait an hour before trying again, or contact billing support." : "We could not send the email right now. Try again shortly or contact billing support.");
        return;
      }
      setStatus("sent");
    } catch { setStatus("error"); setMessage("We could not confirm delivery. Check your inbox before trying again."); }
  }
  return <section className="rounded-2xl border border-brand-100 bg-brand-50 p-5">
    <h2 className="text-xl font-semibold text-navy">{billing ? "Confirm your purchase email" : "Access my Pro by email"}</h2>
    <p className="mt-2 text-sm leading-6 text-muted">{billing ? "Enter the email you used to pay. We will email a secure link to view and cancel your subscription here. No password or Paddle login needed." : "Enter the email you used to pay. We will send a secure link. No password or purchase code needed."}</p>
    {status === "sent" ? <div role="status" className="mt-4">
      <p className="font-semibold text-navy">Check your inbox</p>
      <p className="mt-2 text-sm leading-6 text-muted">Your secure link is on its way to <strong>{email.trim()}</strong>. {billing ? "Open it to manage your subscription." : "Open it on the device where you want to use Pro."} The link works once and expires in 15 minutes.</p>
      <p className="mt-2 text-sm leading-6 text-muted">Allow a few minutes and check spam. {billing ? "Nothing is canceled until you confirm on the website." : "We will verify your purchase when you open the link."}</p>
      <button type="button" className="mt-3 min-h-11 font-semibold text-brand-700 underline" onClick={() => setStatus("idle")}>Use another email or send again</button>
    </div> : <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
      <label htmlFor="purchase-email" className="text-sm font-semibold text-navy">Email used at checkout</label>
      <input id="purchase-email" type="email" autoComplete="email" required maxLength={254} value={email} disabled={status === "working"} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-line-strong bg-white px-4 text-ink focus:outline-none focus:ring-4 focus:ring-brand/15" />
      <Button type="submit" disabled={status === "working"}>{status === "working" ? "Sending…" : billing ? "Email me a billing link" : "Email me an access link"}</Button>
      {message && <p role="alert" className="text-sm text-flag">{message}</p>}
    </form>}
  </section>;
}

export function EmailVerify() {
  const [token, setToken] = useState("");
  const captured = useRef(false);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    window.history.replaceState(null, "", window.location.pathname);
    // Explicit confirmation avoids email scanners consuming one-time links.
    Promise.resolve().then(() => { setToken(value); setStatus(value ? "ready" : "invalid_link"); });
  }, []);
  async function verify() {
    setStatus("working");
    try {
      const response = await fetch("/api/recovery/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }), signal: AbortSignal.timeout(25000) });
      const data = await response.json();
      if (response.ok) { refreshProStatus(); setToken(""); setStatus("done"); }
      else setStatus(data.error || "unavailable");
    } catch { setStatus("unavailable"); }
  }
  return <div className="mx-auto max-w-xl px-5 py-16">
    <h1 className="text-3xl font-semibold text-navy">{status === "done" ? "Your Pro is ready" : "Access NativeApply Pro"}</h1>
    {status === "done" ? <><p role="status" className="mt-4 text-muted">Pro is active in this browser. You have not been charged again.</p><ButtonLink href="/#tool" className="mt-6">Start rewriting</ButtonLink></> : <>
      <p className="mt-4 leading-7 text-muted">Confirm below to access your existing purchase on this device. This does not create or renew a subscription.</p>
      {(status === "ready" || status === "working" || status === "unavailable") && <Button onClick={verify} disabled={status === "working"} className="mt-6">{status === "working" ? "Checking your purchase…" : "Access my Pro"}</Button>}
      {status === "loading" && <p role="status" className="mt-4">Preparing your link…</p>}
      {status === "invalid_link" && <p role="alert" className="mt-4">This link has expired or has already been used. Request a new link below.</p>}
      {status === "no_active_purchase" && <p role="alert" className="mt-4">We could not find an active Pro purchase for this email. Try the email used at checkout, or use your receipt code. If you recently paid, do not pay again; contact support for help.</p>}
      {status === "too_many_requests" && <p role="alert" className="mt-4">Too many attempts. Please wait an hour before trying again.</p>}
      {status === "unavailable" && <p role="alert" className="mt-4">We could not check your access right now. Please try again shortly. If the link no longer works, request a new one below.</p>}
      <Link href="/restore" className="mt-6 inline-flex min-h-11 items-center font-semibold text-brand-700 underline">Request a new link or get help</Link>
    </>}
  </div>;
}
