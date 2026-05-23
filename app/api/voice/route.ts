import { NextRequest, NextResponse } from "next/server";
import { generateVoice } from "@/lib/elevenlabs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();
    console.log("🎙️ VoiceId reçu:", voiceId);
    if (!text?.trim()) return NextResponse.json({ error: "Texte requis" }, { status: 400 });

    const audioId = uuidv4();
    const audioDir = path.join(process.cwd(), "public", "audio");
    const audioPath = path.join(audioDir, `${audioId}.mp3`);
    fs.mkdirSync(audioDir, { recursive: true });

    const result = await generateVoice(text, audioPath, voiceId);
    const fps = 60;

    const phraseTimestamps = result.phraseTimestamps.map((t) => ({
      phrase: t.phrase || "",
      start: t.start,
      end: t.end,
      startFrame: t.startFrame ?? Math.round(t.start * fps),
      endFrame: t.endFrame ?? Math.round(t.end * fps),
      durationFrames:
        t.durationFrames ?? Math.max(80, Math.round((t.end - t.start) * fps)),
    }));

    return NextResponse.json({
      audioId,
      audioUrl: `/audio/${audioId}.mp3`,
      duration: result.duration,
      durationSeconds: result.duration,
      phraseTimestamps,
      wordTimestamps: result.wordTimestamps,
    });
  } catch (err: unknown) {
    console.error("Voice error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
