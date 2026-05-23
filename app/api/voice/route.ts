import { NextRequest, NextResponse } from "next/server";
import { generateVoice } from "@/lib/elevenlabs";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();
    console.log("🎙️ VoiceId reçu:", voiceId);
    if (!text?.trim()) return NextResponse.json({ error: "Texte requis" }, { status: 400 });

    const result = await generateVoice(text, undefined, voiceId);
    const fps = 60;

    const audioFileName = `${uuidv4()}.mp3`;

    const { error: uploadError } = await supabase.storage
      .from("audio")
      .upload(audioFileName, result.audioBuffer, {
        contentType: "audio/mpeg",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("audio")
      .getPublicUrl(audioFileName);

    const audioUrl = publicUrl;

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
      audioId: audioFileName.replace(".mp3", ""),
      audioUrl,
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
