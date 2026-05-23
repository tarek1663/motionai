"use client";

import { useUser } from "@clerk/nextjs";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { SettingsForm } from "@/components/account/settings-form";
import { colors, fonts } from "@/lib/colors";

export default function AccountPage() {
  const { user, isLoaded } = useUser();

  return (
    <div
      className="account-root"
      style={{
        fontFamily: fonts.sans,
        background: colors.bg2,
        color: colors.text,
      }}
    >
      {isLoaded ? (
        <>
          <AccountSidebar user={user} />
          <main className="account-main">
            <SettingsForm />
          </main>
        </>
      ) : (
        <main className="account-main account-main--loading">
          <div className="account-loading">
            <div className="account-skeleton account-skeleton--title" />
            <div className="account-skeleton account-skeleton--card" />
          </div>
        </main>
      )}
    </div>
  );
}
