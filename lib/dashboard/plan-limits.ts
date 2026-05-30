import type { PlanId } from "@/lib/stripe";

export const PLAN_MAX_DURATION_LABEL: Record<PlanId, string> = {
  free: "30s",
  starter: "120s",
  pro: "120s",
  business: "120s",
};

export const ALL_DURATION_OPTIONS = [
  "15s",
  "30s",
  "45s",
  "60s",
  "90s",
  "120s",
] as const;

export function getMaxDurationSeconds(plan?: string | null): number {
  const label = PLAN_MAX_DURATION_LABEL[(plan as PlanId) || "free"] || "30s";
  if (label === "2min" || label === "120s") return 120;
  return parseInt(label, 10) || 30;
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
  return plan !== "free";
}
