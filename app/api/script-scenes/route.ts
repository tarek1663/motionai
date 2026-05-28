import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildPremiumSceneSystemPrompt } from "@/lib/prompts/motion-scenes-system";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { script, format, accentColor } = await req.json();
    const accent = accentColor || "#7C3AED";
    const systemPrompt = buildPremiumSceneSystemPrompt(accent);

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
    const MIN_SCENE_FRAMES = 90;
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
