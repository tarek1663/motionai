"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import {
  Clock,
  AudioLines,
  Music2,
  ChevronDown,
  ArrowUp,
  Palette,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VoicePickerPanel, type VoiceOption } from "@/components/ui/voice-picker-panel";
import type { FormatOption } from "@/lib/dashboard/constants";

const accent = "#7C3AED";

export type VisualPresetOption = {
  id: string;
  label: string;
  swatches: string[];
};

function ToolbarBtn({
  active,
  onClick,
  children,
  title,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-full text-[14px] text-[#1d1d1f]",
        "bg-white/70 transition-colors cursor-pointer select-none",
        active ? "bg-white/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "opacity-90 hover:bg-white/80",
        className
      )}
    >
      {children}
    </button>
  );
}

function DropMenu({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return (
    <div
      data-menu
      className="absolute top-full left-0 mt-1.5 py-1 min-w-[108px] rounded-xl border border-black/[0.06] bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[200]"
    >
      {children}
    </div>
  );
}

function MenuOption({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-menu
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "block w-full text-left px-3.5 py-2 text-[13px] cursor-pointer transition-colors",
        selected ? "bg-[#f5f5f7] text-[#1d1d1f] font-medium" : "text-[#1d1d1f]/80 hover:bg-[#f5f5f7]"
      )}
    >
      {children}
    </button>
  );
}

export type PromptStudioBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholders?: readonly string[];
  duration: string;
  durations: readonly string[];
  onDurationChange: (d: string) => void;
  format: string;
  formatOptions: readonly FormatOption[];
  onFormatChange: (f: string) => void;
  musicEnabled: boolean;
  onMusicToggle: () => void;
  voices: VoiceOption[];
  selectedVoiceId: string;
  onVoiceSelect: (id: string) => void;
  showVoices: boolean;
  onToggleVoices: () => void;
  visualPreset?: string;
  visualPresets?: VisualPresetOption[];
  onVisualPresetChange?: (id: string) => void;
  disabled?: boolean;
  submitLoading?: boolean;
};

const DEFAULT_PLACEHOLDER = "Décris ton animation vidéo…";

/** Échelle UI cohérente (~125 %) */
const UI = {
  iconToolbar: 21,
  iconChevron: 19,
  iconSubmit: 24,
  textareaMin: 52,
  textareaMax: 200,
} as const;

export function PromptStudioBar({
  value,
  onChange,
  onSubmit,
  placeholders = [],
  duration,
  durations,
  onDurationChange,
  format,
  formatOptions,
  onFormatChange,
  musicEnabled,
  onMusicToggle,
  voices,
  selectedVoiceId,
  onVoiceSelect,
  showVoices,
  onToggleVoices,
  visualPreset,
  visualPresets = [],
  onVisualPresetChange,
  disabled = false,
  submitLoading = false,
}: PromptStudioBarProps) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [focused, setFocused] = useState(false);
  const [showDurationMenu, setShowDurationMenu] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = value.trim().length > 0;
  const activePreset = visualPresets.find((p) => p.id === visualPreset);
  const placeholderText =
    placeholders.length > 0 ? placeholders[placeholderIndex] : DEFAULT_PLACEHOLDER;

  const resizeTextarea = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, UI.textareaMin), UI.textareaMax)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  useEffect(() => {
    if (focused || hasContent || placeholders.length === 0) return;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setShowPlaceholder(true);
      }, 280);
    }, 5000);
    return () => clearInterval(interval);
  }, [focused, hasContent, placeholders.length]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-menu]")) {
        setShowDurationMenu(false);
        setShowFormatMenu(false);
        setShowStyleMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && hasContent) {
      e.preventDefault();
      onSubmit();
    }
  };

  const closeMenus = () => {
    setShowDurationMenu(false);
    setShowFormatMenu(false);
    setShowStyleMenu(false);
  };

  return (
    <div className="w-full">
      {visualPresets.length > 0 && onVisualPresetChange && (
        <div data-menu className="relative flex justify-start mb-3.5">
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              setShowStyleMenu((p) => !p);
              setShowDurationMenu(false);
              setShowFormatMenu(false);
            }}
            className={cn(
              "inline-flex items-center gap-3 h-12 pl-2 pr-3 rounded-2xl text-[17px] text-gray-600",
              "bg-white/70 hover:bg-white transition-colors cursor-pointer",
              showStyleMenu && "bg-white"
            )}
          >
            <Palette size={UI.iconToolbar} strokeWidth={1.75} className="text-gray-500" />
            <span className="font-medium text-gray-800">
              {activePreset?.label ?? "Style"}
            </span>
            {activePreset && (
              <span className="flex -space-x-2 ml-0.5">
                {activePreset.swatches.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="w-[18px] h-[18px] rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </span>
            )}
            <ChevronDown
              size={UI.iconChevron}
              className={cn("text-gray-400 transition-transform", showStyleMenu && "rotate-180")}
            />
          </button>
          <DropMenu open={showStyleMenu}>
            {visualPresets.map((p) => (
              <MenuOption
                key={p.id}
                selected={visualPreset === p.id}
                onSelect={() => {
                  onVisualPresetChange(p.id);
                  closeMenus();
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="flex -space-x-1">
                    {p.swatches.map((c) => (
                      <span
                        key={c}
                        className="w-4 h-4 rounded-full border border-white"
                        style={{ background: c }}
                      />
                    ))}
                  </span>
                  {p.label}
                </span>
              </MenuOption>
            ))}
          </DropMenu>
        </div>
      )}

      <div
        className={cn(
          "rounded-[14px] bg-white/50 border border-black/[0.03] px-5 sm:px-6 pt-4 pb-3 transition-shadow duration-150 overflow-visible"
        )}
      >
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          rows={2}
          placeholder={placeholderText}
          className={cn(
            "w-full min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent outline-none",
            "text-[17px] leading-relaxed text-[#1d1d1f] placeholder:text-[#aeaeb2]",
            "transition-opacity duration-300",
            showPlaceholder ? "placeholder:opacity-100" : "placeholder:opacity-0"
          )}
        />

        <div data-menu className="flex items-center justify-between gap-4 mt-3">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <div data-menu className="relative">
              <ToolbarBtn
                active={showDurationMenu}
                onClick={() => {
                  setShowDurationMenu((p) => !p);
                  setShowFormatMenu(false);
                  setShowStyleMenu(false);
                }}
                title="Durée"
              >
                <Clock size={UI.iconToolbar} strokeWidth={1.75} className="text-gray-500" />
                <span>{duration}</span>
                <ChevronDown
                  size={UI.iconChevron}
                  className={cn("text-gray-400 transition-transform", showDurationMenu && "rotate-180")}
                />
              </ToolbarBtn>
              <DropMenu open={showDurationMenu}>
                {durations.map((d) => (
                  <MenuOption
                    key={d}
                    selected={duration === d}
                    onSelect={() => {
                      onDurationChange(d);
                      closeMenus();
                    }}
                  >
                    {d}
                  </MenuOption>
                ))}
              </DropMenu>
            </div>

            <div data-menu style={{ position: "relative" }}>
              <button
                type="button"
                title="Format"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setShowFormatMenu((p) => !p);
                  setShowDurationMenu(false);
                  setShowStyleMenu(false);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 8,
                  background: showFormatMenu ? "#f5f3ff" : "#f5f5f5",
                  border: `1px solid ${showFormatMenu ? accent + "44" : "#e8e8e8"}`,
                  fontSize: 13, fontWeight: 500,
                  color: showFormatMenu ? accent : "#333", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {formatOptions.find((f) => f.id === format)?.icon || "▯"}
                </span>
                {format}
                ▾
              </button>
              {showFormatMenu && (
                <div
                  data-menu
                  style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0,
                    background: "#fff", border: "1.5px solid #e8e8e8",
                    borderRadius: 12, zIndex: 200,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 160,
                  }}
                >
                  {formatOptions.map((f) => (
                    <div
                      key={f.id}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        onFormatChange(f.id);
                        setShowFormatMenu(false);
                      }}
                      style={{
                        padding: "10px 16px", fontSize: 13, cursor: "pointer",
                        color: format === f.id ? accent : "#333",
                        fontWeight: format === f.id ? 700 : 400,
                        background: format === f.id ? "#f5f3ff" : "transparent",
                        display: "flex", alignItems: "center", gap: 10,
                      }}
                      onMouseEnter={(e) => {
                        if (format !== f.id) (e.currentTarget as HTMLElement).style.background = "#f5f5f5";
                      }}
                      onMouseLeave={(e) => {
                        if (format !== f.id) (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{f.icon}</span>
                      <div>
                        <div style={{ fontWeight: format === f.id ? 700 : 500 }}>{f.label}</div>
                        <div style={{ fontSize: 11, color: "#aaa", fontWeight: 400 }}>{f.desc}</div>
                      </div>
                      {format === f.id && (
                        <span style={{ marginLeft: "auto", color: accent }}>✓</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <ToolbarBtn
              active={musicEnabled}
              onClick={onMusicToggle}
              title={musicEnabled ? "Musique activée" : "Musique désactivée"}
              className="!px-3"
            >
              <Music2
                size={UI.iconToolbar}
                strokeWidth={1.75}
                className={cn("text-gray-500", !musicEnabled && "opacity-35")}
              />
            </ToolbarBtn>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <ToolbarBtn active={showVoices} onClick={onToggleVoices} title="Voix">
              <AudioLines size={UI.iconToolbar} strokeWidth={1.75} className="text-gray-500" />
              <span>Voix</span>
            </ToolbarBtn>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!hasContent || disabled || submitLoading}
              title="Générer"
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0",
                hasContent && !disabled && !submitLoading
                  ? "bg-[#1d1d1f] text-white hover:bg-black cursor-pointer"
                  : "bg-[#e8e8ed] text-[#86868b] cursor-not-allowed"
              )}
            >
              {submitLoading ? (
                <Loader2 size={20} className="animate-spin" strokeWidth={2} />
              ) : (
                <ArrowUp size={UI.iconSubmit} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>

      {showVoices && (
        <div
          data-menu
          className="mt-6 rounded-[16px] border border-black/[0.04] bg-white/50 px-6 py-5"
        >
          <VoicePickerPanel
            open
            onClose={onToggleVoices}
            voices={voices}
            selectedId={selectedVoiceId}
            onSelect={onVoiceSelect}
            className="border-0 shadow-none p-0 rounded-none"
          />
        </div>
      )}
    </div>
  );
}
