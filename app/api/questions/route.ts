import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type RawOption = { id?: string; label?: string; desc?: string };
type RawQuestion = {
  id?: string;
  question?: string;
  options?: Array<RawOption | string>;
};

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const systemPrompt = `Tu es un expert en motion design. Génère des questions pour personnaliser la vidéo.

RÈGLES IMPORTANTES :
- La première question doit TOUJOURS être sur la durée
- La deuxième question doit TOUJOURS être sur la qualité
- La troisième question doit TOUJOURS être sur la couleur accent
- Maximum 1 question supplémentaire selon le contexte
- Réponds UNIQUEMENT en JSON valide

Format :
{
  "questions": [
    {
      "id": "duration",
      "question": "Quelle durée pour ta vidéo ?",
      "options": ["15s", "30s", "45s", "60s", "90s"],
      "default": "30s"
    },
    {
      "id": "quality",
      "question": "Quelle qualité de rendu ?",
      "options": ["⚡ Rapide (2-3 min)", "✨ Haute qualité (5-7 min)"],
      "default": "⚡ Rapide (2-3 min)"
    },
    {
      "id": "color",
      "question": "Quelle couleur principale pour ta vidéo ?",
      "options": ["🟢 Vert", "🟣 Violet", "🔵 Bleu", "🟡 Or", "🔴 Rouge", "⚪ Blanc", "🩷 Rose", "🩵 Cyan"],
      "default": "🟢 Vert"
    }
  ]
}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Prompt utilisateur: "${prompt}"
Génère les questions au format demandé (avec éventuellement 1 question contextuelle supplémentaire).`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    let clean = text.replace(/^```json\n?/m, "").replace(/\n?```$/m, "").trim();
    const s = clean.indexOf("{");
    const e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

    let result: { questions?: RawQuestion[] } = { questions: [] };
    try {
      result = JSON.parse(clean) as { questions?: RawQuestion[] };
    } catch {
      result = { questions: [] };
    }
    const durationQuestion = {
      id: "duration",
      question: "Quelle durée pour ta vidéo ?",
      options: [
        { id: "duration_15", label: "15s" },
        { id: "duration_30", label: "30s" },
        { id: "duration_45", label: "45s" },
        { id: "duration_60", label: "60s" },
        { id: "duration_90", label: "90s" },
      ],
    };

    const qualityQuestion = {
      id: "quality",
      question: "Quelle qualité de rendu ?",
      options: [
        { id: "quality_fast", label: "⚡ Rapide (2-3 min)" },
        { id: "quality_high", label: "✨ Haute qualité (5-7 min)" },
      ],
    };

    const colorQuestion = {
      id: "color",
      question: "Quelle couleur principale pour ta vidéo ?",
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
    };

    const generatedQuestions = result.questions || [];
    const rawCustom = generatedQuestions.find(
      (q) => q.id && !["duration", "quality", "color"].includes(q.id)
    );
    const normalizedCustom =
      rawCustom && rawCustom.question
        ? {
            id: rawCustom.id || "custom",
            question: rawCustom.question,
            options: (rawCustom.options || [])
              .map((opt, idx) => {
                if (typeof opt === "string") {
                  return { id: `custom_${idx + 1}`, label: opt };
                }
                return {
                  id: opt.id || `custom_${idx + 1}`,
                  label: opt.label || `Option ${idx + 1}`,
                  desc: opt.desc,
                };
              })
              .slice(0, 4),
          }
        : null;

    const questions = normalizedCustom
      ? [durationQuestion, qualityQuestion, colorQuestion, normalizedCustom]
      : [durationQuestion, qualityQuestion, colorQuestion];

    return NextResponse.json({ questions });
  } catch (err: unknown) {
    console.error("Questions error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
