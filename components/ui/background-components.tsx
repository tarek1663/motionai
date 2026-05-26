"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type GlowVariant = "yellow" | "green";

type BackgroundComponentsProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: GlowVariant;
};

const glowStyles: Record<
  GlowVariant,
  {
    innerStyle: React.CSSProperties;
    secondaryStyle?: React.CSSProperties;
  }
> = {
  yellow: {
    innerStyle: {
      left: "4%",
      right: "4%",
      top: "2%",
      bottom: "-10%",
      backgroundImage:
        "radial-gradient(circle at center, rgba(255,249,145,0.90) 0%, rgba(255,249,145,0.45) 22%, rgba(255,249,145,0) 72%)",
      filter: "blur(54px)",
      opacity: 0.55,
      mixBlendMode: "multiply",
    },
  },
  green: {
    innerStyle: {
      left: "-10%",
      right: "-10%",
      top: "-8%",
      bottom: "-18%",
      backgroundImage:
        "radial-gradient(ellipse at center, rgba(16,185,129,0.28) 0%, rgba(16,185,129,0.18) 26%, rgba(16,185,129,0.08) 48%, rgba(16,185,129,0) 74%)",
      filter: "blur(64px)",
      opacity: 1,
    },
    secondaryStyle: {
      left: "-2%",
      right: "-2%",
      top: "-2%",
      bottom: "-10%",
      backgroundImage:
        "radial-gradient(ellipse at center, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0) 68%)",
      filter: "blur(40px)",
      opacity: 0.95,
    },
  },
};

export function BackgroundComponents({
  className,
  glow = "green",
  style,
  ...props
}: BackgroundComponentsProps) {
  const glowStyle = glowStyles[glow];

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 z-0 overflow-visible", className)}
      style={style}
      {...props}
    >
      <div
        className="absolute"
        style={{
          ...glowStyle.innerStyle,
        }}
      />
      {glowStyle.secondaryStyle ? (
        <div
          className="absolute"
          style={{
            ...glowStyle.secondaryStyle,
          }}
        />
      ) : null}
    </div>
  );
}

export const Component = BackgroundComponents;

export default BackgroundComponents;
