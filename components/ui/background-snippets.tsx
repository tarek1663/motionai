"use client";

import { cn } from "@/lib/utils";

type DashboardPageBackgroundProps = {
  className?: string;
  /** fixed = plein viewport ; absolute = remplit le parent positionné */
  variant?: "fixed" | "absolute";
};

/**
 * Fond dashboard : gris + ombrages blancs discrets.
 */
export function DashboardPageBackground({
  className,
  variant = "absolute",
}: DashboardPageBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "dash-page-background pointer-events-none -z-10 h-full w-full",
        variant === "fixed" ? "fixed inset-0" : "absolute inset-0",
        className
      )}
    >
      <div className="dash-page-background__base absolute inset-0" />
      <div className="dash-page-background__glow dash-page-background__glow--primary absolute inset-0" />
      <div className="dash-page-background__glow dash-page-background__glow--secondary absolute inset-0" />
      <div className="dash-page-background__glow dash-page-background__glow--accent absolute inset-0" />
    </div>
  );
}

/** Alias du snippet d’intégration */
export const Component = DashboardPageBackground;

export default DashboardPageBackground;
