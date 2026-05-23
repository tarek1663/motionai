import Stripe from "stripe";

export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20" as any,
  });
};

export const PLANS = {
  free: {
    name: "Gratuit",
    price_monthly: 0,
    price_yearly: 0,
    videos_limit: 3,
    duration_limit: 30,
    watermark: true,
  },
  starter: {
    name: "Starter",
    price_monthly: 23,
    price_yearly: 13,
    videos_limit: 60,
    duration_limit: 120,
    watermark: false,
    stripe_monthly: process.env.STRIPE_STARTER_MONTHLY!,
    stripe_yearly: process.env.STRIPE_STARTER_YEARLY!,
  },
  pro: {
    name: "Pro",
    price_monthly: 45,
    price_yearly: 35,
    videos_limit: 150,
    duration_limit: 120,
    watermark: false,
    stripe_monthly: process.env.STRIPE_PRO_MONTHLY!,
    stripe_yearly: process.env.STRIPE_PRO_YEARLY!,
  },
  business: {
    name: "Business",
    price_monthly: 120,
    price_yearly: 99,
    videos_limit: 999999,
    duration_limit: 120,
    watermark: false,
    stripe_monthly: process.env.STRIPE_BUSINESS_MONTHLY!,
    stripe_yearly: process.env.STRIPE_BUSINESS_YEARLY!,
  },
} as const;

export type PlanId = keyof typeof PLANS;

type PaidPlan = Exclude<PlanId, "free">;

export function getStripePriceId(planId: PaidPlan, billing: "monthly" | "yearly"): string {
  const plan = PLANS[planId];
  return billing === "yearly" ? plan.stripe_yearly : plan.stripe_monthly;
}

export function getPlanFromPriceId(priceId: string): PlanId {
  for (const [key, plan] of Object.entries(PLANS)) {
    if (key === "free") continue;
    const p = plan as (typeof PLANS)[PaidPlan];
    if (p.stripe_monthly === priceId || p.stripe_yearly === priceId) {
      return key as PlanId;
    }
  }
  return "free";
}
