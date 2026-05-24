import type { MutableRefObject } from "react";
import { durationToSeconds } from "./constants";
import { checkCreditsBeforeGenerate } from "./credits";
import { startRenderPoll } from "./render-poll";
import type { DashboardScreen } from "./types";

type GenerationCallbacks = {
  setProgress: (n: number | ((p: number) => number)) => void;
  setStatus: (s: string) => void;
  setFormatDetected: (s: string) => void;
  setError: (msg: string) => void;
  setScreen: (s: DashboardScreen) => void;
  setVideoUrl: (url: string) => void;
  onVideosRefresh: () => void;
  onCreditsRefresh?: () => void;
};

type PromptParams = GenerationCallbacks & {
  prompt: string;
  duration: string;
  format: string;
  selectedVoiceId: string;
  musicEnabled: boolean;
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>;
};

type ScreenshotParams = GenerationCallbacks & {
  file: File;
  intent: string;
  duration: string;
  format: string;
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
    cb.onCreditsRefresh
  );
}

export async function generateFromPrompt(params: PromptParams) {
  const { prompt, duration, format, selectedVoiceId, musicEnabled, pollRef, ...cb } = params;
  const finalPrompt = prompt.trim();
  if (!finalPrompt) return;

  if (!(await checkCreditsBeforeGenerate(cb.setError, cb.setScreen))) return;

  cb.setScreen("generating");
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
      cb.setScreen("input");
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
      cb.setScreen("input");
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
      cb.setScreen("input");
      return;
    }
    cb.setProgress(70);
    cb.setStatus("rendering");

    const renderRes = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenes: scenesData.scenes,
        sceneDurations: scenesData.sceneDurations,
        totalFrames: Math.round((voiceData.durationSeconds || parseInt(durationSeconds)) * 30),
        format,
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
    if (!renderRes.ok) {
      cb.setError(renderData.error);
      cb.setScreen("input");
      return;
    }

    await pollRender(renderData.jobId, pollRef, cb);
  } catch (err: unknown) {
    cb.setError(err instanceof Error ? err.message : "Une erreur est survenue");
    cb.setScreen("input");
  }
}

export async function generateFromScreenshot(params: ScreenshotParams) {
  const { file, intent, duration, format, selectedVoiceId, musicEnabled, pollRef, ...cb } = params;

  if (!(await checkCreditsBeforeGenerate(cb.setError, cb.setScreen))) return;

  cb.setScreen("generating");
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
      cb.setScreen("input");
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
      cb.setScreen("input");
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

    const renderRes = await fetch("/api/render", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        scenes: scenesData.scenes,
        sceneDurations: scenesData.sceneDurations,
        totalFrames: Math.round((voiceData.durationSeconds || parseInt(durationSeconds)) * 30),
        format,
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
    if (!renderRes.ok) {
      cb.setError(renderData.error);
      cb.setScreen("input");
      return;
    }

    await pollRender(renderData.jobId, pollRef, cb);
  } catch (err: unknown) {
    cb.setError(err instanceof Error ? err.message : "Une erreur est survenue");
    cb.setScreen("input");
  }
}
