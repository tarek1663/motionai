import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { DashboardScreen } from "./types";

export function startRenderPoll(
  jobId: string,
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>,
  setProgress: Dispatch<SetStateAction<number>>,
  setVideoUrl: (url: string) => void,
  setScreen: (screen: DashboardScreen) => void,
  setError: (msg: string) => void,
  setStatus?: (status: string) => void,
  onDone?: () => void,
  onCreditsRefresh?: () => void,
  onPipelineEnd?: () => void
) {
  if (pollRef.current) clearInterval(pollRef.current);
  pollRef.current = setInterval(async () => {
    try {
      const statusRes = await fetch(`/api/render/${jobId}`, {
        cache: "no-store",
      });

      if (!statusRes.ok) {
        console.log("⚠️ Polling error status:", statusRes.status);
        return;
      }

      const statusData = await statusRes.json();

      if (statusData.status === "queued") {
        setStatus?.("queued");
        setProgress(0);
        return;
      }

      if (statusData.status === "rendering") {
        setStatus?.("rendering");
        if (typeof statusData.progress === "number") {
          setProgress(statusData.progress);
        }
      } else if (typeof statusData.progress === "number" && statusData.progress > 0) {
        setProgress(statusData.progress);
      }

      if (statusData.status === "done") {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setProgress(100);
        setVideoUrl(statusData.videoUrl);
        setScreen("done");
        onPipelineEnd?.();
        onCreditsRefresh?.();
        onDone?.();
      } else if (statusData.status === "error") {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setError(statusData.error || "Erreur de rendu");
        onPipelineEnd?.();
        setScreen("input");
      }
    } catch (err) {
      console.log("⚠️ Polling retry...", err);
    }
  }, 2000);
}
