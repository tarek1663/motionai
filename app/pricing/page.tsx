"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";
import { PricingPlansContent } from "@/components/pricing/pricing-plans-content";
import { colors } from "@/lib/colors";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    document.title = "Tarifs — Motionr";
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 44px)",
        background: "#ffffff",
        fontFamily: "var(--font-sans)",
        color: "#171311",
      }}
    >
      <div
        style={{
          padding: "0 48px",
          height: 60,
          borderBottom: "1px solid rgba(23,19,17,0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          position: "fixed",
          top: 44,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BackButton href="/dashboard" />
          <div
            style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: colors.accent,
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
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "#0a0a0a",
                fontFamily: "var(--font-display)",
              }}
            >
              Motionr
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => router.push(user ? "/dashboard" : "/login")}
          style={{
            background: "rgba(23,19,17,0.03)",
            border: "1px solid rgba(23,19,17,0.08)",
            borderRadius: 8,
            padding: "8px 16px",
            fontSize: 13,
            color: "rgba(23,19,17,0.72)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 500,
          }}
        >
          {user ? "← Dashboard" : "Connexion"}
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "132px 40px 80px" }}>
        <PricingPlansContent variant="standalone" />
      </div>
    </div>
  );
}
