'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { TransformComponent, TransformWrapper, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import PracticeTimer from '../../components/PracticeTimer';
import { downloadText } from '../../lib/practice';
import { realGtoBriefText, realGtoGuide, realGtoModels, type RealGtoModel, type RealGtoRow } from '../../lib/realGtoModels';
import {
  PLANNING_ASSESSMENT_VERSION,
  PLANNING_MAX_PLAN_LENGTH,
  PLANNING_MIN_PLAN_LENGTH,
  type PlanningAssessmentResult,
} from '../../lib/planning-assessment/types';

const DRAFT_KEY = 'issb-real-gto-plans-v1';

type Open = { kind: 'guide' } | { kind: 'task'; task: RealGtoModel } | null;

function readDrafts(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? '{}');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function writeDraft(id: string, text: string) {
  try {
    const drafts = readDrafts();
    if (text) drafts[id] = text;
    else delete drafts[id];
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
  } catch {
    // storage full or blocked: the draft still lives in the textarea
  }
}

export default function RealGtoModels() {
  const [open, setOpen] = useState<Open>(null);
  return (
    <section className="prep-panel" id="real-gto-models">
      <p className="gk-tile-kicker">From real GTO models</p>
      <h2>Real GTO planning models</h2>
      <p>Three problems taken from real GTO model slides. Each map is the original slide, cleaned up so you can zoom in. Write your plan in 15 minutes, then let the AI GTO check it.</p>
      <p className="prep-muted">Two of the slides have no written story, only the map and the GTO&apos;s notes. We show exactly what the slides give and mark anything unclear.</p>
      <div className="gk-tile-grid">
        <button type="button" className="gk-tile gk-tile--topic" onClick={() => setOpen({ kind: 'guide' })}>
          <span className="gp-badge gp-badge--real">Start here</span>
          <strong className="gk-tile-title">{realGtoGuide.title}</strong>
          <span className="gk-tile-teaser">What the GTO looks for, the order of the task, and how to work it out.</span>
          <span className="gk-tile-cta">Open guide →</span>
        </button>
        {realGtoModels.map((task) => (
          <button key={task.id} type="button" className="gk-tile" onClick={() => setOpen({ kind: 'task', task })}>
            <span className="gp-badge gp-badge--real">Real GTO model</span>
            <strong className="gk-tile-title">{task.title}</strong>
            <span className="gk-tile-teaser">{task.teaser}</span>
            <span className="gk-tile-cta">Open problem →</span>
          </button>
        ))}
      </div>
      {open ? (
        <Modal key={open.kind === 'task' ? open.task.id : 'guide'} onClose={() => setOpen(null)} wide={open.kind === 'task'}>
          {(titleId) => (open.kind === 'guide' ? <GuideBody titleId={titleId} /> : <TaskBody titleId={titleId} task={open.task} />)}
        </Modal>
      ) : null}
    </section>
  );
}

function Modal({ onClose, wide, children }: { onClose: () => void; wide: boolean; children: (titleId: string) => ReactNode }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className={`gk-modal${wide ? ' gk-modal--wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>Close</button>
        </div>
        <article className="gk-modal-body">{children(titleId)}</article>
      </div>
    </div>
  );
}

function GuideBody({ titleId }: { titleId: string }) {
  return (
    <>
      <p className="gk-tile-kicker">From the GTO slides: {realGtoGuide.deckTitle}</p>
      <h2 id={titleId}>{realGtoGuide.title}</h2>
      <h3>What the GTO is looking for</h3>
      <ul>{realGtoGuide.qualities.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>Procedure</h3>
      <ol className="rgto-ol">{realGtoGuide.procedure.map((item) => <li key={item}>{item}</li>)}</ol>
      <h3>How to go about it</h3>
      <ul>{realGtoGuide.howTo.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className="prep-muted">These points are copied from the slides. For example, a 30 km leg at 10 km/h takes 30 ÷ 10 = 3 hours.</p>
    </>
  );
}

function RowTable({ rows, head }: { rows: RealGtoRow[]; head: [string, string] }) {
  return (
    <div className="prep-table-wrap">
      <table className="prep-table">
        <thead><tr><th>{head[0]}</th><th>{head[1]}</th></tr></thead>
        <tbody>{rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.detail}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

function ZoomMap({ task }: { task: RealGtoModel }) {
  const ref = useRef<ReactZoomPanPinchRef>(null);
  const [zoomed, setZoomed] = useState(false);
  return (
    <figure className="rgto-map">
      <div className="rgto-map-frame">
        <TransformWrapper
          ref={ref}
          minScale={1}
          maxScale={6}
          doubleClick={{ mode: 'zoomIn' }}
          wheel={{ step: 0.15, activationKeys: ['Control'] }}
          panning={{ disabled: !zoomed, velocityDisabled: true }}
          onTransform={(_, state) => setZoomed(state.scale > 1.01)}
        >
          <TransformComponent wrapperStyle={{ width: '100%' }} contentStyle={{ width: '100%' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={task.image} alt={task.imageAlt} width={task.imageWidth} height={task.imageHeight} className="rgto-map-img" />
          </TransformComponent>
        </TransformWrapper>
      </div>
      <div className="rgto-zoom-bar">
        <button type="button" onClick={() => ref.current?.zoomIn()} aria-label="Zoom in">+</button>
        <button type="button" onClick={() => ref.current?.zoomOut()} aria-label="Zoom out">−</button>
        <button type="button" onClick={() => ref.current?.resetTransform()}>Reset</button>
        <a href={task.image} target="_blank" rel="noreferrer">Open full size</a>
      </div>
      <figcaption className="prep-muted">Original slide map. Use + or pinch to zoom, then drag to move around.</figcaption>
    </figure>
  );
}

function errorMessage(value: unknown): string {
  if (value && typeof value === 'object' && 'error' in value) {
    const error = (value as { error?: { message?: unknown } }).error;
    if (error && typeof error.message === 'string') return error.message;
  }
  return 'The plan checker is busy right now. Please try again.';
}

const VERDICT_LABEL: Record<PlanningAssessmentResult['verdict'], string> = {
  correct: 'Correct',
  'partly-correct': 'Partly correct',
  incorrect: 'Not correct yet',
};

function TaskBody({ titleId, task }: { titleId: string; task: RealGtoModel }) {
  const [plan, setPlan] = useState(() => readDrafts()[task.id] ?? '');
  const [result, setResult] = useState<PlanningAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const trimmed = plan.trim();

  useEffect(() => {
    if (!loading) return;
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [loading]);

  const check = async () => {
    if (loading) return;
    if (trimmed.length < PLANNING_MIN_PLAN_LENGTH) {
      setError('Write a little more of your plan first (who, what, which route, what time).');
      return;
    }
    setLoading(true);
    setElapsed(0);
    setError(null);
    try {
      const response = await fetch('/api/planning-assessment', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ version: PLANNING_ASSESSMENT_VERSION, taskId: task.id, plan: trimmed }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(payload));
      setResult(payload as PlanningAssessmentResult);
    } catch (checkError) {
      setResult(null);
      setError(checkError instanceof Error && checkError.message !== 'Failed to fetch' ? checkError.message : 'Could not reach the plan checker. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="gk-tile-kicker">From real GTO models · Slide title: {task.slideTitle}</p>
      <h2 id={titleId}>{task.title}</h2>
      <div className="prep-ask-block">
        <p className="prep-ask-label">Planning time limit</p>
        <p className="prep-ask">{task.planningMinutes} minutes. Story starts {task.timeNow}. Finish by {task.finishBy}.</p>
      </div>
      <ZoomMap task={task} />

      <h3>{task.hasWrittenStory ? 'The story' : 'What the slides give'}</h3>
      {task.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}

      <h3>GTO&apos;s notes on the slide</h3>
      <p className="rgto-verbatim"><span className="prep-muted">As written: </span>&ldquo;{task.slideNotesVerbatim}&rdquo;</p>
      <ul>{task.slideNotesReading.map((item) => <li key={item}>{item}</li>)}</ul>

      <h3>Model key</h3>
      <RowTable rows={task.modelKey} head={['On the map', 'What it is']} />

      <h3>Numbers on the map</h3>
      <p>{task.numbers.intro}</p>
      <RowTable rows={task.numbers.rows} head={['Number', 'Where it is']} />

      <h3>Speeds, capacities and times</h3>
      <RowTable rows={task.speedsAndTimes} head={['Item', 'Given data']} />

      <h3>Resources</h3>
      <ul>{task.resources.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>Limitations</h3>
      <ul>{task.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>Your tasks</h3>
      <ol className="rgto-ol">{task.tasks.map((item) => <li key={item}>{item}</li>)}</ol>
      <div className="prep-note">
        <strong>Not given or unclear on the slides</strong>
        <ul>{task.notGiven.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>

      <h3>Your plan</h3>
      <PracticeTimer seconds={task.planningMinutes * 60} label={`${task.planningMinutes} minute planning limit`} />
      <label className="prep-field">
        Write your plan: priorities, who does what, which vehicle and route, and the clock time for each step.
        <textarea
          className="rgto-plan"
          dir="auto"
          maxLength={PLANNING_MAX_PLAN_LENGTH}
          value={plan}
          placeholder={'1. First priority and why\n2. 08:00 ... (who, what, where)\n3. Leg: distance ÷ speed = time, arrive at ...\n4. Backup if something fails'}
          onChange={(event) => {
            setPlan(event.target.value);
            writeDraft(task.id, event.target.value);
          }}
        />
      </label>
      <p className="prep-muted">{plan.length}/{PLANNING_MAX_PLAN_LENGTH} characters. Your draft is saved only in this browser.</p>
      <div className="prep-actions">
        <button type="button" className="prep-button" onClick={check} disabled={loading || trimmed.length === 0}>
          {loading ? `Checking… ${elapsed}s` : result ? 'Check again' : 'Check my plan'}
        </button>
        <button
          type="button"
          className="prep-button prep-button-secondary"
          disabled={!trimmed}
          onClick={() => downloadText(`issb-real-gto-${task.id}.txt`, `${realGtoBriefText(task)}\n\nMY PLAN\n${plan}`)}
        >
          Download
        </button>
      </div>
      {loading ? (
        <p className="rgto-loading" role="status">The AI GTO is checking your plan and redoing your sums. This usually takes 35 to 55 seconds. Keep this window open.</p>
      ) : null}
      {error ? <p className="rgto-error" role="alert">{error}</p> : null}
      {result ? <Feedback result={result} /> : null}

      <details className="prep-details">
        <summary>Reveal {task.reference.title.toLowerCase()}</summary>
        <div className="prep-answer">
          <p className="prep-muted">{task.reference.caveat}</p>
          <ul>{task.reference.points.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
      </details>
    </>
  );
}

function Feedback({ result }: { result: PlanningAssessmentResult }) {
  return (
    <section className={`rgto-feedback rgto-feedback--${result.verdict}`} aria-live="polite">
      <p className="rgto-verdict">
        <span>{VERDICT_LABEL[result.verdict]}</span>
        <span>{result.score}/10</span>
      </p>
      <p>{result.summary}</p>
      <h4>Priorities {result.priorities.right ? '✓ right' : '✗ need fixing'}</h4>
      {result.priorities.comment ? <p>{result.priorities.comment}</p> : null}
      {result.calculations.length ? (
        <>
          <h4>Maths and timing errors</h4>
          <ul>
            {result.calculations.map((item) => (
              <li key={`${item.item}:${item.problem}`}>
                <strong>{item.item}.</strong> {item.problem} <em>Correct: {item.corrected}</em>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {result.resources.length ? (
        <>
          <h4>Resources missed or misused</h4>
          <ul>{result.resources.map((item) => <li key={item}>{item}</li>)}</ul>
        </>
      ) : null}
      {result.feasibility ? (
        <>
          <h4>Is it practical and on time?</h4>
          <p>{result.feasibility}</p>
        </>
      ) : null}
      {result.fixes.length ? (
        <>
          <h4>How to fix it</h4>
          <ul>{result.fixes.map((item) => <li key={item}>{item}</li>)}</ul>
        </>
      ) : null}
      {result.strengths.length ? (
        <>
          <h4>What you did well</h4>
          <ul>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </>
      ) : null}
      {result.modelAnswer ? (
        <>
          <h4>Short model answer</h4>
          <p className="rgto-model-answer">{result.modelAnswer}</p>
        </>
      ) : null}
      <p className="prep-muted">{result.disclaimer}</p>
    </section>
  );
}
