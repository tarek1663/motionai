export const colors = {
  // ── Accent (rouge MotionAI) ──────────────────────────────
  accent: "#ef4444",
  accentHover: "#dc2626",
  accentLight: "#f87171",
  accentSubtle: "rgba(239, 68, 68, 0.12)",
  accentBorder: "rgba(239, 68, 68, 0.36)",

  // ── Backgrounds ─────────────────────────
  bg: "#ffffff",
  bg2: "#fafaf8",
  bg3: "#f5f5f5",

  // ── Text ────────────────────────────────
  text: "#171311",
  textSub: "#6f6862",
  textMuted: "#9b938c",
  textDisabled: "#c4bdb6",

  // ── Borders ─────────────────────────────
  border: "#e8e8e8",
  borderSubtle: "rgba(23,19,17,0.08)",

  // ── States ──────────────────────────────
  success: "#30d158",
  error: "#ef4444",
  warning: "#f59e0b",

  // ── Sidebar ─────────────────────────────
  sidebarBg: "#ffffff",
  sidebarBorder: "rgba(239, 68, 68, 0.2)",
  sidebarActive: "#ef4444",
  sidebarIdle: "#9b938c",
} as const;

export type Colors = typeof colors;

export const fonts = {
  sans: "inherit",
  mono: "ui-monospace, 'JetBrains Mono', monospace",
  display: "inherit",
} as const;

export type Fonts = typeof fonts;

// Helper — génère rgba depuis hex
export const rgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Helper — variantes de l'accent
export const accentAlpha = (opacity: number) => rgba(colors.accent, opacity);
