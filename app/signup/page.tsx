"use client";
import { SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const benefits = [
  { icon: "🎬", text: "3 vidéos gratuites dès l'inscription" },
  { icon: "✨", text: "72+ animations motion design" },
  { icon: "🎙️", text: "Voix naturelle ElevenLabs" },
  { icon: "⚡", text: "Vidéo 1080p prête en minutes" },
  { icon: "📱", text: "9:16 · 16:9 · 1:1 — tous les formats" },
];

export default function SignupPage() {
  const router = useRouter();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
    }}>
      <div style={{
        display: "flex", gap: 80,
        alignItems: "center",
        maxWidth: 960, width: "100%",
      }}>

        <div style={{ flex: 1, maxWidth: 380 }}>
          <div
            onClick={() => router.push("/")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 40, cursor: "pointer",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "#ef4444",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 900, color: "#fff",
              boxShadow: "0 4px 16px rgba(239,68,68,0.4)",
            }}>M</div>
            <span style={{
              fontSize: 20, fontWeight: 900, color: "#fff",
              letterSpacing: "-0.04em",
            }}>Motionr</span>
          </div>

          <h1 style={{
            fontSize: 36, fontWeight: 900, color: "#fff",
            letterSpacing: "-0.05em", lineHeight: 1.1, marginBottom: 12,
          }}>
            Crée ta première<br />vidéo gratuitement.
          </h1>
          <p style={{
            fontSize: 15, color: "rgba(255,255,255,0.4)",
            lineHeight: 1.6, marginBottom: 36,
          }}>
            Aucune carte bancaire requise.<br />3 vidéos offertes dès l'inscription.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 15,
                }}>{b.icon}</div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <SignUp
            routing="hash"
            signInUrl="/login"
            afterSignUpUrl="/onboarding"
            appearance={{
              variables: {
                colorPrimary: "#ef4444",
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
                formButtonPrimary: {
                  background: "#ef4444",
                  fontWeight: 700,
                  fontSize: "14px",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
                },
                footerActionLink: { color: "#ef4444" },
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
              },
            }}
          />

          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: 16, background: "none", border: "none",
              color: "rgba(255,255,255,0.2)", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit",
            }}
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
