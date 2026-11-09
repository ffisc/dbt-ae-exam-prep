/** Questions the user marked as doubtful in this browser. They are left out of new sessions until reviewed. */
const STORAGE_KEY = "dbt-exam-prep:doubtful:v1";

export type DoubtfulMarks = Record<number, number>; // question id -> time marked

export function loadDoubtful(): DoubtfulMarks {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DoubtfulMarks) : {};
  } catch {
    return {};
  }
}

export function saveDoubtful(marks: DoubtfulMarks): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(marks));
  } catch {
    // Storage unavailable: marks last for this page load only.
  }
}

export function toggleDoubtful(marks: DoubtfulMarks, questionId: number, now = Date.now()): DoubtfulMarks {
  const next = { ...marks };
  if (next[questionId]) delete next[questionId];
  else next[questionId] = now;
  return next;
}
