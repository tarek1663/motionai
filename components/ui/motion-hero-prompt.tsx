"use client";

import { motion } from "framer-motion";
import {
  ArrowUp,
  AudioLines,
  ChevronDown,
  Clock3,
  FileText,
  Globe,
  Music2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";
import { DURATIONS, FORMAT_OPTIONS, VOICES } from "@/lib/dashboard/constants";
import { cn } from "@/lib/utils";

import { Textarea } from "./textarea";

export type MotionHeroPromptPayload = {
  prompt: string;
  withSearch: boolean;
  scriptMode: boolean;
  duration: string;
  format: string;
  voiceId: string;
  musicEnabled: boolean;
};

type MotionHeroPromptProps = {
  className?: string;
  onSubmit: (payload: MotionHeroPromptPayload) => void;
};

export function MotionHeroPrompt({
  className,
  onSubmit,
}: MotionHeroPromptProps) {
  const [value, setValue] = useState("");
  const [withSearch, setWithSearch] = useState(false);
  const [scriptMode, setScriptMode] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("30s");
  const [format, setFormat] = useState<(typeof FORMAT_OPTIONS)[number]["id"]>("9:16");
  const [voiceId, setVoiceId] = useState(VOICES[0]?.id ?? "");
  const [openMenu, setOpenMenu] = useState<null | "duration" | "format" | "voice">(null);

  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 80,
    maxHeight: 220,
  });

  const placeholder = scriptMode
    ? "Crée une vidéo de lancement pour Spotify"
    : withSearch
      ? "Crée une vidéo de lancement pour Spotify"
      : "Crée une vidéo de lancement pour Spotify";

  useEffect(() => {
    adjustHeight();
  }, [adjustHeight, value]);

  useEffect(() => {
    const closeMenus = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-hero-menu]")) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const submit = () => {
    if (!value.trim()) return;

    onSubmit({
      prompt: value.trim(),
      withSearch,
      scriptMode,
      duration,
      format,
      voiceId,
      musicEnabled,
    });
  };

  const toggleSearch = () => {
    setWithSearch((current) => {
      const next = !current;
      if (next) setScriptMode(false);
      return next;
    });
  };

  const toggleScript = () => {
    setScriptMode((current) => {
      const next = !current;
      if (next) setWithSearch(false);
      return next;
    });
  };

  return (
    <div
      className={cn(
        "w-full rounded-[28px] border border-[#e8e8e8] bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      <div className="overflow-y-auto" style={{ maxHeight: 220 }}>
        <Textarea
          ref={textareaRef}
          value={value}
          placeholder={placeholder}
          rows={3}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          className="min-h-[68px] w-full resize-none rounded-[22px] border-none bg-transparent px-4 py-3 text-[15px] font-medium leading-[1.55] text-[#0a0a0a] placeholder:text-[#888] focus-visible:ring-0"
        />
      </div>

      <div className="mt-2 flex flex-col gap-3 border-t border-[#f0f0f0] px-1 pt-3">
        <div className="flex flex-wrap items-center gap-2" data-hero-menu>
          <TogglePill
            active={withSearch}
            onClick={toggleSearch}
            icon={<Globe className="h-4 w-4" />}
            label="Web"
          />

          <TogglePill
            active={scriptMode}
            onClick={toggleScript}
            icon={<FileText className="h-4 w-4" />}
            label="Script"
          />

          <MenuAnchor>
            <ToolbarPill
              active={openMenu === "duration"}
              onClick={() => setOpenMenu(openMenu === "duration" ? null : "duration")}
              icon={<Clock3 className="h-4 w-4" />}
              label={duration}
              trailing={<ChevronDown className="h-4 w-4 text-[#888]" />}
            />
            <Dropdown open={openMenu === "duration"}>
              {DURATIONS.map((item) => (
                <DropdownOption
                  key={item}
                  selected={duration === item}
                  onClick={() => {
                    setDuration(item);
                    setOpenMenu(null);
                  }}
                >
                  {item}
                </DropdownOption>
              ))}
            </Dropdown>
          </MenuAnchor>

          <MenuAnchor>
            <ToolbarPill
              active={openMenu === "format"}
              onClick={() => setOpenMenu(openMenu === "format" ? null : "format")}
              label={format}
              trailing={<ChevronDown className="h-4 w-4 text-[#888]" />}
            />
            <Dropdown open={openMenu === "format"}>
              {FORMAT_OPTIONS.map((item) => (
                <DropdownOption
                  key={item.id}
                  selected={format === item.id}
                  onClick={() => {
                    setFormat(item.id);
                    setOpenMenu(null);
                  }}
                >
                  <div className="flex items-center justify-between gap-5">
                    <span>{item.label}</span>
                    <span className="text-[11px] text-[#aaa]">{item.desc}</span>
                  </div>
                </DropdownOption>
              ))}
            </Dropdown>
          </MenuAnchor>

          <MenuAnchor>
            <ToolbarPill
              active={openMenu === "voice"}
              onClick={() => setOpenMenu(openMenu === "voice" ? null : "voice")}
              icon={<AudioLines className="h-4 w-4" />}
              label="Voix"
              trailing={<ChevronDown className="h-4 w-4 text-[#888]" />}
            />
            <Dropdown open={openMenu === "voice"} className="min-w-[220px]">
              {VOICES.slice(0, 8).map((voice) => (
                <DropdownOption
                  key={voice.id}
                  selected={voiceId === voice.id}
                  onClick={() => {
                    setVoiceId(voice.id);
                    setOpenMenu(null);
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>{voice.name}</span>
                    <span className="text-[11px] text-[#aaa]">{voice.style}</span>
                  </div>
                </DropdownOption>
              ))}
            </Dropdown>
          </MenuAnchor>

          <ToolbarPill
            active={musicEnabled}
            onClick={() => setMusicEnabled((current) => !current)}
            icon={<Music2 className="h-4 w-4" />}
            label="Musique"
          />
        </div>

        <div className="flex items-center justify-end gap-4 px-1">
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200",
              value.trim()
                ? "border-[#7C3AED] bg-[#7C3AED] text-white shadow-[0_10px_20px_rgba(124,58,237,0.18)] hover:scale-[1.02]"
                : "cursor-not-allowed border-[#e8e8e8] bg-[#f5f5f7] text-[#aaa]"
            )}
          >
            <ArrowUp className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuAnchor({ children }: { children: React.ReactNode }) {
  return <div className="relative" data-hero-menu>{children}</div>;
}

function ToolbarPill({
  active,
  onClick,
  icon,
  label,
  trailing,
}: {
  active?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] transition-colors",
        active
          ? "border-[#7C3AED]/12 bg-[#F5F3FF] text-[#7C3AED] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          : "border-[#e8e8e8] bg-[#ffffff] text-[#666] hover:bg-[#fafafa] hover:text-[#0a0a0a]"
      )}
    >
      {icon ? <span className={cn(active ? "text-[#7C3AED]" : "text-[#888]")}>{icon}</span> : null}
      <span className="max-w-[88px] truncate">{label}</span>
      {trailing}
    </button>
  );
}

function TogglePill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-full border px-3 transition-all",
        active
          ? "border-[#7C3AED]/12 bg-[#F5F3FF] text-[#7C3AED] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          : "border-[#e8e8e8] bg-[#ffffff] text-[#666] hover:bg-[#fafafa] hover:text-[#0a0a0a]"
      )}
    >
      <motion.span
        animate={{ rotate: active ? 180 : 0, scale: active ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="flex h-4 w-4 items-center justify-center"
      >
        {icon}
      </motion.span>
      <span className="text-[13px]">{label}</span>
    </button>
  );
}

function Dropdown({
  open,
  children,
  className,
}: {
  open: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute left-0 top-full z-30 mt-2 min-w-[140px] overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white p-1 shadow-[0_16px_40px_rgba(15,23,42,0.08)]",
        className
      )}
      data-hero-menu
    >
      {children}
    </div>
  );
}

function DropdownOption({
  children,
  selected,
  onClick,
}: {
  children: React.ReactNode;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "block w-full rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors",
        selected
          ? "bg-[#F5F3FF] text-[#7C3AED]"
          : "text-[#666] hover:bg-[#fafafa] hover:text-[#0a0a0a]"
      )}
      data-hero-menu
    >
      {children}
    </button>
  );
}
