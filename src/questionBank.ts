import { formatQuestions } from "./formatQuestions";
import { examQuestions } from "./questions";
import { Question } from "./types";

/** Every question in the app: the multiple-choice bank plus fill-in-the-blank, matching, build-list and hotspot items. */
export const allQuestions: Question[] = [...examQuestions, ...formatQuestions];
