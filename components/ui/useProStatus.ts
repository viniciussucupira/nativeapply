"use client";

import { useEffect, useState } from "react";
import { createAccessCache, parseProStatus } from "@/lib/access-cache";

const changed = "nativeapply:access-changed";
const cache = createAccessCache(async () => {
  const response = await fetch("/api/me", { signal: AbortSignal.timeout(15000), cache: "no-store" });
  if (!response.ok) throw new Error("Access unavailable");
  const data = await response.json();
  return parseProStatus(data);
});
let lastForegroundRefresh = 0;
let lastStorageValue: string | null = null;

export function refreshProStatus() {
  cache.invalidate();
  window.dispatchEvent(new Event(changed));
  try { window.localStorage.setItem(changed, String(Date.now())); } catch { /* Storage can be disabled. */ }
}

export const fetchProStatus = () => cache.get();

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(false);
  const [needsRestore, setNeedsRestore] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let version = 0;
    const update = () => {
      const requestVersion = ++version;
      setReady(false);
      fetchProStatus().then((value) => {
      if (cancelled || requestVersion !== version) return;
      setIsPro(value.pro);
      setNeedsRestore(value.needsRestore);
      setUnavailable(Boolean(value.unavailable));
      setReady(true);
    }); };
    const foreground = () => {
      if (document.visibilityState !== "visible" || Date.now() - lastForegroundRefresh < 1000) return;
      lastForegroundRefresh = Date.now();
      cache.invalidate();
      window.dispatchEvent(new Event(changed));
    };
    const storage = (event: StorageEvent) => {
      if (event.key !== changed) return;
      if (lastStorageValue !== event.newValue) {
        lastStorageValue = event.newValue;
        cache.invalidate();
      }
      update();
    };
    update();
    window.addEventListener(changed, update);
    window.addEventListener("focus", foreground);
    document.addEventListener("visibilitychange", foreground);
    window.addEventListener("storage", storage);
    return () => {
      cancelled = true;
      window.removeEventListener(changed, update);
      window.removeEventListener("focus", foreground);
      document.removeEventListener("visibilitychange", foreground);
      window.removeEventListener("storage", storage);
    };
  }, []);

  return { isPro, ready, needsRestore, unavailable };
}
