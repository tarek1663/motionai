import { NextRequest, NextResponse } from "next/server";
import { generateScenesFromVoice } from "@/lib/claude";
import { buildPremiumSceneSystemPrompt, MOTION_GOLDEN_RULES } from "@/lib/prompts/motion-scenes-system";
import { getErrorMessage } from "@/lib/utils";

/** Prompt système — 4 scènes mot-par-mot */
export const scenesSystemPrompt = (accentColor = "#7C3AED") =>
  `${buildPremiumSceneSystemPrompt(accentColor)}\n\n${MOTION_GOLDEN_RULES}`;

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
    });

    const sceneDurations =
      Array.isArray(phraseTimestamps) &&
      phraseTimestamps.length === result.scenes.length
        ? phraseTimestamps.map((phrase: { startFrame: number; endFrame: number; durationFrames: number }) => ({
            startFrame: Math.round(phrase.startFrame),
            endFrame: Math.round(phrase.endFrame),
            durationFrames: Math.round(phrase.durationFrames),
          }))
        : result.sceneDurations;

    return NextResponse.json({
      ...result,
      sceneDurations,
    });
  } catch (err: unknown) {
    console.error("Scenes error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
