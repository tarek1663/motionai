"use client";

import { useRouter } from "next/navigation";

export function GlobalAnnouncementBar() {
  const router = useRouter();

  const goToPricing = () => {
    router.push("/pricing");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        onClick={goToPricing}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToPricing();
          }
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.98)",
          border: "1px solid rgba(16,185,129,0.38)",
          borderRadius: 100,
          padding: "5px 16px",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          pointerEvents: "auto",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 0 0 1px rgba(16,185,129,0.14), 0 8px 24px rgba(15,23,42,0.12), 0 0 20px rgba(16,185,129,0.18)",
        }}
      >
        <div className="shimmer-bar" aria-hidden="true" />
        <span
          style={{
            fontSize: 14,
            color: "#10B981",
            fontWeight: 800,
            textShadow: "0 0 18px rgba(16,185,129,0.35)",
            letterSpacing: "-0.01em",
          }}
        >
          ✨ Offre limitee
        </span>
        <span style={{ width: 1, height: 12, background: "rgba(23,19,17,0.14)" }} />
        <span style={{ fontSize: 14, color: "rgba(23,19,17,0.82)", fontWeight: 500 }}>
          Essaie le plan Starter
          <span style={{ color: "#0a0a0a", fontWeight: 800 }}> 4 jours gratuitement</span>
        </span>
        <span style={{ fontSize: 14, color: "rgba(23,19,17,0.45)", fontWeight: 800 }}>→</span>
      </div>
    </div>
  );
}
