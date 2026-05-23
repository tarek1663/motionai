import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1000,
      system: `Tu es un assistant qui aide à clarifier les demandes de vidéos motion design.
Tu analyses un prompt et génères 2-3 questions de clarification avec des choix.
RETOURNE UNIQUEMENT DU JSON VALIDE.

FORMAT:
{
  "questions": [
    {
      "id": "q1",
      "question": "C'est quel type de vidéo exactement ?",
      "options": [
        { "id": "o1", "label": "Intro de chaîne YouTube", "desc": "Un court générique d'ouverture" },
        { "id": "o2", "label": "Présentation de la plateforme", "desc": "Explique ce qu'est YouTube" },
        { "id": "o3", "label": "Teaser marketing", "desc": "Une vidéo promotionnelle percutante" },
        { "id": "other", "label": "Autre", "desc": "Préciser toi-même" }
      ]
    }
  ]
}

RÈGLES:
- Maximum 3 questions
- Maximum 4 options par question
- Questions courtes et directes
- Options avec descriptions courtes et claires
- Toujours inclure "Autre" comme dernière option avec id exactement "other"
- Les questions doivent vraiment aider à mieux générer la vidéo`,
      messages: [
        {
          role: "user",
          content: `Prompt utilisateur: "${prompt}"

Génère 2-3 questions de clarification pour mieux comprendre ce qu'il veut.`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "{}";
    let clean = text.replace(/^```json\n?/m, "").replace(/\n?```$/m, "").trim();
    const s = clean.indexOf("{");
    const e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

    let result: { questions?: unknown[] } = { questions: [] };
    try {
      result = JSON.parse(clean) as { questions?: unknown[] };
    } catch {
      result = { questions: [] };
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Questions error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
