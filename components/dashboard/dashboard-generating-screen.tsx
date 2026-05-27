"use client";

import { Film, Sparkles, Zap } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import { STATUS_LABELS } from "@/lib/dashboard/constants";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<
  UseDashboardReturn,
  "progress" | "status" | "formatDetected" | "quality"
> & {
  onBack: () => void;
};

export function DashboardGeneratingScreen({
  progress,
  status,
  formatDetected,
  quality,
  onBack,
}: Props) {
  return (
    <div
      className="dash-state-card dash-state-card--minimal"
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <button
        type="button"
        onClick={onBack}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(23,19,17,0.04)",
          border: "1px solid rgba(23,19,17,0.1)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: 12,
          color: "rgba(23,19,17,0.55)",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        ← Retour
      </button>

      <Film
        size={32}
        strokeWidth={1.5}
        color="var(--dash-text-secondary)"
        className="dash-state-icon dash-animate-pulse"
      />
      <h2 className="dash-state-title dash-state-title--sm">{copy.generatingTitle}</h2>
      <p className="dash-state-sub dash-state-sub--tight">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {quality === "fast" ? (
            <Zap size={14} strokeWidth={2} color="var(--dash-brand)" />
          ) : (
            <Sparkles size={14} strokeWidth={2} color="var(--dash-brand)" />
          )}
          {quality === "fast" ? "Mode rapide" : "Haute qualité"}
        </span>
      </p>
      <p className="dash-state-status">
        {STATUS_LABELS[status] || "…"}
        {formatDetected && (
          <span className="dash-badge-mono dash-badge-inline">{formatDetected}</span>
        )}
      </p>
      <div className="dash-progress-track">
        <div className="dash-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="dash-progress-pct">{progress}%</div>
    </div>
  );
}
