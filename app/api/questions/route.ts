import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    void mode;

    const questions = [
      {
        id: "duration",
        question: "Quelle durée pour ta vidéo ?",
        options: [
          { id: "duration_15", label: "15s" },
          { id: "duration_30", label: "30s" },
          { id: "duration_45", label: "45s" },
          { id: "duration_60", label: "60s" },
        ],
        default: "30s",
      },
      {
        id: "quality",
        question: "Quelle qualité de rendu ?",
        options: [
          { id: "quality_fast", label: "⚡ Rapide (2-3 min)" },
          { id: "quality_high", label: "✨ Haute qualité (5-7 min)" },
        ],
        default: "⚡ Rapide (2-3 min)",
      },
      {
        id: "color",
        question: "Quelle couleur principale ?",
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
        default: "🟢 Vert",
      },
    ];

    return NextResponse.json({ questions });
  } catch (err: unknown) {
    console.error("Questions error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
