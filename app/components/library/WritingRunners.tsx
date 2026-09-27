'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { LibrarySet } from '../../lib/library';
import { useCountdown, useLibraryProgress } from '../../lib/libraryProgress';
import { downloadText, formatClock } from '../../lib/practice';
import { RollingNumber } from '../motion/RollingNumber';
import { Segmented } from '../motion/Segmented';
import { Swap } from '../motion/Swap';
import { Toggle } from '../motion/Toggle';
import { stagger } from '../motion/stagger';
import { useLiquidInk } from '../motion/useLiquidInk';
import { Clock, ProgressBar, dirFor, useToast, wordCount } from './shared';

export interface RunnerProps {
  set: LibrarySet;
  pKey: string;
  next?: { href: string; title: string };
}

export function FinishActions({ onRestart, next, onDownload }: { onRestart?: () => void; next?: RunnerProps['next']; onDownload?: () => void }) {
  return (
    <div className="prep-actions" style={{ marginTop: '1rem' }}>
      {onRestart && <button type="button" className="prep-button prep-button-secondary" onClick={onRestart}>Try this set again</button>}
      {onDownload && <button type="button" className="prep-button prep-button-secondary" onClick={onDownload}>Download my answers</button>}
      {next && <Link href={next.href} className="prep-button">Next: {next.title} →</Link>}
    </div>
  );
}

/** Numbered dots for every stem, with one ink block that slides to the current one. */
function StemDots({ answers, index, onGo }: { answers: string[]; index: number; onGo: (to: number) => void }) {
  const { container, ink } = useLiquidInk({ target: String(index) });
  return (
    <div ref={container} className="lib-dots" aria-label="Jump to a stem">
      <span ref={ink} className="liquid-ink" aria-hidden />
      {answers.map((answer, i) => (
        <button key={i} type="button" data-ink={String(i)} className={`${answer.trim() ? 'is-filled' : ''}${i === index ? ' is-current' : ''}`} onClick={() => onGo(i)} aria-label={`Stem ${i + 1}${answer.trim() ? ', answered' : ''}`} aria-current={i === index ? 'step' : undefined}>{i + 1}</button>
      ))}
    </div>
  );
}

/* ---------------- Sentence completion ---------------- */

export function SentenceRunner({ set, pKey, next }: RunnerProps) {
  const total = set.seconds ?? 360;
  const count = set.items.length;
  const [phase, setPhase] = useState<'ready' | 'running' | 'review'>('ready');
  const [timed, setTimed] = useState(true);
  const [answers, setAnswers] = useState<string[]>(() => set.items.map(() => ''));
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [usedSeconds, setUsedSeconds] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const input = useRef<HTMLInputElement>(null);
  const { update } = useLibraryProgress();
  const { show, toast } = useToast();

  // Seconds the countdown has consumed, so paused time is not counted.
  const clockLeft = useRef(total);
  const finish = useCallback((reason?: string) => {
    setPhase('review');
    const used = timed ? Math.round(total - clockLeft.current) : Math.round((Date.now() - startedAt) / 1000);
    setUsedSeconds(used);
    const done = answers.flatMap((answer, i) => (answer.trim() ? [i] : []));
    update(pKey, count, () => ({ done, completedAt: Date.now(), lastResult: `${done.length}/${count} in ${formatClock(used)}` }));
    if (reason) show(reason);
  }, [answers, count, pKey, show, startedAt, timed, total, update]);

  const clock = useCountdown(total, () => finish('Time is up. Here is your review.'));
  useEffect(() => { clockLeft.current = clock.left; }, [clock.left]);

  useEffect(() => { if (phase === 'running') input.current?.focus(); }, [index, phase]);

  const start = () => {
    setAnswers(set.items.map(() => ''));
    setIndex(0);
    setStartedAt(Date.now());
    setPhase('running');
    if (timed) clock.restart(total);
    update(pKey, count, (current) => ({ done: current.done }));
  };

  const go = (to: number) => {
    if (to >= count) { clock.pause(); finish(); return; }
    setDirection(to > index ? 'left' : 'right');
    setIndex(Math.max(0, to));
  };

  const answered = answers.filter((answer) => answer.trim()).length;
  const elapsed = total - clock.left;
  const expected = Math.floor((elapsed / total) * count);
  const behind = timed && phase === 'running' && elapsed > 20 && answered < expected - 1;
  const item = set.items[index];
  const empty = count - answered;

  return (
    <>
      <div className="lib-stage">
        <Swap id={phase}>
          {phase === 'ready' && (
            <>
              <p className="lib-kicker">{count} stems · {formatClock(total)} for the whole set</p>
              <h2 className="lib-prompt" style={{ marginTop: '0.5rem' }}>Ready when you are.</h2>
              <p style={{ lineHeight: 1.7, maxWidth: '40rem' }}>One stem appears at a time. Type your ending and press <kbd className="lib-kbd">Enter</kbd> to move on. Green dots show finished stems; tap any dot to go back. Go with your first natural thought.</p>
              <div className="prep-actions" style={{ marginTop: '1.2rem' }}>
                <button type="button" className="prep-button" onClick={start} autoFocus>Start {timed ? `${formatClock(total)} test` : 'untimed practice'}</button>
                <Toggle checked={!timed} onChange={(untimed) => setTimed(!untimed)}>Practise without the clock</Toggle>
              </div>
            </>
          )}

          {phase === 'review' && (
            <>
              <p className="lib-kicker">Review</p>
              <h2 className="lib-prompt" style={{ marginTop: '0.3rem' }}>{answered === count ? 'Every stem finished.' : `${answered} of ${count} finished.`}</h2>
              <div className="lib-score stagger">
                <div style={stagger(0)}><strong>{answered}/{count}</strong><span>completed</span></div>
                <div style={stagger(1)}><strong>{formatClock(usedSeconds)}</strong><span>time used</span></div>
                <div style={stagger(2)}><strong>{answered ? Math.round(usedSeconds / answered) : 0}s</strong><span>per stem</span></div>
              </div>
              {empty > 0 && <div className="prep-note">{empty} {empty === 1 ? 'stem was' : 'stems were'} left blank (highlighted). On test day, a short ending beats a blank line. Try to keep your pace near {Math.round(total / count)} seconds per stem.</div>}
              <ol className="lib-review stagger">
                {set.items.map((stem, i) => (
                  <li key={i} style={stagger(i + 3)} className={answers[i].trim() ? '' : 'is-empty'} lang={set.language} dir={dirFor(set.language)}>
                    <span className="lib-review-stem">{i + 1}. {stem.prompt}</span>{' '}
                    <span className="lib-review-answer">{answers[i].trim() || '—'}</span>
                  </li>
                ))}
              </ol>
              <FinishActions onRestart={() => setPhase('ready')} next={next} onDownload={() => downloadText(`${set.id}.txt`, set.items.map((stem, i) => `${i + 1}. ${stem.prompt} ${answers[i]}`).join('\n'))} />
            </>
          )}

          {phase === 'running' && (
            <>
              <div className="lib-stage-head">
                <span className="lib-counter"><RollingNumber value={String(index + 1)} /> / {count}</span>
                {timed ? <Clock left={clock.left} total={total} /> : <span className="lib-chip">Untimed</span>}
              </div>
              <ProgressBar value={answered / count} label="Stems completed" />
              <p className="lib-bar-label"><span><RollingNumber value={String(answered)} /> done</span><span aria-live="polite">{behind ? 'Behind pace: keep endings short' : timed && elapsed > 20 ? 'On pace ✓' : ''}</span></p>
              <form onSubmit={(event) => { event.preventDefault(); go(index + 1); }}>
                {/* The stem swaps in place; the input stays so focus and typing are never interrupted. */}
                <Swap id={index} dir={direction} morph="none">
                  <label htmlFor="stem-answer" className="lib-prompt" lang={set.language} dir={dirFor(set.language)} style={{ display: 'block' }}>{item.prompt} …</label>
                </Swap>
                <input
                  ref={input}
                  id="stem-answer"
                  className="lib-input"
                  dir={dirFor(set.language)}
                  lang={set.language}
                  value={answers[index]}
                  autoComplete="off"
                  onChange={(event) => setAnswers((current) => current.map((answer, i) => (i === index ? event.target.value : answer)))}
                  onKeyDown={(event) => { if (event.key === 'ArrowUp' && index > 0) { event.preventDefault(); go(index - 1); } }}
                  placeholder={set.language === 'ur' ? 'جملہ مکمل کریں…' : 'Complete the sentence…'}
                />
                <p className="lib-hint"><span><kbd className="lib-kbd">Enter</kbd> next</span><span><kbd className="lib-kbd">↑</kbd> previous</span></p>
                <div className="prep-actions" style={{ marginTop: '1rem' }}>
                  <button type="button" className="prep-button prep-button-secondary" onClick={() => go(index - 1)} disabled={index === 0}>← Back</button>
                  <button type="submit" className="prep-button">{index === count - 1 ? 'Finish & review' : 'Next →'}</button>
                  {timed && <button type="button" className="prep-button prep-button-secondary" onClick={() => (clock.running ? clock.pause() : clock.start())}><Swap id={clock.running ? 'pause' : 'resume'} morph="width" inline>{clock.running ? 'Pause' : 'Resume'}</Swap></button>}
                  <button type="button" className="prep-button prep-button-secondary" onClick={() => { clock.pause(); finish(); }}>End now</button>
                </div>
              </form>
              <StemDots answers={answers} index={index} onGo={go} />
            </>
          )}
        </Swap>
      </div>
      {toast}
    </>
  );
}

/* ---------------- Word association ---------------- */

const WAT_SPEEDS = [
  { value: 10, label: '10s per word' },
  { value: 15, label: '15s per word' },
  { value: 0, label: 'No timer' },
] as const;

export function WatRunner({ set, pKey, next }: RunnerProps) {
  const [phase, setPhase] = useState<'ready' | 'running' | 'review'>('ready');
  const [speed, setSpeed] = useState<(typeof WAT_SPEEDS)[number]['value']>(10);
  const [length, setLength] = useState<25 | 50 | 0>(0);
  const [words, setWords] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const indexRef = useRef(0);
  const { update } = useLibraryProgress();
  const { show, toast } = useToast();

  const lengthOptions = [
    { value: 25 as const, label: '25 words' },
    { value: 50 as const, label: '50 words' },
    { value: 0 as const, label: `All ${set.items.length}` },
  ];

  const finish = useCallback((finalAnswers: string[], finalWords: string[]) => {
    setPhase('review');
    const done = finalAnswers.flatMap((answer, i) => (answer.trim() ? [set.items.findIndex((item) => item.prompt === finalWords[i])] : [])).filter((i) => i >= 0);
    update(pKey, set.items.length, (current) => ({ done: [...new Set([...current.done, ...done])], completedAt: Date.now(), lastResult: `${done.length}/${finalWords.length} words` }));
  }, [pKey, set.items, update]);

  const advanceRef = useRef<() => void>(() => {});
  const clock = useCountdown(speed || 1, () => advanceRef.current());

  const advance = useCallback(() => {
    const nextIndex = indexRef.current + 1;
    if (nextIndex >= words.length) {
      clock.pause();
      finish(answers, words);
      return;
    }
    indexRef.current = nextIndex;
    setIndex(nextIndex);
    if (speed) clock.restart(speed);
  }, [answers, clock, finish, speed, words]);
  useEffect(() => { advanceRef.current = advance; }, [advance]);

  useEffect(() => { if (phase === 'running') input.current?.focus(); }, [index, phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && speed) { event.preventDefault(); if (clock.running) { clock.pause(); show('Paused'); } else clock.start(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clock, phase, show, speed]);

  const start = () => {
    const pool = set.items.map((item) => item.prompt);
    const chosen = length ? pool.slice(0, length) : pool;
    setWords(chosen);
    setAnswers(chosen.map(() => ''));
    indexRef.current = 0;
    setIndex(0);
    setPhase('running');
    if (speed) clock.restart(speed);
  };

  const answered = answers.filter((answer) => answer.trim()).length;
  const long = answers.filter((answer) => wordCount(answer) > 12).length;

  return (
    <>
      <div className="lib-stage">
        <Swap id={phase}>
          {phase === 'ready' && (
            <>
              <p className="lib-kicker">{set.items.length} words on this page</p>
              <h2 className="lib-prompt" style={{ marginTop: '0.5rem' }}>Set your pace.</h2>
              <p style={{ lineHeight: 1.7, maxWidth: '42rem' }}>The ISSB schedule in the notes gives <strong>10 seconds per word</strong>. Each word moves on by itself; press <kbd className="lib-kbd">Enter</kbd> to go early, or <kbd className="lib-kbd">Esc</kbd> to pause.</p>
              <div className="lib-toolbar" style={{ justifyContent: 'flex-start' }}>
                <Segmented options={WAT_SPEEDS} value={speed} onChange={setSpeed} label="Seconds per word" />
                <Segmented options={lengthOptions} value={length} onChange={setLength} label="Number of words" />
              </div>
              <button type="button" className="prep-button" onClick={start} autoFocus>Start</button>
            </>
          )}

          {phase === 'review' && (
            <>
              <p className="lib-kicker">Review</p>
              <h2 className="lib-prompt" style={{ marginTop: '0.3rem' }}>{answered} of {words.length} words answered.</h2>
              <div className="lib-score stagger">
                <div style={stagger(0)}><strong>{answered}/{words.length}</strong><span>answered</span></div>
                <div style={stagger(1)}><strong>{words.length - answered}</strong><span>missed</span></div>
                <div style={stagger(2)}><strong>{answered ? Math.round(answers.reduce((sum, answer) => sum + wordCount(answer), 0) / answered) : 0}</strong><span>words per sentence</span></div>
              </div>
              {long > 0 && <div className="prep-note">{long} {long === 1 ? 'sentence is' : 'sentences are'} over 12 words. Short sentences are easier to finish in time.</div>}
              <ol className="lib-review stagger">
                {words.map((word, i) => (
                  <li key={i} style={stagger(i + 3)} className={answers[i]?.trim() ? '' : 'is-empty'}><span className="lib-review-stem">{word}</span> — <span className="lib-review-answer">{answers[i]?.trim() || 'no sentence'}</span></li>
                ))}
              </ol>
              <FinishActions onRestart={() => setPhase('ready')} next={next} onDownload={() => downloadText(`${set.id}.txt`, words.map((word, i) => `${word}: ${answers[i] ?? ''}`).join('\n'))} />
            </>
          )}

          {phase === 'running' && (
            <>
              <div className="lib-stage-head">
                <span className="lib-counter"><RollingNumber value={String(index + 1)} /> / {words.length}</span>
                {speed ? <Clock left={clock.left} total={speed} label="Time for this word" /> : <span className="lib-chip">No timer</span>}
              </div>
              <ProgressBar value={index / words.length} label="Words completed" />
              <form onSubmit={(event) => { event.preventDefault(); advance(); }}>
                <Swap id={index} morph="none">
                  <label htmlFor="wat-answer" className="lib-prompt lib-prompt--word" style={{ display: 'block' }}>{words[index]}</label>
                </Swap>
                <input
                  ref={input}
                  id="wat-answer"
                  className="lib-input"
                  value={answers[index] ?? ''}
                  autoComplete="off"
                  onChange={(event) => setAnswers((current) => current.map((answer, i) => (i === index ? event.target.value : answer)))}
                  placeholder="Write one short sentence…"
                />
                <p className="lib-hint"><span><kbd className="lib-kbd">Enter</kbd> next word</span>{speed > 0 && <span><kbd className="lib-kbd">Esc</kbd> {clock.running ? 'pause' : 'resume'}</span>}{!clock.running && speed > 0 && <strong style={{ color: '#b3261e' }}>Paused</strong>}</p>
                <div className="prep-actions" style={{ marginTop: '1rem' }}>
                  <button type="submit" className="prep-button">Next word →</button>
                  <button type="button" className="prep-button prep-button-secondary" onClick={() => { clock.pause(); finish(answers, words); }}>End now</button>
                </div>
              </form>
            </>
          )}
        </Swap>
      </div>
      {toast}
    </>
  );
}
