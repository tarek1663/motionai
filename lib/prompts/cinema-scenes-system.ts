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

/** Prompt contextuel — analyse phrase par phrase du script voix */
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
DONNÉES RÉELLES : ${JSON.stringify(researchData.keyStats)}
FAITS : ${researchData.keyFacts.join(" | ")}

═══════════════════════════════════════════════════════
SYSTÈME DE RÈGLES CONTEXTUELLES
═══════════════════════════════════════════════════════

Pour chaque phrase du script voix, analyse le contenu et applique ces règles :

RÈGLE CHIFFRE/STAT :
→ Si la voix mentionne un nombre, pourcentage, montant
→ Utilise OBLIGATOIREMENT : counter, progressbar, multistats, ou socialstats
→ Avec la vraie valeur numérique exacte (counterTo = nombre entier, jamais string)
→ Exemple : "750 millions d'utilisateurs" → counter avec counterTo: 750000000

RÈGLE LIEU/ÉPOQUE :
→ Si la voix mentionne un pays, ville, année, époque
→ Utilise OBLIGATOIREMENT : photoreveal avec photoQuery précis en anglais
→ Exemple : "1964 Oregon" → photoreveal avec photoQuery: "1960s Oregon track field athletics vintage"

RÈGLE ÉNERGIE/ACTION :
→ Si la voix parle d'action, mouvement, sport, performance
→ Utilise OBLIGATOIREMENT : emojiburst ou emoji avec emojis cohérents
→ Exemple : "Nike accompagne les athlètes" → emojiburst emojis: ["👟","🏃","💪","🏆","⚡"]

RÈGLE COMPARAISON/CONTRASTE :
→ Si la voix fait une comparaison, transformation, évolution
→ Utilise OBLIGATOIREMENT : morphblur ou morphscale
→ Exemple : "De startup à empire" → morphscale wordA: "Startup." wordB: "Empire."

RÈGLE LISTE/FEATURES :
→ Si la voix énumère des caractéristiques, avantages, étapes
→ Utilise OBLIGATOIREMENT : checklist ou timeline
→ Exemple : "Script, voix, animations" → checklist items: ["Script IA", "Voix naturelle", "Animations premium"]

RÈGLE MOT CLÉ FORT :
→ Si la voix prononce LE mot le plus important de la vidéo
→ Utilise OBLIGATOIREMENT : lettersup ou lettersdown
→ Texte = ce mot uniquement, très grand

RÈGLE PHRASE COURTE (2-4 mots) :
→ wordsup, wordsdown, wordsupblur selon l'énergie
→ Énergique → wordsupblur
→ Calme → wordsdown
→ Standard → wordsup

RÈGLE PHRASE LONGUE (5+ mots) :
→ wordsinleft ou wordsright
→ Jamais afficher toute la phrase — résumer en 4 mots max

RÈGLE PERSONNES/CÉLÉBRITÉS :
→ Si la voix mentionne une personne, célébrité, athlète
→ Utilise photoreveal avec photoQuery incluant le nom
→ Exemple : "Michael Jordan" → photoreveal photoQuery: "Michael Jordan basketball 1984 court"

RÈGLE TRANSITION ENTRE ACTES :
→ Entre chaque acte narratif
→ Utilise iris, curtain, ou diagonalwipe
→ durationFrames: 45 maximum

RÈGLE AMBIANCE PREMIUM :
→ Sur les moments d'émotion forte ou de révélation
→ Utilise particles
→ Accompagné d'un texte court

RÈGLE MOCKUP :
→ Si le sujet est une app, site, SaaS, service digital
→ Utilise iphone, browser, ou dashboard
→ Avec websiteUrl et contenu contextuel

═══════════════════════════════════════════════════════
RÈGLES ABSOLUES
═══════════════════════════════════════════════════════

1. MAX 30% de scènes texte pur — le reste doit être visuel
2. JAMAIS deux scènes texte consécutives — toujours intercaler un visuel
3. JAMAIS sous-titrer la voix — illustrer et ponctuer
4. Texte = 1 à 4 mots MAX par scène
5. accentColor = ${accent} partout
6. geo différent sur chaque scène
7. Alterner bg:#000000 → bg:#ffffff → bg:${accent}
8. Arc narratif en 4 actes obligatoire
9. photoreveal/photocollage sur au moins 4 scènes
10. counter/stats sur tous les chiffres mentionnés
11. durationFrames selon le type :
    - lettersup/down : 70-80
    - wordsup/down/blur : 80-100
    - wordsinleft/right : 90-110
    - counter/stats : 150-180
    - photoreveal/collage : 180-200
    - emoji/emojiburst : 100-130
    - morphblur/scale : 150-160
    - transitions : 40-50
    - particles : 100-120

RÈGLES DONNÉES OBLIGATOIRES :
- counter → counterTo nombre entier > 0
- progressbar → counterTo entre 1 et 100
- multistats → stats[] avec value NOMBRE + label
- morphblur/morphscale → wordA + wordB obligatoires
- photoreveal/photocollage → photoQuery en anglais
SI DONNÉES MANQUANTES → wordsup/lettersup, jamais counter vide

═══════════════════════════════════════════════════════
FORMAT JSON STRICT
═══════════════════════════════════════════════════════

Analyse le script phrase par phrase et génère les scènes selon les règles contextuelles.
Réponds UNIQUEMENT en JSON valide :
{
  "scenes": [...]
}`;

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
