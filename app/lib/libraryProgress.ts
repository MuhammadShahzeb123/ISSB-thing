'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/** Per-set progress, stored only in this browser. */
export interface SetProgress {
  /** Item indices the learner has answered, written or viewed. */
  done: number[];
  /** Flashcard indices marked "I knew it". */
  known: number[];
  total: number;
  visitedAt: number;
  completedAt?: number;
  lastResult?: string;
}

export type ProgressMap = Record<string, SetProgress>;

const STORAGE_KEY = 'issb-library-progress-v1';
const CHANGE_EVENT = 'issb-library-progress';

export const progressKey = (collection: string, setId: string) => `${collection}/${setId}`;

const EMPTY: ProgressMap = {};
let cachedRaw: string | null = null;
let cachedMap: ProgressMap = EMPTY;

function read(): ProgressMap {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return cachedMap;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedMap = raw ? (JSON.parse(raw) as ProgressMap) : EMPTY;
    } catch {
      cachedMap = EMPTY;
    }
  }
  return cachedMap;
}

function write(map: ProgressMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Private browsing can block storage; practice still works without saving.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const noopSubscribe = () => () => {};

export function useLibraryProgress() {
  const progress = useSyncExternalStore(subscribe, read, () => EMPTY);
  const loaded = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const update = useCallback((key: string, total: number, change: (current: SetProgress) => Partial<SetProgress>) => {
    const map = { ...read() };
    const current: SetProgress = map[key] ?? { done: [], known: [], total, visitedAt: Date.now() };
    map[key] = { ...current, ...change(current), total, visitedAt: Date.now() };
    write(map);
  }, []);

  const reset = useCallback((key: string) => {
    const map = { ...read() };
    delete map[key];
    write(map);
  }, []);

  return { progress, loaded, update, reset };
}

/** Fraction of a set's items the learner has touched, 0–1. */
export function completion(entry: SetProgress | undefined, total: number): number {
  if (!entry || !total) return 0;
  return Math.min(1, new Set(entry.done).size / total);
}

/** A pausable countdown driven by a wall-clock deadline, so tab throttling cannot drift it. */
export function useCountdown(seconds: number, onExpire?: () => void) {
  const [left, setLeft] = useState(seconds);
  const [deadline, setDeadline] = useState<number | null>(null);
  const expire = useRef(onExpire);
  useEffect(() => { expire.current = onExpire; }, [onExpire]);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const remaining = Math.max(0, (deadline - Date.now()) / 1000);
      setLeft(remaining);
      if (remaining <= 0) {
        setDeadline(null);
        expire.current?.();
      }
    };
    tick();
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [deadline]);

  const start = useCallback((from?: number) => setDeadline(Date.now() + (from ?? left) * 1000), [left]);
  const pause = useCallback(() => {
    setDeadline((current) => {
      if (current !== null) setLeft(Math.max(0, (current - Date.now()) / 1000));
      return null;
    });
  }, []);
  const reset = useCallback((to = seconds) => {
    setDeadline(null);
    setLeft(to);
  }, [seconds]);
  const restart = useCallback((to = seconds) => {
    setLeft(to);
    setDeadline(Date.now() + to * 1000);
  }, [seconds]);

  return { left, running: deadline !== null, start, pause, reset, restart };
}
