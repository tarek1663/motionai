"use client";
import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
    }}>
      <div
        onClick={() => router.push("/")}
        style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 40, cursor: "pointer",
        }}
      >
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: "#10B981",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 900, color: "#fff",
          boxShadow: "0 4px 16px rgba(16,185,129,0.4)",
        }}>M</div>
        <span style={{
          fontSize: 20, fontWeight: 900, color: "#fff",
          letterSpacing: "-0.04em",
        }}>Motionr</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <h1 style={{
          fontSize: 28, fontWeight: 800, color: "#fff",
          letterSpacing: "-0.04em", marginBottom: 8,
        }}>
          Bon retour 👋
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
          Connecte-toi pour accéder à ton studio
        </p>
      </div>

      <SignIn
        routing="hash"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#10B981",
            colorBackground: "#161616",
            colorText: "#ffffff",
            colorTextSecondary: "rgba(255,255,255,0.5)",
            colorInputBackground: "rgba(255,255,255,0.06)",
            colorInputText: "#ffffff",
            colorNeutral: "rgba(255,255,255,0.3)",
            borderRadius: "12px",
            fontFamily: "inherit",
          },
          elements: {
            rootBox: { width: "100%" },
            card: {
              background: "#161616",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              borderRadius: "20px",
              padding: "32px",
            },
            headerTitle: { display: "none" },
            headerSubtitle: { display: "none" },
            formButtonPrimary: {
              background: "#10B981",
              fontWeight: 700,
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
            },
            footerActionLink: { color: "#10B981" },
            formFieldInput: {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
            },
            dividerLine: { background: "rgba(255,255,255,0.08)" },
            dividerText: { color: "rgba(255,255,255,0.3)" },
            socialButtonsBlockButton: {
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ffffff",
            },
            identityPreviewEditButton: { color: "#10B981" },
          },
        }}
      />

      <button
        onClick={() => router.push("/")}
        style={{
          marginTop: 24, background: "none", border: "none",
          color: "rgba(255,255,255,0.2)", cursor: "pointer",
          fontSize: 13, fontFamily: "inherit",
          transition: "color 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
      >
        ← Retour à l'accueil
      </button>
    </div>
  );
}
