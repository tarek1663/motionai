"use client";

import { UserButton } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { colors } from "@/lib/colors";
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
  | "deleteVideo"
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
  deleteVideo,
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
            <div
              style={{
                padding: "24px 16px",
                textAlign: "center",
                color: "rgba(255,255,255,0.2)",
                fontSize: 12,
                lineHeight: 1.6,
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎬</div>
              Tes videos apparaitront ici apres ta premiere generation.
            </div>
          ) : (
            <>
              <div id="recent-videos">
                <div className="dash-eyebrow">{copy.sidebarRecent}</div>
              </div>
              {videos.map((video) => (
                <VideoListItem
                  key={video.id}
                  video={video}
                  active={selectedVideo?.id === video.id}
                  onSelect={() => {
                    setSelectedVideo(video);
                    setScreen("viewing");
                  }}
                  onDelete={() => void deleteVideo(video.id)}
                />
              ))}
            </>
          )}
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
                }}
              >
                {credits.trialDaysLeft === 0
                  ? "Trial expire aujourd'hui !"
                  : `${credits.trialDaysLeft}j d'essai restants`}
              </div>
            )}

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
          </>
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
  onDelete,
}: {
  video: DashboardVideo;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`dash-vid-item${active ? " active" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <div className="dash-vid-item-inner" style={{ gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 6,
            flexShrink: 0,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {video.video_url ? (
            <video
              src={video.video_url}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              preload="metadata"
            />
          ) : (
            <Clapperboard size={14} strokeWidth={1.8} color="rgba(255,255,255,0.45)" />
          )}
        </div>
        <div className="dash-vid-item-content">
          <div className="dash-vid-title dash-truncate">{video.prompt || "Vidéo générée"}</div>
          <div className="dash-vid-meta dash-truncate">
            {getVideoSummary(video)} · {formatRelativeDate(video.created_at)}
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!confirm("Supprimer cette vidéo ?")) return;
            onDelete();
          }}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.2)",
            cursor: "pointer",
            padding: "2px 4px",
            borderRadius: 4,
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(255,255,255,0.2)";
            e.currentTarget.style.background = "none";
          }}
          aria-label="Supprimer la vidéo"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
