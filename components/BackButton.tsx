"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href, label = "Retour" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => (href ? router.push(href) : router.back())}
      style={{
        background: "none",
        border: "none",
        color: "rgba(255,255,255,0.4)",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 0",
        transition: "color 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "rgba(255,255,255,0.4)";
      }}
    >
      ← {label}
    </button>
  );
}
