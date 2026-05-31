import type { DashboardVideo } from "./types";

type RawVideo = Record<string, unknown>;

export function normalizeDashboardVideo(row: RawVideo): DashboardVideo | null {
  const id = row.id != null ? String(row.id) : "";
  if (!id) return null;

  const prompt =
    typeof row.prompt === "string"
      ? row.prompt
      : typeof row.title === "string"
        ? row.title
        : "";

  const title = typeof row.title === "string" ? row.title : undefined;

  const video_url =
    (typeof row.video_url === "string" && row.video_url) ||
    (typeof row.videoUrl === "string" && row.videoUrl) ||
    (typeof row.url === "string" && row.url) ||
    "";

  return {
    id,
    prompt,
    title,
    format_name: typeof row.format_name === "string" ? row.format_name : "",
    duration: typeof row.duration === "number" ? row.duration : Number(row.duration) || 0,
    video_url,
    accent_color: typeof row.accent_color === "string" ? row.accent_color : "",
    created_at:
      typeof row.created_at === "string"
        ? row.created_at
        : new Date().toISOString(),
    format: typeof row.format === "string" ? row.format : "",
    status: typeof row.status === "string" ? row.status : undefined,
  };
}

export function normalizeDashboardVideos(raw: unknown): DashboardVideo[] {
  const rows = Array.isArray(raw) ? raw : [];
  return rows
    .map((row) => normalizeDashboardVideo(row as RawVideo))
    .filter((v): v is DashboardVideo => v != null);
}

export function getVideoDisplayTitle(video: DashboardVideo): string {
  return (
    video.title?.trim() ||
    video.prompt?.trim()?.slice(0, 30) ||
    "Vidéo sans titre"
  );
}
