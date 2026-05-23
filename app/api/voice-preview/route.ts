import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { generateVoice } from "@/lib/elevenlabs";
import { VOICES, DEFAULT_VOICE_ID } from "@/lib/voices";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { voiceId } = await req.json();
    const id = typeof voiceId === "string" && voiceId ? voiceId : DEFAULT_VOICE_ID;
    const voice = VOICES.find((v) => v.id === id);
    const text = voice?.previewText?.trim() || "Bonjour, voici un aperçu de cette voix.";

    const previewDir = path.join(process.cwd(), "public", "audio", "previews");
    const previewPath = path.join(previewDir, `${id}.mp3`);
    fs.mkdirSync(previewDir, { recursive: true });

    if (!fs.existsSync(previewPath)) {
      await generateVoice(text, previewPath, id);
    }

    return NextResponse.json({
      audioUrl: `/audio/previews/${id}.mp3`,
    });
  } catch (err: unknown) {
    console.error("Voice preview error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
