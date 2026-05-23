"use client";

import { cn } from "@/lib/utils";
import { CREATE_CARD, CREATE_LAYOUT_CLASS } from "@/components/dashboard/ui";
import type { ClarificationQuestion } from "@/lib/dashboard/questions";

const ACCENT = "#7C3AED";

type Props = {
  prompt: string;
  questions: ClarificationQuestion[];
  answers: Record<string, string>;
  currentQ: number;
  onSelectAnswer: (questionId: string, optionId: string) => void;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
  onSkip: () => void;
};

export function QuestionsScreen({
  prompt,
  questions,
  answers,
  currentQ,
  onSelectAnswer,
  onBack,
  onNext,
  onGenerate,
  onSkip,
}: Props) {
  const q = questions[currentQ];
  if (!q) return null;

  const hasAnswer = Boolean(answers[q.id]);
  const isLast = currentQ >= questions.length - 1;

  return (
    <div className={CREATE_LAYOUT_CLASS}>
      <div className="flex justify-end mb-6">
        <div className="px-4 py-2.5 bg-[#1d1d1f] text-white rounded-[18px_18px_4px_18px] text-[13px] font-medium max-w-[85%] leading-relaxed">
          {prompt}
        </div>
      </div>

      <div className={CREATE_CARD}>
        <div className="px-5 py-4 border-b border-black/[0.04] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
          <span className="text-[13px] font-semibold text-[#86868b]">Questions</span>
        </div>

        <div className="px-6 sm:px-8 py-6 sm:py-8">
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-[#1d1d1f] tracking-tight mb-5 leading-snug">
            {q.question}
          </h2>

          <div className="flex flex-col gap-2.5 mb-8">
            {q.options?.map((opt) => {
              const selected = answers[q.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onSelectAnswer(q.id, opt.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl flex items-start gap-3 transition-all",
                    selected
                      ? "bg-violet-50/80 border border-violet-300/60"
                      : "bg-white/40 border border-black/[0.04] hover:bg-white/70"
                  )}
                >
                  <span
                    className={cn(
                      "w-[18px] h-[18px] rounded-full shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors",
                      selected ? "border-violet-600 bg-violet-600" : "border-[#ccc]"
                    )}
                  >
                    {selected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white block" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-[14px] font-semibold",
                        selected ? "text-[#1d1d1f]" : "text-[#333]"
                      )}
                    >
                      {opt.label}
                    </span>
                    {opt.desc ? (
                      <span className="block text-[12px] text-[#86868b] mt-1 leading-relaxed">
                        {opt.desc}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 rounded-lg border border-black/[0.08] text-[13px] font-semibold text-[#666] hover:bg-white/50"
            >
              ← Retour
            </button>

            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === currentQ ? "w-5 bg-violet-600" : "w-1.5 bg-[#e8e8ed]"
                  )}
                />
              ))}
            </div>

            {isLast ? (
              <button
                type="button"
                onClick={onGenerate}
                disabled={!hasAnswer}
                className={cn(
                  "px-5 py-2 rounded-lg text-[13px] font-bold text-white transition-all",
                  hasAnswer
                    ? "hover:opacity-90"
                    : "opacity-40 cursor-not-allowed"
                )}
                style={
                  hasAnswer
                    ? { background: ACCENT, boxShadow: `0 4px 16px ${ACCENT}44` }
                    : { background: "#e8e8ed", color: "#86868b" }
                }
              >
                Générer →
              </button>
            ) : (
              <button
                type="button"
                onClick={onNext}
                disabled={!hasAnswer}
                className={cn(
                  "px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors",
                  hasAnswer
                    ? "bg-[#1d1d1f] text-white hover:bg-black"
                    : "bg-[#e8e8ed] text-[#86868b] cursor-not-allowed"
                )}
              >
                Suivant →
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-[12px] text-[#aeaeb2] hover:text-[#86868b]"
        >
          Passer et générer directement
        </button>
      </div>
    </div>
  );
}
