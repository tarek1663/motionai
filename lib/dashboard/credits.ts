import type { DashboardScreen } from "./types";

export type CreditsInfo = {
  plan: string;
  planName?: string;
  videos_used: number;
  videos_limit: number;
  videos_remaining: number;
  reset_date?: string;
  period_end?: string;
  has_active_subscription?: boolean;
  eligible_for_trial_offer?: boolean;
};

export async function fetchCredits(): Promise<CreditsInfo | null> {
  try {
    const res = await fetch("/api/credits");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function checkCreditsBeforeGenerate(
  setError: (msg: string) => void,
  setScreen: (s: DashboardScreen) => void
): Promise<boolean> {
  const data = await fetchCredits();
  if (!data) return true;
  if (data.videos_remaining <= 0) {
    setError(
      "Tu as atteint ta limite de vidéos ce mois-ci. Upgrade ton plan pour continuer."
    );
    setScreen("input");
    return false;
  }
  return true;
}

