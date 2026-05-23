"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  Clock,
  LayoutTemplate,
  Mic,
  Music2,
  Sparkles,
  ChevronDown,
  ArrowUp,
  Palette,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_PLACEHOLDERS = [
  "Présente Spotify, la révolution musicale…",
  "Explique comment fonctionne l'IA en 60 secondes…",
  "Crée une pub produit pour une startup fitness…",
  "Raconte l'histoire de Tesla en motion design…",
  "Top 5 astuces productivité pour créateurs…",
];

export type VisualPreset = {
  id: string;
  label: string;
  swatches: string[];
};

export type AIChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholders?: string[];
  duration: string;
  durations: readonly string[];
  onDurationChange: (duration: string) => void;
  format: string;
  formats: readonly string[];
  onFormatChange: (format: string) => void;
  musicEnabled: boolean;
  onMusicToggle: () => void;
  voicePanelOpen: boolean;
  onVoiceClick: () => void;
  selectedVoiceName?: string;
  visualPreset?: string;
  visualPresets?: VisualPreset[];
  onVisualPresetChange?: (id: string) => void;
  voicePanel?: React.ReactNode;
  hideToolbar?: boolean;
  /** Avec hideToolbar : masque le bouton Générer (à placer dans la barre du parent) */
  hideSubmit?: boolean;
  className?: string;
};

function ToolbarPill({
  active,
  onClick,
  children,
  className,
  buttonRef,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-full text-[14px] font-medium",
        "cursor-pointer transition-colors duration-200 border",
        active
          ? "bg-gray-100 border-gray-300 text-gray-900"
          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 hover:border-gray-300",
        className
      )}
    >
      {children}
    </button>
  );
}

function MenuPortal({
  anchorRef,
  open,
  children,
  align = "left",
}: {
  anchorRef: React.RefObject<HTMLButtonElement | null>;
  open: boolean;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open || !anchorRef.current) return;

    const update = () => {
      const rect = anchorRef.current!.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6,
        left: align === "right" ? rect.right : rect.left,
        width: rect.width,
      });
    };

    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef, align]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      role="menu"
      className="fixed z-[9999] py-1 min-w-[120px] bg-white border border-gray-200 rounded-xl shadow-xl"
      style={{
        top: pos.top,
        left: align === "right" ? pos.left : pos.left,
        transform: align === "right" ? "translateX(-100%)" : undefined,
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  );
}

const AIChatInput = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholders = DEFAULT_PLACEHOLDERS,
  duration,
  durations,
  onDurationChange,
  format,
  formats,
  onFormatChange,
  musicEnabled,
  onMusicToggle,
  voicePanelOpen,
  onVoiceClick,
  selectedVoiceName = "Voix",
  visualPreset,
  visualPresets = [],
  onVisualPresetChange,
  voicePanel,
  hideToolbar = false,
  hideSubmit = false,
  className = "",
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [focused, setFocused] = useState(false);
  const [openMenu, setOpenMenu] = useState<"duration" | "format" | "style" | null>(null);
  const durationBtnRef = useRef<HTMLButtonElement>(null);
  const formatBtnRef = useRef<HTMLButtonElement>(null);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasContent = value.trim().length > 0;
  const isEngaged = focused || hasContent;
  const charCount = value.length;
  const activePreset = visualPresets.find((p) => p.id === visualPreset);

  const resizeTextarea = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(Math.max(el.scrollHeight, 80), 220)}px`;
  }, []);

  useEffect(() => {
    resizeTextarea();
  }, [value, resizeTextarea]);

  useEffect(() => {
    if (isEngaged) return;
    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
        setShowPlaceholder(true);
      }, 360);
    }, 3000);
    return () => clearInterval(interval);
  }, [isEngaged, placeholders.length]);

  useEffect(() => {
    if (!openMenu) return;
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      if (durationBtnRef.current?.contains(t)) return;
      if (formatBtnRef.current?.contains(t)) return;
      if (styleBtnRef.current?.contains(t)) return;
      setOpenMenu(null);
    };
    const t = window.setTimeout(() => {
      document.addEventListener("click", close);
    }, 0);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("click", close);
    };
  }, [openMenu]);

  const handleSubmit = () => {
    if (!value.trim() || disabled) return;
    onSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit();
    }
  };

  const toggleMenu = (menu: "duration" | "format" | "style") => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative w-full transition-all duration-300",
          hideToolbar
            ? "rounded-none bg-transparent border-0 shadow-none"
            : cn(
                "rounded-[28px] bg-white border",
                isEngaged
                  ? "border-gray-300 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.12)]"
                  : "border-gray-200/90 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] hover:border-gray-300"
              )
        )}
      >
        {/* En-tête */}
        {!hideToolbar && (
        <div className="flex items-center justify-between gap-6 px-8 sm:px-10 pt-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200/80 flex items-center justify-center">
              <Wand2 size={18} className="text-gray-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[14px] font-semibold text-gray-800 leading-none">Studio</p>
              <p className="text-[12px] text-gray-400 mt-1">Génération IA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {visualPresets.length > 0 && onVisualPresetChange && (
              <>
                <button
                  ref={styleBtnRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMenu("style");
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-full text-[13px] font-medium cursor-pointer border",
                    openMenu === "style"
                      ? "bg-gray-100 border-gray-300 text-gray-900"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white"
                  )}
                >
                  <Palette size={14} className="text-gray-500" />
                  {activePreset?.label ?? "Style"}
                  <ChevronDown size={12} className="opacity-50" />
                </button>
                <MenuPortal anchorRef={styleBtnRef} open={openMenu === "style"} align="right">
                  {visualPresets.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-2 px-4 py-2.5 text-[13px] cursor-pointer hover:bg-gray-50",
                        visualPreset === p.id && "bg-gray-100 font-semibold"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onVisualPresetChange(p.id);
                        setOpenMenu(null);
                      }}
                    >
                      <span className="flex -space-x-1">
                        {p.swatches.map((c) => (
                          <span
                            key={c}
                            className="w-3 h-3 rounded-full border border-white"
                            style={{ background: c }}
                          />
                        ))}
                      </span>
                      {p.label}
                    </button>
                  ))}
                </MenuPortal>
              </>
            )}
            {hasContent && (
              <span className="text-[11px] font-medium text-gray-400 tabular-nums px-2 py-1 rounded-md bg-gray-100/80">
                {charCount}
              </span>
            )}
          </div>
        </div>
        )}

        {/* Zone texte */}
        <div className={cn("px-8 sm:px-10 pb-4", hideToolbar ? "pt-6" : "pt-2")}>
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={disabled}
            rows={3}
            placeholder={placeholders[placeholderIndex]}
            className={cn(
              "w-full min-h-[80px] max-h-[220px] resize-none border-0 bg-transparent outline-none",
              "text-[17px] sm:text-[18px] leading-[1.6] text-gray-900 placeholder:text-gray-400",
              "transition-opacity duration-300",
              showPlaceholder ? "placeholder:opacity-100" : "placeholder:opacity-0"
            )}
          />
        </div>

        {!hideToolbar && <div className="mx-8 sm:mx-10 h-px bg-gray-200/90" />}

        {hideToolbar ? (
          !hideSubmit ? (
            <div className="flex justify-end px-6 sm:px-8 pb-5 pt-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasContent || disabled}
                className={cn(
                  "h-12 min-w-[140px] px-6 rounded-2xl flex items-center justify-center gap-2",
                  "text-[15px] font-semibold cursor-pointer transition-colors",
                  hasContent && !disabled
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                )}
              >
                <Sparkles size={18} />
                Générer
                <ArrowUp size={18} />
              </button>
            </div>
          ) : null
        ) : (
        <>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 sm:px-8 py-5">
          <div className="flex flex-1 flex-wrap items-center gap-2 p-3 rounded-2xl bg-gray-50 border border-gray-200">
            <ToolbarPill
              buttonRef={durationBtnRef}
              active={openMenu === "duration"}
              onClick={() => toggleMenu("duration")}
            >
              <Clock size={16} className="text-gray-500" />
              {duration}
              <ChevronDown size={13} className={cn("opacity-50", openMenu === "duration" && "rotate-180")} />
            </ToolbarPill>
            <MenuPortal anchorRef={durationBtnRef} open={openMenu === "duration"}>
              {durations.map((d) => (
                <button
                  key={d}
                  type="button"
                  className={cn(
                    "block w-full text-left px-4 py-2.5 text-[13px] cursor-pointer hover:bg-gray-50",
                    duration === d && "bg-gray-100 font-semibold"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDurationChange(d);
                    setOpenMenu(null);
                  }}
                >
                  {d}
                </button>
              ))}
            </MenuPortal>

            <ToolbarPill
              buttonRef={formatBtnRef}
              active={openMenu === "format"}
              onClick={() => toggleMenu("format")}
            >
              <LayoutTemplate size={16} className="text-gray-500" />
              {format}
              <ChevronDown size={13} className={cn("opacity-50", openMenu === "format" && "rotate-180")} />
            </ToolbarPill>
            <MenuPortal anchorRef={formatBtnRef} open={openMenu === "format"}>
              {formats.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={cn(
                    "block w-full text-left px-4 py-2.5 text-[13px] cursor-pointer hover:bg-gray-50",
                    format === f && "bg-gray-100 font-semibold"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    onFormatChange(f);
                    setOpenMenu(null);
                  }}
                >
                  {f}
                </button>
              ))}
            </MenuPortal>

            <ToolbarPill active={musicEnabled} onClick={onMusicToggle}>
              <Music2 size={16} className={musicEnabled ? "text-gray-700" : "text-gray-400"} />
              {musicEnabled ? "Musique" : "Muet"}
            </ToolbarPill>

            <ToolbarPill active={voicePanelOpen} onClick={onVoiceClick}>
              <Mic size={16} className={voicePanelOpen ? "text-gray-700" : "text-gray-400"} />
              {selectedVoiceName}
              <ChevronDown size={13} className={cn("opacity-50", voicePanelOpen && "rotate-180")} />
            </ToolbarPill>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasContent || disabled}
            className={cn(
              "shrink-0 h-14 min-w-[160px] px-6 rounded-2xl flex items-center justify-center gap-2",
              "text-[15px] font-semibold cursor-pointer transition-colors",
              hasContent && !disabled
                ? "bg-gray-900 text-white hover:bg-gray-800"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            )}
          >
            <Sparkles size={18} />
            Générer
            <ArrowUp size={18} />
          </button>
        </div>

        {voicePanelOpen && voicePanel && (
          <div className="px-6 sm:px-8 pb-5">{voicePanel}</div>
        )}
        </>
        )}

        {isEngaged && (
          <p className="text-center text-[12px] text-gray-400 pb-5 px-8">
            <kbd className="px-1.5 py-0.5 rounded border bg-white text-[10px]">↵</kbd> générer ·{" "}
            <kbd className="px-1.5 py-0.5 rounded border bg-white text-[10px]">⇧↵</kbd> nouvelle ligne
          </p>
        )}
      </div>
    </div>
  );
};

export { AIChatInput };
