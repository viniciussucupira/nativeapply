"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, ButtonLink, Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { IconAlert, IconCheck, IconLock } from "@/components/ui/Icons";
import { refreshProStatus } from "@/components/ui/useProStatus";

type Pending = "" | "here" | "everywhere";

export default function SignedInPanel({ email, pro }: { email: string; pro: boolean }) {
  const [pending, setPending] = useState<Pending>("");
  const [error, setError] = useState("");

  async function signOut(everywhere: boolean) {
    setPending(everywhere ? "everywhere" : "here");
    setError("");
    try {
      const response = await fetch("/api/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ everywhere }),
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok && response.status !== 401) throw new Error("Log-out failed");
      refreshProStatus();
      // A full navigation is intentional: the page must be rendered again
      // without the cookie this request just removed.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`/login?notice=${everywhere && response.ok ? "signed-out-everywhere" : "signed-out"}`);
    } catch {
      setPending("");
      setError(everywhere
        ? "We could not log out your other devices right now. Nothing has changed. Please try again shortly."
        : "We could not log you out right now. Please try again shortly.");
    }
  }

  return (
    <Section tone="white">
      <Container size="prose" className="py-14 sm:py-20">
        <Eyebrow>Your account</Eyebrow>
        <h1 className="mt-4 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-navy sm:text-[2.5rem]">
          You are logged in
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-7 text-muted">
          Logged in as <strong className="font-semibold text-navy">{email}</strong>.
        </p>

        {pro ? (
          <div className="mt-6 rounded-2xl border border-success/25 bg-success-50 p-5" role="status">
            <p className="flex items-center gap-2.5 font-semibold text-navy">
              <IconCheck className="h-5 w-5 text-success" /> NativeApply Pro is active in this browser
            </p>
            <ButtonLink href="/#tool" className="mt-4">Start rewriting</ButtonLink>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-line bg-ivory p-5" role="status">
            <p className="font-semibold text-navy">There is no active Pro purchase for this email.</p>
            <p className="mt-2 text-[0.9375rem] leading-6 text-muted">
              If you paid with another address, log out and log in with that one. You can also{" "}
              <Link href="/checkout" className="font-semibold text-brand-700 underline underline-offset-4">see the plans</Link>.
            </p>
          </div>
        )}

        <section className="mt-10 border-t border-line pt-8" aria-labelledby="signout-heading">
          <h2 id="signout-heading" className="text-xl font-semibold text-navy">Log out</h2>
          <p className="mt-2 text-[0.9375rem] leading-6 text-muted">
            Logging out of this browser leaves your other devices as they are. To end every session for this email at once,
            including billing links you have opened, log out of all devices. Use it if you logged in on a shared, lost or sold device.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" onClick={() => signOut(false)} disabled={pending !== ""}>
              {pending === "here" ? "Logging out…" : "Log out"}
            </Button>
            <Button variant="secondary" onClick={() => signOut(true)} disabled={pending !== ""}>
              {pending === "everywhere" ? "Logging out of all devices…" : "Log out of all devices"}
            </Button>
          </div>
          {error && (
            <p role="alert" className="mt-4 flex items-center gap-2 text-[0.875rem] font-medium text-flag">
              <IconAlert className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
          <p className="mt-6 flex items-start gap-2 text-[0.8125rem] leading-5 text-muted">
            <IconLock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            <span>
              Logging out never cancels or changes your subscription. To stop renewal, go to{" "}
              <Link href="/subscription#cancel" className="font-semibold text-brand-700 underline">Billing &amp; support</Link>.
            </span>
          </p>
        </section>
      </Container>
    </Section>
  );
}
