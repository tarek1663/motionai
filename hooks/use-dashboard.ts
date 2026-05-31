"use client";

import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import {
  buildEnrichedPrompt,
  isOtherOption,
  type ClarificationQuestion,
} from "@/lib/dashboard/questions";
import { fetchCredits, type CreditsInfo } from "@/lib/dashboard/credits";
import { MIN_SCRIPT_WORDS } from "@/lib/dashboard/constants";
import {
  clampDuration,
  getAvailableDurations,
  getMaxDurationSeconds,
  isScriptModeAllowed,
} from "@/lib/dashboard/plan-limits";
import {
  clearRenderStorage,
  readRenderStorage,
  RENDER_STORAGE_KEY,
  saveRenderJob,
} from "@/lib/dashboard/render-storage";
import {
  generateFromPrompt,
  generateFromScreenshot,
  generateFromScript,
} from "@/lib/dashboard/generate";
import { posthog } from "@/lib/posthog";
import type {
  DashboardScreen,
  DashboardVideo,
  QualityMode,
  ScriptMode,
} from "@/lib/dashboard/types";
import { normalizeDashboardVideos } from "@/lib/dashboard/videos";

const DEFAULT_VOICE = "21m00Tcm4TlvDq8ikWAM";
const COOLDOWN_MS = 45000;
export function useDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [lastGenerationTime, setLastGenerationTime] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [accentColor, setAccentColor] = useState("#10B981");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draftRestored, setDraftRestored] = useState(false);
  const [isGeneratingElsewhere, setIsGeneratingElsewhere] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackedVideoUrlRef = useRef<string | null>(null);

  const saveRenderToStorage = useCallback(
    (jobId: string, notifPrompt: string) => {
      saveRenderJob(jobId, notifPrompt, user?.id);
    },
    [user?.id]
  );

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToast({ message, type });
    },
    []
  );

  const loadCredits = useCallback(async () => {
    const data = await fetchCredits();
    if (data) setCredits(data);
  }, []);

  const loadVideos = useCallback(async () => {
    setLoadingVideos(true);
    try {
      const res = await fetch("/api/videos", { cache: "no-store" });
      const data = await res.json();
      const rawList = Array.isArray(data) ? data : data.videos;
      const list = normalizeDashboardVideos(rawList);
      console.log("📹 Setting videos:", list.length);
      setVideos(list);
    } catch (err) {
      console.error("📹 Error:", err);
      setVideos([]);
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
      saveRenderToStorage(jobId, notifPrompt);
      clearDraft();
      setDraftRestored(false);
    },
  };

  useEffect(() => {
    if (!credits) return;
    if (!isScriptModeAllowed(credits.plan) && mode === "script") {
      setMode("ai");
    }
    setDuration((prev) => clampDuration(prev, credits.plan));
  }, [credits, mode]);

  useEffect(() => {
    if (!user) {
      clearRenderStorage();
    }
  }, [user]);

  useEffect(() => {
    if (screen !== "done" || !videoUrl || trackedVideoUrlRef.current === videoUrl) {
      return;
    }
    trackedVideoUrlRef.current = videoUrl;
    posthog.capture("video_generated", {
      mode,
      duration,
      plan: credits?.plan,
    });
  }, [screen, videoUrl, mode, duration, credits?.plan]);

  const filterQuestionsForPlan = useCallback(
    (questions: ClarificationQuestion[], plan?: string | null) => {
      const maxSec = getMaxDurationSeconds(plan);
      return questions.map((q) => {
        if (q.id !== "duration") return q;
        return {
          ...q,
          options: (q.options || []).filter((opt) => {
            const sec = parseInt(String(opt.label).replace(/\D/g, ""), 10) || 0;
            return sec <= maxSec;
          }),
        };
      });
    },
    []
  );

  useEffect(() => {
    if (!user) return;
    fetch("/api/onboarding")
      .then((r) => r.json())
      .then((d) => {
        if (!d.onboarding?.completed) router.push("/onboarding");
      });
    loadCredits();
  }, [user, router, loadCredits]);

  useEffect(() => {
    if (user?.id) {
      console.log("📹 User loaded, fetching videos...");
      loadVideos();
    } else {
      setLoadingVideos(false);
      setVideos([]);
    }
  }, [user?.id, loadVideos]);

  useEffect(() => {
    if (!user) return;
    const savedAccent = localStorage.getItem(`motionr_accent_${user.id}`);
    if (savedAccent) setAccentColor(savedAccent);

    const savedHistory = localStorage.getItem(`motionr_prompts_${user.id}`);
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory) as string[]);
      } catch {
        setPromptHistory([]);
      }
    }

    const savedDraft = localStorage.getItem(`motionr_draft_${user.id}`);
    if (savedDraft) {
      try {
        const data = JSON.parse(savedDraft) as {
          mode?: ScriptMode;
          prompt?: string;
          customScript?: string;
        };
        setMode(data.mode || "ai");
        setPrompt(data.prompt || "");
        setCustomScript(data.customScript || "");
        if ((data.prompt || data.customScript || "").trim()) {
          setDraftRestored(true);
        }
      } catch {
        // ignore invalid draft
      }
    }
  }, [user]);

  useEffect(() => {
    const checkMultiTab = () => {
      const data = readRenderStorage();
      if (!data) {
        setIsGeneratingElsewhere(false);
        return;
      }
      if (data.userId && user?.id && data.userId !== user.id) {
        setIsGeneratingElsewhere(false);
        return;
      }
      if (
        data.status === "rendering" &&
        Date.now() - data.timestamp < 30 * 60 * 1000
      ) {
        setIsGeneratingElsewhere(true);
        return;
      }
      setIsGeneratingElsewhere(false);
    };

    checkMultiTab();
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== RENDER_STORAGE_KEY) return;
      checkMultiTab();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    if (prompt.trim() || customScript.trim()) {
      localStorage.setItem(
        `motionr_draft_${user.id}`,
        JSON.stringify({ mode, prompt, customScript })
      );
    }
  }, [prompt, customScript, mode, user]);

  const viewVideo = useCallback((video: DashboardVideo) => {
    setSelectedVideo(video);
    setScreen("viewing");
  }, []);

  useEffect(() => {
    const videoUrlParam = searchParams.get("videoUrl");
    if (!videoUrlParam || videos.length === 0) return;

    const matchedVideo = videos.find((video) => video.video_url === videoUrlParam);
    if (!matchedVideo) return;

    viewVideo(matchedVideo);
    router.replace("/dashboard");
  }, [searchParams, videos, router, viewVideo]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  useEffect(() => {
    if (credits?.videos_remaining === 1) {
      showToast("Plus qu'une video ce mois-ci — pense a upgrader !", "info");
    }
    if (credits?.videos_remaining === 0 && credits.plan !== "business") {
      setUpgradeReason("Tu as utilise toutes tes videos ce mois-ci. Upgrade pour continuer.");
      setShowUpgrade(true);
    }
  }, [credits?.videos_remaining, credits?.plan, showToast]);

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
        userAccentColor: accentColor,
        pollRef,
        ...generationCallbacks,
      });
    },
    [prompt, duration, format, quality, selectedVoiceId, musicEnabled, accentColor, loadVideos]
  );

  const fetchQuestions = useCallback(async () => {
    const text = mode === "ai" ? prompt : customScript;
    if (!text.trim()) return;
    setLoadingQ(true);
    try {
      setScreen("questions");
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, mode }),
      });
      const data = await res.json();
      if (data.questions?.length > 0) {
        setQuestions(filterQuestionsForPlan(data.questions, credits?.plan));
        setAnswers({});
        setOtherDetails({});
        setCurrentQ(0);
      } else if (mode === "ai") {
        await generatePrompt();
      } else {
        await generateFromScript({
          script: customScript,
          duration,
          format,
          quality,
          selectedVoiceId,
          musicEnabled,
          userAccentColor: accentColor,
          pollRef,
          ...generationCallbacks,
        });
      }
    } catch {
      if (mode === "ai") {
        await generatePrompt();
      } else {
        await generateFromScript({
          script: customScript,
          duration,
          format,
          quality,
          selectedVoiceId,
          musicEnabled,
          userAccentColor: accentColor,
          pollRef,
          ...generationCallbacks,
        });
      }
    } finally {
      setLoadingQ(false);
    }
  }, [
    mode,
    prompt,
    customScript,
    duration,
    format,
    quality,
    selectedVoiceId,
    musicEnabled,
    accentColor,
    generatePrompt,
    pollRef,
    generationCallbacks,
    credits?.plan,
    filterQuestionsForPlan,
  ]);

  const savePromptToHistory = useCallback(
    (text: string) => {
      if (!text.trim() || !user) return;
      const updated = [text, ...promptHistory.filter((p) => p !== text)].slice(0, 20);
      setPromptHistory(updated);
      localStorage.setItem(`motionr_prompts_${user.id}`, JSON.stringify(updated));
      setHistoryIndex(-1);
    },
    [promptHistory, user]
  );

  const clearDraft = useCallback(() => {
    if (user) localStorage.removeItem(`motionr_draft_${user.id}`);
  }, [user]);

  const submit = useCallback(async () => {
    const renderData = readRenderStorage();
    if (
      renderData &&
      (!renderData.userId || renderData.userId === user?.id) &&
      renderData.status === "rendering" &&
      Date.now() - renderData.timestamp < 30 * 60 * 1000
    ) {
      showToast("Une video est deja en cours de generation.", "error");
      return;
    }

    const now = Date.now();
    const timeSinceLast = now - lastGenerationTime;
    if (timeSinceLast < COOLDOWN_MS && lastGenerationTime > 0) {
      const remaining = Math.ceil((COOLDOWN_MS - timeSinceLast) / 1000);
      showToast(`Attends ${remaining}s avant de relancer une generation.`, "error");
      return;
    }

    const creditsData = await fetchCredits();
    if (creditsData && creditsData.plan !== "business" && creditsData.videos_remaining <= 0) {
      setShowUpgrade(true);
      setUpgradeReason("Tu as utilise toutes tes videos ce mois-ci.");
      return;
    }

    const validatePrompt = (text: string): string | null => {
      if (!text.trim()) return "Decris ta video avant de generer.";
      if (text.trim().length < 10) return "Decris ton idee en au moins 10 caracteres.";
      if (text.trim().length > 2000) return "Le prompt est trop long — max 2000 caracteres.";
      return null;
    };

    if (screenshotFile) {
      const validationError = validatePrompt(prompt);
      if (validationError) {
        showToast(validationError, "error");
        return;
      }
      setLastGenerationTime(now);
      savePromptToHistory(prompt);
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
          userAccentColor: accentColor,
          pollRef,
          ...generationCallbacks,
        });
        clearDraft();
        setDraftRestored(false);
      } finally {
        setScreenshotLoading(false);
      }
      return;
    }

    if (mode === "ai") {
      const validationError = validatePrompt(prompt);
      if (validationError) {
        showToast(validationError, "error");
        return;
      }
      setLastGenerationTime(now);
      savePromptToHistory(prompt);
      await fetchQuestions();
      return;
    }

    if (mode === "script") {
      if (!isScriptModeAllowed(credits?.plan)) {
        showToast("Le mode Script est disponible a partir du plan Starter →", "info");
        router.push("/pricing");
        return;
      }
      if (!customScript.trim()) {
        showToast("Ecris ton script avant de generer.", "error");
        return;
      }
      const wordCount = customScript.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < MIN_SCRIPT_WORDS) {
        showToast(
          `Ton script doit contenir au moins ${MIN_SCRIPT_WORDS} mots. (${wordCount}/${MIN_SCRIPT_WORDS})`,
          "error",
        );
        return;
      }
      if (customScript.trim().length > 2000) {
        showToast("Le script est trop long — max 2000 caracteres.", "error");
        return;
      }
      setLastGenerationTime(now);
      savePromptToHistory(customScript);
      await fetchQuestions();
      return;
    }
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
    credits?.plan,
    router,
    user?.id,
    loadVideos,
    showToast,
    lastGenerationTime,
    accentColor,
    isGeneratingElsewhere,
    savePromptToHistory,
    clearDraft,
  ]);

  useEffect(() => {
    if (!lastGenerationTime) {
      setCooldown(0);
      return;
    }

    const updateCooldown = () => {
      const elapsed = Date.now() - lastGenerationTime;
      const remaining = Math.max(0, Math.ceil((COOLDOWN_MS - elapsed) / 1000));
      setCooldown(remaining);
    };

    updateCooldown();
    const interval = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(interval);
  }, [lastGenerationTime]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (screen === "generating") {
        e.preventDefault();
        e.returnValue = "Une video est en cours de generation. Veux-tu vraiment quitter ?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [screen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && screen === "input") {
        e.preventDefault();
        void submit();
      }

      if (e.key === "Escape" && screen === "questions") {
        e.preventDefault();
        setScreen("input");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen, submit]);

  const deleteVideo = useCallback(
    async (videoId: string) => {
      try {
        const res = await fetch(`/api/videos/${videoId}`, { method: "DELETE" });
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Suppression impossible" }));
          showToast(data.error || "Suppression impossible", "error");
          return;
        }
        await loadVideos();
        if (selectedVideo?.id === videoId) {
          setSelectedVideo(null);
          setScreen("input");
        }
        showToast("Video supprimee", "success");
      } catch {
        showToast("Erreur lors de la suppression", "error");
      }
    },
    [loadVideos, selectedVideo?.id, showToast]
  );

  const renameVideo = useCallback(
    async (videoId: string, title: string) => {
      const nextTitle = title.trim();
      if (!nextTitle) return;
      try {
        const res = await fetch(`/api/videos/${videoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: nextTitle }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Renommage impossible" }));
          showToast(data.error || "Renommage impossible", "error");
          return;
        }
        await loadVideos();
        showToast("Titre mis a jour", "success");
      } catch {
        showToast("Erreur lors du renommage", "error");
      }
    },
    [loadVideos, showToast]
  );

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

  const clearDraftContent = useCallback(() => {
    setPrompt("");
    setCustomScript("");
    clearDraft();
    setDraftRestored(false);
  }, [clearDraft]);

  const handlePromptKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        void submit();
        return;
      }
      if (e.key === "ArrowUp" && !e.shiftKey) {
        e.preventDefault();
        const newIndex = Math.min(historyIndex + 1, promptHistory.length - 1);
        setHistoryIndex(newIndex);
        if (promptHistory[newIndex]) {
          mode === "ai" ? setPrompt(promptHistory[newIndex]) : setCustomScript(promptHistory[newIndex]);
        }
      }
      if (e.key === "ArrowDown" && !e.shiftKey) {
        e.preventDefault();
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        if (newIndex === -1) {
          mode === "ai" ? setPrompt("") : setCustomScript("");
        } else if (promptHistory[newIndex]) {
          mode === "ai" ? setPrompt(promptHistory[newIndex]) : setCustomScript(promptHistory[newIndex]);
        }
      }
    },
    [submit, historyIndex, promptHistory, mode]
  );

  const finishQuestions = useCallback(() => {
    const durationOptionId = answers.duration || "duration_30";
    const durationMap: Record<string, string> = {
      duration_15: "15s",
      duration_30: "30s",
      duration_45: "45s",
      duration_60: "60s",
    };
    const nextDuration = clampDuration(durationMap[durationOptionId] || "30s", credits?.plan);
    setDuration(nextDuration);

    const qualityOptionId = answers.quality || "quality_fast";
    const nextQuality: QualityMode =
      qualityOptionId === "quality_high" ? "high" : "fast";
    setQuality(nextQuality);

    const colorMap: Record<string, string> = {
      "🟢 Vert": "#10B981",
      "🟣 Violet": "#7C3AED",
      "🔵 Bleu": "#3B82F6",
      "🟡 Or": "#F59E0B",
      "🔴 Rouge": "#EF4444",
      "⚪ Blanc": "#ffffff",
      "🩷 Rose": "#EC4899",
      "🩵 Cyan": "#06B6D4",
    };
    const colorAnswer = answers.color || "🟢 Vert";
    const color = colorMap[colorAnswer] || "#10B981";
    setAccentColor(color);

    setScreen("input");
    setQuestions([]);

    if (mode === "script") {
      if (!isScriptModeAllowed(credits?.plan)) {
        showToast("Le mode Script est disponible a partir du plan Starter →", "info");
        router.push("/pricing");
        return;
      }
      setTimeout(() => {
        void generateFromScript({
          script: customScript,
          duration: nextDuration,
          format,
          quality: nextQuality,
          selectedVoiceId,
          musicEnabled,
          userAccentColor: color,
          accentColorLabel: colorAnswer,
          pollRef,
          ...generationCallbacks,
        });
        clearDraft();
        setDraftRestored(false);
      }, 100);
      return;
    }

    const contextualAnswers = Object.fromEntries(
      Object.entries(answers).filter(
        ([key]) => key !== "duration" && key !== "quality" && key !== "color"
      )
    );
    const enriched = buildEnrichedPrompt(prompt, questions, contextualAnswers, otherDetails);
    setPrompt(enriched);
    setTimeout(() => generatePrompt(enriched), 100);
  }, [
    mode,
    customScript,
    prompt,
    questions,
    answers,
    otherDetails,
    generatePrompt,
    format,
    selectedVoiceId,
    musicEnabled,
    pollRef,
    generationCallbacks,
    clearDraft,
    savePromptToHistory,
    credits?.plan,
    router,
    showToast,
  ]);

  const skipQuestions = useCallback(() => {
    setScreen("input");
    setQuestions([]);
    if (mode === "script") {
      if (!isScriptModeAllowed(credits?.plan)) {
        showToast("Le mode Script est disponible a partir du plan Starter →", "info");
        router.push("/pricing");
        return;
      }
      setTimeout(() => {
        void generateFromScript({
          script: customScript,
          duration,
          format,
          quality,
          selectedVoiceId,
          musicEnabled,
          userAccentColor: accentColor,
          pollRef,
          ...generationCallbacks,
        });
      }, 100);
      return;
    }
    setTimeout(() => generatePrompt(), 100);
  }, [
    mode,
    customScript,
    duration,
    format,
    quality,
    selectedVoiceId,
    musicEnabled,
    accentColor,
    generatePrompt,
    pollRef,
    generationCallbacks,
  ]);

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
    accentColor,
    promptHistory,
    draftRestored,
    handlePromptKeyDown,
    clearDraftContent,
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
    viewVideo,
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
    cooldown,
    toast,
    setToast,
    showToast,
    deleteVideo,
    renameVideo,
  };
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>;
