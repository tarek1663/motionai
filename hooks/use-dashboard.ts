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
import { generateFromPrompt, generateFromScreenshot } from "@/lib/dashboard/generate";
import type { DashboardScreen, DashboardVideo, InputTab } from "@/lib/dashboard/types";

const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";

export function useDashboard() {
  const { user } = useUser();
  const router = useRouter();

  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("30s");
  const [format, setFormat] = useState("9:16");
  const [selectedVoiceId, setSelectedVoiceId] = useState(DEFAULT_VOICE);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [screen, setScreen] = useState<DashboardScreen>("input");
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [formatDetected, setFormatDetected] = useState("");
  const [activeTab, setActiveTab] = useState<InputTab>("prompt");

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
  const [screenshotIntent, setScreenshotIntent] = useState("");
  const [screenshotLoading, setScreenshotLoading] = useState(false);

  const [videos, setVideos] = useState<DashboardVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<DashboardVideo | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [credits, setCredits] = useState<CreditsInfo | null>(null);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("");

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setPrompt("");
    setProgress(0);
    setVideoUrl("");
    setError("");
    setSelectedVideo(null);
    setQuestions([]);
    setAnswers({});
    setOtherDetails({});
  }, []);

  const submit = useCallback(
    async (enrichedPrompt?: string) => {
      const finalPrompt = enrichedPrompt || prompt;
      if (!finalPrompt.trim()) return;
      await generateFromPrompt({
        prompt: finalPrompt,
        duration,
        format,
        selectedVoiceId,
        musicEnabled,
        pollRef,
        ...generationCallbacks,
      });
    },
    [prompt, duration, format, selectedVoiceId, musicEnabled, loadVideos]
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
        await submit();
      }
    } catch {
      await submit();
    } finally {
      setLoadingQ(false);
    }
  }, [prompt, submit]);

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

  const submitScreenshot = useCallback(async () => {
    if (!screenshotFile || !screenshotIntent.trim()) return;
    setScreenshotLoading(true);
    try {
      await generateFromScreenshot({
        file: screenshotFile,
        intent: screenshotIntent,
        duration,
        format,
        selectedVoiceId,
        musicEnabled,
        pollRef,
        ...generationCallbacks,
      });
    } finally {
      setScreenshotLoading(false);
    }
  }, [
    screenshotFile,
    screenshotIntent,
    duration,
    format,
    selectedVoiceId,
    musicEnabled,
    loadVideos,
  ]);

  const finishQuestions = useCallback(() => {
    const enriched = buildEnrichedPrompt(prompt, questions, answers, otherDetails);
    setPrompt(enriched);
    setScreen("input");
    setQuestions([]);
    setTimeout(() => submit(enriched), 100);
  }, [prompt, questions, answers, otherDetails, submit]);

  const skipQuestions = useCallback(() => {
    setScreen("input");
    setQuestions([]);
    setTimeout(() => submit(), 100);
  }, [submit]);

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

  return {
    user,
    prompt,
    setPrompt,
    duration,
    setDuration,
    format,
    setFormat,
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
    activeTab,
    setActiveTab,
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
    screenshotIntent,
    setScreenshotIntent,
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
    submitScreenshot,
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
  };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
