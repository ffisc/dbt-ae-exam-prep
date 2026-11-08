import { Answer, MultipleChoiceQuestion, Presentation, Question } from "./types";

export const formatOf = (q: Question) => q.format ?? "multiple_choice";

export const isMultipleChoice = (q: Question): q is MultipleChoiceQuestion => formatOf(q) === "multiple_choice";

/** Single-answer multiple choice is the only kind DOMC can present. */
export const canPresentAsDomc = (q: Question) => isMultipleChoice(q) && q.correctAnswers.length === 1;

/**
 * Applies the DOMC rules to the decisions so far. The item ends when the correct option is accepted (correct),
 * the correct option is rejected (incorrect), or an incorrect option is accepted (incorrect).
 * Decisions after that point (the unscored extra option) do not count.
 */
export function domcOutcome(q: MultipleChoiceQuestion, decisions: { option: number; accepted: boolean }[]) {
  const correctOption = q.correctAnswers[0];
  for (let i = 0; i < decisions.length; i++) {
    const { option, accepted } = decisions[i];
    if (accepted || option === correctOption) {
      return { done: true, correct: accepted && option === correctOption, endedAt: i };
    }
  }
  return { done: false, correct: false, endedAt: -1 };
}

const normalize = (value: string, caseSensitive: boolean) => {
  const collapsed = value.trim().replace(/\s+/g, " ");
  return caseSensitive ? collapsed : collapsed.toLowerCase();
};

export function blankIsCorrect(accepted: string[], value: string, caseSensitive = true) {
  const given = normalize(value, caseSensitive);
  return given.length > 0 && accepted.some((a) => normalize(a, caseSensitive) === given);
}

const sameSet = <T,>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x));

export function isAnswered(q: Question, answer: Answer | undefined, presentation: Presentation = "standard"): boolean {
  if (!answer) return false;
  switch (answer.kind) {
    case "choice":
      return answer.selected.length > 0;
    case "domc":
      return presentation === "domc" && isMultipleChoice(q) && domcOutcome(q, answer.decisions).done;
    case "text":
      return answer.values.some((v) => v.trim().length > 0);
    case "matching":
      return answer.picks.some((p) => p !== null);
    case "order":
      return answer.sequence.length > 0;
    case "lines":
    case "nodes":
      return answer.picks.length > 0;
  }
}

export function isCorrect(q: Question, answer: Answer | undefined, presentation: Presentation = "standard"): boolean {
  if (!answer || !isAnswered(q, answer, presentation)) return false;
  switch (q.format ?? "multiple_choice") {
    case "multiple_choice": {
      const mc = q as MultipleChoiceQuestion;
      if (answer.kind === "domc") return domcOutcome(mc, answer.decisions).correct;
      return answer.kind === "choice" && sameSet(answer.selected, mc.correctAnswers);
    }
    case "fill_blank": {
      if (q.format !== "fill_blank" || answer.kind !== "text") return false;
      return q.blanks.every((blank, i) => blankIsCorrect(blank.accepted, answer.values[i] ?? "", blank.caseSensitive ?? true));
    }
    case "matching": {
      if (q.format !== "matching" || answer.kind !== "matching") return false;
      return q.matches.every((choice, i) => answer.picks[i] === choice);
    }
    case "build_list": {
      if (q.format !== "build_list" || answer.kind !== "order") return false;
      return answer.sequence.length === q.items.length && answer.sequence.every((itemIndex, position) => itemIndex === position);
    }
    case "hotspot": {
      if (q.format !== "hotspot") return false;
      if (q.target.kind === "code_lines") return answer.kind === "lines" && sameSet(answer.picks, q.target.correctLines);
      return answer.kind === "nodes" && sameSet(answer.picks, q.target.correctNodes);
    }
  }
}

/** Counts blanks written as [[n]] in the question text and code snippet. */
export function blankNumbers(q: Question): number[] {
  const text = `${q.questionText}\n${q.codeSnippet ?? ""}`;
  return [...text.matchAll(/\[\[(\d+)\]\]/g)].map((m) => Number(m[1]));
}
