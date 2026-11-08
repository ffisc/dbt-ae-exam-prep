import { Answer, DagNode, HotspotQuestion } from "../../types";

interface Props {
  question: HotspotQuestion;
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
  revealed: boolean;
  readOnly: boolean;
}

const COL_W = 214;
const ROW_H = 72;
const NODE_W = 184;
const NODE_H = 40;
const PAD = 12;

export default function Hotspot({ question, answer, onAnswer, revealed, readOnly }: Props) {
  const locked = revealed || readOnly;
  const target = question.target;

  if (target.kind === "code_lines") {
    const picks = answer?.kind === "lines" ? answer.picks : [];
    const multi = target.correctLines.length > 1;
    const lines = (question.codeSnippet ?? "").split("\n");
    const toggle = (line: number) => {
      if (locked) return;
      const next = multi ? (picks.includes(line) ? picks.filter((l) => l !== line) : [...picks, line]) : [line];
      onAnswer({ kind: "lines", picks: next });
    };

    return (
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">{multi ? "Click every line that applies." : "Click the line that applies."}</p>
        <div className="bg-[#151718] rounded-xl py-3 font-mono text-xs md:text-sm leading-relaxed text-[#A9B1D6] border border-gray-800 relative overflow-x-auto">
          <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest text-gray-600">{question.codeLanguage || "code"}</div>
          {lines.map((text, i) => {
            const line = i + 1;
            const picked = picks.includes(line);
            const correct = target.correctLines.includes(line);
            let style = locked ? "" : "hover:bg-white/5 cursor-pointer";
            if (picked) style = "bg-[#FF694B]/25 ring-1 ring-inset ring-[#FF694B]";
            if (revealed && correct) style = "bg-green-500/25 ring-1 ring-inset ring-green-400";
            else if (revealed && picked) style = "bg-red-500/25 ring-1 ring-inset ring-red-400";
            return (
              <div
                key={line}
                role="button"
                aria-pressed={picked}
                aria-label={`Line ${line}`}
                onClick={() => toggle(line)}
                className={`flex px-3 ${style}`}
              >
                <span className="w-8 shrink-0 text-right pr-3 text-gray-600 select-none">{line}</span>
                <span className="whitespace-pre">{text || " "}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const picks = answer?.kind === "nodes" ? answer.picks : [];
  const multi = target.correctNodes.length > 1;
  const toggle = (id: string) => {
    if (locked) return;
    const next = multi ? (picks.includes(id) ? picks.filter((p) => p !== id) : [...picks, id]) : [id];
    onAnswer({ kind: "nodes", picks: next });
  };
  const byId = new Map<string, DagNode>(target.nodes.map((n) => [n.id, n]));
  const width = (Math.max(...target.nodes.map((n) => n.column)) + 1) * COL_W + PAD * 2 - (COL_W - NODE_W);
  const height = (Math.max(...target.nodes.map((n) => n.row)) + 1) * ROW_H + PAD * 2 - (ROW_H - NODE_H);
  const x = (n: DagNode) => PAD + n.column * COL_W;
  const y = (n: DagNode) => PAD + n.row * ROW_H;

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 font-medium">{multi ? "Click every node that applies." : "Click the node that applies."}</p>
      <div className="overflow-x-auto border border-gray-200 rounded-xl bg-gray-50 p-2">
        <svg width={width} height={height} role="group" aria-label="DAG">
          <defs>
            <marker id={`arrow-${question.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9CA3AF" />
            </marker>
          </defs>
          {target.edges.map(([from, to]) => {
            const a = byId.get(from);
            const b = byId.get(to);
            if (!a || !b) return null;
            const x1 = x(a) + NODE_W;
            const y1 = y(a) + NODE_H / 2;
            const x2 = x(b);
            const y2 = y(b) + NODE_H / 2;
            const mid = (x1 + x2) / 2;
            return (
              <path
                key={`${from}-${to}`}
                d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2 - 2} ${y2}`}
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                markerEnd={`url(#arrow-${question.id})`}
              />
            );
          })}
          {target.nodes.map((n) => {
            const picked = picks.includes(n.id);
            const correct = target.correctNodes.includes(n.id);
            let fill = "#FFFFFF";
            let stroke = "#D1D5DB";
            if (picked) {
              fill = "#FFF5F2";
              stroke = "#FF694B";
            }
            if (revealed && correct) {
              fill = "#F0FDF4";
              stroke = "#16A34A";
            } else if (revealed && picked) {
              fill = "#FEF2F2";
              stroke = "#EF4444";
            }
            return (
              <g
                key={n.id}
                role="button"
                aria-pressed={picked}
                aria-label={n.label}
                onClick={() => toggle(n.id)}
                style={{ cursor: locked ? "default" : "pointer" }}
              >
                <title>{n.label}</title>
                <rect x={x(n)} y={y(n)} width={NODE_W} height={NODE_H} rx="8" fill={fill} stroke={stroke} strokeWidth={picked || (revealed && correct) ? 2 : 1.25} />
                <text x={x(n) + NODE_W / 2} y={y(n) + NODE_H / 2 + 4} textAnchor="middle" fontSize="12" fontFamily="ui-monospace, monospace" fill="#111827">
                  {n.label.length > 24 ? `${n.label.slice(0, 23)}…` : n.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
