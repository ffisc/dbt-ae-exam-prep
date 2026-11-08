import { CheckCircle, XCircle } from "lucide-react";
import { blankIsCorrect } from "../../grading";
import { Answer, FillBlankQuestion } from "../../types";

interface Props {
  question: FillBlankQuestion;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  revealed: boolean;
  readOnly: boolean;
}

export default function FillBlank({ question, answer, onAnswer, revealed, readOnly }: Props) {
  const values = answer?.kind === "text" ? answer.values : question.blanks.map(() => "");
  const locked = revealed || readOnly;

  const setValue = (index: number, value: string) => {
    const next = question.blanks.map((_, i) => (i === index ? value : values[i] ?? ""));
    onAnswer({ kind: "text", values: next });
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500 font-medium">Type the exact term for each numbered blank.</p>
      {question.blanks.map((blank, index) => {
        const value = values[index] ?? "";
        const correct = blankIsCorrect(blank.accepted, value, blank.caseSensitive ?? true);
        return (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <label htmlFor={`blank-${question.id}-${index}`} className="shrink-0 text-xs font-bold text-gray-700 w-16">
              Blank {index + 1}
            </label>
            <div className="flex-1 flex items-center gap-2">
              <input
                id={`blank-${question.id}-${index}`}
                type="text"
                value={value}
                disabled={locked}
                onChange={(e) => setValue(index, e.target.value)}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                className={`w-full px-3 py-2 font-mono text-sm rounded-lg border bg-white focus:outline-none focus:border-[#FF694B] focus:ring-1 focus:ring-[#FF694B] disabled:bg-gray-50 ${
                  revealed ? (correct ? "border-green-600 text-green-800" : "border-red-500 text-red-700") : "border-gray-300"
                }`}
              />
              {revealed && (correct ? <CheckCircle className="w-5 h-5 text-green-600 shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0" />)}
            </div>
            {revealed && !correct && (
              <span className="text-xs text-gray-600 sm:w-56">
                Accepted: {blank.accepted.map((a, i) => (
                  <code key={i} className="mx-0.5 px-1.5 py-0.5 rounded bg-green-50 text-green-800 border border-green-200 font-mono text-[0.9em]">{a}</code>
                ))}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
