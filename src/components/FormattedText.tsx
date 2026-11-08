import React from "react";
import { BlankMarker } from "./questions/CodeBlock";

interface FormattedTextProps {
  text: string;
  className?: string;
  dark?: boolean;
}

/**
 * Parses inline string for `code` and **bold** syntax
 */
export function renderInlineContent(content: string, dark = false): React.ReactNode[] {
  // Matches `code`, **bold**, or a [[n]] fill-in-the-blank marker
  const tokens = content.split(/(`[^`]+`|\*\*[^*]+\*\*|\[\[\d+\]\])/g);
  return tokens.map((token, i) => {
    const blank = token.match(/^\[\[(\d+)\]\]$/);
    if (blank) {
      return (
        <React.Fragment key={i}>
          <BlankMarker n={Number(blank[1])} dark={dark} />
        </React.Fragment>
      );
    }
    if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
      const codeVal = token.slice(1, -1);
      return (
        <code
          key={i}
          className={`px-1.5 py-0.5 mx-0.5 rounded font-mono text-[0.88em] font-medium border select-text inline-block leading-tight ${
            dark
              ? "bg-[#282C34] text-[#E5C07B] border-gray-700"
              : "bg-orange-50/70 text-[#C93B2B] border-orange-200/60"
          }`}
        >
          {codeVal}
        </code>
      );
    }
    if (token.startsWith("**") && token.endsWith("**") && token.length >= 4) {
      const boldVal = token.slice(2, -2);
      return (
        <strong key={i} className={`font-semibold select-text ${dark ? "text-white" : "text-gray-950"}`}>
          {boldVal}
        </strong>
      );
    }
    return (
      <span key={i} className="select-text">
        {token}
      </span>
    );
  });
}

/**
 * FormattedText component for single-line or multi-line questions, options, and general text.
 */
export default function FormattedText({ text, className = "", dark = false }: FormattedTextProps) {
  if (!text) return null;
  return (
    <span className={`select-text ${className}`}>
      {renderInlineContent(text, dark)}
    </span>
  );
}

/**
 * FormattedExplanation component for structured solution breakdowns with
 * headers, bullet points, and inline code formatting.
 */
export function FormattedExplanation({
  explanation,
  className = ""
}: {
  explanation: string;
  className?: string;
}) {
  if (!explanation) return null;

  // Split by double line breaks or single line breaks
  const paragraphs = explanation.split("\n\n");

  return (
    <div className={`space-y-3.5 text-xs md:text-sm select-text leading-relaxed ${className}`}>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Check if paragraph starts with section headers
        if (trimmed.startsWith("CORRECT ACTION:")) {
          const body = trimmed.replace(/^CORRECT ACTION:\s*/, "");
          return (
            <div key={pIdx} className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-800 font-bold uppercase tracking-wider text-[10px] rounded border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                Correct Action
              </div>
              <p className="text-gray-800 select-text font-medium leading-relaxed">
                {renderInlineContent(body)}
              </p>
            </div>
          );
        }

        const mistakesHeader = trimmed.match(/^(INCORRECT COMPETING OPTIONS|COMMON MISTAKES):\s*/);
        if (mistakesHeader) {
          const body = trimmed.slice(mistakesHeader[0].length);
          const label = mistakesHeader[1] === "COMMON MISTAKES" ? "Common Mistakes" : "Why Other Options Are Incorrect";
          const bulletLines = body.split("\n").filter((l) => l.trim().length > 0);

          return (
            <div key={pIdx} className="space-y-2 pt-2 border-t border-gray-200/80 mt-3">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-100 text-amber-800 font-bold uppercase tracking-wider text-[10px] rounded border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                {label}
              </div>
              <ul className="space-y-2 mt-2">
                {bulletLines.map((line, lIdx) => {
                  const cleanedLine = line.replace(/^[-*]\s*/, "");
                  return (
                    <li key={lIdx} className="flex items-start gap-2 text-gray-700 select-text leading-relaxed">
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5 text-xs">✕</span>
                      <span className="select-text">{renderInlineContent(cleanedLine)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        }

        // Generic paragraph (may have single-line breaks)
        const lines = trimmed.split("\n");
        return (
          <p key={pIdx} className="text-gray-800 select-text leading-relaxed font-normal">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInlineContent(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
