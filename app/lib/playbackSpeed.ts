'use client';

import { useSyncExternalStore } from 'react';

export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2, 3] as const;
export const SPEED_STORAGE_KEY = 'issb-audio-speed';
const SPEED_EVENT = 'issb-audio-speed-change';

function normalise(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value);
  return PLAYBACK_SPEEDS.find((speed) => speed === num) ?? 1;
}

export function readPlaybackSpeed(): number {
  if (typeof window === 'undefined') return 1;
  try {
    return normalise(window.localStorage.getItem(SPEED_STORAGE_KEY));
  } catch {
    return 1;
  }
}

export function writePlaybackSpeed(speed: number) {
  const value = normalise(speed);
  try {
    window.localStorage.setItem(SPEED_STORAGE_KEY, String(value));
  } catch {
    // Private browsing may block storage; the speed still applies for this page.
  }
  window.dispatchEvent(new CustomEvent(SPEED_EVENT, { detail: value }));
}

/** Applies a speed to an audio element. Also sets the default so a new src keeps it. */
export function applyPlaybackSpeed(audio: HTMLAudioElement, speed: number) {
  audio.defaultPlaybackRate = speed;
  audio.playbackRate = speed;
  audio.preservesPitch = true;
  (audio as HTMLAudioElement & { webkitPreservesPitch?: boolean }).webkitPreservesPitch = true;
}

function subscribe(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === SPEED_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener(SPEED_EVENT, onStoreChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SPEED_EVENT, onStoreChange);
    window.removeEventListener('storage', onStorage);
  };
}

/** Shared narration speed, remembered across cards, pages and visits. */
export function usePlaybackSpeed(): [number, (speed: number) => void] {
  const speed = useSyncExternalStore(subscribe, readPlaybackSpeed, () => 1);
  return [speed, writePlaybackSpeed];
}

export function speedLabel(speed: number): string {
  return `${speed}x`;
}
