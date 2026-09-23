"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades a block in the first time it scrolls into view.
 * Content is visible by default: without JavaScript, or with reduced motion
 * requested, nothing is ever hidden.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen at load: leave it alone, no flash.
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    node.dataset.reveal = "pending";
    const show = () => {
      node.style.transitionDelay = `${delay}ms`;
      node.dataset.reveal = "shown";
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observer.observe(node);

    // Safety net: nothing on this site may stay invisible because an
    // observer never fired (print, screenshot, odd browser, no scroll).
    const failsafe = window.setTimeout(() => {
      show();
      observer.disconnect();
    }, 12000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`na-reveal ${className}`}>
      {children}
    </div>
  );
}
