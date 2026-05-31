"use client";

import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import { formatRelativeDate } from "@/lib/dashboard/utils";
import { getVideoDisplayTitle } from "@/lib/dashboard/videos";
import type { DashboardVideo } from "@/lib/dashboard/types";

type Props = {
  video: DashboardVideo;
  onBack: () => void;
  onRegenerate: (prompt: string) => void;
};

export function DashboardViewingScreen({ video, onBack, onRegenerate }: Props) {
  const frameWidth =
    video.format === "16:9" ? 440 : video.format === "1:1" ? 300 : 220;

  return (
    <div className="dash-content-wide">
      <header className="dash-view-header">
        <button type="button" className="dash-back" onClick={onBack}>
          <ArrowLeft size={14} strokeWidth={1.75} />
          {copy.back}
        </button>
        <h1 className="dash-page-title">{getVideoDisplayTitle(video)}</h1>
        <div className="dash-meta-row">
          {video.format_name && <span className="dash-badge-mono">{video.format_name}</span>}
          {video.duration > 0 && <span className="dash-badge-mono">{video.duration}s</span>}
          {video.format && <span className="dash-badge-mono">{video.format}</span>}
          <span className="dash-caption dash-caption--sm">
            {formatRelativeDate(video.created_at)}
          </span>
        </div>
      </header>

      <div className="dash-view-layout dash-view-layout--minimal">
        <div
          style={{
            flex: "0 0 auto",
            width: frameWidth,
            borderRadius: 16,
            overflow: "hidden",
            border: "1.5px solid rgba(16,185,129,0.22)",
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.1), 0 12px 32px rgba(15,23,42,0.08)",
            background: "#ffffff",
          }}
        >
          <video
            src={video.video_url}
            style={{ width: "100%", display: "block" }}
            controls
            autoPlay
            loop
            playsInline
          />
        </div>

        <div className="dash-view-actions dash-view-actions--row dash-btn-row--labeled">
          <a href={video.video_url} download className="dash-btn-primary">
            <Download size={16} strokeWidth={1.75} color="#fff" />
            {copy.download}
          </a>
          <button
            type="button"
            className="dash-btn-secondary"
            onClick={() => onRegenerate(video.prompt)}
          >
            <RefreshCw size={16} strokeWidth={1.75} />
            {copy.regenerate}
          </button>
        </div>
      </div>
    </div>
  );
}
