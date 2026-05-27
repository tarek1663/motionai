"use client";

import { Download, Plus } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<UseDashboardReturn, "videoUrl" | "format" | "resetCreation">;

export function DashboardDoneScreen({ videoUrl, format, resetCreation }: Props) {
  const frameWidth = format === "16:9" ? 480 : format === "1:1" ? 320 : 220;

  return (
    <div className="dash-state-card dash-state-card--narrow dash-state-card--minimal">
      <h2 className="dash-state-title dash-state-title--sm">{copy.doneTitle}</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: frameWidth,
            borderRadius: 14,
            overflow: "hidden",
            border: "1.5px solid rgba(16,185,129,0.22)",
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.1), 0 12px 32px rgba(15,23,42,0.08)",
            background: "#ffffff",
          }}
        >
          <video
            src={videoUrl}
            style={{ width: "100%", display: "block" }}
            controls
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
      <div className="dash-btn-row dash-btn-row--labeled">
        <a href={videoUrl} download className="dash-btn-primary">
          <Download size={16} strokeWidth={1.75} color="#fff" />
          {copy.download}
        </a>
        <button type="button" className="dash-btn-secondary" onClick={resetCreation}>
          <Plus size={16} strokeWidth={1.75} />
          {copy.newVideo}
        </button>
      </div>
    </div>
  );
}
