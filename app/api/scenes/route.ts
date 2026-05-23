import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

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

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    const scenesWithPhotos = await Promise.all(
      (result.scenes as GeneratedScene[]).map(async (scene) => {
        if (scene.type === "photo" && scene.photoQuery) {
          try {
            console.log("🖼️ Téléchargement photo pour:", scene.photoQuery);
            const downloadRes = await fetch(`${baseUrl}/api/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ query: scene.photoQuery }),
            });
            if (downloadRes.ok) {
              const { photoUrl: hostedUrl } = await downloadRes.json();
              console.log("🖼️ Photo hébergée:", hostedUrl);
              if (hostedUrl) {
                return { ...scene, photoUrl: hostedUrl };
              }
            } else {
              console.error("🖼️ Échec /api/photos:", downloadRes.status, await downloadRes.text());
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

    return NextResponse.json({
      ...result,
      scenes: scenesWithPhotos,
    });
  } catch (err: unknown) {
    console.error("Scenes error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
