"use client";

import { useEffect } from "react";
import { Trash2 } from "lucide-react";
import type { DashboardVideo } from "@/lib/dashboard/types";

export type DashboardVideoHistoryProps = {
  videos: DashboardVideo[];
  loadingVideos: boolean;
  selectedVideoId?: string;
  onSelectVideo: (video: DashboardVideo) => void;
  onDelete: (videoId: string) => void;
  onRename: (videoId: string, title: string) => void;
};

export function DashboardVideoHistory({
  videos,
  selectedVideoId,
  onSelectVideo,
  onDelete,
}: DashboardVideoHistoryProps) {
  useEffect(() => {
    console.log("📹 VideoHistory received:", videos?.length);
  }, [videos]);

  if (!videos || videos.length === 0) {
    return <div className="dash-sidebar-empty">Aucune vidéo</div>;
  }

  const handleDelete = (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm("Supprimer cette vidéo ?")) {
      onDelete(videoId);
    }
  };

  return (
    <div className="dash-video-history-list">
      {videos.map((video) => (
        <div
          key={video.id}
          role="button"
          tabIndex={0}
          className={`dash-vid-item${selectedVideoId === video.id ? " active" : ""}`}
          onClick={() => onSelectVideo(video)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectVideo(video);
            }
          }}
        >
          <div className="dash-vid-item-inner">
            <div className="dash-vid-item-content">
              <div className="dash-vid-title dash-truncate">
                {video.title || video.prompt?.slice(0, 40) || "Vidéo sans titre"}
              </div>
              <div className="dash-vid-meta dash-truncate">
                {new Date(video.created_at).toLocaleDateString("fr-FR")}
              </div>
            </div>
            <button
              type="button"
              className="dash-vid-delete"
              aria-label="Supprimer la vidéo"
              title="Supprimer"
              onClick={(e) => handleDelete(e, video.id)}
            >
              <Trash2 size={15} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
