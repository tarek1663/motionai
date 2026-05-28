"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const accent = "#10B981";

const steps = [
  {
    id: "usage",
    emoji: "👋",
    title: "Bienvenue sur Motionr !",
    subtitle: "Cree des videos motion design professionnelles en quelques minutes.",
    question: "Comment vas-tu utiliser Motionr ?",
    options: [
      { id: "marketing", label: "📢 Marketing & Pub", desc: "Promouvoir mes produits" },
      { id: "social", label: "📱 Reseaux sociaux", desc: "Creer du contenu regulier" },
      { id: "business", label: "💼 Business", desc: "Presenter mon entreprise" },
      { id: "personal", label: "✨ Creativite", desc: "Explorer mes idees" },
    ],
  },
  {
    id: "format",
    emoji: "🎬",
    title: "Quel format preferes-tu ?",
    subtitle: "Tu pourras changer a tout moment.",
    question: "Format principal de tes videos ?",
    options: [
      { id: "9:16", label: "📱 9:16 Vertical", desc: "Reels, TikTok, Stories" },
      { id: "16:9", label: "🖥️ 16:9 Horizontal", desc: "YouTube, Presentations" },
      { id: "1:1", label: "⬛ 1:1 Carre", desc: "Feed Instagram, LinkedIn" },
    ],
  },
  {
    id: "ready",
    emoji: "🚀",
    title: "Tu es pret !",
    subtitle: "3 videos gratuites t'attendent. Lance-toi !",
    question: null,
    options: [],
  },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const step = steps[currentStep];

  const finishOnboarding = async () => {
    if (user) {
      localStorage.setItem(`motionr_onboarding_${user.id}`, "done");
    }
    try {
      await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed: true,
          default_format: answers.format || "9:16",
        }),
      });
    } catch {
      // silent fail
    } finally {
      router.push("/dashboard");
    }
  };

  const handleNext = async () => {
    if (selected && step.question) {
      setAnswers((prev) => ({ ...prev, [step.id]: selected }));
      setSelected(null);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    await finishOnboarding();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        fontFamily: "inherit",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 3,
                background: i <= currentStep ? accent : "rgba(255,255,255,0.08)",
                marginRight: i < steps.length - 1 ? 6 : 0,
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
          {currentStep + 1} / {steps.length}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#161616",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          padding: "40px",
          boxShadow: "0 40px 80px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20, textAlign: "center" }}>{step.emoji}</div>

        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.04em",
            textAlign: "center",
            marginBottom: 8,
            lineHeight: 1.2,
          }}
        >
          {step.title}
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.4)",
            textAlign: "center",
            marginBottom: 32,
            lineHeight: 1.6,
          }}
        >
          {step.subtitle}
        </p>

        {step.question && (
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              {step.question}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {step.options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  style={{
                    padding: "14px 16px",
                    background:
                      selected === opt.id ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      selected === opt.id ? "rgba(16,185,129,0.4)" : "rgba(255,255,255,0.08)"
                    }`,
                    borderRadius: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>
                      {opt.desc}
                    </div>
                  </div>
                  {selected === opt.id && (
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: accent,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => void handleNext()}
          disabled={step.question !== null && !selected}
          style={{
            width: "100%",
            marginTop: 24,
            padding: "14px",
            background:
              step.question === null || selected ? accent : "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 700,
            color:
              step.question === null || selected ? "#fff" : "rgba(255,255,255,0.2)",
            cursor:
              step.question === null || selected ? "pointer" : "not-allowed",
            fontFamily: "inherit",
            boxShadow:
              step.question === null || selected
                ? "0 4px 16px rgba(16,185,129,0.3)"
                : "none",
            transition: "all 0.15s",
          }}
        >
          {currentStep === steps.length - 1 ? "Creer ma premiere video →" : "Continuer →"}
        </button>

        {currentStep < steps.length - 1 && (
          <button
            onClick={() => void finishOnboarding()}
            style={{
              width: "100%",
              marginTop: 10,
              background: "none",
              border: "none",
              fontSize: 12,
              color: "rgba(255,255,255,0.2)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Passer l'onboarding
          </button>
        )}
      </div>

      <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 900,
            color: "#fff",
          }}
        >
          M
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.3)" }}>
          Motionr {user?.firstName ? `· ${user.firstName}` : ""}
        </span>
      </div>
    </div>
  );
}
