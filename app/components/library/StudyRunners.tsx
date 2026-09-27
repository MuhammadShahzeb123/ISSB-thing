'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { LibraryItem, LibrarySet } from '../../lib/library';
import { useLibraryProgress } from '../../lib/libraryProgress';
import { isCorrectAnswer, parseNumericAnswer } from '../../lib/mentalMath';
import { shuffleItems } from '../../lib/practice';
import { MorphButton } from '../motion/MorphButton';
import { RollingNumber } from '../motion/RollingNumber';
import { Segmented } from '../motion/Segmented';
import { Swap } from '../motion/Swap';
import { Toggle } from '../motion/Toggle';
import { stagger } from '../motion/stagger';
import { Highlight, ProgressBar, dirFor, isTyping, useToast } from './shared';
import { FinishActions, type RunnerProps } from './WritingRunners';

const VIEW_OPTIONS = [
  { value: 'cards', label: 'Flashcards' },
  { value: 'list', label: 'Read as a list' },
] as const;

function ItemList({ set, query, showAnswers, known }: { set: LibrarySet; query: string; showAnswers: boolean; known?: Set<number> }) {
  const needle = query.trim().toLocaleLowerCase();
  const rows = set.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !needle || `${item.prompt} ${item.answer ?? ''} ${item.detail ?? ''} ${item.group ?? ''}`.toLocaleLowerCase().includes(needle));
  if (!rows.length) return <div className="lib-empty">Nothing in this set matches “{query}”.</div>;
  return (
    <div className="lib-list" dir={dirFor(set.language)}>
      {rows.flatMap(({ item, index }, position) => {
        const nodes = [];
        if (item.group && item.group !== rows[position - 1]?.item.group) {
          nodes.push(<h3 key={`g-${index}`} className="lib-list-group" lang={/[؀-ۿ]/.test(item.group) ? 'ur' : undefined}>{item.group}</h3>);
        }
        nodes.push(<ListRow key={index} item={item} index={index} set={set} query={query} showAnswers={showAnswers} known={known?.has(index)} />);
        return nodes;
      })}
    </div>
  );
}

function ListRow({ item, index, set, query, showAnswers, known }: { item: LibraryItem; index: number; set: LibrarySet; query: string; showAnswers: boolean; known?: boolean }) {
  const lang = /[؀-ۿ]/.test(item.prompt) ? 'ur' : set.language;
  const body = (
    <>
      {item.answer && <p className="lib-list-answer"><Highlight text={item.answer} query={query} /></p>}
      {item.detail && <p className="lib-list-detail" dir="auto"><Highlight text={item.detail} query={query} /></p>}
    </>
  );
  return (
    <div className="lib-list-item" lang={lang}>
      {item.answer && !showAnswers ? (
        <details>
          <summary>{known ? '✓ ' : ''}<Highlight text={item.prompt} query={query} /></summary>
          {body}
        </details>
      ) : (
        <>
          <p style={{ fontWeight: item.answer ? 800 : 400 }}>{known ? '✓ ' : ''}<Highlight text={item.prompt} query={query} /></p>
          {body}
        </>
      )}
      <span className="lib-sr-only">Item {index + 1}</span>
    </div>
  );
}

/* ---------------- Flashcards ---------------- */

export function FlashcardRunner({ set, pKey, next }: RunnerProps) {
  const count = set.items.length;
  const { progress, update, reset } = useLibraryProgress();
  const { show, toast } = useToast();
  const entry = progress[pKey];
  const known = useMemo(() => new Set(entry?.known ?? []), [entry]);

  const [view, setView] = useState<'cards' | 'list'>('cards');
  const [deck, setDeck] = useState<number[]>(() => set.items.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [typed, setTyped] = useState('');
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null);
  const [round, setRound] = useState<{ good: number[]; again: number[] }>({ good: [], again: [] });
  const [query, setQuery] = useState('');
  const [showAnswers, setShowAnswers] = useState(false);
  // Which way the last card left: right when known, left when it needs another look.
  const [exit, setExit] = useState<'up' | 'left' | 'right'>('up');
  const answerInput = useRef<HTMLInputElement>(null);

  const finished = pos >= deck.length;
  const current = finished ? undefined : set.items[deck[pos]];
  const numeric = current?.answer !== undefined && parseNumericAnswer(current.answer.replace(/,/g, '')) !== null;
  const lang = current && /[؀-ۿ]/.test(current.prompt) ? 'ur' : set.language;

  const startDeck = (indices: number[], shuffle = false) => {
    setDeck(shuffle ? shuffleItems(indices) : indices);
    setPos(0);
    setRevealed(false);
    setTyped('');
    setVerdict(null);
    setRound({ good: [], again: [] });
    setExit('up');
  };

  const grade = (good: boolean) => {
    if (finished) return;
    const index = deck[pos];
    update(pKey, count, (state) => {
      const knownSet = new Set(state.known);
      if (good) knownSet.add(index); else knownSet.delete(index);
      return { done: [...new Set([...state.done, index])], known: [...knownSet], lastResult: `${knownSet.size}/${count} known` };
    });
    setRound((state) => ({ good: good ? [...state.good, index] : state.good, again: good ? state.again : [...state.again, index] }));
    setExit(good ? 'right' : 'left');
    setPos((value) => value + 1);
    setRevealed(false);
    setTyped('');
    setVerdict(null);
  };

  const check = () => {
    if (!current?.answer) return;
    const expected = parseNumericAnswer(current.answer.replace(/,/g, ''));
    if (expected === null) return;
    const right = isCorrectAnswer(typed.replace(/,/g, ''), expected);
    setVerdict(right ? 'right' : 'wrong');
    setRevealed(true);
  };

  useEffect(() => { if (!finished && numeric && view === 'cards') answerInput.current?.focus(); }, [pos, numeric, finished, view]);

  useEffect(() => {
    if (view !== 'cards') return;
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) && event.key !== 'Enter') return;
      if (finished) return;
      if (!revealed && (event.key === ' ' || (event.key === 'Enter' && !isTyping(event)))) { event.preventDefault(); setRevealed(true); return; }
      if (revealed && !isTyping(event)) {
        if (event.key === 'k' || event.key === '1' || event.key === 'ArrowRight') { event.preventDefault(); grade(verdict ? verdict === 'right' : true); }
        if (event.key === 'l' || event.key === '2' || event.key === 'ArrowLeft') { event.preventDefault(); grade(false); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const unknown = set.items.map((_, i) => i).filter((i) => !known.has(i));

  return (
    <>
      <div className="lib-toolbar">
        <Segmented options={VIEW_OPTIONS} value={view} onChange={setView} label="View" />
        <div style={{ minWidth: '12rem', flex: '0 1 18rem' }}>
          <ProgressBar value={known.size / count} label="Cards known" />
          <p className="lib-bar-label"><span><RollingNumber value={String(known.size)} /> of {count} known</span><span><RollingNumber value={String(count - known.size)} /> to learn</span></p>
        </div>
      </div>

      {/* One stage for every state of the runner: its content swaps and its height morphs, it is never cut. */}
      <div className="lib-stage">
        <Swap id={view === 'list' ? 'list' : finished ? 'finished' : 'cards'}>
          {view === 'list' ? (
            <>
              <div className="lib-toolbar" style={{ marginTop: 0 }}>
                <div className="prep-field" style={{ margin: 0, flex: '1 1 16rem' }}>
                  <label htmlFor="list-search" className="lib-sr-only">Search this set</label>
                  <input id="list-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this set…" dir="auto" />
                </div>
                <Toggle checked={showAnswers} onChange={setShowAnswers}>Show all answers</Toggle>
              </div>
              <ItemList set={set} query={query} showAnswers={showAnswers} known={known} />
            </>
          ) : finished ? (
            <>
              <p className="lib-kicker">Round complete</p>
              <h2 className="lib-prompt" style={{ marginTop: '0.3rem' }}>{round.again.length === 0 ? 'Perfect round.' : `${round.good.length} right, ${round.again.length} to review.`}</h2>
              <div className="lib-score stagger">
                <div style={stagger(0)}><strong>{round.good.length}</strong><span>knew it</span></div>
                <div style={stagger(1)}><strong>{round.again.length}</strong><span>still learning</span></div>
                <div style={stagger(2)}><strong>{known.size}/{count}</strong><span>known overall</span></div>
              </div>
              <div className="prep-actions">
                {round.again.length > 0 && <button type="button" className="prep-button" onClick={() => startDeck(round.again, true)}>Review the {round.again.length} I missed</button>}
                {unknown.length > 0 && unknown.length !== round.again.length && <button type="button" className="prep-button prep-button-secondary" onClick={() => startDeck(unknown, true)}>All {unknown.length} not yet known</button>}
              </div>
              <FinishActions onRestart={() => startDeck(set.items.map((_, i) => i))} next={next} />
            </>
          ) : current && (
            <>
              <div className="lib-stage-head">
                <span className="lib-counter">Card <RollingNumber value={String(pos + 1)} /> / {deck.length}</span>
                <div className="prep-actions">
                  <button type="button" className="prep-button prep-button-secondary" onClick={() => { startDeck(deck.slice(pos).concat(deck.slice(0, pos)), true); show('Shuffled'); }}>Shuffle</button>
                  {unknown.length > 0 && unknown.length < count && <button type="button" className="prep-button prep-button-secondary" onClick={() => { startDeck(unknown, true); show(`${unknown.length} cards you have not marked as known`); }}>Only unknown ({unknown.length})</button>}
                  {known.size > 0 && <button type="button" className="prep-button prep-button-secondary" onClick={() => { reset(pKey); startDeck(set.items.map((_, i) => i)); show('Progress for this set cleared'); }}>Reset</button>}
                </div>
              </div>
              <ProgressBar value={pos / deck.length} label="Position in this round" variant="time" />

              {/* The card itself: leaves to the right when known, to the left when it needs another look. */}
              <Swap id={`${deck[pos]}-${pos}`} dir={exit} morph="none">
                {current.group && <p className="lib-chip lib-chip--accent" style={{ marginTop: '1rem' }} lang={/[؀-ۿ]/.test(current.group) ? 'ur' : undefined}>{current.group}</p>}
                <p className="lib-prompt" lang={lang} dir={dirFor(lang)}>{known.has(deck[pos]) && <span className="lib-chip lib-chip--done" style={{ verticalAlign: 'middle', marginInlineEnd: '0.5rem' }}>known</span>}{current.prompt}</p>

                {numeric && !revealed && (
                  <form onSubmit={(event) => { event.preventDefault(); check(); }} className="prep-actions">
                    <label htmlFor="card-answer" className="lib-sr-only">Your answer</label>
                    <input ref={answerInput} id="card-answer" className="lib-input" style={{ flex: '1 1 12rem', width: 'auto' }} inputMode="decimal" value={typed} onChange={(event) => setTyped(event.target.value)} placeholder="Your answer, e.g. 2.25 or 1/4" autoComplete="off" />
                    <button type="submit" className="prep-button" disabled={!typed.trim()}>Check</button>
                  </form>
                )}

                <Swap id={revealed ? 'answer' : 'question'} morph="none">
                  {!revealed ? (
                    <div className="prep-actions" style={{ marginTop: '1rem' }}>
                      <button type="button" className={numeric ? 'prep-button prep-button-secondary' : 'prep-button'} onClick={() => setRevealed(true)} autoFocus={!numeric}>{current.answer ? 'Show answer' : 'Show notes'}</button>
                      <span className="lib-hint" style={{ margin: 0 }}><span><kbd className="lib-kbd">Space</kbd> reveal</span></span>
                    </div>
                  ) : (
                    <>
                      {verdict && <p className={`lib-feedback ${verdict === 'right' ? 'lib-feedback--good' : 'lib-feedback--bad'}`} role="status">{verdict === 'right' ? '✓ Correct!' : `✗ Not quite. You wrote ${typed}.`}</p>}
                      <div className="lib-reveal" lang={lang} dir={dirFor(lang)} style={{ marginTop: '0.75rem' }}>
                        {current.answer ?? 'This entry has no answer in the source. Work it out, then check your method with a friend or teacher.'}
                        {current.detail && <small dir="auto">{current.detail}</small>}
                      </div>
                      <div className="lib-grade stagger">
                        <button type="button" className="is-again" style={stagger(1)} onClick={() => grade(false)}>Still learning <kbd className="lib-kbd">L</kbd></button>
                        <button type="button" className="is-good" style={stagger(2)} onClick={() => grade(verdict ? verdict === 'right' : true)} autoFocus>{verdict === 'wrong' ? 'Got it now' : 'I knew it'} <kbd className="lib-kbd">K</kbd></button>
                      </div>
                    </>
                  )}
                </Swap>
              </Swap>
            </>
          )}
        </Swap>
      </div>
      {toast}
    </>
  );
}

/* ---------------- Reference lists ---------------- */

export function ReferenceView({ set, pKey, next }: RunnerProps) {
  const [query, setQuery] = useState('');
  const { progress, update } = useLibraryProgress();
  const { show, toast } = useToast();
  const read = (progress[pKey]?.done.length ?? 0) >= set.items.length;
  const isBiodata = set.id === 'biodata-form';

  return (
    <>
      {isBiodata && (
        <div className="lib-continue lib-accent-lime" style={{ cursor: 'default' }}>
          <span><strong>Fill it in privately</strong><br />The biodata practice page lets you draft every answer. Drafts stay in this browser only.</span>
          <Link href="/biodata" className="prep-button">Open biodata practice →</Link>
        </div>
      )}
      <div className="lib-toolbar">
        {set.items.length > 12 ? (
          <div className="prep-field" style={{ margin: 0, flex: '1 1 16rem' }}>
            <label htmlFor="ref-search" className="lib-sr-only">Search this list</label>
            <input id="ref-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this list…" dir="auto" />
          </div>
        ) : <span />}
        <MorphButton status={read ? 'done' : 'idle'} doneLabel="Read" className={read ? 'prep-button prep-button-secondary' : 'prep-button'} onClick={() => { if (read) return; update(pKey, set.items.length, () => ({ done: set.items.map((_, i) => i), completedAt: Date.now(), lastResult: 'Read' })); show('Marked as read'); }}>Mark as read</MorphButton>
      </div>
      <ItemList set={set} query={query} showAnswers />
      <Swap id={read && next ? 'next' : 'reading'}>{read && next && <FinishActions next={next} />}</Swap>
      {toast}
    </>
  );
}
