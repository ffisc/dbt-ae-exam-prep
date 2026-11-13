import { Question } from "./types";

/** Per-question record of graded answers, persisted in this browser's localStorage. */
export interface AnswerRecord {
  attempts: number;
  timesCorrect: number;
  lastCorrect: boolean;
  lastAnsweredAt: number;
}

export type AnswerHistory = Record<number, AnswerRecord>;

const STORAGE_KEY = "dbt-exam-prep:answer-history:v1";

export function loadHistory(): AnswerHistory {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AnswerHistory) : {};
  } catch {
    return {};
  }
}

export function saveHistory(history: AnswerHistory): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // Storage unavailable (private window, blocked site data): history lasts for this page load only.
  }
}

export function recordResults(
  history: AnswerHistory,
  results: { questionId: number; correct: boolean }[],
  now = Date.now()
): AnswerHistory {
  const next = { ...history };
  for (const { questionId, correct } of results) {
    const previous = next[questionId];
    next[questionId] = {
      attempts: (previous?.attempts ?? 0) + 1,
      timesCorrect: (previous?.timesCorrect ?? 0) + (correct ? 1 : 0),
      lastCorrect: correct,
      lastAnsweredAt: now,
    };
  }
  return next;
}

export type QuestionStatus = "unseen" | "wrong" | "correct";

export function statusOf(history: AnswerHistory, questionId: number): QuestionStatus {
  const record = history[questionId];
  if (!record) return "unseen";
  return record.lastCorrect ? "correct" : "wrong";
}

/**
 * Orders the whole pool for infinite practice, each question once: never answered first (in random order),
 * then last answered wrong (in random order), then last answered correctly, least recently answered first.
 */
export function infiniteQueue(pool: Question[], history: AnswerHistory, shuffle: <T>(items: T[]) => T[]): Question[] {
  const unseen = shuffle(pool.filter((q) => statusOf(history, q.id) === "unseen"));
  const wrong = shuffle(pool.filter((q) => statusOf(history, q.id) === "wrong"));
  const correct = pool
    .filter((q) => statusOf(history, q.id) === "correct")
    .sort((a, b) => history[a.id].lastAnsweredAt - history[b.id].lastAnsweredAt);
  return [...unseen, ...wrong, ...correct];
}

/**
 * Picks practice questions: unseen and last-answered-wrong questions first (in random order),
 * then, only to reach `count`, questions last answered correctly, least recently answered first.
 * Without `count`, returns every focus question, or the whole pool when none are left.
 */
export function pickPracticeQuestions(
  pool: Question[],
  history: AnswerHistory,
  shuffle: <T>(items: T[]) => T[],
  count?: number
): Question[] {
  const focus = shuffle(pool.filter((q) => statusOf(history, q.id) !== "correct"));
  const mastered = pool
    .filter((q) => statusOf(history, q.id) === "correct")
    .sort((a, b) => history[a.id].lastAnsweredAt - history[b.id].lastAnsweredAt);

  if (count === undefined) return focus.length > 0 ? focus : shuffle(pool);
  return shuffle([...focus.slice(0, count), ...mastered.slice(0, Math.max(0, count - focus.length))]);
}
