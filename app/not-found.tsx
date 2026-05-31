"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
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
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: "rgba(255,255,255,0.06)",
          letterSpacing: "-0.06em",
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.04em",
          marginTop: -20,
        }}
      >
        Page introuvable
      </h1>
      <p style={{ fontSize: 15, color: "rgba(255,255,255,0.35)", maxWidth: 360, lineHeight: 1.6 }}>
        La page que tu cherches n&apos;existe pas ou a ete deplacee.
      </p>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          style={{
            background: "#ef4444",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            color: "#fff",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 700,
          }}
        >
          Dashboard →
        </button>
      </div>
    </div>
  );
}
