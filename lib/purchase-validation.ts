export type Adjustment = { action?: string; status?: string; type?: string; totals?: { total?: string } };
export type Purchase = {
  id: string; status: string; customer_id?: string | null; subscription_id?: string | null;
  created_at?: string | null; billed_at?: string | null;
  billing_period?: { starts_at?: string; ends_at?: string } | null;
  items?: { price?: { id?: string } | null; price_id?: string }[];
  adjustments?: Adjustment[] | null;
  details?: { totals?: { total?: string } };
};
export type PurchaseSubscription = {
  id?: string; customer_id?: string; status?: string;
  scheduled_change?: { action?: string; effective_at?: string } | null;
  items?: { price?: { id?: string } | null; price_id?: string }[];
};

export function purchasePlan(tx: Purchase, monthly: string, lifetime: string): "monthly" | "lifetime" | null {
  const prices = (tx.items ?? []).map(item => item.price?.id ?? item.price_id ?? "");
  if (lifetime && prices.includes(lifetime)) return "lifetime";
  if (monthly && prices.includes(monthly)) return "monthly";
  return null;
}

/** Paddle keeps a refunded transaction completed. Its adjustments decide access. */
export function purchaseRefunded(tx: Purchase): boolean {
  const approved = (tx.adjustments ?? []).filter(a => a.status === "approved");
  if (approved.some(a => a.action === "chargeback" || (a.action === "refund" && a.type === "full"))) return true;
  const total = tx.details?.totals?.total;
  if (!total || !/^\d+$/.test(total) || BigInt(total) === BigInt(0)) return false;
  const refunded = approved.filter(a => a.action === "refund").reduce((sum, a) => {
    const amount = a.totals?.total;
    return sum + (amount && /^\d+$/.test(amount) ? BigInt(amount) : BigInt(0));
  }, BigInt(0));
  return refunded >= BigInt(total);
}

export function paidMonthlyExpiry(tx: Purchase, sub: PurchaseSubscription | null, monthly: string, now = Date.now()): number | null {
  if (!tx.subscription_id || !sub || sub.id !== tx.subscription_id || sub.customer_id !== tx.customer_id ||
    !["active", "past_due", "trialing"].includes(sub.status || "") ||
    !sub.items?.some(item => (item.price?.id ?? item.price_id) === monthly)) return null;
  // Never invent another month or extend an old receipt into an unpaid renewal.
  const paidEnd = Date.parse(tx.billing_period?.ends_at || "");
  if (!Number.isFinite(paidEnd)) return null;
  let end = paidEnd + (sub.status === "past_due" ? 3 * 86400000 : 0);
  if (sub.scheduled_change?.action === "cancel" || sub.scheduled_change?.action === "pause") {
    const scheduled = Date.parse(sub.scheduled_change.effective_at || "");
    if (!Number.isFinite(scheduled)) return null;
    end = Math.min(end, scheduled);
  }
  return end > now ? Math.floor(end / 1000) : null;
}
