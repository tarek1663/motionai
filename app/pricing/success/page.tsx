"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/dashboard"), 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 44px)",
        background: "#ffffff",
        fontFamily: "inherit",
        color: "#171311",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
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
          href="/pricing"
          style={{
            padding: "8px 18px",
            background: "rgba(23,19,17,0.03)",
            border: "1px solid rgba(23,19,17,0.08)",
            borderRadius: 8,
            fontSize: 13,
            color: "rgba(23,19,17,0.72)",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Tarifs
        </a>
      </header>
      <div
        style={{
          background: "#ffffff",
          border: "1.5px solid rgba(16,185,129,0.3)",
          borderRadius: 20,
          padding: "36px 32px",
          maxWidth: 520,
          textAlign: "center",
          boxShadow:
            "0 0 0 1px rgba(16,185,129,0.12), 0 0 18px rgba(16,185,129,0.16), 0 18px 44px rgba(15,23,42,0.08)",
        }}
      >
      <div style={{ fontSize: 64 }}>🎉</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <BackButton href="/dashboard" label="Dashboard" />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Bienvenue sur Motionr !
      </h1>
      <p style={{ color: "#7b746d", fontSize: 15, textAlign: "center", maxWidth: 400, margin: "12px auto 24px" }}>
        Ton abonnement est actif. Tu vas être redirigé vers le dashboard dans quelques secondes.
      </p>
      <p style={{ fontSize: 12, color: "#9b938c", marginTop: 12 }}>
        Redirection automatique dans 5 secondes...
      </p>
      </div>
    </div>
  );
}
