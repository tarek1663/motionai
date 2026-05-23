"use client";

import { useRef } from "react";
import {
  Clock,
  Music2,
  AudioLines,
  ChevronDown,
  ImagePlus,
  ArrowUp,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { VoicePickerPanel, type VoiceOption } from "@/components/ui/voice-picker-panel";
import { SCREENSHOT_USE_CASES } from "@/lib/dashboard/constants";
import {
  DashboardToolbarButton,
  DropMenuPanel,
  DropMenuItem,
} from "@/components/dashboard/ui";

type Props = {
  preview: string;
  intent: string;
  onIntentChange: (v: string) => void;
  onFile: (file: File) => void;
  onClear: () => void;
  duration: string;
  durations: readonly string[];
  onDurationChange: (d: string) => void;
  showDurationMenu: boolean;
  onToggleDurationMenu: () => void;
  musicEnabled: boolean;
  onMusicToggle: () => void;
  showVoices: boolean;
  onToggleVoices: () => void;
  voices: VoiceOption[];
  selectedVoiceId: string;
  onVoiceSelect: (id: string) => void;
  loading: boolean;
  onSubmit: () => void;
};

export function ScreenshotPanel({
  preview,
  intent,
  onIntentChange,
  onFile,
  onClear,
  duration,
  durations,
  onDurationChange,
  showDurationMenu,
  onToggleDurationMenu,
  musicEnabled,
  onMusicToggle,
  showVoices,
  onToggleVoices,
  voices,
  selectedVoiceId,
  onVoiceSelect,
  loading,
  onSubmit,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedVoice = voices.find((v) => v.id === selectedVoiceId);
  const pickFile = () => inputRef.current?.click();
  const canSubmit = !!preview && intent.trim().length > 0 && !loading;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
        }}
      />

      <div className="rounded-[14px] bg-white/50 border border-black/[0.03] px-4 sm:px-5 pt-4 pb-3 overflow-visible">
        <div className="flex gap-3 sm:gap-4">
          {preview ? (
            <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden bg-[#f5f5f7] group">
              <button
                type="button"
                onClick={pickFile}
                className="w-full h-full block"
                title="Changer l'image"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="" className="w-full h-full object-cover" />
              </button>
              <button
                type="button"
                onClick={onClear}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Retirer l'image"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={pickFile}
              className={cn(
                "w-[72px] h-[72px] sm:w-20 sm:h-20 shrink-0 rounded-xl",
                "border border-dashed border-[#d2d2d7] bg-[#fafafa]",
                "flex flex-col items-center justify-center gap-0.5",
                "hover:border-[#aeaeb2] hover:bg-white transition-colors"
              )}
              title="Ajouter une image"
            >
              <ImagePlus size={20} strokeWidth={1.5} className="text-[#86868b]" />
              <span className="text-[10px] text-[#aeaeb2] font-medium">Image</span>
            </button>
          )}

          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <textarea
              value={intent}
              onChange={(e) => onIntentChange(e.target.value)}
              placeholder="Décris la vidéo à partir de ton interface…"
              rows={2}
              className={cn(
                "w-full min-h-[52px] max-h-[120px] resize-none border-0 bg-transparent outline-none",
                "text-[17px] leading-relaxed text-[#1d1d1f] placeholder:text-[#aeaeb2]"
              )}
            />
            <div className="flex flex-wrap gap-1.5">
              {SCREENSHOT_USE_CASES.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onIntentChange(label)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors",
                    intent === label
                      ? "bg-[#1d1d1f] text-white"
                      : "bg-[#f5f5f7] text-[#86868b] hover:text-[#1d1d1f]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div data-menu className="flex items-center justify-between gap-3 mt-3">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <div data-menu className="relative">
              <DashboardToolbarButton
                active={showDurationMenu}
                onClick={onToggleDurationMenu}
                title="Durée"
              >
                <Clock size={16} strokeWidth={1.5} className="text-[#86868b]" />
                <span>{duration}</span>
                <ChevronDown
                  size={14}
                  className={cn("text-[#aeaeb2]", showDurationMenu && "rotate-180")}
                />
              </DashboardToolbarButton>
              <DropMenuPanel open={showDurationMenu}>
                {durations.map((d) => (
                  <DropMenuItem
                    key={d}
                    selected={duration === d}
                    onSelect={() => onDurationChange(d)}
                  >
                    {d}
                  </DropMenuItem>
                ))}
              </DropMenuPanel>
            </div>

            <DashboardToolbarButton active={showVoices} onClick={onToggleVoices} title="Voix">
              <AudioLines size={16} strokeWidth={1.5} className="text-[#86868b]" />
              <span className="max-w-[80px] truncate">{selectedVoice?.name ?? "Voix"}</span>
            </DashboardToolbarButton>

            <DashboardToolbarButton
              active={musicEnabled}
              onClick={onMusicToggle}
              title="Musique"
              className="!px-3"
            >
              <Music2
                size={16}
                strokeWidth={1.5}
                className={cn("text-[#86868b]", !musicEnabled && "opacity-30")}
              />
            </DashboardToolbarButton>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            title="Générer"
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors",
              canSubmit
                ? "bg-[#1d1d1f] text-white hover:bg-black"
                : "bg-[#e8e8ed] text-[#aeaeb2] cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <ArrowUp size={20} strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {showVoices && (
        <div className="mt-3 rounded-[14px] border border-black/[0.04] bg-white/50 p-3">
          <VoicePickerPanel
            open
            onClose={onToggleVoices}
            voices={voices}
            selectedId={selectedVoiceId}
            onSelect={(id) => {
              onVoiceSelect(id);
              onToggleVoices();
            }}
          />
        </div>
      )}
    </div>
  );
}
