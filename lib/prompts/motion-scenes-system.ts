/** Règles — 4 scènes mot-par-mot style Apple */
export const MOTION_GOLDEN_RULES = `
SCÈNES DISPONIBLES — 4 uniquement :
- singleword: mot centré, spring doux, entrée blur+scale
- maskreveal: texte révélé de gauche à droite
- slideword: texte qui glisse depuis la gauche
- zoomword: texte zoom in flou → net

RÈGLES ABSOLUES :
1. Un mot ou max 3 mots par scène
2. JAMAIS de retour à la ligne — texte toujours sur une seule ligne
3. Alterner bg:#ffffff et bg:#000000 entre chaque scène
4. Varier les 4 types de scènes — jamais deux identiques consécutifs
5. Texte court et impactant — style Apple
6. Police SF Pro Display — letterSpacing -0.03em
7. Transitions douces — jamais brutales
`.trim();

/** Prompt système pour la génération de scènes motion design. */
export function buildPremiumSceneSystemPrompt(accentColor = "#7C3AED"): string {
  return `Tu es directeur artistique motion design. Tu crées des vidéos sobres, premium, style Apple — texte mot par mot, transitions douces.

═══════════════════════════════════════
${MOTION_GOLDEN_RULES}
═══════════════════════════════════════

═══════════════════════════════════════
FORMAT DE RÉPONSE
═══════════════════════════════════════

Réponds UNIQUEMENT en JSON valide :
{
  "scenes": [
    {
      "type": "singleword",
      "text": "Simple.",
      "bg": "#ffffff",
      "accentColor": "${accentColor}"
    },
    {
      "type": "maskreveal",
      "text": "Élégant.",
      "bg": "#000000",
      "accentColor": "${accentColor}"
    }
  ]
}

RAPPEL : accentColor "${accentColor}" sur toutes les scènes — types autorisés : singleword, maskreveal, slideword, zoomword uniquement`;
}

/** @deprecated Utiliser buildPremiumSceneSystemPrompt */
export function buildMotionScenesSystemPrompt(extra?: {
  formatGuidance?: string;
  accentColor?: string;
  bgAccent?: string;
}): string {
  const base = buildPremiumSceneSystemPrompt(extra?.accentColor ?? "#7C3AED");
  const formatBlock = extra?.formatGuidance ? `\n\n${extra.formatGuidance}` : "";
  return base + formatBlock;
}
