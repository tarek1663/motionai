"use client";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardPage() {
  const state = useDashboard();
  return <DashboardShell {...state} />;
}
