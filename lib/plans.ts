export const PLANS = {
  free: {
    name: "Free",
    monthlyVideos: 3,
    dailyVideos: 2,
    maxDuration: 30,
    watermark: true,
    scriptMode: false,
    price: 0,
  },
  starter: {
    name: "Starter",
    monthlyVideos: 45,
    dailyVideos: 10,
    maxDuration: 60,
    watermark: false,
    scriptMode: true,
    price: 23,
  },
  pro: {
    name: "Pro",
    monthlyVideos: 100,
    dailyVideos: 25,
    maxDuration: 120,
    watermark: false,
    scriptMode: true,
    price: 45,
  },
  business: {
    name: "Business",
    monthlyVideos: 500,
    dailyVideos: 40,
    maxDuration: 120,
    watermark: false,
    scriptMode: true,
    price: 120,
  },
} as const;

export type PlanId = keyof typeof PLANS;

export function getPlanConfig(plan?: string | null) {
  const id = (plan || "free") as PlanId;
  return PLANS[id] ?? PLANS.free;
}
