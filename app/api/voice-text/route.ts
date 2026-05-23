import { NextRequest, NextResponse } from "next/server";
import { generateVoiceText } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { prompt, duration } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    const result = await generateVoiceText({ prompt, duration });
    // NextResponse.json(result) — voiceoverText, accentColor, bgAccent, bgLight, formatId, formatName
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Voice text error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
