import { CircleHelp } from "lucide-react";

/** Marks a question as doubtful so it stops appearing in new sessions, or unmarks it. */
export default function DoubtfulToggle({ marked, onToggle }: { marked: boolean; onToggle: () => void }) {
  return (
    <div className="mt-4 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-x-3 gap-y-1">
      <button
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase tracking-wider cursor-pointer transition-colors ${
          marked ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-white border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-700"
        }`}
      >
        <CircleHelp className="w-3.5 h-3.5" />
        {marked ? "Marked doubtful" : "Mark as doubtful"}
      </button>
      <span className="text-[11px] text-gray-500">
        {marked ? "Left out of new sessions. Click again to bring it back." : "Answer looks wrong or ambiguous? It will stop appearing in new sessions."}
      </span>
    </div>
  );
}
