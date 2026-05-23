"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SuggestionChip = {
  icon: ReactNode;
  label: string;
  prompt?: string;
};

type PromptSuggestionsProps = {
  items: SuggestionChip[];
  onSelect: (text: string) => void;
  className?: string;
};

export function PromptSuggestions({ items, onSelect, className }: PromptSuggestionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 justify-center w-full", className)}>
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item.prompt ?? item.label);
          }}
          className={cn(
            "inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full cursor-pointer",
            "bg-white/50 text-[14px] text-[#1d1d1f] border border-black/[0.03]",
            "hover:bg-white/70 transition-colors duration-150"
          )}
        >
          <span className="text-[#86868b] [&_svg]:size-[18px]">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}
