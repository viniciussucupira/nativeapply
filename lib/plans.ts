export type Plan = {
  id: "free" | "monthly";
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
    "Switch it on in another browser with your Paddle receipt",
  ],
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

export const PLANS: Plan[] = [FREE_PLAN, MONTHLY_PLAN];
