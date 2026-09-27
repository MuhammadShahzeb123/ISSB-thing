'use client';

import { useEffect, useLayoutEffect, useRef, useState, type AnimationEvent, type CSSProperties, type ReactNode } from 'react';
import { Spring, queueOutput, springs } from '../../lib/motion/spring';
import { useReducedMotion } from '../../lib/motion/useSpring';

interface Item {
  id: string;
  node: ReactNode;
  entered: boolean;
}

interface State {
  current: Item;
  leaving: Item | null;
  serial: number;
}

export interface SwapProps {
  /** Identity of the content. When it changes, the old content blurs out while the new content rises in. */
  id: string | number | boolean;
  children?: ReactNode;
  /** Which dimension of the container springs between the old and new content size. */
  morph?: 'height' | 'width' | 'none';
  /** Where the old content leaves towards. Default: up. */
  dir?: 'up' | 'down' | 'left' | 'right';
  /** Render as an inline span (for text inside buttons and labels). */
  inline?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * One container whose content swaps with a short blur while its size morphs on a spring, so a state change
 * reads as the same element becoming something else rather than a cut.
 */
export function Swap({ id, children, morph = 'height', dir = 'up', inline = false, className, style }: SwapProps) {
  const key = String(id);
  const reduce = useReducedMotion();
  const [state, setState] = useState<State>(() => ({ current: { id: key, node: children, entered: false }, leaving: null, serial: 0 }));

  // Derived state: a new id retires the current content into a leaving ghost; the same id just refreshes it,
  // so the ghost always shows what the user last saw rather than a stale snapshot.
  if (state.current.id !== key) {
    setState({ current: { id: key, node: children, entered: true }, leaving: reduce ? null : state.current, serial: state.serial + 1 });
  } else if (state.current.node !== children) {
    setState({ ...state, current: { ...state.current, node: children } });
  }

  const { current, leaving, serial } = state;

  // Safety net: if the exit animation never fires (animations disabled), drop the ghost anyway.
  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(() => setState((value) => (value.serial === serial ? { ...value, leaving: null } : value)), 500);
    return () => window.clearTimeout(timer);
  }, [leaving, serial]);

  const onLeaveEnd = (event: AnimationEvent) => {
    if (event.target === event.currentTarget) setState((value) => (value.serial === serial ? { ...value, leaving: null } : value));
  };

  const outer = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const inner = useRef<HTMLDivElement & HTMLSpanElement>(null);
  const mounted = useRef(false);
  const [size] = useState(() => new Spring(0, springs.gentle, 0.5));
  const axis = morph === 'width' ? 'width' : 'height';

  useLayoutEffect(() => {
    const box = outer.current;
    const node = inner.current;
    if (morph === 'none' || !box || !node) return;
    const paint = () => {
      if (size.moving) {
        box.style[axis] = `${size.get()}px`;
        box.dataset.morphing = '';
      } else {
        box.style[axis] = '';
        delete box.dataset.morphing;
      }
    };
    const unsubscribe = size.subscribe(() => queueOutput(paint));
    const observer = new ResizeObserver((entries) => {
      const value = entries[0].contentRect[axis];
      if (!mounted.current || reduce) {
        mounted.current = true;
        size.jump(value);
      } else {
        size.set(value);
      }
      // Apply synchronously: ResizeObserver runs before paint, so the container never shows the new size for a frame.
      paint();
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [current.id, morph, axis, reduce, size]);

  const Tag = inline ? 'span' : 'div';
  const classes = ['swap', inline && 'swap--inline', className].filter(Boolean).join(' ');

  return (
    <Tag ref={outer} className={classes} style={style} data-dir={dir !== 'up' ? dir : undefined}>
      {leaving && (
        <Tag key={`leaving-${serial}`} className="swap-leaving" aria-hidden inert onAnimationEnd={onLeaveEnd}>
          {leaving.node}
        </Tag>
      )}
      <Tag key={current.id} ref={inner} className={`swap-current${current.entered ? ' is-entering' : ''}`}>
        {current.node}
      </Tag>
    </Tag>
  );
}
