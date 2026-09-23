export type Plan = {
  id: "free" | "monthly" | "lifetime";
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  note?: string;
};

export const MONTHLY_PLAN: Plan = {
  id: "monthly",
  name: "Monthly Pro",
  price: "$14",
  cadence: "per month",
  summary: "Unlimited rewrites while you are actively job hunting.",
  features: [
    "Unlimited rewrites, every day",
    "All four document types",
    "Cancel anytime — access runs to the end of the paid month",
    "Works on every browser you sign in from",
  ],
};

export const LIFETIME_PLAN: Plan = {
  id: "lifetime",
  name: "Lifetime Pro",
  price: "$49",
  cadence: "one time",
  summary: "Pay once. No renewal, no recurring charge, ever.",
  features: [
    "Everything in Monthly Pro",
    "One payment — nothing recurring",
    "Keeps working for future job searches",
    "Full refund within 14 days",
  ],
  note: "Best value — about three and a half months of the monthly plan.",
};

export const FREE_PLAN: Plan = {
  id: "free",
  name: "Free",
  price: "$0",
  cadence: "to try it",
  summary: "Enough to see exactly what the rewrite does to your own text.",
  features: [
    "1 rewrite a day",
    "All four document types",
    "Email only — no password, no card",
  ],
};

export const PLANS: Plan[] = [FREE_PLAN, MONTHLY_PLAN, LIFETIME_PLAN];
