"use client";

import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "calc(100vh - 44px)",
        background: "#ffffff",
        color: "#171311",
        fontFamily: "inherit",
        display: "flex",
      }}
    >
      <Sidebar active="create" />
      <main style={{ padding: "36px 40px", width: "100%", maxWidth: 920 }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 10 }}>
          Bienvenue sur Motionr
        </h1>
        <p style={{ color: "#7b746d", marginBottom: 28, fontSize: 16 }}>
          Configure ton espace rapidement et commence a generer tes videos.
        </p>

        <div
          style={{
            background: "#ffffff",
            border: "1.5px solid rgba(16,185,129,0.28)",
            borderRadius: 20,
            padding: 24,
            marginBottom: 16,
            boxShadow:
              "0 0 0 1px rgba(16,185,129,0.12), 0 0 18px rgba(16,185,129,0.16), 0 18px 44px rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ fontSize: 12, color: "#10B981", textTransform: "uppercase", marginBottom: 12 }}>
            Etape 1
          </div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 8, color: "#171311", fontWeight: 600 }}>
            Nom de la marque
          </label>
          <input
            placeholder="Ex: Motionr Studio"
            style={{
              width: "100%",
              padding: "12px 14px",
              marginBottom: 14,
              background: "#fafaf8",
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              color: "#625b55",
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
            }}
          />
          <label style={{ display: "block", fontSize: 14, marginBottom: 8 }}>Ton style de video</label>
          <textarea
            placeholder="Explique le ton et les objectifs..."
            style={{
              width: "100%",
              minHeight: 120,
              padding: "12px 14px",
              background: "#fafaf8",
              border: "1px solid #e8e8e8",
              borderRadius: 12,
              color: "#625b55",
              fontFamily: "inherit",
              fontSize: 14,
              outline: "none",
              resize: "vertical",
            }}
          />
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
              boxShadow: "0 8px 24px rgba(16,185,129,0.28)",
              cursor: "pointer",
            }}
          >
            Continuer
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              background: "#ffffff",
              border: "1.5px solid #e8e8e8",
              color: "rgba(23,19,17,0.72)",
              borderRadius: 10,
              padding: "12px 18px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Plus tard
          </button>
        </div>
      </main>
    </div>
  );
}
