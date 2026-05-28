"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Plus, Settings } from "lucide-react";
import { colors } from "@/lib/colors";

type Props = {
  user: {
    firstName?: string | null;
    fullName?: string | null;
    imageUrl?: string;
    primaryEmailAddress?: { emailAddress: string } | null;
    emailAddresses?: { emailAddress: string }[];
  } | null | undefined;
};

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account", label: "Paramètres", icon: Settings },
] as const;

export function AccountSidebar({ user }: Props) {
  const pathname = usePathname();
  const displayName =
    user?.firstName ||
    user?.fullName ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "Utilisateur";
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  return (
    <aside className="account-sidebar">
      <div className="dash-sidebar-header">
        <Link href="/dashboard" className="dash-sidebar-brand" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="dash-logo-mark">M</div>
          <span className="dash-logo-text">MotionAI</span>
        </Link>
      </div>

      <div className="dash-sidebar-cta">
        <Link href="/dashboard" className="dash-btn-primary" style={{ textDecoration: "none" }}>
          <Plus size={20} strokeWidth={2} color="#fff" />
          Nouvelle vidéo
        </Link>
      </div>

      <nav className="account-sidebar-nav">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/account"
              ? pathname.startsWith("/account")
              : pathname === "/dashboard";
          return (
            <Link
              key={label}
              href={href}
              className={`account-nav-item${active ? " active" : ""}`}
            >
              <Icon
                size={18}
                strokeWidth={1.75}
                color={active ? colors.accent : colors.textSub}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="dash-sidebar-footer">
        <div className="dash-sidebar-profile">
          <UserButton afterSignOutUrl="/" />
          <div className="dash-sidebar-profile-text">
            <div className="dash-sidebar-profile-name">{displayName}</div>
            <div className="dash-sidebar-profile-email">{email}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
