"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";
import { colors } from "@/lib/colors";
import { Sidebar } from "@/components/Sidebar";

type AdminStats = {
  totalUsers?: number;
  totalVideos?: number;
  payingUsers?: number;
  mrr?: number;
  planCounts?: { free: number; starter: number; pro: number; business: number };
  recentVideos?: Array<{
    prompt: string;
    format_name?: string;
    accent_color?: string;
    created_at: string;
  }>;
};

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!isAdminEmail(email)) {
      router.push("/dashboard");
      return;
    }
    loadStats();
  }, [isLoaded, user, router, loadStats]);

  if (!isLoaded || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 14, color: "#aaa" }}>Chargement...</div>
      </div>
    );
  }

  if (!ADMIN_EMAIL) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", maxWidth: 400 }}>
          Configure <code>NEXT_PUBLIC_ADMIN_EMAIL</code> et <code>ADMIN_USER_ID</code> dans
          Vercel pour activer l&apos;admin.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 44px)", background: colors.bg, fontFamily: "inherit", display: "flex" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <Sidebar active="account" />
      <div style={{ flex: 1, maxWidth: 1060, padding: "32px 40px" }}>
        <a
          href="/dashboard"
          style={{ display: "inline-flex", marginBottom: 14, color: colors.textMuted, textDecoration: "none", fontSize: 13 }}
        >
          ← Dashboard
        </a>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: colors.text,
            letterSpacing: "-0.04em",
            marginBottom: 32,
          }}
        >
          Tableau de bord
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 14,
            marginBottom: 24,
          }}
        >
          {[
            { label: "Utilisateurs", value: stats?.totalUsers || 0, icon: "👥", color: "#7C3AED" },
            {
              label: "Vidéos générées",
              value: stats?.totalVideos || 0,
              icon: "🎬",
              color: "#2563eb",
            },
            {
              label: "Clients payants",
              value: stats?.payingUsers || 0,
              icon: "💳",
              color: "#30d158",
            },
            { label: "MRR estimé", value: `${stats?.mrr || 0}€`, icon: "💰", color: "#f59e0b" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: "#161616",
                borderRadius: 16,
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.3)",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: stat.color,
                  letterSpacing: "-0.04em",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#161616",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Répartition des plans
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { plan: "Gratuit", count: stats?.planCounts?.free || 0, color: "#888" },
              { plan: "Starter", count: stats?.planCounts?.starter || 0, color: "#7C3AED" },
              { plan: "Pro", count: stats?.planCounts?.pro || 0, color: "#2563eb" },
              { plan: "Business", count: stats?.planCounts?.business || 0, color: "#f59e0b" },
            ].map((p) => {
              const total = stats?.totalUsers || 1;
              const pct = Math.round((p.count / total) * 100);
              return (
                <div key={p.plan}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: colors.text }}>
                      {p.plan}
                    </span>
                    <span style={{ fontSize: 13, color: colors.textMuted }}>
                      {p.count} utilisateurs ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: "rgba(255,255,255,0.08)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: p.color,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background: "#161616",
            borderRadius: 20,
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.textMuted,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Vidéos récentes
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(stats?.recentVideos || []).map((video, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: colors.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {video.prompt}
                  </div>
                  <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
                    {new Date(video.created_at).toLocaleDateString("fr-FR")} ·{" "}
                    {video.format_name || "Vidéo"}
                  </div>
                </div>
                {video.accent_color && (
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: video.accent_color,
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
