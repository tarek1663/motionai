export type QuestionOption = {
  id: string;
  label: string;
  desc?: string;
};

export type ClarificationQuestion = {
  id: string;
  question: string;
  options?: QuestionOption[];
};

/** Détecte l’option « Autre / Other » (id ou libellé). */
export function isOtherOption(opt: QuestionOption): boolean {
  const id = opt.id.toLowerCase();
  const label = opt.label.toLowerCase().trim();
  return (
    id === "other" ||
    id.endsWith("_other") ||
    id.includes("other") ||
    label === "autre" ||
    label === "other" ||
    label.startsWith("autre ") ||
    label.startsWith("other ")
  );
}

export function getSelectedOption(
  q: ClarificationQuestion,
  answers: Record<string, string>
): QuestionOption | undefined {
  const optId = answers[q.id];
  if (!optId) return undefined;
  return q.options?.find((o) => o.id === optId);
}

/** Réponse complète : option choisie + précision si « Autre ». */
export function isQuestionAnswered(
  q: ClarificationQuestion,
  answers: Record<string, string>,
  otherDetails: Record<string, string>
): boolean {
  const opt = getSelectedOption(q, answers);
  if (!opt) return false;
  if (isOtherOption(opt)) {
    return Boolean(otherDetails[q.id]?.trim());
  }
  return true;
}

export function buildEnrichedPrompt(
  basePrompt: string,
  questions: ClarificationQuestion[],
  answers: Record<string, string>,
  otherDetails: Record<string, string> = {}
): string {
  const context = Object.entries(answers)
    .map(([qId, optId]) => {
      const q = questions.find((item) => item.id === qId);
      const opt = q?.options?.find((o) => o.id === optId);
      if (!opt) return "";

      if (isOtherOption(opt)) {
        const detail = otherDetails[qId]?.trim();
        return detail ? `Autre (${detail})` : opt.label;
      }
      return opt.label;
    })
    .filter(Boolean)
    .join(", ");

  return context ? `${basePrompt} (${context})` : basePrompt;
}
