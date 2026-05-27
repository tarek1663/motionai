import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <header
        style={{
          position: "fixed",
          top: 44,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 48px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(23,19,17,0.08)",
          boxShadow: "0 8px 24px rgba(23,19,17,0.05)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "#10B981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            M
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0a0a" }}>
            Motionr
          </span>
        </Link>
        <Link
          href="/login"
          style={{
            padding: "8px 18px",
            background: "transparent",
            border: "1px solid rgba(23,19,17,0.12)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: "#0a0a0a",
            textDecoration: "none",
          }}
        >
          Connexion
        </Link>
      </header>
      <div style={{ marginTop: 144 }}>
      <SignUp
        routing="hash"
        signInUrl="/login"
        afterSignUpUrl="/onboarding"
        redirectUrl="/onboarding"
      />
      </div>
    </div>
  );
}
