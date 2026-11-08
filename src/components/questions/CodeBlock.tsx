import React from "react";

/** Renders a [[n]] blank marker as a numbered placeholder. */
export function BlankMarker({ n, dark = false }: { n: number; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[3.5rem] px-2 mx-0.5 rounded border-2 border-dashed font-sans font-bold text-[0.8em] align-baseline select-none ${
        dark ? "border-[#E5C07B] text-[#E5C07B]" : "border-[#FF694B] text-[#FF694B] bg-[#FFF5F2]"
      }`}
      aria-label={`blank ${n}`}
    >
      {n}
    </span>
  );
}

/** Splits text on [[n]] markers, rendering each as a BlankMarker. */
export function withBlankMarkers(text: string, dark = false): React.ReactNode[] {
  return text.split(/(\[\[\d+\]\])/g).map((part, i) => {
    const m = part.match(/^\[\[(\d+)\]\]$/);
    return <React.Fragment key={i}>{m ? <BlankMarker n={Number(m[1])} dark={dark} /> : part}</React.Fragment>;
  });
}

export default function CodeBlock({ code, language }: { code: string; language?: string }) {
  return (
    <div className="bg-[#151718] rounded-xl p-5 mb-6 font-mono text-xs md:text-sm leading-relaxed text-[#A9B1D6] shadow-inner border border-gray-800 relative group max-h-80 overflow-y-auto">
      <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-gray-400 transition-colors">
        {language || "code"}
      </div>
      <pre className="whitespace-pre-wrap select-text font-mono">{withBlankMarkers(code, true)}</pre>
    </div>
  );
}
