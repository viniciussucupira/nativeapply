"use client";
import { useEffect, useRef, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Primitives";
import { EmailRequest } from "@/app/restore/EmailAccess";
import type { BillingSummary } from "@/lib/billing";

function date(value: string | null) { return value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }) : null; }
export function BillingVerify() {
  const [token, setToken] = useState("");
  const captured = useRef(false);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (captured.current) return;
    captured.current = true;
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    window.history.replaceState(null, "", window.location.pathname);
    Promise.resolve().then(() => { setToken(value); setStatus(value ? "ready" : "invalid"); });
  }, []);
  async function verify() {
    setStatus("working");
    try {
      const res = await fetch("/api/recovery/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, purpose: "billing" }), signal: AbortSignal.timeout(25000) });
      if (res.ok) { window.location.replace("/subscription#cancel"); return; }
      setStatus(res.status === 400 ? "invalid" : "error");
    } catch { setStatus("error"); }
  }
  return <div className="mx-auto max-w-xl px-5 py-16"><h1 className="text-3xl font-semibold text-navy">Manage your subscription</h1><p className="mt-4 leading-7 text-muted">Confirm your email to view or cancel your NativeApply subscription. This step does not cancel anything or charge you.</p>
    {status === "loading" ? <p role="status">Preparing your link…</p> : status === "invalid" ? <p role="alert" className="mt-4">This link expired or was already used. Request a new billing link.</p> : <Button className="mt-6" disabled={status === "working"} onClick={verify}>{status === "working" ? "Verifying…" : "Manage my subscription"}</Button>}
    {status === "error" && <p role="alert" className="mt-4">We could not verify your email. Try again shortly, or request a new link.</p>}
    <ButtonLink href="/subscription#cancel" variant="secondary" className="mt-6">Request a new billing link</ButtonLink></div>;
}
export default function BillingManager() {
  const [state, setState] = useState("loading");
  const [subscriptions, setSubscriptions] = useState<BillingSummary[]>([]);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function load() {
    setState("loading"); setError("");
    try {
      const res = await fetch("/api/billing/subscription", { cache: "no-store", signal: AbortSignal.timeout(30000) });
      if (res.status === 401) { setState("verify"); return; }
      if (!res.ok) throw new Error();
      const data = await res.json(); setSubscriptions(data.subscriptions); setState("ready");
    } catch { setState("error"); }
  }
  useEffect(() => { void Promise.resolve().then(load); }, []);
  async function cancel(id: string) {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/billing/subscription", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscriptionId: id, confirmed: true }), signal: AbortSignal.timeout(60000) });
      if (res.status === 401) { setState("verify"); setError("Your secure session expired. Verify your email again to continue."); return; }
      if (!res.ok) throw new Error();
      const data = await res.json(); setSubscriptions(prev => prev.map(sub => sub.id === id ? data.subscription : sub)); setConfirm(null);
    } catch { setError("We could not confirm cancellation. Refresh the status below before trying again. If renewal is close, use the billing help options below."); }
    finally { setBusy(false); }
  }
  return <div className="mt-5 space-y-4">
    {error && <p role="alert" className="text-flag">{error}</p>}
    {state === "loading" && <p role="status">Loading your subscription…</p>}
    {state === "verify" && <EmailRequest purpose="billing" />}
    {state === "error" && <p role="alert">We could not load your subscription right now. Try again or use the billing help below.</p>}
    {state === "ready" && subscriptions.length === 0 && <><p>No recurring NativeApply subscription was found for this email. A lifetime purchase does not renew. If you expected a monthly plan, try the email used at checkout or contact support.</p><EmailRequest purpose="billing" /></>}
    {state === "ready" && subscriptions.map(sub => <article key={sub.id} className="rounded-xl border border-line bg-white p-5">
      <h3 className="font-semibold text-navy">NativeApply Pro · Monthly</h3>
      {subscriptions.length > 1 && <p className="mt-1 text-xs text-muted">Subscription ending {sub.id.slice(-6)}</p>}
      {sub.status === "past_due" && <p className="mt-3 text-sm text-flag">Your latest payment is overdue. The billing-period date below does not confirm paid access. Use the payment link in your Paddle email or contact billing support.</p>}
      {sub.cancellationScheduled || sub.status === "canceled" ? <div role="status"><p className="mt-3 font-semibold text-navy">{sub.cancellationScheduled ? "Cancellation confirmed — renewal is off" : "Subscription canceled"}</p><p className="mt-2">{sub.cancellationScheduled && date(sub.paidAccessEndsAt) ? `Your current access continues until ${date(sub.paidAccessEndsAt)}. ` : ""}This subscription will not renew.</p></div> : <>
        <p className="mt-3">Status: {sub.status.replace("_", " ")}.{date(sub.endsAt) ? ` Current period ends ${date(sub.endsAt)}.` : ""}</p>
        {confirm === sub.id ? <div className="mt-4"><p>{sub.status === "paused" ? "Cancel this paused subscription immediately?" : `Stop future renewals?${date(sub.paidAccessEndsAt) ? ` You keep your current access until ${date(sub.paidAccessEndsAt)}.` : " This does not settle an outstanding payment or grant additional paid access."}`} Cancellation does not issue a refund.</p><div className="mt-4 flex flex-wrap gap-3"><Button disabled={busy} onClick={() => cancel(sub.id)}>{busy ? "Confirming cancellation…" : "Confirm cancellation"}</Button><Button disabled={busy} onClick={() => setConfirm(null)}>Keep subscription</Button></div></div> : sub.canCancel ? <Button className="mt-4" disabled={busy} onClick={() => setConfirm(sub.id)}>Cancel subscription</Button> : <p className="mt-3">Contact billing support below to manage this subscription.</p>}
      </>}
    </article>)}
    {(state === "ready" || state === "error" || error) && <button type="button" disabled={busy} onClick={load} className="min-h-11 font-semibold text-brand-700 underline">Refresh subscription status</button>}
    {state === "ready" && subscriptions.length > 0 && <details><summary className="cursor-pointer py-3 font-semibold">Use another purchase email</summary><EmailRequest purpose="billing" /></details>}
  </div>;
}
