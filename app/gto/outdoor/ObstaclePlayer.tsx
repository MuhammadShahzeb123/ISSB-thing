'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react';
import { BODY, createTimeline, type Pose } from './figureEngine';
import { VIEW, type Obstacle } from './obstacles';

const SPEEDS = [0.25, 0.5, 1] as const;
/** Pause on the final pose before looping so the finish is readable. */
const LOOP_HOLD_SECONDS = 0.6;

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Limb({ from, joint, to, color, width }: { from: Pose['hip']; joint: Pose['hip']; to: Pose['hip']; color: string; width: number }) {
  return <polyline points={`${from.x},${from.y} ${joint.x},${joint.y} ${to.x},${to.y}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
}

export function Figure({ pose, ghost = false }: { pose: Pose; ghost?: boolean }) {
  const far = ghost ? '#171717' : '#6b7a90';
  const near = ghost ? '#171717' : '#0057a8';
  return <g opacity={ghost ? 0.16 : 1} aria-hidden="true">
    <Limb from={pose.hip} joint={pose.lKnee} to={pose.lFoot} color={far} width={7} />
    <Limb from={pose.shoulder} joint={pose.lElbow} to={pose.lHand} color={far} width={5.5} />
    <line x1={pose.hip.x} y1={pose.hip.y} x2={pose.shoulder.x} y2={pose.shoulder.y} stroke="#171717" strokeWidth={9} strokeLinecap="round" />
    <circle cx={pose.head.x} cy={pose.head.y} r={BODY.headRadius} fill={ghost ? 'none' : '#fffaf0'} stroke="#171717" strokeWidth={3} />
    <Limb from={pose.hip} joint={pose.rKnee} to={pose.rFoot} color={near} width={7} />
    <Limb from={pose.shoulder} joint={pose.rElbow} to={pose.rHand} color={near} width={5.5} />
  </g>;
}

export default function ObstaclePlayer({ obstacle }: { obstacle: Obstacle }) {
  const timeline = useMemo(() => createTimeline(obstacle.keyframes), [obstacle]);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
  const [time, setTime] = useState(0);
  // null means "follow the reduced-motion preference" until the user chooses.
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]>(0.5);
  const [showGhosts, setShowGhosts] = useState(false);
  const timeRef = useRef(0);
  const playing = playChoice ?? !reducedMotion;

  const seek = useCallback((next: number) => {
    const clamped = Math.min(Math.max(next, 0), timeline.duration);
    timeRef.current = clamped;
    setTime(clamped);
  }, [timeline.duration]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      const delta = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;
      let next = timeRef.current + delta * speed;
      if (next > timeline.duration + LOOP_HOLD_SECONDS) next = 0;
      timeRef.current = next;
      setTime(next);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, speed, timeline.duration]);

  const shownTime = Math.min(time, timeline.duration);
  const pose = timeline.poseAt(shownTime);
  const stepIndex = Math.max(0, obstacle.steps.findLastIndex((step) => step.at <= shownTime + 0.001));
  const step = obstacle.steps[stepIndex];
  const focusPoint = step.focus ? pose[step.focus] : null;
  const ghosts = useMemo(() => obstacle.steps.map((item) => timeline.poseAt(item.at + 0.01)), [obstacle.steps, timeline]);

  const goToStep = (index: number) => {
    const bounded = (index + obstacle.steps.length) % obstacle.steps.length;
    setPlayChoice(false);
    seek(obstacle.steps[bounded].at + 0.01);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    if (event.key === ' ' || event.key === 'k') {
      event.preventDefault();
      setPlayChoice(!playing);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goToStep(stepIndex + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goToStep(stepIndex - 1);
    }
  };

  const { Scene, Foreground } = obstacle;

  return (
    <div className="obstacle-player" role="group" aria-label={`${obstacle.name} technique animation`} tabIndex={0} onKeyDown={onKeyDown}>
      <div className="obstacle-stage">
        <svg viewBox={`0 0 ${VIEW.width} ${VIEW.height}`} role="img" aria-label={`${obstacle.name}: step ${stepIndex + 1}, ${step.title}`}>
          <Scene t={shownTime} pose={pose} />
          {showGhosts && ghosts.map((ghost, index) => <Figure key={index} pose={ghost} ghost />)}
          <Figure pose={pose} />
          {Foreground && <Foreground t={shownTime} pose={pose} />}
          {focusPoint && <g className="obstacle-focus" aria-hidden="true">
            <circle cx={focusPoint.x} cy={focusPoint.y} r={11} />
            <g transform={`translate(${Math.min(Math.max(focusPoint.x + 14, 12), VIEW.width - 12)} ${Math.min(Math.max(focusPoint.y - 16, 12), VIEW.height - 12)})`}>
              <circle r={9} />
              <text y={3.5} textAnchor="middle">{stepIndex + 1}</text>
            </g>
          </g>}
        </svg>
      </div>

      <div className="obstacle-caption" aria-live={playing ? 'off' : 'polite'}>
        <p className="obstacle-caption-count">Step {stepIndex + 1} of {obstacle.steps.length}</p>
        <p className="obstacle-caption-title">{step.title}</p>
        <p className="obstacle-caption-tip">{step.tip}</p>
      </div>

      <div className="obstacle-controls">
        <button type="button" className="prep-button prep-button-secondary" onClick={() => goToStep(stepIndex - 1)} aria-label="Previous step">← Step</button>
        <button type="button" className="prep-button" onClick={() => setPlayChoice(!playing)} aria-pressed={playing}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" className="prep-button prep-button-secondary" onClick={() => goToStep(stepIndex + 1)} aria-label="Next step">Step →</button>
        <button type="button" className="prep-button prep-button-secondary" onClick={() => { seek(0); setPlayChoice(true); }}>Restart</button>
        <label className="obstacle-inline-field">Speed
          <select value={speed} onChange={(event) => setSpeed(Number(event.target.value) as (typeof SPEEDS)[number])}>
            {SPEEDS.map((value) => <option key={value} value={value}>{value}×</option>)}
          </select>
        </label>
        <label className="obstacle-inline-field"><input type="checkbox" checked={showGhosts} onChange={(event) => setShowGhosts(event.target.checked)} /> Key positions</label>
      </div>
      <input
        className="obstacle-scrubber"
        type="range"
        min={0}
        max={timeline.duration}
        step={0.01}
        value={shownTime}
        aria-label="Animation position"
        aria-valuetext={`${shownTime.toFixed(1)} of ${timeline.duration.toFixed(1)} seconds, ${step.title}`}
        onChange={(event) => { setPlayChoice(false); seek(Number(event.target.value)); }}
      />

      <ol className="obstacle-steps">
        {obstacle.steps.map((item, index) => (
          <li key={item.title}>
            <button type="button" aria-current={index === stepIndex ? 'step' : undefined} onClick={() => goToStep(index)}>
              <span className="obstacle-step-number">{index + 1}</span>
              <span><strong>{item.title}</strong><span className="obstacle-step-tip">{item.tip}</span></span>
            </button>
          </li>
        ))}
      </ol>
      <p className="prep-muted">Keys: Space plays or pauses, ← and → move between steps. Reduced-motion settings start the animation paused.</p>
    </div>
  );
}
