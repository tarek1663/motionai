import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { DashboardScreen } from "./types";

export function startRenderPoll(
  jobId: string,
  pollRef: MutableRefObject<ReturnType<typeof setInterval> | null>,
  setProgress: Dispatch<SetStateAction<number>>,
  setVideoUrl: (url: string) => void,
  setScreen: (screen: DashboardScreen) => void,
  setError: (msg: string) => void,
  onDone?: () => void,
  onCreditsRefresh?: () => void
) {
  if (pollRef.current) clearInterval(pollRef.current);
  pollRef.current = setInterval(async () => {
    const statusRes = await fetch(`/api/render/${jobId}`);
    const statusData = await statusRes.json();
    if (statusData.status === "done") {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      setProgress(100);
      setVideoUrl(statusData.videoUrl);
      setScreen("done");
      onCreditsRefresh?.();
      onDone?.();
    } else if (statusData.status === "error") {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      setError(statusData.error || "Erreur de rendu");
      setScreen("input");
    } else {
      setProgress((p) => Math.min(p + 1, 95));
    }
  }, 3000);
}
