"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "calc(100vh - 44px)", background: "#0a0a0a", color: "#fff", fontFamily: "inherit" }}>
      <header
        style={{
          position: "fixed",
          top: 44,
          left: 0,
          right: 0,
          height: 60,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,10,10,0.86)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(12px)",
          zIndex: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: 12,
            }}
          >
            M
          </div>
          <span style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>Motionr</span>
        </div>
        <a href="/dashboard" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: 13 }}>
          Passer →
        </a>
      </header>

      <main style={{ padding: "140px 24px 40px", maxWidth: 840, margin: "0 auto" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 10 }}>
          Bienvenue sur Motionr
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28, fontSize: 16 }}>
          Configure ton espace rapidement et commence a generer tes videos.
        </p>

        <div
          style={{
            background: "#161616",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 12, color: "#10B981", textTransform: "uppercase", marginBottom: 12 }}>
            Etape 1
          </div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>Nom de la marque</label>
          <input placeholder="Ex: Motionr Studio" style={{ width: "100%", padding: "12px 14px", marginBottom: 14 }} />
          <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>Ton style de video</label>
          <textarea placeholder="Explique le ton et les objectifs..." style={{ width: "100%", minHeight: 120, padding: "12px 14px" }} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "#10B981",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 700,
            }}
          >
            Continuer
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 600,
            }}
          >
            Plus tard
          </button>
        </div>
      </main>
    </div>
  );
}
