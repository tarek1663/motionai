"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const state = useDashboard();

  useEffect(() => {
    document.title = "Studio — Motionr";
  }, []);

  useEffect(() => {
    if (!state.user) return;
    const onboardingDone = localStorage.getItem(`motionr_onboarding_${state.user.id}`);
    if (!onboardingDone) {
      router.push("/onboarding");
    }
  }, [state.user, router]);

  return <DashboardShell {...state} />;
}
