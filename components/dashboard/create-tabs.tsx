"use client";

import { cn } from "@/lib/utils";
import { CREATE_TABS } from "@/lib/dashboard/constants";

type TabId = (typeof CREATE_TABS)[number]["id"];

export function CreateTabs({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  return (
    <div
      className="mx-6 mt-5 sm:mx-8 sm:mt-6 flex p-1 rounded-[12px] bg-black/[0.03]"
      role="tablist"
    >
      {CREATE_TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center sm:flex-row sm:justify-center sm:gap-2",
              "py-2.5 px-4 rounded-[10px] transition-all duration-200 ease-out",
              isActive
                ? "bg-white/90 text-[#1d1d1f] shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                : "text-[#86868b] hover:text-[#1d1d1f]"
            )}
          >
            <span className="text-[14px] font-medium leading-snug">{tab.label}</span>
            <span
              className={cn(
                "text-[12px] leading-snug sm:mt-0 mt-1",
                isActive ? "text-[#86868b]" : "text-[#aeaeb2]"
              )}
            >
              {tab.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}
