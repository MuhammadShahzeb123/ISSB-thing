import type { DiagramSpec } from "./questions";

type MechanicalDiagramProps = {
  diagram: DiagramSpec;
};

const textStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 11,
  fontWeight: 700,
} as const;

const smallStyle = { ...textStyle, fontSize: 9.5 } as const;

/** Rough bold 11px Arial advance, used to keep labels inside the viewBox. */
const labelWidth = (label: string) => label.length * 6.6;

/** Clamp a centred label so it never runs past the left or right edge. */
function clampLabelX(x: number, label: string, width: number, padding = 3) {
  const half = labelWidth(label) / 2;
  return Math.min(Math.max(x, half + padding), width - half - padding);
}

export default function MechanicalDiagram({ diagram }: MechanicalDiagramProps) {
  if (diagram.type === "lever") {
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

  if (diagram.type === "gears3") {
    return (
      <svg viewBox="0 0 240 120" role="img" aria-label="Three meshed gears diagram" className="h-full w-full">
        <circle cx="48" cy="55" r="28" fill="#ffd447" stroke="currentColor" strokeWidth="4" />
        <circle cx="120" cy="55" r="24" fill="#6fc8ff" stroke="currentColor" strokeWidth="4" />
        <circle cx="188" cy="55" r="28" fill="#ff82ad" stroke="currentColor" strokeWidth="4" />
        <circle cx="48" cy="55" r="3" fill="currentColor" />
        <circle cx="120" cy="55" r="3" fill="currentColor" />
        <circle cx="188" cy="55" r="3" fill="currentColor" />
        <path d="M 48 22 A 14 14 0 0 1 58 32" fill="none" stroke="#b42318" strokeWidth="3" />
        <path d="M 54 26 L 64 34 L 52 36 Z" fill="#b42318" />
        <text x="48" y="59" textAnchor="middle" style={textStyle}>A</text>
        <text x="120" y="59" textAnchor="middle" style={textStyle}>B</text>
        <text x="188" y="59" textAnchor="middle" style={textStyle}>C</text>
        <text x="48" y="108" textAnchor="middle" style={smallStyle}>{diagram.labelA}</text>
        <text x="120" y="108" textAnchor="middle" style={smallStyle}>{diagram.labelB}</text>
        <text x="188" y="108" textAnchor="middle" style={smallStyle}>{diagram.labelC}</text>
      </svg>
    );
  }

  if (diagram.type === "incline") {
    return (
      <svg viewBox="0 0 230 112" role="img" aria-label={`Inclined plane diagram: rise ${diagram.rise}, run ${diagram.run}`} className="h-full w-full">
        <path d="M 20 88 L 170 88 L 170 28 Z" fill="#fffaf0" stroke="currentColor" strokeWidth="4" />
        <path d="M 160 88 V 78 H 170" fill="none" stroke="currentColor" strokeWidth="1.5" />
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

  if (diagram.type === "aircraft") {
    const failLeft = diagram.failedEngine === "left";
    const failRight = diagram.failedEngine === "right";
    return (
      <svg viewBox="0 0 260 140" role="img" aria-label="Twin-engine aircraft top view" className="h-full w-full">
        {/* fuselage */}
        <ellipse cx="130" cy="70" rx="18" ry="48" fill="#fffaf0" stroke="currentColor" strokeWidth="3" />
        <path d="M 130 22 L 122 8 H 138 Z" fill="#ffd447" stroke="currentColor" strokeWidth="2" />
        {/* wings */}
        <path d="M 40 68 H 220 V 78 H 40 Z" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        {/* engines */}
        <rect x="58" y="58" width="28" height="30" rx="4" fill={failLeft ? "#ffb4b4" : "#ffd447"} stroke="currentColor" strokeWidth="3" />
        <rect x="174" y="58" width="28" height="30" rx="4" fill={failRight ? "#ffb4b4" : "#ffd447"} stroke="currentColor" strokeWidth="3" />
        {failLeft && (
          <>
            <line x1="62" y1="62" x2="82" y2="84" stroke="#b42318" strokeWidth="3" />
            <line x1="82" y1="62" x2="62" y2="84" stroke="#b42318" strokeWidth="3" />
            <text x="72" y="108" textAnchor="middle" style={smallStyle}>FAILED</text>
          </>
        )}
        {failRight && (
          <>
            <line x1="178" y1="62" x2="198" y2="84" stroke="#b42318" strokeWidth="3" />
            <line x1="198" y1="62" x2="178" y2="84" stroke="#b42318" strokeWidth="3" />
            <text x="188" y="108" textAnchor="middle" style={smallStyle}>FAILED</text>
          </>
        )}
        {!failLeft && !failRight && (
          <>
            <text x="72" y="108" textAnchor="middle" style={smallStyle}>L eng</text>
            <text x="188" y="108" textAnchor="middle" style={smallStyle}>R eng</text>
          </>
        )}
        {/* nose direction */}
        <path d="M 130 8 V -2" fill="none" stroke="#0057a8" strokeWidth="2" />
        <text x="130" y="132" textAnchor="middle" style={textStyle}>{diagram.caption}</text>
      </svg>
    );
  }

  if (diagram.type === "doppler") {
    const toward = diagram.motion === "toward";
    const away = diagram.motion === "away";
    return (
      <svg viewBox="0 0 260 130" role="img" aria-label="Doppler effect diagram" className="h-full w-full">
        {/* road */}
        <line x1="20" y1="95" x2="240" y2="95" stroke="currentColor" strokeWidth="3" />
        {/* ambulance */}
        <rect x={toward ? 40 : away ? 150 : 100} y="55" width="56" height="28" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
        <circle cx={toward ? 52 : away ? 162 : 112} cy="88" r="7" fill="#171717" />
        <circle cx={toward ? 84 : away ? 194 : 144} cy="88" r="7" fill="#171717" />
        <text x={toward ? 68 : away ? 178 : 128} y="74" textAnchor="middle" style={smallStyle}>{diagram.sourceLabel}</text>
        {/* motion arrow */}
        {toward && <path d="M 105 68 H 145 M 137 60 L 150 68 L 137 76" fill="none" stroke="#b42318" strokeWidth="3" />}
        {away && <path d="M 145 68 H 105 M 113 60 L 100 68 L 113 76" fill="none" stroke="#b42318" strokeWidth="3" />}
        {diagram.motion === "pass" && <path d="M 165 68 H 210 M 202 60 L 215 68 L 202 76" fill="none" stroke="#b42318" strokeWidth="3" />}
        {/* listener */}
        <circle cx="220" cy="70" r="14" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <text x="220" y="74" textAnchor="middle" style={smallStyle}>ear</text>
        <text x="220" y="118" textAnchor="middle" style={smallStyle}>{diagram.listenerLabel}</text>
        {/* wave fronts: denser on approach side */}
        {(toward || diagram.motion === "pass") && (
          <>
            <path d="M 160 40 Q 190 55 160 70" fill="none" stroke="#0057a8" strokeWidth="2" />
            <path d="M 175 35 Q 210 55 175 75" fill="none" stroke="#0057a8" strokeWidth="2" />
            <path d="M 188 30 Q 225 55 188 80" fill="none" stroke="#0057a8" strokeWidth="2" />
          </>
        )}
        {away && (
          <>
            <path d="M 140 35 Q 100 55 140 75" fill="none" stroke="#0057a8" strokeWidth="2" />
            <path d="M 155 28 Q 95 55 155 82" fill="none" stroke="#0057a8" strokeWidth="2" />
          </>
        )}
        <text x="130" y="18" textAnchor="middle" style={textStyle}>
          {toward ? "approaching" : away ? "receding" : "passing by"}
        </text>
      </svg>
    );
  }

  if (diagram.type === "boat") {
    const rudder = diagram.rudder;
    const rudderTip = rudder === "left" ? 95 : rudder === "right" ? 145 : 120;
    return (
      <svg viewBox="0 0 240 130" role="img" aria-label="Boat and rudder diagram" className="h-full w-full">
        <path d="M 120 18 L 175 95 L 120 108 L 65 95 Z" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        <line x1="120" y1="108" x2={rudderTip} y2="122" stroke="currentColor" strokeWidth="5" />
        <text x="120" y="70" textAnchor="middle" style={textStyle}>bow ↑</text>
        <text x="120" y="16" textAnchor="middle" style={smallStyle}>forward</text>
        <text x="120" y="128" textAnchor="middle" style={textStyle}>
          rudder {rudder === "straight" ? "centred" : `to ${rudder}`}
        </text>
      </svg>
    );
  }

  if (diagram.type === "buoyancy") {
    const y = diagram.state === "float" ? 48 : diagram.state === "suspend" ? 68 : 88;
    return (
      <svg viewBox="0 0 200 120" role="img" aria-label="Buoyancy diagram" className="h-full w-full">
        <rect x="30" y="30" width="140" height="80" fill="#cceeff" stroke="currentColor" strokeWidth="3" />
        <line x1="30" y1="50" x2="170" y2="50" stroke="#0057a8" strokeWidth="2" strokeDasharray="4 3" />
        <text x="175" y="54" style={smallStyle}>water</text>
        <rect x="85" y={y} width="30" height="24" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
        <text x="100" y={y + 16} textAnchor="middle" style={smallStyle}>{diagram.objectLabel}</text>
        <text x="100" y="18" textAnchor="middle" style={textStyle}>{diagram.state}</text>
      </svg>
    );
  }

  if (diagram.type === "shadow") {
    const lightX = diagram.lightSide === "left" ? 30 : 170;
    const objX = 100;
    const shadowStart = objX;
    const shadowEnd = diagram.lightSide === "left" ? 175 : 25;
    return (
      <svg viewBox="0 0 200 120" role="img" aria-label="Light and shadow diagram" className="h-full w-full">
        <line x1="15" y1="95" x2="185" y2="95" stroke="currentColor" strokeWidth="3" />
        <circle cx={lightX} cy="28" r="14" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <text x={lightX} y="32" textAnchor="middle" style={smallStyle}>sun</text>
        <rect x={objX - 10} y={diagram.objectHeight === "tall" ? 40 : 60} width="20" height={diagram.objectHeight === "tall" ? 55 : 35} fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        <path d={`M ${shadowStart} 95 L ${shadowEnd} 95`} stroke="#171717" strokeWidth="10" opacity="0.35" />
        <text x="100" y="114" textAnchor="middle" style={textStyle}>shadow on ground</text>
      </svg>
    );
  }

  if (diagram.type === "spanner") {
    const forceX = diagram.forceAt === "far" ? 175 : 95;
    return (
      <svg viewBox="0 0 220 110" role="img" aria-label="Spanner and nut diagram" className="h-full w-full">
        <circle cx="40" cy="55" r="18" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <text x="40" y="59" textAnchor="middle" style={smallStyle}>nut</text>
        <rect x="55" y="48" width="130" height="14" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        <path d={`M ${forceX} 20 V 45 M ${forceX - 6} 37 L ${forceX} 48 L ${forceX + 6} 37`} fill="none" stroke="#b42318" strokeWidth="3" />
        <text x={forceX} y="16" textAnchor="middle" style={textStyle}>F</text>
        <text x="120" y="90" textAnchor="middle" style={textStyle}>
          push {diagram.forceAt === "far" ? "at handle end" : "near the nut"}
        </text>
      </svg>
    );
  }

  if (diagram.type === "wheel") {
    const rA = Math.max(12, Math.min(40, diagram.diameterA / 2));
    const rB = Math.max(12, Math.min(40, diagram.diameterB / 2));
    return (
      <svg viewBox="0 0 220 120" role="img" aria-label="Wheel and axle diagram" className="h-full w-full">
        <line x1="40" y1="60" x2="180" y2="60" stroke="currentColor" strokeWidth="6" />
        <circle cx="70" cy="60" r={rA} fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <circle cx="150" cy="60" r={rB} fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        <circle cx="70" cy="60" r="4" fill="currentColor" />
        <circle cx="150" cy="60" r="4" fill="currentColor" />
        <text x="70" y="110" textAnchor="middle" style={textStyle}>{diagram.labelA}</text>
        <text x="150" y="110" textAnchor="middle" style={textStyle}>{diagram.labelB}</text>
      </svg>
    );
  }

  if (diagram.type === "door") {
    return (
      <svg viewBox="0 0 200 130" role="img" aria-label="Door hinge and handle diagram" className="h-full w-full">
        <rect x="40" y="20" width="100" height="90" fill="#fffaf0" stroke="currentColor" strokeWidth="3" />
        <circle cx="48" cy="40" r="4" fill="currentColor" />
        <circle cx="48" cy="90" r="4" fill="currentColor" />
        <text x="48" y="18" textAnchor="middle" style={smallStyle}>hinges</text>
        <circle cx={diagram.handleFar ? 125 : 70} cy="65" r="7" fill="#ff82ad" stroke="currentColor" strokeWidth="2" />
        <text x={diagram.handleFar ? 125 : 70} y="115" textAnchor="middle" style={textStyle}>
          handle {diagram.handleFar ? "far" : "near"}
        </text>
      </svg>
    );
  }

  if (diagram.type === "cam") {
    return (
      <svg viewBox="0 0 200 120" role="img" aria-label="Cam and follower diagram" className="h-full w-full">
        <circle cx="90" cy="70" r="28" fill="#6fc8ff" stroke="currentColor" strokeWidth="3" />
        <ellipse cx="110" cy="70" rx="36" ry="20" fill="#ffd447" stroke="currentColor" strokeWidth="3" />
        <circle cx="90" cy="70" r="4" fill="currentColor" />
        <rect x="78" y="18" width="24" height="30" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
        <path d="M 90 18 V 8 M 84 14 L 90 6 L 96 14" fill="none" stroke="#b42318" strokeWidth="2" />
        <text x="90" y="112" textAnchor="middle" style={textStyle}>cam spins → follower rises</text>
      </svg>
    );
  }

  if (diagram.type === "beam") {
    return (
      <svg viewBox="0 0 240 100" role="img" aria-label="Supported beam diagram" className="h-full w-full">
        <line x1="30" y1="45" x2="210" y2="45" stroke="currentColor" strokeWidth="6" />
        <path d="M 40 45 V 75 M 30 75 H 50" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M 200 45 V 75 M 190 75 H 210" stroke="currentColor" strokeWidth="3" fill="none" />
        <rect x={diagram.loadAt === "centre" ? 105 : diagram.loadAt === "left" ? 55 : 155} y="20" width="30" height="22" fill="#ff82ad" stroke="currentColor" strokeWidth="3" />
        <text x="120" y="92" textAnchor="middle" style={textStyle}>load {diagram.loadAt}</text>
      </svg>
    );
  }

  // balance (default)
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
