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

SCÈNES TEXTE — 7 effets Apple officiels UNIQUEMENT :
- wordsup: mots qui montent depuis le bas — effet Apple classique
- wordsdown: mots qui descendent depuis le haut
- lettersup: lettres une par une depuis le bas — pour les mots courts
- lettersdown: lettres une par une depuis le haut
- wordsupblur: mots qui montent + blur qui disparaît — premium
- wordsinleft: mots qui arrivent depuis la gauche
- wordsright: mots qui entrent depuis la gauche et sortent vers la droite

RÈGLE DE SÉLECTION TEXTE :
- Phrase longue (5+ mots) → wordsup, wordsdown, wordsupblur, wordsinleft
- Mot court (1-3 mots) → lettersup, lettersdown, wordsright
- Moment fort → wordsupblur ou lettersup
- Alterner TOUJOURS les 7 types — jamais deux identiques consécutifs

NOUVELLES SCÈNES MORPHING :
- morphblur: wordA disparaît en blur, wordB apparaît depuis le blur — pour les contrastes forts
- morphscale: wordA rapetisse, wordB grandit depuis le centre — très impactant

UTILISATION MORPHING :
- Contraste/comparaison : wordA: "Lent.", wordB: "Rapide."
- Transformation : wordA: "Avant.", wordB: "Après."
- Révélation : wordA: "Complexe.", wordB: "Simple."
- Marque : wordA: "Cher.", wordB: "Gratuit."
- UNIQUEMENT sur des mots courts (1-3 mots max)
- durationFrames: 150 minimum pour laisser le temps au morphing
- Champs obligatoires : wordA, wordB (text optionnel = alias de wordA)

RÈGLES DONNÉES OBLIGATOIRES :
- counter → OBLIGATOIRE : counterTo (nombre entier > 0)
- progressbar → OBLIGATOIRE : counterTo (nombre entre 1 et 100)
- multistats → OBLIGATOIRE : stats (tableau de 3 objets avec value, label)
- socialstats → OBLIGATOIRE : counterTo (nombre > 0) + platform + statLabel
- checklist → OBLIGATOIRE : items (tableau de strings non vides)
- timeline → OBLIGATOIRE : steps (tableau avec number et label)
- morphblur/morphscale → OBLIGATOIRE : wordA et wordB (strings non vides)
- photoreveal/photocollage → OBLIGATOIRE : photoQuery (string en anglais)

SI TU N'AS PAS LES DONNÉES → utilise wordsup/wordsdown/lettersup à la place
JAMAIS de scène data sans ses données — c'est pire que de ne pas l'utiliser

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

UI : notification, uiprogress

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

RÈGLE COULEUR TEXTE ABSOLUE :
- Le texte principal est TOUJOURS blanc sur fond noir ou noir sur fond blanc
- JAMAIS un seul mot en couleur accent au milieu d'une phrase
- La couleur accent est réservée UNIQUEMENT pour :
  • Les scènes accentword (toute la phrase en accent)
  • Les scènes underline (ligne sous le texte)
  • Les éléments UI (boutons, barres, icônes)
  • Les chiffres dans counter/progressbar
- JAMAIS colorer un mot isolé dans une phrase normale

RÈGLE CONTRASTE ABSOLUE :
- JAMAIS accentColor similaire au bg
- Sur bg vert (#10B981) → texte BLANC (#ffffff) ou NOIR (#000000) uniquement
- Sur bg:#10B981 → accentColor: "#ffffff" pas "#0a7c54"
- Sur bg accent → le texte DOIT être blanc ou noir
- Règle : si bg est une couleur vive → texte blanc ou noir OBLIGATOIRE
- JAMAIS de texte coloré sur fond de même couleur

RÈGLE GEO ABSOLUE — SANS EXCEPTION :
- TOUTES les scènes DOIVENT avoir un champ "geo"
- Si tu oublies geo sur une scène → la vidéo sera rejetée
- Rotation obligatoire : dots → grid → circles → diagonal → cross → lines → perspective → radial → dots...
- JAMAIS deux geo identiques consécutifs
- geo s'applique sur TOUS les types de scènes sans exception
5. RÈGLE TEXTE PAR SCÈNE (extraits EXACTS du script original) :
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
- Au minimum 5 des 7 effets texte Apple (wordsup, wordsdown, lettersup, lettersdown, wordsupblur, wordsinleft, wordsright)
- 1 scène de stats ou chiffres (counter, multistats, progressbar, socialstats, bgnumber)
- 1 scène de liste (checklist, timeline, splitlines)
- 1 scène de forme ou ambiance (linedraw, shape, expandingshape, spotlight, audioviz)
- 1 scène de transition (iris, curtain, diagonalwipe, pixeldissolve, lightsweep, glitchswitch)
- 1 scène photo si photoQuery pertinent (photoreveal, photocollage)
- 1 scène mockup SI sujet web/app (iphone, browser, macbook, dashboard)
- 1 scène accent (accentword, underline, gradienttext, twolines)
- 1 scène CTA finale (lettersup ou wordsup fort)

FONDS — rotation stricte sur chaque scène :
bg:#ffffff → bg:#000000 → bg:${accent} → bg:#ffffff → bg:#000000 → bg:${accent}...

GEO — jamais deux fois le même consécutivement :
dots → grid → circles → diagonal → cross → lines → radial → perspective → dots...

FORMAT JSON STRICT :
{
  "scenes": [
    {
      "type": "wordsup",
      "text": "La musique change tout",
      "bg": "#000000",
      "accentColor": "${accent}",
      "geo": "dots",
      "durationFrames": 55
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
