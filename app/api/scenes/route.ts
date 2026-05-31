import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { generateScenesFromVoice, generateScenesFromWordTimestamps } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const COLOR_MAP: Record<string, string> = {
  "🟢 Vert": "#10B981",
  "🟣 Violet": "#7C3AED",
  "🔵 Bleu": "#3B82F6",
  "🟡 Or": "#F59E0B",
  "🔴 Rouge": "#EF4444",
  "⚪ Blanc": "#ffffff",
  "🩷 Rose": "#EC4899",
  "🩵 Cyan": "#06B6D4",
};

type ResearchData = {
  brandColor: string | null;
  keyStats: Array<{ value: string; label: string; raw?: number }>;
  tagline: string;
  keyFacts: string[];
  concept: string;
};

type CreativePlan = {
  concept: string;
  arc: string;
  heroScene: string;
};

const DEFAULT_RESEARCH: ResearchData = {
  brandColor: null,
  keyStats: [],
  tagline: "",
  keyFacts: [],
  concept: "",
};

const DEFAULT_PLAN: CreativePlan = {
  concept: "",
  arc: "",
  heroScene: "",
};

const extractTextContent = (content: Anthropic.Message["content"]): string =>
  content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

const parseJsonFromText = <T>(text: string, fallback: T): T => {
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallback;
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return fallback;
  }
};

const resolveUserAccent = (accentColor?: string): string => {
  if (!accentColor) return "#10B981";
  if (COLOR_MAP[accentColor]) return COLOR_MAP[accentColor];
  if (accentColor.startsWith("#")) return accentColor;
  return "#10B981";
};

async function runWebResearch(subject: string): Promise<ResearchData> {
  const researchResponse = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2000,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
      },
    ],
    messages: [
      {
        role: "user",
        content: `Recherche des informations récentes et précises sur : "${subject}"

Tu dois trouver :
1. Les vrais chiffres clés (utilisateurs, revenus, stats)
2. Les dates importantes
3. Le tagline officiel
4. La couleur officielle de la marque (hex)
5. Les faits marquants récents

Réponds en JSON :
{
  "brandColor": "#hex couleur officielle de la marque",
  "keyStats": [
    { "value": "750M", "label": "utilisateurs actifs", "raw": 750000000 }
  ],
  "tagline": "tagline officiel",
  "keyFacts": ["fait 1", "fait 2"],
  "concept": "angle créatif en 5 mots"
}`,
      },
    ],
  });

  const parsed = parseJsonFromText<Partial<ResearchData>>(
    extractTextContent(researchResponse.content),
    {},
  );

  return {
    brandColor: parsed.brandColor ?? null,
    keyStats: Array.isArray(parsed.keyStats) ? parsed.keyStats : [],
    tagline: parsed.tagline ?? "",
    keyFacts: Array.isArray(parsed.keyFacts) ? parsed.keyFacts : [],
    concept: parsed.concept ?? "",
  };
}

async function runCreativePlan(
  subject: string,
  researchData: ResearchData,
  durationSec: number,
  accent: string,
): Promise<CreativePlan> {
  const planResponse = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Tu es directeur artistique senior.

SUJET : "${subject}"
CONCEPT : ${researchData.concept || "impact et dynamisme"}
DONNÉES RÉELLES : ${JSON.stringify(researchData.keyStats)}
FAITS : ${researchData.keyFacts.join(", ")}
DURÉE : ${durationSec}
COULEUR : ${accent}

Crée un plan créatif en 3 lignes :
1. Concept central (5 mots max)
2. Arc narratif (début → milieu → fin)
3. Scène la plus impactante

Réponds en JSON :
{
  "concept": "L'Empire du son",
  "arc": "Domination → Chiffres → Impact",
  "heroScene": "slot-machine 750M utilisateurs"
}`,
      },
    ],
  });

  return parseJsonFromText<CreativePlan>(
    extractTextContent(planResponse.content),
    {
      concept: researchData.concept || "",
      arc: "",
      heroScene: "",
    },
  );
}

const buildResearchContext = (
  researchData: ResearchData,
  plan: CreativePlan,
  accent: string,
): string => {
  const statsBlock =
    researchData.keyStats.length > 0
      ? researchData.keyStats
          .map(
            (s) =>
              `- ${s.label}: ${s.value}${s.raw !== undefined ? ` (raw: ${s.raw})` : ""}`,
          )
          .join("\n")
      : "- Utilise des faits vérifiables liés au sujet";

  return `
CONTEXTE RECHERCHE WEB (données réelles — ne jamais inventer de chiffres) :
CONCEPT : ${plan.concept || researchData.concept || "impact et dynamisme"}
ARC NARRATIF : ${plan.arc || "Accroche → Preuve → Impact"}
SCÈNE HÉRO : ${plan.heroScene || "moment le plus fort au milieu"}
TAGLINE OFFICIEL : ${researchData.tagline || "—"}
FAITS CLÉS : ${researchData.keyFacts.join(" | ") || "—"}
STATS À UTILISER :
${statsBlock}

RÈGLES DONNÉES RÉELLES :
- counterTo = valeur raw exacte quand disponible
- Dernière scène = tagline fort ou message CTA avec accentColor
- accentColor = ${accent} sur TOUTES les scènes
`;
};

const buildSystemPrompt = (
  userPrompt: string,
  duration: number,
  accent = "#10B981",
  researchData?: ResearchData,
  plan?: CreativePlan,
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

  const researchBlock =
    researchData && plan
      ? buildResearchContext(researchData, plan, accent)
      : "";

  return `Tu es le meilleur directeur artistique motion design au monde.

Pour le prompt "${userPrompt}", génère une vidéo motion design SPECTACULAIRE de ${duration} secondes.
${researchBlock}
COULEUR ACCENT : ${accent}
DURÉE : ${duration} secondes
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

RÈGLE PHOTOS OBLIGATOIRE :
- TOUJOURS inclure un champ "text" sur les scènes photo
- Le texte doit décrire ou commenter la photo
- JAMAIS de scène photo sans texte

RÈGLE COUNTER :
- counterTo DOIT être un nombre entier — jamais une string
- Exemples valides : counterTo: 750000000, counterTo: 98, counterTo: 17
- JAMAIS : counterTo: "750M" ou counterTo: null
- Si la valeur est inconnue → ne pas utiliser counter du tout
- counterTo doit être la valeur EXACTE à afficher — jamais arrondir
- Si c'est un prix → prefix: "€" ou "$" suffix: "" counterTo: 800 (pas 1000)
- Si c'est des utilisateurs → counterTo: 50000 suffix: "+"
- Si c'est un pourcentage → counterTo: 94 suffix: "%"
- stats[].value dans multistats : nombre entier uniquement, jamais de string

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
- Au minimum 5 des 7 effets texte Apple (wordsup, wordsdown, lettersup, lettersdown, wordsupblur, wordsinleft, wordsright)
- 1 scène de stats ou chiffres (counter, multistats, progressbar, socialstats, bgnumber)
- 1 scène de liste (checklist, timeline)
- 1 scène de forme ou ambiance (linedraw, shape, expandingshape, audioviz, gradient, noise)
- 1 scène de transition (iris, curtain, diagonalwipe, pixeldissolve, lightsweep, glitchswitch)
- 1 scène photo si photoQuery pertinent (photoreveal, photocollage)
- 1 scène mockup SI sujet web/app (iphone, browser, macbook, dashboard)
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

    const subject = String(prompt || voiceoverText).trim();
    const durationSec = Math.round(Number(audioDuration) || 30);
    const userColor = resolveUserAccent(accentColor);

    // ─── ÉTAPE 1 — RECHERCHE WEB + DÉTECTION COULEUR ───
    let researchData: ResearchData = { ...DEFAULT_RESEARCH };
    try {
      researchData = await runWebResearch(subject);
    } catch (err) {
      console.error("Research error:", err);
    }

    const accent = researchData.brandColor || userColor;
    console.log(
      "🎨 Accent color:",
      accent,
      "— Brand:",
      researchData.brandColor,
      "— User:",
      userColor,
    );

    // ─── ÉTAPE 2 — PLAN CRÉATIF ─────────────────────────
    let plan: CreativePlan = { ...DEFAULT_PLAN };
    try {
      plan = await runCreativePlan(subject, researchData, durationSec, accent);
    } catch (err) {
      console.error("Plan error:", err);
    }

    const researchContext = buildResearchContext(researchData, plan, accent);
    const useWordSync =
      Array.isArray(wordTimestamps) && wordTimestamps.length >= 3;

    // ─── ÉTAPE 3 — GÉNÉRATION SCÈNES ────────────────────
    const result = useWordSync
      ? await generateScenesFromWordTimestamps({
          prompt: `${subject}\n${researchContext}`,
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
          accentColor: accent,
          bgDark,
          bgLight,
          bgAccent,
          phraseTimestamps,
          formatId,
          systemPrompt: buildSystemPrompt(
            subject,
            durationSec,
            accent,
            researchData,
            plan,
          ),
        });

    const brandAccent = researchData.brandColor || accent;
    const scenesWithBrandColor = result.scenes.map((scene) => ({
      ...scene,
      accentColor: brandAccent,
    }));

    const RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";
    const PHOTO_TYPES = new Set(["photoreveal", "photocollage"]);

    const scenesWithPhotos = await Promise.all(
      scenesWithBrandColor.map(async (scene) => {
        if (!PHOTO_TYPES.has(String(scene.type))) return scene;

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
          scene.photoUrl || (await fetchPhoto(scene.photoQuery as string | undefined));
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
          durationFrames: Math.max(
            30,
            Math.round(fromScene.durationFrames || 72),
          ),
        };
      }

      if (fromScene.durationFrames && fromScene.durationFrames >= 40) {
        return {
          durationFrames: Math.min(150, Math.round(fromScene.durationFrames)),
        };
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
          durationFrames: Math.min(
            150,
            Math.max(40, Math.round(phrase.durationFrames)),
          ),
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
      researchData,
      plan,
      accent,
    });
  } catch (err: unknown) {
    console.error("Scenes error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
