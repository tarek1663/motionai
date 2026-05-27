"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const colors = {
    success: { border: "rgba(16,185,129,0.35)", accent: "#10B981" },
    error: { border: "rgba(239,68,68,0.3)", accent: "#ef4444" },
    info: { border: "rgba(23,19,17,0.12)", accent: "#171311" },
  };

  const icons = { success: "✅", error: "❌", info: "ℹ️" };
  const c = colors[type];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#ffffff",
        border: `1px solid ${c.border}`,
        borderRadius: 12,
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 14px 34px rgba(24,19,15,0.12)",
        animation: "toastIn 0.3s ease",
        minWidth: 280,
        maxWidth: 440,
      }}
    >
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
      <span style={{ fontSize: 16 }}>{icons[type]}</span>
      <span style={{ fontSize: 13, color: "#171311", fontWeight: 600, flex: 1 }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(23,19,17,0.35)",
          cursor: "pointer",
          fontSize: 16,
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = c.accent;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "rgba(23,19,17,0.35)";
        }}
      >
        ×
      </button>
    </div>
  );
}
