'use client';

import { useEffect, useRef, useState } from 'react';

type SpeakButtonProps = {
  /** Flowing spoken paragraph (no dashes/colons). Used for Web Speech fallback and aria. */
  script: string;
  /** Optional pre-generated audio file under /public */
  audioSrc?: string;
  label?: string;
  className?: string;
};

/**
 * One-tap play control intended beside a story/section title.
 * Prefers an audio file when provided; otherwise uses Web Speech API.
 */
export default function SpeakButton({ script, audioSrc, label = 'Play audio', className = '' }: SpeakButtonProps) {
  const [playing, setPlaying] = useState(false);
  const [supported, setSupported] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopAll() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    utterRef.current = null;
    setPlaying(false);
  }

  function playFile(src: string) {
    stopAll();
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.onended = () => setPlaying(false);
    audio.onerror = () => {
      setPlaying(false);
      playSpeech();
    };
    void audio.play().then(() => setPlaying(true)).catch(() => playSpeech());
  }

  function playSpeech() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSupported(false);
      return;
    }
    stopAll();
    const utter = new SpeechSynthesisUtterance(script);
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onend = () => setPlaying(false);
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

  if (!script.trim() && !audioSrc) return null;
  if (!supported && !audioSrc) {
    return (
      <span className={`speak-btn speak-btn--unavailable ${className}`.trim()} title="Speech not available in this browser">
        Audio N/A
      </span>
    );
  }

  return (
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
  );
}
