// Tiny animation engine for the outdoor-obstacle demonstrations.
//
// A pose is authored as a hip position, a torso lean and four end effectors
// (hands and feet). Each frame the engine interpolates those values with a
// monotone cubic (no overshoot, so a planted foot or a gripping hand stays
// exactly still) and then solves two-bone IK so limb lengths never stretch.

export type Point = { x: number; y: number };

/** Absolute limb angles in degrees: 0 points down, 90 forward (+x), 180 up. */
export type LimbAngles = readonly [upper: number, lower: number];
export type LimbSpec = LimbAngles | Point;

export type Keyframe = {
  t: number;
  x: number;
  y: number;
  /** Torso lean in degrees: 0 upright, positive leans forward (+x). */
  lean: number;
  lf: LimbSpec;
  rf: LimbSpec;
  /** Hands default to a relaxed hang beside the hip. */
  lh?: LimbSpec;
  rh?: LimbSpec;
};

export type Pose = {
  hip: Point;
  shoulder: Point;
  head: Point;
  lKnee: Point;
  lFoot: Point;
  rKnee: Point;
  rFoot: Point;
  lElbow: Point;
  lHand: Point;
  rElbow: Point;
  rHand: Point;
};

export const BODY = {
  torso: 30,
  thigh: 22,
  shin: 22,
  upperArm: 16,
  forearm: 16,
  neck: 4,
  headRadius: 8,
} as const;

/** Hip height when standing straight on a surface at `groundY`. */
export const standingHip = (groundY: number) => groundY - BODY.thigh - BODY.shin;

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const direction = (degrees: number): Point => ({ x: Math.sin(rad(degrees)), y: Math.cos(rad(degrees)) });
const add = (a: Point, b: Point, scale = 1): Point => ({ x: a.x + b.x * scale, y: a.y + b.y * scale });

export function shoulderOf(hip: Point, lean: number): Point {
  return { x: hip.x + BODY.torso * Math.sin(rad(lean)), y: hip.y - BODY.torso * Math.cos(rad(lean)) };
}

function isPoint(spec: LimbSpec): spec is Point {
  return !Array.isArray(spec);
}

function endEffector(root: Point, spec: LimbSpec, upper: number, lower: number): Point {
  if (isPoint(spec)) return spec;
  const joint = add(root, direction(spec[0]), upper);
  return add(joint, direction(spec[1]), lower);
}

/**
 * Two-bone IK. `bend` picks which side of the root→target line the middle
 * joint sits on: +1 for knees (forward of the line), -1 for elbows (behind),
 * matching how human joints flex for a figure facing +x.
 */
function solveLimb(root: Point, target: Point, upper: number, lower: number, bend: 1 | -1) {
  const dx = target.x - root.x;
  const dy = target.y - root.y;
  const reach = upper + lower - 0.001;
  const rawDistance = Math.hypot(dx, dy) || 0.001;
  const distance = Math.min(rawDistance, reach);
  const ux = dx / rawDistance;
  const uy = dy / rawDistance;
  const end = { x: root.x + ux * distance, y: root.y + uy * distance };
  const cosine = (upper * upper + distance * distance - lower * lower) / (2 * upper * distance);
  const angle = Math.acos(Math.max(-1, Math.min(1, cosine)));
  // Rotating the unit vector by +angle moves the joint to the side where the
  // cross product (target × joint) is positive, i.e. the elbow side.
  const signed = bend === 1 ? -angle : angle;
  const cos = Math.cos(signed);
  const sin = Math.sin(signed);
  const joint = { x: root.x + upper * (ux * cos - uy * sin), y: root.y + upper * (ux * sin + uy * cos) };
  return { joint, end };
}

type Sample = {
  t: number;
  values: number[];
};

// Channel layout: hip x, hip y, lean, then (x, y) for lf, rf, lh, rh.
function sampleOf(frame: Keyframe): Sample {
  const hip = { x: frame.x, y: frame.y };
  const shoulder = shoulderOf(hip, frame.lean);
  const relaxed = (offset: number): Point => ({ x: shoulder.x + offset, y: shoulder.y + BODY.upperArm + BODY.forearm - 2 });
  const lf = endEffector(hip, frame.lf, BODY.thigh, BODY.shin);
  const rf = endEffector(hip, frame.rf, BODY.thigh, BODY.shin);
  const lh = frame.lh ? endEffector(shoulder, frame.lh, BODY.upperArm, BODY.forearm) : relaxed(-3);
  const rh = frame.rh ? endEffector(shoulder, frame.rh, BODY.upperArm, BODY.forearm) : relaxed(2);
  return { t: frame.t, values: [frame.x, frame.y, frame.lean, lf.x, lf.y, rf.x, rf.y, lh.x, lh.y, rh.x, rh.y] };
}

/** Fritsch–Carlson monotone cubic tangents for one channel. */
function monotoneTangents(times: number[], values: number[]) {
  const count = values.length;
  const secants = Array.from({ length: count - 1 }, (_, index) => (values[index + 1] - values[index]) / (times[index + 1] - times[index] || 1));
  const tangents = values.map((_, index) => {
    if (index === 0) return secants[0] ?? 0;
    if (index === count - 1) return secants[count - 2] ?? 0;
    const before = secants[index - 1];
    const after = secants[index];
    return before * after <= 0 ? 0 : (before + after) / 2;
  });
  for (let index = 0; index < count - 1; index += 1) {
    const secant = secants[index];
    if (secant === 0) {
      tangents[index] = 0;
      tangents[index + 1] = 0;
      continue;
    }
    const alpha = tangents[index] / secant;
    const beta = tangents[index + 1] / secant;
    const magnitude = alpha * alpha + beta * beta;
    if (magnitude > 9) {
      const scale = 3 / Math.sqrt(magnitude);
      tangents[index] = scale * alpha * secant;
      tangents[index + 1] = scale * beta * secant;
    }
  }
  return tangents;
}

export type Timeline = {
  duration: number;
  poseAt: (time: number) => Pose;
};

export function createTimeline(keyframes: readonly Keyframe[]): Timeline {
  const ordered = [...keyframes].sort((a, b) => a.t - b.t);
  const samples = ordered.map(sampleOf);
  const times = samples.map((sample) => sample.t);
  const channelCount = samples[0].values.length;
  const channels = Array.from({ length: channelCount }, (_, channel) => samples.map((sample) => sample.values[channel]));
  const tangents = channels.map((values) => monotoneTangents(times, values));
  const duration = times[times.length - 1];

  const valueAt = (channel: number, time: number) => {
    const values = channels[channel];
    if (time <= times[0]) return values[0];
    if (time >= duration) return values[values.length - 1];
    let index = 0;
    while (index < times.length - 2 && times[index + 1] < time) index += 1;
    const span = times[index + 1] - times[index];
    const s = (time - times[index]) / span;
    const s2 = s * s;
    const s3 = s2 * s;
    return (2 * s3 - 3 * s2 + 1) * values[index]
      + (s3 - 2 * s2 + s) * span * tangents[channel][index]
      + (-2 * s3 + 3 * s2) * values[index + 1]
      + (s3 - s2) * span * tangents[channel][index + 1];
  };

  return {
    duration,
    poseAt(time) {
      const [x, y, lean, lfx, lfy, rfx, rfy, lhx, lhy, rhx, rhy] = Array.from({ length: channelCount }, (_, channel) => valueAt(channel, time));
      const hip = { x, y };
      const shoulder = shoulderOf(hip, lean);
      const head = add(shoulder, { x: Math.sin(rad(lean)), y: -Math.cos(rad(lean)) }, BODY.neck + BODY.headRadius);
      const leftLeg = solveLimb(hip, { x: lfx, y: lfy }, BODY.thigh, BODY.shin, 1);
      const rightLeg = solveLimb(hip, { x: rfx, y: rfy }, BODY.thigh, BODY.shin, 1);
      const leftArm = solveLimb(shoulder, { x: lhx, y: lhy }, BODY.upperArm, BODY.forearm, -1);
      const rightArm = solveLimb(shoulder, { x: rhx, y: rhy }, BODY.upperArm, BODY.forearm, -1);
      return {
        hip,
        shoulder,
        head,
        lKnee: leftLeg.joint,
        lFoot: leftLeg.end,
        rKnee: rightLeg.joint,
        rFoot: rightLeg.end,
        lElbow: leftArm.joint,
        lHand: leftArm.end,
        rElbow: rightArm.joint,
        rHand: rightArm.end,
      };
    },
  };
}

// ---------------------------------------------------------------------------
// Authoring helpers shared by the obstacle definitions.

export type Side = 'l' | 'r';

type GaitOptions = {
  groundY: number;
  /** Seconds between successive foot contacts. */
  stepTime: number;
  /** Hip travel between successive foot contacts. */
  stepLength: number;
  lean?: number;
  /** Running lifts the rear foot higher and bends the arms more. */
  run?: boolean;
  /** Hands for balance, relative to the shoulder, overriding the arm swing. */
  balanceArms?: boolean;
};

/**
 * Walking or running keyframes. Produces a contact pose at each step and a
 * passing pose between them. Returns the frames and the time/x of the final
 * contact so the caller can continue from it.
 */
export function gait(startT: number, startX: number, steps: number, leadSide: Side, options: GaitOptions) {
  const { groundY, stepTime, stepLength, run = false, balanceArms = false } = options;
  const lean = options.lean ?? (run ? 10 : 3);
  const hipY = standingHip(groundY) + (run ? 3 : 1);
  const frames: Keyframe[] = [];
  let side = leadSide;
  for (let step = 0; step <= steps; step += 1) {
    const t = startT + step * stepTime;
    const x = startX + step * stepLength;
    const front = { x: x + stepLength * 0.36, y: groundY };
    const back = { x: x - stepLength * 0.64, y: groundY - (run ? 16 : 4) };
    const shoulder = shoulderOf({ x, y: hipY }, lean);
    const swingForward = run ? { x: shoulder.x + 16, y: shoulder.y + 14 } : { x: shoulder.x + 10, y: shoulder.y + 28 };
    const swingBack = run ? { x: shoulder.x - 14, y: shoulder.y + 22 } : { x: shoulder.x - 9, y: shoulder.y + 28 };
    const balanceFront = { x: shoulder.x + 24, y: shoulder.y + 10 };
    const balanceBack = { x: shoulder.x - 20, y: shoulder.y + 12 };
    const leftFront = side === 'l';
    frames.push({
      t, x, y: hipY, lean,
      lf: leftFront ? front : back,
      rf: leftFront ? back : front,
      lh: balanceArms ? balanceBack : leftFront ? swingBack : swingForward,
      rh: balanceArms ? balanceFront : leftFront ? swingForward : swingBack,
    });
    if (step < steps) {
      const passX = x + stepLength / 2;
      const stanceFoot = { x: front.x, y: groundY };
      const swingFoot = { x: passX + 2, y: groundY - (run ? 26 : 12) };
      const passShoulder = shoulderOf({ x: passX, y: hipY - 3 }, lean);
      frames.push({
        t: t + stepTime / 2, x: passX, y: hipY - (run ? 5 : 2), lean,
        lf: leftFront ? stanceFoot : swingFoot,
        rf: leftFront ? swingFoot : stanceFoot,
        lh: balanceArms ? { x: passShoulder.x - 20, y: passShoulder.y + 12 } : { x: passShoulder.x - 1, y: passShoulder.y + (run ? 20 : 29) },
        rh: balanceArms ? { x: passShoulder.x + 24, y: passShoulder.y + 10 } : { x: passShoulder.x + 2, y: passShoulder.y + (run ? 20 : 29) },
      });
    }
    side = side === 'l' ? 'r' : 'l';
  }
  const lastSide: Side = steps % 2 === 0 ? leadSide : leadSide === 'l' ? 'r' : 'l';
  return {
    frames,
    endT: startT + steps * stepTime,
    endX: startX + steps * stepLength,
    /** The side whose foot is in front at the final contact. */
    frontSide: lastSide,
  };
}

/** A relaxed standing pose on a surface. */
export function stand(t: number, x: number, groundY: number, extra: Partial<Keyframe> = {}): Keyframe {
  return {
    t, x, y: standingHip(groundY), lean: 0,
    lf: { x: x - 3, y: groundY },
    rf: { x: x + 4, y: groundY },
    ...extra,
  };
}
