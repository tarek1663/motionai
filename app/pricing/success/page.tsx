"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
        background: "#0a0a0a",
        fontFamily: "inherit",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "36px 32px",
          maxWidth: 520,
          textAlign: "center",
        }}
      >
      <div style={{ fontSize: 64 }}>🎉</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Bienvenue sur Motionr !
      </h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, textAlign: "center", maxWidth: 400, margin: "12px auto 24px" }}>
        Ton abonnement est actif. Tu vas être redirigé vers le dashboard dans quelques secondes.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        style={{
          border: "none",
          padding: "14px 32px",
          background: "#ef4444",
          color: "#fff",
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Aller au dashboard →
      </button>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
        Redirection automatique dans 5 secondes...
      </p>
      </div>
    </div>
  );
}
