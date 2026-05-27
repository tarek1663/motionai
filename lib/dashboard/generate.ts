import type { MutableRefObject } from "react";
import { colors } from "@/lib/colors";
import { durationToSeconds } from "./constants";
import { checkCreditsBeforeGenerate } from "./credits";
import { startRenderPoll } from "./render-poll";
import type { DashboardScreen, QualityMode } from "./types";

type GenerationCallbacks = {
  setProgress: (n: number | ((p: number) => number)) => void;
  setStatus: (s: string) => void;
  setFormatDetected: (s: string) => void;
  setError: (msg: string) => void;
  setScreen: (s: DashboardScreen) => void;
  setVideoUrl: (url: string) => void;
  onVideosRefresh: () => void;
  onCreditsRefresh?: () => void;
  onUpgradeRequired?: (reason: string) => void;
  onPipelineStart?: () => void;
  onPipelineEnd?: () => void;
  onRenderStarted?: (payload: { jobId: string; prompt: string }) => void;
};

function failPipeline(cb: GenerationCallbacks) {
  cb.onPipelineEnd?.();
  cb.setScreen("input");
}

function handleRenderError(
  res: Response,
  data: { error?: string; upgrade?: boolean },
  cb: GenerationCallbacks
): boolean {
  if (res.status === 403 && data.upgrade) {
    cb.onUpgradeRequired?.(data.error || "Limite atteinte");
    failPipeline(cb);
    return true;
  }
  if (!res.ok) {
    cb.setError(data.error || "Erreur de rendu");
    failPipeline(cb);
    return true;
  }
  return false;
}

type PromptParams = GenerationCallbacks & {
  prompt: string;
  duration: string;
  format: string;
  quality: QualityMode;
  selectedVoiceId: string;
  musicEnabled: boolean;
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>;
};

type ScreenshotParams = GenerationCallbacks & {
  file: File;
  intent: string;
  duration: string;
  format: string;
  quality: QualityMode;
  selectedVoiceId: string;
  musicEnabled: boolean;
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>;
};

type ScriptParams = GenerationCallbacks & {
  script: string;
  duration: string;
  format: string;
  quality: QualityMode;
  selectedVoiceId: string;
  musicEnabled: boolean;
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>;
};

async function pollRender(
  jobId: string,
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>,
  cb: GenerationCallbacks
) {
  startRenderPoll(
    jobId,
    pollRef,
    cb.setProgress,
    cb.setVideoUrl,
    cb.setScreen,
    cb.setError,
    cb.onVideosRefresh,
    cb.onCreditsRefresh,
    cb.onPipelineEnd
  );
}

export async function generateFromPrompt(params: PromptParams) {
  const { prompt, duration, format, quality, selectedVoiceId, musicEnabled, pollRef, ...cb } = params;
  const finalPrompt = prompt.trim();
  if (!finalPrompt) return;

  if (!(await checkCreditsBeforeGenerate(cb.setError, cb.setScreen))) return;

  cb.onPipelineStart?.();
  cb.setError("");
  cb.setProgress(5);
  cb.setStatus("scripting");

  try {
    const durationSeconds = durationToSeconds(duration);

    const voiceTextRes = await fetch("/api/voice-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: finalPrompt, duration: durationSeconds }),
    });
    const voiceTextData = await voiceTextRes.json();
    if (!voiceTextRes.ok) {
      cb.setError(voiceTextData.error);
      failPipeline(cb);
      return;
    }
    cb.setFormatDetected(voiceTextData.formatName || "");
    cb.setProgress(20);
    cb.setStatus("voice");

    const voiceRes = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: voiceTextData.voiceoverText, voiceId: selectedVoiceId }),
    });
    const voiceData = await voiceRes.json();
    if (!voiceRes.ok) {
      cb.setError(voiceData.error);
      failPipeline(cb);
      return;
    }
    cb.setProgress(40);

    let musicSrc: string | null = null;
    if (musicEnabled) {
      try {
        const musicRes = await fetch("/api/music", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: finalPrompt, formatId: voiceTextData.formatId }),
        });
        musicSrc = (await musicRes.json()).musicUrl || null;
      } catch {
        /* ignore */
      }
    }
    cb.setProgress(55);

    const scenesRes = await fetch("/api/scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: finalPrompt,
        voiceoverText: voiceTextData.voiceoverText,
        audioDuration: voiceData.durationSeconds || parseInt(durationSeconds),
        format,
        accentColor: voiceTextData.accentColor,
        bgDark: voiceTextData.bgDark,
        bgLight: voiceTextData.bgLight,
        bgAccent: voiceTextData.bgAccent,
        formatId: voiceTextData.formatId,
        phraseTimestamps: voiceData.phraseTimestamps || [],
      }),
    });
    const scenesData = await scenesRes.json();
    if (!scenesRes.ok) {
      cb.setError(scenesData.error);
      failPipeline(cb);
      return;
    }
    cb.setProgress(70);
    cb.setStatus("rendering");

    console.log("📐 Voice duration:", voiceData.durationSeconds);
    console.log(
      "📐 totalFrames:",
      Math.round((voiceData.durationSeconds || parseInt(durationSeconds)) * 60)
    );

    const renderRes = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenes: scenesData.scenes,
        sceneDurations: scenesData.sceneDurations,
        totalFrames: Math.round((voiceData.durationSeconds || parseInt(durationSeconds)) * 60),
        format,
        quality,
        audioUrl: voiceData.audioUrl,
        musicUrl: musicSrc,
        musicVolume: 0.07,
        prompt: finalPrompt,
        duration: parseInt(durationSeconds),
        accentColor: voiceTextData.accentColor,
        formatName: voiceTextData.formatName,
      }),
    });
    const renderData = await renderRes.json();
    if (handleRenderError(renderRes, renderData, cb)) return;
    cb.onRenderStarted?.({ jobId: renderData.jobId, prompt: finalPrompt });

    await pollRender(renderData.jobId, pollRef, cb);
  } catch (err: unknown) {
    cb.setError(err instanceof Error ? err.message : "Une erreur est survenue");
    failPipeline(cb);
  }
}

export async function generateFromScreenshot(params: ScreenshotParams) {
  const { file, intent, duration, format, quality, selectedVoiceId, musicEnabled, pollRef, ...cb } =
    params;

  if (!(await checkCreditsBeforeGenerate(cb.setError, cb.setScreen))) return;

  cb.onPipelineStart?.();
  cb.setError("");
  cb.setProgress(5);
  cb.setStatus("scripting");

  try {
    const durationSeconds = durationToSeconds(duration);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("intent", intent);
    formData.append("duration", durationSeconds);

    const analyzeRes = await fetch("/api/reconstruct-ui", { method: "POST", body: formData });
    const analyzeData = await analyzeRes.json();
    if (!analyzeRes.ok) {
      cb.setError(analyzeData.error);
      failPipeline(cb);
      return;
    }
    cb.setProgress(20);
    cb.setStatus("voice");
    cb.setFormatDetected(`${analyzeData.productName} — UI reconstruite`);

    const voiceRes = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: analyzeData.voiceoverText, voiceId: selectedVoiceId }),
    });
    const voiceData = await voiceRes.json();
    if (!voiceRes.ok) {
      cb.setError(voiceData.error);
      failPipeline(cb);
      return;
    }
    cb.setProgress(40);

    let musicSrc: string | null = null;
    if (musicEnabled) {
      try {
        const mr = await fetch("/api/music", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: analyzeData.productName, formatId: "pub" }),
        });
        musicSrc = (await mr.json()).musicUrl || null;
      } catch {
        /* ignore */
      }
    }
    cb.setProgress(55);

    const scenesRes = await fetch("/api/reconstructed-scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...analyzeData,
        componentCode: analyzeData.componentCode,
        audioDuration: voiceData.durationSeconds || parseInt(durationSeconds),
        phraseTimestamps: voiceData.phraseTimestamps || [],
      }),
    });
    const scenesData = await scenesRes.json();
    cb.setProgress(70);
    cb.setStatus("rendering");

    console.log("📐 Voice duration:", voiceData.durationSeconds);
    console.log(
      "📐 totalFrames:",
      Math.round((voiceData.durationSeconds || parseInt(durationSeconds)) * 60)
    );

    const renderRes = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenes: scenesData.scenes,
        sceneDurations: scenesData.sceneDurations,
        totalFrames: Math.round((voiceData.durationSeconds || parseInt(durationSeconds)) * 60),
        format,
        quality,
        audioUrl: voiceData.audioUrl,
        musicUrl: musicSrc,
        musicVolume: 0.07,
        prompt: analyzeData.productName,
        duration: parseInt(durationSeconds),
        accentColor: analyzeData.accentColor,
        formatName: "UI Reconstruit",
      }),
    });
    const renderData = await renderRes.json();
    if (handleRenderError(renderRes, renderData, cb)) return;
    cb.onRenderStarted?.({ jobId: renderData.jobId, prompt: analyzeData.productName || intent });

    await pollRender(renderData.jobId, pollRef, cb);
  } catch (err: unknown) {
    cb.setError(err instanceof Error ? err.message : "Une erreur est survenue");
    failPipeline(cb);
  }
}

export async function generateFromScript(params: ScriptParams) {
  const { script, duration, format, quality, selectedVoiceId, musicEnabled, pollRef, ...cb } = params;
  const finalScript = script.trim();
  if (!finalScript) return;

  if (!(await checkCreditsBeforeGenerate(cb.setError, cb.setScreen))) return;

  cb.onPipelineStart?.();
  cb.setError("");
  cb.setProgress(5);
  cb.setStatus("scripting");
  cb.setFormatDetected("Script personnalisé");

  try {
    const requestedDurationSeconds = durationToSeconds(duration);
    const accentColor = colors.accent;

    const scenesRes = await fetch("/api/script-scenes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        script: finalScript,
        format,
        duration,
        accentColor,
      }),
    });
    const scenesData = await scenesRes.json();
    console.log("🎬 scenesData complet:", JSON.stringify(scenesData).slice(0, 500));
    if (!scenesRes.ok) {
      cb.setError(scenesData.error || "Erreur d'analyse du script");
      failPipeline(cb);
      return;
    }

    console.log("🎬 Scenes count:", scenesData.scenes?.length);
    console.log("🎬 First scene:", scenesData.scenes?.[0]);

    const scriptForVoice = String(scenesData.restructuredScript || finalScript).replace(/\r\n/g, "\n");
    console.log("🎬 Scenes:", scenesData.scenes?.length);
    console.log("📝 Script for voice:", scriptForVoice);
    console.log("📝 Script for voice lines:", scriptForVoice.split("\n").length);

    cb.setProgress(25);
    cb.setStatus("voice");

    const voiceRes = await fetch("/api/voice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: scriptForVoice,
        voiceId: selectedVoiceId,
      }),
    });
    const voiceData = await voiceRes.json();
    console.log("⏱️ voiceData complet:", JSON.stringify(voiceData).slice(0, 500));
    if (!voiceRes.ok) {
      cb.setError(voiceData.error || "Erreur de voix");
      failPipeline(cb);
      return;
    }

    console.log("⏱️ phraseTimestamps count:", voiceData.phraseTimestamps?.length);
    console.log("⏱️ First timestamp:", voiceData.phraseTimestamps?.[0]);

    const voiceDurationSeconds = voiceData.durationSeconds || 30;
    const totalFrames = Math.round(voiceDurationSeconds * 60);

    console.log("⏱️ Voice duration:", voiceData.durationSeconds);
    console.log("🎞️ phraseTimestamps:", voiceData.phraseTimestamps?.length);
    console.log("📐 durationSeconds:", voiceDurationSeconds, "totalFrames:", totalFrames);
    console.log("📐 totalFrames:", totalFrames);

    if (!Number.isFinite(totalFrames) || totalFrames <= 0) {
      throw new Error("Durée invalide");
    }

    let musicSrc: string | null = null;
    if (musicEnabled) {
      musicSrc = scenesData.musicUrl || null;
      if (!musicSrc) {
        try {
          const musicRes = await fetch("/api/music", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: scriptForVoice.split("\n")[0] || scriptForVoice,
              formatId: "pub",
            }),
          });
          musicSrc = (await musicRes.json()).musicUrl || null;
        } catch {
          /* ignore */
        }
      }
    }

    cb.setProgress(55);
    cb.setStatus("rendering");

    const renderRes = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenes: scenesData.scenes,
        sceneDurations: voiceData.phraseTimestamps,
        totalFrames,
        format,
        quality,
        audioUrl: voiceData.audioUrl,
        musicUrl: musicSrc,
        musicVolume: 0.07,
        prompt: scriptForVoice.split("\n")[0] || scriptForVoice,
        duration: parseInt(requestedDurationSeconds),
        accentColor,
        formatName: "Script personnalisé",
      }),
    });
    const renderData = await renderRes.json();
    if (handleRenderError(renderRes, renderData, cb)) return;
    cb.onRenderStarted?.({
      jobId: renderData.jobId,
      prompt: scriptForVoice.split("\n")[0] || scriptForVoice,
    });

    await pollRender(renderData.jobId, pollRef, cb);
  } catch (err: unknown) {
    cb.setError(err instanceof Error ? err.message : "Une erreur est survenue");
    failPipeline(cb);
  }
}
