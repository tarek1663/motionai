export type CinemaResearchData = {
  keyStats: Array<{ value: string; label: string; raw?: number }>;
  keyFacts: string[];
  tagline: string;
};

const DEFAULT_RESEARCH: CinemaResearchData = {
  keyStats: [],
  keyFacts: [],
  tagline: "",
};

/** Diversité forcée — toutes les animations obligatoires par vidéo */
export const buildContextualScenePrompt = (
  prompt: string,
  script: string,
  durationSeconds: number,
  accent: string,
  researchData: CinemaResearchData = DEFAULT_RESEARCH,
): string => `Tu es le meilleur directeur artistique au monde.

SUJET : "${prompt}"
SCRIPT VOIX : "${script}"
DURÉE : ${durationSeconds}s
COULEUR ACCENT : ${accent}
DONNÉES : ${JSON.stringify(researchData.keyStats)}
FAITS : ${researchData.keyFacts.join(" | ")}

═══════════════════════════════════════════════════════
SCÈNES OBLIGATOIRES — TU DOIS TOUTES LES UTILISER
═══════════════════════════════════════════════════════

Pour chaque vidéo tu DOIS inclure EXACTEMENT ces types dans cet ordre approximatif :

ACTE 1 — ACCROCHE (15%) :
✅ lettersup OU lettersdown — premier mot fort
✅ emojiburst — avec emojis cohérents au sujet

ACTE 2 — CONTEXTE (35%) :
✅ photoreveal — photo contextuelle avec photoQuery précis en anglais
✅ counter — avec vraie valeur numérique si disponible
✅ morphscale OU morphblur — wordA/wordB contrastés
✅ wordsupblur OU wordsinleft — phrase courte impactante

ACTE 3 — IMPACT (35%) :
✅ photoreveal OU photocollage — 2ème visuel fort
✅ multistats OU progressbar — données chiffrées
✅ particles — moment premium
✅ iris OU curtain OU diagonalwipe — transition entre actes

ACTE 4 — CONCLUSION (15%) :
✅ morphblur OU morphscale — transformation finale
✅ lettersdown OU wordsright — mot final fort

TOTAL MINIMUM : 12 scènes — MAXIMUM : 20 scènes

═══════════════════════════════════════════════════════
RÈGLES CONTEXTUELLES
═══════════════════════════════════════════════════════

EMOJIS — choisis selon le sujet :
- Sport/Nike → ["👟","🏃","💪","🏆","⚡"]
- Tech/IA → ["🤖","💡","🚀","⚡","🔮"]
- Music/Spotify → ["🎵","🎧","🎶","🎤","🎸"]
- Food → ["🍕","🍔","🌮","🍜","🥗"]
- Finance → ["💰","📈","💎","🏦","💳"]
- Luxe → ["💎","👑","✨","🥂","🌟"]
- Nature → ["🌿","🌍","💚","🌱","☀️"]

PHOTOS — photoQuery en anglais très descriptif :
- Sport → "athlete running track stadium dramatic lighting"
- Tech → "modern office technology startup team working"
- Music → "concert stage lights crowd music festival"
- Finance → "financial district skyscrapers city night"
- Food → "gourmet restaurant food plating professional"

MORPHING — contrastes forts et pertinents :
- Évolution → wordA: "Avant." wordB: "Après."
- Croissance → wordA: "Petit." wordB: "Grand."
- Impact → wordA: "Hier." wordB: "Aujourd'hui."
- Marque → wordA: "Startup." wordB: "Empire."
- Prix → wordA: "Cher." wordB: "Simple."

═══════════════════════════════════════════════════════
RÈGLES ABSOLUES
═══════════════════════════════════════════════════════

1. accentColor = ${accent} sur TOUTES les scènes
2. Alterner bg:#000000 → bg:#ffffff → bg:${accent}
3. geo différent sur chaque scène — rotation : dots→grid→circles→diagonal→cross→lines→radial→perspective
4. JAMAIS deux types identiques consécutifs
5. Texte MAX 4 mots par scène texte
6. JAMAIS sous-titrer la voix — illustrer
7. counterTo = nombre entier exact — JAMAIS string
8. durationFrames :
   - lettersup/down : 70-90
   - wordsup/blur/left/right : 80-110
   - counter/stats : 150-180
   - photoreveal/collage : 180-200
   - emoji/emojiburst : 110-140
   - morphblur/scale : 150-170
   - particles : 110-130
   - transitions : 40-50

FORMAT JSON :
{
  "scenes": [
    {
      "type": "lettersup",
      "text": "Nike.",
      "bg": "#000000",
      "accentColor": "${accent}",
      "geo": "dots",
      "durationFrames": 80
    }
  ]
}

Réponds UNIQUEMENT en JSON valide.`;

/** @deprecated Alias — script-scenes sans voix séparée */
export const buildCinemaSystemPrompt = (
  prompt: string,
  durationSeconds: number,
  accent: string,
  researchData: CinemaResearchData = DEFAULT_RESEARCH,
  extraContext = "",
): string =>
  buildContextualScenePrompt(
    prompt,
    extraContext || prompt,
    durationSeconds,
    accent,
    researchData,
  );
