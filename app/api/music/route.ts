import { NextRequest, NextResponse } from "next/server";
import { detectMusicGenre, getMusicForMood } from "@/lib/music";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { prompt, formatId } = await req.json();
    const genre    = detectMusicGenre(prompt, formatId || "pub");
    const musicUrl = getMusicForMood(genre.mood);
    console.log("🎵 Genre:", genre.mood, "→", musicUrl);
    return NextResponse.json({ musicUrl, mood: genre.mood });
  } catch (err: unknown) {
    console.error("Music error:", getErrorMessage(err));
    return NextResponse.json({ musicUrl: null });
  }
}
