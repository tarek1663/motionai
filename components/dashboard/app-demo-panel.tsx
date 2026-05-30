"use client";

import type { DemoFormat } from "@/lib/dashboard/types";

type Props = {
  demoScreenshots: string[];
  setDemoScreenshots: React.Dispatch<React.SetStateAction<string[]>>;
  demoDescription: string;
  setDemoDescription: (v: string) => void;
  demoFormat: DemoFormat;
  setDemoFormat: (v: DemoFormat) => void;
  onGenerate: () => void;
  disabled?: boolean;
};

export function AppDemoPanel({
  demoScreenshots,
  setDemoScreenshots,
  demoDescription,
  setDemoDescription,
  demoFormat,
  setDemoFormat,
  onGenerate,
  disabled,
}: Props) {
  const canGenerate =
    demoScreenshots.filter(Boolean).length > 0 && demoDescription.trim().length > 0;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 720,
        background: "#161616",
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          App Demo
        </div>
        <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          Upload des screenshots de ton app et laisse l&apos;IA créer une démo vidéo
          professionnelle.
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Screenshots (1-3 max)
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          {[0, 1, 2].map((i) => (
            <label
              key={i}
              style={{
                flex: 1,
                aspectRatio: "16/10",
                background: demoScreenshots[i]
                  ? "transparent"
                  : "rgba(255,255,255,0.03)",
                border: `1px dashed ${
                  demoScreenshots[i]
                    ? "rgba(16,185,129,0.4)"
                    : "rgba(255,255,255,0.1)"
                }`,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {demoScreenshots[i] ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demoScreenshots[i]}
                    alt={`Screenshot ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDemoScreenshots((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      border: "none",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 10,
                    }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>+</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                    {i === 0 ? "Principal" : i === 1 ? "Secondaire" : "Optionnel"}
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    const base64 = ev.target?.result as string;
                    setDemoScreenshots((prev) => {
                      const updated = [...prev];
                      updated[i] = base64;
                      return updated;
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Décris ton app
        </div>
        <textarea
          value={demoDescription}
          onChange={(e) => setDemoDescription(e.target.value)}
          placeholder="Ex: Motionr est un SaaS IA qui génère des vidéos motion design. Notre dashboard permet de créer une vidéo en 3 clics..."
          rows={3}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            padding: 12,
            fontSize: 14,
            color: "#fff",
            fontFamily: "inherit",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Format
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {(
            [
              { id: "desktop" as const, emoji: "🖥️", label: "Desktop", desc: "MacBook · 16:9" },
              { id: "mobile" as const, emoji: "📱", label: "Mobile", desc: "iPhone · 9:16" },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setDemoFormat(f.id)}
              style={{
                flex: 1,
                padding: 14,
                background:
                  demoFormat === f.id
                    ? "rgba(16,185,129,0.12)"
                    : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  demoFormat === f.id
                    ? "rgba(16,185,129,0.4)"
                    : "rgba(255,255,255,0.08)"
                }`,
                borderRadius: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>{f.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{f.label}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.4)",
                  marginTop: 2,
                }}
              >
                {f.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate || disabled}
        style={{
          width: "100%",
          padding: 14,
          background:
            canGenerate && !disabled ? "#10B981" : "rgba(255,255,255,0.06)",
          border: "none",
          borderRadius: 12,
          fontSize: 15,
          fontWeight: 700,
          color: "#fff",
          cursor: canGenerate && !disabled ? "pointer" : "not-allowed",
          fontFamily: "inherit",
        }}
      >
        Générer la démo →
      </button>
    </div>
  );
}
