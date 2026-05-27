"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const accent = "#10B981";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/credits").then((r) => r.json()).then((d) => setCurrentPlan(d.plan || "free"));
    }
  }, [user]);

  const plans = [
    {
      id: "free", name: "Gratuit",
      price: { monthly: 0, yearly: 0 },
      videos: "3 vidéos/mois",
      features: ["3 vidéos par mois", "Qualité 1080p", "72+ animations", "Filigrane Motionr"],
      cta: "Commencer gratuitement",
    },
    {
      id: "starter", name: "Starter",
      price: { monthly: 23, yearly: 13 },
      videos: "60 vidéos/mois",
      features: ["60 vidéos par mois", "Qualité 1080p", "72+ animations", "Sans filigrane", "Essai 4 jours gratuit"],
      cta: "Essayer 4 jours gratuit",
    },
    {
      id: "pro", name: "Pro",
      price: { monthly: 45, yearly: 35 },
      videos: "150 vidéos/mois",
      features: ["150 vidéos par mois", "Qualité 1080p", "72+ animations", "Sans filigrane", "Priorité rendu", "Essai 4 jours gratuit"],
      cta: "Essayer 4 jours gratuit",
      popular: true,
    },
    {
      id: "business", name: "Business",
      price: { monthly: 120, yearly: 99 },
      videos: "Illimité",
      features: ["Vidéos illimitées", "Qualité 1080p", "72+ animations", "Sans filigrane", "Rendu prioritaire", "Support dédié"],
      cta: "Contacter les ventes",
    },
  ];

  const planOrder = ["free", "starter", "pro", "business"];

  const handlePlan = async (planId: string) => {
    if (planId === currentPlan) return;
    if (!user) { router.push(`/signup?plan=${planId}`); return; }
    if (planId === "free") return;

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, billing }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a",
      fontFamily: "inherit", color: "#fff",
    }}>
      <div style={{
        padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => router.push("/")}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, color: "#fff",
          }}>M</div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em" }}>Motionr</span>
        </div>
        <button onClick={() => router.push(user ? "/dashboard" : "/login")} style={{
          background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "8px 16px", fontSize: 13,
          color: "rgba(255,255,255,0.7)", cursor: "pointer", fontFamily: "inherit",
        }}>
          {user ? "← Dashboard" : "Connexion"}
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: accent,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
          }}>Tarifs</div>
          <h1 style={{
            fontSize: 52, fontWeight: 900, letterSpacing: "-0.04em",
            lineHeight: 1.05, marginBottom: 24,
          }}>
            Simple et transparent.
          </h1>

          <div style={{
            display: "inline-flex", background: "rgba(255,255,255,0.04)",
            borderRadius: 10, padding: 4, gap: 4,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {(["monthly", "yearly"] as const).map((b) => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: "8px 20px", borderRadius: 8, border: "none",
                background: billing === b ? "rgba(255,255,255,0.1)" : "transparent",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                color: billing === b ? "#fff" : "rgba(255,255,255,0.4)",
                fontFamily: "inherit",
              }}>
                {b === "monthly" ? "Mensuel" : "Annuel -40%"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isDowngrade = planOrder.indexOf(plan.id) < planOrder.indexOf(currentPlan);
            const isDisabled = isCurrent || isDowngrade;

            return (
              <div key={plan.id} style={{
                borderRadius: 20, padding: "28px",
                background: plan.popular ? accent : "#161616",
                border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.08)",
                color: "#fff", position: "relative",
                boxShadow: plan.popular ? `0 20px 60px ${accent}44` : "none",
                transition: "transform 0.2s",
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%",
                    transform: "translateX(-50%)",
                    background: "#ffd60a", color: "#0a0a0a",
                    borderRadius: 100, padding: "4px 14px",
                    fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
                  }}>⭐ POPULAIRE</div>
                )}
                {isCurrent && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#fff", borderRadius: 100,
                    padding: "4px 14px", fontSize: 11,
                    fontWeight: 700, whiteSpace: "nowrap",
                  }}>✓ Plan actuel</div>
                )}

                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: "-0.04em", marginBottom: 4 }}>
                  {plan.price[billing] === 0 ? "0€" : `${plan.price[billing]}€`}
                  <span style={{ fontSize: 14, opacity: 0.6 }}>/mois</span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 24 }}>{plan.videos}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: plan.popular ? "#fff" : accent }}>✓</span>{f}
                    </div>
                  ))}
                </div>

                <button
                  disabled={isDisabled || loading}
                  onClick={() => handlePlan(plan.id)}
                  style={{
                    display: "block", width: "100%",
                    textAlign: "center", padding: "12px",
                    borderRadius: 10, border: "none",
                    background: isDisabled ? "rgba(255,255,255,0.1)" : plan.popular ? "#fff" : accent,
                    color: isDisabled ? "rgba(255,255,255,0.3)" : plan.popular ? accent : "#fff",
                    fontWeight: 700, fontSize: 14,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    fontFamily: "inherit", opacity: isDisabled ? 0.5 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  {isCurrent ? "Plan actuel ✓" : isDowngrade ? "Non disponible" : plan.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
