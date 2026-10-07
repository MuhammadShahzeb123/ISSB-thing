'use client';

import { useEffect, useRef, useState } from 'react';
import { PLAYBACK_SPEEDS, applyPlaybackSpeed, speedLabel, usePlaybackSpeed } from '../lib/playbackSpeed';

type SpeakButtonProps = {
  /** Flowing spoken paragraph (no dashes/colons). Used for Web Speech fallback and aria. */
  script: string;
  /** Optional pre-generated audio file under /public */
  audioSrc?: string;
  label?: string;
  className?: string;
  /**
   * Called only when narration actually finishes (audio `ended`, or speech fallback `onend`).
   * Not called when the user stops, pauses, or the control unmounts.
   * Return the next audio URL to keep playing on the same element (autoplay continuation).
   */
  onEnded?: () => string | void;
};

/**
 * One-tap play control intended beside a story/section title.
 * Prefers an audio file when provided; otherwise uses Web Speech API.
 */
export default function SpeakButton({
  script,
  audioSrc,
  label = 'Play audio',
  className = '',
  onEnded,
}: SpeakButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndedRef = useRef(onEnded);
  const ignoreEndRef = useRef(false);
  const activeSrcRef = useRef<string | null>(null);
  const audioSrcRef = useRef(audioSrc);
  const scriptRef = useRef(script);
  const [speed, setSpeed] = usePlaybackSpeed();
  const speedRef = useRef(speed);
  speedRef.current = speed;

  onEndedRef.current = onEnded;
  audioSrcRef.current = audioSrc;
  scriptRef.current = script;

  function cancelSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utterRef.current = null;
  }

  function stopAll() {
    ignoreEndRef.current = true;
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audioRef.current = null;
    }
    cancelSpeech();
    activeSrcRef.current = null;
    setPlaying(false);
  }

  function continueWith(nextSrc: string) {
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    ignoreEndRef.current = true;
    audio.onended = handleFileEnded;
    audio.onerror = handleFileError;
    activeSrcRef.current = nextSrc;
    audio.src = nextSrc;
    applyPlaybackSpeed(audio, speedRef.current);
    ignoreEndRef.current = false;
    setPlaying(true);
    void audio.play().catch(() => setPlaying(false));
  }

  function handleFileEnded() {
    if (ignoreEndRef.current) return;
    const nextSrc = onEndedRef.current?.();
    if (typeof nextSrc === 'string' && nextSrc) {
      continueWith(nextSrc);
      return;
    }
    setPlaying(false);
  }

  function handleFileError() {
    if (ignoreEndRef.current) return;
    setPlaying(false);
    playSpeech();
  }

  function playFile(src: string) {
    ignoreEndRef.current = true;
    cancelSpeech();
    ignoreEndRef.current = false;
    continueWith(src);
  }

  function playSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !scriptRef.current.trim()) {
      setSupported(false);
      return;
    }
    ignoreEndRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
    }
    cancelSpeech();
    ignoreEndRef.current = false;
    activeSrcRef.current = audioSrcRef.current ? `speech:${audioSrcRef.current}` : 'speech';
    const utter = new SpeechSynthesisUtterance(scriptRef.current);
    utter.rate = Math.min(0.95 * speedRef.current, 4);
    utter.pitch = 1;
    utter.onend = () => {
      if (ignoreEndRef.current) return;
      const nextSrc = onEndedRef.current?.();
      if (typeof nextSrc === 'string' && nextSrc) {
        playFile(nextSrc);
        return;
      }
      setPlaying(false);
    };
    utter.onerror = () => setPlaying(false);
    utterRef.current = utter;
    setPlaying(true);
    window.speechSynthesis.speak(utter);
  }

  function toggle() {
    if (!script.trim() && !audioSrc) return;
    if (playing) {
      stopAll();
      return;
    }
    if (audioSrc) playFile(audioSrc);
    else playSpeech();
  }

  useEffect(() => {
    if (activeSrcRef.current && audioSrc && activeSrcRef.current !== audioSrc) {
      stopAll();
    }
    // Stop leftover audio if the story changes without a playback handoff.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioSrc]);

  // Change speed live on the playing file. Speech fallback picks it up on the next utterance.
  useEffect(() => {
    if (audioRef.current) applyPlaybackSpeed(audioRef.current, speed);
  }, [speed]);

  useEffect(() => {
    return () => {
      ignoreEndRef.current = true;
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!script.trim() && !audioSrc) return null;
  if (!supported && !audioSrc) {
    return (
      <span className={`speak-btn speak-btn--unavailable ${className}`.trim()} title="Speech not available in this browser">
        Audio N/A
      </span>
    );
  }

  return (
    <span className="speak-group">
      <button
        type="button"
        className={`speak-btn ${playing ? 'speak-btn--playing' : ''} ${className}`.trim()}
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Stop ${label}` : label}
        title={playing ? 'Stop' : label}
      >
        <span className="speak-btn-icon" aria-hidden="true">
          {playing ? '■' : '▶'}
        </span>
        <span className="speak-btn-text">{playing ? 'Stop' : 'Play'}</span>
      </button>
      <select
        className="speak-speed-select"
        value={String(speed)}
        onChange={(event) => setSpeed(Number(event.target.value))}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
        aria-label={`Playback speed for ${label}`}
        title="Playback speed"
      >
        {PLAYBACK_SPEEDS.map((option) => (
          <option key={option} value={String(option)}>
            {speedLabel(option)}
          </option>
        ))}
      </select>
    </span>
  );
}
