import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { generateScenesLineByLine } from "@/lib/prompts/line-by-line-scenes";
import { UNIVERSAL_VIDEO_SYSTEM_PROMPT } from "@/lib/prompts/universal-video-system";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COLOR_MAP: Record<string, string> = {
  "🟢 Vert": "#10B981",
  "🟣 Violet": "#7C3AED",
  "🔵 Bleu": "#3B82F6",
  "🟡 Or": "#F59E0B",
  "🔴 Rouge": "#EF4444",
  "⚪ Blanc": "#ffffff",
  "🩷 Rose": "#EC4899",
  "🩵 Cyan": "#06B6D4",
};

type ResearchData = {
  brandColor: string | null;
  keyStats: Array<{ value: string; label: string; raw?: number }>;
  tagline: string;
  keyFacts: string[];
  concept: string;
};

type CreativePlan = {
  concept: string;
  arc: string;
  heroScene: string;
  emojis?: string[];
};

const DEFAULT_RESEARCH: ResearchData = {
  brandColor: null,
  keyStats: [],
  tagline: "",
  keyFacts: [],
  concept: "",
};

const DEFAULT_PLAN: CreativePlan = {
  concept: "",
  arc: "",
  heroScene: "",
};

const extractTextContent = (content: Anthropic.Message["content"]): string =>
  content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

const parseJsonFromText = <T>(text: string, fallback: T): T => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return fallback;
  }
};

const resolveUserAccent = (accentColor?: string): string => {
  if (!accentColor) return "#10B981";
  if (COLOR_MAP[accentColor]) return COLOR_MAP[accentColor];
  if (accentColor.startsWith("#")) return accentColor;
  return "#10B981";
};

async function runWebResearch(subject: string): Promise<ResearchData> {
  const researchResponse = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    system: UNIVERSAL_VIDEO_SYSTEM_PROMPT,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
      },
    ],
    messages: [
      {
        role: "user",
        content: `Recherche des informations récentes et précises sur : "${subject}"

Tu dois trouver :
1. Les vrais chiffres clés (utilisateurs, revenus, stats)
2. Les dates importantes
3. Le tagline officiel
4. La couleur officielle de la marque (hex)
5. Les faits marquants récents

Réponds en JSON :
{
  "brandColor": "#hex couleur officielle de la marque",
  "keyStats": [
    { "value": "750M", "label": "utilisateurs actifs", "raw": 750000000 }
  ],
  "tagline": "tagline officiel",
  "keyFacts": ["fait 1", "fait 2"],
  "concept": "angle créatif en 5 mots"
}`,
      },
    ],
  });

  const parsed = parseJsonFromText<Partial<ResearchData>>(
    extractTextContent(researchResponse.content),
    {},
  );

  return {
    brandColor: parsed.brandColor ?? null,
    keyStats: Array.isArray(parsed.keyStats) ? parsed.keyStats : [],
    tagline: parsed.tagline ?? "",
    keyFacts: Array.isArray(parsed.keyFacts) ? parsed.keyFacts : [],
    concept: parsed.concept ?? "",
  };
}

async function runCreativePlan(
  subject: string,
  researchData: ResearchData,
  durationSec: number,
  accent: string,
): Promise<CreativePlan> {
  const planResponse = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    system: UNIVERSAL_VIDEO_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Tu es directeur artistique senior pour une vidéo motion design.

SUJET : "${subject}"
CONCEPT : ${researchData.concept || "impact et dynamisme"}
DONNÉES RÉELLES : ${JSON.stringify(researchData.keyStats)}
FAITS : ${researchData.keyFacts.join(", ")}
DURÉE : ${durationSec}
COULEUR : ${accent}

Crée un plan créatif en 3 lignes :
1. Concept central (5 mots max)
2. Arc narratif (début → milieu → fin)
3. Scène la plus impactante

Réponds en JSON :
{
  "concept": "L'Empire du son",
  "arc": "Domination → Chiffres → Impact",
  "heroScene": "slot-machine 750M utilisateurs"
}`,
      },
    ],
  });

  return parseJsonFromText<CreativePlan>(
    extractTextContent(planResponse.content),
    {
      concept: researchData.concept || "",
      arc: "",
      heroScene: "",
    },
  );
}

export async function POST(req: NextRequest) {
  try {
    const {
      prompt,
      voiceoverText,
      audioDuration,
      format,
      accentColor,
      bgDark,
      bgLight,
      bgAccent,
      phraseTimestamps,
      wordTimestamps,
      totalFrames,
      formatId,
    } = await req.json();
    if (!voiceoverText?.trim()) {
      return NextResponse.json({ error: "Voix requis" }, { status: 400 });
    }

    const subject = String(prompt || voiceoverText).trim();
    const durationSec = Math.round(Number(audioDuration) || 30);
    const userColor = resolveUserAccent(accentColor);

    // ─── ÉTAPE 1 — RECHERCHE WEB + DÉTECTION COULEUR ───
    let researchData: ResearchData = { ...DEFAULT_RESEARCH };
    try {
      researchData = await runWebResearch(subject);
    } catch (err) {
      console.error("Research error:", err);
    }

    const accent = researchData.brandColor || userColor;
    console.log(
      "🎨 Accent color:",
      accent,
      "— Brand:",
      researchData.brandColor,
      "— User:",
      userColor,
    );

    // ─── ÉTAPE 2 — PLAN CRÉATIF ─────────────────────────
    let plan: CreativePlan = { ...DEFAULT_PLAN };
    try {
      plan = await runCreativePlan(subject, researchData, durationSec, accent);
    } catch (err) {
      console.error("Plan error:", err);
    }

    // ─── ÉTAPE 3 — GÉNÉRATION SCÈNES (1 scène = 1 ligne du script voix) ───
    const brandAccent = researchData.brandColor || accent;
    const scenesWithBrandColor = await generateScenesLineByLine(client, {
      script: voiceoverText,
      accent: brandAccent,
      researchData: {
        keyStats: researchData.keyStats,
        keyFacts: researchData.keyFacts,
      },
      emojis: plan.emojis || ["✨", "🚀", "💡", "⚡", "🔥"],
    });

    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";
    const PHOTO_TYPES = new Set(["photoreveal", "photocollage"]);

    const scenesWithPhotos = await Promise.all(
      scenesWithBrandColor.map(async (scene) => {
        if (!PHOTO_TYPES.has(String(scene.type))) return scene;

        const fetchPhoto = async (query?: string) => {
          if (!query?.trim()) return undefined;
          try {
            const photoRes = await fetch(`${RENDER_URL}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query }),
            });
            if (photoRes.ok) {
              const { photoUrl } = await photoRes.json();
              return photoUrl as string | undefined;
            }
          } catch (err) {
            console.error("Pexels error:", query, err);
          }
          return undefined;
        };

        const photoUrl =
          scene.photoUrl || (await fetchPhoto(scene.photoQuery as string | undefined));
        const photoUrl2 =
          scene.photoUrl2 ||
          (scene.type === "photocollage"
            ? await fetchPhoto(`${scene.photoQuery || "team"} office`)
            : undefined);
        const photoUrl3 =
          scene.photoUrl3 ||
          (scene.type === "photocollage"
            ? await fetchPhoto(`${scene.photoQuery || "business"} meeting`)
            : undefined);

        return {
          ...scene,
          ...(photoUrl ? { photoUrl } : {}),
          ...(photoUrl2 ? { photoUrl2 } : {}),
          ...(photoUrl3 ? { photoUrl3 } : {}),
        };
      }),
    );

    const sceneDurations = scenesWithPhotos.map((scene, i) => {
      const fromScene = scene as {
        startFrame?: number;
        durationFrames?: number;
      };

      if (fromScene.durationFrames && fromScene.durationFrames >= 40) {
        return {
          durationFrames: Math.max(40, Math.round(fromScene.durationFrames)),
        };
      }

      if (
        Array.isArray(phraseTimestamps) &&
        phraseTimestamps.length === scenesWithPhotos.length &&
        phraseTimestamps[i]
      ) {
        const phrase = phraseTimestamps[i] as {
          startFrame: number;
          endFrame: number;
          durationFrames: number;
        };
        return {
          startFrame: Math.round(phrase.startFrame),
          endFrame: Math.round(phrase.endFrame),
          durationFrames: Math.max(40, Math.round(phrase.durationFrames)),
        };
      }

      return { durationFrames: 90 };
    });

    return NextResponse.json({
      scenes: scenesWithPhotos,
      sceneDurations,
      researchData,
      plan,
      accent: brandAccent,
    });
  } catch (err: unknown) {
    console.error("Scenes error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
