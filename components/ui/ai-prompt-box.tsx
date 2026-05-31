"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Mic,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  VoicePickerPanel,
  type VoiceOption,
} from "@/components/ui/voice-picker-panel";
import { FORMAT_OPTIONS } from "@/lib/dashboard/constants";

/* ——— Radix primitives ——— */
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[200] rounded-lg border border-white/10 bg-[#1a1a1a] px-2.5 py-1 text-[11px] text-white/90 shadow-lg",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn("z-[200] outline-none", className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/* ——— Compound layout (structure ai-prompt-box) ——— */
type PromptInputContextValue = {
  value: string;
  setValue: (v: string) => void;
  maxHeight: number;
  onSubmit?: () => void;
  disabled?: boolean;
};

const PromptInputContext = React.createContext<PromptInputContextValue | null>(null);

function usePromptInput() {
  const ctx = React.useContext(PromptInputContext);
  if (!ctx) throw new Error("usePromptInput must be used within PromptInput");
  return ctx;
}

function PromptInput({
  className,
  value,
  onValueChange,
  maxHeight = 120,
  onSubmit,
  disabled,
  children,
}: {
  className?: string;
  value: string;
  onValueChange: (v: string) => void;
  maxHeight?: number;
  onSubmit?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={120}>
      <PromptInputContext.Provider
        value={{ value, setValue: onValueChange, maxHeight, onSubmit, disabled }}
      >
        <div className={cn("ai-prompt-box", className)}>{children}</div>
      </PromptInputContext.Provider>
    </TooltipProvider>
  );
}

const PromptInputTextarea = React.forwardRef<
  HTMLTextAreaElement,
  {
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    className?: string;
  }
>(({ placeholder, onKeyDown, className }, forwardedRef) => {
  const { value, setValue, maxHeight, onSubmit, disabled } = usePromptInput();
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useImperativeHandle(forwardedRef, () => ref.current!, []);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, [value, maxHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
    onKeyDown?.(e);
  };

  return (
    <textarea
      ref={ref}
      rows={1}
      value={value}
      disabled={disabled}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={cn("ai-prompt-box__textarea", className)}
    />
  );
});
PromptInputTextarea.displayName = "PromptInputTextarea";

function PromptInputActions({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("ai-prompt-box__actions", className)}>{children}</div>
  );
}

function PromptInputAction({
  tooltip,
  children,
  side = "top",
}: {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

/* ——— MotionAI dashboard prompt ——— */
export type AiPromptBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  format: string;
  onFormatChange: (formatId: string) => void;
  formatIcons: Record<string, LucideIcon>;
  voices: VoiceOption[];
  selectedVoiceId: string;
  onVoiceChange: (id: string) => void;
  canSubmit: boolean;
  onSubmit: () => void;
  cooldown?: number;
  onPickerOpenChange?: (open: boolean) => void;
  className?: string;
};

export const AiPromptBox = React.forwardRef<HTMLTextAreaElement, AiPromptBoxProps>(
  (
    {
      value,
      onChange,
      onKeyDown,
      placeholder,
      format,
      onFormatChange,
      formatIcons,
      voices,
      selectedVoiceId,
      onVoiceChange,
      canSubmit,
      onSubmit,
      cooldown = 0,
      onPickerOpenChange,
      className,
    },
    ref
  ) => {
    const [formatOpen, setFormatOpen] = React.useState(false);
    const [voiceOpen, setVoiceOpen] = React.useState(false);

    const selectedVoice = voices.find((v) => v.id === selectedVoiceId);
    const selectedFormat =
      FORMAT_OPTIONS.find((o) => o.id === format) ?? FORMAT_OPTIONS[0];
    const FormatIcon = formatIcons[format] ?? formatIcons["9:16"];
    const isPickerOpen = formatOpen || voiceOpen;

    React.useEffect(() => {
      onPickerOpenChange?.(isPickerOpen);
    }, [isPickerOpen, onPickerOpenChange]);

    const handleSubmit = () => {
      setFormatOpen(false);
      setVoiceOpen(false);
      onSubmit();
    };

    return (
      <PromptInput
        className={className}
        value={value}
        onValueChange={onChange}
        onSubmit={handleSubmit}
      >
        <PromptInputTextarea
          ref={ref}
          placeholder={placeholder}
          onKeyDown={onKeyDown}
        />

        <PromptInputActions>
          <div className="ai-prompt-box__actions-left">
            <Popover
              open={formatOpen}
              onOpenChange={(open) => {
                setFormatOpen(open);
                if (open) setVoiceOpen(false);
              }}
            >
              <PromptInputAction tooltip="Format vidéo">
                <PopoverTrigger asChild>
                  <button
                    id="tour-format"
                    type="button"
                    aria-expanded={formatOpen}
                    className={cn(
                      "ai-prompt-box__chip",
                      formatOpen && "ai-prompt-box__chip--active"
                    )}
                  >
                    <FormatIcon size={14} strokeWidth={1.75} aria-hidden />
                    <span>{selectedFormat.label}</span>
                    <ChevronDown
                      size={12}
                      className={cn("ai-prompt-box__chevron", formatOpen && "is-open")}
                    />
                  </button>
                </PopoverTrigger>
              </PromptInputAction>
              <PopoverContent
                side="top"
                align="start"
                className="p-0 border-0 bg-transparent shadow-none"
              >
                <div
                  className="dash-input-format-panel dash-input-format-panel--popover dash-input-format-panel--discrete"
                  role="listbox"
                >
                  {FORMAT_OPTIONS.map((f) => {
                    const Icon = formatIcons[f.id] ?? FormatIcon;
                    const isActive = format === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={cn("dash-input-format-option", isActive && "is-active")}
                        onClick={() => {
                          onFormatChange(f.id);
                          setFormatOpen(false);
                        }}
                      >
                        <Icon size={13} strokeWidth={1.75} aria-hidden />
                        <span className="dash-input-format-option__label">{f.label}</span>
                        <span className="dash-input-format-option__desc">{f.desc}</span>
                        {isActive && (
                          <Check
                            size={13}
                            strokeWidth={2.5}
                            className="dash-input-format-option__check"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            <span className="ai-prompt-box__divider" aria-hidden />

            <Popover
              open={voiceOpen}
              onOpenChange={(open) => {
                setVoiceOpen(open);
                if (open) setFormatOpen(false);
              }}
            >
              <PromptInputAction tooltip="Voix off">
                <PopoverTrigger asChild>
                  <button
                    id="tour-voice"
                    type="button"
                    aria-expanded={voiceOpen}
                    title={selectedVoice?.style}
                    className={cn(
                      "ai-prompt-box__chip",
                      voiceOpen && "ai-prompt-box__chip--active"
                    )}
                  >
                    <Mic size={14} strokeWidth={1.75} aria-hidden />
                    <span>{selectedVoice?.name || "Voix"}</span>
                    <ChevronDown
                      size={12}
                      className={cn("ai-prompt-box__chevron", voiceOpen && "is-open")}
                    />
                  </button>
                </PopoverTrigger>
              </PromptInputAction>
              <PopoverContent
                side="top"
                align="start"
                className="p-0 border-0 bg-transparent shadow-none w-[min(100vw-2rem,420px)]"
              >
                <div className="dash-input-voice-panel dash-input-voice-panel--popover">
                  <VoicePickerPanel
                    open={voiceOpen}
                    onClose={() => setVoiceOpen(false)}
                    voices={voices}
                    selectedId={selectedVoiceId}
                    onSelect={(id) => {
                      onVoiceChange(id);
                      setVoiceOpen(false);
                    }}
                    variant="dash"
                    hint="Choisis une voix et écoute un aperçu avant de générer."
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <PromptInputAction tooltip="Générer la vidéo">
            <button
              id="tour-generate"
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                "ai-prompt-box__send",
                canSubmit && "ai-prompt-box__send--ready",
                cooldown > 0 && "is-countdown"
              )}
              aria-label="Générer"
            >
              {cooldown > 0 ? (
                <span className="text-[10px] font-semibold tabular-nums">{cooldown}s</span>
              ) : (
                <ArrowUp size={16} strokeWidth={2.5} />
              )}
            </button>
          </PromptInputAction>
        </PromptInputActions>
      </PromptInput>
    );
  }
);

AiPromptBox.displayName = "AiPromptBox";

export const PromptInputBox = AiPromptBox;
export const VideoPromptBox = AiPromptBox;
