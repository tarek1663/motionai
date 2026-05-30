import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script, duration, quality, accentColor, answers } = await req.json();

    void quality;
    void answers;

    const durationFrames = (
      {
        "15s": 15,
        "30s": 30,
        "45s": 45,
        "60s": 60,
      } as Record<string, number>
    )[duration] || 30;

    const minScenes =
      (
        {
          15: 12,
          30: 20,
          45: 28,
          60: 35,
        } as Record<number, number>
      )[durationFrames] || 20;

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
    const accent =
      colorMap[accentColor] ||
      (typeof accentColor === "string" && accentColor.startsWith("#")
        ? accentColor
        : "#10B981");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `Tu es le meilleur directeur artistique motion design.

SCRIPT EXACT DE L'UTILISATEUR (ne jamais modifier ce texte) :
${script}

Ta mission : créer des scènes visuelles qui ILLUSTRENT ce script.
- Le champ "text" de chaque scène doit contenir les MOTS EXACTS du script
- Découpe le script en scènes par groupes de mots naturels (2 à 6 mots) — ne jamais couper une expression
- NE JAMAIS reformuler ou modifier le texte original
- Chaque scène illustre une partie du script avec les animations appropriées

COULEUR ACCENT : ${accent}
DURÉE : ${durationFrames} secondes
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
5. RÈGLE TEXTE PAR SCÈNE (extraits EXACTS du script original) :
   - Garde les groupes de mots naturels ensemble — ne jamais couper une expression
   - 2 à 6 mots par scène selon le rythme
   - "égalisation adaptative" → une seule scène ✅
   - "Just Do It" → une seule scène ✅
   - "La musique change tout" → une seule scène ✅
   - JAMAIS couper un groupe nominal ou une expression
   - Les mots courts seuls sont OK : "Simple." "Puissant." "Gratuit."
6. Inclure obligatoirement : 1-2 counter/stats, 1 checklist ou timeline, 1-2 transitions, des mockups SI pertinent
7. durationFrames : texte court=80, phrase=100, stats=150, mockup=180, transition=70
8. accentColor = ${accent} sur TOUTES les scènes
9. UTILISE TOUT LE CATALOGUE — minimum 10 types différents
10. photoreveal/photocollage : ajoute photoQuery en anglais descriptif

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
      "durationFrames": 80
    }
  ]
}

Réponds UNIQUEMENT en JSON valide.`,
        },
      ],
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
