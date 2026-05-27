export const colors = {
  // ── Accent ──────────────────────────────
  accent: "#10B981",
  accentHover: "#0ea271",
  accentLight: "#34d399",
  accentSubtle: "rgba(16,185,129,0.12)",
  accentBorder: "rgba(16,185,129,0.36)",

  // ── Backgrounds ─────────────────────────
  bg: "#0a0a0a",
  bg2: "#111111",
  bg3: "#161616",

  // ── Text ────────────────────────────────
  text: "#ffffff",
  textSub: "rgba(255,255,255,0.7)",
  textMuted: "rgba(255,255,255,0.5)",
  textDisabled: "rgba(255,255,255,0.3)",

  // ── Borders ─────────────────────────────
  border: "rgba(255,255,255,0.1)",
  borderSubtle: "rgba(255,255,255,0.06)",

  // ── States ──────────────────────────────
  success: "#30d158",
  error: "#ef4444",
  warning: "#f59e0b",

  // ── Sidebar ─────────────────────────────
  sidebarBg: "#111111",
  sidebarBorder: "rgba(255,255,255,0.06)",
  sidebarActive: "#10B981",
  sidebarIdle: "rgba(255,255,255,0.6)",
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
