"use client";

import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpenText,
  BriefcaseBusiness,
  GraduationCap,
  Newspaper,
  PenSquare,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = UseDashboardReturn;

export function DashboardInputScreen(props: Props) {
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
    submit,
    loadingQ,
    screenshotLoading,
    error,
  } = props;

  const isBusy = loadingQ || screenshotLoading;
  const currentValue = mode === "ai" ? prompt : customScript;
  const canSubmit = currentValue.trim().length > 0 && !isBusy;

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
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#10B981",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Studio
        </div>
        <h1
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#171311",
            letterSpacing: "-0.04em",
            marginBottom: 8,
          }}
        >
          Cree ta prochaine video
        </h1>
        <p style={{ fontSize: 14, color: "#7b746d", fontWeight: 400 }}>
          Decris ton idee ou ecris ton script directement.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          background: "#f3f2f0",
          borderRadius: 12,
          padding: 4,
          marginBottom: 12,
          border: "1px solid #e5e5ea",
          gap: 2,
        }}
      >
        {[
          { id: "ai", label: "Mode IA", Icon: Sparkles },
          { id: "script", label: "Mon script", Icon: PenSquare },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as "ai" | "script")}
            style={{
              padding: "8px 24px",
              borderRadius: 9,
              background: mode === m.id ? "#ffffff" : "transparent",
              color: mode === m.id ? "#171311" : "#8e8680",
              border:
                mode === m.id
                  ? "1px solid rgba(23,19,17,0.1)"
                  : "1px solid transparent",
              fontSize: 13,
              fontWeight: mode === m.id ? 600 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <m.Icon size={14} strokeWidth={1.9} />
            {m.label}
          </button>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 720,
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
          rows={mode === "script" ? 8 : 4}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            outline: "none",
            padding: "20px 20px 12px",
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
            padding: "10px 14px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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
              {["15s", "30s", "45s", "60s"].map((d) => (
                <option key={d} value={d} style={{ background: "#ffffff" }}>
                  {d}
                </option>
              ))}
            </select>

            <div
              style={{
                width: 1,
                height: 16,
                background: "#e5e5ea",
                margin: "0 4px",
              }}
            />

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
              {[
                { value: "9:16", label: "9:16 · Reels" },
                { value: "16:9", label: "16:9 · YouTube" },
                { value: "1:1", label: "1:1 · Feed" },
              ].map((f) => (
                <option key={f.value} value={f.value} style={{ background: "#ffffff" }}>
                  {f.label}
                </option>
              ))}
            </select>

            <div
              style={{
                width: 1,
                height: 16,
                background: "#e5e5ea",
                margin: "0 4px",
              }}
            />

            <div
              style={{
                display: "flex",
                background: "#f7f7f7",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid #e8e8e8",
              }}
            >
              {[
                { id: "fast", label: "Rapide", Icon: Zap },
                { id: "high", label: "HD", Icon: Sparkles },
              ].map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuality(q.id as "fast" | "high")}
                  style={{
                    padding: "5px 12px",
                    border: "none",
                    background: quality === q.id ? "#ffffff" : "transparent",
                    color: quality === q.id ? "#171311" : "#8e8680",
                    fontSize: 11,
                    fontWeight: quality === q.id ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <q.Icon size={12} strokeWidth={2} />
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          <button
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
              fontSize: 16,
              color: canSubmit ? "#fff" : "#c3c3c3",
              transition: "all 0.15s",
              flexShrink: 0,
              boxShadow: canSubmit ? "0 4px 12px rgba(16,185,129,0.3)" : "none",
            }}
          >
            ↑
          </button>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <div
          style={{
            fontSize: 11,
            color: "#a39e98",
            marginBottom: 10,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Suggestions
        </div>
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
