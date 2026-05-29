import { NextRequest, NextResponse } from "next/server";
import { generateVoiceText } from "@/lib/claude";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  console.log("🔑 Key exists:", !!process.env.ANTHROPIC_API_KEY);
  console.log("🔑 Key prefix:", process.env.ANTHROPIC_API_KEY?.slice(0, 15));
  try {
    const { prompt, duration, mode, customScript } = await req.json();

    if (mode === "script" && customScript?.trim()) {
      const script = customScript.trim();
      return NextResponse.json({
        script,
        voiceoverText: script,
        lines: script.split("\n").filter((l: string) => l.trim()),
      });
    }

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const durationSec = String(duration || "30");
    const sec = parseInt(durationSec, 10) || 30;
    const targetScenes =
      sec <= 15 ? 9 : sec <= 30 ? 18 : sec <= 45 ? 26 : 33;
    console.log(
      "🎙️ voice-text duration:",
      durationSec,
      "s —",
      targetScenes,
      "lignes cible",
    );
    const result = await generateVoiceText({ prompt, duration: durationSec });
    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Voice text error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
