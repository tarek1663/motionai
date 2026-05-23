"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

type DashDropdownProps = {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  minWidth?: number;
  align?: "left" | "right";
  maxHeight?: number;
};

export function DashDropdown({
  open,
  onClose,
  anchorRef,
  children,
  minWidth = 120,
  align = "left",
  maxHeight,
}: DashDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const menuHeight = menu?.offsetHeight ?? 200;
    const gap = 8;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placeAbove = spaceBelow < menuHeight + gap && spaceAbove > spaceBelow;

    const top = placeAbove ? rect.top - gap : rect.bottom + gap;
    const transform = placeAbove ? "translateY(-100%)" : "none";

    let left = rect.left;
    const width = Math.max(rect.width, minWidth);
    if (align === "right") {
      left = rect.right - width;
    }
    left = Math.max(8, Math.min(left, window.innerWidth - width - 8));

    setStyle({
      position: "fixed",
      top,
      left,
      minWidth: width,
      maxWidth: Math.min(width, window.innerWidth - 16),
      transform,
      visibility: "visible",
      zIndex: 10000,
      maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    });
  }, [anchorRef, minWidth, align, maxHeight]);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
  }, [open, updatePosition, children]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => updatePosition();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      onClose();
    };
    const id = requestAnimationFrame(() => {
      document.addEventListener("pointerdown", onPointerDown, true);
    });
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      data-menu
      role="listbox"
      className="dash-menu dash-menu--portal"
      style={style}
    >
      {children}
    </div>,
    document.body
  );
}
