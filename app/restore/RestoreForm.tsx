"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { SUPPORT_EMAIL } from "@/lib/constants";

type Status = "idle" | "working" | "done" | "failed";

export default function RestoreForm() {
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function restore(id: string) {
    setStatus("working");
    try {
      const res = await fetch("/api/paddle/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id.trim() }),
      });
      setStatus(res.ok ? "done" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  useEffect(() => {
    // Support sends restore links as /restore?txn=txn_...
    const fromLink = new URLSearchParams(window.location.search).get("txn");
    if (fromLink) {
      Promise.resolve().then(() => {
        setTransactionId(fromLink);
        restore(fromLink);
      });
    }
  }, []);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (transactionId.trim()) restore(transactionId);
  }

  const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Restore NativeApply Pro")}&body=${encodeURIComponent(
    "Hi, please send me a link to restore NativeApply Pro. I'm writing from the email I used to pay."
  )}`;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="text-sm font-semibold text-neutral-900">
        ← NativeApply
      </Link>
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">Restore Pro</h1>
      <p className="text-sm text-neutral-600">
        Pro is saved in the browser you paid from. To turn it on here too, paste the transaction ID from
        your Paddle receipt (it starts with <code className="rounded bg-neutral-100 px-1">txn_</code>).
      </p>

      {status === "done" ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          Pro is active in this browser.{" "}
          <Link href="/" className="font-medium underline">
            Start rewriting
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="txn" className="sr-only">
            Transaction ID
          </label>
          <input
            id="txn"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="txn_..."
            className="w-full rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-300 sm:flex-1"
          />
          <button
            type="submit"
            disabled={status === "working" || !transactionId.trim()}
            className="rounded-full bg-neutral-900 px-6 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50"
          >
            {status === "working" ? "Checking..." : "Restore"}
          </button>
        </form>
      )}

      {status === "failed" && (
        <p className="text-sm text-red-600" role="alert">
          We couldn&apos;t find an active NativeApply purchase with that ID.
        </p>
      )}

      <p className="text-sm text-neutral-600">
        Can&apos;t find the ID?{" "}
        <a href={mailto} className="underline hover:text-neutral-900">
          Email {SUPPORT_EMAIL}
        </a>{" "}
        from the address you paid with and we&apos;ll send you a restore link.
      </p>
    </div>
  );
}
