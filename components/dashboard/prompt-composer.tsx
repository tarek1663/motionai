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
import type { ScriptMode } from "@/lib/dashboard/types";

const FORMAT_ICONS: Record<string, LucideIcon> = {
  "9:16": RectangleVertical,
  "16:9": RectangleHorizontal,
  "1:1": Square,
};

const MODE_OPTIONS: Array<{
  id: ScriptMode;
  label: string;
  sub: string;
}> = [
  { id: "ai", label: "✨ Mode IA", sub: "Claude génère le script" },
  { id: "script", label: "✍️ Mon script", sub: "J'écris moi-même" },
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
    submit,
  } = props;

  const durationAnchorRef = useRef<HTMLDivElement>(null);
  const formatAnchorRef = useRef<HTMLDivElement>(null);
  const voiceAnchorRef = useRef<HTMLDivElement>(null);

  const menuSetters = { setShowDurationMenu, setShowFormatMenu, setShowVoices };
  const selectedVoice = VOICES.find((v) => v.id === selectedVoiceId);
  const sceneCount = countScriptScenes(customScript);
  const estimatedSeconds = customScript.trim()
    ? Math.max(1, Math.round(customScript.split(/\s+/).filter(Boolean).length / 2.5))
    : 0;
  const canSubmit = mode === "ai" ? prompt.trim().length > 0 : customScript.trim().length > 0;

  return (
    <>
      <div className="dash-composer">
        <div className="dash-mode-toggle">
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`dash-mode-card${mode === option.id ? " active" : ""}`}
              onClick={() => setMode(option.id)}
            >
              <div className="dash-mode-title">{option.label}</div>
              <div className="dash-mode-sub">{option.sub}</div>
            </button>
          ))}
        </div>

        <div className="dash-composer-body">
          {mode === "ai" ? (
            <>
              <textarea
                className="dash-composer-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                    e.preventDefault();
                    closeAllMenus(menuSetters);
                    void submit();
                  }
                }}
                placeholder={copy.promptPlaceholder}
                rows={3}
              />
              <p className="dash-field-hint">{copy.promptHelper}</p>
            </>
          ) : (
            <div className="dash-script-wrap">
              <div className="dash-script-guide">
                <div className="dash-script-guide-title">✍️ Guide pour un beau script :</div>
                <div>• Une phrase courte par ligne = une scène animée</div>
                <div>• 4 à 12 lignes recommandées</div>
                <div>• Commence fort, termine par un appel à l&apos;action</div>
              </div>

              <textarea
                className="dash-script-input"
                value={customScript}
                onChange={(e) => setCustomScript(e.target.value)}
                placeholder={`Ex:\nLa solution qui change tout.\nPlus de 10 000 clients satisfaits.\nRapide. Simple. Puissant.\nEssaie maintenant gratuitement.`}
                rows={7}
              />

              {customScript.trim() && (
                <div className="dash-script-meta">
                  <span>{sceneCount} scènes · ~{estimatedSeconds}s estimées</span>
                  <span className={sceneCount > 12 ? "warn" : "ok"}>
                    {sceneCount > 12 ? "⚠️ Trop de scènes" : "✓ Bon format"}
                  </span>
                </div>
              )}
            </div>
          )}
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
              void submit();
            }}
            disabled={!canSubmit || loadingQ}
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
