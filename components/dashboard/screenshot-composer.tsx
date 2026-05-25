"use client";

import { useRef } from "react";
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { QualitySelector } from "@/components/dashboard/quality-selector";
import { copy } from "@/lib/dashboard/copy";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<
  UseDashboardReturn,
  | "screenshotPreview"
  | "screenshotIntent"
  | "setScreenshotIntent"
  | "handleScreenshotFile"
  | "clearScreenshot"
  | "screenshotLoading"
  | "submitScreenshot"
  | "quality"
  | "setQuality"
>;

export function ScreenshotComposer({
  screenshotPreview,
  screenshotIntent,
  setScreenshotIntent,
  handleScreenshotFile,
  clearScreenshot,
  screenshotLoading,
  submitScreenshot,
  quality,
  setQuality,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canSubmit =
    !!screenshotPreview && screenshotIntent.trim().length > 0 && !screenshotLoading;

  return (
    <div className="dash-composer">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="dash-hidden-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleScreenshotFile(file);
        }}
      />

      {!screenshotPreview ? (
        <div
          role="button"
          tabIndex={0}
          className="dash-upload-zone"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <Upload size={24} strokeWidth={1.5} color="var(--dash-text-tertiary)" />
          <span className="dash-upload-label">{copy.uploadLabel}</span>
          <span className="dash-upload-hint">{copy.uploadHint}</span>
        </div>
      ) : (
        <>
          <div className="dash-preview-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screenshotPreview} alt="" className="dash-preview-img" />
            <button
              type="button"
              className="dash-preview-remove"
              onClick={clearScreenshot}
              aria-label="Retirer"
            >
              <X size={14} strokeWidth={2} color="#fff" />
            </button>
          </div>
          <textarea
            className="dash-screenshot-intent"
            value={screenshotIntent}
            onChange={(e) => setScreenshotIntent(e.target.value)}
            placeholder={copy.screenshotPlaceholder}
            rows={2}
          />
          <QualitySelector quality={quality} setQuality={setQuality} />
          <button
            type="button"
            className="dash-btn-primary dash-btn-full"
            onClick={submitScreenshot}
            disabled={!canSubmit}
          >
            {screenshotLoading ? (
              <Loader2 size={16} className="dash-animate-spin" />
            ) : (
              <>
                <Sparkles size={16} strokeWidth={1.75} />
                {copy.screenshotSubmit}
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}
