export function recoveryVerificationStatus(ok: boolean, body: unknown) {
  const data = body && typeof body === "object" ? body as Record<string, unknown> : null;
  if (ok) return data?.ok === true ? "done" : "unavailable";
  switch (data?.error) {
    case "invalid_link": return "invalid_link";
    case "no_active_purchase": return "no_active_purchase";
    case "too_many_requests": return "too_many_requests";
    default: return "unavailable";
  }
}
