import { ArrowDown, ArrowUp, CheckCircle, Plus, X, XCircle } from "lucide-react";
import { Answer, BuildListQuestion } from "../../types";
import FormattedText from "../FormattedText";

interface Props {
  question: BuildListQuestion;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  /** Display order of the pool (indices into [...items, ...distractors]). */
  poolOrder: number[];
  revealed: boolean;
  readOnly: boolean;
}

export default function BuildList({ question, answer, onAnswer, poolOrder, revealed, readOnly }: Props) {
  const entries = [...question.items, ...(question.distractors ?? [])];
  const sequence = answer?.kind === "order" ? answer.sequence : [];
  const locked = revealed || readOnly;
  const pool = poolOrder.filter((i) => !sequence.includes(i));

  const set = (next: number[]) => onAnswer({ kind: "order", sequence: next });
  const move = (position: number, delta: number) => {
    const target = position + delta;
    if (target < 0 || target >= sequence.length) return;
    const next = [...sequence];
    [next[position], next[target]] = [next[target], next[position]];
    set(next);
  };

  const iconButton = "p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-default";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Available items {question.distractors?.length ? "(not every item belongs in the list)" : ""}</p>
        {pool.length === 0 && <p className="text-xs text-gray-400 italic p-3">All items placed.</p>}
        {pool.map((entryIndex) => (
          <button
            key={entryIndex}
            onClick={() => !locked && set([...sequence, entryIndex])}
            disabled={locked}
            className="w-full flex items-start gap-2 p-3 border border-gray-200 rounded-lg bg-white text-left text-xs md:text-sm hover:border-[#FF694B] disabled:hover:border-gray-200 cursor-pointer disabled:cursor-default"
          >
            {!locked && <Plus className="w-4 h-4 mt-0.5 shrink-0 text-[#FF694B]" />}
            <span className="text-gray-800 font-medium select-text">
              <FormattedText text={entries[entryIndex]} />
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Your list, in order</p>
        {sequence.length === 0 && (
          <p className="text-xs text-gray-400 italic p-3 border border-dashed border-gray-300 rounded-lg">Click items on the left to add them here.</p>
        )}
        {sequence.map((entryIndex, position) => {
          const correct = entryIndex === position;
          return (
            <div
              key={entryIndex}
              className={`flex items-start gap-2 p-2.5 border rounded-lg text-xs md:text-sm ${
                revealed ? (correct ? "border-green-600 bg-green-50/40" : "border-red-500 bg-red-50/40") : "border-[#FF694B]/40 bg-[#FFF5F2]/40"
              }`}
            >
              <span className="w-5 h-5 shrink-0 rounded bg-white border border-gray-300 text-gray-700 font-bold flex items-center justify-center text-[11px]">{position + 1}</span>
              <span className="flex-1 text-gray-800 font-medium select-text pt-0.5">
                <FormattedText text={entries[entryIndex]} />
              </span>
              {!locked && (
                <span className="flex items-center shrink-0">
                  <button aria-label="Move up" className={iconButton} disabled={position === 0} onClick={() => move(position, -1)}>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button aria-label="Move down" className={iconButton} disabled={position === sequence.length - 1} onClick={() => move(position, 1)}>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button aria-label="Remove" className={iconButton} onClick={() => set(sequence.filter((i) => i !== entryIndex))}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {revealed && (correct ? <CheckCircle className="w-4 h-4 text-green-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />)}
            </div>
          );
        })}
        {revealed && (
          <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-green-800 mb-1.5">Correct order</p>
            <ol className="list-decimal pl-5 space-y-1 text-xs text-green-900">
              {question.items.map((item, i) => (
                <li key={i}>
                  <FormattedText text={item} />
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
