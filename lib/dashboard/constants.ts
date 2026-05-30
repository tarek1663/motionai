import type { VoiceOption } from "@/components/ui/voice-picker-panel";
import { VOICES as VOICES_LIB } from "@/lib/voices";

export type FormatOption = {
  id: string;
  label: string;
  icon: string;
  desc: string;
};

export const VOICES: VoiceOption[] = VOICES_LIB.map((v) => ({
  id: v.id,
  name: v.name,
  style: v.style,
  gender: v.gender === "femme" ? "F" : "M",
  previewText: v.previewText,
}));

export const STATUS_LABELS: Record<string, string> = {
  scripting: "Écriture du script",
  voice: "Synthèse vocale",
  music: "Musique de fond",
  rendering: "Rendu final",
};

export const DURATIONS = ["15s", "30s", "45s", "60s", "90s", "120s"] as const;

export const MIN_SCRIPT_WORDS = 30;

export const FORMAT_OPTIONS = [
  { id: "9:16", label: "9:16", desc: "TikTok / Reels" },
  { id: "16:9", label: "16:9", desc: "YouTube" },
  { id: "1:1", label: "1:1", desc: "Instagram" },
] as const;

export const CREATE_TABS = [
  {
    id: "prompt" as const,
    label: "Brief texte",
    hint: "Tu décris ton sujet",
  },
  {
    id: "screenshot" as const,
    label: "Depuis une image",
    hint: "Interface → vidéo animée",
  },
];

export const SCREENSHOT_USE_CASES = [
  "Dashboard SaaS",
  "Landing page",
  "App mobile",
  "Pitch produit",
] as const;

export function durationToSeconds(d: string): string {
  if (d === "2min" || d === "120s") return "120";
  if (d === "90s") return "90";
  if (d === "60s") return "60";
  if (d === "45s") return "45";
  if (d === "15s") return "15";
  return "30";
}
