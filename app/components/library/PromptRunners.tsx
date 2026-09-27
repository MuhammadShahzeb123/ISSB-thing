'use client';

import { useEffect, useState } from 'react';
import { useCountdown, useLibraryProgress } from '../../lib/libraryProgress';
import { downloadText, formatClock } from '../../lib/practice';
import { MorphButton } from '../motion/MorphButton';
import { RollingNumber } from '../motion/RollingNumber';
import { Segmented } from '../motion/Segmented';
import { Swap } from '../motion/Swap';
import { useLiquidInk } from '../motion/useLiquidInk';
import { Clock, dirFor, useToast, wordCount } from './shared';
import { FinishActions, type RunnerProps } from './WritingRunners';

/** The list of prompts, with one accent block that slides to the selected one. */
function PromptPicker({ set, selected, done, onSelect }: { set: RunnerProps['set']; selected: number; done: Set<number>; onSelect: (index: number) => void }) {
  const { container, ink } = useLiquidInk<HTMLDivElement>({ target: String(selected), inset: 2 });
  return (
    <div ref={container} className="lib-topic-list" role="list">
      <span ref={ink} className="liquid-ink" aria-hidden />
      {set.items.map((item, i) => (
        <div role="listitem" key={i}>
          <button type="button" lang={set.language} data-ink={String(i)} aria-pressed={selected === i} onClick={() => onSelect(i)}>
            <span aria-hidden style={{ marginInlineEnd: '0.5rem' }}>{done.has(i) ? '✓' : `${i + 1}.`}</span>{item.prompt}
          </button>
        </div>
      ))}
    </div>
  );
}

function randomOther(count: number, current: number) {
  if (count < 2) return 0;
  let pick = current;
  while (pick === current) pick = Math.floor(Math.random() * count);
  return pick;
}

/* ---------------- Pointer stories & events ---------------- */

export function StoryRunner({ set, pKey, next }: RunnerProps) {
  const SECONDS = 240;
  const [selected, setSelected] = useState(0);
  const [text, setText] = useState('');
  const [finished, setFinished] = useState(false);
  const { progress, update } = useLibraryProgress();
  const { show, toast } = useToast();
  const clock = useCountdown(SECONDS, () => { setFinished(true); show('Four minutes are up. Finish your sentence and read it back.'); });
  const done = new Set(progress[pKey]?.done ?? []);

  const choose = (index: number) => { setSelected(index); setText(''); setFinished(false); clock.reset(); };
  const save = () => {
    clock.pause();
    setFinished(true);
    update(pKey, set.items.length, (current) => ({ done: [...new Set([...current.done, selected])], lastResult: `${new Set([...current.done, selected]).size}/${set.items.length} written` }));
    show('Story saved to your progress.');
  };

  const words = wordCount(text);
  return (
    <div className="prep-split">
      <div className="lib-stage">
        <div className="lib-stage-head">
          <span className="lib-counter">Prompt <RollingNumber value={String(selected + 1)} /> / {set.items.length}</span>
          <Clock left={clock.left} total={SECONDS} />
        </div>
        <Swap id={selected}>
          <p className="lib-prompt" lang={set.language}>{set.items[selected].prompt}{set.id === 'story-pointers' ? ' …' : ''}</p>
        </Swap>
        <label htmlFor="story-text" className="prep-muted" style={{ fontWeight: 800 }}>Your story</label>
        <textarea
          id="story-text"
          className="lib-input"
          value={text}
          onChange={(event) => { setText(event.target.value); if (!clock.running && !finished && clock.left === SECONDS) clock.start(); }}
          placeholder="The clock starts when you start typing. Who is the hero? What do they do, and how does it end?"
        />
        <p className="lib-hint"><span><RollingNumber value={String(words)} /> words</span><span>{clock.running ? 'Clock running' : clock.left === SECONDS ? 'Clock starts on your first key' : clock.left === 0 ? 'Time is up' : 'Paused'}</span></p>
        <div className="prep-actions" style={{ marginTop: '1rem' }}>
          <MorphButton status={finished && done.has(selected) ? 'done' : 'idle'} doneLabel="Saved" onClick={save} disabled={!text.trim()}>Finish & save</MorphButton>
          <button type="button" className="prep-button prep-button-secondary" onClick={() => (clock.running ? clock.pause() : clock.start())}>{clock.running ? 'Pause' : clock.left === SECONDS ? 'Start clock' : 'Resume'}</button>
          <button type="button" className="prep-button prep-button-secondary" onClick={() => choose(randomOther(set.items.length, selected))}>Random prompt</button>
          {text.trim() && <button type="button" className="prep-button prep-button-secondary" onClick={() => downloadText(`${set.id}-${selected + 1}.txt`, `${set.items[selected].prompt}\n\n${text}`)}>Download</button>}
        </div>
        <Swap id={finished ? 'finished' : 'writing'}>
          {finished && (
            <div className="prep-note prep-success" role="status">
              Written in {formatClock(SECONDS - clock.left)}, {words} words. Read it once: does your hero act, solve the problem and reach a clear ending?
              <FinishActions onRestart={() => choose(randomOther(set.items.length, selected))} next={next} />
            </div>
          )}
        </Swap>
        {toast}
      </div>
      <aside>
        <p className="lib-kicker" style={{ marginBottom: '0.6rem' }}>{done.size} of {set.items.length} written · pick any prompt</p>
        <PromptPicker set={set} selected={selected} done={done} onSelect={choose} />
      </aside>
    </div>
  );
}

/* ---------------- GTO discussion & lecture ---------------- */

const FORMATS = [
  { id: 'lecture', label: 'Lecture · 2 min', seconds: 120, tip: 'One minute of thinking is realistic. Open with your stand, give three reasons, close with one line.' },
  { id: 'discussion', label: 'Group discussion · 15 min', seconds: 900, tip: 'Enter early, build on others by name, add a fresh point, and help the group reach a conclusion.' },
] as const;

const FORMAT_OPTIONS = FORMATS.map((option) => ({ value: option.id, label: option.label }));

export function TopicRunner({ set, pKey, next }: RunnerProps) {
  const [selected, setSelected] = useState(0);
  const [format, setFormat] = useState<(typeof FORMATS)[number]>(FORMATS[0]);
  const [notes, setNotes] = useState('');
  const { progress, update } = useLibraryProgress();
  const { show, toast } = useToast();
  const clock = useCountdown(format.seconds, () => show('Time. Wrap up with a one-line conclusion.'));
  const done = new Set(progress[pKey]?.done ?? []);

  useEffect(() => { clock.reset(format.seconds); }, [format]); // eslint-disable-line react-hooks/exhaustive-deps

  const choose = (index: number) => { setSelected(index); setNotes(''); clock.reset(format.seconds); };
  const markDone = () => {
    update(pKey, set.items.length, (current) => ({ done: [...new Set([...current.done, selected])], lastResult: `${new Set([...current.done, selected]).size}/${set.items.length} topics` }));
    show('Topic marked as practised.');
  };

  return (
    <div className="prep-split">
      <div className="lib-stage">
        <div className="lib-toolbar" style={{ marginTop: 0 }}>
          <Segmented options={FORMAT_OPTIONS} value={format.id} onChange={(id) => setFormat(FORMATS.find((option) => option.id === id) ?? FORMATS[0])} label="Format" />
          <Clock left={clock.left} total={format.seconds} />
        </div>
        <Swap id={selected}>
          <p className="lib-prompt" lang={set.language} dir={dirFor(set.language)}>{set.items[selected].prompt}</p>
        </Swap>
        <Swap id={format.id}>
          <p className="lib-howto" style={{ margin: '0 0 1rem' }}><strong>Tip</strong><span>{format.tip}</span></p>
        </Swap>
        <label htmlFor="topic-notes" className="prep-muted" style={{ fontWeight: 800 }}>Quick notes (for your eyes only)</label>
        <textarea id="topic-notes" className="lib-input" style={{ minHeight: '9rem' }} dir={dirFor(set.language)} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={'My stand:\n1.\n2.\n3.\nConclusion:'} />
        <div className="prep-actions" style={{ marginTop: '1rem' }}>
          <button type="button" className="prep-button" onClick={() => (clock.running ? clock.pause() : clock.start())}>{clock.running ? 'Pause' : clock.left === format.seconds ? `Start ${formatClock(format.seconds)}` : 'Resume'}</button>
          <MorphButton status={done.has(selected) ? 'done' : 'idle'} doneLabel="Practised" className="prep-button prep-button-secondary" onClick={markDone}>Mark practised</MorphButton>
          <button type="button" className="prep-button prep-button-secondary" onClick={() => choose(randomOther(set.items.length, selected))}>Random topic</button>
          {selected < set.items.length - 1 ? <button type="button" className="prep-button prep-button-secondary" onClick={() => choose(selected + 1)}>Next topic →</button> : next && <FinishActions onRestart={() => choose(0)} next={next} />}
        </div>
        {toast}
      </div>
      <aside>
        <p className="lib-kicker" style={{ marginBottom: '0.6rem' }}>{done.size} of {set.items.length} practised</p>
        <PromptPicker set={set} selected={selected} done={done} onSelect={choose} />
      </aside>
    </div>
  );
}

/* ---------------- Group planning ---------------- */

export function PlanningRunner({ set, pKey, next }: RunnerProps) {
  const SECONDS = 900;
  const [plan, setPlan] = useState('');
  const [finished, setFinished] = useState(false);
  const { update } = useLibraryProgress();
  const { show, toast } = useToast();
  const clock = useCountdown(SECONDS, () => { setFinished(true); show('Fifteen minutes are up.'); });
  const [brief, ...rest] = set.items;

  const finish = () => {
    clock.pause();
    setFinished(true);
    update(pKey, set.items.length, () => ({ done: set.items.map((_, i) => i), completedAt: Date.now(), lastResult: `Planned in ${formatClock(SECONDS - clock.left)}` }));
  };

  return (
    <div className="prep-split">
      <div className="lib-stage">
        <div className="lib-stage-head">
          <span className="lib-kicker">Group planning · 15 minutes in the schedule</span>
          <Clock left={clock.left} total={SECONDS} />
        </div>
        <p className="lib-prompt" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)' }} lang={set.language} dir={dirFor(set.language)}>{brief.prompt}</p>
        <label htmlFor="plan-text" className="prep-muted" style={{ fontWeight: 800 }}>Your plan</label>
        <textarea id="plan-text" className="lib-input" dir={dirFor(set.language)} value={plan} onChange={(event) => { setPlan(event.target.value); if (!clock.running && clock.left === SECONDS) clock.start(); }} placeholder={'Aim:\nResources and times:\nStep-by-step timeline:\nWhy this order works:'} />
        <div className="prep-actions" style={{ marginTop: '1rem' }}>
          <MorphButton status={finished ? 'done' : 'idle'} doneLabel="Checked" onClick={finish} disabled={!plan.trim()}>Finish & check</MorphButton>
          <button type="button" className="prep-button prep-button-secondary" onClick={() => (clock.running ? clock.pause() : clock.start())}>{clock.running ? 'Pause' : clock.left === SECONDS ? 'Start clock' : 'Resume'}</button>
        </div>
        <Swap id={finished ? 'finished' : 'planning'}>
          {finished && (
            <div className="prep-note prep-success" role="status">
              Check your plan against every fact on the right. Did you use each vehicle and time, and does the timeline add up?
              <FinishActions onRestart={() => { setPlan(''); setFinished(false); clock.reset(); }} next={next} />
            </div>
          )}
        </Swap>
        {toast}
      </div>
      <aside className="lib-stage" style={{ boxShadow: '4px 4px 0 var(--ink)' }}>
        <h2 className="lib-kicker" style={{ marginBottom: '0.6rem' }}>Scenario facts & questions</h2>
        <ol className="lib-list" lang={set.language} dir={dirFor(set.language)}>
          {rest.map((item, i) => <li key={i} className="lib-list-item" lang={set.language}>{item.prompt}</li>)}
          {!rest.length && <li className="lib-list-item">The full scenario is in the text on the left.</li>}
        </ol>
      </aside>
    </div>
  );
}

/* ---------------- Interview questions ---------------- */

const QUESTION_VIEWS = [
  { value: 'one', label: 'One at a time' },
  { value: 'all', label: 'All questions' },
] as const;

export function QuestionRunner({ set, pKey, next }: RunnerProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [view, setView] = useState<'one' | 'all'>('one');
  const { progress, update } = useLibraryProgress();
  const { show, toast } = useToast();
  const clock = useCountdown(60, () => show('One minute. Round off your answer.'));
  const done = new Set(progress[pKey]?.done ?? []);
  const count = set.items.length;

  const go = (to: number, markCurrent = true) => {
    if (markCurrent) update(pKey, count, (current) => ({ done: [...new Set([...current.done, index])], lastResult: `${new Set([...current.done, index]).size}/${count} answered` }));
    clock.reset();
    const target = ((to % count) + count) % count;
    setDirection(target > index || (index === count - 1 && target === 0) ? 'left' : 'right');
    setIndex(target);
  };

  useEffect(() => {
    if (view !== 'one') return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (event.key === 'ArrowRight') go(index + 1);
      if (event.key === 'ArrowLeft') go(index - 1, false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <>
      <div className="lib-toolbar">
        <Segmented options={QUESTION_VIEWS} value={view} onChange={setView} label="View" />
        <span className="lib-chip lib-chip--done"><RollingNumber value={String(done.size)} />/{count} answered</span>
      </div>
      <Swap id={view}>
        {view === 'one' ? (
          <div className="lib-stage">
            <div className="lib-stage-head">
              <span className="lib-counter"><RollingNumber value={String(index + 1)} /> / {count}</span>
              <Clock left={clock.left} total={60} label="Answer time" />
            </div>
            <Swap id={index} dir={direction} morph="none">
              <p className="lib-prompt" lang={set.language} dir={dirFor(set.language)}>{set.items[index].prompt}</p>
              {set.items[index].detail && <p className="prep-muted" dir="auto">{set.items[index].detail}</p>}
            </Swap>
            <p className="lib-hint"><span>Answer out loud, in full sentences.</span><span><kbd className="lib-kbd">→</kbd> next</span><span><kbd className="lib-kbd">←</kbd> back</span></p>
            <div className="prep-actions" style={{ marginTop: '1rem' }}>
              <button type="button" className="prep-button" onClick={() => (clock.running ? clock.pause() : clock.start())}>{clock.running ? 'Pause' : 'Start 1-minute answer'}</button>
              <button type="button" className="prep-button prep-button-secondary" onClick={() => go(index - 1, false)}>← Back</button>
              <button type="button" className="prep-button prep-button-secondary" onClick={() => go(index + 1)}>{done.has(index) ? 'Next →' : 'Answered, next →'}</button>
              <button type="button" className="prep-button prep-button-secondary" onClick={() => go(randomOther(count, index))}>Random</button>
            </div>
            {done.size >= count && <div className="prep-note prep-success">You have answered every question in this set.<FinishActions onRestart={() => go(0, false)} next={next} /></div>}
          </div>
        ) : (
          <ol className="lib-list">
            {set.items.map((item, i) => (
              <li key={i} className="lib-list-item" lang={set.language} dir={dirFor(set.language)}>
                <span aria-hidden>{done.has(i) ? '✓ ' : `${i + 1}. `}</span>{item.prompt}
              </li>
            ))}
          </ol>
        )}
      </Swap>
      {toast}
    </>
  );
}
