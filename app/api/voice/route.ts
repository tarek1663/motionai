import { NextRequest, NextResponse } from "next/server";

type PhraseTimestampPayload = {
  phrase?: string;
  startTime?: number;
  endTime?: number;
  startFrame?: number;
  endFrame?: number;
  durationFrames?: number;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

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

    const phraseTimestamps = (
      (data.phraseTimestamps as PhraseTimestampPayload[]) || []
    ).map((p) => {
      const startFrame =
        p.startFrame ?? Math.round((p.startTime ?? 0) * 60);
      const endFromTime =
        p.endTime != null ? Math.round(p.endTime * 60) : null;
      const endFrame = p.endFrame ?? endFromTime ?? startFrame + 90;
      const durationFrames =
        p.durationFrames ??
        (p.startTime != null && p.endTime != null
          ? Math.max(60, Math.round((p.endTime - p.startTime) * 60))
          : Math.max(60, endFrame - startFrame));

      return {
        phrase: p.phrase ?? "",
        startFrame,
        endFrame,
        durationFrames,
      };
    });

    return NextResponse.json({
      ...data,
      audioUrl: data.audioUrl,
      duration: data.durationSeconds ?? data.duration,
      durationSeconds: data.durationSeconds,
      phraseTimestamps,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur voix";
    console.error("Voice route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
