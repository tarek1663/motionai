import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { generateScenesLineByLine } from "@/lib/prompts/line-by-line-scenes";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const extractTextContent = (content: Anthropic.Message["content"]): string =>
  content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

const parseJsonFromText = <T>(text: string, fallback: T): T => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    return JSON.parse(match[0]) as T;
  } catch {
    return fallback;
  }
};

const resolveDurationSeconds = (duration: unknown): number => {
  const mapped = (
    {
      "15s": 15,
      "30s": 30,
      "45s": 45,
      "60s": 60,
    } as Record<string, number>
  )[String(duration)];
  if (mapped) return mapped;
  const parsed = parseInt(String(duration), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
};

type SubjectData = {
  subject: string;
  brand: string;
  context: string;
};

type ResearchData = {
  brandColor: string | null;
  keyStats: Array<{ value: string; label: string; raw?: number }>;
  tagline: string;
  keyFacts: string[];
};

type CreativePlan = {
  concept: string;
  arc: string;
  heroScene: string;
  emojis: string[];
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { script, duration, accentColor, answers } = await req.json();

    void answers;

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
    const userColor =
      colorMap[accentColor] ||
      (typeof accentColor === "string" && accentColor.startsWith("#")
        ? accentColor
        : "#10B981");
    const durationSeconds = resolveDurationSeconds(duration);

    // ─── ÉTAPE 1 — DÉTECTE LE SUJET DU SCRIPT ──────────
    const subjectResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Analyse ce script et réponds en JSON :
{
  "subject": "sujet principal en 3 mots",
  "brand": "nom de la marque si mentionnée",
  "context": "sport|tech|music|food|finance|luxury|nature|general"
}

SCRIPT : "${script}"

Réponds UNIQUEMENT en JSON.`,
        },
      ],
    });

    const subjectData = parseJsonFromText<SubjectData>(
      extractTextContent(subjectResponse.content),
      { subject: "", brand: "", context: "general" },
    );

    // ─── ÉTAPE 2 — RECHERCHE WEB ────────────────────────
    const searchQuery =
      subjectData.brand || subjectData.subject || String(script).slice(0, 50);

    const researchResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        },
      ],
      messages: [
        {
          role: "user",
          content: `Recherche des informations récentes sur : "${searchQuery}"

Trouve :
1. Chiffres clés réels
2. Couleur officielle de la marque
3. Faits marquants
4. Tagline officiel

Réponds en JSON :
{
  "brandColor": "#hex",
  "keyStats": [{ "value": "750M", "label": "utilisateurs", "raw": 750000000 }],
  "tagline": "tagline",
  "keyFacts": ["fait 1", "fait 2"]
}`,
        },
      ],
    });

    const researchData = parseJsonFromText<ResearchData>(
      extractTextContent(researchResponse.content),
      {
        brandColor: null,
        keyStats: [],
        tagline: "",
        keyFacts: [],
      },
    );

    const accent = researchData.brandColor || userColor;

    // ─── ÉTAPE 3 — OPTIMISE LE SCRIPT ──────────────────
    const optimizeResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Tu es expert en copywriting motion design.

Script original de l'utilisateur :
"${script}"

Données réelles trouvées : ${JSON.stringify(researchData.keyStats)}
Faits : ${researchData.keyFacts.join(" | ")}

Optimise ce script pour une vidéo motion design de ${durationSeconds}s :
- Garde FIDÈLEMENT l'idée et le message original
- Intègre les vrais chiffres si pertinents
- Phrases courtes et percutantes — style Apple
- Maximum 6 mots par ligne
- Minimum 8 lignes, maximum 16 lignes
- Rythme varié — court/long alternés

Réponds UNIQUEMENT avec le texte optimisé, une ligne par scène.`,
        },
      ],
    });

    const optimizedScript =
      extractTextContent(optimizeResponse.content).trim() ||
      String(script || "").trim();

    // ─── ÉTAPE 4 — PLAN CRÉATIF ─────────────────────────
    const planResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Directeur artistique senior. 

SCRIPT : "${optimizedScript}"
SUJET : ${subjectData.subject}
DONNÉES : ${JSON.stringify(researchData.keyStats)}
DURÉE : ${durationSeconds}s

Plan créatif en JSON :
{
  "concept": "angle créatif 5 mots",
  "arc": "Acte1 → Acte2 → Acte3 → Acte4",
  "heroScene": "scène la plus impactante",
  "emojis": ["emoji1","emoji2","emoji3","emoji4","emoji5"]
}`,
        },
      ],
    });

    const plan = parseJsonFromText<CreativePlan>(
      extractTextContent(planResponse.content),
      {
        concept: "",
        arc: "",
        heroScene: "",
        emojis: ["✨", "🚀", "💡", "⚡", "🔥"],
      },
    );

    // ─── ÉTAPE 5 — GÉNÉRATION SCÈNES (1 scène = 1 ligne du script voix) ───
    const scenes = await generateScenesLineByLine(client, {
      script: optimizedScript,
      accent,
      researchData: {
        keyStats: researchData.keyStats,
        keyFacts: researchData.keyFacts,
      },
      emojis: plan.emojis,
    });

    return NextResponse.json({
      scenes,
      optimizedScript,
      researchData,
      plan,
      accent,
    });
  } catch (err: unknown) {
    console.error("Script scenes error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
