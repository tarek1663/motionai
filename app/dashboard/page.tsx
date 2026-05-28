"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useDashboard } from "@/hooks/use-dashboard";

type TourStep = {
  id: string;
  title: string;
  desc: string;
  position: "top" | "bottom" | "left" | "right";
};

const tourSteps: TourStep[] = [
  { id: "mode", title: "Mode IA ou Script", desc: "Choisis entre laisser l'IA ecrire ton script ou ecrire le tien.", position: "bottom" },
  { id: "voice", title: "Choisis ta voix", desc: "Selectionne la voix off de ta video parmi plusieurs options naturelles.", position: "bottom" },
  { id: "generate", title: "Lance la generation", desc: "Clique ici ou appuie sur Ctrl+Entree pour creer ta video.", position: "left" },
  { id: "suggestions", title: "Suggestions rapides", desc: "Clique sur une suggestion pour pre-remplir le prompt automatiquement.", position: "top" },
  { id: "history", title: "Tes videos", desc: "Retrouve toutes tes videos generees ici. Double-clique pour renommer.", position: "right" },
  { id: "credits", title: "Tes credits", desc: "Tes videos restantes ce mois. Se renouvelle automatiquement.", position: "right" },
  { id: "server", title: "Statut serveur", desc: "Indique si le serveur de rendu est disponible en temps reel.", position: "right" },
  { id: "download", title: "Telecharger", desc: "Telecharge ta video en 1080p prete a publier.", position: "top" },
  { id: "share", title: "Partager", desc: "Copie le lien direct de ta video pour la partager instantanement.", position: "top" },
  { id: "notification", title: "Suivi en temps reel", desc: "La progression s'affiche ici meme si tu navigues sur d'autres pages.", position: "bottom" },
];

export default function DashboardPage() {
  const router = useRouter();
  const state = useDashboard();
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    document.title = "Studio — Motionr";
  }, []);

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
      const timer = window.setTimeout(() => setShowTour(true), 1000);
      return () => window.clearTimeout(timer);
    }
  }, [state.user]);

  const dismissTour = () => {
    if (state.user) localStorage.setItem(`motionr_tour_${state.user.id}`, "done");
    setShowTour(false);
  };

  return (
    <>
      <DashboardShell
        {...state}
        onStartTour={() => {
          setTourStep(0);
          setShowTour(true);
        }}
      />

      {showTour && tourStep < tourSteps.length && (
        <TourTooltip
          step={tourSteps[tourStep]}
          targetId={`tour-${tourSteps[tourStep].id}`}
          current={tourStep}
          total={tourSteps.length}
          onNext={() => {
            if (tourStep < tourSteps.length - 1) {
              setTourStep((prev) => prev + 1);
            } else {
              dismissTour();
            }
          }}
          onSkip={dismissTour}
        />
      )}
    </>
  );
}

function TourTooltip({
  step,
  targetId,
  onNext,
  onSkip,
  current,
  total,
}: {
  step: TourStep;
  targetId: string;
  onNext: () => void;
  onSkip: () => void;
  current: number;
  total: number;
}) {
  const [pos, setPos] = useState({ top: 24, left: 24 });

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
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
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [targetId, step.position]);

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        }}
        onClick={onSkip}
      />
      <TargetHighlight targetId={targetId} />
      <div
        style={{
          position: "fixed",
          top: pos.top,
          left: pos.left,
          zIndex: 10000,
          width: 300,
          background: "#1a1a1a",
          border: "1px solid rgba(16,185,129,0.3)",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
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
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#10B981",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {current + 1} / {total}
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
          {step.title}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 16 }}>
          {step.desc}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onSkip}
            style={{
              flex: 1,
              padding: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          >
            Passer
          </button>
          <button
            onClick={onNext}
            style={{
              flex: 2,
              padding: 8,
              background: "#10B981",
              border: "none",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {current === total - 1 ? "Terminer ✓" : "Suivant →"}
          </button>
        </div>
      </div>
    </>
  );
}

function TargetHighlight({ targetId }: { targetId: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (el) setRect(el.getBoundingClientRect());
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
