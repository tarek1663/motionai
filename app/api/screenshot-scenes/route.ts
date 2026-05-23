import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const {
      productName,
      productType,
      description,
      keyFeatures,
      accentColor,
      mockupType,
      photoUrl,
      voiceoverText,
      audioDuration,
      phraseTimestamps,
      intent,
    } = await req.json();

    if (!voiceoverText?.trim()) {
      return NextResponse.json({ error: "voiceoverText requis" }, { status: 400 });
    }

    const fps = 60;
    const phrases = voiceoverText
      .split("\n")
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    const nbScenes = phrases.length;
    if (nbScenes === 0) {
      return NextResponse.json({ error: "Aucune phrase dans voiceoverText" }, { status: 400 });
    }

    const sceneDurations = phraseTimestamps?.length === nbScenes
      ? phraseTimestamps.map((pt: { durationFrames: number }) =>
          Math.max(90, Math.min(300, pt.durationFrames)),
        )
      : phrases.map(() => Math.round((audioDuration * fps) / nbScenes));

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 3000,
      system: `Tu es un directeur artistique expert en vidéos de présentation de produits SaaS.
Tu crées des séquences de scènes motion design pour présenter une interface/produit.
RETOURNE UNIQUEMENT DU JSON VALIDE.

TYPES DISPONIBLES:
- "glitch": impact fort, aberration chromatique — pour le titre/nom du produit
- "word": 1-3 mots massifs — pour les concepts clés
- "reveal": texte surgit d'un masque — pour les révélations
- "sentence": phrase narrative mot par mot
- "mockup": screenshot animé dans un frame — utiliser 2-3 fois par vidéo
- "counter": chiffre animé — pour les stats
- "burst": explosion de lignes — pour les moments d'impact
- "highlight": mot illuminé dans une phrase
- "zoompunch": zoom depuis l'infini — pour l'impact final
- "floatstats": 3 stats côte à côte — pour les métriques
- "particles": explosion de particules — pour les moments forts
- "splitscreen": panneaux qui arrivent — pour les comparaisons
- "cta": appel à l'action — toujours en dernier

RÈGLES:
- Commence TOUJOURS par "glitch" avec le nom du produit
- Place "mockup" en position 2, au milieu, et vers la fin
- Termine TOUJOURS par "cta"
- JAMAIS 2x le même type consécutif
- Alterner fonds: #0a0a0a → ${accentColor} → #ffffff → #0a0a0a
- Le fond accent doit être une version SOMBRE de la couleur: si accentColor est vif, assombrir

FORMAT: { "scenes": [...] }`,
      messages: [{
        role: "user",
        content: `Produit: "${productName}" (${productType})
Description: ${description}
Features: ${keyFeatures?.join(", ")}
Couleur accent: ${accentColor}
Type mockup: ${mockupType}
Photo URL: ${photoUrl}
Intent utilisateur: ${intent || "Présentation générale du produit"}

Phrases voix (${nbScenes} phrases):
${phrases.map((p: string, i: number) => `${i + 1}. "${p}"`).join("\n")}

Crée exactement ${nbScenes} scènes premium pour présenter ce produit.
Pour chaque scène "mockup", inclus:
  - type: "mockup"
  - text: phrase courte de la scène
  - text2: "${productName}.com" ou URL
  - mockupType: "${mockupType}"
  - photoUrl: "${photoUrl}"
  - bg: "#0a0a0a"
  - accentColor: "${accentColor}"`,
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    let clean  = text.replace(/^```json\n?/m, "").replace(/\n?```$/m, "").trim();
    const s    = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s !== -1 && e !== -1) clean = clean.slice(s, e + 1);
    clean = clean.replace(/,(\s*[}\]])/g, "$1");

    let result: { scenes?: Record<string, unknown>[] } = {};
    try {
      result = JSON.parse(clean) as { scenes?: Record<string, unknown>[] };
    } catch {
      result = {
        scenes: phrases.map((phrase: string, i: number) => {
          if (i === 0) return { type: "glitch", text: productName, text2: description, bg: "#0a0a0a", accentColor };
          if (i === 1 || i === Math.floor(nbScenes / 2)) {
            return {
              type: "mockup",
              text: phrase,
              text2: `${productName}.com`,
              mockupType,
              photoUrl,
              bg: "#0a0a0a",
              accentColor,
            };
          }
          if (i === nbScenes - 1) {
            return {
              type: "cta",
              text: phrase,
              text2: "Essayer maintenant",
              bg: accentColor,
              accentColor: "#ffffff",
            };
          }
          const types = ["word", "particles", "highlight", "burst", "zoompunch", "counter", "sentence"];
          return {
            type: types[i % types.length],
            text: phrase,
            bg: i % 2 === 0 ? "#0a0a0a" : "#ffffff",
            accentColor,
          };
        }),
      };
    }

    const scenes = (result.scenes || []).map((scene) => {
      if (scene.type === "mockup") {
        return { ...scene, photoUrl, mockupType: scene.mockupType || mockupType };
      }
      return scene;
    });

    return NextResponse.json({
      scenes,
      sceneDurations,
      durationPerScene: Math.round((audioDuration * fps) / nbScenes),
    });
  } catch (err: unknown) {
    console.error("Screenshot scenes error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
