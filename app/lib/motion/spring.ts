/**
 * Closed-form damped springs.
 *
 * Every animated value in the app is a spring evaluated analytically at the current time, so motion is a pure
 * function of time: interruptions re-seed the spring from its live position and velocity, which keeps retargets
 * continuous (no jump, no restart from zero). A single requestAnimationFrame ticker steps every active spring.
 */

export interface SpringConfig {
  /** Restoring force. Higher is faster. */
  stiffness: number;
  /** Friction. Damping ratio = damping / (2 * sqrt(stiffness * mass)); keep it in 0.7–1.0 for a tiny overshoot at most. */
  damping: number;
  mass?: number;
}

/** House curves. Damping ratios stay between 0.72 and 1.0, so nothing bounces. */
export const springs = {
  /** Default for interactive UI: settles in ~0.3s with a 2% overshoot. */
  snappy: { stiffness: 400, damping: 31 },
  /** Critically damped: for size and position morphs where an overshoot would open a gap. */
  gentle: { stiffness: 260, damping: 32 },
  /** Fast: presses, the leading edge of a liquid indicator. */
  stiff: { stiffness: 700, damping: 42 },
  /** Slower, no overshoot: the trailing edge of a liquid indicator, so the shape stretches in the direction of travel. */
  trailing: { stiffness: 300, damping: 33 },
  /** Large layout morphs. */
  slow: { stiffness: 150, damping: 24 },
} satisfies Record<string, SpringConfig>;

interface State {
  x: number;
  v: number;
}

/** Displacement and velocity of a spring `t` seconds after starting at displacement `x0` with velocity `v0`. */
export function evaluateSpring(x0: number, v0: number, t: number, config: SpringConfig): State {
  const mass = config.mass ?? 1;
  const w0 = Math.sqrt(config.stiffness / mass);
  const zeta = config.damping / (2 * Math.sqrt(config.stiffness * mass));

  if (Math.abs(zeta - 1) < 1e-4) {
    const decay = Math.exp(-w0 * t);
    const c = v0 + w0 * x0;
    return { x: (x0 + c * t) * decay, v: (v0 - w0 * c * t) * decay };
  }

  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    const decay = Math.exp(-zeta * w0 * t);
    const a = x0;
    const b = (v0 + zeta * w0 * x0) / wd;
    const cos = Math.cos(wd * t);
    const sin = Math.sin(wd * t);
    return {
      x: decay * (a * cos + b * sin),
      v: decay * ((b * wd - zeta * w0 * a) * cos - (a * wd + zeta * w0 * b) * sin),
    };
  }

  const s = w0 * Math.sqrt(zeta * zeta - 1);
  const r1 = -zeta * w0 + s;
  const r2 = -zeta * w0 - s;
  const c2 = (v0 - r1 * x0) / (r2 - r1);
  const c1 = x0 - c2;
  const e1 = Math.exp(r1 * t);
  const e2 = Math.exp(r2 * t);
  return { x: c1 * e1 + c2 * e2, v: c1 * r1 * e1 + c2 * r2 * e2 };
}

/**
 * A CSS `linear()` easing that follows the spring's step response, for CSS transitions and keyframe entrances.
 * `durationMs` must match the transition's duration for the curve to line up.
 */
export function springEasing(config: SpringConfig, durationMs: number, samples = 24): string {
  const points: string[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * (durationMs / 1000);
    const { x } = evaluateSpring(-1, 0, t, config);
    points.push((1 + x).toFixed(4).replace(/\.?0+$/, ''));
  }
  points[points.length - 1] = '1';
  return `linear(${points.join(', ')})`;
}

type Listener = (value: number) => void;

const active = new Set<Spring>();
const outputs = new Set<() => void>();
let frame = 0;

function tick(now: number) {
  frame = 0;
  for (const spring of active) {
    if (!spring.step(now)) active.delete(spring);
    spring.emit();
  }
  flush();
  if (active.size) schedule();
}

function schedule() {
  if (!frame && typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(tick);
}

function flush() {
  const queued = [...outputs];
  outputs.clear();
  for (const output of queued) output();
}

/** Register a callback to run once at the end of the current frame, however many springs asked for it. */
export function queueOutput(output: () => void) {
  outputs.add(output);
}

export class Spring {
  private target: number;
  private x0 = 0;
  private v0 = 0;
  private t0 = 0;
  private config: SpringConfig;
  private listeners = new Set<Listener>();
  private readonly precision: number;
  value: number;
  velocity = 0;
  moving = false;

  constructor(initial: number, config: SpringConfig = springs.snappy, precision = 0.01) {
    this.value = initial;
    this.target = initial;
    this.config = config;
    this.precision = precision;
  }

  get(): number {
    return this.value;
  }

  getTarget(): number {
    return this.target;
  }

  /** Animate towards `target` from the live position and velocity. Same target while at rest is a no-op. */
  set(target: number, config?: SpringConfig): void {
    if (config) this.config = config;
    if (!this.moving && target === this.target) return;
    const now = typeof performance !== 'undefined' ? performance.now() : 0;
    if (this.moving) this.step(now);
    this.target = target;
    this.x0 = this.value - target;
    this.v0 = this.velocity;
    this.t0 = now;
    this.moving = true;
    active.add(this);
    schedule();
  }

  /** Snap to `value` with no motion (used for reduced motion and for measurements that must not animate). */
  jump(value: number): void {
    this.target = value;
    this.value = value;
    this.velocity = 0;
    this.moving = false;
    active.delete(this);
    this.emit();
    flush();
  }

  /** Advance to `now` (ms). Returns false once the spring has settled. */
  step(now: number): boolean {
    if (!this.moving) return false;
    const { x, v } = evaluateSpring(this.x0, this.v0, Math.max(0, now - this.t0) / 1000, this.config);
    if (Math.abs(x) < this.precision && Math.abs(v) < this.precision * 10) {
      this.value = this.target;
      this.velocity = 0;
      this.moving = false;
      return false;
    }
    this.value = this.target + x;
    this.velocity = v;
    return true;
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(): void {
    for (const listener of this.listeners) listener(this.value);
  }
}
