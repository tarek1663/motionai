import { NextRequest, NextResponse } from "next/server";

type AlignmentPayload = {
  characters?: string[];
  character_start_times_seconds?: number[];
  character_end_times_seconds?: number[];
};

type PhraseTimestampPayload = {
  phrase?: string;
  startTime?: number;
  endTime?: number;
  startFrame?: number;
  endFrame?: number;
  durationFrames?: number;
};

const buildPhraseTimestampsFromAlignment = (
  script: string,
  alignment: AlignmentPayload,
  fps = 60,
) => {
  const characters = alignment.characters || [];
  const charStartTimes = alignment.character_start_times_seconds || [];
  const charEndTimes = alignment.character_end_times_seconds || [];
  const lines = script.split("\n").filter((l) => l.trim());

  let charIndex = 0;
  return lines
    .map((line) => {
      const cleanLine = line.trim();
      if (!cleanLine) return null;

      while (
        charIndex < characters.length &&
        typeof characters[charIndex] === "string" &&
        /\s/.test(characters[charIndex])
      ) {
        charIndex += 1;
      }

      const lineChars = cleanLine.replace(/\s/g, "").length;
      const startTime = charStartTimes[charIndex] || 0;

      let endCharIdx = charIndex;
      let charsFound = 0;
      while (endCharIdx < characters.length && charsFound < lineChars) {
        if (characters[endCharIdx] && characters[endCharIdx] !== " ") {
          charsFound += 1;
        }
        endCharIdx += 1;
      }

      const endTime =
        charEndTimes[Math.max(0, endCharIdx - 1)] || startTime + 1.5;
      charIndex = endCharIdx;

      const startFrame = Math.round(startTime * fps);
      const endFrame = Math.round(endTime * fps);

      return {
        phrase: cleanLine,
        startFrame,
        endFrame,
        durationFrames: Math.max(60, endFrame - startFrame),
      };
    })
    .filter(Boolean) as Array<{
    phrase: string;
    startFrame: number;
    endFrame: number;
    durationFrames: number;
  }>;
};

const normalizePhraseTimestamps = (
  phraseTimestamps: PhraseTimestampPayload[],
) =>
  phraseTimestamps.map((p) => {
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

    const alignment = (data.alignment || {}) as AlignmentPayload;
    const phraseTimestamps =
      script && alignment.characters?.length
        ? buildPhraseTimestampsFromAlignment(script, alignment)
        : normalizePhraseTimestamps(
            (data.phraseTimestamps as PhraseTimestampPayload[]) || [],
          );

    console.log(
      "🎙️ phraseTimestamps:",
      phraseTimestamps.map(
        (p) => `"${p.phrase.slice(0, 20)}" [${p.startFrame}-${p.endFrame}]`,
      ),
    );

    const totalDuration =
      data.durationSeconds ??
      data.duration ??
      (phraseTimestamps.length > 0
        ? phraseTimestamps[phraseTimestamps.length - 1].endFrame / 60
        : 30);

    return NextResponse.json({
      ...data,
      audioUrl: data.audioUrl,
      duration: totalDuration,
      durationSeconds: data.durationSeconds ?? totalDuration,
      phraseTimestamps,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur voix";
    console.error("Voice route error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
