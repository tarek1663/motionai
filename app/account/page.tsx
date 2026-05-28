"use client";

import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";
import BackButton from "@/components/BackButton";
import { Sidebar } from "@/components/Sidebar";

export default function AccountPage() {
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const [credits, setCredits] = useState<{
    plan?: string;
    planName?: string;
    videos_used?: number;
    videos_limit?: number;
    videos_remaining?: number;
    period_end?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const planOrder = ["free", "starter", "pro", "business"];
  const currentPlanIdx = planOrder.indexOf(credits?.plan || "free");

  useEffect(() => {
    if (!user) return;
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    document.title = "Mon compte — Motionr";
  }, []);

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      /* ignore */
    } finally {
      setPortalLoading(false);
    }
  };

  const planColors: Record<string, string> = {
    free: "rgba(255,255,255,0.5)",
    starter: colors.accent,
    pro: "#34d399",
    business: "#f59e0b",
  };

  return (
    <div style={{ minHeight: "calc(100vh - 44px)", background: colors.bg, fontFamily: "inherit", display: "flex" }}>
      <Sidebar active="account" credits={credits} />
      <div style={{ flex: 1, padding: "32px 40px", maxWidth: 860 }}>
        <BackButton href="/dashboard" />
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: "-0.04em",
            marginBottom: 32,
          }}
        >
          Mon compte
        </h1>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: "24px",
            border: "1.5px solid #e8e8e8",
            marginBottom: 16,
            boxShadow: "0 14px 36px rgba(24,19,15,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9b938c",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Profil
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(16,185,129,0.14)",
                border: `2px solid rgba(16,185,129,0.25)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: colors.accent,
              }}
            >
              {user?.firstName?.[0] ||
                user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                {user?.emailAddresses?.[0]?.emailAddress}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <button
                type="button"
                onClick={() => openUserProfile()}
                style={{
                  padding: "8px 16px",
                  background: "#ffffff",
                  border: "1.5px solid #e8e8e8",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(23,19,17,0.72)",
                  cursor: "pointer",
                }}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: "24px",
            border: "1.5px solid #e8e8e8",
            marginBottom: 16,
            boxShadow: "0 14px 36px rgba(24,19,15,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#9b938c",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Mon plan
          </div>
          {loading ? (
            <div
              style={{
                height: 60,
                background: "#f5f5f5",
                borderRadius: 8,
              }}
            />
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      padding: "4px 12px",
                      borderRadius: 100,
                      background: "rgba(16,185,129,0.08)",
                      border: "1px solid rgba(16,185,129,0.2)",
                      fontSize: 13,
                      fontWeight: 700,
                      color: planColors[credits?.plan || "free"] || "#888",
                    }}
                  >
                    {credits?.planName || "Gratuit"}
                  </div>
                  {credits?.plan !== "free" && (
                    <div style={{ fontSize: 12, color: colors.textMuted }}>
                      Renouvellement le{" "}
                      {credits?.period_end
                        ? new Date(credits.period_end).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                          })
                        : "—"}
                    </div>
                  )}
                </div>
                {credits?.plan === "free" ? (
                  <a
                    href="/pricing"
                    style={{
                      padding: "8px 16px",
                      background: colors.accent,
                      color: "#fff",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
                    }}
                  >
                    Upgrader →
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={openPortal}
                    disabled={portalLoading}
                    style={{
                      padding: "8px 16px",
                      background: "#ffffff",
                      border: "1.5px solid #e8e8e8",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "rgba(23,19,17,0.72)",
                      cursor: "pointer",
                    }}
                  >
                    {portalLoading ? "..." : "Gérer l'abonnement"}
                  </button>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 13, color: colors.textSub }}>Vidéos ce mois</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>
                    {credits?.videos_used || 0} /{" "}
                    {credits?.plan === "business" ? "∞" : credits?.videos_limit || 3}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "rgba(23,19,17,0.08)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width:
                        credits?.plan === "business"
                          ? "10%"
                          : `${Math.min(100, ((credits?.videos_used || 0) / (credits?.videos_limit || 3)) * 100)}%`,
                      background:
                        (credits?.videos_remaining ?? 1) <= 1 ? "#ef4444" : colors.accent,
                      borderRadius: 3,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 6 }}>
                  {credits?.plan === "business"
                    ? "Illimité"
                    : `${credits?.videos_remaining || 0} vidéos restantes ce mois`}
                </div>
              </div>
            </div>
          )}
        </div>

        {credits?.plan === "free" && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: 16,
              padding: "24px",
              border: "1.5px solid #e8e8e8",
              marginBottom: 16,
              boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#aaa",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              Upgrader
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  id: "starter",
                  name: "Starter",
                  price: "23€/mois",
                  videos: "60 vidéos/mois",
                  trial: "4 jours gratuits",
                },
                {
                  id: "pro",
                  name: "Pro",
                  price: "45€/mois",
                  videos: "150 vidéos/mois",
                  trial: "4 jours gratuits",
                  popular: true,
                },
                {
                  id: "business",
                  name: "Business",
                  price: "120€/mois",
                  videos: "Illimité",
                },
              ].map((plan) => {
                const planOrder = ["free", "starter", "pro", "business"];
                const planIdx = planOrder.indexOf(plan.id);
                const isCurrent = plan.id === credits?.plan;
                const isDowngrade = planIdx < currentPlanIdx;
                const isDisabled = isCurrent || isDowngrade;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    disabled={isDisabled}
                    onClick={async () => {
                      if (isDisabled) return;
                      const res = await fetch("/api/stripe/checkout", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ planId: plan.id, billing: "monthly" }),
                      });
                      const data = await res.json();
                      if (data.url) window.location.href = data.url;
                    }}
                    style={{
                      padding: "14px 18px",
                      background: isCurrent
                        ? "rgba(23,19,17,0.05)"
                        : plan.popular
                          ? colors.accent
                          : "#ffffff",
                      color: isCurrent || isDowngrade ? "rgba(23,19,17,0.35)" : plan.popular ? "#fff" : "#171311",
                      border: isCurrent
                        ? "1px solid rgba(23,19,17,0.1)"
                        : plan.popular
                          ? "none"
                          : "1px solid #e8e8e8",
                      borderRadius: 12, cursor: isDisabled ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      opacity: isDowngrade ? 0.4 : 1,
                      fontFamily: "inherit",
                      boxShadow: plan.popular && !isDisabled ? `0 4px 16px ${colors.accent}44` : "none",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>
                        {isCurrent ? "✓ " : plan.popular ? "⭐ " : ""}
                        {plan.name}
                        {isCurrent ? " — Plan actuel" : ""}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.5, marginTop: 2 }}>
                        {plan.videos}
                        {plan.trial && !isCurrent ? ` · ${plan.trial}` : ""}
                      </div>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, opacity: isDisabled ? 0.3 : 1 }}>
                      {plan.price}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div
          style={{
            background: "#ffffff",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid rgba(239,68,68,0.35)",
            boxShadow: "0 14px 36px rgba(24,19,15,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#f87171",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Zone dangereuse
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.text }}>
                Supprimer mon compte
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>
                Toutes tes vidéos et données seront supprimées
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
