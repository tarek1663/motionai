import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice } from "@/lib/claude";
import { buildPremiumSceneSystemPrompt, MOTION_GOLDEN_RULES } from "@/lib/prompts/motion-scenes-system";
import { getErrorMessage } from "@/lib/utils";

/** Prompt système premium + règles d'or images/icônes */
export const scenesSystemPrompt = (accentColor = "#7C3AED") =>
  `${buildPremiumSceneSystemPrompt(accentColor)}\n\n${MOTION_GOLDEN_RULES}`;

type GeneratedScene = {
  type: string;
  photoQuery?: string;
  photoUrl?: string;
  text?: string;
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, voiceoverText, audioDuration, format, accentColor, bgDark, bgLight, bgAccent, phraseTimestamps, formatId } = await req.json();
    if (!voiceoverText?.trim()) return NextResponse.json({ error: "Voix requis" }, { status: 400 });
    const result = await generateScenesFromVoice({
      prompt, voiceoverText, audioDuration, format, accentColor,
      bgDark, bgLight, bgAccent, phraseTimestamps, formatId,
    });

    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    const scenesWithPhotos = await Promise.all(
      (result.scenes as GeneratedScene[]).map(async (scene) => {
        const needsPhoto =
          (scene.type === "photo" || scene.type === "photocard" || scene.type === "phototext") &&
          scene.photoQuery;
        if (needsPhoto) {
          try {
            console.log("🖼️ Téléchargement photo pour:", scene.photoQuery);
            const photoRes = await fetch(`${RENDER_URL}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: scene.photoQuery }),
            });
            if (photoRes.ok) {
              const { photoUrl: hostedUrl } = await photoRes.json();
              console.log("🖼️ Photo hébergée:", hostedUrl);
              if (hostedUrl) {
                return { ...scene, photoUrl: hostedUrl };
              }
            } else {
              console.error("🖼️ Échec /photos:", photoRes.status, await photoRes.text());
            }
          } catch (err) {
            console.error("🖼️ Erreur Pexels:", scene.photoQuery, err);
            return { ...scene, type: "word" };
          }
          return { ...scene, type: "word" };
        }
        return scene;
      }),
    );

    const sceneDurations =
      Array.isArray(phraseTimestamps) && phraseTimestamps.length === scenesWithPhotos.length
        ? phraseTimestamps.map((phrase: any) => ({
            startFrame: Math.round(phrase.startFrame),
            endFrame: Math.round(phrase.endFrame),
            durationFrames: Math.round(phrase.durationFrames),
          }))
        : result.sceneDurations;

    return NextResponse.json({
      ...result,
      scenes: scenesWithPhotos,
      sceneDurations,
    });
  } catch (err: unknown) {
    console.error("Scenes error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
