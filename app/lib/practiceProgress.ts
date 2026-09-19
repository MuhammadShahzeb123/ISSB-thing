'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { PracticeModuleId } from './practiceModules';

// Browser-only practice history. Nothing leaves the device.
//
// Schema v2 keys everything by module id (see practiceModules.ts), so moving a
// module between dimensions only changes the registry, not stored progress.
// v1 never shipped with data; the key bump keeps any stray v1 value ignored.

const STORAGE_KEY = 'issb-practice-progress-v2';

export type ModuleProgress = {
  /** Times the module was opened from a random draw or revision mode. */
  attempts: number;
  lastAttemptAt?: string;
  /** The candidate marked the module as reviewed. */
  reviewedAt?: string;
};

export type PracticeProgress = {
  version: 2;
  modules: Partial<Record<PracticeModuleId, ModuleProgress>>;
  /** Most recent random draws, newest first, so a draw can avoid repeats. */
  recentDraws: PracticeModuleId[];
};

const EMPTY: PracticeProgress = { version: 2, modules: {}, recentDraws: [] };
const listeners = new Set<() => void>();
let cache: { raw: string | null; value: PracticeProgress } | null = null;

function read(): PracticeProgress {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return EMPTY;
  }
  if (cache && cache.raw === raw) return cache.value;
  let value = EMPTY;
  try {
    const parsed = raw ? (JSON.parse(raw) as PracticeProgress) : null;
    if (parsed?.version === 2 && parsed.modules && Array.isArray(parsed.recentDraws)) value = parsed;
  } catch {
    value = EMPTY;
  }
  cache = { raw, value };
  return value;
}

function write(update: (current: PracticeProgress) => PracticeProgress) {
  const next = update(read());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be full or blocked (private mode). Progress is a
    // convenience, so the practice itself keeps working.
  }
  cache = null;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function recordAttempt(id: PracticeModuleId, fromRandomDraw: boolean) {
  write((current) => {
    const previous = current.modules[id] ?? { attempts: 0 };
    return {
      ...current,
      modules: { ...current.modules, [id]: { ...previous, attempts: previous.attempts + 1, lastAttemptAt: new Date().toISOString() } },
      recentDraws: fromRandomDraw ? [id, ...current.recentDraws.filter((item) => item !== id)].slice(0, 12) : current.recentDraws,
    };
  });
}

export function setReviewed(id: PracticeModuleId, reviewed: boolean) {
  write((current) => {
    const previous = current.modules[id] ?? { attempts: 0 };
    return { ...current, modules: { ...current.modules, [id]: { ...previous, reviewedAt: reviewed ? new Date().toISOString() : undefined } } };
  });
}

export function readProgressSnapshot() {
  return read();
}

export function usePracticeProgress() {
  const progress = useSyncExternalStore(subscribe, read, () => EMPTY);
  const toggleReviewed = useCallback((id: PracticeModuleId) => setReviewed(id, !progress.modules[id]?.reviewedAt), [progress]);
  return { progress, toggleReviewed };
}
