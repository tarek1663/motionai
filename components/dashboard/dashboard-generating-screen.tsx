"use client";

import { Film } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import { STATUS_LABELS } from "@/lib/dashboard/constants";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<UseDashboardReturn, "progress" | "status" | "formatDetected">;

export function DashboardGeneratingScreen({ progress, status, formatDetected }: Props) {
  return (
    <div className="dash-state-card dash-state-card--minimal">
      <Film
        size={32}
        strokeWidth={1.5}
        color="var(--dash-text-secondary)"
        className="dash-state-icon dash-animate-pulse"
      />
      <h2 className="dash-state-title dash-state-title--sm">{copy.generatingTitle}</h2>
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
