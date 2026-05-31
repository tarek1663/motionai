import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildCinemaSystemPrompt } from "@/lib/prompts/cinema-scenes-system";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script, duration, quality, accentColor, answers } = await req.json();

    void quality;
    void answers;

    const durationSeconds = (
      {
        "15s": 15,
        "30s": 30,
        "45s": 45,
        "60s": 60,
      } as Record<string, number>
    )[duration] || 30;

    const colorMap: Record<string, string> = {
      "🟢 Vert": "#10B981",
      "🟣 Violet": "#7C3AED",
      "🔵 Bleu": "#3B82F6",
      "🟡 Or": "#F59E0B",
      "🔴 Rouge": "#EF4444",
      "⚪ Blanc": "#ffffff",
      "🩷 Rose": "#EC4899",
      "🩵 Cyan": "#06B6D4",
    };
    const accent =
      colorMap[accentColor] ||
      (typeof accentColor === "string" && accentColor.startsWith("#")
        ? accentColor
        : "#10B981");

    const scriptContext = `
SCRIPT EXACT DE L'UTILISATEUR (ne jamais modifier ce texte dans la voix) :
${script}

RÈGLE SCRIPT :
- Illustrer le script — ne pas le sous-titrer mot pour mot
- Le champ "text" des scènes texte = extraits courts (1-4 mots max) inspirés du script, jamais des phrases complètes
- Respecter le ton et les mots-clés du script original
`;

    const systemPrompt = buildCinemaSystemPrompt(
      script,
      durationSeconds,
      accent,
      { keyStats: [], keyFacts: [], tagline: "" },
      scriptContext,
    );

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 6000,
      messages: [
        {
          role: "user",
          content: systemPrompt,
        },
      ],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
