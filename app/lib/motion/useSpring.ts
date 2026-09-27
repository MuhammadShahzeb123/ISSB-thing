'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Spring, queueOutput, springs, type SpringConfig } from './spring';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

/** True when the user asked the OS for less motion. Springs then jump straight to their targets. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(reducedMotionQuery).matches, () => false);
}

/**
 * A spring that follows `target`. The first render sits at the target, so nothing animates on mount;
 * every later change animates from wherever the spring currently is.
 */
export function useSpring(target: number, config: SpringConfig = springs.snappy, precision?: number): Spring {
  const [spring] = useState(() => new Spring(target, config, precision));
  const reduce = useReducedMotion();
  const { stiffness, damping, mass } = config;
  useLayoutEffect(() => {
    if (reduce) spring.jump(target);
    else spring.set(target, { stiffness, damping, mass });
  }, [spring, target, reduce, stiffness, damping, mass]);
  return spring;
}

/**
 * Apply spring values straight to the DOM, once per frame, without re-rendering.
 * `apply` also runs right after layout so the first paint matches.
 */
export function useSpringOutput(input: Spring | Spring[], apply: (values: number[]) => void): void {
  const applyRef = useRef(apply);
  useLayoutEffect(() => {
    applyRef.current = apply;
  });
  const list = Array.isArray(input) ? input : [input];
  useLayoutEffect(() => {
    const run = () => applyRef.current(list.map((spring) => spring.get()));
    const unsubscribes = list.map((spring) => spring.subscribe(() => queueOutput(run)));
    run();
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [...list]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** A re-rendering spring value for small leaf components such as animated numbers. */
export function useSpringNumber(target: number, config: SpringConfig = springs.snappy, precision?: number): number {
  const spring = useSpring(target, config, precision);
  const [value, setValue] = useState(() => spring.get());
  useEffect(() => spring.subscribe(setValue), [spring]);
  return value;
}
