"use client";

import { useEffect } from "react";
import type { DashboardVideo } from "@/lib/dashboard/types";

export type DashboardVideoHistoryProps = {
  videos: DashboardVideo[];
  loadingVideos: boolean;
  selectedVideoId?: string;
  onSelect: (video: DashboardVideo) => void;
  onDelete: (videoId: string) => void;
  onRename: (videoId: string, title: string) => void;
};

export function DashboardVideoHistory({ videos }: DashboardVideoHistoryProps) {
  useEffect(() => {
    console.log("📹 VideoHistory received:", videos?.length);
  }, [videos]);

  if (!videos || videos.length === 0) {
    return (
      <div style={{ padding: "16px", color: "white", fontSize: "14px" }}>
        Aucune vidéo
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        padding: "8px",
        overflowY: "auto",
        maxHeight: "100%",
      }}
    >
      {videos.map((video) => (
        <div
          key={video.id}
          style={{
            background: "rgba(255,255,255,0.08)",
            borderRadius: "8px",
            padding: "10px",
            cursor: "pointer",
            color: "white",
            fontSize: "12px",
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {video.title || video.prompt?.slice(0, 40) || "Vidéo sans titre"}
          </div>
          <div style={{ opacity: 0.5, fontSize: 11 }}>
            {new Date(video.created_at).toLocaleDateString("fr-FR")}
          </div>
        </div>
      ))}
    </div>
  );
}
