'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Spring, springs } from '../../lib/motion/spring';
import { useReducedMotion, useSpringOutput } from '../../lib/motion/useSpring';

// Track is 46x26 with a 2px border, so the inside is 42x22. The knob is 16px with a 3px inset.
const OFF = { left: 3, right: 19 };
const ON = { left: 23, right: 39 };
const WHITE = [255, 255, 255];
const LIME = [184, 232, 92];

/**
 * A switch whose knob has two independently sprung edges: the edge facing the destination is stiff and the
 * other trails, so the knob stretches across the track and snaps back to a square when it lands.
 */
export function Toggle({ checked, onChange, children, id, className }: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  const knob = useRef<HTMLSpanElement>(null);
  const track = useRef<HTMLSpanElement>(null);
  const [edges] = useState(() => ({
    left: new Spring(checked ? ON.left : OFF.left),
    right: new Spring(checked ? ON.right : OFF.right),
    tint: new Spring(checked ? 1 : 0, springs.snappy, 0.002),
  }));
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    const target = checked ? ON : OFF;
    if (reduce) {
      edges.left.jump(target.left);
      edges.right.jump(target.right);
      edges.tint.jump(checked ? 1 : 0);
      return;
    }
    edges.left.set(target.left, checked ? springs.trailing : springs.stiff);
    edges.right.set(target.right, checked ? springs.stiff : springs.trailing);
    edges.tint.set(checked ? 1 : 0);
  }, [checked, edges, reduce]);

  useSpringOutput([edges.left, edges.right, edges.tint], ([left, right, tint]) => {
    if (knob.current) knob.current.style.transform = `translateX(${left}px) scaleX(${Math.max(1, right - left)})`;
    if (track.current) {
      const t = Math.max(0, Math.min(1, tint));
      track.current.style.backgroundColor = `rgb(${WHITE.map((channel, i) => Math.round(channel + (LIME[i] - channel) * t)).join(' ')})`;
    }
  });

  const rest = checked ? ON : OFF;
  return (
    <button id={id} type="button" role="switch" aria-checked={checked} className={className ? `tog ${className}` : 'tog'} onClick={() => onChange(!checked)}>
      <span ref={track} className="tog-track" aria-hidden style={{ backgroundColor: checked ? `rgb(${LIME.join(' ')})` : `rgb(${WHITE.join(' ')})` }}>
        <span ref={knob} className="tog-knob" style={{ transform: `translateX(${rest.left}px) scaleX(${rest.right - rest.left})` }} />
      </span>
      <span className="tog-label">{children}</span>
    </button>
  );
}
