"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Largeur max du bloc création (centré, étiré horizontalement) */
export const CREATE_LAYOUT_CLASS =
  "w-full max-w-[min(1120px,calc(100vw-148px))] mx-auto";

/** Carte principale — fond léger, sans bloc blanc massif */
export const CREATE_CARD =
  "rounded-[22px] border border-[#ebeae8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_rgba(15,23,42,0.05)] overflow-visible";

/** Padding intérieur carte — profil plat */
export const CREATE_CARD_BODY = "px-8 sm:px-10 py-5 sm:py-6";

/** Surface secondaire — léger relief */
export const CREATE_SURFACE = "rounded-[14px] bg-[#f8f7f5] border border-[#ebeae8]";

/** Carte modale / état (génération, succès) */
export const STATUS_CARD =
  "rounded-[22px] border border-[#ebeae8] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_16px_48px_rgba(15,23,42,0.06)] px-10 py-12";

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
        "text-[12px] font-medium tracking-wide text-[#a39e98] text-center uppercase",
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
        "inline-flex items-center gap-2 h-9 px-3.5 rounded-[10px] text-[13px] text-[#12110f]",
        "bg-[#f3f2f0] transition-all cursor-pointer select-none",
        active ? "bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-[#ebeae8]" : "hover:bg-[#ebeae8]/60",
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
        "w-full h-11 rounded-[11px] text-[14px] font-semibold transition-all",
        disabled
          ? "bg-[#ebeae8] text-[#a39e98] cursor-not-allowed"
          : "bg-[#12110f] text-white hover:bg-[#0a0908] shadow-[0_1px_2px_rgba(15,23,42,0.08)] active:scale-[0.995]",
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
