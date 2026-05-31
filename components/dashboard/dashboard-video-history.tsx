"use client";

import { useEffect, useState } from "react";
import { Clapperboard, Trash2 } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import { formatRelativeDate, getVideoSummary } from "@/lib/dashboard/utils";
import { getVideoDisplayTitle } from "@/lib/dashboard/videos";
import type { DashboardVideo } from "@/lib/dashboard/types";

export type DashboardVideoHistoryProps = {
  videos: DashboardVideo[];
  loadingVideos: boolean;
  selectedVideoId?: string;
  onSelect: (video: DashboardVideo) => void;
  onDelete: (videoId: string) => void;
  onRename: (videoId: string, title: string) => void;
};

export function DashboardVideoHistory({
  videos,
  loadingVideos,
  selectedVideoId,
  onSelect,
  onDelete,
  onRename,
}: DashboardVideoHistoryProps) {
  useEffect(() => {
    console.log("📹 VideoHistory received:", videos?.length);
  }, [videos]);

  if (loadingVideos) {
    return (
      <div className="dash-sidebar-skeleton-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="dash-skeleton" />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="dash-sidebar-empty">
        <div style={{ fontSize: 24, marginBottom: 8 }}>🎬</div>
        Aucune vidéo
      </div>
    );
  }

  return (
    <>
      <div className="dash-eyebrow">
        {copy.sidebarRecent}
        <span className="dash-eyebrow-count">{videos.length}</span>
      </div>
      {videos.map((video, i) => (
        <VideoHistoryItem
          key={video.id || `video-${i}`}
          video={video}
          active={selectedVideoId === video.id}
          onSelect={() => onSelect(video)}
          onDelete={() => onDelete(video.id)}
          onRename={(title) => onRename(video.id, title)}
        />
      ))}
    </>
  );
}

function VideoHistoryItem({
  video,
  active,
  onSelect,
  onDelete,
  onRename,
}: {
  video: DashboardVideo;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState("");
  const title = getVideoDisplayTitle(video);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`dash-vid-item${active ? " active" : ""}`}
      onClick={onSelect}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
    >
      <div className="dash-vid-item-inner" style={{ gap: 10 }}>
        <div className="dash-vid-thumb">
          {video.video_url ? (
            <video
              src={video.video_url}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
              playsInline
              preload="none"
            />
          ) : (
            <Clapperboard size={14} strokeWidth={1.8} color="rgba(255,255,255,0.45)" />
          )}
        </div>
        <div
          className="dash-vid-item-content"
          onDoubleClick={(e) => {
            e.stopPropagation();
            setEditing(true);
            setEditingTitle(title);
          }}
        >
          {editing ? (
            <input
              autoFocus
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={() => {
                if (editingTitle.trim() && editingTitle !== title) {
                  onRename(editingTitle);
                }
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
                if (e.key === "Escape") setEditing(false);
              }}
              onClick={(e) => e.stopPropagation()}
              className="dash-vid-rename-input"
            />
          ) : (
            <div className="dash-vid-title dash-truncate">{title}</div>
          )}
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
          className="dash-vid-delete"
          aria-label="Supprimer la vidéo"
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
