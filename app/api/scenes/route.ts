import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice, generateScenesFromWordTimestamps } from "@/lib/claude";
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

TEXTE : singleword, maskreveal, slideword, zoomword, fadeupl, blurin, scalein, slideup, cliptop, staggerwords, fadepure, tracking, rotatein, eraseletters, splitlines, twolines, weightreveal, gradienttext, accentword, underline, colorshift, spotlight, hierarchytext, karaoke, wordgroups

NOUVELLES SCÈNES TEXTE LONG :
- karaoke: phrase complète affichée, mots qui s'illuminent en accent un par un — IDÉAL pour phrases de 5-10 mots
- wordgroups: groupes de 2 mots qui apparaissent en séquence avec indicateur — IDÉAL pour phrases de 4-8 mots

RÈGLE TEXTE LONG OBLIGATOIRE :
- Phrase de 5 mots ou plus → utiliser OBLIGATOIREMENT karaoke ou wordgroups
- JAMAIS afficher une phrase longue avec singleword, maskreveal ou slideword
- Alterner karaoke et wordgroups dans la même vidéo
- Sur karaoke : durationFrames = nombre de mots × 25 minimum
- Sur wordgroups : durationFrames = nombre de groupes × 60 minimum

RÈGLE PHOTOS OBLIGATOIRE :
- TOUJOURS inclure un champ "text" sur les scènes photo
- Le texte doit décrire ou commenter la photo
- JAMAIS de scène photo sans texte

RÈGLE COUNTER :
- counterTo doit être la valeur EXACTE à afficher — jamais arrondir
- Si c'est un prix → prefix: "€" ou "$" suffix: "" counterTo: 800 (pas 1000)
- Si c'est des utilisateurs → counterTo: 50000 suffix: "+"
- Si c'est un pourcentage → counterTo: 94 suffix: "%"
- JAMAIS mettre counterTo: 1000 si la vraie valeur est 800

RÈGLE IMAGES RENFORCÉE :
- photoreveal ou photocollage sur au minimum 3 scènes par vidéo
- photoQuery très descriptif en anglais (ex: "nike running shoes athlete track")
- Alterne : texte → photo → emoji → texte → photo

NOUVELLES SCÈNES VISUELLES :
- emoji: emoji Twemoji géant animé + texte — emoji flotte et pulse
  → Champ obligatoire : "emoji" (ex: "🚀", "🎬", "💡", "🔥", "⚡", "🌍", "🎯", "💰")
  → Utiliser pour illustrer un concept clé
- emojiburst: plusieurs emojis en orbite autour du texte central
  → Champ : "emojis" (tableau de 4-5 emojis cohérents avec le sujet)
  → Utiliser pour les moments d'énergie et de célébration
- particles: particules lumineuses qui flottent + texte
  → Utiliser pour les moments premium et luxe

RÈGLE EMOJIS CONTEXTUELS :
- Nike/Sport → 👟 🏃 💪 🏆 ⚡
- Tech/IA → 🤖 💡 🚀 ⚡ 🔮
- Music/Spotify → 🎵 🎧 🎶 🎤 🎸
- Food → 🍕 🍔 🌮 🍜 🥗
- Finance → 💰 📈 💎 🏦 💳
- Travel → ✈️ 🌍 🏖️ 🗺️ 🌅
- Luxury → 💎 👑 ✨ 🥂 🌟
- Gaming → 🎮 👾 🕹️ 🏆 ⚡

STATS : counter, multistats, progressbar, socialstats, bgnumber

MOCKUPS WEB/APP : iphone, macbook, browser, doubledevice, dashboard
(UNIQUEMENT si le sujet est une app, site, SaaS, service digital)

FORMES : linedraw, shape, expandingshape

TRANSITIONS : iris, curtain, diagonalwipe, splitvertical, zoomtransition, glitchswitch, pixeldissolve, lightsweep

UI : notification, pulsebutton, uiprogress

CONTEXTE : quote, timeline, checklist, audioviz, photoreveal, photocollage

EFFETS DYNAMIQUES — utiliser avec parcimonie pour les moments forts :
- strobe: texte avec flash rapide à l'entrée — pour les mots très impactants
- explode: texte qui explose à la sortie — pour les révélations
- parallax: fond et texte bougent en sens opposés — pour la profondeur
- repeatcut: même mot répété 3x avec fonds alternés — pour l'emphase

RÈGLES ABSOLUES :
1. MINIMUM ${minScenes} scènes
2. JAMAIS deux types identiques consécutifs
3. Alterner bg:#ffffff → bg:#000000 → bg:${accent} → bg:#ffffff
4. geo OBLIGATOIRE sur chaque scène — varier : dots, grid, circles, diagonal, cross, lines, radial, perspective

RÈGLE GEO ABSOLUE — SANS EXCEPTION :
- TOUTES les scènes DOIVENT avoir un champ "geo"
- Si tu oublies geo sur une scène → la vidéo sera rejetée
- Rotation obligatoire : dots → grid → circles → diagonal → cross → lines → perspective → radial → dots...
- JAMAIS deux geo identiques consécutifs
- geo s'applique sur TOUS les types de scènes sans exception
5. RÈGLE TEXTE PAR SCÈNE :
   - Garde les groupes de mots naturels ensemble — ne jamais couper une expression
   - 2 à 6 mots par scène selon le rythme
   - "égalisation adaptative" → une seule scène ✅
   - "Just Do It" → une seule scène ✅
   - "La musique change tout" → une seule scène ✅
   - JAMAIS couper un groupe nominal ou une expression
   - Les mots courts seuls sont OK : "Simple." "Puissant." "Gratuit."
6. Inclure obligatoirement : 1-2 counter/stats, 1 checklist ou timeline, 1-2 transitions, des mockups SI pertinent
7. RÈGLES DE DURÉE — STYLE APPLE/NIKE :
   - Mots courts et forts (1-2 mots) → 50-60 frames MAX — rapide et impactant
   - Phrases moyennes (3-4 mots) → 70-90 frames
   - Phrases longues (5-6 mots) → 90-110 frames
   - Stats et chiffres → 120-150 frames — laisse le temps de lire
   - Mockups et UI → 150-180 frames
   - Transitions → 40-50 frames — très rapides
   RÈGLE ÉNERGIE :
   - Commence fort — les 3 premières scènes très courtes (50-60 frames)
   - Monte en intensité vers le milieu
   - Pic d'énergie à 60% de la vidéo — scène la plus impactante
   - Descend doucement vers le CTA final
   - Alterne TOUJOURS : scène courte → scène longue → scène courte
   - JAMAIS 3 scènes de même durée consécutives
8. accentColor = ${accent} sur TOUTES les scènes
9. UTILISE TOUT LE CATALOGUE — minimum 10 types différents
10. photoreveal/photocollage : ajoute photoQuery en anglais descriptif
11. websiteUrl obligatoire sur iphone/macbook/browser (ex: "spotify.com")

RÈGLE TRANSITIONS OBLIGATOIRES :
- Insère une transition toutes les 4-5 scènes
- Après un bloc de stats → transition obligatoire
- Avant le CTA final → transition obligatoire
- Choisis des transitions rapides et énergiques : iris, glitchswitch, pixeldissolve, diagonalwipe
- JAMAIS deux transitions identiques dans la même vidéo

RÈGLE ALTERNANCE VISUELLE :
- Scène SIMPLE : 1 mot, fond uni, pas de geo → crée du contraste
- Scène COMPLEXE : mockup, checklist, stats, photo → crée de l'info
- Toujours alterner : simple → complexe → simple → complexe
- Après chaque scène complexe → scène simple de respiration (1 mot, 50 frames)
- Exemple :
  1. "Nike." — simple — 50f
  2. checklist features — complexe — 150f
  3. "Puissant." — simple — 50f
  4. counter 50M users — complexe — 120f
  5. iris transition — 40f
  6. "Just Do It." — simple — 60f

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
      "type": "maskreveal",
      "text": "La musique change tout",
      "bg": "#000000",
      "accentColor": "${accent}",
      "geo": "dots",
      "durationFrames": 55
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
      wordTimestamps,
      totalFrames,
      formatId,
    } = await req.json();
    if (!voiceoverText?.trim()) {
      return NextResponse.json({ error: "Voix requis" }, { status: 400 });
    }

    const durationSec = Math.round(Number(audioDuration) || 30);
    const accent = accentColor || "#10B981";
    const useWordSync =
      Array.isArray(wordTimestamps) && wordTimestamps.length >= 3;

    const result = useWordSync
      ? await generateScenesFromWordTimestamps({
          prompt: prompt || voiceoverText,
          script: voiceoverText,
          totalFrames:
            totalFrames ||
            wordTimestamps[wordTimestamps.length - 1]?.endFrame ||
            durationSec * 60,
          accentColor: accent,
          wordTimestamps,
        })
      : await generateScenesFromVoice({
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
          systemPrompt: buildSystemPrompt(
            prompt || voiceoverText,
            durationSec,
            accent,
          ),
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
      const fromScene = scene as {
        startFrame?: number;
        durationFrames?: number;
      };

      if (useWordSync && fromScene.startFrame !== undefined) {
        return {
          startFrame: Math.round(fromScene.startFrame),
          durationFrames: Math.max(30, Math.round(fromScene.durationFrames || 72)),
        };
      }

      if (fromScene.durationFrames && fromScene.durationFrames >= 40) {
        return { durationFrames: Math.min(150, Math.round(fromScene.durationFrames)) };
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
          durationFrames: Math.min(150, Math.max(40, Math.round(phrase.durationFrames))),
        };
      }
      const fallback = result.sceneDurations[i];
      return typeof fallback === "number"
        ? { durationFrames: Math.min(150, Math.max(40, fallback)) }
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
