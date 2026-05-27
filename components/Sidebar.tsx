"use client";

import { UserButton } from "@clerk/nextjs";
import { colors } from "@/lib/colors";

type SidebarProps = {
  active: "create" | "history" | "account";
  credits?: { videos_remaining?: number; videos_limit?: number } | null;
};

const ITEMS: Array<{ key: SidebarProps["active"]; icon: string; label: string; href: string }> = [
  { key: "create", icon: "✏️", label: "Creer", href: "/dashboard" },
  { key: "history", icon: "🎬", label: "Historique", href: "/dashboard" },
  { key: "account", icon: "⚙️", label: "Compte", href: "/account" },
];

export function Sidebar({ active, credits }: SidebarProps) {
  return (
    <aside
      style={{
        width: 56,
        minWidth: 56,
        height: "calc(100vh - 44px)",
        position: "sticky",
        top: 44,
        background: colors.sidebarBg,
        borderRight: `1px solid ${colors.sidebarBorder}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px 0 12px",
        zIndex: 70,
      }}
    >
      <a
        href="/dashboard"
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: colors.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 900,
          color: "#fff",
          marginBottom: 18,
          boxShadow: "0 4px 14px rgba(16,185,129,0.4)",
          textDecoration: "none",
        }}
      >
        M
      </a>

      {ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <a
            key={item.key}
            href={item.href}
            title={item.label}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontSize: 16,
              marginBottom: 6,
              background: isActive ? "rgba(16,185,129,0.16)" : "transparent",
              border: isActive ? "1px solid rgba(16,185,129,0.36)" : "1px solid transparent",
              boxShadow: isActive ? "0 0 16px rgba(16,185,129,0.16)" : "none",
            }}
          >
            {item.icon}
          </a>
        );
      })}

      <div style={{ marginTop: "auto", width: "100%", padding: "0 8px", textAlign: "center" }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #ebeae8",
            borderRadius: 10,
            padding: "8px 4px",
            fontSize: 10,
            color: "#a39e98",
            marginBottom: 8,
            lineHeight: 1.4,
          }}
        >
          {credits?.videos_remaining ?? 0}/{credits?.videos_limit ?? 0}
          <br />
          credits
          <br />
          <a href="/pricing" style={{ color: "#10B981", textDecoration: "none", fontWeight: 700 }}>
            Upgrader →
          </a>
        </div>
        <UserButton afterSignOutUrl="/login" />
      </div>
    </aside>
  );
}
