import { canPresentAsDomc, formatOf, isMultipleChoice } from "./grading";
import { TOPIC_WEIGHTS } from "./examTopics";
import { ExamSession, Presentation, Question, QuestionFormat } from "./types";

/** Fisher-Yates shuffle; returns a new array. */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const identity = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Shuffles a multiple-choice question's options and remaps correctAnswers to the new positions. */
function shuffleOptions(question: Question): Question {
  if (!isMultipleChoice(question)) return question;
  const order = shuffle(question.options.map((_, i) => i));
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    correctAnswers: question.correctAnswers.map((c) => order.indexOf(c)),
  };
}

/** A pool order that does not already list the build-list items in their correct relative order. */
function scrambledPool(itemCount: number, size: number): number[] {
  let order = shuffle(identity(size));
  for (let attempt = 0; attempt < 10; attempt++) {
    const itemsInPool = order.filter((i) => i < itemCount);
    if (itemsInPool.some((value, position) => value !== position)) break;
    order = shuffle(identity(size));
  }
  return order;
}

/** Share of eligible multiple-choice questions shown as DOMC in practice sessions. */
const PRACTICE_DOMC_SHARE = 0.2;

/** Mock exam: 65 questions, mirroring the real exam's length. Format counts follow exam-prep estimates. */
export const MOCK_EXAM_SIZE = 65;
const MOCK_FORMAT_QUOTAS: Partial<Record<QuestionFormat, number>> = { build_list: 4, hotspot: 3, matching: 4, fill_blank: 4 };
const MOCK_DOMC_COUNT = 6;

/** Picks the mock exam: format quotas first, then multiple choice to bring each topic near its weight. */
export function pickMockExam(bank: Question[]): Question[] {
  const picked: Question[] = [];
  for (const [format, quota] of Object.entries(MOCK_FORMAT_QUOTAS)) {
    picked.push(...shuffle(bank.filter((q) => formatOf(q) === format)).slice(0, quota));
  }
  const mc = shuffle(bank.filter(isMultipleChoice));
  const used = new Set(picked.map((q) => q.id));

  for (const [category, weight] of Object.entries(TOPIC_WEIGHTS)) {
    const target = Math.round(MOCK_EXAM_SIZE * weight) - picked.filter((q) => q.category === category).length;
    const take = mc.filter((q) => q.category === category && !used.has(q.id)).slice(0, Math.max(0, target));
    take.forEach((q) => used.add(q.id));
    picked.push(...take);
  }
  // Rounding or a thin domain can leave the exam short; fill from any remaining multiple choice.
  picked.push(...mc.filter((q) => !used.has(q.id)).slice(0, Math.max(0, MOCK_EXAM_SIZE - picked.length)));
  return shuffle(picked.slice(0, MOCK_EXAM_SIZE));
}

/** Prepares the per-session presentation of the chosen questions. */
export function buildSessionLayout(
  questions: Question[],
  domcSelection: "practice" | "mock"
): Pick<ExamSession, "questions" | "presentations" | "domcOrder" | "poolOrder"> {
  const prepared = questions.map(shuffleOptions);
  const eligible = prepared.filter(canPresentAsDomc).map((q) => q.id);
  const domcIds = new Set(
    domcSelection === "mock"
      ? shuffle(eligible).slice(0, MOCK_DOMC_COUNT)
      : eligible.filter(() => Math.random() < PRACTICE_DOMC_SHARE)
  );

  const presentations: { [id: number]: Presentation } = {};
  const domcOrder: { [id: number]: number[] } = {};
  const poolOrder: { [id: number]: number[] } = {};
  for (const q of prepared) {
    presentations[q.id] = domcIds.has(q.id) ? "domc" : "standard";
    if (domcIds.has(q.id) && isMultipleChoice(q)) domcOrder[q.id] = shuffle(identity(q.options.length));
    if (q.format === "matching") poolOrder[q.id] = shuffle(identity(q.choices.length));
    if (q.format === "build_list") poolOrder[q.id] = scrambledPool(q.items.length, q.items.length + (q.distractors?.length ?? 0));
  }
  return { questions: prepared, presentations, domcOrder, poolOrder };
}
