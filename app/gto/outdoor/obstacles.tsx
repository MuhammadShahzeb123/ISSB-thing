import type { ReactNode } from 'react';
import { gait, shoulderOf, stand, standingHip, type Keyframe, type Point, type Pose } from './figureEngine';

// Scene coordinates: viewBox 0 0 480 260, ground at y = 230. The figure is
// about 102 units tall, so one unit is roughly 1.7 cm for a 1.75 m candidate.
export const VIEW = { width: 480, height: 260 } as const;
const G = 230;

export type PoseJoint = keyof Pose;

export type ObstacleStep = {
  at: number;
  title: string;
  tip: string;
  /** Joint to highlight while this step is active. */
  focus?: PoseJoint;
};

export type SceneProps = { t: number; pose: Pose };

export type Obstacle = {
  id: string;
  name: string;
  summary: string;
  /** What the layout looks like; heights and widths are reported, not official. */
  layout: string[];
  mistakes: string[];
  steps: ObstacleStep[];
  keyframes: Keyframe[];
  Scene: (props: SceneProps) => ReactNode;
  Foreground?: (props: SceneProps) => ReactNode;
};

const COLORS = {
  ground: '#8a6a3f',
  grass: '#b8e85c',
  wood: '#c98a4b',
  woodDark: '#8a5a2b',
  rope: '#a8742f',
  metal: '#5b6470',
  mat: '#6fc8ff',
  sand: '#f1d38a',
  tyre: '#262626',
  target: '#ff82ad',
} as const;

function Ground({ from = 0, to = VIEW.width }: { from?: number; to?: number }) {
  return <>
    <rect x={from} y={G} width={to - from} height={VIEW.height - G} fill={COLORS.sand} opacity={0.55} />
    <line x1={from} y1={G} x2={to} y2={G} stroke={COLORS.ground} strokeWidth={3} />
  </>;
}

function Dimension({ x1, x2, y, label }: { x1: number; x2: number; y: number; label: string }) {
  return <g className="obstacle-dimension" aria-hidden="true">
    <line x1={x1} y1={y} x2={x2} y2={y} />
    <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
    <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
    <text x={(x1 + x2) / 2} y={y - 5} textAnchor="middle">{label}</text>
  </g>;
}

function VerticalDimension({ x, y1, y2, label, side = 'right' }: { x: number; y1: number; y2: number; label: string; side?: 'left' | 'right' }) {
  return <g className="obstacle-dimension" aria-hidden="true">
    <line x1={x} y1={y1} x2={x} y2={y2} />
    <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} />
    <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} />
    {label && <text x={side === 'right' ? x + 6 : x - 6} y={(y1 + y2) / 2 + 3} textAnchor={side === 'right' ? 'start' : 'end'}>{label}</text>}
  </g>;
}

const ropePath = (points: { x: number; y: number }[]) => points.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');

/** Balance-arm hand positions, as world points, for a hip and lean. */
function armsOut(x: number, y: number, lean: number) {
  const shoulder = shoulderOf({ x, y }, lean);
  return { lh: { x: shoulder.x - 20, y: shoulder.y + 12 }, rh: { x: shoulder.x + 24, y: shoulder.y + 10 } };
}

// ---------------------------------------------------------------------------
// 1. Long jump (ditch)

const DITCH = { near: 200, far: 312 } as const;

const longJumpFrames: Keyframe[] = (() => {
  const run = gait(0.5, 40, 4, 'r', { groundY: G, stepTime: 0.28, stepLength: 36, run: true });
  return [
    stand(0, 22, G),
    { t: 0.3, x: 24, y: 190, lean: 14, lf: { x: 18, y: G }, rf: { x: 30, y: G } },
    ...run.frames,
    { t: 1.76, x: 206, y: 172, lean: 8, lf: { x: 218, y: 196 }, rf: { x: 196, y: 229 }, lh: { x: 228, y: 130 }, rh: { x: 222, y: 136 } },
    { t: 1.98, x: 246, y: 152, lean: 12, lf: { x: 268, y: 176 }, rf: { x: 262, y: 182 }, lh: { x: 262, y: 118 }, rh: { x: 256, y: 122 } },
    { t: 2.22, x: 288, y: 168, lean: 24, lf: { x: 332, y: 196 }, rf: { x: 328, y: 200 }, lh: { x: 328, y: 176 }, rh: { x: 324, y: 180 } },
    { t: 2.38, x: 306, y: 194, lean: 30, lf: { x: 328, y: G }, rf: { x: 324, y: G }, lh: { x: 334, y: 182 }, rh: { x: 330, y: 186 } },
    { t: 2.58, x: 322, y: 206, lean: 38, lf: { x: 328, y: G }, rf: { x: 324, y: G }, lh: { x: 356, y: 196 }, rh: { x: 352, y: 200 } },
    { t: 3.0, x: 328, y: 190, lean: 8, lf: { x: 328, y: G }, rf: { x: 324, y: G } },
    stand(3.6, 332, G),
    stand(4.4, 332, G),
  ];
})();

const longJump: Obstacle = {
  id: 'long-jump',
  name: 'Long jump (ditch)',
  summary: 'Clear a wide ditch from a short run-up. Speed and a committed take-off from the near edge matter more than height.',
  layout: [
    'A ditch with a take-off line on the near bank. For the Lady Cadet Course, candidates report a width of about 6 ft 9 in (about 2 m) with mattresses in the ditch.',
    'Widths and run-up lengths are reported by candidates. They are not official figures and may differ between boards and entries.',
  ],
  mistakes: [
    'Slowing down or stuttering before the edge. That kills your momentum.',
    'Taking off too far back, or stepping over the line and into the ditch.',
    'Leaning back on landing and sitting down into the ditch.',
    'Looking down into the ditch instead of at the far bank.',
  ],
  steps: [
    { at: 0, title: 'Mark and get ready', tip: 'Know your take-off foot. Start from a spot that lets that foot land on the edge naturally.', focus: 'rFoot' },
    { at: 0.5, title: 'Accelerate', tip: 'Run in a controlled rhythm and keep your eyes on the far bank, not the ditch.', focus: 'head' },
    { at: 1.34, title: 'Plant on the edge', tip: 'Keep your speed. Put the whole take-off foot down flat, just behind the edge.', focus: 'rFoot' },
    { at: 1.62, title: 'Drive up and forward', tip: 'Push hard through the take-off leg and drive the free knee and both arms up. Aim for a low, forward flight of roughly 20–25°, not a high hop.', focus: 'lKnee' },
    { at: 1.9, title: 'Hold the flight', tip: 'Keep your chest up and bring both legs forward together.', focus: 'hip' },
    { at: 2.2, title: 'Reach and land', tip: 'Reach your heels forward, land on both feet and swing your arms forward.', focus: 'lFoot' },
    { at: 2.5, title: 'Absorb forward', tip: 'Bend your knees and let your weight roll forward, never backward. Then move on to the next obstacle.', focus: 'lKnee' },
  ],
  keyframes: longJumpFrames,
  Scene: () => <>
    <Ground to={DITCH.near} />
    <Ground from={DITCH.far} />
    <path d={`M ${DITCH.near} ${G} L ${DITCH.near + 6} ${VIEW.height} L ${DITCH.far - 6} ${VIEW.height} L ${DITCH.far} ${G}`} fill="#5c4a33" opacity={0.35} />
    <rect x={DITCH.near + 8} y={248} width={DITCH.far - DITCH.near - 16} height={10} fill={COLORS.mat} stroke="#171717" strokeWidth={1.5} />
    <rect x={182} y={G - 1} width={18} height={4} fill="#fffaf0" stroke="#171717" strokeWidth={1} />
    <Dimension x1={DITCH.near} x2={DITCH.far} y={42} label="about 2 m (varies)" />
  </>,
};

// ---------------------------------------------------------------------------
// 2. High jump (scissors technique)

const BAR = { x: 260, y: 182 } as const;

const highJumpFrames: Keyframe[] = (() => {
  const run = gait(0.4, 70, 4, 'l', { groundY: G, stepTime: 0.3, stepLength: 34, run: true });
  const last = run.frames[run.frames.length - 1];
  run.frames[run.frames.length - 1] = { ...last, lean: -4 };
  return [
    stand(0, 52, G),
    ...run.frames,
    { t: 1.78, x: 226, y: 168, lean: 0, lf: { x: 220, y: 228 }, rf: { x: 264, y: 150 }, lh: { x: 240, y: 124 }, rh: { x: 234, y: 128 } },
    { t: 1.96, x: 254, y: 150, lean: 6, lf: { x: 234, y: 170 }, rf: { x: 288, y: 166 }, lh: { x: 272, y: 126 }, rh: { x: 264, y: 130 } },
    { t: 2.1, x: 270, y: 158, lean: 10, lf: { x: 274, y: 164 }, rf: { x: 298, y: 202 }, lh: { x: 290, y: 138 }, rh: { x: 280, y: 142 } },
    { t: 2.26, x: 294, y: 188, lean: 12, lf: { x: 292, y: 206 }, rf: { x: 304, y: G }, lh: { x: 318, y: 166 }, rh: { x: 280, y: 170 } },
    { t: 2.46, x: 304, y: 198, lean: 18, lf: { x: 314, y: G }, rf: { x: 304, y: G } },
    stand(2.9, 310, G),
    stand(3.6, 310, G),
  ];
})();

const highJump: Obstacle = {
  id: 'high-jump',
  name: 'High jump',
  summary: 'Clear a bar set across two poles using the scissors technique. You take off from one foot and land on your feet, not your back.',
  layout: [
    'A bar resting on two uprights with a soft landing area. For the Lady Cadet Course, candidates report a height of about 2 ft 8 in (about 0.8 m). Male entries usually face a higher bar.',
    'Heights are reported by candidates, not published by ISSB, and may change.',
  ],
  mistakes: [
    'Running too close to the bar, so the lead leg has no room to swing.',
    'Bending the lead knee. A tucked knee hits the bar.',
    'Diving head first or landing on your back. There is usually no thick pit.',
    'Stopping at the bar after a hesitant run-up.',
  ],
  steps: [
    { at: 0, title: 'Measure the run-up', tip: 'Use 5 to 7 springy strides so you arrive balanced, not flat out.', focus: 'lFoot' },
    { at: 1.45, title: 'Plant about an arm’s length away', tip: 'Take off from the foot farther from the bar. Lean back very slightly as you plant.', focus: 'lFoot' },
    { at: 1.7, title: 'Swing the lead leg straight', tip: 'Kick the lead leg straight up and over the bar while both arms drive up.', focus: 'rFoot' },
    { at: 1.95, title: 'Scissor over', tip: 'The lead leg comes down as the trail leg lifts over. Keep your hips high and your chest upright.', focus: 'lFoot' },
    { at: 2.2, title: 'Land on your feet', tip: 'Land on the lead foot, then both feet, with knees bent. Keep your arms out for balance.', focus: 'rFoot' },
  ],
  keyframes: highJumpFrames,
  Scene: () => <>
    <Ground />
    <rect x={272} y={G - 6} width={130} height={10} fill={COLORS.mat} stroke="#171717" strokeWidth={1.5} />
    <line x1={BAR.x + 12} y1={G} x2={BAR.x + 12} y2={BAR.y - 32} stroke={COLORS.metal} strokeWidth={4} opacity={0.55} />
    <line x1={BAR.x - 10} y1={BAR.y + 2} x2={BAR.x + 12} y2={BAR.y - 4} stroke="#ff8177" strokeWidth={4} strokeLinecap="round" />
    <VerticalDimension x={BAR.x - 24} y1={BAR.y} y2={G} label="" />
    <text x={BAR.x - 24} y={30} textAnchor="middle" className="obstacle-dimension-text">bar 0.8 m+ (varies)</text>
    <line x1={BAR.x - 24} y1={34} x2={BAR.x - 24} y2={BAR.y - 6} className="obstacle-guide" />
  </>,
  Foreground: () => <line x1={BAR.x - 10} y1={G + 4} x2={BAR.x - 10} y2={BAR.y - 26} stroke={COLORS.metal} strokeWidth={5} />,
};

// ---------------------------------------------------------------------------
// 3. Rope climb (J-hook / S-wrap leg lock)

const ROPE_X = 250;
const BEAM_Y = 18;

function ropeHang(t: number, lock: number): Keyframe {
  return { t, x: 232, y: lock - 16, lean: 5, lf: { x: ROPE_X - 1, y: lock }, rf: { x: ROPE_X + 3, y: lock + 4 }, lh: { x: ROPE_X, y: lock - 74 }, rh: { x: ROPE_X, y: lock - 68 } };
}

const ropeClimbFrames: Keyframe[] = (() => {
  const frames: Keyframe[] = [
    stand(0, 224, G),
    { ...stand(0.5, 228, G), lh: { x: ROPE_X, y: 136 }, rh: { x: ROPE_X, y: 142 } },
  ];
  let t = 1.0;
  for (const lock of [210, 180, 150]) {
    const hang = ropeHang(t, lock);
    const standUp = { ...hang, t: t + 0.5, x: 236, y: lock - 44, lean: 0 };
    frames.push(hang, standUp);
    frames.push({ ...standUp, t: t + 0.8, lh: { x: ROPE_X, y: lock - 104 } });
    frames.push({ ...standUp, t: t + 1.1, lh: { x: ROPE_X, y: lock - 104 }, rh: { x: ROPE_X, y: lock - 100 } });
    t += 1.6;
  }
  const top = ropeHang(t, 120);
  const topStand = { ...top, t: t + 0.5, x: 236, y: 76, lean: 0 };
  frames.push(top, topStand, { ...topStand, t: t + 0.85, lh: { x: ROPE_X, y: BEAM_Y + 2 } }, { ...topStand, t: t + 1.25, lh: { x: ROPE_X, y: BEAM_Y + 2 } });
  t += 1.5;
  frames.push({ ...ropeHang(t, 120), t: t + 0.1 });
  frames.push(ropeHang(t + 0.8, 150), ropeHang(t + 1.4, 180), ropeHang(t + 2.0, 210));
  frames.push({ ...stand(t + 2.5, 228, G), lh: { x: ROPE_X, y: 136 }, rh: { x: ROPE_X, y: 142 } });
  frames.push(stand(t + 3.0, 222, G), stand(t + 3.6, 222, G));
  return frames;
})();

const ropeClimb: Obstacle = {
  id: 'rope-climb',
  name: 'Rope climb',
  summary: 'Climb a vertical rope using a leg lock so your legs do most of the work, touch the top and come down under control.',
  layout: [
    'A thick vertical rope hanging from a beam. Candidates report a climb of about 4–5 m. Some boards ask you to touch a mark or the top.',
    'Heights are reported, not official. The scene is shortened to fit the screen.',
  ],
  mistakes: [
    'Climbing with the arms alone. You burn out in two or three pulls.',
    'Sliding down fast with bare hands. That causes rope burn and falls.',
    'Letting the rope drift away from the body instead of keeping it close to the chest.',
    'Crossing the legs loosely so the lock slips.',
  ],
  steps: [
    { at: 0, title: 'Stand close to the rope', tip: 'Stand with the rope in front of you, almost touching your chest.', focus: 'head' },
    { at: 0.5, title: 'High grip', tip: 'Reach high and grip with one hand above the other, thumbs wrapped around the rope.', focus: 'lHand' },
    { at: 1.0, title: 'Knees up and lock the feet', tip: 'Pull your knees up. Let the rope run down the outside of one leg and across the top of that foot, then clamp it with the other foot (J-hook or S-wrap).', focus: 'rFoot' },
    { at: 1.5, title: 'Stand up on the lock', tip: 'Straighten your legs to push your body up. The hands only hold, while the legs lift.', focus: 'hip' },
    { at: 1.8, title: 'Hand over hand', tip: 'Move one hand higher, then the other. Keep your elbows close to your body.', focus: 'lHand' },
    { at: 2.6, title: 'Repeat the inchworm', tip: 'Knees up, lock, stand, reach. Keep a steady rhythm and do not rush.', focus: 'rKnee' },
    { at: 5.9, title: 'Touch the top', tip: 'Touch the beam or the mark clearly so the officer can see it.', focus: 'lHand' },
    { at: 7.3, title: 'Controlled descent', tip: 'Loosen the foot lock a little so it acts as a brake. Lower yourself hand under hand and never slide.', focus: 'rFoot' },
  ],
  keyframes: ropeClimbFrames,
  Scene: () => <>
    <Ground />
    <rect x={180} y={BEAM_Y - 8} width={140} height={10} fill={COLORS.woodDark} />
    <line x1={ROPE_X} y1={BEAM_Y} x2={ROPE_X} y2={G + 1} stroke={COLORS.rope} strokeWidth={5} strokeLinecap="round" />
    <path d={`M ${ROPE_X} ${G + 1} q 12 0 22 -1`} stroke={COLORS.rope} strokeWidth={5} fill="none" strokeLinecap="round" />
    <rect x={200} y={G - 5} width={100} height={8} fill={COLORS.mat} stroke="#171717" strokeWidth={1.5} />
    <VerticalDimension x={340} y1={BEAM_Y} y2={G} label="4–5 m (shortened)" />
  </>,
  Foreground: ({ pose }) => {
    const locked = Math.abs(pose.rFoot.x - ROPE_X) < 8 && pose.rFoot.y < G - 8;
    if (!locked) return null;
    const top = Math.min(pose.lFoot.y, pose.rFoot.y) - 14;
    return <g aria-hidden="true">
      <path d={`M ${ROPE_X} ${top} L ${ROPE_X} ${pose.rFoot.y - 2} Q ${ROPE_X + 9} ${pose.rFoot.y + 2} ${ROPE_X} ${pose.rFoot.y + 7}`} stroke={COLORS.rope} strokeWidth={5} fill="none" strokeLinecap="round" />
    </g>;
  },
};

// ---------------------------------------------------------------------------
// 4. Double rope (rope manoeuvre across two parallel ropes)

const POSTS = { left: 70, right: 410 } as const;
const FOOT_ROPE = 176;
const HAND_ROPE = 78;
const ropeSag = (x: number, depth: number) => depth * Math.sin(Math.PI * Math.min(1, Math.max(0, (x - POSTS.left) / (POSTS.right - POSTS.left))));

const doubleRopeFrames: Keyframe[] = (() => {
  const hipY = standingHip(FOOT_ROPE) + 4;
  const frames: Keyframe[] = [
    stand(0, 36, FOOT_ROPE),
    { ...stand(0.6, 50, FOOT_ROPE), lh: { x: 62, y: HAND_ROPE }, rh: { x: 74, y: HAND_ROPE } },
    { t: 1.1, x: 66, y: hipY, lean: 0, lf: { x: 54, y: FOOT_ROPE }, rf: { x: 84, y: FOOT_ROPE + ropeSag(84, 12) }, lh: { x: 66, y: HAND_ROPE }, rh: { x: 84, y: HAND_ROPE + ropeSag(84, 4) } },
  ];
  let t = 1.6;
  for (let x = 66; x <= 396; x += 30) {
    const sag = ropeSag(x, 12);
    const handSag = ropeSag(x, 4);
    frames.push({ t, x, y: hipY + sag, lean: 0, lf: { x: x - 12, y: FOOT_ROPE + ropeSag(x - 12, 12) }, rf: { x: x + 14, y: FOOT_ROPE + ropeSag(x + 14, 12) }, lh: { x: x + 4, y: HAND_ROPE + handSag }, rh: { x: x + 16, y: HAND_ROPE + handSag } });
    if (x + 30 <= 396) {
      const mid = x + 14;
      frames.push({ t: t + 0.25, x: mid, y: hipY + ropeSag(mid, 12) + 3, lean: 0, lf: { x: x - 12, y: FOOT_ROPE + ropeSag(x - 12, 12) }, rf: { x: x + 44, y: FOOT_ROPE + ropeSag(x + 44, 12) }, lh: { x: x + 4, y: HAND_ROPE + handSag }, rh: { x: x + 46, y: HAND_ROPE + ropeSag(x + 46, 4) } });
    }
    t += 0.5;
  }
  frames.push({ t: t + 0.1, x: 420, y: hipY, lean: 0, lf: { x: 404, y: FOOT_ROPE + 1 }, rf: { x: 432, y: FOOT_ROPE }, lh: { x: 406, y: HAND_ROPE }, rh: { x: 412, y: HAND_ROPE } });
  frames.push(stand(t + 0.6, 440, FOOT_ROPE), stand(t + 1.3, 440, FOOT_ROPE));
  return frames;
})();

function sagRope(y: number, points: { x: number; y: number }[]) {
  const onRope = points.filter((point) => point.x > POSTS.left + 2 && point.x < POSTS.right - 2 && Math.abs(point.y - y) < 20).sort((a, b) => a.x - b.x);
  return ropePath([{ x: POSTS.left, y }, ...onRope.map((point) => ({ x: point.x, y: point.y + (y === FOOT_ROPE ? 2 : 0) })), { x: POSTS.right, y }]);
}

const doubleRope: Obstacle = {
  id: 'double-rope',
  name: 'Double rope',
  summary: 'Cross from one platform to the other on two parallel ropes, with your feet on the lower rope and your hands on the upper rope.',
  layout: [
    'Two ropes stretched between posts, one at foot level and one above head height. Candidates report it on some boards as a rope or “monkey” bridge.',
    'In reality you face the ropes and move sideways. The side view shows the order of foot and hand moves.',
  ],
  mistakes: [
    'Crossing your feet. You lose balance and the rope twists.',
    'Moving the hands and feet together, which leaves only two points of contact.',
    'Standing stiff-legged, so the rope bounces you off.',
    'Hanging far back from the rope with straight arms.',
  ],
  steps: [
    { at: 0, title: 'Grip the upper rope', tip: 'Take the upper rope in both hands before stepping on. Keep your hands about shoulder-width apart.', focus: 'rHand' },
    { at: 1.1, title: 'Step onto the lower rope', tip: 'Put the arch of the foot on the rope, not the toes, with your knees slightly bent.', focus: 'rFoot' },
    { at: 1.6, title: 'Lead foot slides', tip: 'Slide the lead foot along the rope. Never cross your feet.', focus: 'rFoot' },
    { at: 1.85, title: 'Hand follows', tip: 'Slide the lead hand after the foot so three points always stay in contact.', focus: 'rHand' },
    { at: 2.1, title: 'Close up and repeat', tip: 'Bring the trail foot and hand up, then repeat: lead foot, lead hand, close. Keep your hips close to the rope and look ahead.', focus: 'lFoot' },
    { at: 7.1, title: 'Step off onto the platform', tip: 'Release only once both feet are on the platform.', focus: 'lFoot' },
  ],
  keyframes: doubleRopeFrames,
  Scene: ({ pose }) => <>
    <Ground />
    {[POSTS.left, POSTS.right].map((x) => <line key={x} x1={x} y1={G} x2={x} y2={HAND_ROPE - 10} stroke={COLORS.woodDark} strokeWidth={6} />)}
    <rect x={10} y={FOOT_ROPE} width={POSTS.left - 10} height={8} fill={COLORS.wood} stroke="#171717" strokeWidth={1.5} />
    <rect x={POSTS.right} y={FOOT_ROPE} width={60} height={8} fill={COLORS.wood} stroke="#171717" strokeWidth={1.5} />
    <line x1={24} y1={FOOT_ROPE + 8} x2={24} y2={G} stroke={COLORS.woodDark} strokeWidth={4} />
    <line x1={456} y1={FOOT_ROPE + 8} x2={456} y2={G} stroke={COLORS.woodDark} strokeWidth={4} />
    <path d={sagRope(HAND_ROPE, [pose.lHand, pose.rHand])} stroke={COLORS.rope} strokeWidth={4} fill="none" strokeLinejoin="round" />
    <path d={sagRope(FOOT_ROPE, [pose.lFoot, pose.rFoot])} stroke={COLORS.rope} strokeWidth={5} fill="none" strokeLinejoin="round" />
  </>,
};

// ---------------------------------------------------------------------------
// 5. Plank walk with a victory stand

const PLANK = { start: 70, end: 410, top: 150 } as const;
const STAND = { from: 222, to: 258, top: 128 } as const;
const leftLadder = (f: number) => ({ x: 20 + 50 * f, y: G - 80 * f });
const rightLadder = (f: number) => ({ x: PLANK.end + 50 * f, y: PLANK.top + 80 * f });

const plankFrames: Keyframe[] = (() => {
  const frames: Keyframe[] = [stand(0, 12, G)];
  const rungs = [0, 0.25, 0.5, 0.75, 1];
  for (let step = 1; step <= 4; step += 1) {
    const foot = step === 4 ? { x: PLANK.start + 4, y: PLANK.top } : leftLadder(rungs[step]);
    const below = step === 1 ? { x: 16, y: G } : leftLadder(rungs[step - 1]);
    const hip = { x: foot.x - 14, y: foot.y - 36 };
    const hands = step >= 3 ? [{ x: 84, y: 128 }, { x: 82, y: 131 }] : [leftLadder(rungs[step] + 0.55), leftLadder(rungs[step] + 0.45)];
    const leadLeft = step % 2 === 1;
    frames.push({ t: 0.4 + 0.45 * step, x: hip.x, y: hip.y, lean: 30, lf: leadLeft ? foot : below, rf: leadLeft ? below : foot, lh: hands[0], rh: hands[1] });
  }
  const top = standingHip(PLANK.top);
  frames.push({ ...stand(2.6, 80, PLANK.top), ...armsOut(80, top, 0) });
  const walkIn = gait(2.9, 86, 4, 'l', { groundY: PLANK.top, stepTime: 0.45, stepLength: 30, balanceArms: true });
  frames.push(...walkIn.frames);
  frames.push({ t: 5.1, x: 218, y: 112, lean: 8, lf: { x: 217, y: PLANK.top }, rf: { x: 232, y: STAND.top }, ...armsOut(218, 112, 8) });
  frames.push({ t: 5.5, x: 238, y: standingHip(STAND.top), lean: 2, lf: { x: 244, y: STAND.top }, rf: { x: 233, y: STAND.top }, ...armsOut(238, standingHip(STAND.top), 2) });
  const victory = { x: 238, y: standingHip(STAND.top), lean: 0, lf: { x: 244, y: STAND.top }, rf: { x: 233, y: STAND.top }, lh: { x: 229, y: 26 }, rh: { x: 247, y: 26 } };
  frames.push({ t: 5.9, ...victory }, { t: 6.5, ...victory });
  frames.push({ t: 6.9, x: 256, y: 106, lean: 5, lf: { x: 268, y: PLANK.top }, rf: { x: 250, y: STAND.top }, ...armsOut(256, 106, 5) });
  frames.push({ t: 7.3, x: 272, y: top, lean: 0, lf: { x: 268, y: PLANK.top }, rf: { x: 276, y: PLANK.top }, ...armsOut(272, top, 0) });
  const walkOut = gait(7.6, 272, 4, 'r', { groundY: PLANK.top, stepTime: 0.45, stepLength: 30, balanceArms: true });
  frames.push(...walkOut.frames);
  const down = [0.25, 0.5, 0.75];
  let above: Point = { x: walkOut.endX + 10.8, y: PLANK.top };
  down.forEach((f, index) => {
    const foot = rightLadder(f);
    const hip = { x: foot.x - 4, y: foot.y - 42 };
    const leftDown = index % 2 === 0;
    frames.push({ t: 9.9 + index * 0.45, x: hip.x, y: hip.y, lean: 0, lf: leftDown ? foot : above, rf: leftDown ? above : foot, ...armsOut(hip.x, hip.y, 0) });
    above = foot;
  });
  frames.push({ t: 11.25, x: 458, y: standingHip(G), lean: 0, lf: above, rf: { x: 464, y: G } });
  frames.push(stand(11.7, 466, G), stand(12.3, 466, G));
  return frames;
})();

const plank: Obstacle = {
  id: 'plank',
  name: 'Plank walk',
  summary: 'Climb up, walk a raised narrow plank, step up onto the victory stand, stand upright for a moment, then walk off and climb down.',
  layout: [
    'A narrow raised plank with a ladder at each end and a small “victory stand” on it, as described in candidate preparation guides.',
    'Plank height and width vary. The scene is not to scale.',
  ],
  mistakes: [
    'Looking down at your feet, which makes you sway.',
    'Rushing the victory stand and not standing up straight on it.',
    'Walking with your feet turned out, which puts them over the edge of the plank.',
    'Jumping off the end instead of using the ladder.',
  ],
  steps: [
    { at: 0, title: 'Climb the ladder', tip: 'Keep three points of contact: two hands and one foot, or two feet and one hand.', focus: 'lHand' },
    { at: 2.6, title: 'Stand tall on the plank', tip: 'Fix your eyes on the far end and hold your arms out for balance.', focus: 'head' },
    { at: 2.9, title: 'Walk the plank', tip: 'Use short, even steps and place your feet in line along the plank.', focus: 'lFoot' },
    { at: 4.9, title: 'Mount the victory stand', tip: 'Step up with one foot, drive through it and bring the other foot up.', focus: 'rFoot' },
    { at: 5.9, title: 'Stand upright', tip: 'Stand fully upright for a moment so the officer can see it, then continue.', focus: 'rHand' },
    { at: 6.7, title: 'Step down and walk on', tip: 'Step down under control and keep the same steady pace.', focus: 'lFoot' },
    { at: 9.8, title: 'Climb down', tip: 'Go down one rung at a time. Do not jump from the top.', focus: 'rFoot' },
  ],
  keyframes: plankFrames,
  Scene: () => <>
    <Ground />
    {[leftLadder, rightLadder].map((ladder, index) => <g key={index}>
      <line x1={ladder(0).x} y1={ladder(0).y} x2={ladder(1).x} y2={ladder(1).y} stroke={COLORS.woodDark} strokeWidth={4} />
      {[0.25, 0.5, 0.75].map((f) => <circle key={f} cx={ladder(f).x} cy={ladder(f).y} r={3} fill={COLORS.woodDark} />)}
    </g>)}
    <line x1={leftLadder(1).x} y1={leftLadder(1).y} x2={leftLadder(1.3).x} y2={leftLadder(1.3).y} stroke={COLORS.woodDark} strokeWidth={4} />
    <rect x={PLANK.start} y={PLANK.top} width={PLANK.end - PLANK.start} height={7} fill={COLORS.wood} stroke="#171717" strokeWidth={1.5} />
    {[120, 330].map((x) => <line key={x} x1={x} y1={PLANK.top + 7} x2={x} y2={G} stroke={COLORS.woodDark} strokeWidth={5} />)}
    <rect x={STAND.from} y={STAND.top} width={STAND.to - STAND.from} height={PLANK.top - STAND.top} fill={COLORS.target} stroke="#171717" strokeWidth={1.5} />
    <text x={(STAND.from + STAND.to) / 2} y={STAND.top + 14} textAnchor="middle" className="obstacle-label">V</text>
  </>,
};

// ---------------------------------------------------------------------------
// 6. Tyre (feet first through a hanging tyre)

const TYRE = { x: 250, y: 128, rx: 13, ry: 34, innerRx: 6, innerRy: 20 } as const;
const tyreSwing = (t: number) => (t < 1.9 ? 0 : 5 * Math.sin((t - 1.9) * 5) * Math.exp(-(t - 1.9) * 1.1));

const tyreFrames: Keyframe[] = (() => {
  const walk = gait(0, 150, 3, 'r', { groundY: G, stepTime: 0.35, stepLength: 24 });
  return [
    ...walk.frames,
    { t: 1.4, x: 232, y: 188, lean: 4, lf: { x: 226, y: G }, rf: { x: 236, y: G }, lh: { x: 246, y: 126 }, rh: { x: 248, y: 131 } },
    { t: 1.6, x: 229, y: 196, lean: 12, lf: { x: 226, y: G }, rf: { x: 236, y: G }, lh: { x: 246, y: 126 }, rh: { x: 248, y: 131 } },
    { t: 1.8, x: 224, y: 176, lean: -10, lf: { x: 238, y: 150 }, rf: { x: 240, y: 154 }, lh: { x: 247, y: 118 }, rh: { x: 249, y: 122 } },
    { t: 1.95, x: 228, y: 150, lean: -20, lf: { x: 270, y: 132 }, rf: { x: 272, y: 136 }, lh: { x: 248, y: 114 }, rh: { x: 250, y: 118 } },
    { t: 2.25, x: 252, y: 134, lean: -78, lf: { x: 292, y: 150 }, rf: { x: 290, y: 156 }, lh: { x: 246, y: 110 }, rh: { x: 248, y: 114 } },
    { t: 2.55, x: 274, y: 152, lean: -45, lf: { x: 288, y: 196 }, rf: { x: 284, y: 200 }, lh: { x: 250, y: 101 }, rh: { x: 254, y: 104 } },
    { t: 2.8, x: 302, y: 194, lean: 20, lf: { x: 312, y: G }, rf: { x: 306, y: G }, lh: { x: 326, y: 180 }, rh: { x: 322, y: 184 } },
    { t: 3.0, x: 308, y: 200, lean: 24, lf: { x: 312, y: G }, rf: { x: 306, y: G }, lh: { x: 332, y: 188 }, rh: { x: 328, y: 192 } },
    stand(3.5, 316, G),
    stand(4.2, 316, G),
  ];
})();

function TyreShape({ t, half }: { t: number; half?: 'front' }) {
  const { x, y, rx, ry, innerRx, innerRy } = TYRE;
  const ring = half === 'front'
    ? `M ${x} ${y - ry} A ${rx} ${ry} 0 0 1 ${x} ${y + ry} L ${x} ${y + innerRy} A ${innerRx} ${innerRy} 0 0 0 ${x} ${y - innerRy} Z`
    : `M ${x - rx} ${y} A ${rx} ${ry} 0 1 0 ${x + rx} ${y} A ${rx} ${ry} 0 1 0 ${x - rx} ${y} Z M ${x - innerRx} ${y} A ${innerRx} ${innerRy} 0 1 1 ${x + innerRx} ${y} A ${innerRx} ${innerRy} 0 1 1 ${x - innerRx} ${y} Z`;
  return <g transform={`rotate(${tyreSwing(t).toFixed(2)} ${x} 40)`}>
    {!half && <>
      <line x1={x - 12} y1={40} x2={x} y2={y - ry} stroke={COLORS.rope} strokeWidth={2.5} />
      <line x1={x + 12} y1={40} x2={x} y2={y - ry} stroke={COLORS.rope} strokeWidth={2.5} />
    </>}
    <path d={ring} fill={COLORS.tyre} fillRule="evenodd" opacity={half ? 0.95 : 1} />
  </g>;
}

const tyre: Obstacle = {
  id: 'tyre',
  name: 'Tyre',
  summary: 'Pass through a tyre hanging at about waist-to-chest height, feet first, and land on your feet on the other side.',
  layout: [
    'A single tyre hung from a frame by ropes. Candidates report it hanging about 4–5 ft (1.2–1.5 m) off the ground, and that it must be passed feet first.',
    'Heights are reported, not official.',
  ],
  mistakes: [
    'Going head first. It is unsafe and usually not allowed.',
    'Letting go early, so you fall through onto your back.',
    'Kicking the tyre so it swings away.',
    'Stopping halfway with your hips jammed in the tyre. Commit to one smooth motion.',
  ],
  steps: [
    { at: 0, title: 'Approach square on', tip: 'Walk up to the tyre with it directly in front of you.', focus: 'head' },
    { at: 1.1, title: 'Grip the tyre', tip: 'Hold the inner rim at the sides or top. Keep your arms bent and your body close.', focus: 'lHand' },
    { at: 1.6, title: 'Spring and lift the legs', tip: 'Bend your knees, spring and lift both legs together in front of you.', focus: 'lKnee' },
    { at: 1.85, title: 'Feet first through', tip: 'Push both feet straight through the hole with your toes pointed.', focus: 'lFoot' },
    { at: 2.2, title: 'Lie back and slide the hips through', tip: 'Lean back with your weight on your hands and slide your hips through the tyre.', focus: 'hip' },
    { at: 2.5, title: 'Head and shoulders follow', tip: 'Tuck your chin and let your shoulders follow, holding the rim until your feet reach down.', focus: 'head' },
    { at: 2.8, title: 'Land on your feet', tip: 'Let go, land on both feet with bent knees and move on.', focus: 'rFoot' },
  ],
  keyframes: tyreFrames,
  Scene: ({ t }) => <>
    <Ground />
    <line x1={200} y1={G} x2={218} y2={36} stroke={COLORS.woodDark} strokeWidth={5} opacity={0.6} />
    <line x1={300} y1={G} x2={282} y2={36} stroke={COLORS.woodDark} strokeWidth={5} opacity={0.6} />
    <line x1={206} y1={38} x2={294} y2={38} stroke={COLORS.woodDark} strokeWidth={6} />
    <TyreShape t={t} />
    <VerticalDimension x={372} y1={TYRE.y + TYRE.ry} y2={G} label="1.2–1.5 m" />
    <line x1={TYRE.x + TYRE.rx} y1={TYRE.y + TYRE.ry} x2={372} y2={TYRE.y + TYRE.ry} className="obstacle-guide" />
  </>,
  Foreground: ({ t }) => <TyreShape t={t} half="front" />,
};

// ---------------------------------------------------------------------------
// 7. Tarzan swing

const ANCHOR = { x: 240, y: 4 } as const;
const ROPE_LENGTH = 104;
const PLATFORM = { from: 50, to: 132, top: 120 } as const;
const SWING_START = 1.0;
const SWING_HALF_PERIOD = 1.5;
const swingAngle = (t: number) => -60 * Math.cos((Math.PI * (t - SWING_START)) / SWING_HALF_PERIOD);
const RELEASE_T = SWING_START + (SWING_HALF_PERIOD * Math.acos(-40 / 60)) / Math.PI;
const alongRope = (degrees: number, distance: number) => ({
  x: ANCHOR.x + distance * Math.sin((degrees * Math.PI) / 180),
  y: ANCHOR.y + distance * Math.cos((degrees * Math.PI) / 180),
});

const tarzanFrames: Keyframe[] = (() => {
  const held = alongRope(-60, ROPE_LENGTH);
  const lower = alongRope(-60, ROPE_LENGTH + 7);
  const frames: Keyframe[] = [
    { ...stand(0, 122, PLATFORM.top), lh: held, rh: lower },
    { ...stand(0.45, 122, PLATFORM.top), lh: held, rh: lower },
    { t: 0.75, x: 120, y: 84, lean: 12, lf: { x: 118, y: PLATFORM.top }, rf: { x: 126, y: PLATFORM.top }, lh: held, rh: lower },
  ];
  for (let t = SWING_START; t <= RELEASE_T + 0.001; t += 0.1) {
    const phi = swingAngle(t);
    const reach = Math.min(62, 45 + (t - SWING_START) * 45);
    // Just after the jump the body still hangs under the hands; it lines up
    // with the rope as the swing builds speed.
    const alignment = Math.min(1, 0.3 + ((t - SWING_START) / 0.6) * 0.7);
    const bodyAngle = phi * alignment;
    const hands = alongRope(phi, ROPE_LENGTH);
    const hip = { x: hands.x + reach * Math.sin((bodyAngle * Math.PI) / 180), y: hands.y + reach * Math.cos((bodyAngle * Math.PI) / 180) };
    const legs: [number, number] = t < RELEASE_T - 0.3
      ? [bodyAngle + 75, bodyAngle + 5]
      : [bodyAngle + 55, bodyAngle + 40];
    frames.push({ t, x: hip.x, y: hip.y, lean: -bodyAngle, lf: legs, rf: [legs[0] - 6, legs[1] - 4], lh: hands, rh: alongRope(phi, ROPE_LENGTH + 7) });
  }
  const released = RELEASE_T + 0.2;
  frames.push(
    { t: released, x: 372, y: 150, lean: 10, lf: { x: 396, y: 178 }, rf: { x: 392, y: 182 }, lh: { x: 388, y: 108 }, rh: { x: 384, y: 112 } },
    { t: released + 0.18, x: 390, y: 190, lean: 25, lf: { x: 408, y: G }, rf: { x: 402, y: G }, lh: { x: 420, y: 178 }, rh: { x: 416, y: 182 } },
    { t: released + 0.4, x: 398, y: 200, lean: 30, lf: { x: 408, y: G }, rf: { x: 402, y: G }, lh: { x: 426, y: 188 }, rh: { x: 422, y: 192 } },
    stand(released + 0.9, 404, G),
    stand(released + 1.7, 404, G),
  );
  return frames;
})();

const tarzan: Obstacle = {
  id: 'tarzan-swing',
  name: 'Tarzan swing',
  summary: 'Take the rope on a raised platform, swing out with momentum and let go at the forward end so you land inside the marked target.',
  layout: [
    'A raised platform (candidates report about 10–12 ft, or 3–3.5 m) and a rope hanging from a high frame, with a marked landing area ahead.',
    'Candidate guides say it is not used for every entry, for example some Air Force entries. Heights are reported, not official.',
  ],
  mistakes: [
    'Stepping off and dropping instead of jumping forward. You swing short.',
    'Letting your legs hang, so your feet drag on the ground at the bottom of the swing.',
    'Letting go at the back of the swing or at the very bottom.',
    'Sliding down the rope because the grip is too low or the arms are straight.',
  ],
  steps: [
    { at: 0, title: 'Take the rope', tip: 'Grip at head height with your hands close together, strong hand on top.', focus: 'lHand' },
    { at: 0.45, title: 'Sit into the jump', tip: 'Bend your knees with your weight on the balls of your feet and look at the target.', focus: 'lKnee' },
    { at: SWING_START, title: 'Jump forward, not down', tip: 'Push forward off the platform and hold on firmly.', focus: 'hip' },
    { at: SWING_START + 0.3, title: 'Tuck through the bottom', tip: 'Pull your knees up so your feet clear the ground at the lowest point.', focus: 'rKnee' },
    { at: RELEASE_T - 0.3, title: 'Extend the legs forward', tip: 'As you rise, shoot your legs forward toward the target.', focus: 'lFoot' },
    { at: RELEASE_T, title: 'Release at the forward peak', tip: 'Let go with both hands together just before the rope stops rising.', focus: 'rHand' },
    { at: RELEASE_T + 0.2, title: 'Land in the target', tip: 'Land on both feet inside the marked area with your knees bent.', focus: 'lFoot' },
  ],
  keyframes: tarzanFrames,
  Scene: ({ t, pose }) => {
    const holding = t <= RELEASE_T;
    const end = holding ? pose.lHand : alongRope(swingAngle(t), ROPE_LENGTH + 14);
    return <>
      <Ground />
      <rect x={200} y={0} width={80} height={6} fill={COLORS.woodDark} />
      <rect x={PLATFORM.from} y={PLATFORM.top} width={PLATFORM.to - PLATFORM.from} height={8} fill={COLORS.wood} stroke="#171717" strokeWidth={1.5} />
      {[PLATFORM.from + 6, PLATFORM.to - 6].map((x) => <line key={x} x1={x} y1={PLATFORM.top + 8} x2={x} y2={G} stroke={COLORS.woodDark} strokeWidth={4} />)}
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={PLATFORM.from - 14} y1={PLATFORM.top + (G - PLATFORM.top) * f} x2={PLATFORM.from + 6} y2={PLATFORM.top + (G - PLATFORM.top) * f} stroke={COLORS.woodDark} strokeWidth={3} />)}
      <line x1={PLATFORM.from - 14} y1={PLATFORM.top} x2={PLATFORM.from - 14} y2={G} stroke={COLORS.woodDark} strokeWidth={3} />
      <rect x={378} y={G - 2} width={62} height={6} fill={COLORS.target} stroke="#171717" strokeWidth={1.5} />
      <text x={409} y={G + 20} textAnchor="middle" className="obstacle-label">target</text>
      <line x1={ANCHOR.x} y1={ANCHOR.y} x2={end.x} y2={end.y} stroke={COLORS.rope} strokeWidth={4} strokeLinecap="round" />
      {holding && (() => {
        const tail = alongRope(Math.atan2(pose.lHand.x - ANCHOR.x, pose.lHand.y - ANCHOR.y) * 180 / Math.PI, Math.hypot(pose.lHand.x - ANCHOR.x, pose.lHand.y - ANCHOR.y) + 16);
        return <line x1={pose.lHand.x} y1={pose.lHand.y} x2={tail.x} y2={tail.y} stroke={COLORS.rope} strokeWidth={4} strokeLinecap="round" />;
      })()}
      <VerticalDimension x={PLATFORM.from - 36} y1={PLATFORM.top} y2={G} label="" />
      <text x={4} y={PLATFORM.top - 8} className="obstacle-dimension-text">3–3.5 m</text>
    </>;
  },
};

// ---------------------------------------------------------------------------
// 8. Zig-zag planks

const ZIGZAG = [
  { c: 90, h: 208 },
  { c: 150, h: 188 },
  { c: 210, h: 168 },
  { c: 270, h: 146 },
  { c: 330, h: 124 },
  { c: 390, h: 160 },
] as const;

const zigzagFrames: Keyframe[] = (() => {
  const frames: Keyframe[] = [stand(0, 30, G)];
  let previous = { c: 30, h: G as number };
  let t = 0.5;
  ZIGZAG.forEach((plankStep, index) => {
    const leadLeft = index % 2 === 1;
    const lead = { x: plankStep.c - 8, y: plankStep.h };
    const trail = { x: previous.c + 6, y: previous.h };
    const hipX = plankStep.c - 25;
    const hipY = Math.max(previous.h, plankStep.h) - 40;
    const lean = plankStep.h < previous.h ? 12 : 2;
    frames.push({ t, x: hipX, y: hipY, lean, lf: leadLeft ? lead : trail, rf: leadLeft ? trail : lead, ...armsOut(hipX, hipY, lean) });
    const topY = standingHip(plankStep.h);
    frames.push({ t: t + 0.35, x: plankStep.c, y: topY, lean: 2, lf: { x: plankStep.c - 6, y: plankStep.h }, rf: { x: plankStep.c + 6, y: plankStep.h }, ...armsOut(plankStep.c, topY, 2) });
    previous = plankStep;
    t += 0.7;
  });
  const last = ZIGZAG[ZIGZAG.length - 1];
  frames.push(
    { t: t - 0.1, x: last.c + 2, y: standingHip(last.h) + 10, lean: 20, lf: { x: last.c - 6, y: last.h }, rf: { x: last.c + 6, y: last.h }, lh: { x: last.c - 8, y: last.h - 30 }, rh: { x: last.c - 4, y: last.h - 28 } },
    { t: t + 0.15, x: 418, y: 128, lean: 8, lf: { x: 424, y: 162 }, rf: { x: 430, y: 166 }, lh: { x: 446, y: 104 }, rh: { x: 440, y: 108 } },
    { t: t + 0.4, x: 446, y: 196, lean: 25, lf: { x: 456, y: G }, rf: { x: 450, y: G }, lh: { x: 470, y: 182 }, rh: { x: 466, y: 186 } },
    { t: t + 0.6, x: 452, y: 204, lean: 30, lf: { x: 456, y: G }, rf: { x: 450, y: G }, lh: { x: 476, y: 196 }, rh: { x: 472, y: 198 } },
    stand(t + 1.1, 456, G),
    stand(t + 1.8, 456, G),
  );
  return frames;
})();

const zigzag: Obstacle = {
  id: 'zig-zag',
  name: 'Zig-zag',
  summary: 'Move plank to plank as they rise, keeping your rhythm and balance, then come off the end under control.',
  layout: [
    'A run of narrow planks set in a zig-zag at increasing heights. Candidates describe them rising from about 2–2.5 ft to about 7 ft (0.6 m to 2.1 m).',
    'The real planks change direction in plan view. This side view straightens them out so you can see the steps and heights. The layout varies by board.',
  ],
  mistakes: [
    'Stopping on every plank to re-balance, which wastes time.',
    'Looking down at the ground instead of at the next plank.',
    'Stepping onto the edge of a plank rather than its centre.',
    'Jumping off the highest point instead of leaving from the lower exit.',
  ],
  steps: [
    { at: 0, title: 'Read the planks', tip: 'Before you start, look at the full route and decide which foot goes first.', focus: 'head' },
    { at: 0.5, title: 'Step up and keep moving', tip: 'Put the lead foot in the centre of the next plank and drive up through it.', focus: 'rFoot' },
    { at: 1.9, title: 'Arms out, eyes forward', tip: 'Keep your arms out for balance and your eyes on the next plank, not your feet.', focus: 'rHand' },
    { at: 3.3, title: 'The highest plank', tip: 'Stay low and centred. The planks are narrow, so shorten your step.', focus: 'hip' },
    { at: 4.0, title: 'Step down', tip: 'Lower yourself onto the next plank with a bent support knee.', focus: 'lKnee' },
    { at: 4.7, title: 'Jump off and land', tip: 'From the lowest safe exit, jump forward and land on both feet with bent knees.', focus: 'lFoot' },
  ],
  keyframes: zigzagFrames,
  Scene: () => <>
    <Ground />
    {ZIGZAG.map((plankStep, index) => <g key={index}>
      <rect x={plankStep.c - 22} y={plankStep.h} width={44} height={6} fill={COLORS.wood} stroke="#171717" strokeWidth={1.5} />
      <line x1={plankStep.c - 16} y1={plankStep.h + 6} x2={plankStep.c - 16} y2={G} stroke={COLORS.woodDark} strokeWidth={3} />
      <line x1={plankStep.c + 16} y1={plankStep.h + 6} x2={plankStep.c + 16} y2={G} stroke={COLORS.woodDark} strokeWidth={3} />
    </g>)}
    <VerticalDimension x={358} y1={ZIGZAG[4].h} y2={G} label="" />
    <text x={358} y={30} textAnchor="middle" className="obstacle-dimension-text">top plank up to ~2.1 m</text>
    <line x1={358} y1={34} x2={358} y2={ZIGZAG[4].h - 4} className="obstacle-guide" />
  </>,
};

// ---------------------------------------------------------------------------
// 9. Boxing ring (over, under, over)

const RING = [
  { x: 150, y: 196, pass: 'over' },
  { x: 262, y: 160, pass: 'under' },
  { x: 370, y: 196, pass: 'over' },
] as const;

const ringFrames: Keyframe[] = (() => {
  const approach = gait(0.4, 50, 3, 'l', { groundY: G, stepTime: 0.3, stepLength: 26, run: true });
  const rise = gait(3.3, 322, 1, 'r', { groundY: G, stepTime: 0.3, stepLength: 26, run: true });
  return [
    stand(0, 30, G),
    ...approach.frames,
    { t: 1.45, x: 148, y: 170, lean: 14, lf: { x: 176, y: 178 }, rf: { x: 138, y: 204 }, lh: { x: 150, y: 176 }, rh: { x: 176, y: 150 } },
    { t: 1.6, x: 166, y: 172, lean: 12, lf: { x: 186, y: 212 }, rf: { x: 158, y: 176 }, lh: { x: 176, y: 164 }, rh: { x: 168, y: 172 } },
    { t: 1.78, x: 186, y: 188, lean: 10, lf: { x: 194, y: G }, rf: { x: 180, y: 210 } },
    { t: 2.1, x: 214, y: 198, lean: 45, lf: { x: 222, y: G }, rf: { x: 202, y: 224 }, lh: { x: 250, y: 214 }, rh: { x: 246, y: 218 } },
    { t: 2.35, x: 238, y: 200, lean: 60, lf: { x: 226, y: 228 }, rf: { x: 250, y: G }, lh: { x: 272, y: 218 }, rh: { x: 268, y: 222 } },
    { t: 2.6, x: 262, y: 200, lean: 60, lf: { x: 274, y: G }, rf: { x: 250, y: 228 }, lh: { x: 296, y: 218 }, rh: { x: 292, y: 222 } },
    { t: 2.85, x: 286, y: 196, lean: 45, lf: { x: 274, y: 226 }, rf: { x: 298, y: G }, lh: { x: 316, y: 206 }, rh: { x: 312, y: 210 } },
    { t: 3.05, x: 304, y: 188, lean: 14, lf: { x: 310, y: G }, rf: { x: 292, y: 214 } },
    ...rise.frames,
    { t: 3.75, x: 368, y: 170, lean: 14, lf: { x: 358, y: 204 }, rf: { x: 396, y: 178 }, lh: { x: 396, y: 150 }, rh: { x: 370, y: 176 } },
    { t: 3.9, x: 386, y: 172, lean: 12, lf: { x: 378, y: 176 }, rf: { x: 406, y: 212 }, lh: { x: 388, y: 172 }, rh: { x: 396, y: 164 } },
    { t: 4.08, x: 406, y: 188, lean: 10, lf: { x: 400, y: 210 }, rf: { x: 414, y: G } },
    stand(4.5, 420, G),
    stand(5.2, 420, G),
  ];
})();

// Ropes run across the candidate's path, so the side view shows them in
// perspective: a near post in front of the figure, a far post behind it.
function RingRope({ x, y, near }: { x: number; y: number; near?: boolean }) {
  return near
    ? <>
      <line x1={x - 10} y1={G + 6} x2={x - 10} y2={y - 8} stroke={COLORS.metal} strokeWidth={4} />
      <circle cx={x - 10} cy={y + 3} r={3} fill="#ff8177" stroke="#171717" strokeWidth={1} />
    </>
    : <>
      <line x1={x + 14} y1={G - 6} x2={x + 14} y2={y - 16} stroke={COLORS.metal} strokeWidth={3} opacity={0.5} />
      <line x1={x - 10} y1={y + 3} x2={x + 14} y2={y - 7} stroke="#ff8177" strokeWidth={4} strokeLinecap="round" />
    </>;
}

const ring: Obstacle = {
  id: 'boxing-ring',
  name: 'Boxing ring',
  summary: 'Three ropes in a row: jump over the first, go under the second and jump over the third without touching them.',
  layout: [
    'Three ropes set up like a boxing ring. Candidates describe the order as over, under, over.',
    'Rope heights vary. Touching or dislodging a rope may cost the attempt, so control matters more than speed.',
  ],
  mistakes: [
    'Rising too early after the middle rope and catching it with your back or head.',
    'Stuttering before the low ropes instead of hurdling in stride.',
    'Diving or rolling under the middle rope when a low crouch-walk is enough.',
    'Dragging the trail leg so it clips the rope.',
  ],
  steps: [
    { at: 0, title: 'Short approach', tip: 'Build an even rhythm. Speed is not needed here.', focus: 'head' },
    { at: 1.3, title: 'Hurdle rope one', tip: 'Lead with a straight leg and lift the trail knee up and sideways.', focus: 'lFoot' },
    { at: 1.95, title: 'Drop low early', tip: 'Bend at the knees and hips before you reach the middle rope. Keep your head down.', focus: 'head' },
    { at: 2.35, title: 'Crouch-walk under', tip: 'Take short steps with your back flat. Stay low until your hips are clear.', focus: 'hip' },
    { at: 3.0, title: 'Rise and re-accelerate', tip: 'Stand up only once you are past the rope, then take two quick strides.', focus: 'shoulder' },
    { at: 3.65, title: 'Hurdle rope three', tip: 'Use the same technique as rope one. Land running and move straight on.', focus: 'rFoot' },
  ],
  keyframes: ringFrames,
  Scene: () => <>
    <Ground />
    {RING.map((rope) => <RingRope key={rope.x} x={rope.x} y={rope.y} />)}
    {RING.map((rope, index) => <text key={`label-${rope.x}`} x={rope.x} y={40} textAnchor="middle" className="obstacle-label">{index + 1}. {rope.pass}</text>)}
  </>,
  Foreground: () => <>{RING.map((rope) => <RingRope key={rope.x} x={rope.x} y={rope.y} near />)}</>,
};

export const outdoorObstacles: readonly Obstacle[] = [longJump, highJump, ropeClimb, doubleRope, plank, tyre, tarzan, zigzag, ring];

export const obstacleSources = [
  { label: 'ISSB Forum: individual obstacles for female candidates', url: 'https://www.issbforum.walnutbloom.net/viewtopic.php?t=76' },
  { label: 'Defence Direct Education: individual obstacles (SSB format, similar obstacles)', url: 'https://defencedirecteducation.com/2018/12/24/individual-obstacles-ssb/' },
  { label: 'SSBPsych: types of individual obstacles', url: 'https://www.ssbpsych.com/ssb/gto/types-of-individual-obstacles-in-ssb-interview/' },
] as const;
