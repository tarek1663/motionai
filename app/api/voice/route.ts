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

type PhraseTimestamp = {
  phrase: string;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

const buildPhraseTimestampsFromAlignment = (
  script: string,
  alignment: AlignmentPayload,
  fps = 60,
): PhraseTimestamp[] => {
  const characters = alignment.characters || [];
  const charStartTimes = alignment.character_start_times_seconds || [];
  const charEndTimes = alignment.character_end_times_seconds || [];

  const fullText = characters.join("");

  const lines = script
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  console.log("🎙️ Lines to sync:", lines);
  console.log("🎙️ Total characters:", characters.length);

  const phraseTimestamps: PhraseTimestamp[] = [];
  let searchStart = 0;

  for (const line of lines) {
    const cleanLine = line.replace(/[.,!?;:]/g, "").toLowerCase();
    const cleanFull = fullText.replace(/[.,!?;:]/g, "").toLowerCase();

    const pos = cleanFull.indexOf(
      cleanLine.slice(0, Math.min(10, cleanLine.length)),
      searchStart,
    );

    if (pos === -1) {
      const wordCount = line.split(" ").length;
      const estimatedDuration = wordCount * 0.4;
      const lastEnd =
        phraseTimestamps.length > 0
          ? phraseTimestamps[phraseTimestamps.length - 1].endFrame / fps
          : 0;

      phraseTimestamps.push({
        phrase: line,
        startFrame: Math.round(lastEnd * fps),
        endFrame: Math.round((lastEnd + estimatedDuration) * fps),
        durationFrames: Math.round(estimatedDuration * fps),
      });
      continue;
    }

    const startTime = charStartTimes[pos] || 0;
    const endPos = Math.min(pos + cleanLine.length, charEndTimes.length - 1);
    const endTime =
      charEndTimes[endPos] || startTime + line.split(" ").length * 0.4;

    phraseTimestamps.push({
      phrase: line,
      startFrame: Math.round(startTime * fps),
      endFrame: Math.round(endTime * fps),
      durationFrames: Math.max(40, Math.round((endTime - startTime) * fps)),
    });

    searchStart = pos + cleanLine.length;
  }

  console.log(
    "🎙️ phraseTimestamps:",
    phraseTimestamps.map(
      (p) =>
        `"${p.phrase.slice(0, 20)}" [${p.startFrame}-${p.endFrame}] ${p.durationFrames}f`,
    ),
  );

  return phraseTimestamps;
};

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

    const alignment = (data.alignment || {}) as AlignmentPayload;
    console.log(
      "🎙️ Raw alignment:",
      JSON.stringify(data.alignment || {}).slice(0, 500),
    );

    const phraseTimestamps =
      script && alignment.characters?.length
        ? buildPhraseTimestampsFromAlignment(script, alignment)
        : normalizePhraseTimestamps(
            (data.phraseTimestamps as PhraseTimestampPayload[]) || [],
          );

    console.log("🎙️ phraseTimestamps generated:", phraseTimestamps);

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
