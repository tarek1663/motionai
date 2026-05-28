"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CircleX, Clapperboard } from "lucide-react";

type RenderNotif = {
  jobId: string;
  progress: number;
  status: "rendering" | "done" | "error";
  videoUrl?: string;
  prompt?: string;
};

const STORAGE_KEY = "motionr_render";
const MAX_AGE_MS = 30 * 60 * 1000;

export default function RenderNotification() {
  const [notif, setNotif] = useState<RenderNotif | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkStorage = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log("🔍 RenderNotification checkStorage:", saved);
      if (!saved) return;

      try {
        const data = JSON.parse(saved) as {
          jobId: string;
          prompt?: string;
          progress?: number;
          status?: "rendering" | "done" | "error";
          videoUrl?: string;
          timestamp: number;
        };

        const age = Date.now() - data.timestamp;
        if (age > MAX_AGE_MS) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        if (!data.jobId) return;

        if (data.status === "done" || data.status === "error") {
          setNotif({
            jobId: data.jobId,
            progress: data.progress ?? 0,
            status: data.status,
            videoUrl: data.videoUrl,
            prompt: data.prompt,
          });
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

        if (!pollRef.current) {
          pollRef.current = setInterval(async () => {
            try {
              const res = await fetch(`/api/render/${data.jobId}`, { cache: "no-store" });
              if (!res.ok) return;
              const statusData = await res.json();

              if (typeof statusData.progress === "number") {
                setNotif((prev) => (prev ? { ...prev, progress: statusData.progress } : prev));
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                  const parsed = JSON.parse(raw) as Record<string, unknown>;
                  localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify({
                      ...parsed,
                      progress: statusData.progress,
                    })
                  );
                }
              }

              if (statusData.status === "done") {
                if (pollRef.current) clearInterval(pollRef.current);
                pollRef.current = null;
                setNotif((prev) =>
                  prev
                    ? { ...prev, status: "done", progress: 100, videoUrl: statusData.videoUrl }
                    : prev
                );
                const raw = localStorage.getItem(STORAGE_KEY);
                localStorage.setItem(
                  STORAGE_KEY,
                  JSON.stringify({
                    ...(raw ? (JSON.parse(raw) as Record<string, unknown>) : {}),
                    status: "done",
                    videoUrl: statusData.videoUrl,
                    progress: 100,
                  })
                );
              } else if (statusData.status === "error") {
                if (pollRef.current) clearInterval(pollRef.current);
                pollRef.current = null;
                setNotif((prev) => (prev ? { ...prev, status: "error" } : prev));
                localStorage.removeItem(STORAGE_KEY);
              }
            } catch {
              // silent retry
            }
          }, 3000);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    };

    checkStorage();
    const interval = setInterval(checkStorage, 5000);
    return () => {
      clearInterval(interval);
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, []);

  if (!notif) return null;

  return (
    <div
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

        </div>

        {notif.status === "done" && notif.videoUrl && (
          <a
            href={`/dashboard?videoUrl=${encodeURIComponent(notif.videoUrl)}`}
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setNotif(null);
            }}
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
