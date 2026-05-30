import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

const buildSystemPrompt = (
  userPrompt: string,
  duration: number,
  accent = "#10B981",
) => {
  const minScenes =
    (
      {
        15: 12,
        30: 20,
        45: 28,
        60: 35,
      } as Record<number, number>
    )[duration] || 20;

  return `Tu es le meilleur directeur artistique motion design au monde.

Pour le prompt "${userPrompt}", génère une vidéo motion design SPECTACULAIRE de ${duration} secondes.

COULEUR ACCENT : ${accent}
DURÉE : ${duration} secondes
SCÈNES MINIMUM : ${minScenes}

CATALOGUE COMPLET DES SCÈNES DISPONIBLES :

TEXTE : singleword, maskreveal, slideword, zoomword, fadeupl, blurin, scalein, slideup, cliptop, staggerwords, fadepure, tracking, rotatein, eraseletters, splitlines, twolines, weightreveal, gradienttext, accentword, underline, colorshift, spotlight, hierarchytext

STATS : counter, multistats, progressbar, socialstats, bgnumber

MOCKUPS WEB/APP : iphone, macbook, browser, doubledevice, dashboard
(UNIQUEMENT si le sujet est une app, site, SaaS, service digital)

FORMES : linedraw, shape, expandingshape

TRANSITIONS : iris, curtain, diagonalwipe, splitvertical, zoomtransition, glitchswitch, pixeldissolve, lightsweep

UI : notification, pulsebutton, uiprogress

CONTEXTE : quote, timeline, checklist, audioviz, photoreveal, photocollage

RÈGLES ABSOLUES :
1. MINIMUM ${minScenes} scènes
2. JAMAIS deux types identiques consécutifs
3. Alterner bg:#ffffff → bg:#000000 → bg:${accent} → bg:#ffffff
4. geo OBLIGATOIRE sur chaque scène — varier : dots, grid, circles, diagonal, cross, lines, radial, perspective
5. Texte MAX 4 mots par scène
6. Inclure obligatoirement : 1-2 counter/stats, 1 checklist ou timeline, 1-2 transitions, des mockups SI pertinent
7. durationFrames : texte court=80, phrase=100, stats=150, mockup=180, transition=70
8. accentColor = ${accent} sur TOUTES les scènes
9. UTILISE TOUT LE CATALOGUE — minimum 10 types différents
10. photoreveal/photocollage : ajoute photoQuery en anglais descriptif
11. websiteUrl obligatoire sur iphone/macbook/browser (ex: "spotify.com")

RÈGLE DIVERSITÉ VISUELLE OBLIGATOIRE :
Par vidéo tu DOIS inclure au minimum :
- 3 scènes de texte différentes (parmi : singleword, maskreveal, slideword, zoomword, blurin, scalein, staggerwords, fadeup, rotatein, tracking)
- 1 scène de stats ou chiffres (counter, multistats, progressbar, socialstats, bgnumber)
- 1 scène de liste (checklist, timeline, splitlines)
- 1 scène de forme ou ambiance (linedraw, shape, expandingshape, spotlight, audioviz)
- 1 scène de transition (iris, curtain, diagonalwipe, pixeldissolve, lightsweep, glitchswitch)
- 1 scène photo si photoQuery pertinent (photoreveal, photocollage)
- 1 scène mockup SI sujet web/app (iphone, browser, macbook, dashboard)
- 1 scène accent (accentword, underline, gradienttext, twolines)
- 1 scène CTA finale (pulsebutton, singleword fort)

FONDS — rotation stricte sur chaque scène :
bg:#ffffff → bg:#000000 → bg:${accent} → bg:#ffffff → bg:#000000 → bg:${accent}...

GEO — jamais deux fois le même consécutivement :
dots → grid → circles → diagonal → cross → lines → radial → perspective → dots...

FORMAT JSON STRICT :
{
  "scenes": [
    {
      "type": "singleword",
      "text": "mot",
      "bg": "#000000",
      "accentColor": "${accent}",
      "geo": "dots",
      "durationFrames": 80
    }
  ]
}

Réponds UNIQUEMENT en JSON valide.`;
};

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
      accentColor || "#10B981",
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
