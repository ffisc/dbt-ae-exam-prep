import { useEffect, useRef, useState } from "react";
import { Copy, MessageCircleQuestion, X } from "lucide-react";
import { AskContext, buildAskPrompt } from "../askPrompt";

/** The "Ask" button shown on each question. */
export function AskButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Ask a question or leave a comment about this question, with its context, for an LLM"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
    >
      <MessageCircleQuestion className="w-3.5 h-3.5 text-[#FF694B]" />
      Ask
    </button>
  );
}

const CHIPS =["I don't follow the question", "Why is this the answer?", "Why are the other options wrong?", "I think the answer is wrong", "Give me an example"];
const mac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

/**
 * Ask about a question: the user writes a question (or picks a suggestion), and the dialog copies a message
 * with the question's full context to paste into an LLM. Selected text inside a question becomes a quote.
 */
export default function AskDialog({
  context,
  quote,
  onClose,
  onCopied,
}: {
  context: AskContext;
  quote: string;
  onClose: () => void;
  onCopied: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [includeKey, setIncludeKey] = useState(context.revealed);
  const [fallback, setFallback] = useState("");

  useEffect(() => {
    dialogRef.current?.showModal();
    areaRef.current?.focus();
  }, []);

  const toggleChip = (chip: string) => {
    const lines = text.split("\n").filter((l) => l.trim());
    setText((lines.includes(chip) ? lines.filter((l) => l !== chip) : [...lines, chip]).join("\n"));
    areaRef.current?.focus();
  };

  const copy = () => {
    const message = buildAskPrompt(context, text.trim() || CHIPS[0], quote, includeKey);
    Promise.resolve(navigator.clipboard?.writeText(message)).then(
      () => {
        onCopied();
        onClose();
      },
      () => setFallback(message) // clipboard blocked: show the text so it can be copied by hand
    );
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      className="fixed inset-0 m-auto h-fit max-h-[calc(100vh-32px)] overflow-y-auto rounded-2xl p-0 w-[min(560px,calc(100vw-32px))] shadow-2xl backdrop:bg-black/40"
      aria-labelledby="ask-title"
    >
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="ask-title" className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MessageCircleQuestion className="w-4 h-4 text-[#FF694B]" /> Ask about this question
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Question {context.question.id} · {context.question.category}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100 text-gray-500 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {quote && <blockquote className="border-l-2 border-[#FF694B]/60 pl-3 text-xs text-gray-700 italic">{quote}</blockquote>}

        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Suggested questions">
          {CHIPS.map((chip) => {
            const on = text.split("\n").includes(chip);
            return (
              <button
                key={chip}
                type="button"
                aria-pressed={on}
                onClick={() => toggleChip(chip)}
                className={`px-2.5 py-1 rounded-full border text-[11px] font-medium cursor-pointer transition-colors ${
                  on ? "bg-[#FFF5F2] border-[#FF694B] text-[#FF694B]" : "bg-white border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        <textarea
          ref={areaRef}
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              copy();
            }
          }}
          placeholder="What is unclear, or what do you want to know?"
          aria-labelledby="ask-title"
          className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:border-[#FF694B]"
        />

        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none">
          <input type="checkbox" checked={includeKey} onChange={(e) => setIncludeKey(e.target.checked)} />
          Include the answer key, explanation and sources
          {!context.revealed && <span className="text-gray-400">(you have not checked this answer yet)</span>}
        </label>

        {fallback && (
          <div className="text-xs text-gray-600">
            <p className="mb-1">Copying was blocked. Select the text below and copy it by hand:</p>
            <textarea readOnly value={fallback} rows={6} onFocus={(e) => e.target.select()} className="w-full rounded-lg border border-gray-300 p-2 font-mono text-[11px]" />
          </div>
        )}

        <p className="text-[11px] text-gray-500">Copies the question as you see it, your answer and your question, ready to paste into an LLM.</p>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer">
              Cancel
            </button>
            <button
              type="button"
              onClick={copy}
              className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-[#FF694B] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> Copy question <kbd className="text-[10px] opacity-70">{mac ? "⌘↵" : "Ctrl ↵"}</kbd>
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
