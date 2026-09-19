'use client';

import { useEffect, useRef, useState } from 'react';
import { isCorrectAnswer, mathQuestions, parseNumericAnswer, type MathQuestion } from '../lib/mentalMath';
import { shuffleItems } from '../lib/practice';

type Result = { question: MathQuestion; response: string; correct: boolean; timedOut: boolean };

export default function MentalMath() {
  const [category, setCategory] = useState('All');
  const [pace, setPace] = useState(15);
  const [size, setSize] = useState(10);
  const [deck, setDeck] = useState<MathQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [deadline, setDeadline] = useState(0);
  const [left, setLeft] = useState(0);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lock = useRef(false);
  const answerRef = useRef('');
  const question = deck[index];
  const available = category === 'All' ? mathQuestions : mathQuestions.filter((item) => item.category === category);

  useEffect(() => {
    if (!question || revealed || finished) return;
    inputRef.current?.focus();
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(remaining);
      if (!remaining && !lock.current) {
        lock.current = true;
        setResults((previous) => [...previous, { question, response: answerRef.current, correct: false, timedOut: true }]);
        setRevealed(true);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [deadline, finished, question, revealed]);

  function start() {
    setDeck(shuffleItems(available).slice(0, size));
    setIndex(0); setAnswer(''); answerRef.current = ''; setResults([]); setRevealed(false); setFinished(false); setError('');
    setDeadline(Date.now() + pace * 1000); setLeft(pace); lock.current = false;
  }

  function check() {
    if (!question || lock.current) return;
    if (parseNumericAnswer(answer) === null) { setError('Enter a number, a fraction such as 1/4, or a mixed number such as 1 1/4.'); return; }
    lock.current = true;
    const timedOut = Date.now() >= deadline;
    setResults((previous) => [...previous, { question, response: answer, correct: !timedOut && isCorrectAnswer(answer, question.answer), timedOut }]);
    setRevealed(true); setError('');
  }

  function next() {
    if (index + 1 === deck.length) { setFinished(true); return; }
    setIndex((previous) => previous + 1); setAnswer(''); answerRef.current = ''; setRevealed(false); setError('');
    setDeadline(Date.now() + pace * 1000); setLeft(pace); lock.current = false;
  }

  if (!deck.length) return (
    <section className="prep-panel">
      <h2>Quick-answer mental maths</h2>
      <p>{mathQuestions.length} questions on prices, percentages, fractions, rates and everyday reasoning. Try them aloud, then enter your answer.</p>
      <div className="prep-filters">
        <label className="prep-field">Topic<select value={category} onChange={(event) => setCategory(event.target.value)}>{['All', ...new Set(mathQuestions.map((item) => item.category))].map((value) => <option key={value}>{value}</option>)}</select></label>
        <label className="prep-field">Seconds per question<select value={pace} onChange={(event) => setPace(Number(event.target.value))}>{[10, 15, 20, 30, 60].map((value) => <option key={value} value={value}>{value} seconds</option>)}</select></label>
        <label className="prep-field">Session length<select value={size} onChange={(event) => setSize(Number(event.target.value))}>{[5, 10, 20, 30].map((value) => <option key={value} value={value}>{value} questions</option>)}</select></label>
      </div>
      <p className="prep-muted">{available.length} available. Number only, without the unit. Fractions and answers rounded to two decimal places are accepted. These are practice timings, not an official ISSB format.</p>
      <button type="button" className="prep-button mt-5" onClick={start}>Start maths</button>
    </section>
  );

  if (finished) return (
    <section className="prep-panel">
      <h2>Maths review</h2><p role="status">{results.filter((item) => item.correct).length} correct out of {results.length}. {results.filter((item) => item.timedOut).length} timed out.</p>
      {results.map((result) => <details className="prep-details" key={result.question.id}><summary>{result.correct ? 'Correct' : result.timedOut ? 'Time up' : 'Review'}: {result.question.prompt}</summary><p>Your answer: {result.response || 'Not entered'}</p><p>Answer: {Number(result.question.answer.toFixed(4))} {result.question.unit}</p><p>{result.question.explanation}</p></details>)}
      <button className="prep-button" type="button" onClick={() => { setDeck([]); setFinished(false); }}>Choose another session</button>
    </section>
  );

  const result = results[results.length - 1];
  return (
    <section className="prep-panel">
      <div className="prep-status"><p>Question {index + 1} of {deck.length} | {question.category}</p><p role="timer" className="prep-clock" aria-label={`${left} seconds remaining`}>{left}s</p></div>
      <h2 className="prep-question">{question.prompt}</h2>
      <form onSubmit={(event) => { event.preventDefault(); if (revealed) next(); else check(); }}>
        <label className="prep-field">Your answer{question.unit ? ` (${question.unit})` : ''}<input ref={inputRef} type="text" inputMode="decimal" autoComplete="off" value={answer} disabled={revealed} onChange={(event) => { setAnswer(event.target.value); answerRef.current = event.target.value; setError(''); }} aria-describedby="math-input-help math-error" /></label>
        <p id="math-input-help" className="prep-muted">Fractions or two decimal places are fine. Press Enter to check, then Enter again for the next question.</p>
        <p id="math-error" role="alert" className="prep-error">{error}</p>
        {revealed ? <div className="prep-answer" role="status"><strong>{result?.timedOut ? 'Time is up' : result?.correct ? 'Correct' : 'Not quite'}</strong><p>Answer: {Number(question.answer.toFixed(4))} {question.unit}</p><p>{question.explanation}</p></div> : null}
        <div className="prep-actions mt-5"><button className="prep-button" type="submit">{revealed ? index + 1 === deck.length ? 'See results' : 'Next question' : 'Check answer'}</button><button className="prep-button prep-button-secondary" type="button" onClick={() => { setDeck([]); setResults([]); }}>End session</button></div>
      </form>
    </section>
  );
}
