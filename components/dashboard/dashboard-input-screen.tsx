"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  ChevronDown,
  GraduationCap,
  Mic,
  Newspaper,
  PenSquare,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import { VoicePickerPanel } from "@/components/ui/voice-picker-panel";
import { VOICES } from "@/lib/dashboard/constants";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = UseDashboardReturn;

export function DashboardInputScreen(props: Props) {
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const {
    mode,
    setMode,
    prompt,
    setPrompt,
    customScript,
    setCustomScript,
    format,
    setFormat,
    selectedVoiceId,
    setSelectedVoiceId,
    submit,
    loadingQ,
    screenshotLoading,
    cooldown,
    error,
  } = props;

  const isBusy = loadingQ || screenshotLoading;
  const currentValue = mode === "ai" ? prompt : customScript;
  const canSubmit = currentValue.trim().length > 0 && !isBusy && cooldown === 0;
  const selectedVoice = VOICES.find((voice) => voice.id === selectedVoiceId);

  const suggestions: Array<{ icon: LucideIcon; label: string }> = [
    { icon: Rocket, label: "Produit & Demo" },
    { icon: BriefcaseBusiness, label: "Brand & Marque" },
    { icon: GraduationCap, label: "Educatif" },
    { icon: BarChart3, label: "Data & Stats" },
    { icon: Sparkles, label: "Reseaux sociaux" },
    { icon: BookOpenText, label: "Storytelling" },
    { icon: Newspaper, label: "News" },
    { icon: Zap, label: "Motivation" },
  ] as const;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "0 40px",
        background: "#ffffff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#171311",
            letterSpacing: "-0.04em",
            marginBottom: 8,
          }}
        >
          Cree ta video
        </h1>
      </div>

      <div
        id="tour-mode"
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 14,
          gap: 10,
        }}
      >
        {[
          { id: "ai", label: "Mode IA", Icon: Sparkles },
          { id: "script", label: "Mon script", Icon: PenSquare },
        ].map((m, index) => (
          <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              onClick={() => setMode(m.id as "ai" | "script")}
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
                color: mode === m.id ? "#171311" : "#8e8680",
                fontSize: 14,
                fontWeight: mode === m.id ? 600 : 500,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "color 0.15s",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <m.Icon size={14} strokeWidth={1.9} />
              {m.label}
            </button>
            {index === 0 && (
              <span
                aria-hidden="true"
                style={{
                  width: 1,
                  height: 16,
                  background: "#d6d3d1",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div style={{ width: "100%", maxWidth: 720, position: "relative" }}>
        <div
          style={{
            width: "100%",
            background: "#ffffff",
            borderRadius: 20,
            border: "1.5px solid rgba(16,185,129,0.26)",
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.12), 0 0 18px rgba(16,185,129,0.16), 0 18px 44px rgba(15,23,42,0.08)",
            overflow: "hidden",
          }}
        >
          <textarea
          value={currentValue}
          onChange={(e) =>
            mode === "ai" ? setPrompt(e.target.value) : setCustomScript(e.target.value)
          }
          placeholder={
            mode === "ai"
              ? "Decris ta video - ex. Presente Spotify en 30 secondes..."
              : "Ecris ton texte librement. L'IA le mettra en scene..."
          }
          rows={mode === "script" ? 5 : 2}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            outline: "none",
            padding: "10px 14px 6px",
            fontSize: 15,
            color: "#625b55",
            fontFamily: "inherit",
            resize: "none",
            lineHeight: 1.65,
            letterSpacing: "-0.01em",
          }}
        />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 10px 8px",
            }}
          >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{
                  background: "#f7f7f7",
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  padding: "5px 10px",
                  fontSize: 12,
                  color: "#7b746d",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  outline: "none",
                }}
              >
                <option value="9:16">9:16 · Reels</option>
                <option value="16:9">16:9 · YouTube</option>
                <option value="1:1">1:1 · Feed</option>
              </select>

              <button
                id="tour-voice"
                type="button"
                onClick={() => setShowVoicePanel((prev) => !prev)}
                style={{
                  background: "#f7f7f7",
                  border: "1px solid #e8e8e8",
                  borderRadius: 10,
                  padding: "6px 10px",
                  fontSize: 12,
                  color: "#625b55",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  outline: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Mic size={13} strokeWidth={1.8} />
                <span>{selectedVoice?.name || "Voix"}</span>
                <ChevronDown
                  size={13}
                  strokeWidth={1.8}
                  style={{
                    transform: showVoicePanel ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.15s ease",
                  }}
                />
              </button>
            </div>

            <div style={{ fontSize: 10, color: "rgba(23,19,17,0.35)", display: "flex", alignItems: "center", gap: 4 }}>
              <kbd
                style={{
                  background: "rgba(23,19,17,0.04)",
                  border: "1px solid rgba(23,19,17,0.1)",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: 9,
                  fontFamily: "inherit",
                }}
              >
                ⌘/Ctrl
              </kbd>
              <kbd
                style={{
                  background: "rgba(23,19,17,0.04)",
                  border: "1px solid rgba(23,19,17,0.1)",
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontSize: 9,
                  fontFamily: "inherit",
                }}
              >
                ↵
              </kbd>
              <span>pour generer</span>
            </div>
          </div>

          <button
            id="tour-generate"
            type="button"
            onClick={() => {
              void submit();
            }}
            disabled={!canSubmit}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              background: canSubmit ? "#10B981" : "#ecebea",
              border: "1px solid transparent",
              cursor: canSubmit ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: cooldown > 0 ? 10 : 16,
              fontWeight: 700,
              color: canSubmit ? "#fff" : "#c3c3c3",
              transition: "all 0.15s",
              flexShrink: 0,
              boxShadow: canSubmit ? "0 4px 12px rgba(16,185,129,0.3)" : "none",
            }}
          >
            {cooldown > 0 ? `${cooldown}s` : "↑"}
          </button>
          </div>
        </div>

        {showVoicePanel && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              left: 0,
              right: 0,
              background: "#ffffff",
              border: "1px solid #e8e8e8",
              borderRadius: 14,
              padding: "12px 12px 10px",
              boxShadow: "0 14px 30px rgba(15,23,42,0.08)",
              zIndex: 20,
            }}
          >
            <VoicePickerPanel
              open={showVoicePanel}
              onClose={() => setShowVoicePanel(false)}
              voices={VOICES}
              selectedId={selectedVoiceId}
              onSelect={setSelectedVoiceId}
              variant="dash"
              hint="Choisis une voix et écoute un aperçu avant de générer."
            />
          </div>
        )}
      </div>

      <div id="tour-suggestions" style={{ marginTop: 20, textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            justifyContent: "center",
            maxWidth: 680,
          }}
        >
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => {
                const suggestionPrompt = `Cree une video ${s.label.toLowerCase()} percutante`;
                if (mode === "ai") setPrompt(suggestionPrompt);
                else setCustomScript(suggestionPrompt);
              }}
              style={{
                padding: "7px 14px",
                background: "#ffffff",
                border: "1px solid #e8e8e8",
                borderRadius: 100,
                fontSize: 12,
                color: "#7b746d",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.08)";
                e.currentTarget.style.color = "#0d9668";
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.22)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#7b746d";
                e.currentTarget.style.borderColor = "#e8e8e8";
              }}
            >
              <s.icon size={13} strokeWidth={1.9} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 14, fontSize: 13, color: "#ef4444", textAlign: "center" }}>
          {error}
        </div>
      )}
    </div>
  );
}
