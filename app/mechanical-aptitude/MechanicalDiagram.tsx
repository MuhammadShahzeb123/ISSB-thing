import type { DiagramSpec } from "./questions";

type MechanicalDiagramProps = {
  diagram: DiagramSpec;
};

/** Shared exam-paper look: dark ink on light fills, thick mobile-readable strokes. */
const ink = "currentColor";
const stroke = 2.75;
const strokeThin = 2;
const font = {
  fontFamily: "Arial, Helvetica, sans-serif",
  fontSize: 11,
  fontWeight: 700,
} as const;
const fontSm = { ...font, fontSize: 9.5 } as const;
const fontTiny = { ...font, fontSize: 8.5 } as const;

const labelWidth = (label: string, size = 11) => label.length * (size * 0.6);
function clampLabelX(x: number, label: string, width: number, padding = 4, size = 11) {
  const half = labelWidth(label, size) / 2;
  return Math.min(Math.max(x, half + padding), width - half - padding);
}

/** SVG defs: arrowheads reused across diagrams. */
function ArrowDefs() {
  return (
    <defs>
      <marker id="ma-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill={ink} />
      </marker>
      <marker id="ma-arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#b42318" />
      </marker>
      <marker id="ma-arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
        <path d="M0,0 L6,3 L0,6 Z" fill="#0057a8" />
      </marker>
    </defs>
  );
}

/** Spur-gear outline with visible teeth (exam-paper style). */
function GearWheel({
  cx,
  cy,
  r,
  teeth,
  fill,
  label,
}: {
  cx: number;
  cy: number;
  r: number;
  teeth: number;
  fill: string;
  label?: string;
}) {
  const n = Math.max(8, Math.min(28, Math.round(teeth / 2) || 12));
  const toothH = Math.max(3.5, r * 0.18);
  const pts: string[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 0.28) / n) * Math.PI * 2;
    const a2 = ((i + 0.5) / n) * Math.PI * 2;
    const a3 = ((i + 0.72) / n) * Math.PI * 2;
    const outer = r + toothH;
    pts.push(
      `${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)}`,
      `${cx + outer * Math.cos(a1)},${cy + outer * Math.sin(a1)}`,
      `${cx + outer * Math.cos(a2)},${cy + outer * Math.sin(a2)}`,
      `${cx + r * Math.cos(a3)},${cy + r * Math.sin(a3)}`,
    );
  }
  return (
    <g>
      <polygon points={pts.join(" ")} fill={fill} stroke={ink} strokeWidth={stroke} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={Math.max(5, r * 0.28)} fill="#fffaf0" stroke={ink} strokeWidth={strokeThin} />
      <circle cx={cx} cy={cy} r={2.5} fill={ink} />
      {label !== undefined && (
        <text x={cx} y={cy + 3.5} textAnchor="middle" style={fontSm}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Grooved pulley wheel (belt drive) — recognisable rim + axle. */
function PulleyWheel({
  cx,
  cy,
  r,
  fill,
  label,
}: {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  label?: string;
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={ink} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r - 4} fill="none" stroke={ink} strokeWidth={1.5} opacity={0.55} />
      <circle cx={cx} cy={cy} r={Math.max(4, r * 0.22)} fill="#fffaf0" stroke={ink} strokeWidth={strokeThin} />
      <circle cx={cx} cy={cy} r={2.2} fill={ink} />
      {/* axle stubs */}
      <line x1={cx} y1={cy - r - 6} x2={cx} y2={cy - r + 1} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      <line x1={cx} y1={cy + r - 1} x2={cx} y2={cy + r + 6} stroke={ink} strokeWidth={3} strokeLinecap="round" />
      {label !== undefined && (
        <text x={cx} y={cy + 3.5} textAnchor="middle" style={fontSm}>
          {label}
        </text>
      )}
    </g>
  );
}

/** Open (uncrossed) belt: closed loop around two pulleys (external tangents). */
function OpenBelt({ ax, ay, ar, bx, by, br }: { ax: number; ay: number; ar: number; bx: number; by: number; br: number }) {
  const dx = bx - ax;
  const dy = by - ay;
  const dist = Math.hypot(dx, dy) || 1;
  // Angle offset for unequal radii so belt strands look parallel / correct
  // Perpendicular offset gives clear parallel strands for exam readability.
  const px = -dy / dist;
  const py = dx / dist;
  const tAx = ax + px * ar;
  const tAy = ay + py * ar;
  const tBx = bx + px * br;
  const tBy = by + py * br;
  const bAx = ax - px * ar;
  const bAy = ay - py * ar;
  const bBx = bx - px * br;
  const bBy = by - py * br;
  return (
    <g>
      {/* top strand */}
      <line x1={tAx} y1={tAy} x2={tBx} y2={tBy} stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
      {/* bottom strand */}
      <line x1={bAx} y1={bAy} x2={bBx} y2={bBy} stroke={ink} strokeWidth={3.5} strokeLinecap="round" />
      {/* wrap on left pulley (right half facing B) */}
      <path d={`M ${tAx} ${tAy} A ${ar} ${ar} 0 1 0 ${bAx} ${bAy}`} fill="none" stroke={ink} strokeWidth={3.5} />
      {/* wrap on right pulley (left half facing A) */}
      <path d={`M ${tBx} ${tBy} A ${br} ${br} 0 1 1 ${bBx} ${bBy}`} fill="none" stroke={ink} strokeWidth={3.5} />
      <text x={(ax + bx) / 2} y={Math.min(tAy, tBy) - 10} textAnchor="middle" style={fontTiny} fill="#0057a8">
        open (uncrossed) belt
      </text>
    </g>
  );
}

/** Crossed belt: figure-8 style crossing clearly visible. */
function CrossedBelt({ ax, ay, ar, bx, by, br }: { ax: number; ay: number; ar: number; bx: number; by: number; br: number }) {
  const topAx = ax;
  const topAy = ay - ar;
  const botAx = ax;
  const botAy = ay + ar;
  const topBx = bx;
  const topBy = by - br;
  const botBx = bx;
  const botBy = by + br;
  const midX = (ax + bx) / 2;
  const midY = (ay + by) / 2;
  return (
    <g>
      {/* strand A top → B bottom */}
      <path
        d={`M ${topAx} ${topAy} Q ${midX} ${midY - 2} ${botBx} ${botBy}`}
        fill="none"
        stroke={ink}
        strokeWidth={3.5}
      />
      {/* strand B top → A bottom */}
      <path
        d={`M ${topBx} ${topBy} Q ${midX} ${midY + 2} ${botAx} ${botAy}`}
        fill="none"
        stroke={ink}
        strokeWidth={3.5}
      />
      {/* wrap arcs on each pulley */}
      <path d={`M ${topAx} ${topAy} A ${ar} ${ar} 0 0 0 ${botAx} ${botAy}`} fill="none" stroke={ink} strokeWidth={3.5} />
      <path d={`M ${topBx} ${topBy} A ${br} ${br} 0 0 1 ${botBx} ${botBy}`} fill="none" stroke={ink} strokeWidth={3.5} />
      {/* crossing marker */}
      <circle cx={midX} cy={midY} r={5} fill="#fffaf0" stroke="#b42318" strokeWidth={2} />
      <text x={midX} y={midY - 12} textAnchor="middle" style={fontTiny} fill="#b42318">
        crossed
      </text>
    </g>
  );
}

/** Curved rotation arrow around a wheel. */
function RotationArrow({
  cx,
  cy,
  r,
  clockwise,
  color = "#b42318",
}: {
  cx: number;
  cy: number;
  r: number;
  clockwise: boolean;
  color?: string;
}) {
  const rr = r + 10;
  if (clockwise) {
    return (
      <path
        d={`M ${cx - rr * 0.7} ${cy - rr * 0.55} A ${rr} ${rr} 0 0 1 ${cx + rr * 0.75} ${cy - rr * 0.2}`}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        markerEnd="url(#ma-arrow-red)"
      />
    );
  }
  return (
    <path
      d={`M ${cx + rr * 0.7} ${cy - rr * 0.55} A ${rr} ${rr} 0 0 0 ${cx - rr * 0.75} ${cy - rr * 0.2}`}
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      markerEnd="url(#ma-arrow-red)"
    />
  );
}

/** Hex nut (6-sided) with inner hole. */
function HexNut({ cx, cy, r, showLabel = true }: { cx: number; cy: number; r: number; showLabel?: boolean }) {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 6) + (i * Math.PI) / 3;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <g>
      <polygon points={pts} fill="#ffd447" stroke={ink} strokeWidth={stroke} strokeLinejoin="round" />
      <circle cx={cx} cy={cy} r={r * 0.38} fill="#fffaf0" stroke={ink} strokeWidth={strokeThin} />
      {showLabel && (
        <text x={cx} y={cy + r + 12} textAnchor="middle" style={fontSm}>
          nut
        </text>
      )}
    </g>
  );
}

export default function MechanicalDiagram({ diagram }: MechanicalDiagramProps) {
  if (diagram.type === "lever") {
    const scale = Math.min(1, 164 / (diagram.leftArm + diagram.rightArm));
    const leftX = 100 - ((diagram.leftArm + diagram.rightArm) * scale) / 2;
    const pivotX = leftX + diagram.leftArm * scale;
    const rightX = pivotX + diagram.rightArm * scale;
    return (
      <svg viewBox="0 0 200 120" role="img" aria-label="Lever and fulcrum diagram" className="h-full w-full">
        <ArrowDefs />
        {/* beam */}
        <line x1={leftX} y1="52" x2={rightX} y2="52" stroke={ink} strokeWidth={5} strokeLinecap="round" />
        {/* fulcrum triangle */}
        <path d={`M ${pivotX - 14} 92 L ${pivotX} 54 L ${pivotX + 14} 92 Z`} fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <text x={pivotX} y={108} textAnchor="middle" style={fontTiny}>
          fulcrum
        </text>
        {/* load / effort arrows */}
        <line x1={leftX} y1="18" x2={leftX} y2="46" stroke="#b42318" strokeWidth={3} markerEnd="url(#ma-arrow-red)" />
        <line x1={rightX} y1="18" x2={rightX} y2="46" stroke="#0057a8" strokeWidth={3} markerEnd="url(#ma-arrow-blue)" />
        <text x={clampLabelX(leftX, diagram.leftLabel, 200)} y="14" textAnchor="middle" style={font}>
          {diagram.leftLabel}
        </text>
        <text x={clampLabelX(rightX, diagram.rightLabel, 200)} y="14" textAnchor="middle" style={font}>
          {diagram.rightLabel}
        </text>
        {/* arm length ticks */}
        <line x1={leftX} y1="62" x2={pivotX} y2="62" stroke={ink} strokeWidth={1.2} strokeDasharray="3 2" />
        <line x1={pivotX} y1="62" x2={rightX} y2="62" stroke={ink} strokeWidth={1.2} strokeDasharray="3 2" />
      </svg>
    );
  }

  if (diagram.type === "pulley") {
    const isFixed = diagram.arrangement === "fixed";
    const strands = Math.max(1, diagram.supportingStrands);
    return (
      <svg viewBox="0 0 240 140" role="img" aria-label={`${diagram.arrangement} pulley diagram`} className="h-full w-full">
        <ArrowDefs />
        {/* ceiling support */}
        <line x1="40" y1="14" x2="170" y2="14" stroke={ink} strokeWidth={4} />
        <text x="105" y="10" textAnchor="middle" style={fontTiny}>
          support
        </text>
        {isFixed ? (
          <>
            {/* single fixed pulley */}
            <circle cx="100" cy="42" r="20" fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
            <circle cx="100" cy="42" r="14" fill="none" stroke={ink} strokeWidth={1.5} opacity={0.5} />
            <circle cx="100" cy="42" r="3" fill={ink} />
            <line x1="100" y1="14" x2="100" y2="22" stroke={ink} strokeWidth={3} />
            {/* rope over pulley */}
            <path d="M 80 42 A 20 20 0 0 1 120 42" fill="none" stroke={ink} strokeWidth={2.5} />
            <line x1="80" y1="42" x2="80" y2="95" stroke={ink} strokeWidth={2.5} />
            <line x1="120" y1="42" x2="120" y2="70" stroke={ink} strokeWidth={2.5} />
            {/* load */}
            <rect x="62" y="95" width="36" height="22" rx="2" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
            <text x="80" y="110" textAnchor="middle" style={fontSm}>
              {diagram.loadLabel}
            </text>
            {/* effort */}
            <line x1="120" y1="70" x2="120" y2="100" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
            <text x="148" y="88" textAnchor="middle" style={fontSm}>
              {diagram.effortLabel}
            </text>
            <text x="148" y="100" textAnchor="middle" style={fontTiny}>
              effort
            </text>
          </>
        ) : (
          <>
            {/* fixed upper pulley(s) */}
            <circle cx="100" cy="38" r="16" fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
            <circle cx="100" cy="38" r="3" fill={ink} />
            <line x1="100" y1="14" x2="100" y2="22" stroke={ink} strokeWidth={3} />
            {/* movable lower pulley */}
            <circle cx="100" cy="78" r="16" fill="#ffd447" stroke={ink} strokeWidth={stroke} />
            <circle cx="100" cy="78" r="3" fill={ink} />
            {/* supporting strands */}
            {Array.from({ length: strands }, (_, i) => {
              const x = 70 + (i * 60) / Math.max(1, strands - 1 || 1);
              const xx = strands === 1 ? 100 : x;
              return <line key={i} x1={xx} y1="38" x2={xx} y2="78" stroke={ink} strokeWidth={2.5} />;
            })}
            {/* free end effort */}
            <line x1="130" y1="38" x2="155" y2="38" stroke={ink} strokeWidth={2.5} />
            <line x1="155" y1="38" x2="155" y2="75" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
            <text x="178" y="58" textAnchor="middle" style={fontSm}>
              {diagram.effortLabel}
            </text>
            {/* load on movable */}
            <line x1="100" y1="94" x2="100" y2="105" stroke={ink} strokeWidth={2.5} />
            <rect x="78" y="105" width="44" height="22" rx="2" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
            <text x="100" y="120" textAnchor="middle" style={fontSm}>
              {diagram.loadLabel}
            </text>
            <text x="100" y="136" textAnchor="middle" style={fontTiny}>
              {strands} supporting strand{strands === 1 ? "" : "s"}
            </text>
          </>
        )}
      </svg>
    );
  }

  if (diagram.type === "gears") {
    const belt = diagram.connectedBy !== "mesh";
    const ax = belt ? 55 : 62;
    const bx = belt ? 155 : 145;
    const cy = 58;
    // Size from teeth count for visual ratio
    const rA = belt ? Math.max(18, Math.min(32, 10 + diagram.teethA * 0.55)) : Math.max(18, Math.min(34, 12 + diagram.teethA * 0.7));
    const rB = belt ? Math.max(18, Math.min(38, 10 + diagram.teethB * 0.55)) : Math.max(20, Math.min(42, 12 + diagram.teethB * 0.7));

    return (
      <svg viewBox="0 0 220 130" role="img" aria-label={`${diagram.connectedBy} rotation diagram`} className="h-full w-full">
        <ArrowDefs />
        {belt && diagram.connectedBy === "open-belt" && (
          <OpenBelt ax={ax} ay={cy} ar={rA} bx={bx} by={cy} br={rB} />
        )}
        {belt && diagram.connectedBy === "crossed-belt" && (
          <CrossedBelt ax={ax} ay={cy} ar={rA} bx={bx} by={cy} br={rB} />
        )}
        {belt ? (
          <>
            <PulleyWheel cx={ax} cy={cy} r={rA} fill="#ffd447" label="A" />
            <PulleyWheel cx={bx} cy={cy} r={rB} fill="#6fc8ff" label="B" />
            <RotationArrow cx={ax} cy={cy} r={rA} clockwise />
          </>
        ) : (
          <>
            <GearWheel cx={ax} cy={cy} r={rA} teeth={diagram.teethA} fill="#ffd447" label="A" />
            <GearWheel cx={bx} cy={cy} r={rB} teeth={diagram.teethB} fill="#6fc8ff" label="B" />
            <RotationArrow cx={ax} cy={cy} r={rA} clockwise />
            <text x={(ax + bx) / 2} y={16} textAnchor="middle" style={fontTiny} fill="#0057a8">
              meshed gears
            </text>
          </>
        )}
        <text x={clampLabelX(ax, diagram.labelA, 220, 4, 10)} y={118} textAnchor="middle" style={fontSm}>
          {diagram.labelA}
        </text>
        <text x={clampLabelX(bx, diagram.labelB, 220, 4, 10)} y={118} textAnchor="middle" style={fontSm}>
          {diagram.labelB}
        </text>
        {!belt && (
          <text x={(ax + bx) / 2} y={cy + 4} textAnchor="middle" style={fontTiny} fill="#666">
            {diagram.teethA}:{diagram.teethB}
          </text>
        )}
      </svg>
    );
  }

  if (diagram.type === "gears3") {
    return (
      <svg viewBox="0 0 260 130" role="img" aria-label="Three meshed gears diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="130" y="14" textAnchor="middle" style={fontTiny} fill="#0057a8">
          three meshed gears
        </text>
        <GearWheel cx={48} cy={58} r={28} teeth={16} fill="#ffd447" label="A" />
        <GearWheel cx={120} cy={58} r={22} teeth={12} fill="#6fc8ff" label="B" />
        <GearWheel cx={190} cy={58} r={28} teeth={16} fill="#ff82ad" label="C" />
        <RotationArrow cx={48} cy={58} r={28} clockwise />
        <text x="48" y={116} textAnchor="middle" style={fontSm}>
          {diagram.labelA}
        </text>
        <text x="120" y={116} textAnchor="middle" style={fontSm}>
          {diagram.labelB}
        </text>
        <text x="190" y={116} textAnchor="middle" style={fontSm}>
          {diagram.labelC}
        </text>
      </svg>
    );
  }

  if (diagram.type === "incline") {
    const angle = Math.atan2(diagram.rise, diagram.run) * (180 / Math.PI);
    return (
      <svg viewBox="0 0 240 125" role="img" aria-label={`Inclined plane: rise ${diagram.rise}, run ${diagram.run}`} className="h-full w-full">
        <ArrowDefs />
        <path d="M 24 95 L 185 95 L 185 30 Z" fill="#fffaf0" stroke={ink} strokeWidth={stroke} />
        {/* right angle mark */}
        <path d="M 170 95 V 82 H 185" fill="none" stroke={ink} strokeWidth={1.5} />
        <g transform={`translate(118 52) rotate(${-angle})`}>
          <rect x="-22" y="-14" width="44" height="28" rx="2" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
          <text x="0" y="4" textAnchor="middle" style={fontSm}>
            {diagram.loadLabel}
          </text>
        </g>
        <text x="198" y="66" style={fontSm}>
          rise {diagram.rise}
        </text>
        <text x="105" y="112" textAnchor="middle" style={fontSm}>
          run {diagram.run}
        </text>
        <text x="120" y="16" textAnchor="middle" style={fontTiny}>
          inclined plane
        </text>
      </svg>
    );
  }

  if (diagram.type === "spring") {
    return (
      <svg viewBox="0 0 200 125" role="img" aria-label="Spring extension diagram" className="h-full w-full">
        <ArrowDefs />
        <line x1="30" y1="14" x2="170" y2="14" stroke={ink} strokeWidth={4} />
        <text x="100" y="10" textAnchor="middle" style={fontTiny}>
          fixed support
        </text>
        {/* coil spring */}
        <path
          d="M 100 14 L 100 22 L 78 30 L 122 40 L 78 50 L 122 60 L 78 70 L 122 80 L 100 88 L 100 94"
          fill="none"
          stroke="#0057a8"
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        <rect x="70" y="94" width="60" height="20" rx="2" fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <text x="100" y="108" textAnchor="middle" style={fontSm}>
          {diagram.forceLabel}
        </text>
        <line x1="140" y1="22" x2="140" y2="88" stroke="#b42318" strokeWidth={1.5} strokeDasharray="3 2" />
        <text x="168" y="58" textAnchor="middle" style={fontSm}>
          {diagram.extension} cm
        </text>
      </svg>
    );
  }

  if (diagram.type === "hydraulic") {
    return (
      <svg viewBox="0 0 220 130" role="img" aria-label="Hydraulic pistons diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="110" y="14" textAnchor="middle" style={fontTiny}>
          hydraulic press (same fluid pressure)
        </text>
        {/* U-tube body */}
        <path d="M 40 48 V 100 H 180 V 36" fill="none" stroke={ink} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 44 78 H 176 V 100 H 44 Z" fill="#6fc8ff" opacity={0.75} />
        {/* small piston A */}
        <rect x="28" y="42" width="36" height="10" rx="1" fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <line x1="46" y1="14" x2="46" y2="40" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
        <text x="62" y="28" style={fontSm}>
          {diagram.forceA} N
        </text>
        {/* large piston B */}
        <rect x="128" y="30" width="62" height="10" rx="1" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
        <line x1="159" y1="28" x2="159" y2="12" stroke="#0057a8" strokeWidth={2.5} markerEnd="url(#ma-arrow-blue)" />
        <text x="46" y="118" textAnchor="middle" style={fontSm}>
          A = {diagram.areaA}
        </text>
        <text x="159" y="118" textAnchor="middle" style={fontSm}>
          B = {diagram.areaB}
        </text>
      </svg>
    );
  }

  if (diagram.type === "aircraft") {
    const failLeft = diagram.failedEngine === "left";
    const failRight = diagram.failedEngine === "right";
    return (
      <svg viewBox="0 0 280 150" role="img" aria-label="Twin-engine aircraft top view" className="h-full w-full">
        <ArrowDefs />
        <text x="140" y="14" textAnchor="middle" style={fontTiny}>
          top view — nose forward
        </text>
        {/* fuselage */}
        <ellipse cx="140" cy="78" rx="16" ry="52" fill="#fffaf0" stroke={ink} strokeWidth={stroke} />
        {/* nose cone */}
        <path d="M 140 26 L 130 10 H 150 Z" fill="#ffd447" stroke={ink} strokeWidth={strokeThin} />
        {/* forward arrow */}
        <line x1="140" y1="8" x2="140" y2="-2" stroke="#0057a8" strokeWidth={2} />
        {/* wings */}
        <path d="M 36 72 H 244 V 86 H 36 Z" fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
        {/* tail */}
        <path d="M 128 120 H 152 V 132 H 128 Z" fill="#ffd447" stroke={ink} strokeWidth={strokeThin} />
        {/* left engine */}
        <rect x="58" y="62" width="34" height="34" rx="4" fill={failLeft ? "#ffb4b4" : "#ffd447"} stroke={ink} strokeWidth={stroke} />
        <text x="75" y="82" textAnchor="middle" style={fontSm}>
          L
        </text>
        {/* right engine */}
        <rect x="188" y="62" width="34" height="34" rx="4" fill={failRight ? "#ffb4b4" : "#ffd447"} stroke={ink} strokeWidth={stroke} />
        <text x="205" y="82" textAnchor="middle" style={fontSm}>
          R
        </text>
        {failLeft && (
          <>
            <line x1="62" y1="66" x2="88" y2="92" stroke="#b42318" strokeWidth={3} />
            <line x1="88" y1="66" x2="62" y2="92" stroke="#b42318" strokeWidth={3} />
            <text x="75" y="112" textAnchor="middle" style={fontSm} fill="#b42318">
              FAILED
            </text>
            {/* yaw arrow — dead engine left → yaw left (plane yaws toward failed) */}
            <path d="M 100 40 Q 70 30 55 50" fill="none" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
          </>
        )}
        {failRight && (
          <>
            <line x1="192" y1="66" x2="218" y2="92" stroke="#b42318" strokeWidth={3} />
            <line x1="218" y1="66" x2="192" y2="92" stroke="#b42318" strokeWidth={3} />
            <text x="205" y="112" textAnchor="middle" style={fontSm} fill="#b42318">
              FAILED
            </text>
            <path d="M 180 40 Q 210 30 225 50" fill="none" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
          </>
        )}
        {!failLeft && !failRight && (
          <>
            <text x="75" y="112" textAnchor="middle" style={fontTiny}>
              L engine
            </text>
            <text x="205" y="112" textAnchor="middle" style={fontTiny}>
              R engine
            </text>
          </>
        )}
        <text x="140" y="146" textAnchor="middle" style={fontSm}>
          {diagram.caption}
        </text>
      </svg>
    );
  }

  if (diagram.type === "doppler") {
    const toward = diagram.motion === "toward";
    const away = diagram.motion === "away";
    const carX = toward ? 48 : away ? 150 : 100;
    return (
      <svg viewBox="0 0 280 140" role="img" aria-label="Doppler effect diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="140" y="14" textAnchor="middle" style={font}>
          {toward ? "source approaching" : away ? "source receding" : "source passing by"}
        </text>
        {/* road */}
        <line x1="16" y1="105" x2="264" y2="105" stroke={ink} strokeWidth={3} />
        <line x1="16" y1="105" x2="264" y2="105" stroke="#fff" strokeWidth={1} strokeDasharray="8 6" />
        {/* vehicle */}
        <rect x={carX} y="62" width="64" height="30" rx="3" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
        <circle cx={carX + 14} cy="98" r={7} fill="#171717" />
        <circle cx={carX + 50} cy="98" r={7} fill="#171717" />
        <text x={carX + 32} y="82" textAnchor="middle" style={fontSm}>
          {diagram.sourceLabel}
        </text>
        {/* motion arrow */}
        {toward && (
          <line x1={carX + 72} y1="76" x2={carX + 110} y2="76" stroke="#b42318" strokeWidth={3} markerEnd="url(#ma-arrow-red)" />
        )}
        {away && (
          <line x1={carX - 8} y1="76" x2={carX - 46} y2="76" stroke="#b42318" strokeWidth={3} markerEnd="url(#ma-arrow-red)" />
        )}
        {diagram.motion === "pass" && (
          <line x1={carX + 72} y1="76" x2={carX + 110} y2="76" stroke="#b42318" strokeWidth={3} markerEnd="url(#ma-arrow-red)" />
        )}
        {/* listener */}
        <circle cx="240" cy="78" r={16} fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <text x="240" y="82" textAnchor="middle" style={fontSm}>
          ear
        </text>
        <text x="240" y="128" textAnchor="middle" style={fontTiny}>
          {diagram.listenerLabel}
        </text>
        {/* wave fronts: compressed ahead when approaching */}
        {(toward || diagram.motion === "pass") && (
          <>
            <path d={`M ${carX + 70} 45 Q ${carX + 100} 78 ${carX + 70} 110`} fill="none" stroke="#0057a8" strokeWidth={2} />
            <path d={`M ${carX + 82} 38 Q ${carX + 120} 78 ${carX + 82} 118`} fill="none" stroke="#0057a8" strokeWidth={2} />
            <path d={`M ${carX + 92} 32 Q ${carX + 138} 78 ${carX + 92} 124`} fill="none" stroke="#0057a8" strokeWidth={2} />
            <text x={carX + 118} y="30" textAnchor="middle" style={fontTiny} fill="#0057a8">
              waves closer
            </text>
          </>
        )}
        {away && (
          <>
            <path d={`M ${carX - 8} 40 Q ${carX - 50} 78 ${carX - 8} 116`} fill="none" stroke="#0057a8" strokeWidth={2} />
            <path d={`M ${carX + 8} 32 Q ${carX - 70} 78 ${carX + 8} 124`} fill="none" stroke="#0057a8" strokeWidth={2} />
            <text x={carX - 40} y="28" textAnchor="middle" style={fontTiny} fill="#0057a8">
              waves farther
            </text>
          </>
        )}
      </svg>
    );
  }

  if (diagram.type === "boat") {
    const rudder = diagram.rudder;
    const rudderTip = rudder === "left" ? 95 : rudder === "right" ? 145 : 120;
    return (
      <svg viewBox="0 0 240 140" role="img" aria-label="Boat and rudder diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="120" y="14" textAnchor="middle" style={fontTiny}>
          boat — top view
        </text>
        {/* hull */}
        <path d="M 120 22 L 178 95 L 120 112 L 62 95 Z" fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
        <text x="120" y="72" textAnchor="middle" style={fontSm}>
          bow ↑
        </text>
        {/* forward arrow */}
        <line x1="120" y1="20" x2="120" y2="6" stroke="#0057a8" strokeWidth={2.5} markerEnd="url(#ma-arrow-blue)" />
        <text x="138" y="14" style={fontTiny}>
          forward
        </text>
        {/* rudder */}
        <line x1="120" y1="112" x2={rudderTip} y2="128" stroke={ink} strokeWidth={6} strokeLinecap="round" />
        <text x="120" y="138" textAnchor="middle" style={fontSm}>
          rudder {rudder === "straight" ? "centred" : `deflected ${rudder}`}
        </text>
      </svg>
    );
  }

  if (diagram.type === "buoyancy") {
    const y = diagram.state === "float" ? 42 : diagram.state === "suspend" ? 68 : 90;
    return (
      <svg viewBox="0 0 200 130" role="img" aria-label="Buoyancy diagram" className="h-full w-full">
        <ArrowDefs />
        <rect x="28" y="28" width="144" height="88" fill="#cceeff" stroke={ink} strokeWidth={stroke} />
        <line x1="28" y1="50" x2="172" y2="50" stroke="#0057a8" strokeWidth={2} strokeDasharray="5 3" />
        <text x="176" y="54" style={fontTiny}>
          waterline
        </text>
        <rect x="82" y={y} width="36" height="26" rx="2" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
        <text x="100" y={y + 17} textAnchor="middle" style={fontTiny}>
          {diagram.objectLabel}
        </text>
        {/* force arrows */}
        {diagram.state !== "sink" && (
          <line x1="100" y1={y} x2="100" y2={y - 16} stroke="#0057a8" strokeWidth={2} markerEnd="url(#ma-arrow-blue)" />
        )}
        <line x1="100" y1={y + 26} x2="100" y2={y + 40} stroke="#b42318" strokeWidth={2} markerEnd="url(#ma-arrow-red)" />
        <text x="100" y="18" textAnchor="middle" style={font}>
          {diagram.state === "float" ? "floats" : diagram.state === "suspend" ? "suspended" : "sinks"}
        </text>
      </svg>
    );
  }

  if (diagram.type === "shadow") {
    const lightX = diagram.lightSide === "left" ? 28 : 172;
    const objX = 100;
    const objTop = diagram.objectHeight === "tall" ? 38 : 58;
    const objH = diagram.objectHeight === "tall" ? 57 : 37;
    const shadowEnd = diagram.lightSide === "left" ? 178 : 22;
    return (
      <svg viewBox="0 0 200 125" role="img" aria-label="Light and shadow diagram" className="h-full w-full">
        <ArrowDefs />
        <line x1="12" y1="95" x2="188" y2="95" stroke={ink} strokeWidth={3} />
        {/* sun */}
        <circle cx={lightX} cy="26" r={14} fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <text x={lightX} y="30" textAnchor="middle" style={fontTiny}>
          sun
        </text>
        {/* light rays */}
        <line x1={lightX} y1="40" x2={objX} y2={objTop} stroke="#ffd447" strokeWidth={1.5} opacity={0.8} />
        <line x1={lightX} y1="40" x2={shadowEnd} y2="95" stroke="#ffd447" strokeWidth={1.5} opacity={0.5} strokeDasharray="4 2" />
        {/* object */}
        <rect x={objX - 12} y={objTop} width="24" height={objH} fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
        {/* shadow */}
        <path d={`M ${objX} 95 L ${shadowEnd} 95`} stroke="#171717" strokeWidth={12} opacity={0.3} strokeLinecap="round" />
        <text x="100" y="118" textAnchor="middle" style={fontSm}>
          shadow on ground
        </text>
      </svg>
    );
  }

  if (diagram.type === "spanner") {
    const forceAtFar = diagram.forceAt === "far";
    const nutCx = 48;
    const nutCy = 52;
    const nutR = 18;
    const forceX = forceAtFar ? 205 : 100;
    return (
      <svg viewBox="0 0 250 130" role="img" aria-label="Spanner and hex nut diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="125" y="14" textAnchor="middle" style={fontTiny}>
          open-ended spanner on a hex nut
        </text>
        {/* wrench body: C-jaw + long handle */}
        <path
          d="M 18 28
             H 62
             V 40
             H 78
             V 64
             H 62
             V 76
             H 18
             V 64
             H 36
             V 40
             H 18
             Z"
          fill="#6fc8ff"
          stroke={ink}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
        <rect x="78" y="44" width="140" height="16" rx="3" fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
        {/* grip ridges on handle end */}
        <line x1="200" y1="46" x2="200" y2="58" stroke={ink} strokeWidth={1.2} opacity={0.5} />
        <line x1="208" y1="46" x2="208" y2="58" stroke={ink} strokeWidth={1.2} opacity={0.5} />
        <line x1="216" y1="46" x2="216" y2="58" stroke={ink} strokeWidth={1.2} opacity={0.5} />
        {/* hex nut sits in the open jaw */}
        <HexNut cx={nutCx} cy={nutCy} r={nutR} showLabel={false} />
        <text x={nutCx} y={92} textAnchor="middle" style={fontSm}>
          hex nut
        </text>
        {/* force arrow */}
        <line
          x1={forceX}
          y1={22}
          x2={forceX}
          y2={42}
          stroke="#b42318"
          strokeWidth={3}
          markerEnd="url(#ma-arrow-red)"
        />
        <text x={forceX} y={20} textAnchor="middle" style={font}>
          F
        </text>
        <text x={forceX} y={78} textAnchor="middle" style={fontTiny} fill="#b42318">
          {forceAtFar ? "at handle end" : "near the nut"}
        </text>
        {/* lever-arm dimension from nut centre to force */}
        <line x1={nutCx} y1={108} x2={forceX} y2={108} stroke={ink} strokeWidth={1.5} />
        <line x1={nutCx} y1={104} x2={nutCx} y2={112} stroke={ink} strokeWidth={1.5} />
        <line x1={forceX} y1={104} x2={forceX} y2={112} stroke={ink} strokeWidth={1.5} />
        <text x={(nutCx + forceX) / 2} y={124} textAnchor="middle" style={fontSm}>
          {forceAtFar ? "longer arm → greater torque" : "shorter arm → less torque"}
        </text>
      </svg>
    );
  }

  if (diagram.type === "wheel") {
    const rA = Math.max(14, Math.min(42, diagram.diameterA / 2));
    const rB = Math.max(10, Math.min(36, diagram.diameterB / 2));
    return (
      <svg viewBox="0 0 240 130" role="img" aria-label="Wheel and axle diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="120" y="14" textAnchor="middle" style={fontTiny}>
          wheel and axle
        </text>
        {/* axle shaft */}
        <line x1="40" y1="60" x2="200" y2="60" stroke={ink} strokeWidth={8} strokeLinecap="round" />
        {/* wheel A */}
        <circle cx="80" cy="60" r={rA} fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <circle cx="80" cy="60" r={rA * 0.55} fill="none" stroke={ink} strokeWidth={1.5} opacity={0.5} />
        <circle cx="80" cy="60" r={4} fill={ink} />
        {/* spokes */}
        {[0, 45, 90, 135].map((deg) => {
          const a = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={80}
              y1={60}
              x2={80 + rA * 0.85 * Math.cos(a)}
              y2={60 + rA * 0.85 * Math.sin(a)}
              stroke={ink}
              strokeWidth={1.2}
              opacity={0.5}
            />
          );
        })}
        {/* axle drum B */}
        <circle cx="170" cy="60" r={rB} fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
        <circle cx="170" cy="60" r={4} fill={ink} />
        <text x="80" y={118} textAnchor="middle" style={fontSm}>
          {diagram.labelA}
        </text>
        <text x="170" y={118} textAnchor="middle" style={fontSm}>
          {diagram.labelB}
        </text>
      </svg>
    );
  }

  if (diagram.type === "door") {
    return (
      <svg viewBox="0 0 210 140" role="img" aria-label="Door hinge and handle diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="105" y="14" textAnchor="middle" style={fontTiny}>
          door (top / front view)
        </text>
        {/* door panel */}
        <rect x="40" y="24" width="110" height="95" fill="#fffaf0" stroke={ink} strokeWidth={stroke} />
        {/* hinges */}
        <rect x="38" y="36" width="10" height="14" fill="#ffd447" stroke={ink} strokeWidth={strokeThin} />
        <rect x="38" y="88" width="10" height="14" fill="#ffd447" stroke={ink} strokeWidth={strokeThin} />
        <text x="28" y="70" textAnchor="middle" style={fontTiny} transform="rotate(-90 28 70)">
          hinges
        </text>
        {/* handle */}
        <circle
          cx={diagram.handleFar ? 135 : 68}
          cy="72"
          r={9}
          fill="#ff82ad"
          stroke={ink}
          strokeWidth={stroke}
        />
        <text x={diagram.handleFar ? 135 : 68} y="76" textAnchor="middle" style={fontTiny}>
          H
        </text>
        {/* lever arm line */}
        <line
          x1={43}
          y1={128}
          x2={diagram.handleFar ? 135 : 68}
          y2={128}
          stroke={ink}
          strokeWidth={1.5}
          markerEnd="url(#ma-arrow)"
        />
        <text x="100" y={138} textAnchor="middle" style={fontSm}>
          handle {diagram.handleFar ? "far from hinges" : "near hinges"}
        </text>
      </svg>
    );
  }

  if (diagram.type === "cam") {
    return (
      <svg viewBox="0 0 220 130" role="img" aria-label="Cam and follower diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="110" y="14" textAnchor="middle" style={fontTiny}>
          cam and follower
        </text>
        {/* cam (egg / eccentric) */}
        <ellipse cx="110" cy="78" rx="42" ry="26" fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <circle cx="95" cy="78" r={5} fill={ink} />
        <RotationArrow cx={95} cy={78} r={28} clockwise />
        {/* follower rod */}
        <rect x="98" y="18" width="24" height="36" rx="2" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
        <line x1="110" y1="18" x2="110" y2="6" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
        <text x="148" y="36" style={fontSm}>
          follower
        </text>
        <text x="110" y="122" textAnchor="middle" style={fontSm}>
          cam spins → follower rises / falls
        </text>
      </svg>
    );
  }

  if (diagram.type === "beam") {
    const loadX = diagram.loadAt === "centre" ? 120 : diagram.loadAt === "left" ? 70 : 170;
    return (
      <svg viewBox="0 0 240 115" role="img" aria-label="Supported beam diagram" className="h-full w-full">
        <ArrowDefs />
        <text x="120" y="12" textAnchor="middle" style={fontTiny}>
          simply supported beam
        </text>
        <line x1="30" y1="50" x2="210" y2="50" stroke={ink} strokeWidth={6} strokeLinecap="round" />
        {/* supports */}
        <path d="M 40 50 L 30 78 L 50 78 Z" fill="#ffd447" stroke={ink} strokeWidth={strokeThin} />
        <path d="M 200 50 L 190 78 L 210 78 Z" fill="#ffd447" stroke={ink} strokeWidth={strokeThin} />
        <text x="40" y="92" textAnchor="middle" style={fontTiny}>
          support
        </text>
        <text x="200" y="92" textAnchor="middle" style={fontTiny}>
          support
        </text>
        {/* load */}
        <line x1={loadX} y1="28" x2={loadX} y2="46" stroke="#b42318" strokeWidth={2.5} markerEnd="url(#ma-arrow-red)" />
        <rect x={loadX - 16} y="14" width="32" height="16" rx="2" fill="#ff82ad" stroke={ink} strokeWidth={strokeThin} />
        <text x={loadX} y="26" textAnchor="middle" style={fontTiny}>
          load
        </text>
        <text x="120" y="108" textAnchor="middle" style={fontSm}>
          load at {diagram.loadAt}
        </text>
      </svg>
    );
  }

  // balance (default)
  const rotation = diagram.state === "level" ? 0 : diagram.state === "left-down" ? -8 : 8;
  return (
    <svg viewBox="0 0 200 120" role="img" aria-label="Balance scale diagram" className="h-full w-full">
      <ArrowDefs />
      <text x="100" y="12" textAnchor="middle" style={fontTiny}>
        balance scale
      </text>
      <g transform={`rotate(${rotation} 100 48)`}>
        <line x1="32" y1="48" x2="168" y2="48" stroke={ink} strokeWidth={5} strokeLinecap="round" />
        <line x1="48" y1="48" x2="48" y2="72" stroke={ink} strokeWidth={2} />
        <line x1="152" y1="48" x2="152" y2="72" stroke={ink} strokeWidth={2} />
        <path d="M 24 72 H 72 L 64 90 H 32 Z" fill="#ffd447" stroke={ink} strokeWidth={stroke} />
        <path d="M 128 72 H 176 L 168 90 H 136 Z" fill="#6fc8ff" stroke={ink} strokeWidth={stroke} />
        <text x="48" y="84" textAnchor="middle" style={fontTiny}>
          {diagram.leftLabel}
        </text>
        <text x="152" y="84" textAnchor="middle" style={fontTiny}>
          {diagram.rightLabel}
        </text>
      </g>
      <path d="M 86 105 L 100 50 L 114 105 Z" fill="#ff82ad" stroke={ink} strokeWidth={stroke} />
      <text x="100" y="118" textAnchor="middle" style={fontTiny}>
        fulcrum
      </text>
    </svg>
  );
}
