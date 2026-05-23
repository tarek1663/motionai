"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Largeur max du bloc création (centré, étiré horizontalement) */
export const CREATE_LAYOUT_CLASS =
  "w-full max-w-[min(1120px,calc(100vw-148px))] mx-auto";

/** Carte principale — fond léger, sans bloc blanc massif */
export const CREATE_CARD =
  "rounded-[18px] border border-black/[0.04] bg-[#f5f5f7]/80 overflow-visible";

/** Padding intérieur carte — profil plat */
export const CREATE_CARD_BODY = "px-8 sm:px-10 py-5 sm:py-6";

/** Surface secondaire — léger relief */
export const CREATE_SURFACE = "rounded-[14px] bg-white/55 border border-black/[0.03]";

/** Carte modale / état (génération, succès) */
export const STATUS_CARD =
  "rounded-[20px] border border-black/[0.04] bg-[#f5f5f7]/90 px-10 py-12";

export function SectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[13px] font-medium text-[#86868b] text-center",
        className
      )}
    >
      {children}
    </p>
  );
}

export function DashboardToolbarButton({
  active,
  onClick,
  children,
  title,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "inline-flex items-center gap-2 h-10 px-4 rounded-full text-[14px] text-[#1d1d1f]",
        "bg-white/70 transition-colors cursor-pointer select-none",
        active ? "bg-white/90 shadow-[0_1px_2px_rgba(0,0,0,0.05)]" : "opacity-90 hover:bg-white/80",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DashboardPrimaryButton({
  children,
  disabled,
  onClick,
  className,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-11 rounded-full text-[15px] font-medium transition-colors",
        disabled
          ? "bg-[#e8e8ed] text-[#86868b] cursor-not-allowed"
          : "bg-[#1d1d1f] text-white hover:bg-black active:scale-[0.99]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropMenuPanel({
  open,
  children,
  align = "left",
}: {
  open: boolean;
  children: ReactNode;
  align?: "left" | "right";
}) {
  if (!open) return null;
  return (
    <div
      data-menu
      className={cn(
        "absolute top-full mt-1.5 py-1 min-w-[108px] rounded-xl",
        "border border-black/[0.06] bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-50",
        align === "left" ? "left-0" : "right-0"
      )}
    >
      {children}
    </div>
  );
}

export function DropMenuItem({
  selected,
  onSelect,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-menu
      onMouseDown={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "block w-full text-left px-3.5 py-2 text-[13px] cursor-pointer transition-colors",
        selected ? "bg-[#f5f5f7] text-[#1d1d1f] font-medium" : "text-[#1d1d1f]/80 hover:bg-[#f5f5f7]"
      )}
    >
      {children}
    </button>
  );
}
