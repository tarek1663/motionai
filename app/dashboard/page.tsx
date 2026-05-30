"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboard } from "@/hooks/use-dashboard";
import {
  filterAvailableTourSteps,
  getTourTargetId,
  isTourTargetVisible,
  type TourStep,
} from "@/lib/dashboard/tour";

const tourSteps: TourStep[] = [
  {
    id: "mode",
    title: "Mode IA ou Script",
    desc: "Choisis entre laisser l'IA ecrire ton script ou ecrire le tien.",
    position: "bottom",
  },
  {
    id: "voice",
    title: "Choisis ta voix",
    desc: "Selectionne la voix off de ta video parmi plusieurs options naturelles.",
    position: "bottom",
  },
  {
    id: "generate",
    title: "Lance la generation",
    desc: "Clique ici ou appuie sur Ctrl+Entree pour creer ta video.",
    position: "left",
  },
  {
    id: "suggestions",
    title: "Suggestions rapides",
    desc: "Clique sur une suggestion pour pre-remplir le prompt automatiquement.",
    position: "top",
  },
  {
    id: "history",
    title: "Tes vidéos",
    desc: "Retrouve toutes tes vidéos générées ici. Double-clique pour renommer.",
    position: "right",
  },
  {
    id: "credits",
    title: "Tes credits",
    desc: "Tes videos restantes ce mois. Se renouvelle automatiquement.",
    position: "right",
  },
  {
    id: "server",
    title: "Statut serveur",
    desc: "Indique si le serveur de rendu est disponible en temps reel.",
    position: "right",
  },
  { id: "download", title: "Telecharger", desc: "Telecharge ta video en 1080p prete a publier.", position: "top" },
  { id: "share", title: "Partager", desc: "Copie le lien direct de ta video pour la partager instantanement.", position: "top" },
  {
    id: "notification",
    title: "Suivi en temps reel",
    desc: "La progression s'affiche ici meme si tu navigues sur d'autres pages.",
    position: "bottom",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const state = useDashboard();
  const [showTour, setShowTour] = useState(false);
  const [activeTourSteps, setActiveTourSteps] = useState<TourStep[]>(tourSteps);
  const [tourStep, setTourStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const refreshActiveTourSteps = useCallback(() => {
    const available = filterAvailableTourSteps(tourSteps);
    setActiveTourSteps(available);
    return available;
  }, []);

  const startTour = useCallback(() => {
    window.requestAnimationFrame(() => {
      const available = refreshActiveTourSteps();
      if (available.length === 0) return;
      setTourStep(0);
      setShowTour(true);
    });
  }, [refreshActiveTourSteps]);

  const dismissTour = useCallback(() => {
    if (state.user) localStorage.setItem(`motionr_tour_${state.user.id}`, "done");
    setShowTour(false);
    setTourStep(0);
  }, [state.user]);

  const goToNextTourStep = useCallback(() => {
    if (tourStep >= activeTourSteps.length - 1) {
      dismissTour();
      return;
    }
    setTourStep((prev) => prev + 1);
  }, [tourStep, activeTourSteps.length, dismissTour]);

  useEffect(() => {
    document.title = "Studio — Motionr";
  }, []);

  useEffect(() => {
    if (!state.user) return;
    if (state.credits?.plan === "free" && state.mode === "script") {
      state.setMode("ai");
    }
  }, [state.user, state.credits?.plan, state.mode, state.setMode]);

  useEffect(() => {
    if (!state.user) return;
    const onboardingDone = localStorage.getItem(`motionr_onboarding_${state.user.id}`);
    if (!onboardingDone) {
      router.push("/onboarding");
    }
  }, [state.user, router]);

  useEffect(() => {
    if (!state.user) return;
    const tourDone = localStorage.getItem(`motionr_tour_${state.user.id}`);
    if (!tourDone) {
      const timer = window.setTimeout(() => startTour(), 1000);
      return () => window.clearTimeout(timer);
    }
  }, [state.user, startTour]);

  useEffect(() => {
    if (!state.user) return;
    const isEmailVerified =
      state.user.emailAddresses?.[0]?.verification?.status === "verified";
    if (!isEmailVerified) {
      state.showToast("Verifie ton email pour activer toutes les fonctionnalites.", "info");
    }
  }, [state.user, state.showToast]);

  useEffect(() => {
    const checkMultiTab = () => {
      const saved = localStorage.getItem("motionr_render");
      if (!saved) {
        setIsGenerating(false);
        return;
      }
      try {
        const data = JSON.parse(saved) as { status?: string; timestamp?: number };
        if (data.status === "rendering" && Date.now() - (data.timestamp || 0) < 30 * 60 * 1000) {
          setIsGenerating(true);
          return;
        }
      } catch {
        // ignore parse errors
      }
      setIsGenerating(false);
    };
    checkMultiTab();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "motionr_render") {
        if (e.newValue) {
          try {
            const data = JSON.parse(e.newValue) as { status?: string };
            setIsGenerating(data.status === "rendering");
          } catch {
            setIsGenerating(false);
          }
        } else {
          setIsGenerating(false);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const currentTourStep = activeTourSteps[tourStep];

  return (
    <>
      {isGenerating && state.screen === "input" && (
        <div
          style={{
            position: "fixed",
            top: 10,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            background: "rgba(23,19,17,0.92)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 999,
            padding: "6px 12px",
            color: "rgba(255,255,255,0.86)",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Un rendu est deja en cours dans un autre onglet.
        </div>
      )}

      {state.credits?.videos_remaining === 1 && state.credits?.plan !== "business" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 998,
            background:
              "linear-gradient(90deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))",
            borderBottom: "1px solid rgba(245,158,11,0.2)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, color: "#f59e0b", fontWeight: 500 }}>
              Plus qu'une video ce mois-ci — <strong>upgrade pour continuer a creer</strong>
            </span>
          </div>
          <button
            onClick={() => router.push("/pricing")}
            style={{
              background: "#f59e0b",
              color: "#0a0a0a",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Upgrader →
          </button>
        </div>
      )}

      {state.credits?.videos_remaining === 0 && state.credits?.plan !== "business" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 998,
            background:
              "linear-gradient(90deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))",
            borderBottom: "1px solid rgba(239,68,68,0.2)",
            padding: "10px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>🚫</span>
            <span style={{ fontSize: 13, color: "#ef4444", fontWeight: 500 }}>
              Tu as utilise toutes tes videos ce mois-ci —{" "}
              <strong>upgrade pour continuer</strong>
            </span>
          </div>
          <button
            onClick={() => router.push("/pricing")}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Upgrader →
          </button>
        </div>
      )}

      <DashboardShell {...state} onStartTour={startTour} />

      {state.credits && state.screen === "input" && (
        <div
          style={{
            position: "fixed",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 50,
            display: "flex",
            gap: 12,
            fontSize: 12,
            color: "rgba(255,255,255,0.3)",
            background: "rgba(23,19,17,0.88)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 999,
            padding: "8px 16px",
            backdropFilter: "blur(8px)",
          }}
        >
          <span>
            <span
              style={{
                color:
                  (state.credits.remainingToday ?? 0) > 2
                    ? "rgba(255,255,255,0.5)"
                    : "#f59e0b",
                fontWeight: 600,
              }}
            >
              {state.credits.remainingToday ?? 0}
            </span>
            /{state.credits.dailyLimit ?? 0} aujourd&apos;hui
          </span>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
          <span>
            <span
              style={{
                color:
                  (state.credits.remainingThisMonth ?? 0) > 5
                    ? "rgba(255,255,255,0.5)"
                    : "#f59e0b",
                fontWeight: 600,
              }}
            >
              {state.credits.remainingThisMonth ?? state.credits.videos_remaining}
            </span>
            /{state.credits.monthlyLimit ?? state.credits.videos_limit} ce mois
          </span>
        </div>
      )}

      {showTour && currentTourStep && (
        <TourTooltip
          key={`${currentTourStep.id}-${tourStep}`}
          step={currentTourStep}
          targetId={getTourTargetId(currentTourStep.id)}
          current={tourStep}
          total={activeTourSteps.length}
          onNext={goToNextTourStep}
        />
      )}
    </>
  );
}

function TourTooltip({
  step,
  targetId,
  onNext,
  current,
  total,
}: {
  step: TourStep;
  targetId: string;
  onNext: () => void;
  current: number;
  total: number;
}) {
  const [pos, setPos] = useState({ top: 24, left: 24 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);

    const updatePosition = () => {
      const el = document.getElementById(targetId);
      if (!el || !isTourTargetVisible(el)) {
        onNext();
        return;
      }

      const rect = el.getBoundingClientRect();

      let top = 0;
      let left = 0;
      if (step.position === "bottom") {
        top = rect.bottom + 12;
        left = rect.left + rect.width / 2 - 150;
      } else if (step.position === "top") {
        top = rect.top - 130;
        left = rect.left + rect.width / 2 - 150;
      } else if (step.position === "right") {
        top = rect.top + rect.height / 2 - 60;
        left = rect.right + 12;
      } else {
        top = rect.top + rect.height / 2 - 60;
        left = rect.left - 312;
      }

      left = Math.max(12, Math.min(left, window.innerWidth - 312));
      top = Math.max(12, Math.min(top, window.innerHeight - 180));
      setPos({ top, left });
      setReady(true);
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const frame = window.requestAnimationFrame(updatePosition);
    return () => window.cancelAnimationFrame(frame);
  }, [targetId, step.position, onNext]);

  if (!ready) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.5)",
        }}
      />
      <TourCutout targetId={targetId} />
      <TargetHighlight targetId={targetId} />
      <div
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          zIndex: 10000,
          width: 292,
          background: "rgba(18,18,18,0.94)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 14,
          padding: 16,
          boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 2,
                borderRadius: 2,
                background: i <= current ? "#10B981" : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          {step.title}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", lineHeight: 1.55, marginBottom: 14 }}>
          {step.desc}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onNext}
            style={{
              flex: 1,
              padding: 8,
              background: "#10B981",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 6px 16px rgba(16,185,129,0.28)",
            }}
          >
            {current === total - 1 ? "Terminer ✓" : "Suivant →"}
          </button>
        </div>
      </div>
    </>
  );
}

function TourCutout({ targetId }: { targetId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const el = document.getElementById(targetId);
      if (el && isTourTargetVisible(el)) setRect(el.getBoundingClientRect());
      else setRect(null);
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [targetId]);

  if (!rect) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        borderRadius: 10,
        boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
        zIndex: 9998,
        pointerEvents: "none",
      }}
    />
  );
}

function TargetHighlight({ targetId }: { targetId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      const el = document.getElementById(targetId);
      if (el && isTourTargetVisible(el)) setRect(el.getBoundingClientRect());
      else setRect(null);
    };
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [targetId]);

  if (!rect) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
        border: "2px solid #10B981",
        borderRadius: 10,
        zIndex: 9999,
        boxShadow: "0 0 0 4px rgba(16,185,129,0.15), 0 0 20px rgba(16,185,129,0.3)",
        pointerEvents: "none",
      }}
    />
  );
}
