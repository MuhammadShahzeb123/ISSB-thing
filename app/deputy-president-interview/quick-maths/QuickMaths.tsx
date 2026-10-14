'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  generateQuestion,
  isCorrect,
  QUICK_TOPICS,
  type QuickQuestion,
  type QuickTopic,
} from '../../lib/quick-maths/generators';

const TIME_OPTIONS = [3, 4, 5, 7, 10, 15, 0] as const; // 0 = untimed
const LENGTH_OPTIONS = [10, 20, 30, 0] as const; // 0 = endless
const TIME_KEY = 'issb-quick-maths-seconds';
const BEST_KEY = 'issb-quick-maths-best';

type Outcome = 'correct' | 'wrong' | 'timeout';
type Attempt = { question: QuickQuestion; given: string; outcome: Outcome; ms: number };
type Best = Record<string, { correct: number; total: number; avgMs: number; date: string }>;

function readNumber(key: string, fallback: number, allowed: readonly number[]) {
  try {
    const n = Number(window.localStorage.getItem(key));
    return allowed.includes(n) && window.localStorage.getItem(key) !== null ? n : fallback;
  } catch {
    return fallback;
  }
}

function readBest(): Best {
  try {
    return JSON.parse(window.localStorage.getItem(BEST_KEY) ?? '{}') as Best;
  } catch {
    return {};
  }
}

const bestKey = (length: number, seconds: number) => `${length || 'endless'}q-${seconds || 'untimed'}s`;
const fmtAnswer = (q: QuickQuestion) => `${q.unit === 'Rs' ? 'Rs ' : ''}${q.answer.toLocaleString('en-US')}${q.unit && q.unit !== 'Rs' ? (q.unit === '%' || q.unit === '°' ? q.unit : ` ${q.unit}`) : ''}`;

export default function QuickMaths() {
  const [phase, setPhase] = useState<'setup' | 'play' | 'summary'>('setup');
  const [seconds, setSeconds] = useState(5);
  const [length, setLength] = useState<number>(10);
  const [topics, setTopics] = useState<QuickTopic[]>([]);
  const [question, setQuestion] = useState<QuickQuestion | null>(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<Attempt | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [remaining, setRemaining] = useState(1);
  const [best, setBest] = useState<Best>({});
  const [newBest, setNewBest] = useState(false);
  const startRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const answeredRef = useRef(false);
  const attemptsRef = useRef<Attempt[]>([]);

  useEffect(() => {
    // Read saved settings after mount so the server render stays the same.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeconds(readNumber(TIME_KEY, 5, TIME_OPTIONS));
    setBest(readBest());
  }, []);

  const chooseSeconds = (value: number) => {
    setSeconds(value);
    try {
      window.localStorage.setItem(TIME_KEY, String(value));
    } catch {
      // storage blocked; the choice still applies now
    }
  };

  const nextQuestion = useCallback(() => {
    answeredRef.current = false;
    setFeedback(null);
    setInput('');
    setRemaining(1);
    setQuestion(generateQuestion(topics));
    startRef.current = performance.now();
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [topics]);

  const finish = useCallback((all: Attempt[]) => {
    setPhase('summary');
    if (!all.length) return;
    const correct = all.filter((a) => a.outcome === 'correct').length;
    const avgMs = Math.round(all.reduce((s, a) => s + a.ms, 0) / all.length);
    const key = bestKey(length, seconds);
    const current = readBest();
    const prev = current[key];
    const better = !prev || correct / all.length > prev.correct / prev.total || (correct / all.length === prev.correct / prev.total && avgMs < prev.avgMs);
    if (better && (length > 0 || all.length >= 5)) {
      current[key] = { correct, total: all.length, avgMs, date: new Date().toISOString().slice(0, 10) };
      try {
        window.localStorage.setItem(BEST_KEY, JSON.stringify(current));
      } catch {
        // ignore
      }
    }
    setNewBest(better && (length > 0 || all.length >= 5));
    setBest(current);
  }, [length, seconds]);

  const record = useCallback((outcome: Outcome, given: string) => {
    if (!question || answeredRef.current) return;
    answeredRef.current = true;
    const attempt: Attempt = { question, given, outcome, ms: Math.round(performance.now() - startRef.current) };
    setFeedback(attempt);
    const all = [...attemptsRef.current, attempt];
    attemptsRef.current = all;
    setAttempts(all);
    window.setTimeout(() => {
      if (length > 0 && all.length >= length) finish(all);
      else nextQuestion();
    }, outcome === 'correct' ? 900 : 2600);
  }, [question, length, finish, nextQuestion]);

  // Countdown bar.
  useEffect(() => {
    if (phase !== 'play' || !question || feedback || seconds === 0) return;
    let frame = 0;
    const tick = () => {
      const left = 1 - (performance.now() - startRef.current) / (seconds * 1000);
      if (left <= 0) {
        setRemaining(0);
        record('timeout', inputRef.current?.value ?? '');
        return;
      }
      setRemaining(left);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, question, feedback, seconds, record]);

  const start = () => {
    attemptsRef.current = [];
    setAttempts([]);
    setNewBest(false);
    setPhase('play');
    nextQuestion();
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!question || feedback || !input.trim()) return;
    record(isCorrect(question, input) ? 'correct' : 'wrong', input);
  };

  const toggleTopic = (id: QuickTopic) =>
    setTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  if (phase === 'setup') {
    const saved = best[bestKey(length, seconds)];
    return (
      <section className="prep-panel qm-panel" aria-labelledby="qm-setup">
        <h2 id="qm-setup">Set up your drill</h2>
        <fieldset className="qm-field">
          <legend>Time per question</legend>
          <div className="gk-status-chips">
            {TIME_OPTIONS.map((t) => (
              <button key={t} type="button" aria-pressed={seconds === t} onClick={() => chooseSeconds(t)}>
                {t ? `${t}s` : 'Untimed'}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="qm-field">
          <legend>Questions</legend>
          <div className="gk-status-chips">
            {LENGTH_OPTIONS.map((n) => (
              <button key={n} type="button" aria-pressed={length === n} onClick={() => setLength(n)}>
                {n || 'Endless'}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="qm-field">
          <legend>Topics {topics.length ? `(${topics.length} chosen)` : '(all)'}</legend>
          <div className="gk-status-chips">
            <button type="button" aria-pressed={topics.length === 0} onClick={() => setTopics([])}>All</button>
            {QUICK_TOPICS.map((t) => (
              <button key={t.id} type="button" aria-pressed={topics.includes(t.id)} onClick={() => toggleTopic(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="qm-best">
          {saved
            ? `Best for ${length || 'endless'} questions at ${seconds ? `${seconds}s` : 'untimed'}: ${saved.correct}/${saved.total} (${Math.round((saved.correct / saved.total) * 100)}%), ${(saved.avgMs / 1000).toFixed(1)}s average, ${saved.date}.`
            : 'No best score yet for these settings.'}
        </p>
        <button type="button" className="qm-start" onClick={start}>Start drill</button>
      </section>
    );
  }

  if (phase === 'summary') {
    const total = attempts.length;
    const correct = attempts.filter((a) => a.outcome === 'correct').length;
    const avg = total ? attempts.reduce((s, a) => s + a.ms, 0) / total / 1000 : 0;
    const byTopic = QUICK_TOPICS.map((t) => {
      const list = attempts.filter((a) => a.question.topic === t.id);
      const miss = list.filter((a) => a.outcome !== 'correct').length;
      return { ...t, total: list.length, miss };
    })
      .filter((t) => t.miss > 0)
      .sort((a, b) => b.miss / b.total - a.miss / a.total || b.miss - a.miss)
      .slice(0, 3);
    return (
      <section className="prep-panel qm-panel" aria-labelledby="qm-summary">
        <h2 id="qm-summary">Drill finished</h2>
        <div className="qm-stats">
          <div><strong>{correct}/{total}</strong><span>correct</span></div>
          <div><strong>{total ? Math.round((correct / total) * 100) : 0}%</strong><span>accuracy</span></div>
          <div><strong>{avg.toFixed(1)}s</strong><span>average time</span></div>
        </div>
        {newBest ? <p className="qm-feedback qm-feedback--correct">New best score for these settings.</p> : null}
        <h3>Weakest topics</h3>
        {byTopic.length ? (
          <ul className="qm-weak">
            {byTopic.map((t) => <li key={t.id}>{t.label}: {t.miss} of {t.total} missed</li>)}
          </ul>
        ) : (
          <p>No misses. Try a shorter time limit.</p>
        )}
        <details className="prep-details">
          <summary>Review every question</summary>
          <ol className="qm-review">
            {attempts.map((a, i) => (
              <li key={i} className={a.outcome === 'correct' ? 'qm-ok' : 'qm-miss'}>
                {a.question.text} <strong>{fmtAnswer(a.question)}</strong>
                {a.outcome !== 'correct' ? ` (you: ${a.outcome === 'timeout' && !a.given ? 'timed out' : a.given || 'blank'})` : ''}
              </li>
            ))}
          </ol>
        </details>
        <div className="qm-actions">
          <button type="button" className="qm-start" onClick={start}>Go again</button>
          <button type="button" className="qm-secondary" onClick={() => setPhase('setup')}>Change settings</button>
        </div>
      </section>
    );
  }

  const done = attempts.length;
  return (
    <section className="prep-panel qm-panel" aria-labelledby="qm-q">
      <div className="qm-top">
        <span>Question {done + (feedback ? 0 : 1)}{length ? ` of ${length}` : ''}</span>
        <span>{attempts.filter((a) => a.outcome === 'correct').length} correct</span>
        <button type="button" className="qm-secondary qm-end" onClick={() => finish(attempts)}>End</button>
      </div>
      {seconds ? (
        <div className="qm-bar" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={seconds} aria-valuenow={Math.ceil(remaining * seconds)}>
          <div className={`qm-bar-fill ${remaining < 0.3 ? 'qm-bar-fill--low' : ''}`} style={{ transform: `scaleX(${feedback ? 0 : remaining})` }} />
        </div>
      ) : null}
      <p className="gk-tile-kicker">{QUICK_TOPICS.find((t) => t.id === question?.topic)?.label}</p>
      <h2 id="qm-q" className="qm-question">{question?.text}</h2>
      <form onSubmit={submit} className="qm-form">
        <input
          ref={inputRef}
          className="qm-input"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="go"
          aria-label="Your answer"
          placeholder={question?.unit ? `Answer (${question.unit})` : 'Answer'}
          value={input}
          disabled={Boolean(feedback)}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit" className="qm-start" disabled={Boolean(feedback)}>Enter</button>
      </form>
      <div aria-live="polite">
        {feedback ? (
          <div className={`qm-feedback ${feedback.outcome === 'correct' ? 'qm-feedback--correct' : 'qm-feedback--wrong'}`}>
            <strong>{feedback.outcome === 'correct' ? 'Correct' : feedback.outcome === 'timeout' ? 'Time up' : 'Not quite'}</strong>
            {feedback.outcome !== 'correct' ? <> Answer: <strong>{fmtAnswer(feedback.question)}</strong></> : null}
            <span className="qm-method">{feedback.question.method}</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
