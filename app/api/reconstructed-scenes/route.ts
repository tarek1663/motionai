import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const {
      productName,
      accentColor,
      mockupType,
      voiceoverText,
      audioDuration,
      phraseTimestamps,
      componentCode,
      photoUrl,
    } = await req.json();

    const fps = 60;
    let phrases: string[] = [];
    let sceneDurations: number[] = [];

    if (phraseTimestamps && phraseTimestamps.length > 0) {
      phrases = phraseTimestamps
        .map((pt: { phrase?: string; text?: string }) =>
          (pt.phrase || pt.text || "").trim(),
        )
        .filter((p: string) => p.length > 0);

      sceneDurations = phraseTimestamps.map(
        (pt: {
          durationFrames?: number;
          startFrame?: number;
          endFrame?: number;
          start?: number;
          end?: number;
        }) => {
          const dur =
            pt.durationFrames ??
            (pt.endFrame != null && pt.startFrame != null
              ? pt.endFrame - pt.startFrame
              : pt.end != null && pt.start != null
                ? Math.round((pt.end - pt.start) * fps)
                : Math.round((audioDuration * fps) / phraseTimestamps.length));
          return Math.max(80, Math.min(400, dur));
        },
      );

      console.log(
        "✅ Utilisation phraseTimestamps ElevenLabs:",
        phrases.length,
        "phrases",
      );
      console.log("📐 Phrases:", phrases.slice(0, 3));
      console.log("📐 Durées:", sceneDurations.slice(0, 3));
    } else {
      console.log("⚠️ Pas de phraseTimestamps — fallback découpage manuel");
      phrases = (voiceoverText || "")
        .split(/[\n.!?]+/)
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 3);
      const dur = Math.round(
        (audioDuration * fps) / Math.max(phrases.length, 1),
      );
      sceneDurations = phrases.map(() => dur);
    }

    const nbScenes = phrases.length;
    if (nbScenes === 0) {
      return NextResponse.json({ error: "Aucune phrase trouvée" }, { status: 400 });
    }

    const accent = accentColor || "#7C3AED";
    const lum =
      (parseInt(accent.replace("#", "").slice(0, 2) || "7C", 16) / 255) * 0.299 +
      (parseInt(accent.replace("#", "").slice(2, 4) || "3A", 16) / 255) * 0.587 +
      (parseInt(accent.replace("#", "").slice(4, 6) || "ED", 16) / 255) * 0.114;

    const uiPositions = new Set(
      [1, Math.floor(nbScenes / 2)].filter((p) => p < nbScenes && p > 0),
    );

    const bgCycle = ["#0a0a0a", accent, "#ffffff"];

    const scenes = phrases.map((phrase: string, i: number) => {
      const isFirst = i === 0;
      const isLast = i === nbScenes - 1;
      const isUI = uiPositions.has(i);
      const bg = bgCycle[i % 3];

      if (isFirst) {
        return {
          type: "glitch",
          text: productName || phrase,
          text2: phrase,
          bg: "#0a0a0a",
          accentColor: accent,
        };
      }

      if (isLast) {
        return {
          type: "cta",
          text: phrase,
          text2: "Essayer maintenant",
          bg: accent,
          accentColor: lum > 0.4 ? "#0a0a0a" : "#ffffff",
        };
      }

      if (isUI) {
        return {
          type: "generatedui",
          text: phrase,
          bg: "#0a0a0a",
          accentColor: accent,
          componentCode,
          photoUrl,
          mockupType: mockupType || "browser",
        };
      }

      const richTypes = [
        "particles",
        "zoompunch",
        "burst",
        "highlight",
        "word",
        "split",
        "kinetic",
        "numbers",
        "mirror",
      ];
      const t = richTypes[i % richTypes.length];

      return {
        type: t,
        text: phrase,
        text2: i % 4 === 0 ? productName : undefined,
        bg,
        accentColor: accent,
      };
    });

    return NextResponse.json({ scenes, sceneDurations });
  } catch (err: unknown) {
    console.error("Reconstructed scenes error:", getErrorMessage(err));
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
