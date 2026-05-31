import Anthropic from "@anthropic-ai/sdk";

export type LineByLineResearch = {
  keyStats?: Array<{ value: string; label: string; raw?: number }>;
  keyFacts?: string[];
};

export const splitScriptIntoLines = (script: string): string[] => {
  const byNewline = script
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (byNewline.length > 1) return byNewline;

  return script
    .split(/(?<=[.!?])\s+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
};

export const buildLineByLineScenesPrompt = (
  scriptLines: string[],
  accent: string,
  researchData: LineByLineResearch = {},
  emojis: string[] = [],
): string => `Tu es le meilleur directeur artistique motion design.

SCRIPT EXACT ligne par ligne :
${scriptLines.map((line, i) => `${i + 1}. "${line}"`).join("\n")}

COULEUR ACCENT : ${accent}
DONNÉES : ${JSON.stringify(researchData.keyStats || [])}
FAITS : ${(researchData.keyFacts || []).join(" | ")}
EMOJIS SUGGÉRÉS : ${emojis.join(", ") || "✨,🚀,💡,⚡,🔥"}

Ta mission : génère EXACTEMENT ${scriptLines.length} scènes — UNE par ligne du script.

RÈGLES :
- Scène i illustre la ligne i — dans le même ordre
- Le champ "text" = version courte de la ligne (max 4 mots)
- La scène ILLUSTRE ce que la voix dit — pas sous-titre
- Ligne avec chiffre → counter ou progressbar (counterTo = nombre entier)
- Ligne avec action/énergie → emojiburst ou emoji
- Ligne avec lieu/personne → photoreveal avec photoQuery en anglais
- Ligne de comparaison → morphblur ou morphscale (wordA + wordB)
- Ligne courte forte → lettersup ou lettersdown
- Ligne normale → wordsup, wordsdown, wordsupblur, wordsinleft, wordsright
- Toujours varier les types — jamais deux identiques consécutifs
- accentColor = ${accent} partout
- Alterner bg:#000000 → bg:#ffffff → bg:${accent}
- geo différent sur chaque scène — rotation : dots, grid, circles, diagonal, cross, lines, radial, perspective
- durationFrames selon le type :
  lettersup/down: 70-90
  wordsup/blur/left/right: 80-110
  counter/stats: 150-180
  photo: 180-200
  emoji/burst: 110-140
  morph: 150-170
  particles: 110-130
  transitions: 40-50

IMPORTANT : le JSON doit avoir EXACTEMENT ${scriptLines.length} scènes dans le même ordre que les lignes.

FORMAT :
{
  "scenes": [
    { "type": "lettersup", "text": "Nike.", "bg": "#000000", "accentColor": "${accent}", "geo": "dots", "durationFrames": 80 }
  ]
}

Réponds UNIQUEMENT en JSON valide.`;

const extractTextContent = (content: Anthropic.Message["content"]): string =>
  content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");

const parseScenesJson = (text: string): { scenes?: Array<Record<string, unknown>> } => {
  const clean = text.replace(/```json|```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) return {};
  return JSON.parse(match[0]) as { scenes?: Array<Record<string, unknown>> };
};

export async function generateScenesLineByLine(
  client: Anthropic,
  params: {
    script: string;
    accent: string;
    researchData?: LineByLineResearch;
    emojis?: string[];
  },
): Promise<Array<Record<string, unknown>>> {
  const scriptLines = splitScriptIntoLines(params.script);
  if (scriptLines.length === 0) {
    throw new Error("Script vide");
  }

  console.log("📝 Script lines:", scriptLines);

  const prompt = buildLineByLineScenesPrompt(
    scriptLines,
    params.accent,
    params.researchData,
    params.emojis,
  );

  const scenesResponse = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 6000,
    messages: [{ role: "user", content: prompt }],
  });

  const scenesText = extractTextContent(scenesResponse.content);
  let data: { scenes?: Array<Record<string, unknown>> };

  try {
    data = parseScenesJson(scenesText);
  } catch {
    const fixResponse = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 6000,
      messages: [
        {
          role: "user",
          content: `Corrige ce JSON invalide (exactement ${scriptLines.length} scènes) :\n${scenesText.slice(0, 4000)}\nRetourne UNIQUEMENT le JSON valide.`,
        },
      ],
    });
    data = parseScenesJson(extractTextContent(fixResponse.content));
  }

  let scenes = data.scenes || [];

  if (scenes.length !== scriptLines.length) {
    console.warn(
      `⚠️ Scene count mismatch: got ${scenes.length}, expected ${scriptLines.length}`,
    );
    if (scenes.length > scriptLines.length) {
      scenes = scenes.slice(0, scriptLines.length);
    }
  }

  return scenes.map((scene, i) => ({
    ...scene,
    accentColor: params.accent,
    lineIndex: i,
    voiceLine: scriptLines[i],
  }));
}
