"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  GraduationCap,
  Newspaper,
  PenSquare,
  RectangleHorizontal,
  RectangleVertical,
  Rocket,
  Sparkles,
  Square,
  Zap,
} from "lucide-react";
import { BackgroundComponents } from "@/components/ui/background-components";
import { AiPromptBox } from "@/components/ui/ai-prompt-box";
import { VOICES } from "@/lib/dashboard/constants";
import { isScriptModeAllowed } from "@/lib/dashboard/plan-limits";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = UseDashboardReturn;

const FORMAT_ICONS: Record<string, LucideIcon> = {
  "9:16": RectangleVertical,
  "16:9": RectangleHorizontal,
  "1:1": Square,
};

export function DashboardInputScreen(props: Props) {
  const router = useRouter();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const {
    credits,
    showToast,
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
    promptHistory,
    handlePromptKeyDown,
    error,
  } = props;

  const isBusy = loadingQ || screenshotLoading;
  const currentValue = mode === "ai" ? prompt : customScript;
  const canSubmit = currentValue.trim().length > 0 && !isBusy && cooldown === 0;
  const isFreePlan = credits?.plan === "free";

  const handleModeClick = (nextMode: "ai" | "script") => {
    if (nextMode === "script" && !isScriptModeAllowed(credits?.plan)) {
      showToast("Le mode Script est disponible a partir du plan Starter →", "info");
      router.push("/pricing");
      return;
    }
    setMode(nextMode);
  };

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
    <div className="dash-input-screen">
      <div className="dash-input-foreground" style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 className="dash-input-screen__title">Cree ta video</h1>
      </div>

      <div className={`dash-input-prompt-stack${isPickerOpen ? " is-picker-open" : ""}`}>
        <div id="tour-mode" className="dash-input-mode-row">
          {[
            { id: "ai", label: "Mode IA", Icon: Sparkles },
            { id: "script", label: "Mon script", Icon: PenSquare },
          ].map((m, index) => {
            const isScriptLocked = m.id === "script" && isFreePlan;
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => handleModeClick(m.id as "ai" | "script")}
                  className={`dash-input-mode-btn${mode === m.id ? " is-active" : ""}`}
                  style={{
                    cursor: isScriptLocked ? "not-allowed" : "pointer",
                    opacity: isScriptLocked ? 0.5 : 1,
                  }}
                >
                  <m.Icon size={14} strokeWidth={1.9} />
                  {m.label}
                  {isScriptLocked && (
                    <span
                      style={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        background: "#f59e0b",
                        color: "#000",
                        borderRadius: 100,
                        fontSize: 8,
                        fontWeight: 800,
                        padding: "1px 5px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      PRO
                    </span>
                  )}
                </button>
                {index < 1 && <span aria-hidden="true" className="dash-input-mode-divider" />}
              </div>
            );
          })}
        </div>

        <div className={`dash-input-composer-wrap${isPickerOpen ? " is-picker-open" : ""}`}>
          <BackgroundComponents glow="red" className="dash-input-composer-glow" aria-hidden />
          <AiPromptBox
            value={currentValue}
            onChange={(v) => (mode === "ai" ? setPrompt(v) : setCustomScript(v))}
            onKeyDown={handlePromptKeyDown}
            placeholder={mode === "ai" ? "Décris ta vidéo…" : "Colle ton script…"}
            format={format}
            onFormatChange={setFormat}
            formatIcons={FORMAT_ICONS}
            voices={VOICES}
            selectedVoiceId={selectedVoiceId}
            onVoiceChange={setSelectedVoiceId}
            canSubmit={canSubmit}
            onSubmit={() => void submit()}
            cooldown={cooldown}
            onPickerOpenChange={setIsPickerOpen}
          />
        </div>
      </div>

      {isFreePlan && (
        <div
          className="dash-input-foreground"
          style={{
            fontSize: 11,
            color: "var(--dash-text-tertiary)",
            textAlign: "center",
            marginTop: 8,
            width: "100%",
            maxWidth: 720,
          }}
        >
          Plan gratuit — max 30s ·{" "}
          <span
            role="button"
            tabIndex={0}
            style={{ color: "var(--dash-brand)", cursor: "pointer" }}
            onClick={() => router.push("/pricing")}
            onKeyDown={(e) => {
              if (e.key === "Enter") router.push("/pricing");
            }}
          >
            Upgrader pour plus
          </span>
        </div>
      )}

      {promptHistory.length > 0 && (
        <div
          className="dash-input-foreground"
          style={{
            fontSize: 10,
            color: "var(--dash-text-tertiary)",
            marginTop: 4,
            textAlign: "right",
            width: "100%",
            maxWidth: 720,
          }}
        >
          ↑↓ pour naviguer dans l'historique
        </div>
      )}

      <div
        id="tour-suggestions"
        className={`dash-input-suggestions${isPickerOpen ? " is-behind-picker" : ""}`}
      >
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
              className="dash-input-suggestion"
              onClick={() => {
                const suggestionPrompt = `Cree une video ${s.label.toLowerCase()} percutante`;
                if (mode === "ai") setPrompt(suggestionPrompt);
                else setCustomScript(suggestionPrompt);
              }}
            >
              <s.icon size={13} strokeWidth={1.9} />
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div
          className="dash-input-foreground"
          style={{ marginTop: 14, fontSize: 13, color: "#ef4444", textAlign: "center" }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
