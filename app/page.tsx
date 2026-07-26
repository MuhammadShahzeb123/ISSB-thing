'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getTimerForWord, shuffleWords, watWords } from './words';
import type { Word } from './words';

const TEST_SIZE = 200;

function getRandomTime(): number {
  return Math.floor(Math.random() * 3) + 7;
}

export default function WATPage() {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSessionIds = useRef<Set<number>>(new Set());
  const isSaving = useRef(false);

  const startTest = useCallback(() => {
    let shuffled = shuffleWords(watWords);
    let attempts = 0;

    while (
      lastSessionIds.current.size > 0 &&
      shuffled.slice(0, TEST_SIZE).every((word) => lastSessionIds.current.has(word.id)) &&
      attempts < 8
    ) {
      shuffled = shuffleWords(watWords);
      attempts += 1;
    }

    const session = shuffled.slice(0, TEST_SIZE);
    lastSessionIds.current = new Set(session.map((word) => word.id));
    const firstTime = getRandomTime();

    setShuffledWords(session);
    setCurrentIndex(0);
    setSentences([]);
    setCurrentSentence('');
    setIsFinished(false);
    setIsStarted(true);
    setTimeLimit(firstTime);
    setTimeLeft(firstTime);
    isSaving.current = false;
  }, []);

  useEffect(() => {
    if (!isStarted || isFinished) return;

    const interval = window.setInterval(() => {
      setTimeLeft((previous) => Math.max(previous - 1, 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isStarted, isFinished]);

  const saveAndNext = useCallback(() => {
    if (isSaving.current || !shuffledWords.length) return;
    isSaving.current = true;

    setSentences((previous) => {
      const next = [...previous];
      next[currentIndex] = currentSentence.trim();
      return next;
    });

    setCurrentSentence('');

    if (currentIndex >= shuffledWords.length - 1) {
      setIsFinished(true);
    } else {
      const nextIndex = currentIndex + 1;
      const nextTime = getTimerForWord(nextIndex);
      setCurrentIndex(nextIndex);
      setTimeLimit(nextTime);
      setTimeLeft(nextTime);
    }

    window.setTimeout(() => {
      isSaving.current = false;
    }, 0);
  }, [currentIndex, currentSentence, shuffledWords.length]);

  useEffect(() => {
    if (timeLeft !== 0 || isFinished) return;
    const timeout = window.setTimeout(saveAndNext, 0);
    return () => window.clearTimeout(timeout);
  }, [timeLeft, isFinished, saveAndNext]);

  useEffect(() => {
    if (isStarted && !isFinished && shuffledWords.length > 0) {
      textareaRef.current?.focus();
    }
  }, [currentIndex, isFinished, isStarted, shuffledWords.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveAndNext();
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
          <div className="w-full text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">ISSB psychology practice</p>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">Word Association Test</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-400">
              A fresh 200-word session from a larger pool. Each word stays on screen for 8–12 seconds so you can practise fast, natural sentence formation.
            </p>
            <div className="mb-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                ['200', 'words per session'],
                ['8–12s', 'random time per word'],
                ['493', 'words in the pool'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <h2 className="mb-4 font-semibold text-white">Practice cues</h2>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>• Read the word, form your own response, and write one natural sentence.</li>
                <li>• Keep the response authentic and constructive; do not force a memorised line.</li>
                <li>• Press Enter to submit early, or let the timer advance automatically.</li>
                <li>• Review your responses at the end for clarity, grammar, and consistency.</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={startTest}
              className="rounded-xl bg-cyan-500 px-10 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400"
            >
              Start 200-word test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Session complete</p>
            <h2 className="mb-2 text-4xl font-bold text-white">Your WAT responses</h2>
            <p className="text-slate-400">200 words completed. Look for natural, action-oriented responses rather than perfect phrases.</p>
          </div>
          <div className="space-y-3">
            {shuffledWords.map((word, index) => (
              <div key={word.id} className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
                <div className="flex items-start gap-4">
                  <span className="min-w-8 font-mono text-sm text-slate-600">{index + 1}.</span>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-cyan-300">{word.word}</span>
                    <p className="mt-1 text-slate-300">
                      {sentences[index] || <span className="italic text-slate-600">No response</span>}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={startTest}
            className="mt-8 w-full rounded-xl bg-cyan-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Start a different 200-word session
          </button>
        </div>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;
  const timerProgress = (timeLeft / timeLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center">
        <div className="w-full">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Word {currentIndex + 1} of {shuffledWords.length}</p>
              <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800 sm:w-64">
                <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: progress + '%' }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">Time left</span>
              <div className={timeLeft <= 2 ? 'relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-500 text-red-400' : 'relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-500 text-white'}>
                <span className="text-xl font-bold">10</span>
                <span className="absolute -bottom-5 text-[10px] text-slate-600">10s window</span>
              </div>
            </div>
          </div>

          <div className="mb-5 rounded-3xl border border-cyan-900/60 bg-cyan-950/20 p-10 text-center shadow-2xl shadow-cyan-950/20 md:p-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">Respond naturally</p>
            <h2 className="text-6xl font-black tracking-wide text-white md:text-8xl">{currentWord.word}</h2>
            <p className="mt-5 text-sm text-slate-500">Make a sentence before the countdown ends.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <textarea
              ref={textareaRef}
              value={currentSentence}
              onChange={(event) => setCurrentSentence(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={'Write a sentence with “' + currentWord.word + '”...'}
              className="min-h-32 w-full resize-none bg-transparent text-xl leading-relaxed text-white outline-none placeholder:text-slate-700"
              autoFocus
            />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500">Press Enter to save & next</span>
                <span className="text-xs text-slate-600">{currentSentence.length} chars</span>
              </div>
              <button
                type="button"
                onClick={saveAndNext}
                className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Save & next
              </button>
            </div>
          </div>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-800">
            <div className={timeLeft <= 2 ? 'h-full bg-red-500 transition-all duration-1000' : 'h-full bg-emerald-500 transition-all duration-1000'} style={{ width: timerProgress + '%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
