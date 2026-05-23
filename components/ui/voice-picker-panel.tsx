"use client";

import { useRef, useState, useEffect } from "react";
import { Check, Play, Square, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type VoiceOption = {
  id: string;
  name: string;
  style: string;
  gender: "F" | "M";
  previewText?: string;
};

type VoicePickerPanelProps = {
  open: boolean;
  onClose: () => void;
  voices: VoiceOption[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
  variant?: "default" | "dash";
  hint?: string;
};

export function VoicePickerPanel({
  open,
  onClose,
  voices,
  selectedId,
  onSelect,
  className,
  variant = "default",
  hint = "Voix — clique sur ▶ pour un aperçu avant de générer",
}: VoicePickerPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const isDash = variant === "dash";

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!open && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
      setLoadingId(null);
    }
  }, [open]);

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const playPreview = async (voiceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (playingId === voiceId) {
      stopPreview();
      return;
    }

    stopPreview();
    setPreviewError(null);
    setLoadingId(voiceId);

    try {
      const res = await fetch("/api/voice-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Aperçu indisponible");

      const audio = new Audio(data.audioUrl);
      audioRef.current = audio;
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        setPlayingId(null);
        setPreviewError("Lecture impossible");
      };
      setPlayingId(voiceId);
      await audio.play();
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : "Erreur aperçu");
      setPlayingId(null);
    } finally {
      setLoadingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className={cn("w-full", className)}>
      <p
        className={cn(
          "voice-picker-hint font-medium mb-3",
          isDash ? "text-[12px] text-center text-[var(--dash-text-tertiary)]" : "text-[13px] text-[#86868b]"
        )}
      >
        {hint}
      </p>
      {previewError && (
        <p className="text-[12px] text-red-500 mb-3 text-center">{previewError}</p>
      )}
      <div
        className={cn(
          "grid gap-3",
          isDash ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
        )}
      >
        {voices.map((v) => {
          const selected = selectedId === v.id;
          const isPlaying = playingId === v.id;
          const isLoading = loadingId === v.id;

          return (
            <div
              key={v.id}
              className={cn(
                "voice-picker-card relative flex items-center gap-2.5 p-3 rounded-xl border transition-colors",
                isDash
                  ? selected
                    ? "border-[var(--dash-brand)] bg-[rgba(124,58,237,0.06)]"
                    : "border-[var(--dash-border-solid)] bg-[var(--dash-surface-muted)] hover:border-[#d2d2d7] hover:bg-[var(--dash-surface)]"
                  : selected
                    ? "border-gray-300 bg-gray-50/80"
                    : "border-transparent bg-transparent hover:bg-gray-50/80 hover:border-gray-200/80"
              )}
            >
              <button
                type="button"
                title={isPlaying ? "Arrêter l'aperçu" : "Écouter un aperçu"}
                aria-label={isPlaying ? `Arrêter ${v.name}` : `Aperçu ${v.name}`}
                onClick={(e) => void playPreview(v.id, e)}
                className={cn(
                  "voice-picker-play w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors",
                  isPlaying
                    ? "bg-[#1d1d1f] text-white"
                    : "bg-white/80 text-[#1d1d1f] hover:bg-white border border-black/[0.06]"
                )}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                ) : isPlaying ? (
                  <Square size={12} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play size={15} className="ml-0.5" strokeWidth={2} fill="currentColor" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  stopPreview();
                  onSelect(v.id);
                  onClose();
                }}
                className="min-w-0 flex-1 text-left cursor-pointer"
              >
                <p
                  className={cn(
                    "text-[14px] font-medium truncate",
                    isDash
                      ? selected
                        ? "text-[var(--dash-text)]"
                        : "text-[var(--dash-text-secondary)]"
                      : selected
                        ? "text-gray-900"
                        : "text-gray-700"
                  )}
                >
                  {v.name}
                </p>
                <p
                  className={cn(
                    "text-[12px] truncate",
                    isDash ? "text-[var(--dash-text-tertiary)]" : "text-gray-400"
                  )}
                >
                  {v.style}
                </p>
              </button>
              {selected && (
                <Check
                  size={16}
                  className={cn(
                    "absolute top-2 right-2 pointer-events-none",
                    isDash ? "text-[var(--dash-brand)]" : "text-gray-900"
                  )}
                  strokeWidth={2.5}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
