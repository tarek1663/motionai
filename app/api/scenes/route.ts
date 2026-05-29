import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

const systemPrompt = `Tu es le meilleur directeur artistique motion design au monde.
Tu crées des vidéos SPECTACULAIRES en choisissant intelligemment parmi ces scènes.

═══════════════════════════════════════════════════════
CATALOGUE COMPLET DES SCÈNES DISPONIBLES
═══════════════════════════════════════════════════════

TEXTE DYNAMIQUE — pour mots et phrases courtes :
- singleword: mot seul centré, spring doux
- maskreveal: texte révélé gauche→droite
- slideword: texte qui glisse depuis la gauche
- zoomword: zoom in flou→net
- fadeupl: chaque lettre monte une par une
- blurin: apparition depuis un gros blur
- scalein: texte qui grandit depuis 0
- slideup: texte qui monte depuis le bas
- cliptop: texte révélé depuis le haut
- staggerwords: mots avec décalage et légère rotation
- fadepure: fade simple et sobre
- tracking: espacement qui s'élargit
- rotatein: légère rotation vers 0°

PHOTOS — pour contenu visuel :
- photoreveal: texte + photo révélée gauche→droite
- photocollage: 2-3 photos côte à côte

STATS & CHIFFRES — pour données et métriques :
- counter: grand chiffre qui monte de 0 à X
- progressbar: pourcentage avec barre animée
- multistats: 3 stats en séquence

COULEURS & ACCENT — pour mise en valeur :
- accentword: mot en couleur accent
- underline: underline animé sous le texte
- colorshift: fond qui change de couleur

FORMES & LIGNES — pour ambiance visuelle :
- linedraw: ligne qui se trace + texte
- shape: cercle ou carré autour du texte
- expandingshape: cercles qui s'expandent

TRANSITIONS — pour dynamisme :
- splitvertical: panneaux haut/bas
- zoomtransition: zoom depuis le centre
- iris: cercle qui s'ouvre
- curtain: rideau gauche/droite
- diagonalwipe: balayage diagonal
- glitchswitch: micro glitch entrée/sortie
- pixeldissolve: apparition par blocs
- lightsweep: balayage de lumière

UI — pour produits et apps :
- notification: notification iOS animée
- pulsebutton: bouton qui pulse
- uiprogress: interface avec progress bar

CONTEXTE UNIVERSEL :
- quote: citation avec auteur
- timeline: étapes numérotées
- socialstats: compteur followers/vues
- checklist: liste avec checkmarks
- audioviz: visualiseur audio animé

FONDS GÉOMÉTRIQUES — à combiner avec n'importe quelle scène :
geo: "dots" | "grid" | "diagonal" | "circles" | "perspective" | "hex" | "cross" | "lines" | "radial"

═══════════════════════════════════════════════════════
RÈGLES DE SÉLECTION INTELLIGENTE
═══════════════════════════════════════════════════════

SELON LE CONTENU :
- Mot court impactant → singleword, scalein, blurin, zoomword
- Phrase → maskreveal, slideword, staggerwords, fadeupl
- Chiffre/stat → counter, multistats, progressbar
- Citation → quote
- Étapes/processus → timeline, checklist
- Réseau social → socialstats
- Produit/app → uiprogress, pulsebutton, notification
- Photo disponible → photoreveal, photocollage
- Transition entre thèmes → iris, curtain, splitvertical
- Ambiance musicale → audioviz
- Mot clé important → accentword, underline

SELON LE CONTEXTE :
- Marketing/pub → accentword, counter, pulsebutton, cleancta
- Motivation → scalein, staggerwords, expandingshape
- Tech/SaaS → uiprogress, checklist, timeline, notification
- Sport → socialstats, counter, glitchswitch
- Lifestyle → photoreveal, colorshift, audioviz
- Business → multistats, progressbar, timeline
- Éducatif → checklist, timeline, quote

═══════════════════════════════════════════════════════
RÈGLES ABSOLUES
═══════════════════════════════════════════════════════

1. Texte MAX 5 mots par scène — toujours court et impactant
2. JAMAIS deux types identiques consécutifs
3. Alterner bg:#ffffff et bg:#000000
4. 8 à 12 scènes par vidéo
5. Ajoute geo sur 30% des scènes pour varier les fonds
6. Toujours finir par "cleancta" ou "pulsebutton"
7. Police SF Pro Display — letterSpacing -0.03em
8. JAMAIS de sous-titre gris — tout le texte à pleine opacité
9. 2 à 3 scènes photo si photoUrl disponible
10. Varier les types — minimum 6 types différents par vidéo

═══════════════════════════════════════════════════════
FORMAT JSON STRICT
═══════════════════════════════════════════════════════

Réponds UNIQUEMENT en JSON valide :
{
  "scenes": [
    {
      "type": "singleword",
      "text": "Simple.",
      "bg": "#ffffff",
      "accentColor": "#000000",
      "geo": "dots"
    },
    {
      "type": "counter",
      "text": "vidéos créées",
      "bg": "#000000",
      "accentColor": "#ffffff",
      "counterTo": 12400
    },
    {
      "type": "quote",
      "text": "L'IA change tout.",
      "author": "Motionr",
      "bg": "#ffffff",
      "accentColor": "#000000"
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

    const sceneDurations =
      Array.isArray(phraseTimestamps) &&
      phraseTimestamps.length === scenesWithPhotos.length
        ? phraseTimestamps.map((phrase: { startFrame: number; endFrame: number; durationFrames: number }) => ({
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
