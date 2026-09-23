"use client";

import { useEffect, useState } from "react";

/**
 * Real number of rewrites the product has produced, read from /api/stats.
 * Nothing is shown until a real number arrives — no placeholder, no estimate.
 */
export default function RewriteCount({ className = "" }: { className?: string }) {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.totalRewrites === "number" && data.totalRewrites > 0) {
          setTotal(data.totalRewrites);
        }
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, []);

  if (total === null) return null;

  return (
    <span className={className}>
      <strong className="font-semibold text-navy tabular-nums">{total.toLocaleString("en-US")}</strong>{" "}
      {total === 1 ? "application" : "applications"} rewritten so far
    </span>
  );
}
