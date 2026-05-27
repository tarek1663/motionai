"use client";

import type { QualityMode } from "@/lib/dashboard/types";

const QUALITY_OPTIONS: Array<{
  id: QualityMode;
  label: string;
}> = [
  { id: "fast", label: "Rapide" },
  { id: "high", label: "Haute qualite" },
];

type Props = {
  quality: QualityMode;
  setQuality: (quality: QualityMode) => void;
};

export function QualitySelector({ quality, setQuality }: Props) {
  return (
    <div className="dash-quality-wrap">
      <div className="dash-quality-switch" role="tablist" aria-label="Qualite">
        {QUALITY_OPTIONS.map((option) => {
          const isActive = quality === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`dash-quality-option${isActive ? " active" : ""}`}
              onClick={() => setQuality(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
