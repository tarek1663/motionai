"use client";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const accent = "#10B981";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [currentPlanOrder, setCurrentPlanOrder] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetch("/api/credits")
        .then((r) => r.json())
        .then((d) => {
          setCurrentPlan(d.plan || "free");
          setCurrentPlanOrder(d.planOrder || 0);
        });
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
      price: { monthly: 0, yearly: 0 },
      videos: "60 vidéos/mois",
      features: ["60 vidéos par mois", "Qualité 1080p", "72+ animations", "Sans filigrane", "Essai 4 jours gratuit"],
      cta: "Essayer 4 jours gratuit",
    },
    {
      id: "pro", name: "Pro",
      price: { monthly: 0, yearly: 0 },
      videos: "150 vidéos/mois",
      features: ["150 vidéos par mois", "Qualité 1080p", "72+ animations", "Sans filigrane", "Priorité de rendu", "Essai 4 jours gratuit"],
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
      minHeight: "calc(100vh - 44px)",
      background: "#ffffff",
      fontFamily: "var(--font-sans)",
      color: "#171311",
    }}>
      <div style={{
        padding: "0 48px",
        height: 60,
        borderBottom: "1px solid rgba(23,19,17,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        position: "fixed",
        top: 44,
        left: 0,
        right: 0,
        zIndex: 50,
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
          onClick={() => router.push("/")}>
          <div style={{
            width: 28, height: 28, borderRadius: 7, background: accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 900, color: "#fff",
          }}>M</div>
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
        <button onClick={() => router.push(user ? "/dashboard" : "/login")} style={{
          background: "rgba(23,19,17,0.03)",
          border: "1px solid rgba(23,19,17,0.08)",
          borderRadius: 8, padding: "8px 16px", fontSize: 13,
          color: "rgba(23,19,17,0.72)", cursor: "pointer", fontFamily: "inherit",
          fontWeight: 500,
        }}>
          {user ? "← Dashboard" : "Connexion"}
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "132px 40px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: accent,
            letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12,
          }}>Tarifs</div>
          <h1 style={{
            fontSize: 48, fontWeight: 700, letterSpacing: "-0.045em",
            lineHeight: 1.08, marginBottom: 24,
            fontFamily: "var(--font-display)",
          }}>
            Simple et transparent.
          </h1>

          <div style={{
            display: "inline-flex", background: "#f5f5f5",
            borderRadius: 10, padding: 4, gap: 4,
            border: "1px solid #e8e8e8",
          }}>
            {(["monthly", "yearly"] as const).map((b) => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: "8px 20px", borderRadius: 8, border: "none",
                background: billing === b ? "#fff" : "transparent",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                color: billing === b ? "#0a0a0a" : "#888",
                fontFamily: "inherit",
                boxShadow: billing === b ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
              }}>
                {b === "monthly" ? "Mensuel" : "Annuel -40%"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {plans.map((plan) => {
            const planIdx = planOrder.indexOf(plan.id);
            const isCurrent = plan.id === currentPlan;
            const isDowngrade = planIdx < currentPlanOrder;
            const isDisabled = isCurrent || isDowngrade;

            const getButtonLabel = () => {
              if (isCurrent) return "✓ Plan actuel";
              if (isDowngrade) return "Non disponible";
              if (plan.id === "free") return "Commencer gratuitement";
              return plan.cta;
            };

            const getButtonStyle = () => ({
              display: "block",
              width: "100%",
              textAlign: "center" as const,
              padding: "12px",
              borderRadius: 10,
              border: "none",
              background: isCurrent
                ? "rgba(255,255,255,0.06)"
                : isDowngrade
                  ? "rgba(255,255,255,0.04)"
                  : plan.popular
                    ? "#fff"
                    : accent,
              color: isCurrent || isDowngrade
                ? "rgba(255,255,255,0.25)"
                : plan.popular
                  ? accent
                  : "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: isDisabled ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: isDowngrade ? 0.4 : 1,
              transition: "all 0.15s",
              boxShadow: !isDisabled && !plan.popular ? "0 8px 20px rgba(16,185,129,0.22)" : "none",
            });

            return (
              <div key={plan.id} style={{
                borderRadius: 20, padding: "28px", minHeight: 470,
                background: plan.popular
                  ? "linear-gradient(165deg, #10b981 0%, #0ea371 100%)"
                  : "linear-gradient(180deg, #ffffff 0%, #fbfbfb 100%)",
                border: plan.popular
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1.5px solid rgba(16,185,129,0.35)",
                color: plan.popular ? "#fff" : "#0a0a0a",
                position: "relative",
                boxShadow: plan.popular
                  ? "0 0 24px rgba(16,185,129,0.28), 0 20px 60px rgba(0,0,0,0.18)"
                  : "0 8px 26px rgba(15,23,42,0.08)",
                transition: "transform 0.2s",
              }}>
                {plan.popular && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%",
                    transform: "translateX(-50%)",
                    background: "#fff", color: accent,
                    borderRadius: 100, padding: "4px 14px",
                    fontSize: 11, fontWeight: 800, whiteSpace: "nowrap",
                  }}>Populaire</div>
                )}
                {isCurrent && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%",
                    transform: "translateX(-50%)",
                    background: plan.popular ? "rgba(255,255,255,0.2)" : "#f5f5f5",
                    border: `1px solid ${plan.popular ? "rgba(255,255,255,0.35)" : "#e8e8e8"}`,
                    color: plan.popular ? "#fff" : "#333",
                    borderRadius: 100,
                    padding: "4px 14px", fontSize: 11,
                    fontWeight: 700, whiteSpace: "nowrap",
                  }}>✓ Plan actuel</div>
                )}

                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 1, marginBottom: 8 }}>
                  {(plan.id === "starter" || plan.id === "pro") && (
                    <span
                      style={{
                        position: "relative",
                        display: "inline-block",
                        fontSize: 20,
                        fontWeight: 600,
                        opacity: 0.9,
                        color: plan.popular ? "#ffffff" : "#111",
                        fontFamily:
                          '"Marker Felt", "Comic Sans MS", "Bradley Hand", "Segoe Print", cursive',
                        letterSpacing: "0.01em",
                        transform: "rotate(-7deg)",
                        marginRight: 8,
                      }}
                    >
                      {plan.id === "starter"
                        ? `${billing === "monthly" ? 23 : 13}€`
                        : `${billing === "monthly" ? 45 : 35}€`}
                      <span
                        style={{
                          position: "absolute",
                          left: -10,
                          right: -8,
                          top: "49%",
                          height: 3,
                          background: "currentColor",
                          borderRadius: 999,
                          opacity: 0.95,
                          transform: "rotate(-9deg)",
                        }}
                      />
                    </span>
                  )}
                  {plan.price[billing] === 0 ? "0€" : `${plan.price[billing]}€`}
                  <span style={{ fontSize: 15, fontWeight: 600, opacity: 0.78, marginLeft: 2 }}>/mois</span>
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
                  style={getButtonStyle()}
                >
                  {getButtonLabel()}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "#888" }}>
          Sans carte bancaire pour le plan gratuit · Annulation en 1 clic · Support email
        </div>
      </div>
    </div>
  );
}
