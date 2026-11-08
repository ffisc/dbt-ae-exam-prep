import { CheckCircle, XCircle } from "lucide-react";
import { domcOutcome } from "../../grading";
import { Answer, MultipleChoiceQuestion } from "../../types";
import FormattedText from "../FormattedText";

interface Props {
  question: MultipleChoiceQuestion;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  /** The order options are revealed in (indices into question.options). */
  order: number[];
  revealed: boolean;
  readOnly: boolean;
}

/**
 * Discrete Option Multiple Choice: options appear one at a time and the test-taker answers yes or no to each,
 * with no going back. After the item ends, one more option is shown (and not scored) when one is left,
 * so the test-taker cannot tell from the screen how the item ended.
 */
export default function Domc({ question, answer, onAnswer, order, revealed, readOnly }: Props) {
  const decisions = answer?.kind === "domc" ? answer.decisions : [];
  const outcome = domcOutcome(question, decisions);
  const extraPending = outcome.done && decisions.length === outcome.endedAt + 1 && decisions.length < order.length;
  const current = !outcome.done || extraPending ? order[decisions.length] : undefined;
  const finished = current === undefined;

  const decide = (accepted: boolean) => {
    if (current === undefined || readOnly || revealed) return;
    onAnswer({ kind: "domc", decisions: [...decisions, { option: current, accepted }] });
  };

  if (revealed || readOnly) {
    const decisionFor = (option: number) => decisions.find((d) => d.option === option);
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500 font-medium">
          Shown one option at a time (DOMC). {outcome.done ? (outcome.correct ? "You accepted the correct option." : "Your response ended the item incorrectly.") : "Not completed."}
        </p>
        {question.options.map((option, index) => {
          const isCorrect = question.correctAnswers.includes(index);
          const decision = decisionFor(index);
          const scored = decision !== undefined && decisions.indexOf(decision) <= outcome.endedAt;
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3.5 border rounded-xl text-xs md:text-sm ${isCorrect ? "border-green-600 bg-green-50/50" : "border-gray-200 bg-white"}`}
            >
              <span className="mt-0.5 shrink-0">
                {isCorrect ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-gray-300" />}
              </span>
              <span className="flex-1 text-gray-800 font-medium select-text">
                <FormattedText text={option} />
              </span>
              {decision && (
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    !scored ? "bg-gray-100 text-gray-500" : decision.accepted === isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                  }`}
                  title={scored ? undefined : "Shown after the item ended; not scored"}
                >
                  {decision.accepted ? "Yes" : "No"}
                  {!scored && " (unscored)"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500 font-medium">
        Options appear one at a time. Answer Yes if the option is correct and No if it is not. You cannot go back.
      </p>
      {finished ? (
        <div className="p-5 border border-gray-200 rounded-xl bg-gray-50 text-sm text-gray-700 font-medium">
          Response recorded.
        </div>
      ) : (
        <div className="p-5 border border-gray-200 rounded-xl bg-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Option {decisions.length + 1}</p>
          <p className="text-sm md:text-base text-gray-900 font-medium mb-5 select-text">
            <FormattedText text={question.options[current!]} />
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => decide(true)}
              className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gray-900 text-white hover:bg-green-700 transition-colors cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => decide(false)}
              className="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
