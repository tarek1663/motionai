"use client";

import type { QualityMode } from "@/lib/dashboard/types";

const QUALITY_OPTIONS: Array<{
  id: QualityMode;
  label: string;
  sub: string;
}> = [
  { id: "fast", label: "⚡ Rapide", sub: "~2 min · 720p" },
  { id: "high", label: "✨ Haute qualité", sub: "~5 min · 1080p" },
];

type Props = {
  quality: QualityMode;
  setQuality: (quality: QualityMode) => void;
};

export function QualitySelector({ quality, setQuality }: Props) {
  return (
    <div className="dash-quality-grid">
      {QUALITY_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`dash-quality-card${quality === option.id ? " active" : ""}`}
          onClick={() => setQuality(option.id)}
        >
          <div className="dash-quality-title">{option.label}</div>
          <div className="dash-quality-sub">{option.sub}</div>
        </button>
      ))}
    </div>
  );
}
