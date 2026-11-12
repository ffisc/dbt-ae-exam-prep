import type { Category } from "./examTopics";

export type { Category };
export type Difficulty = "Basic" | "Intermediate" | "Advanced";

interface QuestionBase {
  id: number;
  category: Category;
  difficulty: Difficulty;
  questionText: string;
  codeSnippet?: string;
  codeLanguage?: string;
  explanation: string;
  references?: string;
  dbtVersionFocus?: string;
}

/** One stem, several options. Single-answer questions can also be presented as DOMC. */
export interface MultipleChoiceQuestion extends QuestionBase {
  format?: "multiple_choice";
  options: string[];
  correctAnswers: number[]; // indices of the correct option(s)
}

/**
 * Blanks are written as [[1]], [[2]], ... in `questionText` and/or `codeSnippet`.
 * `blanks[n - 1]` lists the accepted answers for blank n.
 */
export interface FillBlankQuestion extends QuestionBase {
  format: "fill_blank";
  blanks: { accepted: string[]; caseSensitive?: boolean }[]; // caseSensitive defaults to true
}

/** Pair each prompt with one choice; `matches[i]` is the index in `choices` for `prompts[i]`. */
export interface MatchingQuestion extends QuestionBase {
  format: "matching";
  prompts: string[];
  choices: string[]; // may include choices that match no prompt
  matches: number[];
}

/** Put `items` in order (they are stored in the correct order); `distractors` do not belong in the list. */
export interface BuildListQuestion extends QuestionBase {
  format: "build_list";
  items: string[];
  distractors?: string[];
}

export interface DagNode {
  id: string;
  label: string;
  column: number; // 0-based position left to right
  row: number; // 0-based position top to bottom
}

/** Click the right line(s) of `codeSnippet`, or the right node(s) of a DAG. */
export interface HotspotQuestion extends QuestionBase {
  format: "hotspot";
  target:
    | { kind: "code_lines"; correctLines: number[] } // 1-based line numbers in codeSnippet
    | { kind: "dag"; nodes: DagNode[]; edges: [string, string][]; correctNodes: string[] }; // edges run parent -> child
}

export type Question =
  | MultipleChoiceQuestion
  | FillBlankQuestion
  | MatchingQuestion
  | BuildListQuestion
  | HotspotQuestion;

export type QuestionFormat = NonNullable<Question["format"]>;

/** How a question is shown in a session. DOMC applies only to single-answer multiple choice. */
export type Presentation = "standard" | "domc";

export type Answer =
  | { kind: "choice"; selected: number[] }
  | { kind: "domc"; decisions: { option: number; accepted: boolean }[] }
  | { kind: "text"; values: string[] }
  | { kind: "matching"; picks: (number | null)[] }
  | { kind: "order"; sequence: number[] } // indices into [...items, ...distractors]
  | { kind: "lines"; picks: number[] }
  | { kind: "nodes"; picks: string[] };

export type ExamMode = "MOCK_EXAM" | "DOMAIN_PRACTICE" | "QUICK_QUIZ" | "ENDLESS";

export interface ExamSession {
  id: string;
  mode: ExamMode;
  targetDomain?: string;
  startTime: number;
  timeSpent: number; // in seconds
  questions: Question[];
  presentations: { [questionId: number]: Presentation };
  /** DOMC: the order options are revealed in, per question. */
  domcOrder: { [questionId: number]: number[] };
  /** Build list: the order the pool is shown in, per question (indices into [...items, ...distractors]). */
  poolOrder: { [questionId: number]: number[] };
  userAnswers: { [questionId: number]: Answer };
  flaggedQuestions: number[]; // array of question IDs
  completed: boolean;
  score?: number; // percentage
  passed?: boolean;
}

export interface ExamHistoryEntry {
  id: string;
  mode: ExamMode;
  date: string;
  score: number;
  passed: boolean;
  timeSpent: number;
  categoryScores?: { [category: string]: { correct: number; total: number } };
}
