'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { OPI_BANK } from './content/bank.generated';
import {
  CONTENT_VERSION,
  LIKERT_OPTIONS,
  PRACTICE_DIMENSIONS,
  type LikertValue,
  type OpiStatement,
} from './content/model';
import {
  describeAverage,
  scoreByDimension,
  type AnswerMap,
} from './scoring';
import {
  createSession,
  isStoredSession,
  SESSION_SIZES,
  STORAGE_KEY,
  touchSession,
  type OpiSession,
  type SessionSize,
} from './session';

const bankById = new Map<string, OpiStatement>(
  OPI_BANK.map((statement) => [statement.id, statement]),
);

function downloadJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }),
  );
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function Disclosure() {
  return (
    <aside className="border-2 border-slate-950 bg-amber-100 p-4 shadow-[4px_4px_0_#171717]" role="note">
      <p className="font-black">Unvalidated practice for self-reflection only.</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
        This module does not assess suitability or predict selection. There are no ideal responses.
        Answer in the way that best describes you.
      </p>
    </aside>
  );
}

function DataActions({
  canExport,
  onExport,
  onDelete,
}: {
  canExport: boolean;
  onExport: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={onExport}
        disabled={!canExport}
        className="border-2 border-slate-950 bg-white px-3 py-2 text-sm font-black shadow-[3px_3px_0_#171717] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Export my data
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="border-2 border-slate-950 bg-red-100 px-3 py-2 text-sm font-black shadow-[3px_3px_0_#171717] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Delete local data
      </button>
    </div>
  );
}

export default function OpiPracticePage() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<OpiSession | null>(null);
  const [selectedSize, setSelectedSize] = useState<SessionSize>(100);
  const [storageAvailable, setStorageAvailable] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (
            isStoredSession(parsed) &&
            parsed.contentVersion === CONTENT_VERSION &&
            parsed.statementIds.every((id) => bankById.has(id))
          ) {
            setSession(parsed);
          } else {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch {
        setStorageAvailable(false);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || !session) return;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch {
        setStorageAvailable(false);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [hydrated, session]);

  const statements = useMemo(
    () =>
      session?.statementIds
        .map((id) => bankById.get(id))
        .filter((statement) => statement !== undefined) ?? [],
    [session],
  );
  const answeredCount = session ? Object.keys(session.answers).length : 0;
  const currentStatement = session ? statements[session.currentIndex] : undefined;
  const results = useMemo(
    () => scoreByDimension(statements, (session?.answers ?? {}) as AnswerMap),
    [session?.answers, statements],
  );
  const resultsByDimension = new Map(results.map((result) => [result.dimension, result]));

  const updateSession = (
    update:
      | Partial<Omit<OpiSession, 'sessionId' | 'contentVersion' | 'createdAt'>>
      | ((current: OpiSession) => Partial<Omit<OpiSession, 'sessionId' | 'contentVersion' | 'createdAt'>>),
  ) => {
    setSession((current) => {
      if (!current) return current;
      const resolved = typeof update === 'function' ? update(current) : update;
      return touchSession(current, resolved);
    });
  };

  const startSession = () => setSession(createSession(OPI_BANK, selectedSize));

  const answerStatement = (statementId: string, value: LikertValue) => {
    updateSession((current) => ({
      answers: { ...current.answers, [statementId]: value },
    }));
  };

  const deleteData = () => {
    if (!window.confirm('Delete the saved self-reflection session from this device?')) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageAvailable(false);
    }
    setSession(null);
  };

  const exportData = () => {
    if (!session) return;
    const exportedStatements = statements.map((statement) => ({
      id: statement.id,
      text: statement.text,
      dimension: statement.dimension,
      response: session.answers[statement.id] ?? null,
    }));
    downloadJson(`work-behavior-reflection-${session.sessionId}.json`, {
      notice:
        'Unvalidated self-reflection practice. This export is not an assessment of suitability.',
      exportedAt: new Date().toISOString(),
      contentVersion: session.contentVersion,
      session: {
        id: session.sessionId,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        status: session.status,
      },
      responses: exportedStatements,
      dimensionSummaries: results,
    });
  };

  if (!hydrated) {
    return (
      <div className="neo-page px-4 py-12 sm:px-6">
        <p className="mx-auto max-w-3xl font-bold" role="status">
          Loading local practice…
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">
                Work-behavior reflection
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none sm:text-7xl">
                Notice patterns. Keep the conclusions modest.
              </h1>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
                Reflect on ten everyday work-behavior dimensions using an original, transparent
                statement bank. Your session stays in this browser unless you export it.
              </p>
            </div>
            <Disclosure />
          </header>

          <section className="mt-12 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="border-2 border-slate-950 bg-white p-6 shadow-[6px_6px_0_#171717]">
              <h2 className="text-3xl font-black">Choose a practice set</h2>
              <p className="mt-3 leading-7 text-slate-700">
                Every set is spread across all ten dimensions. The default 100-statement set gives
                each dimension more coverage.
              </p>
              <fieldset className="mt-6">
                <legend className="font-black">Number of statements</legend>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {SESSION_SIZES.map((size) => (
                    <label
                      key={size}
                      className={`cursor-pointer border-2 border-slate-950 p-3 text-center font-black shadow-[3px_3px_0_#171717] focus-within:outline focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
                        selectedSize === size ? 'bg-blue-200' : 'bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="session-size"
                        value={size}
                        checked={selectedSize === size}
                        onChange={() => setSelectedSize(size)}
                        className="sr-only"
                      />
                      {size}
                    </label>
                  ))}
                </div>
              </fieldset>
              <button
                type="button"
                onClick={startSession}
                className="mt-7 w-full border-2 border-slate-950 bg-blue-300 px-6 py-4 text-lg font-black shadow-[5px_5px_0_#171717] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              >
                Start self-reflection
              </button>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-bold">
                <Link
                  href="/opi/methodology"
                  className="text-blue-800 underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  Methodology and provenance
                </Link>
                <span>Content {CONTENT_VERSION}</span>
              </div>
              {!storageAvailable && (
                <p className="mt-4 border-2 border-slate-950 bg-amber-100 p-3 text-sm font-bold" role="status">
                  Browser storage is unavailable. You can continue, but resuming later may not work.
                </p>
              )}
            </div>

            <div>
              <h2 className="text-3xl font-black">Ten disclosed dimensions</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {PRACTICE_DIMENSIONS.map((dimension, index) => (
                  <article
                    key={dimension.id}
                    className={`border-2 border-slate-950 p-4 shadow-[4px_4px_0_#171717] ${
                      index % 4 === 0
                        ? 'bg-pink-100'
                        : index % 4 === 1
                          ? 'bg-lime-100'
                          : index % 4 === 2
                            ? 'bg-amber-100'
                            : 'bg-blue-100'
                    }`}
                  >
                    <h3 className="text-lg font-black">{dimension.label}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                      {dimension.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (session.status === 'paused') {
    return (
      <div className="neo-page px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">Session paused</p>
          <h1 className="mt-4 text-5xl font-black">Continue when you are ready.</h1>
          <p className="mt-5 text-lg font-semibold leading-8 text-slate-700">
            {answeredCount} of {statements.length} statements are saved locally on this device.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateSession({ status: 'active' })}
              className="border-2 border-slate-950 bg-blue-300 px-6 py-4 font-black shadow-[5px_5px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              Resume session
            </button>
            <DataActions canExport={answeredCount > 0} onExport={exportData} onDelete={deleteData} />
          </div>
          <div className="mt-8">
            <Disclosure />
          </div>
        </div>
      </div>
    );
  }

  if (session.status === 'review') {
    const allAnswered = answeredCount === statements.length;
    return (
      <div className="neo-page px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">
                Review responses
              </p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">Check before summarizing.</h1>
              <p className="mt-4 font-semibold text-slate-700">
                {answeredCount} of {statements.length} answered
              </p>
            </div>
            <DataActions canExport={answeredCount > 0} onExport={exportData} onDelete={deleteData} />
          </header>

          <div className="mt-8 space-y-3">
            {statements.map((statement, index) => (
              <article
                key={statement.id}
                className="grid gap-3 border-2 border-slate-950 bg-white p-4 shadow-[4px_4px_0_#171717] sm:grid-cols-[1fr_16rem] sm:items-center"
              >
                <div className="flex gap-3">
                  <span className="font-mono text-sm font-black text-blue-800">{index + 1}</span>
                  <p className="font-bold leading-7">{statement.text}</p>
                </div>
                <label className="font-bold">
                  <span className="sr-only">Response for statement {index + 1}</span>
                  <select
                    value={session.answers[statement.id] ?? ''}
                    onChange={(event) =>
                      answerStatement(statement.id, Number(event.target.value) as LikertValue)
                    }
                    className="w-full border-2 border-slate-950 bg-white px-3 py-3 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <option value="" disabled>
                      Select a response
                    </option>
                    {LIKERT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </article>
            ))}
          </div>

          <div className="sticky bottom-4 mt-8 flex flex-wrap justify-between gap-3 border-2 border-slate-950 bg-amber-100 p-4 shadow-[5px_5px_0_#171717]">
            <button
              type="button"
              onClick={() => updateSession({ status: 'active' })}
              className="border-2 border-slate-950 bg-white px-5 py-3 font-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Return to statements
            </button>
            <button
              type="button"
              disabled={!allAnswered}
              onClick={() => updateSession({ status: 'complete' })}
              className="border-2 border-slate-950 bg-lime-300 px-5 py-3 font-black shadow-[3px_3px_0_#171717] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              View dimension summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (session.status === 'complete') {
    return (
      <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto max-w-5xl">
          <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">
                Dimension summary
              </p>
              <h1 className="mt-3 text-5xl font-black sm:text-7xl">A snapshot, not a verdict.</h1>
              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
                These averages only summarize how you answered this practice set. Use them as prompts
                for examples and reflection, not as fixed traits or selection guidance.
              </p>
            </div>
            <DataActions canExport onExport={exportData} onDelete={deleteData} />
          </header>

          <div className="mt-9">
            <Disclosure />
          </div>

          <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Dimension summaries">
            {PRACTICE_DIMENSIONS.map((dimension, index) => {
              const result = resultsByDimension.get(dimension.id);
              if (!result) return null;
              return (
                <article
                  key={dimension.id}
                  className={`border-2 border-slate-950 p-5 shadow-[5px_5px_0_#171717] ${
                    index % 4 === 0
                      ? 'bg-pink-100'
                      : index % 4 === 1
                        ? 'bg-lime-100'
                        : index % 4 === 2
                          ? 'bg-amber-100'
                          : 'bg-blue-100'
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-2xl font-black">{dimension.label}</h2>
                    <span className="font-mono text-lg font-black">{result.average.toFixed(1)} / 5</span>
                  </div>
                  <div
                    className="mt-4 h-4 border-2 border-slate-950 bg-white"
                    role="img"
                    aria-label={`${dimension.label}: ${result.average.toFixed(1)} out of 5`}
                  >
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${(result.average / 5) * 100}%` }}
                    />
                  </div>
                  <p className="mt-4 font-black">{describeAverage(result.average)}</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                    Based on {result.answered} responses. {dimension.description}
                  </p>
                </article>
              );
            })}
          </section>

          <div className="mt-9 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateSession({ status: 'review' })}
              className="border-2 border-slate-950 bg-white px-5 py-3 font-black shadow-[3px_3px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Review responses
            </button>
            <button
              type="button"
              onClick={() => {
                setSession(null);
                try {
                  window.localStorage.removeItem(STORAGE_KEY);
                } catch {
                  setStorageAvailable(false);
                }
              }}
              className="border-2 border-slate-950 bg-blue-300 px-5 py-3 font-black shadow-[3px_3px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Start a new set
            </button>
            <Link
              href="/opi/methodology"
              className="border-2 border-slate-950 bg-amber-100 px-5 py-3 font-black shadow-[3px_3px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Read methodology
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentStatement) {
    return (
      <div className="neo-page px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-black">This saved session cannot be opened.</h1>
          <button
            type="button"
            onClick={deleteData}
            className="mt-6 border-2 border-slate-950 bg-red-100 px-5 py-3 font-black shadow-[3px_3px_0_#171717]"
          >
            Delete local data
          </button>
        </div>
      </div>
    );
  }

  const currentAnswer = session.answers[currentStatement.id];
  const progress = ((session.currentIndex + 1) / statements.length) * 100;

  return (
    <div className="neo-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
              Statement {session.currentIndex + 1} of {statements.length}
            </p>
            <p className="mt-1 text-sm font-bold text-slate-700">{answeredCount} answered</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateSession({ status: 'paused' })}
              className="border-2 border-slate-950 bg-amber-100 px-4 py-2 text-sm font-black shadow-[3px_3px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Pause
            </button>
            <button
              type="button"
              onClick={() => updateSession({ status: 'review' })}
              className="border-2 border-slate-950 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Review
            </button>
          </div>
        </header>

        <div
          className="mt-5 h-4 border-2 border-slate-950 bg-white"
          role="progressbar"
          aria-label="Session progress"
          aria-valuemin={1}
          aria-valuemax={statements.length}
          aria-valuenow={session.currentIndex + 1}
        >
          <div className="h-full bg-blue-500 transition-[width]" style={{ width: `${progress}%` }} />
        </div>

        <section className="mt-7 border-2 border-slate-950 bg-white p-5 shadow-[7px_7px_0_#171717] sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
            Choose the response that fits best
          </p>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{currentStatement.text}</h1>

          <fieldset className="mt-8">
            <legend className="sr-only">Your response</legend>
            <div className="grid gap-3">
              {LIKERT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer items-center gap-4 border-2 border-slate-950 p-4 font-black shadow-[3px_3px_0_#171717] transition hover:-translate-y-0.5 focus-within:outline focus-within:outline-4 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
                    currentAnswer === option.value ? 'bg-blue-200' : 'bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name={`response-${currentStatement.id}`}
                    value={option.value}
                    checked={currentAnswer === option.value}
                    onChange={() => answerStatement(currentStatement.id, option.value)}
                    className="h-5 w-5 accent-blue-700"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            disabled={session.currentIndex === 0}
            onClick={() =>
              updateSession((current) => ({
                currentIndex: Math.max(0, current.currentIndex - 1),
              }))
            }
            className="border-2 border-slate-950 bg-white px-5 py-3 font-black shadow-[3px_3px_0_#171717] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Previous
          </button>
          {session.currentIndex < statements.length - 1 ? (
            <button
              type="button"
              disabled={currentAnswer === undefined}
              onClick={() =>
                updateSession((current) => ({
                  currentIndex: Math.min(statements.length - 1, current.currentIndex + 1),
                }))
              }
              className="border-2 border-slate-950 bg-blue-300 px-6 py-3 font-black shadow-[4px_4px_0_#171717] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Save and continue
            </button>
          ) : (
            <button
              type="button"
              disabled={answeredCount !== statements.length}
              onClick={() => updateSession({ status: 'review' })}
              className="border-2 border-slate-950 bg-lime-300 px-6 py-3 font-black shadow-[4px_4px_0_#171717] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              Review all responses
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-sm font-bold text-slate-600">
          Autosaved locally · No account or server upload · Content {CONTENT_VERSION}
        </p>
      </div>
    </div>
  );
}
