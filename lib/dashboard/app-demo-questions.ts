import type { ClarificationQuestion } from "@/lib/dashboard/questions";

export const APP_DEMO_QUESTIONS: ClarificationQuestion[] = [
  {
    id: "demo_format",
    question: "Format de la démo ?",
    options: [
      { id: "desktop", label: "🖥️ Desktop MacBook" },
      { id: "mobile", label: "📱 Mobile iPhone" },
    ],
  },
  {
    id: "duration",
    question: "Durée de la démo ?",
    options: [
      { id: "duration_15", label: "15s" },
      { id: "duration_30", label: "30s" },
      { id: "duration_45", label: "45s" },
      { id: "duration_60", label: "60s" },
    ],
  },
  {
    id: "color",
    question: "Couleur accent ?",
    options: [
      { id: "🟢 Vert", label: "🟢 Vert" },
      { id: "🟣 Violet", label: "🟣 Violet" },
      { id: "🔵 Bleu", label: "🔵 Bleu" },
      { id: "🟡 Or", label: "🟡 Or" },
      { id: "🔴 Rouge", label: "🔴 Rouge" },
      { id: "⚪ Blanc", label: "⚪ Blanc" },
      { id: "🩷 Rose", label: "🩷 Rose" },
      { id: "🩵 Cyan", label: "🩵 Cyan" },
    ],
  },
  {
    id: "focus",
    question: "Que veux-tu mettre en avant ?",
    options: [
      { id: "features", label: "✨ Features clés" },
      { id: "dashboard", label: "📊 Dashboard" },
      { id: "onboarding", label: "🚀 Onboarding" },
      { id: "pricing", label: "💰 Pricing" },
    ],
  },
];
