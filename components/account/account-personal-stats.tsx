"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BarChart3,
  Calendar,
  Clock,
  Smartphone,
  Video,
  type LucideIcon,
} from "lucide-react";
import { colors } from "@/lib/colors";

export type UserStats = {
  total: number;
  totalDuration: number;
  topFormat: string;
  thisMonth: number;
};

function AccountSectionTitle({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <h2 className="account-section-title">
      <Icon className="account-section-icon" size={14} strokeWidth={1.75} aria-hidden />
      {children}
    </h2>
  );
}

function buildStatItems(stats: UserStats | null) {
  return [
    { label: "Vidéos totales", value: stats?.total || 0, icon: Video },
    { label: "Ce mois", value: stats?.thisMonth || 0, icon: Calendar },
    { label: "Format favori", value: stats?.topFormat || "—", icon: Smartphone },
    {
      label: "Durée totale",
      value: stats ? `${Math.round((stats.totalDuration || 0) / 60)}min` : "—",
      icon: Clock,
    },
  ] as const;
}

export function AccountPersonalStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!d?.error) setStats(d);
      })
      .catch(() => {
        /* ignore */
      })
      .finally(() => setLoading(false));
  }, []);

  const statItems = buildStatItems(stats);

  return (
    <section className="account-card">
      <AccountSectionTitle icon={BarChart3}>Mes statistiques</AccountSectionTitle>
      {loading ? (
        <div className="account-stats-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="account-stat-card account-stat-card--loading">
              <div className="account-skeleton account-skeleton--stat" />
            </div>
          ))}
        </div>
      ) : (
        <div className="account-stats-grid">
          {statItems.map((s) => {
            const StatIcon = s.icon;
            return (
              <div key={s.label} className="account-stat-card">
                <div className="account-stat-icon">
                  <StatIcon size={20} strokeWidth={1.75} />
                </div>
                <div className="account-stat-value" style={{ color: colors.accent }}>
                  {s.value}
                </div>
                <div className="account-stat-label">{s.label}</div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
