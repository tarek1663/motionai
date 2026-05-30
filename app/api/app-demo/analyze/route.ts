import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@clerk/nextjs/server";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

const parseDurationSec = (duration: string | number | undefined): number => {
  if (typeof duration === "number") return duration;
  const s = String(duration || "30").replace(/s$/i, "").trim();
  return parseInt(s, 10) || 30;
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { screenshots, description, format, duration, accentColor, focus } =
      await req.json();

    if (!screenshots?.length || !description?.trim()) {
      return NextResponse.json(
        { error: "Screenshots et description requis" },
        { status: 400 },
      );
    }

    const accent =
      colorMap[accentColor] ||
      (typeof accentColor === "string" && accentColor.startsWith("#")
        ? accentColor
        : "#10B981");
    const durationSec = parseDurationSec(duration);
    const fps = 60;
    const totalFrames = durationSec * fps;
    const isMobile = format === "mobile";

    const focusLabels: Record<string, string> = {
      features: "Features clés du produit",
      dashboard: "Dashboard et analytics",
      onboarding: "Parcours onboarding",
      pricing: "Page pricing et offres",
    };
    const focusHint = focusLabels[focus] || focusLabels.features;

    const imageContent = screenshots.slice(0, 3).map((screenshot: string) => {
      const mediaPart = screenshot.split(";")[0].split(":")[1] || "image/png";
      return {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: mediaPart as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
          data: screenshot.split(",")[1],
        },
      };
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `Tu es un expert en UI/UX design et motion design.

Analyse ces screenshots de l'app/SaaS et génère une démo vidéo professionnelle.

DESCRIPTION : ${description}
FOCUS : ${focusHint}
FORMAT : ${isMobile ? "iPhone mobile 9:16" : "MacBook desktop 16:9"}
DURÉE : ${durationSec} secondes
COULEUR ACCENT : ${accent}

Ta mission :
1. Analyser visuellement les screenshots
2. Identifier : nom de l'app, couleurs principales, features clés, layout
3. Reproduire l'interface de façon simplifiée et améliorée pour la vidéo
4. Créer un chemin de navigation naturel avec la souris/doigt

RÈGLES :
- Reproduire FIDÈLEMENT les couleurs et le style de l'app
- SIMPLIFIER pour la lisibilité vidéo (max 3-4 éléments par écran)
- AMÉLIORER le design pour qu'il soit premium et professionnel
- La souris/doigt doit naviguer de façon NATURELLE et LOGIQUE
- Annotations SOBRES et DISCRÈTES — texte court, flèche fine
- Présenter uniquement les features clés de l'app
- NE PAS parler d'autre chose que de l'app

Génère un JSON avec cette structure :
{
  "appName": "nom de l'app",
  "primaryColor": "#hex couleur principale détectée",
  "bgColor": "#hex couleur de fond",
  "textColor": "#hex couleur du texte",
  "screens": [
    {
      "id": "screen1",
      "name": "Landing Page",
      "duration": 180,
      "bgColor": "#ffffff",
      "url": "appname.com",
      "elements": [
        {
          "type": "navbar",
          "logo": "AppName",
          "links": ["Features", "Pricing", "Login"],
          "ctaText": "Get Started",
          "bgColor": "#hex",
          "textColor": "#hex"
        },
        {
          "type": "hero",
          "headline": "titre principal",
          "subline": "sous-titre court",
          "ctaText": "bouton CTA",
          "ctaColor": "#hex"
        }
      ],
      "mousePath": [
        { "x": 50, "y": 10, "frame": 0, "action": "move" },
        { "x": 80, "y": 10, "frame": 30, "action": "hover" },
        { "x": 80, "y": 10, "frame": 50, "action": "click" }
      ],
      "annotations": [
        {
          "text": "Navigation intuitive",
          "x": 50,
          "y": 15,
          "arrowDirection": "up",
          "frame": 40
        }
      ]
    }
  ],
  "totalFrames": ${totalFrames}
}

Génère 3-4 écrans qui présentent les features clés.
Réponds UNIQUEMENT en JSON valide.`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    let clean = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractJsonObject = (raw: string) => {
      const s = raw.indexOf("{");
      const e = raw.lastIndexOf("}");
      return s !== -1 && e !== -1 ? raw.slice(s, e + 1) : raw;
    };

    let data: Record<string, unknown>;
    try {
      data = JSON.parse(extractJsonObject(clean));
    } catch (parseErr) {
      console.log("🔧 JSON parse error, asking Claude to fix...", parseErr);

      const fixResponse = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 4000,
        messages: [
          {
            role: "user",
            content: `Ce JSON est invalide. Corrige-le et retourne UNIQUEMENT le JSON valide sans markdown :

${clean}

Règles :
- Corrige les virgules manquantes ou en trop
- Corrige les guillemets non fermés
- Corrige les tableaux mal formés
- Retourne UNIQUEMENT le JSON valide`,
          },
        ],
      });

      const fixedText =
        fixResponse.content[0]?.type === "text"
          ? fixResponse.content[0].text
          : "";
      const fixedClean = fixedText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      data = JSON.parse(extractJsonObject(fixedClean));
    }

    return NextResponse.json({
      ...data,
      format: isMobile ? "mobile" : "desktop",
      accent,
      totalFrames:
        (typeof data.totalFrames === "number" ? data.totalFrames : null) ||
        totalFrames,
    });
  } catch (err: unknown) {
    console.error("App demo error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
