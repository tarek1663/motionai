"use client";

import { Sidebar } from "@/components/Sidebar";
import type { CreditsInfo } from "@/lib/dashboard/credits";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<
  UseDashboardReturn,
  | "user"
  | "videos"
  | "loadingVideos"
  | "selectedVideo"
  | "setSelectedVideo"
  | "setScreen"
  | "sidebarCollapsed"
  | "setSidebarCollapsed"
  | "resetCreation"
  | "credits"
>;

export function DashboardSidebar({
  credits,
  setScreen,
}: Props) {
  const normalizedCredits = credits
    ? {
        videos_remaining: credits.videos_remaining,
        videos_limit: credits.videos_limit,
      }
    : null;

  // Maintient le flux: clic "Creer" depuis la sidebar.
  const onCreate = () => setScreen("input");

  return (
    <div onDoubleClick={onCreate}>
      <Sidebar active="create" credits={normalizedCredits} />
    </div>
  );
}
