export type VisualStyle = "bold" | "clean" | "editorial" | "vibrant";

export type OnboardingPreferences = {
  user_id: string;
  completed: boolean;
  accent_color: string;
  visual_style: VisualStyle;
  default_voice_id: string;
  default_format: string;
  default_duration: string;
  created_at?: string;
  updated_at?: string;
};

export const DEFAULT_PREFERENCES: Omit<OnboardingPreferences, "user_id"> = {
  completed: true,
  accent_color: "#7C3AED",
  visual_style: "clean",
  default_voice_id: "21m00Tcm4TlvDq8ikWAM",
  default_format: "9:16",
  default_duration: "30s",
};

export const VISUAL_STYLES: { id: VisualStyle; label: string; desc: string }[] = [
  { id: "bold", label: "Bold", desc: "Contrastes forts, titres massifs" },
  { id: "clean", label: "Clean", desc: "Minimal, aéré, professionnel" },
  { id: "editorial", label: "Editorial", desc: "Magazine, élégant, serif vibes" },
  { id: "vibrant", label: "Vibrant", desc: "Couleurs vives, énergique" },
];

export const PLAN_LIMITS = {
  gratuit: { label: "Gratuit", credits: 3 },
  pro: { label: "Pro", credits: 30 },
  business: { label: "Business", credits: 100 },
} as const;
