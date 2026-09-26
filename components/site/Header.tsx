"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { ButtonLink, Container } from "@/components/ui/Primitives";
import { IconCheck, IconClose, IconMenu } from "@/components/ui/Icons";
import { useProStatus } from "@/components/ui/useProStatus";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#examples", label: "Before & after" },
  { href: "/#use-cases", label: "Writing tools" },
  { href: "/checkout", label: "Pricing" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isPro } = useProStatus();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header
      className={
        "family-header sticky top-0 z-50 w-full border-b transition-colors duration-300 " +
        (scrolled
          ? "border-line bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75"
          : "border-transparent bg-white")
      }
      // A backdrop-filter makes the header the containing block of the fixed
      // mobile menu and would clip it to the bar; drop it while the menu is open.
      style={open ? { backdropFilter: "none", WebkitBackdropFilter: "none" } : undefined}
    >
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
          <Logo size={32} />

          <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-muted transition-colors hover:bg-brand-50 hover:text-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 xl:flex">
            {isPro ? (
              <Link href="/login" aria-label="Pro active. Your account" className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-success/25 bg-success-50 px-3 py-1.5 text-[0.8125rem] font-semibold text-success hover:border-success/50">
                <IconCheck className="h-3.5 w-3.5" />
                Pro active
              </Link>
            ) : (
              <Link href="/login" className="rounded-full px-3 py-2 text-sm font-medium text-muted hover:text-navy">Log in</Link>
            )}
            <ButtonLink href="/#tool" variant="primary">
              Start writing
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="na-mobile-menu"
            className="grid h-11 w-11 place-items-center rounded-xl border border-line text-navy xl:hidden"
          >
            <span className="sr-only">Open menu</span>
            <IconMenu className="h-5 w-5" />
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="na-mobile-menu"
          className="fixed inset-0 z-50 flex flex-col bg-white xl:hidden"
          style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <Logo size={32} href={null} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-11 w-11 place-items-center rounded-xl border border-line text-navy"
            >
              <span className="sr-only">Close menu</span>
              <IconClose className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 pt-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[3.25rem] items-center rounded-xl px-3 text-lg font-medium text-navy hover:bg-brand-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-line px-5 py-5">
            <div onClick={() => setOpen(false)}>
              <ButtonLink href="/#tool" size="lg" className="w-full" variant="primary">
                Start writing
              </ButtonLink>
            </div>
            {!isPro && (
              <p className="mt-2 text-center text-[0.8125rem] text-muted">
                1 free rewrite a day. No password required.
              </p>
            )}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              aria-label={isPro ? "Pro active. Your account" : undefined}
              className={
                "mt-2 flex min-h-[3.25rem] items-center justify-center gap-2 rounded-xl px-3 text-lg font-medium hover:bg-brand-50 " +
                (isPro ? "text-success" : "text-navy")
              }
            >
              {isPro ? (
                <>
                  <IconCheck className="h-4 w-4" /> Pro active · Your account
                </>
              ) : (
                "Log in"
              )}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
