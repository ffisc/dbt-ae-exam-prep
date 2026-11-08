import { Check, CheckCircle, XCircle } from "lucide-react";
import { Answer, MultipleChoiceQuestion } from "../../types";
import FormattedText from "../FormattedText";

interface Props {
  question: MultipleChoiceQuestion;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  revealed: boolean;
  readOnly: boolean;
}

export default function MultipleChoice({ question, answer, onAnswer, revealed, readOnly }: Props) {
  const selected = answer?.kind === "choice" ? answer.selected : [];
  const isMultiSelect = question.correctAnswers.length > 1;
  const locked = revealed || readOnly;

  const toggle = (index: number) => {
    if (locked) return;
    if (!isMultiSelect) return onAnswer({ kind: "choice", selected: [index] });
    onAnswer({
      kind: "choice",
      selected: selected.includes(index) ? selected.filter((i) => i !== index) : [...selected, index],
    });
  };

  return (
    <div className="space-y-3.5">
      {isMultiSelect && (
        <p className="text-xs text-gray-500 font-medium">Select {question.correctAnswers.length} answers.</p>
      )}
      {question.options.map((option, index) => {
        const isSelected = selected.includes(index);
        const isCorrect = question.correctAnswers.includes(index);
        let border = locked ? "border-gray-200 bg-white" : "border-gray-200 hover:border-gray-400 bg-white";
        if (isSelected) border = "border-[#FF694B] bg-[#FFF5F2]/40 ring-1 ring-[#FF694B]";
        if (revealed && isCorrect) border = "border-green-600 bg-green-50/50 ring-1 ring-green-600";
        else if (revealed && isSelected) border = "border-red-500 bg-red-50/50 ring-1 ring-red-500";

        return (
          <div
            key={index}
            onClick={() => toggle(index)}
            className={`flex items-start p-4 border rounded-xl transition-all duration-200 relative select-text ${locked ? "" : "cursor-pointer"} ${border}`}
          >
            <div className="mt-0.5 shrink-0 select-none">
              {isMultiSelect ? (
                <div className={`w-4 h-4 rounded border flex items-center justify-center text-white ${isSelected ? "bg-[#FF694B] border-[#FF694B]" : "bg-white border-gray-300"}`}>
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              ) : (
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center p-0.5 ${isSelected ? "border-[#FF694B]" : "border-gray-300"}`}>
                  {isSelected && <div className="w-full h-full rounded-full bg-[#FF694B]" />}
                </div>
              )}
            </div>
            <div className="ml-4 pr-6 text-xs md:text-sm text-gray-800 font-medium select-text">
              <FormattedText text={option} />
            </div>
            {revealed && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 select-none">
                {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600" /> : isSelected && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
