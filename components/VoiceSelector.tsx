"use client";
import React, { useState, useRef } from "react";
import { VOICES, VoiceOption } from "@/lib/voices";

type Props = {
  selectedVoiceId: string;
  onSelect: (voiceId: string) => void;
};

export const VoiceSelector: React.FC<Props> = ({ selectedVoiceId, onSelect }) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePreview = async (voice: VoiceOption, e: React.MouseEvent) => {
    e.stopPropagation();

    // Stop si déjà en lecture
    if (playingId === voice.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    // Stop audio précédent
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setLoadingId(voice.id);
    setPlayingId(null);

    try {
      const res = await fetch("/api/voice-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: voice.id }),
      });

      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => setPlayingId(null);
      audio.onpause = () => setPlayingId(null);

      setLoadingId(null);
      setPlayingId(voice.id);
      await audio.play();
    } catch {
      setLoadingId(null);
    }
  };

  const hommes = VOICES.filter(v => v.gender === "homme");
  const femmes = VOICES.filter(v => v.gender === "femme");

  const VoiceCard = ({ voice }: { voice: VoiceOption }) => {
    const isSelected = selectedVoiceId === voice.id;
    const isPlaying  = playingId === voice.id;
    const isLoading  = loadingId === voice.id;

    return (
      <div
        onClick={() => onSelect(voice.id)}
        style={{
          padding: "16px 20px",
          borderRadius: 16,
          background: isSelected
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.03)",
          border: isSelected
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(255,255,255,0.06)",
          cursor: "pointer",
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Infos voix */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 4,
          }}>
            <div style={{
              fontSize: 16, fontWeight: 700, color: isSelected ? "#ffffff" : "#aaaaaa",
              fontFamily: "system-ui",
            }}>
              {voice.name}
            </div>
            {isSelected && (
              <div style={{
                fontSize: 11, fontWeight: 600, color: "#ffffff",
                background: "rgba(255,255,255,0.15)",
                padding: "2px 8px", borderRadius: 20,
              }}>
                Sélectionnée
              </div>
            )}
          </div>
          <div style={{
            fontSize: 13, color: "#666", fontFamily: "system-ui",
          }}>
            {voice.style}
          </div>
        </div>

        {/* Bouton preview */}
        <button
          onClick={(e) => handlePreview(voice, e)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: isPlaying
              ? "rgba(255,255,255,0.15)"
              : "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.15s ease",
          }}
        >
          {isLoading ? (
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.3)",
              borderTop: "2px solid #ffffff",
              animation: "spin 0.8s linear infinite",
            }} />
          ) : isPlaying ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* Femmes */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, color: "#555",
          letterSpacing: "0.08em", textTransform: "uppercase",
          fontFamily: "system-ui", marginBottom: 10,
        }}>
          Voix féminines
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {femmes.map(v => <VoiceCard key={v.id} voice={v} />)}
        </div>
      </div>

      {/* Hommes */}
      <div>
        <div style={{
          fontSize: 12, fontWeight: 600, color: "#555",
          letterSpacing: "0.08em", textTransform: "uppercase",
          fontFamily: "system-ui", marginBottom: 10,
        }}>
          Voix masculines
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hommes.map(v => <VoiceCard key={v.id} voice={v} />)}
        </div>
      </div>
    </div>
  );
};
