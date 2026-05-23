"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { copy } from "@/lib/dashboard/copy";
import {
  getSelectedOption,
  isOtherOption,
  isQuestionAnswered,
} from "@/lib/dashboard/questions";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = Pick<
  UseDashboardReturn,
  | "prompt"
  | "questions"
  | "answers"
  | "otherDetails"
  | "currentQ"
  | "setCurrentQ"
  | "selectAnswer"
  | "setOtherDetail"
  | "backFromQuestions"
  | "finishQuestions"
  | "skipQuestions"
>;

export function DashboardQuestionsScreen({
  prompt,
  questions,
  answers,
  otherDetails,
  currentQ,
  setCurrentQ,
  selectAnswer,
  setOtherDetail,
  backFromQuestions,
  finishQuestions,
  skipQuestions,
}: Props) {
  const q = questions[currentQ];
  if (!q) return null;

  const selected = getSelectedOption(q, answers);
  const showOtherInput = selected ? isOtherOption(selected) : false;
  const answered = isQuestionAnswered(q, answers, otherDetails);
  const isLast = currentQ >= questions.length - 1;

  return (
    <div className="dash-content dash-content--compact">
      <p className="dash-field-hint dash-field-hint--label">
        {copy.questionsLead} · {currentQ + 1}/{questions.length}
      </p>
      <div className="dash-prompt-bubble-wrap">
        <div className="dash-prompt-bubble">{prompt}</div>
      </div>

      <div className="dash-card dash-card--flush">
        <div className="dash-card-body-lg">
          <h2 className="dash-question-title">{q.question}</h2>
          <div className="dash-options-stack">
            {q.options?.map((opt) => {
              const isSelected = answers[q.id] === opt.id;
              return (
                <div key={opt.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`dash-option${isSelected ? " selected" : ""}`}
                    onClick={() => selectAnswer(q.id, opt.id, q)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && selectAnswer(q.id, opt.id, q)
                    }
                  >
                    <div className={`dash-option-radio${isSelected ? " selected" : ""}`}>
                      {isSelected && <span className="dash-option-radio-inner" />}
                    </div>
                    <div>
                      <div className="dash-option-label">{opt.label}</div>
                      {opt.desc && <div className="dash-option-desc">{opt.desc}</div>}
                    </div>
                  </div>
                  {isSelected && isOtherOption(opt) && (
                    <div className="dash-other-detail">
                      <textarea
                        className="dash-other-input"
                        value={otherDetails[q.id] ?? ""}
                        onChange={(e) => setOtherDetail(q.id, e.target.value)}
                        placeholder={copy.otherPlaceholder}
                        rows={2}
                        autoFocus
                      />
                      {!otherDetails[q.id]?.trim() && (
                        <p className="dash-other-hint">{copy.otherRequired}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="dash-questions-footer">
            <button type="button" className="dash-btn-secondary" onClick={backFromQuestions}>
              <ArrowLeft size={14} strokeWidth={1.75} />
              {copy.back}
            </button>
            <div className="dash-progress-dots">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`dash-progress-dot${i === currentQ ? " active" : ""}`}
                />
              ))}
            </div>
            {isLast ? (
              <button
                type="button"
                className="dash-btn-primary dash-btn-primary--auto"
                onClick={finishQuestions}
                disabled={!answered}
              >
                {copy.generate}
                <ArrowRight size={14} strokeWidth={1.75} />
              </button>
            ) : (
              <button
                type="button"
                className="dash-btn-primary dash-btn-primary--auto"
                onClick={() => setCurrentQ((n) => n + 1)}
                disabled={!answered}
              >
                {copy.next}
                <ArrowRight size={14} strokeWidth={1.75} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="dash-skip-wrap">
        <button type="button" className="dash-link-quiet" onClick={skipQuestions}>
          {copy.questionsSkip}
        </button>
      </div>
    </div>
  );
}
