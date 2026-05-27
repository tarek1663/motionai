"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  buildEnrichedPrompt,
  isOtherOption,
  type ClarificationQuestion,
} from "@/lib/dashboard/questions";
import { fetchCredits, type CreditsInfo } from "@/lib/dashboard/credits";
import { generateFromPrompt, generateFromScreenshot, generateFromScript } from "@/lib/dashboard/generate";
import type {
  DashboardScreen,
  DashboardVideo,
  QualityMode,
  ScriptMode,
} from "@/lib/dashboard/types";

const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";

export function useDashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<ScriptMode>("ai");
  const [customScript, setCustomScript] = useState("");
  const [duration, setDuration] = useState("30s");
  const [format, setFormat] = useState("9:16");
  const [quality, setQuality] = useState<QualityMode>("fast");
  const [selectedVoiceId, setSelectedVoiceId] = useState(DEFAULT_VOICE);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [screen, setScreen] = useState<DashboardScreen>("input");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [formatDetected, setFormatDetected] = useState("");
  const [showDurationMenu, setShowDurationMenu] = useState(false);
  const [showFormatMenu, setShowFormatMenu] = useState(false);
  const [showVoices, setShowVoices] = useState(false);

  const [questions, setQuestions] = useState<ClarificationQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherDetails, setOtherDetails] = useState<Record<string, string>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [loadingQ, setLoadingQ] = useState(false);

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState("");
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  const [videos, setVideos] = useState<DashboardVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<DashboardVideo | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [credits, setCredits] = useState<CreditsInfo | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");
  const [renderNotif, setRenderNotif] = useState<{
    jobId: string;
    progress: number;
    status: "rendering" | "done" | "error";
    videoUrl?: string;
    prompt?: string;
  } | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadCredits = useCallback(async () => {
    const data = await fetchCredits();
    if (data) setCredits(data);
  }, []);

  const loadVideos = useCallback(async () => {
    try {
      const res = await fetch("/api/videos");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch {
      /* ignore */
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  const generationCallbacks = {
    setProgress,
    setStatus,
    setFormatDetected,
    setError,
    setScreen,
    setVideoUrl,
    onVideosRefresh: loadVideos,
    onCreditsRefresh: loadCredits,
    onUpgradeRequired: (reason: string) => {
      setUpgradeReason(reason);
      setShowUpgrade(true);
    },
    onRenderStarted: ({ jobId, prompt: notifPrompt }: { jobId: string; prompt: string }) => {
      setRenderNotif({
        jobId,
        progress: 0,
        status: "rendering",
        prompt: notifPrompt,
      });

      if (notifPollRef.current) clearInterval(notifPollRef.current);

      notifPollRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/render/${jobId}`, { cache: "no-store" });
          const data = await res.json();

          if (typeof data.progress === "number") {
            setRenderNotif((prev) =>
              prev && prev.jobId === jobId ? { ...prev, progress: data.progress } : prev
            );
          }

          if (data.status === "done") {
            if (notifPollRef.current) clearInterval(notifPollRef.current);
            notifPollRef.current = null;
            setRenderNotif((prev) =>
              prev && prev.jobId === jobId
                ? { ...prev, status: "done", progress: 100, videoUrl: data.videoUrl }
                : prev
            );
            loadVideos();
          } else if (data.status === "error") {
            if (notifPollRef.current) clearInterval(notifPollRef.current);
            notifPollRef.current = null;
            setRenderNotif((prev) =>
              prev && prev.jobId === jobId ? { ...prev, status: "error" } : prev
            );
          }
        } catch {
          // silent retry
        }
      }, 3000);
    },
  };

  useEffect(() => {
    if (!user) return;
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (!d.onboarding?.completed) router.push("/onboarding");
      });
    loadVideos();
    loadCredits();
  }, [user, router, loadVideos, loadCredits]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (notifPollRef.current) clearInterval(notifPollRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-menu]")) {
        setShowDurationMenu(false);
        setShowFormatMenu(false);
        setShowVoices(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const resetCreation = useCallback(() => {
    setScreen("input");
    setMode("ai");
    setPrompt("");
    setCustomScript("");
    setProgress(0);
    setVideoUrl("");
    setError("");
    setFormatDetected("");
    setSelectedVideo(null);
    setQuestions([]);
    setAnswers({});
    setOtherDetails({});
    setScreenshotFile(null);
    setScreenshotPreview("");
    setScreenshotLoading(false);
  }, []);

  const generatePrompt = useCallback(
    async (enrichedPrompt?: string) => {
      const finalPrompt = enrichedPrompt || prompt;
      if (!finalPrompt.trim()) return;
      await generateFromPrompt({
        prompt: finalPrompt,
        duration,
        format,
        quality,
        selectedVoiceId,
        musicEnabled,
        pollRef,
        ...generationCallbacks,
      });
    },
    [prompt, duration, format, quality, selectedVoiceId, musicEnabled, loadVideos]
  );

  const fetchQuestions = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoadingQ(true);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.questions?.length > 0) {
        setQuestions(data.questions);
        setAnswers({});
        setOtherDetails({});
        setCurrentQ(0);
        setScreen("questions");
      } else {
        await generatePrompt();
      }
    } catch {
      await generatePrompt();
    } finally {
      setLoadingQ(false);
    }
  }, [prompt, generatePrompt]);

  const submit = useCallback(async () => {
    if (screenshotFile) {
      if (!prompt.trim()) return;
      setScreenshotLoading(true);
      try {
        await generateFromScreenshot({
          file: screenshotFile,
          intent: prompt.trim(),
          duration,
          format,
          quality,
          selectedVoiceId,
          musicEnabled,
          pollRef,
          ...generationCallbacks,
        });
      } finally {
        setScreenshotLoading(false);
      }
      return;
    }

    if (mode === "ai") {
      if (!prompt.trim()) return;
      await fetchQuestions();
      return;
    }

    if (!customScript.trim()) return;

    await generateFromScript({
      script: customScript,
      duration,
      format,
      quality,
      selectedVoiceId,
      musicEnabled,
      pollRef,
      ...generationCallbacks,
    });
  }, [
    mode,
    prompt,
    screenshotFile,
    customScript,
    duration,
    format,
    quality,
    selectedVoiceId,
    musicEnabled,
    fetchQuestions,
    loadVideos,
  ]);

  const handleScreenshotFile = useCallback((file: File) => {
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const clearScreenshot = useCallback(() => {
    setScreenshotFile(null);
    setScreenshotPreview("");
  }, []);

  const finishQuestions = useCallback(() => {
    const enriched = buildEnrichedPrompt(prompt, questions, answers, otherDetails);
    setPrompt(enriched);
    setScreen("input");
    setQuestions([]);
    setTimeout(() => generatePrompt(enriched), 100);
  }, [prompt, questions, answers, otherDetails, generatePrompt]);

  const skipQuestions = useCallback(() => {
    setScreen("input");
    setQuestions([]);
    setTimeout(() => generatePrompt(), 100);
  }, [generatePrompt]);

  const selectAnswer = useCallback(
    (questionId: string, optionId: string, question?: ClarificationQuestion) => {
      setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
      const opt = question?.options?.find((o) => o.id === optionId);
      if (opt && !isOtherOption(opt)) {
        setOtherDetails((prev) => {
          const next = { ...prev };
          delete next[questionId];
          return next;
        });
      }
    },
    []
  );

  const setOtherDetail = useCallback((questionId: string, value: string) => {
    setOtherDetails((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const backFromQuestions = useCallback(() => {
    if (currentQ === 0) {
      setScreen("input");
      setQuestions([]);
      setOtherDetails({});
    } else {
      setCurrentQ((q) => q - 1);
    }
  }, [currentQ]);

  const dismissRenderNotif = useCallback(() => {
    if (notifPollRef.current) {
      clearInterval(notifPollRef.current);
      notifPollRef.current = null;
    }
    setRenderNotif(null);
  }, []);

  return {
    user,
    mode,
    setMode,
    prompt,
    setPrompt,
    customScript,
    setCustomScript,
    duration,
    setDuration,
    format,
    setFormat,
    quality,
    setQuality,
    selectedVoiceId,
    setSelectedVoiceId,
    musicEnabled,
    setMusicEnabled,
    screen,
    setScreen,
    progress,
    status,
    videoUrl,
    error,
    formatDetected,
    showDurationMenu,
    setShowDurationMenu,
    showFormatMenu,
    setShowFormatMenu,
    showVoices,
    setShowVoices,
    questions,
    answers,
    otherDetails,
    currentQ,
    setCurrentQ,
    loadingQ,
    screenshotPreview,
    screenshotLoading,
    handleScreenshotFile,
    clearScreenshot,
    videos,
    loadingVideos,
    selectedVideo,
    setSelectedVideo,
    sidebarCollapsed,
    setSidebarCollapsed,
    resetCreation,
    submit,
    fetchQuestions,
    finishQuestions,
    skipQuestions,
    selectAnswer,
    setOtherDetail,
    backFromQuestions,
    credits,
    loadCredits,
    showUpgrade,
    setShowUpgrade,
    upgradeReason,
    renderNotif,
    dismissRenderNotif,
  };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
