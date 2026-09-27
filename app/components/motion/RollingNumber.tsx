'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Spring, springs } from '../../lib/motion/spring';
import { useReducedMotion, useSpringOutput } from '../../lib/motion/useSpring';

const COLUMN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/** Shortest signed step from one digit to another around the 0-9 wheel. */
function shortestStep(from: number, to: number) {
  return ((((to - from) % 10) + 15) % 10) - 5;
}

function Digit({ digit, initial }: { digit: number; initial?: number }) {
  const column = useRef<HTMLSpanElement>(null);
  // The spring tracks an unbounded wheel position; rendering takes it modulo 10 so wrapping 9 -> 0 is seamless.
  const [wheel] = useState(() => new Spring(initial ?? digit, springs.gentle, 0.002));
  const reduce = useReducedMotion();
  const started = useRef(false);

  useLayoutEffect(() => {
    const base = Math.round(wheel.get());
    const current = ((base % 10) + 10) % 10;
    // A count-up from `initial` always rolls forwards; later changes take the shortest way round the wheel.
    const step = !started.current && initial !== undefined ? (((digit - current) % 10) + 10) % 10 : shortestStep(current, digit);
    started.current = true;
    if (reduce) wheel.jump(base + step);
    else wheel.set(base + step);
  }, [digit, initial, reduce, wheel]);

  useSpringOutput(wheel, ([position]) => {
    if (column.current) column.current.style.transform = `translateY(${-(((position % 10) + 10) % 10)}em)`;
  });

  return (
    <span className="roll-digit" aria-hidden>
      {/* The server-rendered position matches the first client paint, so nothing jumps on hydration. */}
      <span ref={column} style={{ transform: `translateY(${-(initial ?? digit)}em)` }}>
        {COLUMN.map((value, index) => (
          <span key={index}>{value}</span>
        ))}
      </span>
    </span>
  );
}

/**
 * Text whose digits roll like an odometer when they change. Non-digit characters stay put.
 * `from` lets a number count up from a different value on mount (e.g. a score revealed from 0).
 */
export function RollingNumber({ value, from, className }: { value: string; from?: string; className?: string }) {
  const chars = [...value];
  const fromChars = from === undefined ? undefined : [...from];
  return (
    <span className={className ? `roll ${className}` : 'roll'}>
      <span className="sr-only">{value}</span>
      {chars.map((char, index) => {
        // Keys count from the right so the units column keeps its wheel when the number gains a digit.
        const fromRight = chars.length - 1 - index;
        if (!/\d/.test(char)) return <span key={`c${fromRight}`} aria-hidden>{char}</span>;
        const start = fromChars?.[fromChars.length - 1 - fromRight];
        return <Digit key={`d${fromRight}`} digit={Number(char)} initial={start !== undefined && /\d/.test(start) ? Number(start) : from === undefined ? undefined : 0} />;
      })}
    </span>
  );
}
