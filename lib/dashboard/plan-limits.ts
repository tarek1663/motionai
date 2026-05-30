import { PLANS, type PlanId } from "@/lib/plans";

export const ALL_DURATION_OPTIONS = [
  "15s",
  "30s",
  "45s",
  "60s",
  "90s",
  "120s",
] as const;

export function getMaxDurationSeconds(plan?: string | null): number {
  const id = (plan || "free") as PlanId;
  return PLANS[id]?.maxDuration ?? PLANS.free.maxDuration;
}

export function getAvailableDurations(plan?: string | null): string[] {
  const max = getMaxDurationSeconds(plan);
  return ALL_DURATION_OPTIONS.filter((d) => {
    const seconds = parseInt(d, 10) || 0;
    return seconds <= max;
  });
}

export function clampDuration(duration: string, plan?: string | null): string {
  const available = getAvailableDurations(plan);
  if (available.includes(duration)) return duration;
  return available[available.length - 1] || "30s";
}

export function isScriptModeAllowed(plan?: string | null): boolean {
  const id = (plan || "free") as PlanId;
  return PLANS[id]?.scriptMode ?? false;
}
