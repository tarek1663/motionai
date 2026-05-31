"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
} from "lucide-react";
import { colors } from "@/lib/colors";
import { DashboardVideoHistory } from "@/components/dashboard/dashboard-video-history";
import type { CreditsInfo } from "@/lib/dashboard/credits";
import { copy } from "@/lib/dashboard/copy";
import type { DashboardVideo } from "@/lib/dashboard/types";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

export type DashboardSidebarProps = Pick<
  UseDashboardReturn,
  | "user"
  | "videos"
  | "loadingVideos"
  | "selectedVideo"
  | "sidebarCollapsed"
  | "setSidebarCollapsed"
  | "resetCreation"
  | "credits"
  | "deleteVideo"
  | "renameVideo"
  | "setScreen"
> & {
  onViewVideo: (video: DashboardVideo) => void;
  onStartTour?: () => void;
};

export function DashboardSidebar({
  user,
  videos,
  loadingVideos,
  selectedVideo,
  onViewVideo,
  credits,
  sidebarCollapsed,
  setSidebarCollapsed,
  resetCreation,
  deleteVideo,
  renameVideo,
  setScreen,
  onStartTour,
}: DashboardSidebarProps) {
  const accent = colors.accent;
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "checking">("checking");

  useEffect(() => {
    console.log("📹 Sidebar received videos:", videos?.length, "loading:", loadingVideos);
  }, [videos, loadingVideos]);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_RENDER_SERVER_URL ||
          "https://motionai-render-production.up.railway.app";
        if (!baseUrl) {
          setServerStatus("offline");
          return;
        }
        const res = await fetch(`${baseUrl}/health`, {
          cache: "no-store",
        });
        setServerStatus(res.ok ? "online" : "offline");
      } catch {
        setServerStatus("offline");
      }
    };

    void checkServer();
    const interval = window.setInterval(() => {
      void checkServer();
    }, 30000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <aside
        className={`dash-sidebar${sidebarCollapsed ? " dash-sidebar-collapsed" : ""}`}
        style={{ transition: "width 0.2s, min-width 0.2s" }}
      >
        <div className="dash-sidebar-header">
          <div className="dash-sidebar-brand">
            <div className="dash-logo-mark">M</div>
            <span className="dash-logo-text">Motionr</span>
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed(true)}
            aria-label="Réduire"
            className="dash-btn-secondary dash-sidebar-icon-btn"
          >
            <ChevronLeft size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="dash-sidebar-cta">
          <button type="button" className="dash-btn-primary" onClick={resetCreation}>
            <Plus size={18} strokeWidth={2} color="#fff" />
            {copy.sidebarNew}
          </button>
        </div>

        <div id="tour-history" className="dash-sidebar-scroll">
          <DashboardVideoHistory
            videos={videos}
            loadingVideos={loadingVideos}
            selectedVideoId={selectedVideo?.id}
            onSelectVideo={onViewVideo}
            onDelete={(id) => void deleteVideo(id)}
            onRename={(id, title) => void renameVideo(id, title)}
          />
        </div>

        {credits && (
          <>
            {credits.isTrial && credits.trialDaysLeft !== null && (
              <div
                style={{
                  margin: "8px 12px",
                  padding: "8px 12px",
                  background:
                    credits.trialDaysLeft <= 1
                      ? "rgba(239,68,68,0.1)"
                      : "rgba(255,193,7,0.1)",
                  border: `1px solid ${
                    credits.trialDaysLeft <= 1
                      ? "rgba(239,68,68,0.2)"
                      : "rgba(255,193,7,0.2)"
                  }`,
                  borderRadius: 10,
                  fontSize: 11,
                  color: credits.trialDaysLeft <= 1 ? "#ef4444" : "#f59e0b",
                  fontWeight: 600,
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {credits.trialDaysLeft === 0
                  ? "Trial expire aujourd'hui !"
                  : `${credits.trialDaysLeft}j d'essai restants`}
              </div>
            )}

            <div
              id="tour-credits"
              className={`dash-credits-card${credits.videos_remaining <= 1 ? " dash-credits-card--low" : ""}`}
            >
              <div className="dash-credits-card-header">
                <span className="dash-credits-plan">
                  {credits.planName || (credits.plan === "free" ? "Gratuit" : credits.plan)}
                </span>
                <button
                  type="button"
                  className="dash-credits-change-plan"
                  onClick={() => setScreen("pricing")}
                >
                  Changer de plan
                </button>
              </div>
              <div className="dash-credits-track">
                <div
                  className="dash-credits-fill"
                  style={{
                    width: `${Math.min(100, Math.round((credits.videos_used / credits.videos_limit) * 100))}%`,
                    background: credits.videos_remaining <= 1 ? "#dc6b6b" : accent,
                  }}
                />
              </div>
              <div className="dash-credits-meta">
                {credits.videos_used}/{credits.videos_limit} vidéos · {credits.videos_remaining} restantes
              </div>
            </div>
          </>
        )}

        <div className="dash-sidebar-footer">
          <div className="dash-sidebar-footer-meta">
            <div id="tour-server" className="dash-sidebar-server-status">
              <span
                className="dash-sidebar-server-status__dot"
                data-status={serverStatus}
                aria-hidden
              />
              <span>
                {serverStatus === "online"
                  ? "Serveur en ligne"
                  : serverStatus === "offline"
                    ? "Serveur hors ligne"
                    : "Verification..."}
              </span>
            </div>
            {onStartTour && (
              <button
                type="button"
                id="tour-guide"
                className="dash-sidebar-how-btn"
                onClick={onStartTour}
              >
                Comment ça marche
              </button>
            )}
          </div>
          <Link href="/settings" className="dash-sidebar-footer-link">
            <Settings size={20} strokeWidth={1.75} />
            {copy.settings}
          </Link>
          <div className="dash-sidebar-profile">
            <UserButton afterSignOutUrl="/" />
            <div className="dash-sidebar-profile-text">
              <div className="dash-sidebar-profile-name">
                {user?.firstName ||
                  user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
                  "Utilisateur"}
              </div>
              <div className="dash-sidebar-profile-email">
                {user?.emailAddresses?.[0]?.emailAddress || ""}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          aria-label="Ouvrir"
          className="dash-btn-secondary dash-sidebar-icon-btn dash-sidebar-toggle"
        >
          <ChevronRight size={20} strokeWidth={1.75} />
        </button>
      )}
    </>
  );
}
