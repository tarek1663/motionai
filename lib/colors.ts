export const colors = {
  // ── Accent ──────────────────────────────
  accent: "#0d9668",
  accentHover: "#0a7f59",
  accentLight: "#34d399",
  accentSubtle: "rgba(16,185,129,0.12)",
  accentBorder: "rgba(16,185,129,0.36)",

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
  sidebarBorder: "rgba(16,185,129,0.2)",
  sidebarActive: "#10B981",
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
