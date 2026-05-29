import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
    const { script, format, accentColor } = await req.json();
    const accent = accentColor || "#7C3AED";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{
        role: "user",
        content: `L'utilisateur a écrit ce texte qu'il veut transformer en vidéo :
"${script}"

FORMAT: ${format} | COULEUR ACCENT: ${accent}

ÉTAPE 1 — Découpe le texte en phrases courtes (garde tout le contenu, ne résume pas).
ÉTAPE 2 — Génère une scène par phrase selon les règles du system prompt.

Réponds UNIQUEMENT en JSON valide sans markdown :
{
  "restructuredScript": "phrase 1\\nphrase 2\\nphrase 3",
  "scenes": [ ... ],
  "musicUrl": null
}`,
      }],
    });

    const content = response.content[0].type === "text" ? response.content[0].text : "";
    const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const data = JSON.parse(clean);
    const restructuredScript =
      typeof data.restructuredScript === "string" && data.restructuredScript.trim()
        ? data.restructuredScript.replace(/\r\n/g, "\n").trim()
        : script;
    const restructuredLines = restructuredScript
      .split("\n")
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0);
    const rawScenes = Array.isArray(data.scenes) ? data.scenes : [];
    const sceneCount = Math.max(restructuredLines.length, rawScenes.length);

    const scenes = Array.from({ length: sceneCount }, (_, index) => {
      const source = rawScenes[index] ?? {};
      const fallbackText = restructuredLines[index] || restructuredLines[restructuredLines.length - 1] || script;
      const rawText = typeof source.text === "string" ? source.text : fallbackText;

      return {
        ...source,
        type: typeof source.type === "string" && source.type.trim() ? source.type : "sentence",
        text: rawText.trim() ? rawText : "",
        text2: typeof source.text2 === "string" ? source.text2 : "",
        bg: typeof source.bg === "string" && source.bg.trim() ? source.bg : "#0a0a0a",
        accentColor:
          typeof source.accentColor === "string" && source.accentColor.trim()
            ? source.accentColor
            : accent,
      };
    });
    const MIN_SCENE_FRAMES = 120;
    let frameCursor = 0;
    const sceneDurations = scenes.map(() => {
      const startFrame = frameCursor;
      const durationFrames = MIN_SCENE_FRAMES;
      frameCursor += durationFrames;
      return {
        startFrame,
        endFrame: frameCursor,
        durationFrames,
      };
    });

    console.log("📝 Script lines:", restructuredLines.length);
    console.log("🎬 Scenes generated:", data.scenes?.length);
    console.log("📜 Restructured:", restructuredScript);

    return NextResponse.json({
      scenes,
      sceneDurations,
      restructuredScript,
      musicUrl: data.musicUrl || null,
    });
  } catch (err: any) {
    console.error("Script scenes error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
