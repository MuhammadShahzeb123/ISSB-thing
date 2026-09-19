import type { DiagramSpec } from "./questions";

type MechanicalDiagramProps = {
  diagram: DiagramSpec;
};

const textStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 11,
  fontWeight: 700,
} as const;

/** Rough bold 11px Arial advance, used to keep labels inside the viewBox. */
const labelWidth = (label: string) => label.length * 6.6;

/** Clamp a centred label so it never runs past the left or right edge. */
function clampLabelX(x: number, label: string, width: number, padding = 3) {
  const half = labelWidth(label) / 2;
  return Math.min(Math.max(x, half + padding), width - half - padding);
}

export default function MechanicalDiagram({ diagram }: MechanicalDiagramProps) {
  if (diagram.type === "lever") {
    // Scale both arms by the same factor so the drawn ratio matches the
    // question even when the arms are longer than the diagram is wide.
    const scale = Math.min(1, 164 / (diagram.leftArm + diagram.rightArm));
    const leftX = 100 - ((diagram.leftArm + diagram.rightArm) * scale) / 2;
    const pivotX = leftX + diagram.leftArm * scale;
    const rightX = pivotX + diagram.rightArm * scale;
    return (
      <svg viewBox="0 0 200 110" role="img" aria-label="Lever and fulcrum diagram" className="h-full w-full">
        <line x1={leftX} y1="48" x2={rightX} y2="48" stroke="currentColor" strokeWidth="5" />
        <path d={`M ${pivotX - 13} 88 L ${pivotX} 50 L ${pivotX + 13} 88 Z`} fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <path d={`M ${leftX} 15 V 42 M ${leftX - 5} 34 L ${leftX} 42 L ${leftX + 5} 34`} fill="none" stroke="#b42318" strokeWidth="3" />
        <path d={`M ${rightX} 15 V 42 M ${rightX - 5} 34 L ${rightX} 42 L ${rightX + 5} 34`} fill="none" stroke="#0057a8" strokeWidth="3" />
        <text x={clampLabelX(leftX, diagram.leftLabel, 200)} y="12" textAnchor="middle" style={textStyle}>{diagram.leftLabel}</text>
        <text x={clampLabelX(rightX, diagram.rightLabel, 200)} y="12" textAnchor="middle" style={textStyle}>{diagram.rightLabel}</text>
      </svg>
    );
  }

  if (diagram.type === "pulley") {
    const strandXs = Array.from(
      { length: diagram.supportingStrands },
      (_, index) => 65 + index * (70 / Math.max(1, diagram.supportingStrands - 1)),
    );
    return (
      <svg viewBox="0 0 240 120" role="img" aria-label={`${diagram.arrangement} pulley diagram`} className="h-full w-full">
        <line x1="35" y1="12" x2="165" y2="12" stroke="currentColor" strokeWidth="4" />
        {diagram.arrangement === "fixed" && <circle cx="100" cy="38" r="20" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />}
        {diagram.arrangement !== "fixed" && <circle cx="100" cy="68" r="20" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />}
        {strandXs.map((x) => <line key={x} x1={x} y1="14" x2={x} y2={diagram.arrangement === "fixed" ? 82 : 68} stroke="currentColor" strokeWidth="2" />)}
        <rect x="76" y={diagram.arrangement === "fixed" ? 82 : 91} width="48" height="22" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
        <text x="100" y={diagram.arrangement === "fixed" ? 97 : 106} textAnchor="middle" style={textStyle}>{diagram.loadLabel}</text>
        <path d="M 150 30 V 70 M 145 62 L 150 70 L 155 62" fill="none" stroke="#b42318" strokeWidth="3" />
        <text x="158" y="54" textAnchor="start" style={textStyle}>{diagram.effortLabel}</text>
      </svg>
    );
  }

  if (diagram.type === "gears") {
    const belt = diagram.connectedBy !== "mesh";
    // Meshed gears sit so their rims just touch (25 + 40 = 65 apart).
    const ax = belt ? 48 : 64;
    const bx = belt ? 152 : 129;
    return (
      <svg viewBox="0 0 200 112" role="img" aria-label={`${diagram.connectedBy} rotation diagram`} className="h-full w-full">
        {belt && (
          <path
            d={diagram.connectedBy === "open-belt" ? "M 55 31 C 85 20 115 20 145 31 L 145 79 C 115 90 85 90 55 79 Z" : "M 55 31 L 145 79 M 55 79 L 145 31"}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        )}
        <circle cx={ax} cy="55" r={belt ? 27 : 25} fill="#ffd447" stroke="currentColor" strokeWidth="4" />
        <circle cx={bx} cy="55" r={belt ? 34 : 40} fill="#6fc8ff" stroke="currentColor" strokeWidth="4" />
        <circle cx={ax} cy="55" r="3" fill="currentColor" />
        <circle cx={bx} cy="55" r="3" fill="currentColor" />
        <text x={ax} y="47" textAnchor="middle" style={textStyle}>{diagram.teethA}</text>
        <text x={bx} y="47" textAnchor="middle" style={textStyle}>{diagram.teethB}</text>
        <text x={clampLabelX(ax, diagram.labelA, 200)} y="106" textAnchor="middle" style={textStyle}>{diagram.labelA}</text>
        <text x={clampLabelX(bx, diagram.labelB, 200)} y="106" textAnchor="middle" style={textStyle}>{diagram.labelB}</text>
      </svg>
    );
  }

  if (diagram.type === "incline") {
    return (
      <svg viewBox="0 0 230 112" role="img" aria-label={`Inclined plane diagram: rise ${diagram.rise}, run ${diagram.run}`} className="h-full w-full">
        <path d="M 20 88 L 170 88 L 170 28 Z" fill="#fffaf0" stroke="currentColor" strokeWidth="4" />
        <path d="M 160 88 V 78 H 170" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* The slope rises 60 over 150 (21.8°); the box rests on it at 60% along. */}
        <g transform="translate(105.5 40.9) rotate(-21.8)">
          <rect x="-21" y="-12" width="42" height="24" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
          <text x="0" y="4" textAnchor="middle" style={textStyle}>{diagram.loadLabel}</text>
        </g>
        <text x="176" y="62" style={textStyle}>rise {diagram.rise}</text>
        <text x="95" y="104" textAnchor="middle" style={textStyle}>run {diagram.run}</text>
      </svg>
    );
  }

  if (diagram.type === "spring") {
    return (
      <svg viewBox="0 0 200 115" role="img" aria-label="Spring extension diagram" className="h-full w-full">
        <line x1="32" y1="12" x2="168" y2="12" stroke="currentColor" strokeWidth="4" />
        <path d="M 100 12 L 100 24 L 84 31 L 116 42 L 84 53 L 116 64 L 84 75 L 100 82 L 100 91" fill="none" stroke="#0057a8" strokeWidth="4" />
        <rect x="72" y="89" width="56" height="20" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <text x="100" y="103" textAnchor="middle" style={textStyle}>{diagram.forceLabel}</text>
        <text x="151" y="61" style={textStyle}>{diagram.extension} cm</text>
      </svg>
    );
  }

  if (diagram.type === "hydraulic") {
    return (
      <svg viewBox="0 0 200 115" role="img" aria-label="Hydraulic pistons diagram" className="h-full w-full">
        <path d="M 35 40 V 92 H 165 V 29" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M 38 72 H 162 V 92 H 38 Z" fill="#6fc8ff" opacity="0.7" />
        <rect x="24" y="37" width="34" height="8" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <rect x="132" y="26" width="58" height="8" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
        <path d="M 41 8 V 34 M 36 26 L 41 34 L 46 26" fill="none" stroke="#b42318" strokeWidth="3" />
        <text x="41" y="105" textAnchor="middle" style={textStyle}>A {diagram.areaA}</text>
        <text x="161" y="105" textAnchor="middle" style={textStyle}>A {diagram.areaB}</text>
        <text x="55" y="18" style={textStyle}>{diagram.forceA} N</text>
      </svg>
    );
  }

  const rotation = diagram.state === "level" ? 0 : diagram.state === "left-down" ? -7 : 7;
  return (
    <svg viewBox="0 0 200 112" role="img" aria-label="Balance scale diagram" className="h-full w-full">
      <g transform={`rotate(${rotation} 100 48)`}>
        <line x1="35" y1="48" x2="165" y2="48" stroke="currentColor" strokeWidth="5" />
        <line x1="48" y1="48" x2="48" y2="78" stroke="currentColor" strokeWidth="2" />
        <line x1="152" y1="48" x2="152" y2="78" stroke="currentColor" strokeWidth="2" />
        <path d="M 25 78 H 71 L 64 93 H 32 Z" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <path d="M 129 78 H 175 L 168 93 H 136 Z" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        <text x="48" y="89" textAnchor="middle" style={{ ...textStyle, fontSize: 9.5 }}>{diagram.leftLabel}</text>
        <text x="152" y="89" textAnchor="middle" style={{ ...textStyle, fontSize: 9.5 }}>{diagram.rightLabel}</text>
      </g>
      <path d="M 87 102 L 100 49 L 113 102 Z" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}
