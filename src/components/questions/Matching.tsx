import { CheckCircle, XCircle } from "lucide-react";
import { Answer, MatchingQuestion } from "../../types";
import FormattedText from "../FormattedText";

interface Props {
  question: MatchingQuestion;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  /** Display order of the choices (indices into question.choices). */
  choiceOrder: number[];
  revealed: boolean;
  readOnly: boolean;
}

const letter = (position: number) => String.fromCharCode(65 + position);

export default function Matching({ question, answer, onAnswer, choiceOrder, revealed, readOnly }: Props) {
  const picks = answer?.kind === "matching" ? answer.picks : question.prompts.map(() => null);
  const locked = revealed || readOnly;
  const letterOf = (choiceIndex: number) => letter(choiceOrder.indexOf(choiceIndex));
  const unusedChoices = question.choices.length - new Set(question.matches).size;

  const pick = (promptIndex: number, value: string) => {
    const next = question.prompts.map((_, i) => (i === promptIndex ? (value === "" ? null : Number(value)) : picks[i] ?? null));
    onAnswer({ kind: "matching", picks: next });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">
          Choices
          {unusedChoices > 0 && (
            <span className="text-gray-400">
              {" "}· {unusedChoices === 1 ? "one choice is not used" : `${unusedChoices} choices are not used`}
            </span>
          )}
        </p>
        {choiceOrder.map((choiceIndex, position) => (
          <div key={choiceIndex} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-white text-xs md:text-sm">
            <span className="w-6 h-6 shrink-0 rounded bg-gray-100 text-gray-700 font-bold flex items-center justify-center text-xs">{letter(position)}</span>
            <span className="text-gray-800 font-medium select-text pt-0.5">
              <FormattedText text={question.choices[choiceIndex]} />
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Match each item to a choice</p>
        {question.prompts.map((prompt, promptIndex) => {
          const picked = picks[promptIndex];
          const correct = picked === question.matches[promptIndex];
          return (
            <div
              key={promptIndex}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 border rounded-lg ${
                revealed ? (correct ? "border-green-600 bg-green-50/40" : "border-red-500 bg-red-50/40") : "border-gray-200 bg-white"
              }`}
            >
              <span className="flex-1 text-xs md:text-sm text-gray-900 font-medium select-text">
                <FormattedText text={prompt} />
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <select
                  aria-label={`Choice for item ${promptIndex + 1}`}
                  value={picked === null || picked === undefined ? "" : String(picked)}
                  disabled={locked}
                  onChange={(e) => pick(promptIndex, e.target.value)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#FF694B] cursor-pointer disabled:cursor-default disabled:bg-gray-50"
                >
                  <option value="">Choose...</option>
                  {choiceOrder.map((choiceIndex, position) => (
                    <option key={choiceIndex} value={choiceIndex}>
                      {letter(position)}
                    </option>
                  ))}
                </select>
                {revealed &&
                  (correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-700">
                      <XCircle className="w-5 h-5 text-red-500" /> {letterOf(question.matches[promptIndex])}
                    </span>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
