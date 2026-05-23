export interface Question {
  id: number;
  category: "Develop Models" | "Debug Data Models" | "Test and Document Models" | "Deploy dbt Projects";
  difficulty: "Associate" | "Intermediate" | "Advanced";
  questionText: string;
  codeSnippet?: string;
  codeLanguage?: string;
  options: string[];
  correctAnswers: number[]; // Indices of the correct option(s); supporting select-all-that-apply
  explanation: string;
  references?: string;
  dbtVersionFocus?: string;
}

export type ExamMode = "MOCK_EXAM" | "DOMAIN_PRACTICE" | "QUICK_QUIZ";

export interface ExamSession {
  id: string;
  mode: ExamMode;
  targetDomain?: string;
  startTime: number;
  timeSpent: number; // in seconds
  questions: Question[];
  userAnswers: { [questionId: number]: number[] }; // questionId -> selectedIndices
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
