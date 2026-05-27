"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 16,
        fontFamily: "inherit",
        textAlign: "center",
        padding: "0 40px",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 44,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(23,19,17,0.08)",
          boxShadow: "0 8px 24px rgba(23,19,17,0.05)",
        }}
      >
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            M
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0a0a" }}>
            Motionr
          </span>
        </a>
        <a
          href="/login"
          style={{
            padding: "8px 18px",
            background: "transparent",
            border: "1px solid rgba(23,19,17,0.12)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "#0a0a0a",
            textDecoration: "none",
          }}
        >
          Connexion
        </a>
      </header>
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: "rgba(23,19,17,0.08)",
          letterSpacing: "-0.06em",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#171311",
          letterSpacing: "-0.04em",
          marginTop: -20,
        }}
      >
        Page introuvable
      </h1>
      <p style={{ fontSize: 15, color: "#7b746d", maxWidth: 360, lineHeight: 1.6 }}>
        La page que tu cherches n&apos;existe pas ou a ete deplacee.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: "#ffffff",
            border: "1.5px solid #e8e8e8",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            color: "rgba(23,19,17,0.72)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 600,
          }}
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            background: "#10B981",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
            boxShadow: "0 8px 24px rgba(16,185,129,0.28)",
          }}
        >
          Dashboard →
        </button>
      </div>
    </div>
  );
}
