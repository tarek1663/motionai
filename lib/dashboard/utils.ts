import type { DashboardVideo } from "./types";

export function formatRelativeDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins}min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days}j`;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function getVideoSummary(video: DashboardVideo): string {
  const parts: string[] = [];
  if (video.format_name) parts.push(video.format_name);
  if (video.duration) parts.push(`${video.duration}s`);
  if (video.format) parts.push(video.format);
  return parts.join(" · ") || "Vidéo générée";
}
