"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Globe, Paperclip, Send } from "lucide-react";
import { useState } from "react";

import { useAutoResizeTextarea } from "@/components/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";

import { Textarea } from "./textarea";

interface AIInputWithSearchProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  onSubmit?: (value: string, withSearch: boolean) => void;
  onFileSelect?: (file: File) => void;
  className?: string;
}

export function AIInputWithSearch({
  id = "ai-input-with-search",
  placeholder = "Décris la vidéo que tu veux créer...",
  minHeight = 48,
  maxHeight = 164,
  onSubmit,
  onFileSelect,
  className,
}: AIInputWithSearchProps) {
  const [value, setValue] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit?.(value, showSearch);
    setValue("");
    adjustHeight(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect?.(file);
    }
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative mx-auto w-full max-w-xl">
        <div className="relative flex flex-col">
          <div className="overflow-y-auto" style={{ maxHeight: `${maxHeight}px` }}>
            <Textarea
              id={id}
              ref={textareaRef}
              value={value}
              placeholder={placeholder}
              className="w-full rounded-2xl rounded-b-none border-none bg-transparent px-5 py-4 text-[15px] leading-[1.5] text-white placeholder:text-white/35 focus-visible:ring-0"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="h-14 rounded-b-2xl border-t border-white/10 bg-transparent">
            <div className="absolute bottom-3 left-4 flex items-center gap-2">
              <label className="cursor-pointer rounded-full border border-white/10 bg-white/5 p-2">
                <input type="file" className="hidden" onChange={handleFileChange} />
                <Paperclip className="h-4 w-4 text-white/45 transition-colors hover:text-white" />
              </label>

              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "flex h-9 items-center gap-2 rounded-full border px-2 py-1 transition-all",
                  showSearch
                    ? "border-white/15 bg-white/10 text-white"
                    : "border-transparent bg-transparent text-white/40 hover:text-white"
                )}
              >
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: showSearch ? 180 : 0,
                      scale: showSearch ? 1.1 : 1,
                    }}
                    whileHover={{
                      rotate: showSearch ? 180 : 15,
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    <Globe
                      className={cn(
                        "h-4 w-4",
                        showSearch ? "text-white" : "text-inherit"
                      )}
                    />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden whitespace-nowrap text-sm text-white"
                    >
                      Web
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>

            <div className="absolute bottom-3 right-3">
              <button
                type="button"
                onClick={handleSubmit}
                className={cn(
                  "rounded-full border p-2.5 transition-colors",
                  value
                    ? "border-white bg-white text-black"
                    : "border-white/10 bg-white/5 text-white/40 hover:text-white"
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
