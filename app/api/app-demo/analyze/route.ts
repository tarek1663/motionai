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
              text: `Analyse ces screenshots et génère une interface simplifiée pour une démo vidéo.

APP : ${description}
FOCUS : ${focusHint}
FORMAT : ${isMobile ? "Mobile iPhone" : "Desktop MacBook"}
ACCENT : ${accent}
DURÉE : ${durationSec} secondes

Génère EXACTEMENT ce JSON — rien d'autre :
{
  "appName": "Motionr",
  "primaryColor": "${accent}",
  "bgColor": "#ffffff",
  "textColor": "#000000",
  "screens": [
    {
      "id": "screen1",
      "name": "Dashboard",
      "duration": 180,
      "bgColor": "#ffffff",
      "url": "motionr.app",
      "elements": [
        {
          "type": "navbar",
          "logo": "Motionr",
          "links": ["Features", "Pricing"],
          "ctaText": "Créer",
          "bgColor": "#ffffff",
          "textColor": "#000000"
        },
        {
          "type": "hero",
          "headline": "Crée des vidéos IA",
          "subline": "Motion design en quelques minutes",
          "ctaText": "Commencer gratuitement"
        },
        {
          "type": "features",
          "items": [
            { "icon": "✨", "title": "IA Script", "desc": "Génération auto" },
            { "icon": "🎬", "title": "Animations", "desc": "72+ scènes" },
            { "icon": "⚡", "title": "1080p", "desc": "Rendu rapide" }
          ]
        }
      ],
      "mousePath": [
        { "x": 15, "y": 5, "frame": 0, "action": "move" },
        { "x": 50, "y": 5, "frame": 30, "action": "hover" },
        { "x": 75, "y": 5, "frame": 60, "action": "hover" },
        { "x": 80, "y": 5, "frame": 80, "action": "click" },
        { "x": 50, "y": 50, "frame": 120, "action": "move" }
      ],
      "annotations": [
        { "text": "Navigation", "x": 50, "y": 12, "arrowDirection": "up", "frame": 40 },
        { "text": "Fonctionnalités clés", "x": 30, "y": 75, "arrowDirection": "down", "frame": 100 }
      ]
    },
    {
      "id": "screen2",
      "name": "Générateur",
      "duration": 180,
      "bgColor": "#0a0a0a",
      "url": "motionr.app/dashboard",
      "elements": [
        {
          "type": "sidebar",
          "items": ["✏️ Créer", "🎬 Vidéos", "⚙️ Compte"],
          "activeIndex": 0
        },
        {
          "type": "hero",
          "headline": "Décris ta vidéo",
          "subline": "L'IA génère tout automatiquement",
          "ctaText": "Générer →"
        },
        {
          "type": "card",
          "title": "Vidéos générées",
          "value": "1,247",
          "color": "${accent}"
        }
      ],
      "mousePath": [
        { "x": 50, "y": 50, "frame": 0, "action": "move" },
        { "x": 50, "y": 70, "frame": 40, "action": "click" },
        { "x": 75, "y": 85, "frame": 100, "action": "click" }
      ],
      "annotations": [
        { "text": "Prompt IA", "x": 50, "y": 65, "arrowDirection": "up", "frame": 20 },
        { "text": "Générer", "x": 75, "y": 78, "arrowDirection": "down", "frame": 80 }
      ]
    }
  ],
  "totalFrames": ${totalFrames}
}

IMPORTANT :
- Adapte le contenu à l'app décrite dans les screenshots
- Utilise les couleurs détectées dans les screenshots pour bgColor, textColor, primaryColor
- Chaque element doit avoir type parmi : navbar, hero, features, sidebar, card, chart, table
- Toutes les valeurs texte (logo, headline, title, desc, links, items) doivent être des STRINGS simples — jamais d'objets JSON imbriqués
- Garde cette structure exacte avec 2 écrans minimum
- Réponds UNIQUEMENT avec le JSON — pas de texte avant ou après`,
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
