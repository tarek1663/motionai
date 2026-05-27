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
  credits,
  sidebarCollapsed,
  setSidebarCollapsed,
  resetCreation,
  setScreen,
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
            className={`dash-credits-card${credits.videos_remaining <= 1 ? " dash-credits-card--low" : ""}`}
          >
            <div className="dash-credits-card-header">
              <span className="dash-credits-plan">
                {credits.planName || (credits.plan === "free" ? "Gratuit" : credits.plan)}
              </span>
              <a href="/pricing" className="dash-credits-upgrade">
                Upgrade
              </a>
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
