'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { Spring, queueOutput, springs } from '../../lib/motion/spring';
import { useReducedMotion } from '../../lib/motion/useSpring';

export interface InkRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface LiquidInkOptions {
  /** The element inside the container with `data-ink` equal to this value. `null` hides the ink. */
  target: string | null;
  /** Shrink the target rect by this many pixels on every side, e.g. to sit inside a border. */
  inset?: number;
  /** Custom rect in the container's offset coordinates. Keep the function identity stable. */
  measure?: (element: HTMLElement) => InkRect;
}

function offsetRect(element: HTMLElement): InkRect {
  return { left: element.offsetLeft, top: element.offsetTop, right: element.offsetLeft + element.offsetWidth, bottom: element.offsetTop + element.offsetHeight };
}

/**
 * Drives a 1x1 "ink" element so that it covers the active child of a container. Each edge rides its own
 * spring: the edge facing the direction of travel is stiff and the opposite edge trails, so the ink stretches
 * towards its destination and then contracts, like a liquid.
 *
 * Attach the returned refs to a `position: relative` container and to the ink element inside it; mark
 * candidates with `data-ink="<value>"`.
 */
export function useLiquidInk<C extends HTMLElement = HTMLDivElement, I extends HTMLElement = HTMLSpanElement>({ target, inset = 0, measure }: LiquidInkOptions) {
  const container = useRef<C>(null);
  const ink = useRef<I>(null);
  const [edges] = useState(() => ({
    left: new Spring(0),
    right: new Spring(0),
    top: new Spring(0),
    bottom: new Spring(0),
    opacity: new Spring(0, springs.snappy, 0.005),
  }));
  const reduce = useReducedMotion();
  const seated = useRef(false);

  useLayoutEffect(() => {
    const box = container.current;
    const node = ink.current;
    if (!box || !node) return;
    const { left, right, top, bottom, opacity } = edges;

    // Real width/height rather than scale, so the block's edges and any border radius stay crisp mid-flight.
    const paint = () => {
      const l = left.get();
      const t = top.get();
      node.style.transform = `translate(${l}px, ${t}px)`;
      node.style.width = `${Math.max(0, right.get() - l)}px`;
      node.style.height = `${Math.max(0, bottom.get() - t)}px`;
      node.style.opacity = String(Math.max(0, Math.min(1, opacity.get())));
    };
    const unsubscribe = [left, right, top, bottom, opacity].map((spring) => spring.subscribe(() => queueOutput(paint)));

    const place = (animate: boolean) => {
      const element = target === null ? null : box.querySelector<HTMLElement>(`[data-ink="${CSS.escape(target)}"]`);
      if (!element) {
        if (animate && !reduce) opacity.set(0);
        else opacity.jump(0);
        return;
      }
      const raw = measure ? measure(element) : offsetRect(element);
      const rect = { left: raw.left + inset, top: raw.top + inset, right: raw.right - inset, bottom: raw.bottom - inset };
      if (!animate || reduce || opacity.get() < 0.5) {
        // Not visible yet (first placement, or hidden): appear in place rather than travelling from wherever it was.
        left.jump(rect.left);
        right.jump(rect.right);
        top.jump(rect.top);
        bottom.jump(rect.bottom);
        if (reduce || !animate || !seated.current) opacity.jump(1);
        else opacity.set(1);
        seated.current = true;
        return;
      }
      const dx = (rect.left + rect.right) / 2 - (left.get() + right.get()) / 2;
      const dy = (rect.top + rect.bottom) / 2 - (top.get() + bottom.get()) / 2;
      const horizontal = Math.abs(dx) >= Math.abs(dy);
      left.set(rect.left, horizontal ? (dx < 0 ? springs.stiff : springs.trailing) : springs.snappy);
      right.set(rect.right, horizontal ? (dx > 0 ? springs.stiff : springs.trailing) : springs.snappy);
      top.set(rect.top, horizontal ? springs.snappy : dy < 0 ? springs.stiff : springs.trailing);
      bottom.set(rect.bottom, horizontal ? springs.snappy : dy > 0 ? springs.stiff : springs.trailing);
      opacity.set(1);
    };

    place(true);
    paint();
    box.dataset.ready = '';

    // Re-seat without animating whenever the container reflows (wrapping, font load, resize).
    let initial = true;
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false;
        return;
      }
      place(false);
    });
    observer.observe(box);

    return () => {
      observer.disconnect();
      unsubscribe.forEach((stop) => stop());
    };
  }, [edges, target, inset, measure, reduce]);

  return { container, ink };
}
