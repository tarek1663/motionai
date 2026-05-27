"use client";

import { useEffect } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const state = useDashboard();

  useEffect(() => {
    document.title = "Studio — Motionr";
  }, []);

  return <DashboardShell {...state} />;
}
