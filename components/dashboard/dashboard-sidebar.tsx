"use client";

import { UserButton } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Video,
} from "lucide-react";
import { colors, accentAlpha } from "@/lib/colors";
import type { CreditsInfo } from "@/lib/dashboard/credits";
import { copy } from "@/lib/dashboard/copy";
import { formatRelativeDate, getVideoSummary } from "@/lib/dashboard/utils";
import type { DashboardVideo } from "@/lib/dashboard/types";
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
  user,
  videos,
  loadingVideos,
  selectedVideo,
  setSelectedVideo,
  setScreen,
  sidebarCollapsed,
  setSidebarCollapsed,
  resetCreation,
  credits,
}: Props) {
  const accent = colors.accent;
  return (
    <>
      <aside
        className={`dash-sidebar${sidebarCollapsed ? " dash-sidebar-collapsed" : ""}`}
        style={{ transition: "width 0.2s, min-width 0.2s" }}
      >
        <div className="dash-sidebar-header">
          <div className="dash-sidebar-brand">
            <div className="dash-logo-mark">M</div>
            <span className="dash-logo-text">MotionAI</span>
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
            <Plus size={20} strokeWidth={2} color="#fff" />
            {copy.sidebarNew}
          </button>
        </div>

        <div className="dash-sidebar-scroll">
          {loadingVideos ? (
            <div className="dash-sidebar-skeleton-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="dash-skeleton" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="dash-empty">
              <Video size={28} strokeWidth={1.5} color="var(--dash-text-tertiary)" />
              <p className="dash-empty-hint">{copy.sidebarEmpty}</p>
            </div>
          ) : (
            <>
              <div className="dash-eyebrow">{copy.sidebarRecent}</div>
              {videos.map((video) => (
                <VideoListItem
                  key={video.id}
                  video={video}
                  active={selectedVideo?.id === video.id}
                  onSelect={() => {
                    setSelectedVideo(video);
                    setScreen("viewing");
                  }}
                />
              ))}
            </>
          )}
        </div>

        {credits && (
          <div
            style={{
              margin: "0 12px 8px",
              padding: "12px 14px",
              background: credits.videos_remaining <= 1 ? "#fff5f5" : "#f5f3ff",
              border: `1px solid ${credits.videos_remaining <= 1 ? "#fecaca" : accentAlpha(0.2)}`,
              borderRadius: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>
                {credits.planName || (credits.plan === "free" ? "Gratuit" : credits.plan)}
              </span>
              <a
                href="/pricing"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: accent,
                  textDecoration: "none",
                }}
              >
                Upgrader →
              </a>
            </div>
            <div
              style={{
                height: 4,
                background: "#e8e8e8",
                borderRadius: 2,
                overflow: "hidden",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, Math.round((credits.videos_used / credits.videos_limit) * 100))}%`,
                  background: credits.videos_remaining <= 1 ? "#ef4444" : accent,
                  borderRadius: 2,
                  transition: "width 0.3s",
                }}
              />
            </div>
            <div style={{ fontSize: 10, color: "#aaa" }}>
              {credits.videos_used}/{credits.videos_limit} vidéos · {credits.videos_remaining} restantes
            </div>
          </div>
        )}

        <div className="dash-sidebar-footer">
          <a href="/account" className="dash-sidebar-footer-link">
              <Settings size={20} strokeWidth={1.75} />
              {copy.settings}
            </a>
          <div className="dash-sidebar-profile">
            <UserButton afterSignOutUrl="/login" />
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

function VideoListItem({
  video,
  active,
  onSelect,
}: {
  video: DashboardVideo;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`dash-vid-item${active ? " active" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <div className="dash-vid-item-inner">
        <div
          className="dash-vid-dot"
          style={{ background: video.accent_color || colors.accent }}
        />
        <div className="dash-vid-item-content">
          <div className="dash-vid-title dash-truncate">{video.prompt || "Vidéo générée"}</div>
          <div className="dash-vid-meta dash-truncate">
            {getVideoSummary(video)} · {formatRelativeDate(video.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
