"use client";

import type { LucideIcon } from "lucide-react";
import { colors } from "@/lib/colors";

export function DashboardIcon({
  icon: Icon,
  size = 16,
  color = colors.textSub,
}: {
  icon: LucideIcon;
  size?: number;
  color?: string;
}) {
  return <Icon size={size} strokeWidth={1.75} color={color} style={{ flexShrink: 0 }} />;
}
