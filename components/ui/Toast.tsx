"use client";

import { useCallback, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent } from "react";

/**
 * Confirmation toast, shared by every Nimbus Labs product.
 *
 * It confirms that an action the person just took has succeeded, only when
 * that success would otherwise be invisible (for example, logging out ends in
 * a navigation). Errors, instructions and anything the person must keep stay
 * inline, next to the control.
 */

const EVENT_NAME = "nimbus:toast";
const FLASH_KEY = "nimbus:flash-toast";
const DURATION_MS = 5000;

// A toast requested before the Toaster has mounted (a page component's
// effect can run first) is held here and shown as soon as it mounts.
let listening = false;
let pending: string | null = null;

/** Shows a confirmation now. Callable from any client component. */
export function toast(message: string): void {
  if (typeof window === "undefined" || !message) return;
  if (!listening) {
    pending = message;
    return;
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { message } }));
}

/** Shows a confirmation after the next page load, for actions that navigate. */
export function flashToast(message: string): void {
  if (typeof window === "undefined" || !message) return;
  try {
    window.sessionStorage.setItem(FLASH_KEY, message);
  } catch {
    // Storage can be blocked; the action itself has still succeeded.
  }
}

function readFlash(): string {
  try {
    const message = window.sessionStorage.getItem(FLASH_KEY) || "";
    if (message) window.sessionStorage.removeItem(FLASH_KEY);
    return message;
  } catch {
    return "";
  }
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function Toaster() {
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [shownCount, setShownCount] = useState(0);

  const boxRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);
  const remaining = useRef(DURATION_MS);
  const startedAt = useRef(0);
  const hovered = useRef(false);
  const focused = useRef(false);
  const openRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    clearTimer();
    hovered.current = false;
    focused.current = false;
    const box = boxRef.current;
    const finish = () => {
      setOpen(false);
      setMessage("");
    };
    if (!box || typeof box.animate !== "function") {
      finish();
      return;
    }
    const leave = box.animate(
      prefersReducedMotion()
        ? [{ opacity: 1 }, { opacity: 0 }]
        : [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(4px)" },
          ],
      { duration: 160, easing: "ease-in", fill: "forwards" }
    );
    leave.onfinish = finish;
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    if (!openRef.current || hovered.current || focused.current || timer.current !== null) return;
    startedAt.current = Date.now();
    timer.current = window.setTimeout(() => {
      timer.current = null;
      dismiss();
    }, Math.max(remaining.current, 0));
  }, [dismiss]);

  const pauseTimer = useCallback(() => {
    if (timer.current === null) return;
    clearTimer();
    remaining.current -= Date.now() - startedAt.current;
  }, [clearTimer]);

  const show = useCallback((next: string) => {
    if (!next) return;
    openRef.current = true;
    setMessage(next);
    setOpen(true);
    setShownCount((count) => count + 1);
  }, []);

  // Listen for toasts, then show anything queued before mount or carried
  // over from the previous page.
  useEffect(() => {
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<{ message?: string } | string>).detail;
      show(typeof detail === "string" ? detail : detail?.message || "");
    };
    window.addEventListener(EVENT_NAME, onToast);
    listening = true;
    const queued = pending || readFlash();
    pending = null;
    if (queued) void Promise.resolve().then(() => show(queued));
    return () => {
      listening = false;
      window.removeEventListener(EVENT_NAME, onToast);
    };
  }, [show]);

  // Each new toast replaces the current one: restart the entrance and a
  // fresh five-second timer.
  useEffect(() => {
    if (shownCount === 0) return;
    const box = boxRef.current;
    if (box && typeof box.animate === "function") {
      box.getAnimations().forEach((animation) => animation.cancel());
      box.animate(
        prefersReducedMotion()
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "translateY(8px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
        { duration: 200, easing: "ease-out" }
      );
    }
    clearTimer();
    remaining.current = DURATION_MS;
    hovered.current = box?.matches(":hover") ?? false;
    focused.current = box?.contains(document.activeElement) ?? false;
    startTimer();
  }, [shownCount, clearTimer, startTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    focused.current = false;
    startTimer();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      dismiss();
    }
  }

  return (
    <div className="na-toast-viewport">
      <div
        ref={boxRef}
        className="na-toast"
        data-open={open ? "true" : "false"}
        onPointerEnter={() => { hovered.current = true; pauseTimer(); }}
        onPointerLeave={() => { hovered.current = false; startTimer(); }}
        onFocus={() => { focused.current = true; pauseTimer(); }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      >
        {open && (
          <span className="na-toast-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" focusable="false">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
        )}
        {/* Always in the DOM, empty when idle, so each message is announced. */}
        <p role="status" aria-live="polite" aria-atomic="true" className="na-toast-message">
          {message}
        </p>
        {open && (
          <button type="button" className="na-toast-close" aria-label="Dismiss" onClick={dismiss}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default Toaster;
