import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type AnalyzeResult = {
  productName?: string;
  productType?: string;
  description?: string;
  keyFeatures?: string[];
  dominantColor?: string;
  mockupType?: string;
  voiceoverText?: string;
  accentColor?: string;
  formatId?: string;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file     = formData.get("file") as File | null;
    const duration = (formData.get("duration") as string) || "30";
    const intent   = (formData.get("intent") as string) || "";

    if (!file) return NextResponse.json({ error: "Image requise" }, { status: 400 });

    const buffer   = Buffer.from(await file.arrayBuffer());
    const ext      = file.type.includes("png") ? "png" : "jpg";
    const filename = `screenshot_${uuidv4().slice(0, 8)}.${ext}`;
    const dir      = path.join(process.cwd(), "public", "photos");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, filename), buffer);

    const base64 = buffer.toString("base64");
    const mediaType = (file.type || `image/${ext}`) as "image/jpeg" | "image/png" | "image/webp";
    const wordsCount = Math.round(parseInt(duration, 10) * 2);

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: `Analyse cette capture d'écran d'une interface/produit digital.
${intent ? `L'utilisateur veut : "${intent}"` : ""}

SCRIPT VOIX OFF (${wordsCount} mots style Apple PREMIUM):
RÈGLES STRICTES:
- Phrases de 3-5 mots MAX
- Chaque phrase sur une NOUVELLE LIGNE
- Ton: sobre, impactant, cinématique
- Commence par le nom du produit
- Termine par un appel à l'action court
- PAS de ponctuation complexe
- EN FRANÇAIS
${intent ? `Objectif: ${intent}` : "Vidéo de présentation premium"}

Retourne UNIQUEMENT ce JSON:
{
  "productName": "nom du produit/app",
  "productType": "SaaS|landing|app|dashboard|ecommerce|autre",
  "description": "description en 1 phrase",
  "keyFeatures": ["feature1", "feature2", "feature3"],
  "dominantColor": "#hexcode",
  "mockupType": "browser|phone|macbook",
  "voiceoverText": "script ${wordsCount} mots style Apple — phrases TRÈS courtes 3-5 mots max, chaque phrase sur nouvelle ligne, ton premium et impactant",
  "accentColor": "#hexcode",
  "formatId": "${intent ? "detecte le format adapté parmi: pub, pitch, educatif, storytelling, comparatif" : "pub"}"
}

Pour mockupType: browser si c'est un site/webapp, phone si c'est mobile, macbook si c'est un desktop app.
Pour dominantColor: extrais la couleur principale de la marque.`,
          },
        ],
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    let clean  = text.replace(/^```json\n?/m, "").replace(/\n?```$/m, "").trim();
    const s    = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);

    let result: AnalyzeResult = {};
    try { result = JSON.parse(clean) as AnalyzeResult; } catch { result = {}; }

    return NextResponse.json({
      ...result,
      photoUrl: `/photos/${filename}`,
    });
  } catch (err: unknown) {
    console.error("Analyze error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
