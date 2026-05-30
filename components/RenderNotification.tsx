"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, CircleX, Clapperboard, X } from "lucide-react";
import {
  clearRenderStorage,
  DONE_VISIBLE_MS,
  normalizeRenderStorage,
  patchRenderStorage,
  readRenderStorage,
  RENDER_STORAGE_KEY,
  type RenderStorageStatus,
} from "@/lib/dashboard/render-storage";

type RenderNotif = {
  jobId: string;
  progress: number;
  status: RenderStorageStatus;
  videoUrl?: string;
  prompt?: string;
};

export default function RenderNotification() {
  const { user, isLoaded } = useUser();
  const [notif, setNotif] = useState<RenderNotif | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissNotif = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    clearRenderStorage();
    setNotif(null);
  }, []);

  const scheduleDoneDismiss = useCallback(
    (doneAt: number) => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      const remaining = DONE_VISIBLE_MS - (Date.now() - doneAt);
      const delay = Math.max(0, remaining);
      dismissTimerRef.current = setTimeout(() => {
        dismissNotif();
      }, delay);
    },
    [dismissNotif]
  );

  const applyFromStorage = useCallback(
    (currentUserId?: string | null) => {
      const raw = readRenderStorage();
      if (!raw?.jobId) {
        setNotif(null);
        return;
      }

      const data = normalizeRenderStorage(raw, currentUserId);
      if (!data) {
        dismissNotif();
        return;
      }

      if (data.status === "done" || data.status === "error") {
        setNotif({
          jobId: data.jobId,
          progress: data.progress ?? (data.status === "done" ? 100 : 0),
          status: data.status,
          videoUrl: data.videoUrl,
          prompt: data.prompt,
        });
        if (data.status === "done") {
          scheduleDoneDismiss(data.doneAt ?? data.timestamp);
        }
        return;
      }

      setNotif((prev) => {
        if (prev?.jobId === data.jobId) return prev;
        return {
          jobId: data.jobId,
          progress: data.progress ?? 0,
          status: "rendering",
          prompt: data.prompt,
        };
      });
    },
    [dismissNotif, scheduleDoneDismiss]
  );

  useEffect(() => {
    if (!isLoaded) return;

    const userId = user?.id ?? null;

    if (!userId) {
      dismissNotif();
      return;
    }

    applyFromStorage(userId);

    const onStorage = (e: StorageEvent) => {
      if (e.key === RENDER_STORAGE_KEY) {
        applyFromStorage(userId);
      }
    };
    window.addEventListener("storage", onStorage);

    const syncInterval = setInterval(() => applyFromStorage(userId), 5000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(syncInterval);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    };
  }, [isLoaded, user?.id, applyFromStorage, dismissNotif]);

  useEffect(() => {
    if (!notif || notif.status !== "rendering" || !user?.id) return;

    const data = readRenderStorage();
    if (!data?.jobId || data.jobId !== notif.jobId) return;

    if (pollRef.current) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/render/${notif.jobId}`, { cache: "no-store" });
        if (!res.ok) return;
        const statusData = await res.json();

        if (statusData.status === "queued") {
          setNotif((prev) => (prev ? { ...prev, status: "rendering", progress: 0 } : prev));
          patchRenderStorage({ progress: 0, status: "queued" });
          return;
        }

        if (typeof statusData.progress === "number") {
          setNotif((prev) => (prev ? { ...prev, progress: statusData.progress } : prev));
          patchRenderStorage({ progress: statusData.progress, status: "rendering" });
        }

        if (statusData.status === "done") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          const doneAt = Date.now();
          patchRenderStorage({
            status: "done",
            videoUrl: statusData.videoUrl,
            progress: 100,
            doneAt,
          });
          setNotif((prev) =>
            prev
              ? { ...prev, status: "done", progress: 100, videoUrl: statusData.videoUrl }
              : prev
          );
          scheduleDoneDismiss(doneAt);
        } else if (statusData.status === "error") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setNotif((prev) => (prev ? { ...prev, status: "error" } : prev));
          patchRenderStorage({ status: "error", doneAt: Date.now() });
          setTimeout(() => dismissNotif(), 8000);
        }
      } catch {
        // retry au prochain tick
      }
    }, 3000);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [notif?.jobId, notif?.status, user?.id, scheduleDoneDismiss, dismissNotif]);

  if (!notif || !user) return null;

  return (
    <div
      id="tour-notification"
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        width: 320,
        borderRadius: 16,
        background: "#161616",
        border:
          notif.status === "done"
            ? "1px solid rgba(16,185,129,0.3)"
            : notif.status === "error"
              ? "1px solid rgba(239,68,68,0.3)"
              : "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
        animation: "slideIn 0.3s ease",
        fontFamily: "inherit",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

      <div style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
        <div
          style={{
            height: "100%",
            width: `${notif.progress}%`,
            background: notif.status === "error" ? "#ef4444" : "#10B981",
            transition: "width 0.5s ease",
            boxShadow:
              notif.status !== "error" ? "0 0 8px rgba(16,185,129,0.5)" : "none",
          }}
        />
      </div>

      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              background:
                notif.status === "done"
                  ? "rgba(16,185,129,0.15)"
                  : notif.status === "error"
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color:
                notif.status === "done"
                  ? "#10B981"
                  : notif.status === "error"
                    ? "#ef4444"
                    : "#ffffff",
            }}
          >
            {notif.status === "done" ? (
              <CheckCircle2 size={18} strokeWidth={2} />
            ) : notif.status === "error" ? (
              <CircleX size={18} strokeWidth={2} />
            ) : (
              <Clapperboard size={18} strokeWidth={2} />
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 3,
                color:
                  notif.status === "done"
                    ? "#10B981"
                    : notif.status === "error"
                      ? "#ef4444"
                      : "#ffffff",
              }}
            >
              {notif.status === "done"
                ? "Vidéo générée !"
                : notif.status === "error"
                  ? "Erreur de génération"
                  : notif.progress === 0
                    ? "En file d'attente..."
                    : `Génération... ${notif.progress}%`}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {notif.prompt}
            </div>
          </div>

          <button
            type="button"
            onClick={dismissNotif}
            aria-label="Fermer la notification"
            style={{
              flexShrink: 0,
              width: 28,
              height: 28,
              borderRadius: 8,
              border: "none",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.45)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: -2,
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {notif.status === "done" && notif.videoUrl && (
          <a
            href={`/dashboard?videoUrl=${encodeURIComponent(notif.videoUrl)}`}
            onClick={dismissNotif}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginTop: 10,
              background: "#10B981",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 0",
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Voir ma vidéo →
          </a>
        )}

        {notif.status === "error" && (
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              color: "rgba(239,68,68,0.75)",
              textAlign: "center",
            }}
          >
            Erreur de rendu.
          </div>
        )}
      </div>
    </div>
  );
}
