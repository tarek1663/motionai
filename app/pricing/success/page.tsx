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
        background: "#0a0a0a",
        fontFamily: "inherit",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "36px 32px", maxWidth: 520, textAlign: "center" }}>
      <div style={{ fontSize: 64 }}>🎉</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
        <BackButton href="/dashboard" label="Dashboard" />
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em" }}>
        Bienvenue sur Motionr !
      </h1>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 15, textAlign: "center", maxWidth: 400, margin: "12px auto 24px" }}>
        Ton abonnement est actif. Tu vas être redirigé vers le dashboard dans quelques secondes.
      </p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 12 }}>
        Redirection automatique dans 5 secondes...
      </p>
      </div>
    </div>
  );
}
