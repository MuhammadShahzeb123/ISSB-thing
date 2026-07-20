'use client';

import type { ReactNode } from 'react';
import { useSpacedRepetitionDeck } from '@/app/lib/useSpacedRepetitionDeck';
import type { Rating } from '@/app/lib/spacedRepetition';

interface SpacedRepetitionDeckProps<T> {
  storageKey: string;
  items: T[];
  getId: (item: T) => string;
  renderFront: (item: T) => ReactNode;
  renderBack: (item: T) => ReactNode;
  accentColor?: 'cyan' | 'amber' | 'violet' | 'emerald';
  emptyLabel?: string;
}

const ACCENTS = {
  cyan: { border: 'border-cyan-900/50', bg: 'bg-cyan-950/15', button: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950', bar: 'bg-cyan-400', label: 'text-cyan-300' },
  amber: { border: 'border-amber-900/50', bg: 'bg-amber-950/15', button: 'bg-amber-500 hover:bg-amber-400 text-slate-950', bar: 'bg-amber-400', label: 'text-amber-300' },
  violet: { border: 'border-violet-900/50', bg: 'bg-violet-950/15', button: 'bg-violet-500 hover:bg-violet-400 text-white', bar: 'bg-violet-500', label: 'text-violet-300' },
  emerald: { border: 'border-emerald-900/50', bg: 'bg-emerald-950/15', button: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950', bar: 'bg-emerald-400', label: 'text-emerald-300' },
} as const;

export default function SpacedRepetitionDeck<T>({
  storageKey,
  items,
  getId,
  renderFront,
  renderBack,
  accentColor = 'cyan',
  emptyLabel = 'No cards available.',
}: SpacedRepetitionDeckProps<T>) {
  const {
    deck,
    currentCard,
    cardIndex,
    isRevealed,
    reveal,
    rate,
    sessionComplete,
    dueCount,
    reviewedCount,
    startSession,
    resetProgress,
  } = useSpacedRepetitionDeck<T>({ storageKey, items, getId });

  const accent = ACCENTS[accentColor];

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-500">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        {[
          [String(items.length), 'cards in this deck'],
          [String(dueCount), 'due for review'],
          [String(reviewedCount), 'reviewed on this device'],
        ].map(([value, label]) => (
          <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-end gap-2">
        <button
          type="button"
          onClick={startSession}
          className={'rounded-lg border px-4 py-2 text-sm font-semibold transition ' + accent.border + ' ' + accent.label}
        >
          Review due cards
        </button>
        <button
          type="button"
          onClick={resetProgress}
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-500 transition hover:border-slate-500 hover:text-slate-300"
        >
          Reset progress
        </button>
      </div>

      <section className={'rounded-3xl border p-5 shadow-2xl md:p-8 ' + accent.border + ' ' + accent.bg}>
        {sessionComplete ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Review complete</p>
            <h2 className="mb-3 text-3xl font-bold text-white">Nice work.</h2>
            <p className="mb-6 max-w-md text-slate-400">
              Ratings are saved on this device. Again brings a card back in about ten minutes; Hard and Easy
              space it out further each time you get it right.
            </p>
            <button type="button" onClick={startSession} className={'rounded-xl px-6 py-3 font-semibold transition ' + accent.button}>
              Start another review
            </button>
          </div>
        ) : currentCard ? (
          <>
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-500">Card {cardIndex + 1} of {deck.length}</p>
              <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800 sm:w-56">
                <div
                  className={'h-full rounded-full transition-all ' + accent.bar}
                  style={{ width: ((cardIndex + 1) / deck.length) * 100 + '%' }}
                />
              </div>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-8 text-3xl font-bold text-white md:text-5xl">{renderFront(currentCard)}</div>

              {!isRevealed ? (
                <button type="button" onClick={reveal} className={'rounded-xl px-8 py-4 font-bold shadow-lg transition ' + accent.button}>
                  Reveal answer
                </button>
              ) : (
                <>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-left">{renderBack(currentCard)}</div>
                  <p className="mb-3 mt-8 text-sm text-slate-400">How easy was that recall?</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(
                      [
                        ['again', 'Again', '10 min'],
                        ['hard', 'Hard', 'Grows slowly'],
                        ['easy', 'Easy', 'Grows fastest'],
                      ] as const
                    ).map(([rating, label, timing]) => (
                      <button
                        type="button"
                        key={rating}
                        onClick={() => rate(rating as Rating)}
                        className={
                          rating === 'again'
                            ? 'rounded-xl border border-red-900/70 bg-red-950/25 px-4 py-3 text-left transition hover:border-red-500'
                            : rating === 'hard'
                            ? 'rounded-xl border border-amber-900/70 bg-amber-950/25 px-4 py-3 text-left transition hover:border-amber-500'
                            : 'rounded-xl border border-emerald-900/70 bg-emerald-950/25 px-4 py-3 text-left transition hover:border-emerald-500'
                        }
                      >
                        <span className="block font-semibold text-white">{label}</span>
                        <span className="text-xs text-slate-500">{timing}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-slate-500">{emptyLabel}</div>
        )}
      </section>
    </div>
  );
}
