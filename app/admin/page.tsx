"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";

const accent = "#7C3AED";

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
          background: "#fafafa",
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
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 14, color: "#888", maxWidth: 400 }}>
          Configure <code>NEXT_PUBLIC_ADMIN_EMAIL</code> et <code>ADMIN_USER_ID</code> dans
          Vercel pour activer l&apos;admin.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fafafa",
        fontFamily: "inherit",
      }}
    >
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      <div
        style={{
          padding: "20px 40px",
          borderBottom: "1px solid #f0f0f0",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            color: "#0a0a0a",
          }}
        >
          Motion<span style={{ color: accent }}>AI</span>{" "}
          <span style={{ fontSize: 13, color: "#aaa", fontWeight: 400 }}>Admin</span>
        </div>
        <a href="/dashboard" style={{ fontSize: 13, color: "#888", textDecoration: "none" }}>
          ← Dashboard
        </a>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 40px" }}>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#0a0a0a",
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
                background: "#ffffff",
                borderRadius: 14,
                padding: "20px",
                border: "1.5px solid #e8e8e8",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
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
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            padding: "24px",
            border: "1.5px solid #e8e8e8",
            marginBottom: 16,
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
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0a0a0a" }}>
                      {p.plan}
                    </span>
                    <span style={{ fontSize: 13, color: "#aaa" }}>
                      {p.count} utilisateurs ({pct}%)
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
            background: "#ffffff",
            borderRadius: 16,
            padding: "24px",
            border: "1.5px solid #e8e8e8",
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
                  borderBottom: "1px solid #f5f5f5",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0a0a0a",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {video.prompt}
                  </div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>
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
