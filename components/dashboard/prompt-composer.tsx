"use client";

import { useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  Mic,
  Music,
  RectangleHorizontal,
  RectangleVertical,
  Square,
} from "lucide-react";
import { colors } from "@/lib/colors";
import { copy } from "@/lib/dashboard/copy";
import { DURATIONS, FORMAT_OPTIONS, VOICES } from "@/lib/dashboard/constants";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { DashDropdown } from "@/components/dashboard/dash-dropdown";
import { QualitySelector } from "@/components/dashboard/quality-selector";
import { VoicePickerPanel } from "@/components/ui/voice-picker-panel";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

const FORMAT_ICONS: Record<string, LucideIcon> = {
  "9:16": RectangleVertical,
  "16:9": RectangleHorizontal,
  "1:1": Square,
};

type Props = Pick<
  UseDashboardReturn,
  | "prompt"
  | "setPrompt"
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
  | "fetchQuestions"
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

export function PromptComposer(props: Props) {
  const {
    prompt,
    setPrompt,
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
    fetchQuestions,
  } = props;

  const durationAnchorRef = useRef<HTMLDivElement>(null);
  const formatAnchorRef = useRef<HTMLDivElement>(null);
  const voiceAnchorRef = useRef<HTMLDivElement>(null);

  const menuSetters = { setShowDurationMenu, setShowFormatMenu, setShowVoices };
  const selectedVoice = VOICES.find((v) => v.id === selectedVoiceId);

  return (
    <>
      <div className="dash-composer">
        <div className="dash-composer-body">
          <textarea
            className="dash-composer-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                e.preventDefault();
                closeAllMenus(menuSetters);
                fetchQuestions();
              }
            }}
            placeholder={copy.promptPlaceholder}
            rows={3}
          />
          <p className="dash-field-hint">{copy.promptHelper}</p>
        </div>

        <QualitySelector quality={quality} setQuality={setQuality} />

        <div className="dash-toolbar">
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
          >
            <Music size={14} strokeWidth={1.75} />
            {musicEnabled ? "On" : "Off"}
          </button>

          <button
            type="button"
            className="dash-submit"
            onClick={() => {
              closeAllMenus(menuSetters);
              fetchQuestions();
            }}
            disabled={!prompt.trim() || loadingQ}
          >
            {loadingQ ? (
              <Loader2 size={16} strokeWidth={1.75} className="dash-animate-spin" />
            ) : (
              <ArrowUp size={16} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
