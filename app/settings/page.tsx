"use client";

import { UserProfile } from "@clerk/nextjs";

const accent = "#ef4444";

export default function SettingsPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        display: "flex",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <UserProfile
        appearance={{
          variables: {
            colorPrimary: accent,
            colorBackground: "#111111",
            colorInputBackground: "#1a1a1a",
            colorInputText: "#ededed",
            colorText: "#ededed",
            colorTextSecondary: "rgba(255,255,255,0.4)",
            colorNeutral: "#ededed",
            borderRadius: "8px",
            fontFamily: "'Inter', '-apple-system', sans-serif",
          },
          elements: {
            rootBox: {
              width: "100%",
              maxWidth: "860px",
            },
            card: {
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "none",
            },
            navbar: {
              background: "#0d0d0d",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            },
            navbarButton: {
              color: "rgba(255,255,255,0.5)",
            },
            navbarButtonActive: {
              color: "#ffffff",
              background: "rgba(255,255,255,0.06)",
            },
            headerTitle: {
              color: "#ededed",
            },
            headerSubtitle: {
              color: "rgba(255,255,255,0.4)",
            },
            formFieldInput: {
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#ededed",
            },
            formButtonPrimary: {
              background: accent,
              color: "#ffffff",
            },
            badge: {
              background: "rgba(239,68,68,0.12)",
              color: accent,
            },
          },
        }}
      />
    </div>
  );
}
