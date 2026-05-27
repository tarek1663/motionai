"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Clock,
  ImagePlus,
  Loader2,
  Mic,
  Music,
  RectangleHorizontal,
  RectangleVertical,
  Square,
  X,
} from "lucide-react";
import { colors } from "@/lib/colors";
import { copy } from "@/lib/dashboard/copy";
import { DURATIONS, FORMAT_OPTIONS, VOICES } from "@/lib/dashboard/constants";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashDropdown } from "@/components/dashboard/dash-dropdown";
import { QualitySelector } from "@/components/dashboard/quality-selector";
import { VoicePickerPanel } from "@/components/ui/voice-picker-panel";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";
import type { ScriptMode } from "@/lib/dashboard/types";

const FORMAT_ICONS: Record<string, LucideIcon> = {
  "9:16": RectangleVertical,
  "16:9": RectangleHorizontal,
  "1:1": Square,
};

const MODE_OPTIONS: Array<{
  id: ScriptMode;
  label: string;
}> = [
  { id: "ai", label: "Mode IA" },
  { id: "script", label: "Mon script" },
];

type Props = Pick<
  UseDashboardReturn,
  | "mode"
  | "setMode"
  | "prompt"
  | "setPrompt"
  | "customScript"
  | "setCustomScript"
  | "duration"
  | "setDuration"
  | "format"
  | "setFormat"
  | "quality"
  | "setQuality"
  | "selectedVoiceId"
  | "setSelectedVoiceId"
  | "musicEnabled"
  | "setMusicEnabled"
  | "showDurationMenu"
  | "setShowDurationMenu"
  | "showFormatMenu"
  | "setShowFormatMenu"
  | "showVoices"
  | "setShowVoices"
  | "loadingQ"
  | "screenshotPreview"
  | "handleScreenshotFile"
  | "clearScreenshot"
  | "screenshotLoading"
  | "submit"
>;

function closeAllMenus(
  setters: {
    setShowDurationMenu: Props["setShowDurationMenu"];
    setShowFormatMenu: Props["setShowFormatMenu"];
    setShowVoices: Props["setShowVoices"];
  }
) {
  setters.setShowDurationMenu(false);
  setters.setShowFormatMenu(false);
  setters.setShowVoices(false);
}

function countScriptScenes(script: string): number {
  return script
    .split("\n")
    .filter((line) => line.trim().length > 0).length;
}

export function PromptComposer(props: Props) {
  const {
    mode,
    setMode,
    prompt,
    setPrompt,
    customScript,
    setCustomScript,
    duration,
    setDuration,
    format,
    setFormat,
    quality,
    setQuality,
    selectedVoiceId,
    setSelectedVoiceId,
    musicEnabled,
    setMusicEnabled,
    showDurationMenu,
    setShowDurationMenu,
    showFormatMenu,
    setShowFormatMenu,
    showVoices,
    setShowVoices,
    loadingQ,
    screenshotPreview,
    handleScreenshotFile,
    clearScreenshot,
    screenshotLoading,
    submit,
  } = props;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const durationAnchorRef = useRef<HTMLDivElement>(null);
  const formatAnchorRef = useRef<HTMLDivElement>(null);
  const voiceAnchorRef = useRef<HTMLDivElement>(null);

  const menuSetters = { setShowDurationMenu, setShowFormatMenu, setShowVoices };
  const selectedVoice = VOICES.find((v) => v.id === selectedVoiceId);
  const sceneCount = countScriptScenes(customScript);
  const estimatedSeconds = customScript.trim()
    ? Math.max(1, Math.round(customScript.split(/\s+/).filter(Boolean).length / 2.5))
    : 0;

  const hasImage = Boolean(screenshotPreview);
  const isBusy = loadingQ || screenshotLoading;

  const canSubmit = hasImage
    ? prompt.trim().length > 0
    : mode === "ai"
      ? prompt.trim().length > 0
      : customScript.trim().length > 0;

  const openImagePicker = () => fileInputRef.current?.click();

  const handleSubmitClick = () => {
    closeAllMenus(menuSetters);
    void submit();
  };

  const submitButton = (
    <button
      type="button"
      className="dash-submit dash-submit--in-prompt"
      onClick={handleSubmitClick}
      disabled={!canSubmit || isBusy}
      aria-label="Valider"
    >
      {isBusy ? (
        <Loader2 size={16} strokeWidth={1.75} className="dash-animate-spin" />
      ) : (
        <ArrowUp size={16} strokeWidth={2} />
      )}
    </button>
  );

  return (
    <div className="dash-prompt-stack">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/*"
        className="dash-hidden-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleScreenshotFile(file);
          e.target.value = "";
        }}
      />

      {!hasImage && (
        <div className="dash-mode-toggle dash-detached-row">
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`dash-mode-card${mode === option.id ? " active" : ""}`}
              onClick={() => setMode(option.id)}
            >
              <div className="dash-mode-title">{option.label}</div>
            </button>
          ))}
        </div>
      )}

      <div className={`dash-composer ${hasImage ? " dash-composer--with-image" : ""}`}>
        {hasImage && (
          <div className="dash-composer-attach">
            <div className="dash-composer-attach-thumb">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={screenshotPreview} alt="" />
            </div>
            <div className="dash-composer-attach-meta">
              <span className="dash-composer-attach-label">{copy.attachImage}</span>
            </div>
            <button
              type="button"
              className="dash-composer-attach-remove"
              onClick={clearScreenshot}
              aria-label={copy.removeImage}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        {hasImage || mode === "ai" ? (
          <div className="dash-composer-prompt-surface">
            <textarea
              className="dash-composer-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && prompt.trim() && !isBusy) {
                  e.preventDefault();
                  handleSubmitClick();
                }
              }}
              placeholder={
                hasImage ? copy.promptPlaceholderImage : copy.promptPlaceholder
              }
              rows={2}
            />
            {submitButton}
          </div>
        ) : (
          <div className="dash-script-wrap dash-composer-prompt-surface">
            <textarea
              className="dash-script-input"
              value={customScript}
              onChange={(e) => setCustomScript(e.target.value)}
              placeholder={`Écris ce que tu veux dire...\n\nEx : Présente mon app fitness avec des séances de 10 minutes par jour.`}
              rows={6}
            />

            {customScript.trim() && (
              <div className="dash-script-meta">
                <span>
                  {sceneCount} scènes · ~{estimatedSeconds}s
                </span>
                <span className={sceneCount > 12 ? "warn" : "ok"}>
                  {sceneCount > 12 ? "Trop de scènes" : "Bon format"}
                </span>
              </div>
            )}

            {submitButton}
          </div>
        )}
      </div>

      <div className="dash-detached-row">
        <QualitySelector quality={quality} setQuality={setQuality} />
      </div>

      <div className="dash-toolbar dash-detached-row">
        <div className="dash-toolbar-left">
          <div ref={durationAnchorRef} data-menu className="dash-toolbar-item">
          <button
            type="button"
            aria-expanded={showDurationMenu}
            aria-haspopup="listbox"
            onClick={() => {
              setShowDurationMenu((p) => !p);
              setShowFormatMenu(false);
              setShowVoices(false);
            }}
            className={`dash-pill${showDurationMenu ? " active" : ""}`}
          >
            <Clock size={14} strokeWidth={1.75} />
            {duration}
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={`dash-chevron${showDurationMenu ? " open" : ""}`}
            />
          </button>
          <DashDropdown
            open={showDurationMenu}
            onClose={() => setShowDurationMenu(false)}
            anchorRef={durationAnchorRef}
            minWidth={112}
          >
            {DURATIONS.map((d) => (
              <button
                key={d}
                type="button"
                role="option"
                aria-selected={duration === d}
                className={`dash-menu-item dash-menu-item-btn dash-menu-item-mono${duration === d ? " selected" : ""}`}
                onClick={() => {
                  setDuration(d);
                  setShowDurationMenu(false);
                }}
              >
                {d}
                {duration === d && <Check size={14} strokeWidth={2} color={colors.accent} />}
              </button>
            ))}
          </DashDropdown>
          </div>

          <span className="dash-toolbar-divider" aria-hidden="true" />

          <div ref={formatAnchorRef} data-menu className="dash-toolbar-item">
          <button
            type="button"
            aria-expanded={showFormatMenu}
            aria-haspopup="listbox"
            onClick={() => {
              setShowFormatMenu((p) => !p);
              setShowDurationMenu(false);
              setShowVoices(false);
            }}
            className={`dash-pill${showFormatMenu ? " active" : ""}`}
          >
            <DashboardIcon icon={FORMAT_ICONS[format] ?? RectangleVertical} size={14} />
            {format}
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={`dash-chevron${showFormatMenu ? " open" : ""}`}
            />
          </button>
          <DashDropdown
            open={showFormatMenu}
            onClose={() => setShowFormatMenu(false)}
            anchorRef={formatAnchorRef}
            minWidth={220}
          >
            {FORMAT_OPTIONS.map((f) => (
              <button
                key={f.id}
                type="button"
                role="option"
                aria-selected={format === f.id}
                className={`dash-menu-item dash-menu-item-btn dash-menu-item-row${format === f.id ? " selected" : ""}`}
                onClick={() => {
                  setFormat(f.id);
                  setShowFormatMenu(false);
                }}
              >
                <DashboardIcon icon={FORMAT_ICONS[f.id] ?? RectangleVertical} size={16} />
                <span className="dash-menu-item-grow">
                  <span className="dash-menu-item-mono">{f.label}</span>
                  <span className="dash-menu-item-desc">{f.desc}</span>
                </span>
                {format === f.id && (
                  <Check size={14} strokeWidth={2} color={colors.accent} className="dash-menu-check" />
                )}
              </button>
            ))}
          </DashDropdown>
          </div>

          <span className="dash-toolbar-divider" aria-hidden="true" />

          <div ref={voiceAnchorRef} data-menu className="dash-toolbar-item">
          <button
            type="button"
            aria-expanded={showVoices}
            aria-haspopup="listbox"
            onClick={() => {
              setShowVoices((p) => !p);
              setShowDurationMenu(false);
              setShowFormatMenu(false);
            }}
            className={`dash-pill${showVoices ? " active" : ""}`}
          >
            <Mic size={14} strokeWidth={1.75} />
            {selectedVoice?.name ?? "Voix"}
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={`dash-chevron${showVoices ? " open" : ""}`}
            />
          </button>
          <DashDropdown
            open={showVoices}
            onClose={() => setShowVoices(false)}
            anchorRef={voiceAnchorRef}
            minWidth={340}
            maxHeight={420}
          >
            <VoicePickerPanel
              open={showVoices}
              onClose={() => setShowVoices(false)}
              voices={VOICES}
              selectedId={selectedVoiceId}
              onSelect={(id) => {
                setSelectedVoiceId(id);
                setShowVoices(false);
              }}
              variant="dash"
              hint={`${copy.voicesLabel} — ${copy.voicesPreviewHint}`}
              className="dash-voice-picker"
            />
          </DashDropdown>
          </div>

          <button
            type="button"
            onClick={() => setMusicEnabled((p) => !p)}
            className={`dash-pill${musicEnabled ? " active" : ""}`}
            title="Musique"
          >
            <Music size={14} strokeWidth={1.75} />
          </button>

          {!hasImage && (
            <button
              type="button"
              onClick={openImagePicker}
              className="dash-pill"
              title={`${copy.attachImage} — ${copy.attachImageHint}`}
            >
              <ImagePlus size={14} strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
