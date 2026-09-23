"use client";

import { useEffect, useState } from "react";

let cached: Promise<boolean> | null = null;

/** One shared /api/me request per page load, reused by every component. */
export function fetchProStatus(): Promise<boolean> {
  if (!cached) {
    cached = fetch("/api/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.pro === true)
      .catch(() => false);
  }
  return cached;
}

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchProStatus().then((value) => {
      if (cancelled) return;
      setIsPro(value);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { isPro, ready };
}
