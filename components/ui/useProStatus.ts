"use client";

import { useEffect, useState } from "react";

type ProStatus = { pro: boolean; needsRestore: boolean; unavailable?: boolean };
let cached: Promise<ProStatus> | null = null;

/** One shared /api/me request per page load, reused by every component. */
export function fetchProStatus(): Promise<ProStatus> {
  if (!cached) {
    cached = fetch("/api/me")
      .then((r) => r.json())
      .then((data) => ({ pro: data?.pro === true, needsRestore: data?.needsRestore === true, unavailable: data?.unavailable === true }))
      .catch(() => ({ pro: false, needsRestore: false, unavailable: true }));
  }
  return cached;
}

export function useProStatus() {
  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(false);
  const [needsRestore, setNeedsRestore] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchProStatus().then((value) => {
      if (cancelled) return;
      setIsPro(value.pro);
      setNeedsRestore(value.needsRestore);
      setUnavailable(Boolean(value.unavailable));
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { isPro, ready, needsRestore, unavailable };
}
