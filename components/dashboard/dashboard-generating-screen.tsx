"use client";

import { Film, Sparkles, Zap } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import { STATUS_LABELS } from "@/lib/dashboard/constants";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<UseDashboardReturn, "progress" | "status" | "formatDetected" | "quality">;

export function DashboardGeneratingScreen({ progress, status, formatDetected, quality }: Props) {
  return (
    <div className="dash-state-card dash-state-card--minimal">
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
