"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { colors } from "@/lib/colors";

const accent = colors.accent;

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    monthly: 0,
    yearly: 0,
    videos: 3,
    duration: "30s max",
    features: ["3 vidéos / mois", "30 secondes max", "1080p", "Filigrane MotionAI"],
    cta: "Commencer gratuit",
    highlight: false,
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 23,
    yearly: 13,
    videos: 60,
    duration: "60s max",
    features: ["60 vidéos / mois", "60 secondes max", "1080p", "Sans filigrane", "Toutes les voix"],
    cta: "Choisir Starter",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 45,
    yearly: 35,
    videos: 150,
    duration: "2min max",
    features: [
      "150 vidéos / mois",
      "2 minutes max",
      "1080p",
      "Sans filigrane",
      "Toutes les voix",
      "Priorité de rendu",
    ],
    cta: "Choisir Pro",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    monthly: 120,
    yearly: 99,
    videos: 999,
    duration: "2min max",
    features: [
      "Illimité",
      "2 minutes max",
      "1080p",
      "Sans filigrane",
      "Priorité maximale",
      "Support dédié",
    ],
    cta: "Choisir Business",
    highlight: false,
  },
];

export default function PricingPage() {
  const { isSignedIn } = useUser();
  const [billing, setBilling] = useState<"yearly" | "monthly">("yearly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") {
      window.location.href = "/signup";
      return;
    }
    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else if (data.error) console.error(data.error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "var(--font-geist), -apple-system, sans-serif",
        color: "#0a0a0a",
      }}
    >
      <nav
        style={{
          padding: "0 48px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(20px)",
          zIndex: 100,
        }}
      >
        <a
          href="/"
          style={{
            fontSize: 17,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            textDecoration: "none",
            color: "#0a0a0a",
          }}
        >
          Motion<span style={{ color: accent }}>AI</span>
        </a>
        <a
          href={isSignedIn ? "/dashboard" : "/login"}
          style={{
            fontSize: 13,
            color: "#666",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          {isSignedIn ? "Dashboard →" : "Connexion"}
        </a>
      </nav>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 48,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              marginBottom: 12,
              lineHeight: 1,
            }}
          >
            Tarifs simples.
          </h1>
          <p style={{ fontSize: 16, color: "#888", marginBottom: 32 }}>
            Sans engagement. Annule quand tu veux.
          </p>

          <div
            style={{
              display: "inline-flex",
              background: "#f0f0f0",
              borderRadius: 12,
              padding: 4,
              gap: 4,
            }}
          >
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                border: "none",
                background: billing === "yearly" ? "#ffffff" : "transparent",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                color: billing === "yearly" ? "#0a0a0a" : "#888",
                boxShadow:
                  billing === "yearly" ? "0 1px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              Annuel
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  fontWeight: 800,
                  background: "#30d158",
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: 100,
                }}
              >
                -40%
              </span>
            </button>
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              style={{
                padding: "8px 20px",
                borderRadius: 9,
                border: "none",
                background: billing === "monthly" ? "#ffffff" : "transparent",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                color: billing === "monthly" ? "#0a0a0a" : "#888",
                boxShadow:
                  billing === "monthly" ? "0 1px 8px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s",
              }}
            >
              Mensuel
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              style={{
                padding: "24px",
                borderRadius: 20,
                background: plan.highlight ? accent : "#ffffff",
                border: plan.highlight ? "none" : "1.5px solid #e8e8e8",
                color: plan.highlight ? "#ffffff" : "#0a0a0a",
                position: "relative",
                boxShadow: plan.highlight
                  ? `0 20px 60px ${accent}33`
                  : "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: "absolute",
                    top: -11,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "3px 14px",
                    background: "#0a0a0a",
                    borderRadius: 100,
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#fff",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✦ POPULAIRE
                </div>
              )}

              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{plan.name}</div>
              <div
                style={{
                  fontSize: 11,
                  marginBottom: 20,
                  color: plan.highlight ? "rgba(255,255,255,0.6)" : "#aaa",
                }}
              >
                {plan.videos === 999 ? "Illimité" : `${plan.videos} vidéos/mois`}
              </div>

              <div style={{ marginBottom: 24 }}>
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 900,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {billing === "yearly" ? plan.yearly : plan.monthly}€
                </span>
                <span
                  style={{
                    fontSize: 12,
                    marginLeft: 4,
                    color: plan.highlight ? "rgba(255,255,255,0.6)" : "#aaa",
                  }}
                >
                  /mois
                </span>
                {billing === "yearly" && plan.id !== "free" && (
                  <div
                    style={{
                      fontSize: 10,
                      marginTop: 2,
                      color: plan.highlight ? "rgba(255,255,255,0.5)" : "#aaa",
                    }}
                  >
                    Facturé {plan.yearly * 12}€/an
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 24 }}>
                {plan.features.map((f) => (
                  <div
                    key={f}
                    style={{
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      marginBottom: 7,
                      color: plan.highlight ? "rgba(255,255,255,0.85)" : "#555",
                    }}
                  >
                    <span
                      style={{
                        color: plan.highlight ? "rgba(255,255,255,0.6)" : "#30d158",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                style={{
                  width: "100%",
                  padding: "11px",
                  background: plan.highlight ? "#ffffff" : accent,
                  color: plan.highlight ? accent : "#ffffff",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  boxShadow: plan.highlight ? "none" : `0 4px 14px ${accent}44`,
                  opacity: loading === plan.id ? 0.7 : 1,
                  transition: "all 0.2s",
                }}
              >
                {loading === plan.id ? "..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            color: "#aaa",
            fontSize: 13,
          }}
        >
          Sans carte bancaire pour le plan gratuit · Annulation en 1 clic · Support par email
        </div>
      </div>
    </div>
  );
}
