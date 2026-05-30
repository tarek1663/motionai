import { NextRequest, NextResponse } from "next/server";

type WordTimestampPayload = {
  word?: string;
  start?: number;
  end?: number;
  startFrame?: number;
  endFrame?: number;
  durationFrames?: number;
};

type PhraseTimestampPayload = {
  phrase?: string;
  startTime?: number;
  endTime?: number;
  startFrame?: number;
  endFrame?: number;
  durationFrames?: number;
};

type PhraseTimestamp = {
  phrase: string;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

type WordTimestamp = {
  word: string;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

const normalizeWordTimestamps = (
  wordTimestamps: WordTimestampPayload[],
  fps = 60,
): WordTimestamp[] =>
  wordTimestamps.map((w) => {
    const startFrame =
      w.startFrame ?? Math.round((w.start ?? 0) * fps);
    const endFrame =
      w.endFrame ?? Math.round((w.end ?? 0) * fps);
    return {
      word: w.word ?? "",
      startFrame,
      endFrame,
      durationFrames: Math.max(
        20,
        w.durationFrames ?? endFrame - startFrame,
      ),
    };
  });

const normalizePhraseTimestamps = (
  phraseTimestamps: PhraseTimestampPayload[],
): PhraseTimestamp[] =>
  phraseTimestamps.map((p) => {
    const startFrame = p.startFrame ?? Math.round((p.startTime ?? 0) * 60);
    const endFromTime = p.endTime != null ? Math.round(p.endTime * 60) : null;
    const endFrame = p.endFrame ?? endFromTime ?? startFrame + 90;
    const durationFrames =
      p.durationFrames ??
      (p.startTime != null && p.endTime != null
        ? Math.max(40, Math.round((p.endTime - p.startTime) * 60))
        : Math.max(40, endFrame - startFrame));

    return {
      phrase: p.phrase ?? "",
      startFrame,
      endFrame,
      durationFrames,
    };
  });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const script = String(body.text || body.script || "").trim();

    let RENDER_URL = process.env.RENDER_SERVER_URL || "http://localhost:3001";

    if (!RENDER_URL.startsWith("http://") && !RENDER_URL.startsWith("https://")) {
      RENDER_URL = `https://${RENDER_URL}`;
    }

    console.log("🎙️ Voice URL:", `${RENDER_URL}/voice`);

    const res = await fetch(`${RENDER_URL}/voice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json(data, { status: 500 });

    const wordTimestamps = normalizeWordTimestamps(
      (data.wordTimestamps as WordTimestampPayload[]) || [],
    );

    const phraseTimestamps = normalizePhraseTimestamps(
      (data.phraseTimestamps as PhraseTimestampPayload[]) || [],
    );

    console.log(
      "🎙️ wordTimestamps:",
      wordTimestamps.slice(0, 5).map(
        (w) => `"${w.word}" [${w.startFrame}-${w.endFrame}]`,
      ),
    );

    const totalFrames =
      data.totalFrames ??
      (wordTimestamps.length > 0
        ? wordTimestamps[wordTimestamps.length - 1].endFrame
        : phraseTimestamps.length > 0
          ? phraseTimestamps[phraseTimestamps.length - 1].endFrame
          : Math.round((data.durationSeconds || 30) * 60));

    const totalDuration =
      data.durationSeconds ??
      data.duration ??
      totalFrames / 60;

    return NextResponse.json({
      ...data,
      audioUrl: data.audioUrl,
      script,
      duration: totalDuration,
      durationSeconds: data.durationSeconds ?? totalDuration,
      wordTimestamps,
      phraseTimestamps,
      totalFrames,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur voix";
    console.error("Voice route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
