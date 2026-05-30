export type DashboardVideo = {
  id: string;
  prompt: string;
  format_name: string;
  duration: number;
  video_url: string;
  accent_color: string;
  created_at: string;
  format: string;
};

export type DashboardScreen = "input" | "questions" | "generating" | "done" | "viewing";

export type InputTab = "prompt" | "screenshot";

export type QualityMode = "fast" | "high";

export type ScriptMode = "ai" | "script" | "appdemo";

export type DemoFormat = "desktop" | "mobile";
