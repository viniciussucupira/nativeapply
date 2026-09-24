/** Retries activation only: this endpoint never creates a payment. */
export async function activatePurchase(
  transactionId: string,
  request: typeof fetch = fetch,
  pause: (ms: number) => Promise<void> = ms => new Promise(resolve => setTimeout(resolve, ms)),
): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await pause(attempt * 1500);
    try {
      const response = await request("/api/paddle/confirm", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId }), signal: AbortSignal.timeout(8000),
      });
      if (response.ok) return true;
      if (response.status !== 409 && response.status < 500) return false;
    } catch {
      // A timeout may follow successful activation. Rechecking the same receipt is safe.
    }
  }
  return false;
}
