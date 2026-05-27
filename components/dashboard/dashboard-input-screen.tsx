"use client";

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

  const suggestions = [
    { icon: "🚀", label: "Produit & Démo" },
    { icon: "🏢", label: "Brand & Marque" },
    { icon: "🎓", label: "Educatif" },
    { icon: "📊", label: "Data & Stats" },
    { icon: "📱", label: "Reseaux sociaux" },
    { icon: "📖", label: "Storytelling" },
    { icon: "📰", label: "News" },
    { icon: "⚡", label: "Motivation" },
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
        background: "#0a0a0a",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.15em",
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
            color: "#ffffff",
            letterSpacing: "-0.04em",
            marginBottom: 8,
          }}
        >
          Cree ta prochaine video
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>
          Decris ton idee ou ecris ton script directement.
        </p>
      </div>

      <div
        style={{
          display: "flex",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          padding: 4,
          marginBottom: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          gap: 2,
        }}
      >
        {[
          { id: "ai", label: "✦ Mode IA" },
          { id: "script", label: "✍️ Mon script" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id as "ai" | "script")}
            style={{
              padding: "8px 24px",
              borderRadius: 9,
              background: mode === m.id ? "rgba(255,255,255,0.08)" : "transparent",
              color: mode === m.id ? "#ffffff" : "rgba(255,255,255,0.35)",
              border:
                mode === m.id
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid transparent",
              fontSize: 13,
              fontWeight: mode === m.id ? 600 : 400,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#161616",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
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
            color: "rgba(255,255,255,0.85)",
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
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "5px 10px",
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
                cursor: "pointer",
                fontFamily: "inherit",
                outline: "none",
              }}
            >
              {["15s", "30s", "45s", "60s"].map((d) => (
                <option key={d} value={d} style={{ background: "#161616" }}>
                  {d}
                </option>
              ))}
            </select>

            <div
              style={{
                width: 1,
                height: 16,
                background: "rgba(255,255,255,0.08)",
                margin: "0 4px",
              }}
            />

            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: "5px 10px",
                fontSize: 12,
                color: "rgba(255,255,255,0.55)",
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
                <option key={f.value} value={f.value} style={{ background: "#161616" }}>
                  {f.label}
                </option>
              ))}
            </select>

            <div
              style={{
                width: 1,
                height: 16,
                background: "rgba(255,255,255,0.08)",
                margin: "0 4px",
              }}
            />

            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {[
                { id: "fast", label: "⚡ Rapide" },
                { id: "high", label: "✨ HD" },
              ].map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuality(q.id as "fast" | "high")}
                  style={{
                    padding: "5px 12px",
                    border: "none",
                    background: quality === q.id ? "rgba(255,255,255,0.1)" : "transparent",
                    color: quality === q.id ? "#fff" : "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    fontWeight: quality === q.id ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
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
              borderRadius: 10,
              background: canSubmit ? "#10B981" : "rgba(255,255,255,0.06)",
              border: "none",
              cursor: canSubmit ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              color: canSubmit ? "#fff" : "rgba(255,255,255,0.2)",
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
            color: "rgba(255,255,255,0.2)",
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
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 100,
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <span>{s.icon}</span>
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
