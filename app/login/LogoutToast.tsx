"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/Toast";

// Log out ends in a full navigation to /login?notice=…, so the confirmation
// arrives as a URL parameter. Show it as a toast, then drop the parameter so
// a reload or a shared link does not repeat it. Older links keep working.
const MESSAGES: Record<string, string> = {
  "signed-out": "You're logged out.",
  "signed-out-everywhere": "You're logged out of all devices.",
};

export default function LogoutToast({ notice }: { notice: string }) {
  useEffect(() => {
    const message = MESSAGES[notice];
    if (!message) return;
    toast(message);
    const url = new URL(window.location.href);
    url.searchParams.delete("notice");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
  }, [notice]);
  return null;
}
