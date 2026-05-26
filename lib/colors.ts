export const colors = {
  // ── Accent ──────────────────────────────
  accent: "#7C3AED",
  accentHover: "#6D28D9",
  accentLight: "#a78bfa",
  accentSubtle: "#f5f3ff",
  accentBorder: "#e0d9ff",

  // ── Backgrounds ─────────────────────────
  bg: "#ffffff",
  bg2: "#fafafa",
  bg3: "#f5f5f5",

  // ── Text ────────────────────────────────
  text: "#0a0a0a",
  textSub: "#555555",
  textMuted: "#aaaaaa",
  textDisabled: "#cccccc",

  // ── Borders ─────────────────────────────
  border: "#e8e8e8",
  borderSubtle: "#f0f0f0",

  // ── States ──────────────────────────────
  success: "#30d158",
  error: "#ef4444",
  warning: "#f59e0b",

  // ── Sidebar ─────────────────────────────
  sidebarBg: "#ffffff",
  sidebarBorder: "#ebebeb",
  sidebarActive: "#0a0a0a",
  sidebarIdle: "#555555",
} as const;

export type Colors = typeof colors;

export const fonts = {
  sans: "var(--font-geist), -apple-system, sans-serif",
  mono: "var(--font-geist-mono), 'JetBrains Mono', monospace",
  display: "var(--font-geist), -apple-system, sans-serif",
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
