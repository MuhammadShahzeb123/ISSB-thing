'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { PLAYBACK_SPEEDS, speedLabel, usePlaybackSpeed } from '../lib/playbackSpeed';
import {
  formatClock,
  isOwner,
  knownDuration,
  pause as pausePlayer,
  pauseIfOwner,
  play as playFile,
  release,
  savedPosition,
  seek,
  setLiveSpeed,
  useNarrationPlayer,
} from '../lib/narrationPlayer';

type SpeakButtonProps = {
  /** Flowing spoken paragraph (no dashes/colons). Used for Web Speech fallback and aria. */
  script: string;
  /** Optional pre-generated audio file under /public */
  audioSrc?: string;
  label?: string;
  className?: string;
  /**
   * Called only when narration actually finishes (audio `ended`, or speech fallback `onend`).
   * Return the next audio URL to keep playing (autoplay continuation).
   */
  onEnded?: () => string | void;
};

const SEEK_STEP = 5;
const noopSubscribe = () => () => {};

/**
 * Play / pause control with speed menu and a seek bar.
 * Files play through one shared audio element (app/lib/narrationPlayer.ts), so the position
 * survives re-renders, popups closing and reopening, and switching cards. The Web Speech
 * fallback (no file) cannot seek, so it shows no bar.
 */
export default function SpeakButton({ script, audioSrc, label = 'Play audio', className = '', onEnded }: SpeakButtonProps) {
  const player = useNarrationPlayer();
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [speed, setSpeed] = usePlaybackSpeed();
  const onEndedRef = useRef(onEnded);
  const scriptRef = useRef(script);
  const speedRef = useRef(speed);
  const ignoreSpeechEndRef = useRef(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
    scriptRef.current = script;
    speedRef.current = speed;
  });

  const [owner] = useState(() => ({
    onEnded: () => onEndedRef.current?.(),
    onError: () => startSpeech(),
  }));

  function cancelSpeech() {
    ignoreSpeechEndRef.current = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function startSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !scriptRef.current.trim()) {
      setSupported(false);
      return;
    }
    release();
    window.speechSynthesis.cancel();
    ignoreSpeechEndRef.current = false;
    const utter = new SpeechSynthesisUtterance(scriptRef.current);
    utter.rate = Math.min(0.95 * speedRef.current, 4);
    utter.onend = () => {
      if (ignoreSpeechEndRef.current) return;
      setSpeaking(false);
      const next = onEndedRef.current?.();
      if (typeof next === 'string' && next) playFile(next, owner, true);
    };
    utter.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utter);
  }

  const fileFailed = Boolean(audioSrc && player.failed.includes(audioSrc));
  const useFile = Boolean(audioSrc) && !fileFailed;
  const active = useFile && player.src === audioSrc;
  const playing = active ? player.playing : speaking;

  function toggle() {
    if (!script.trim() && !audioSrc) return;
    if (playing) {
      if (speaking) cancelSpeech();
      else pausePlayer();
      return;
    }
    if (useFile && audioSrc) {
      cancelSpeech();
      playFile(audioSrc, owner);
    } else {
      startSpeech();
    }
  }

  // If this control's track changes while it owns a different playing track (user moved on), pause it.
  useEffect(() => {
    if (isOwner(owner) && player.playing && player.src && audioSrc && player.src !== audioSrc) {
      // A handoff from onEnded sets the player to the new src first, so this only fires on manual moves.
      const next = audioSrc;
      if (next !== player.src) pausePlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc]);

  useEffect(() => {
    setLiveSpeed(speed);
  }, [speed]);

  useEffect(
    () => () => {
      pauseIfOwner(owner);
      ignoreSpeechEndRef.current = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    [owner],
  );

  if (!script.trim() && !audioSrc) return null;
  if (!supported && !useFile) {
    return (
      <span className={`speak-btn speak-btn--unavailable ${className}`.trim()} title="Speech not available in this browser">
        Audio N/A
      </span>
    );
  }

  const stored = hydrated && useFile && audioSrc && !active ? savedPosition(audioSrc) : 0;
  const time = active ? player.time : stored;
  const duration = active ? player.duration || knownDuration(audioSrc ?? '') : knownDuration(audioSrc ?? '');
  const showBar = useFile && (active || stored > 0);
  const max = duration > 0 ? duration : Math.max(time, 1);

  return (
    <span className="speak-group" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
      <button
        type="button"
        className={`speak-btn ${playing ? 'speak-btn--playing' : ''} ${className}`.trim()}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${label}` : time > 0 ? `Resume ${label}` : label}
        title={playing ? 'Pause' : time > 0 ? 'Resume' : label}
      >
        <span className="speak-btn-icon" aria-hidden="true">
          {playing ? '❚❚' : '▶'}
        </span>
        <span className="speak-btn-text">{playing ? 'Pause' : time > 0 ? 'Resume' : 'Play'}</span>
      </button>
      <select
        className="speak-speed-select"
        value={String(speed)}
        onChange={(event) => setSpeed(Number(event.target.value))}
        aria-label={`Playback speed for ${label}`}
        title="Playback speed"
      >
        {PLAYBACK_SPEEDS.map((option) => (
          <option key={option} value={String(option)}>
            {speedLabel(option)}
          </option>
        ))}
      </select>
      {showBar && audioSrc ? (
        <span className="speak-seek">
          <input
            type="range"
            className="speak-seek-range"
            min={0}
            max={max}
            step={0.1}
            value={Math.min(time, max)}
            disabled={!active && duration <= 0}
            onChange={(event) => seek(audioSrc, Number(event.target.value))}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                event.preventDefault();
                seek(audioSrc, Math.max(0, time - SEEK_STEP));
              } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                event.preventDefault();
                seek(audioSrc, Math.min(max, time + SEEK_STEP));
              }
            }}
            aria-label={`Seek ${label}`}
            aria-valuetext={`${formatClock(time)} of ${formatClock(duration)}`}
          />
          <span className="speak-seek-time" aria-hidden="true">
            {formatClock(time)} / {duration > 0 ? formatClock(duration) : '--:--'}
          </span>
        </span>
      ) : null}
    </span>
  );
}
