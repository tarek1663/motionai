"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  DEFAULT_PREFERENCES,
  type OnboardingPreferences,
} from "@/lib/account/types";

const SAVED_MS = 2200;

export function useOnboardingPrefs() {
  const { user, isLoaded } = useUser();
  const [prefs, setPrefs] = useState<OnboardingPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const loadPrefs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/onboarding");
      const data = await res.json();
      if (res.ok && data.onboarding) {
        setPrefs(data.onboarding);
      } else {
        setPrefs({ ...DEFAULT_PREFERENCES, user_id: user.id });
      }
    } catch {
      setPrefs({ ...DEFAULT_PREFERENCES, user_id: user.id });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoaded && user) loadPrefs();
    else if (isLoaded && !user) setLoading(false);
  }, [isLoaded, user, loadPrefs]);

  const save = useCallback(async (patch: Partial<OnboardingPreferences>) => {
    setPrefs((p) => (p ? { ...p, ...patch } : p));
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok && data.onboarding) {
        setPrefs(data.onboarding);
        setSaved(true);
        window.setTimeout(() => setSaved(false), SAVED_MS);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return { prefs, loading, saved, save, isLoaded };
}
