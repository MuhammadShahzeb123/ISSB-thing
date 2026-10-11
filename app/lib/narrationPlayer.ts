'use client';

// One shared <audio> element for every narration control on the site.
// Before this, each SpeakButton made its own Audio and threw it away on Stop, on unmount
// (closing a popup, switching tab or card) and when its src changed, so every Play started at 0.
// Now the element lives for the whole page, positions are remembered per track, and only one
// track plays at a time.

import { useSyncExternalStore } from 'react';
import { applyPlaybackSpeed, readPlaybackSpeed } from './playbackSpeed';

const POS_KEY = 'issb-audio-positions-v1';

export type PlayerSnapshot = {
  src: string | null;
  playing: boolean;
  time: number;
  duration: number;
  failed: readonly string[];
};

type Owner = { onEnded: () => string | void; onError: () => void };

let audio: HTMLAudioElement | null = null;
let owner: Owner | null = null;
let snapshot: PlayerSnapshot = { src: null, playing: false, time: 0, duration: 0, failed: [] };
const listeners = new Set<() => void>();
const durations = new Map<string, number>();
let pendingSeek: number | null = null;
let lastSaved = 0;

function emit(patch: Partial<PlayerSnapshot>) {
  snapshot = { ...snapshot, ...patch };
  listeners.forEach((listener) => listener());
}

function readPositions(): Record<string, number> {
  try {
    return JSON.parse(window.localStorage.getItem(POS_KEY) ?? '{}') as Record<string, number>;
  } catch {
    return {};
  }
}

function writePosition(src: string, time: number | null) {
  try {
    const all = readPositions();
    if (time === null || time < 1) delete all[src];
    else all[src] = Math.round(time * 10) / 10;
    window.localStorage.setItem(POS_KEY, JSON.stringify(all));
  } catch {
    // Storage may be blocked; positions then last only for this page.
  }
}

export function savedPosition(src: string): number {
  if (typeof window === 'undefined') return 0;
  return readPositions()[src] ?? 0;
}

export function knownDuration(src: string): number {
  return durations.get(src) ?? 0;
}

function ensureAudio(): HTMLAudioElement {
  if (audio) return audio;
  const el = new Audio();
  el.preload = 'metadata';
  el.addEventListener('loadedmetadata', () => {
    if (snapshot.src && Number.isFinite(el.duration)) durations.set(snapshot.src, el.duration);
    if (pendingSeek !== null && Number.isFinite(el.duration) && pendingSeek < el.duration - 1) {
      el.currentTime = pendingSeek;
    }
    pendingSeek = null;
    emit({ duration: Number.isFinite(el.duration) ? el.duration : 0, time: el.currentTime });
  });
  el.addEventListener('timeupdate', () => {
    emit({ time: el.currentTime });
    if (snapshot.src && Math.abs(el.currentTime - lastSaved) >= 2) {
      lastSaved = el.currentTime;
      writePosition(snapshot.src, el.currentTime);
    }
  });
  el.addEventListener('play', () => emit({ playing: true }));
  el.addEventListener('pause', () => {
    if (snapshot.src && !el.ended) writePosition(snapshot.src, el.currentTime);
    emit({ playing: false, time: el.currentTime });
  });
  el.addEventListener('ended', () => {
    const finished = snapshot.src;
    if (finished) writePosition(finished, null);
    emit({ playing: false, time: 0 });
    const next = owner?.onEnded();
    if (typeof next === 'string' && next && owner) play(next, owner, true);
  });
  el.addEventListener('error', () => {
    const failedSrc = snapshot.src;
    if (!failedSrc || !el.getAttribute('src')) return;
    emit({ playing: false, failed: [...snapshot.failed.filter((s) => s !== failedSrc), failedSrc] });
    owner?.onError();
  });
  audio = el;
  return el;
}

/** Play `src`, resuming where it was left unless `fromStart`. Pauses whatever else was playing. */
export function play(src: string, nextOwner: Owner, fromStart = false) {
  const el = ensureAudio();
  owner = nextOwner;
  applyPlaybackSpeed(el, readPlaybackSpeed());
  if (snapshot.src !== src || !el.getAttribute('src')) {
    if (snapshot.src && !el.paused) {
      writePosition(snapshot.src, el.currentTime);
      el.pause();
    }
    const resumeAt = fromStart ? 0 : savedPosition(src);
    pendingSeek = resumeAt > 0 ? resumeAt : null;
    lastSaved = resumeAt;
    el.src = src;
    emit({ src, time: resumeAt, duration: knownDuration(src) });
  }
  applyPlaybackSpeed(el, readPlaybackSpeed());
  void el.play().catch(() => emit({ playing: false }));
}

export function pause() {
  audio?.pause();
}

/** Stops file playback (keeps the saved position). Used when the speech fallback takes over. */
export function release(src?: string) {
  if (!audio) return;
  if (src && snapshot.src !== src) return;
  audio.pause();
}

export function seek(src: string, time: number) {
  const target = Math.max(0, time);
  if (audio && snapshot.src === src && audio.getAttribute('src')) {
    if (audio.readyState >= 1) audio.currentTime = target;
    else pendingSeek = target;
    writePosition(src, target);
    emit({ time: target });
    return;
  }
  writePosition(src, target);
  listeners.forEach((listener) => listener());
}

export function setLiveSpeed(speed: number) {
  if (audio) applyPlaybackSpeed(audio, speed);
}

/** Pause if the given owner is the one playing (e.g. its last control unmounted). */
export function pauseIfOwner(candidate: Owner) {
  if (owner === candidate) audio?.pause();
}

export function isOwner(candidate: Owner) {
  return owner === candidate;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverSnapshot: PlayerSnapshot = { src: null, playing: false, time: 0, duration: 0, failed: [] };

export function useNarrationPlayer(): PlayerSnapshot {
  return useSyncExternalStore(subscribe, () => snapshot, () => serverSnapshot);
}

export function formatClock(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
