"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Props = {
  onEligibleChange?: (visible: boolean) => void;
};

export function GlobalAnnouncementBar({ onEligibleChange }: Props) {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [eligible, setEligible] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId) {
      setEligible(false);
      setChecked(true);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/credits");
        if (!res.ok) {
          if (!cancelled) setEligible(false);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setEligible(Boolean(data.eligible_for_trial_offer));
        }
      } catch {
        if (!cancelled) setEligible(false);
      } finally {
        if (!cancelled) setChecked(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  useEffect(() => {
    onEligibleChange?.(eligible);
  }, [eligible, onEligibleChange]);

  if (!checked || !eligible) return null;

  const goToPricing = () => {
    router.push("/pricing");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        onClick={goToPricing}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            goToPricing();
          }
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.98)",
          border: "1px solid rgba(239,68,68,0.38)",
          borderRadius: 100,
          padding: "5px 16px",
          position: "relative",
          overflow: "hidden",
          cursor: "pointer",
          pointerEvents: "auto",
          backdropFilter: "blur(10px)",
          boxShadow:
            "0 0 0 1px rgba(239,68,68,0.14), 0 8px 24px rgba(15,23,42,0.12), 0 0 20px rgba(239,68,68,0.18)",
        }}
      >
        <div className="shimmer-bar" aria-hidden="true" />
        <span
          style={{
            fontSize: 14,
            color: "#ef4444",
            fontWeight: 800,
            textShadow: "0 0 18px rgba(239,68,68,0.35)",
            letterSpacing: "-0.01em",
          }}
        >
          ✨ Offre limitee
        </span>
        <span style={{ width: 1, height: 12, background: "rgba(23,19,17,0.14)" }} />
        <span style={{ fontSize: 14, color: "rgba(23,19,17,0.82)", fontWeight: 500 }}>
          Essaie le plan Starter
          <span style={{ color: "#0a0a0a", fontWeight: 800 }}> 4 jours gratuitement</span>
        </span>
        <span style={{ fontSize: 14, color: "rgba(23,19,17,0.45)", fontWeight: 800 }}>→</span>
      </div>
    </div>
  );
}
