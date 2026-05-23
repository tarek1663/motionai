import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateVoiceText, generateScenesFromVoice } from "@/lib/claude";
import { generateAllClips } from "@/lib/seedance";
import { generateVoice } from "@/lib/elevenlabs";
import { renderFinalVideo } from "@/lib/renderer";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const CREDIT_COSTS: Record<string, number> = {
  "30": 20,
  "60": 35,
  "120": 60,
};

type GenerateBody = {
  prompt?: string;
  format?: string;
  style?: string;
  duration?: string;
  musicMode?: string;
  musicMood?: string;
  userId?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GenerateBody;
  const { prompt, format, style, duration, musicMode, musicMood } = body;
  const userId = body.userId || "test-user";

  if (!prompt?.trim()) return NextResponse.json({ error: "Prompt requis" }, { status: 400 });

  const safeFormat = format ?? "9:16";
  const safeStyle = style ?? "dynamic";
  const safeDuration = duration ?? "60";
  const safeMusicMode = musicMode ?? "auto";

  const creditCost = CREDIT_COSTS[safeDuration] || 35;

  let user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    user = await prisma.user.create({ data: { id: userId, credits: 50 } });
  }

  const job = await prisma.job.create({
    data: {
      id: uuidv4(),
      userId,
      status: "scripting",
      progress: 5,
      prompt: prompt!,
      format: safeFormat,
      style: safeStyle,
      duration: safeDuration,
      musicMode: safeMusicMode,
      musicMood: musicMood || "epic",
      creditsUsed: creditCost,
    },
  });

  runPipeline(job.id, userId, body, creditCost).catch(console.error);

  return NextResponse.json({ jobId: job.id, creditCost });
}

async function runPipeline(
  jobId: string,
  userId: string,
  params: GenerateBody,
  creditCost: number
) {
  const update = (data: Prisma.JobUpdateInput) =>
    prisma.job.update({ where: { id: jobId }, data });

  try {
    await update({ status: "scripting", progress: 10 });
    const safeFormat =
      params.format === "16:9"
        ? "16:9"
        : params.format === "1:1"
          ? "1:1"
          : "9:16";
    const safeDuration = params.duration ?? "60";

    const generated = await generateVoiceText({
      prompt: params.prompt ?? "",
      duration: safeDuration,
    });

    const voicePath = path.join(process.env.TMP_DIR || "/tmp/motionai", jobId, "narration.mp3");
    const voiceResult = await generateVoice(String(generated.voiceoverText ?? ""), voicePath);

    const scenesResult = await generateScenesFromVoice({
      prompt: params.prompt ?? "",
      voiceoverText: generated.voiceoverText,
      audioDuration: Number(voiceResult.duration) || parseInt(safeDuration, 10),
      format: safeFormat,
      accentColor: generated.accentColor,
      bgLight: generated.bgLight,
      bgAccent: generated.bgAccent,
      phraseTimestamps: voiceResult.phraseTimestamps,
      formatId: generated.formatId,
    });

    const clipScenes = scenesResult.scenes.map((scene, i) => ({
      id: `scene-${i + 1}`,
      visualPrompt: `${params.prompt ?? "motion design"} — ${String(scene.text ?? scene.type ?? "")}`,
      narration: generated.voiceoverText,
    }));

    const script = {
      title: (params.prompt ?? "").slice(0, 50),
      voiceoverText: generated.voiceoverText,
      accentColor: generated.accentColor,
      formatId: generated.formatId,
      formatName: generated.formatName,
      remotionScenes: scenesResult.scenes,
      sceneDurations: scenesResult.sceneDurations,
      remotionCode: "",
      scenes: clipScenes,
    };
    await update({
      status: "visual",
      progress: 20,
      scriptJson: JSON.parse(JSON.stringify(script)) as Prisma.InputJsonValue,
    });

    const clipUrls = await generateAllClips(
      script.scenes,
      safeFormat,
      async (done: number, total: number) => {
        const progress = 20 + Math.round((done / total) * 45);
        await update({ progress });
      }
    );
    await update({ status: "voice", progress: 65, sceneClipUrls: clipUrls });
    await update({ status: "rendering", progress: 75 });

    await renderFinalVideo({
      jobId,
      clipUrls,
      voicePath,
    });

    const videoUrl = `/api/preview/${jobId}`;

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: creditCost } },
    });

    await update({ status: "done", progress: 100, videoUrl });
  } catch (err: unknown) {
    console.error("Pipeline error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    await update({ status: "error", errorMessage: message });
  }
}
