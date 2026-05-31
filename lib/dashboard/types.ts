export type DashboardVideo = {
  id: string;
  prompt: string;
  title?: string;
  format_name: string;
  duration: number;
  video_url: string;
  accent_color: string;
  created_at: string;
  format: string;
  status?: string;
};

export type DashboardScreen =
  | "input"
  | "questions"
  | "generating"
  | "done"
  | "viewing"
  | "pricing";

export type InputTab = "prompt" | "screenshot";

export type QualityMode = "fast" | "high";

export type ScriptMode = "ai" | "script";
