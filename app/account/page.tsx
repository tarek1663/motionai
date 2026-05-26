"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { colors } from "@/lib/colors";

const accent = colors.accent;

const NAV_ITEMS = [
  { icon: "✏️", label: "Créer", href: "/dashboard", active: false },
  { icon: "🎬", label: "Historique", href: "/history", active: false },
  { icon: "⚙️", label: "Compte", href: "/account", active: true },
];

export default function AccountPage() {
  const { user } = useUser();
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

  useEffect(() => {
    if (!user) return;
    fetch("/api/credits")
      .then((r) => r.json())
      .then((d) => {
        setCredits(d);
        setLoading(false);
      });
  }, [user]);

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
    free: "#888",
    starter: "#7C3AED",
    pro: "#2563eb",
    business: "#f59e0b",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "inherit",
        display: "flex",
      }}
    >
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } .nav-item:hover { background: #f0f0f0 !important; }`}</style>

      <div
        style={{
          width: 56,
          height: "100vh",
          position: "sticky",
          top: 0,
          background: "#ffffff",
          borderRight: "1px solid #ebebeb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 0",
          gap: 4,
          zIndex: 50,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 900,
            color: "#fff",
            marginBottom: 20,
            boxShadow: `0 2px 8px ${accent}44`,
          }}
        >
          M
        </div>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="nav-item"
            title={item.label}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: item.active ? "#f5f3ff" : "transparent",
              textDecoration: "none",
              fontSize: 16,
              border: item.active ? `1px solid ${accent}22` : "1px solid transparent",
              transition: "all 0.15s",
            }}
          >
            {item.icon}
          </a>
        ))}
        <div style={{ marginTop: "auto" }}>
          <UserButton afterSignOutUrl="/login" />
        </div>
      </div>

      <div style={{ flex: 1, padding: "40px 48px", maxWidth: 760 }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0a0a0a",
            letterSpacing: "-0.04em",
            marginBottom: 32,
          }}
        >
          Mon compte
        </h1>

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
            Profil
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: `${accent}22`,
                border: `2px solid ${accent}33`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: accent,
              }}
            >
              {user?.firstName?.[0] ||
                user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ||
                "U"}
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a" }}>
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: 13, color: "#aaa", marginTop: 2 }}>
                {user?.emailAddresses?.[0]?.emailAddress}
              </div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <a
                href="/account/profile"
                style={{
                  padding: "8px 16px",
                  background: "#f5f5f5",
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#555",
                  textDecoration: "none",
                }}
              >
                Modifier
              </a>
            </div>
          </div>
        </div>

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
                      background: `${planColors[credits?.plan || "free"] || "#888"}22`,
                      border: `1px solid ${planColors[credits?.plan || "free"] || "#888"}44`,
                      fontSize: 13,
                      fontWeight: 700,
                      color: planColors[credits?.plan || "free"] || "#888",
                    }}
                  >
                    {credits?.planName || "Gratuit"}
                  </div>
                  {credits?.plan !== "free" && (
                    <div style={{ fontSize: 12, color: "#aaa" }}>
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
                      background: accent,
                      color: "#fff",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: `0 4px 12px ${accent}44`,
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
                      background: "#f5f5f5",
                      border: "1px solid #e8e8e8",
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#555",
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
                  <span style={{ fontSize: 13, color: "#555" }}>Vidéos ce mois</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a" }}>
                    {credits?.videos_used || 0} /{" "}
                    {credits?.plan === "business" ? "∞" : credits?.videos_limit || 3}
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: "#f0f0f0",
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
                        (credits?.videos_remaining ?? 1) <= 1 ? "#ef4444" : accent,
                      borderRadius: 3,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>
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
              ].map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={async () => {
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
                    background: plan.popular ? accent : "#f5f5f5",
                    color: plan.popular ? "#fff" : "#0a0a0a",
                    border: plan.popular ? "none" : "1px solid #e8e8e8",
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: plan.popular ? `0 4px 16px ${accent}44` : "none",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      {plan.popular ? "⭐ " : ""}
                      {plan.name}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      {plan.videos}
                      {plan.trial ? ` · ${plan.trial}` : ""}
                    </div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{plan.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            background: "#fff5f5",
            borderRadius: 16,
            padding: "24px",
            border: "1.5px solid #fecaca",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#ef4444",
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
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0a0a0a" }}>
                Supprimer mon compte
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
                Toutes tes vidéos et données seront supprimées
              </div>
            </div>
            <UserButton afterSignOutUrl="/login" />
          </div>
        </div>
      </div>
    </div>
  );
}
