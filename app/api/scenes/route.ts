import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

const buildSystemPrompt = (userPrompt: string, duration: number) => `Tu es le meilleur directeur artistique motion design au monde.
Pour le prompt "${userPrompt}", génère une vidéo COMPLÈTE de ${duration} secondes.

NOMBRE DE SCÈNES OBLIGATOIRE :
- 15s → 12 scènes minimum
- 30s → 20 scènes minimum
- 45s → 28 scènes minimum
- 60s → 35 scènes minimum

EXEMPLE pour "présente moi Spotify" en 30s → 20 scènes :
1. singleword — "Spotify." — bg:#121212 — geo:dots — durationFrames:80
2. maskreveal — "La musique." — bg:#000000 — geo:grid — durationFrames:90
3. iphone — "Écoute." — bg:#121212 — websiteUrl:"spotify.com" — geo:circles — durationFrames:180
4. counter — "100M+" — text:"titres disponibles" — bg:#ffffff — accentColor:#1DB954 — durationFrames:150
5. zoomword — "Gratuit." — bg:#1DB954 — durationFrames:80
6. checklist — items:["Podcasts","Playlists","Albums","Radio"] — bg:#121212 — durationFrames:180
7. staggerwords — "Partout." — bg:#ffffff — geo:diagonal — durationFrames:90
8. macbook — "Le dashboard." — bg:#121212 — websiteUrl:"spotify.com" — durationFrames:180
9. socialstats — platform:"Spotify" — counterTo:602000000 — statLabel:"utilisateurs actifs" — bg:#000000 — accentColor:#1DB954 — durationFrames:150
10. slideword — "Premium." — bg:#1DB954 — durationFrames:80
11. progressbar — text:"Satisfaction" — counterTo:94 — bg:#121212 — accentColor:#1DB954 — durationFrames:150
12. iris — "Découvre." — bg:#000000 — durationFrames:80
13. gradienttext — "La bande-son." — bg:#121212 — accentColor:#1DB954 — durationFrames:90
14. twolines — line1:"Spotify" — line2:"Ta musique, partout" — bg:#ffffff — accentColor:#1DB954 — durationFrames:120
15. audioviz — "Écoute ici." — bg:#121212 — accentColor:#1DB954 — durationFrames:150
16. blurin — "Gratuit." — bg:#000000 — durationFrames:80
17. spotlight — "Premium." — bg:#121212 — accentColor:#1DB954 — geo:dots — durationFrames:90
18. scalein — "€9.99/mois." — bg:#ffffff — durationFrames:80
19. curtain — "Commence." — bg:#1DB954 — durationFrames:90
20. singleword — "Spotify." — bg:#121212 — accentColor:#1DB954 — durationFrames:100

RÈGLES :
- TOUJOURS inclure durationFrames pour chaque scène (60-90 mots courts, 120-180 mockups/stats/checklist)
- Alterner bg:#121212 / bg:#ffffff / bg:accentColor
- JAMAIS deux types identiques consécutifs
- Mockup iphone/macbook MAX 2-3 fois par vidéo — répartis dans la vidéo, pas tout au début
- Texte court : 1-4 mots maximum par scène
- Inclure au moins : 1 counter, 1 checklist ou timeline, 1 stat, 1-2 mockups, des transitions variées
- geo OBLIGATOIRE sur chaque scène (dots, grid, circles, diagonal...)
- accentColor IDENTIQUE sur toutes les scènes
- websiteUrl obligatoire sur iphone/macbook/browser (ex: "spotify.com")

Réponds UNIQUEMENT en JSON valide :
{
  "scenes": [
    {
      "type": "singleword",
      "text": "Spotify.",
      "bg": "#121212",
      "accentColor": "#1DB954",
      "geo": "dots",
      "durationFrames": 80
    }
  ]
}`;

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
      formatId,
    } = await req.json();
    if (!voiceoverText?.trim()) {
      return NextResponse.json({ error: "Voix requis" }, { status: 400 });
    }

    const durationSec = Math.round(Number(audioDuration) || 30);
    const systemPrompt = buildSystemPrompt(
      prompt || voiceoverText,
      durationSec,
    );

    const result = await generateScenesFromVoice({
      prompt,
      voiceoverText,
      audioDuration,
      format,
      accentColor,
      bgDark,
      bgLight,
      bgAccent,
      phraseTimestamps,
      formatId,
      systemPrompt,
    });

    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";
    const PHOTO_TYPES = new Set(["photoreveal", "photocollage"]);

    const scenesWithPhotos = await Promise.all(
      result.scenes.map(async (scene) => {
        if (!PHOTO_TYPES.has(scene.type)) return scene;

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
          scene.photoUrl || (await fetchPhoto(scene.photoQuery));
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
      const fromScene = (scene as { durationFrames?: number }).durationFrames;
      if (fromScene && fromScene >= 60) {
        return { durationFrames: Math.round(fromScene) };
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
          durationFrames: Math.max(60, Math.round(phrase.durationFrames)),
        };
      }
      const fallback = result.sceneDurations[i];
      return typeof fallback === "number"
        ? { durationFrames: Math.max(60, fallback) }
        : { durationFrames: 90 };
    });

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
