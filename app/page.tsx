'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { shuffleWords, watWords } from './words';
import type { Word } from './words';

const SECTION_SIZES = [75, 50, 50] as const;
const BREAK_SECONDS = 30;

type Phase = 'setup' | 'word' | 'break' | 'finished';

function getSectionForWord(wordIndex: number) {
  let lastWord = 0;
  for (let index = 0; index < SECTION_SIZES.length; index += 1) {
    lastWord += SECTION_SIZES[index];
    if (wordIndex < lastWord) return index;
  }
  return SECTION_SIZES.length - 1;
}

export default function WATPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState('');
  const [wordTimeInput, setWordTimeInput] = useState('10');
  const [secondsPerWord, setSecondsPerWord] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10);
  const [phase, setPhase] = useState<Phase>('setup');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isSaving = useRef(false);

  const totalWords = SECTION_SIZES.reduce((total, size) => total + size, 0);
  const section = getSectionForWord(currentIndex);
  const sectionStart = SECTION_SIZES.slice(0, section).reduce((total, size) => total + size, 0);
  const sectionProgress = currentIndex - sectionStart + 1;
  const completedCount = sentences.filter(Boolean).length;

  const startTest = useCallback(() => {
    const enteredTime = Number.parseInt(wordTimeInput, 10);
    const selectedTime = Number.isFinite(enteredTime) && enteredTime > 0 ? enteredTime : 10;
    const session = shuffleWords(watWords).slice(0, totalWords);

    setWords(session);
    setCurrentIndex(0);
    setSentences([]);
    setCurrentSentence('');
    setSecondsPerWord(selectedTime);
    setTimeLeft(selectedTime);
    setPhase('word');
    isSaving.current = false;
  }, [totalWords, wordTimeInput]);

  useEffect(() => {
    if (phase !== 'word' && phase !== 'break') return;
    const interval = window.setInterval(() => setTimeLeft((previous) => Math.max(0, previous - 1)), 1000);
    return () => window.clearInterval(interval);
  }, [phase]);

  const advanceToNextWord = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= words.length) {
      setPhase('finished');
      return;
    }

    const nextSection = getSectionForWord(nextIndex);
    setCurrentIndex(nextIndex);
    setCurrentSentence('');
    if (nextSection !== section) {
      setTimeLeft(BREAK_SECONDS);
      setPhase('break');
    } else {
      setTimeLeft(secondsPerWord);
    }
  }, [currentIndex, section, secondsPerWord, words.length]);

  const saveAndNext = useCallback(() => {
    if (phase !== 'word' || isSaving.current || !words.length) return;
    isSaving.current = true;
    setSentences((previous) => {
      const next = [...previous];
      next[currentIndex] = currentSentence.trim();
      return next;
    });
    advanceToNextWord();
    window.setTimeout(() => { isSaving.current = false; }, 0);
  }, [advanceToNextWord, currentIndex, currentSentence, phase, words.length]);

  useEffect(() => {
    if (timeLeft !== 0) return;
    if (phase === 'word') {
      const timeout = window.setTimeout(saveAndNext, 0);
      return () => window.clearTimeout(timeout);
    }
    if (phase === 'break') {
      const timeout = window.setTimeout(() => {
        setPhase('word');
        setTimeLeft(secondsPerWord);
      }, 0);
      return () => window.clearTimeout(timeout);
    }
  }, [phase, saveAndNext, secondsPerWord, timeLeft]);

  useEffect(() => {
    if (phase === 'word') textareaRef.current?.focus();
  }, [currentIndex, phase]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveAndNext();
    }
  };

  const sessionStats = useMemo(() => [
    ['75', 'words · section 1'],
    ['50', 'words · section 2'],
    ['50', 'words · section 3'],
  ], []);

  if (phase === 'setup') {
    return (
      <main className="wat-shell min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-5xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">ISSB psychology practice</p>
            <h1 className="max-w-xl text-5xl font-black tracking-tight text-white sm:text-6xl">Write with clarity under time.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">A focused Word Association Test that lets you set a comfortable pace, then gradually build your speed across three timed sections.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {sessionStats.map(([value, label], index) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">Part {index + 1}</p>
                  <p className="mt-2 text-3xl font-black text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-cyan-300/15 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/40 backdrop-blur sm:p-8">
            <p className="text-sm font-semibold text-cyan-200">Set your own pace</p>
            <h2 className="mt-2 text-3xl font-bold text-white">How long should each word stay up?</h2>
            <label className="mt-7 block" htmlFor="word-time">
              <span className="mb-2 block text-sm font-medium text-slate-300">Seconds per word</span>
              <div className="flex items-center rounded-2xl border border-slate-600 bg-slate-900 px-4 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20">
                <input id="word-time" type="number" min="1" step="1" inputMode="numeric" value={wordTimeInput} onChange={(event) => setWordTimeInput(event.target.value)} className="w-full bg-transparent py-4 text-3xl font-bold text-white outline-none" aria-describedby="word-time-help" />
                <span className="text-sm font-medium text-slate-400">seconds</span>
              </div>
              <span id="word-time-help" className="mt-2 block text-sm text-slate-500">Choose any whole-number limit that works for you.</span>
            </label>
            <div className="my-7 border-t border-slate-800" />
            <div className="space-y-3 text-sm leading-6 text-slate-400">
              <p><span className="font-semibold text-white">175 words total.</span> The test is split into 75, 50, and 50-word sections.</p>
              <p>A 30-second countdown appears after Parts 1 and 2, then the next part starts automatically.</p>
              <p>Press Enter to submit early, or let the timer save your response and move on.</p>
            </div>
            <button type="button" onClick={startTest} className="mt-8 w-full rounded-2xl bg-cyan-400 px-6 py-4 text-base font-extrabold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950">Start WAT practice</button>
          </section>
        </div>
      </main>
    );
  }

  if (phase === 'break') {
    return (
      <main className="wat-shell min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-2xl items-center justify-center text-center">
          <section className="w-full rounded-[2rem] border border-amber-300/20 bg-slate-950/70 p-8 shadow-2xl shadow-amber-950/30 backdrop-blur sm:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-300">Part {section} complete</p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl">Take a breath.</h1>
            <p className="mx-auto mt-4 max-w-md text-lg leading-7 text-slate-300">Part {section + 1} starts automatically when the countdown reaches zero.</p>
            <div className="mx-auto mt-9 flex h-40 w-40 items-center justify-center rounded-full border-8 border-amber-400/90 bg-amber-400/10 text-6xl font-black tabular-nums text-white shadow-[0_0_60px_rgba(251,191,36,0.2)]">{timeLeft}</div>
            <p className="mt-5 text-sm font-medium text-amber-100">seconds to get ready</p>
          </section>
        </div>
      </main>
    );
  }

  if (phase === 'finished') {
    return (
      <main className="wat-shell min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 rounded-[2rem] border border-emerald-300/20 bg-slate-950/70 p-8 text-center shadow-2xl shadow-emerald-950/20 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Practice complete</p>
            <h1 className="mt-3 text-4xl font-black text-white">Your WAT responses</h1>
            <p className="mt-3 text-slate-300">{completedCount} of {words.length} responses saved · {secondsPerWord}s per word</p>
          </header>
          <div className="space-y-3">
            {words.map((word, index) => (
              <article key={word.id} className="flex gap-4 rounded-2xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur">
                <span className="w-8 pt-0.5 text-right font-mono text-sm text-slate-500">{index + 1}</span>
                <div className="min-w-0 flex-1"><p className="font-bold tracking-wide text-cyan-300">{word.word}</p><p className="mt-1 text-slate-200">{sentences[index] || <span className="italic text-slate-500">No response</span>}</p></div>
              </article>
            ))}
          </div>
          <button type="button" onClick={() => setPhase('setup')} className="my-8 w-full rounded-2xl bg-cyan-400 px-6 py-4 font-extrabold text-slate-950 transition hover:bg-cyan-300">Set a new practice pace</button>
        </div>
      </main>
    );
  }

  const currentWord = words[currentIndex];
  const overallProgress = ((currentIndex + 1) / words.length) * 100;
  const clockProgress = (timeLeft / secondsPerWord) * 100;
  return (
    <main className="wat-shell min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-4xl items-center">
        <div className="w-full">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Part {section + 1} of 3 · word {sectionProgress} of {SECTION_SIZES[section]}</p><p className="mt-2 text-lg font-semibold text-white">Word {currentIndex + 1} <span className="font-normal text-slate-400">of {words.length}</span></p></div>
            <div className="flex items-center gap-3"><div className="text-right text-sm text-slate-400"><p className="font-semibold text-white">{secondsPerWord}s limit</p><p>auto-saves at zero</p></div><div className={timeLeft <= 3 ? 'flex h-16 w-16 items-center justify-center rounded-full border-4 border-rose-400 bg-rose-400/10 text-2xl font-black tabular-nums text-rose-200' : 'flex h-16 w-16 items-center justify-center rounded-full border-4 border-cyan-400 bg-cyan-400/10 text-2xl font-black tabular-nums text-white'}>{timeLeft}</div></div>
          </header>
          <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400 transition-all" style={{ width: `${overallProgress}%` }} /></div>
          <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-950/65 p-8 text-center shadow-2xl shadow-cyan-950/30 backdrop-blur sm:p-14"><p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Respond naturally</p><h1 className="mt-5 break-words text-5xl font-black tracking-wide text-white sm:text-7xl">{currentWord.word}</h1><p className="mt-5 text-sm text-slate-400">Write one clear, authentic sentence before time runs out.</p></section>
          <section className="mt-5 rounded-[1.5rem] border border-white/10 bg-slate-950/75 p-5 shadow-xl backdrop-blur sm:p-6"><textarea ref={textareaRef} value={currentSentence} onChange={(event) => setCurrentSentence(event.target.value)} onKeyDown={handleKeyDown} placeholder={`Write a sentence with “${currentWord.word}”...`} className="min-h-36 w-full resize-none bg-transparent text-lg leading-8 text-white outline-none placeholder:text-slate-500" autoFocus /><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4"><p className="text-sm text-slate-400"><kbd className="rounded border border-slate-600 px-1.5 py-0.5 text-xs text-slate-300">Enter</kbd> submit early · {currentSentence.length} characters</p><button type="button" onClick={saveAndNext} className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-extrabold text-slate-950 transition hover:bg-cyan-300">Save & next</button></div></section>
          <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className={timeLeft <= 3 ? 'h-full bg-rose-400 transition-all duration-1000' : 'h-full bg-emerald-400 transition-all duration-1000'} style={{ width: `${clockProgress}%` }} /></div>
        </div>
      </div>
    </main>
  );
}
