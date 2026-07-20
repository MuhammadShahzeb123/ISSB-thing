'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface StudyRank {
  rank: string;
  category: string;
  natoCode: string;
  stars: number;
  description: string;
  nextRank: string;
  payScale: string;
}

type Rating = 'again' | 'hard' | 'easy';

interface ReviewState {
  dueAt: number;
  reviews: number;
  streak: number;
  lastRating: Rating;
}

type ReviewProgress = Record<string, ReviewState>;

interface RankStudyViewProps {
  title: string;
  subtitle: string;
  ranks: StudyRank[];
  categoryColors: Record<string, string>;
  pathNotes: string[];
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

const DAY = 24 * 60 * 60 * 1000;

export default function RankStudyView({
  title,
  subtitle,
  ranks,
  categoryColors,
  pathNotes,
}: RankStudyViewProps) {
  const storageKey = 'issb-rank-review-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const [mode, setMode] = useState<'flashcards' | 'ladder'>('flashcards');
  const [progress, setProgress] = useState<ReviewProgress>({});
  const [deck, setDeck] = useState<StudyRank[]>(() => shuffle(ranks));
  const [cardIndex, setCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [now, setNow] = useState(0);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setProgress(JSON.parse(saved) as ReviewProgress);
      } catch {
        // A private browsing session may disable localStorage; the deck still works.
      } finally {
        hasHydrated.current = true;
        setNow(Date.now());
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Progress is a convenience, not a reason to block practice.
    }
  }, [progress, storageKey]);

  const dueCount = useMemo(
    () => ranks.filter((rank) => !progress[rank.rank] || progress[rank.rank].dueAt <= now).length,
    [now, progress, ranks],
  );
  const reviewedCount = Object.keys(progress).length;
  const currentCard = deck[cardIndex];

  const startSession = useCallback(() => {
    const timestamp = Date.now();
    const due = ranks.filter((rank) => !progress[rank.rank] || progress[rank.rank].dueAt <= timestamp);
    const notDue = ranks.filter((rank) => progress[rank.rank] && progress[rank.rank].dueAt > timestamp);
    const session = [...shuffle(due), ...shuffle(notDue)];

    setDeck(session.length ? session : shuffle(ranks));
    setCardIndex(0);
    setIsRevealed(false);
    setSessionComplete(false);
    setMode('flashcards');
  }, [progress, ranks]);

  const rateCard = useCallback(
    (rating: Rating) => {
      if (!currentCard) return;

      const previous = progress[currentCard.rank];
      const interval = rating === 'again' ? 10 * 60 * 1000 : rating === 'hard' ? DAY : 4 * DAY;
      const nextProgress: ReviewState = {
        dueAt: Date.now() + interval,
        reviews: (previous?.reviews ?? 0) + 1,
        streak: rating === 'again' ? 0 : (previous?.streak ?? 0) + 1,
        lastRating: rating,
      };

      setProgress((current) => ({ ...current, [currentCard.rank]: nextProgress }));

      if (cardIndex >= deck.length - 1) {
        setSessionComplete(true);
      } else {
        setCardIndex((current) => current + 1);
        setIsRevealed(false);
      }
    },
    [cardIndex, currentCard, deck.length, progress],
  );

  const resetProgress = () => {
    setProgress({});
    setDeck(shuffle(ranks));
    setCardIndex(0);
    setIsRevealed(false);
    setSessionComplete(false);
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-amber-400">Spaced rank review</p>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="mx-auto max-w-2xl text-slate-400">{subtitle}</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            [String(ranks.length), 'rank cards'],
            [String(dueCount), 'due for review'],
            [String(reviewedCount), 'reviewed on this device'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="mt-1 text-sm text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              type="button"
              onClick={() => setMode('flashcards')}
              className={mode === 'flashcards' ? 'rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950' : 'rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:text-white'}
            >
              Recall cards
            </button>
            <button
              type="button"
              onClick={() => setMode('ladder')}
              className={mode === 'ladder' ? 'rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950' : 'rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:text-white'}
            >
              Full hierarchy
            </button>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={startSession} className="rounded-lg border border-amber-700/60 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:border-amber-400 hover:text-amber-200">
              Review due cards
            </button>
            <button type="button" onClick={resetProgress} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-500 transition hover:border-slate-500 hover:text-slate-300">
              Reset
            </button>
          </div>
        </div>

        {mode === 'flashcards' ? (
          <section className="rounded-3xl border border-amber-900/50 bg-amber-950/15 p-5 shadow-2xl shadow-amber-950/10 md:p-8">
            {sessionComplete ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Review complete</p>
                <h2 className="mb-3 text-3xl font-bold text-white">Nice work.</h2>
                <p className="mb-6 max-w-md text-slate-400">Your ratings are saved locally. Cards rated Again return in about ten minutes; Hard returns tomorrow; Easy returns in four days.</p>
                <button type="button" onClick={startSession} className="rounded-xl bg-amber-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-400">
                  Start another review
                </button>
              </div>
            ) : currentCard ? (
              <>
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">Active recall</p>
                    <p className="mt-1 text-sm text-slate-500">Card {cardIndex + 1} of {deck.length}</p>
                  </div>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-800 sm:w-56">
                    <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: ((cardIndex + 1) / deck.length) * 100 + '%' }} />
                  </div>
                </div>

                <div className="mx-auto max-w-3xl text-center">
                  <p className="mb-4 text-sm text-slate-500">Recall the category, NATO code, and next rank before revealing.</p>
                  <h2 className="mb-8 text-4xl font-bold text-white md:text-6xl">{currentCard.rank}</h2>

                  {!isRevealed ? (
                    <button type="button" onClick={() => setIsRevealed(true)} className="rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400">
                      Reveal rank details
                    </button>
                  ) : (
                    <>
                      <div className="grid gap-3 text-left sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                          <p className="text-xs uppercase tracking-widest text-slate-500">Next rank</p>
                          <p className="mt-2 text-xl font-semibold text-emerald-300">{currentCard.nextRank === 'None' ? 'End of hierarchy' : currentCard.nextRank}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                          <p className="text-xs uppercase tracking-widest text-slate-500">Category / code</p>
                          <p className="mt-2 text-xl font-semibold text-cyan-300">{currentCard.category} · {currentCard.natoCode}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:col-span-2">
                          <p className="text-xs uppercase tracking-widest text-slate-500">Memory cue</p>
                          <p className="mt-2 text-slate-300">{currentCard.description} <span className="text-slate-500">({currentCard.payScale})</span></p>
                        </div>
                      </div>
                      <p className="mt-7 mb-3 text-sm text-slate-500">How easy was the recall?</p>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {[
                          ['again', 'Again', '10 min'],
                          ['hard', 'Hard', 'Tomorrow'],
                          ['easy', 'Easy', '4 days'],
                        ].map(([rating, label, timing]) => (
                          <button
                            type="button"
                            key={rating}
                            onClick={() => rateCard(rating as Rating)}
                            className={rating === 'again' ? 'rounded-xl border border-red-900/70 bg-red-950/25 px-4 py-3 text-left transition hover:border-red-500' : rating === 'hard' ? 'rounded-xl border border-amber-900/70 bg-amber-950/25 px-4 py-3 text-left transition hover:border-amber-500' : 'rounded-xl border border-emerald-900/70 bg-emerald-950/25 px-4 py-3 text-left transition hover:border-emerald-500'}
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
              <div className="p-8 text-center text-slate-500">No rank cards available.</div>
            )}
          </section>
        ) : (
          <section className="space-y-3">
            <div className="flex flex-wrap justify-center gap-2 pb-3">
              {Object.entries(categoryColors).map(([category, colors]) => (
                <span key={category} className={'rounded-full border px-3 py-1 text-sm font-semibold ' + colors}>{category}</span>
              ))}
            </div>
            {ranks.map((rank, index) => (
              <div key={rank.rank} className={'rounded-2xl border p-5 transition hover:border-amber-600/60 ' + (categoryColors[rank.category] ?? 'border-slate-700 bg-slate-900/60 text-slate-300')}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="min-w-8 text-right font-mono text-2xl font-bold text-slate-600">{index + 1}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{rank.rank}</h3>
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-400">{rank.natoCode}</span>
                        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-xs text-slate-400">{rank.payScale}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{rank.description}</p>
                    </div>
                  </div>
                  <div className="md:min-w-52">
                    <span className="text-sm text-slate-500">Next: </span>
                    <span className="text-sm font-semibold text-emerald-300">{rank.nextRank === 'None' ? '—' : rank.nextRank}</span>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">How to retain this hierarchy</h2>
              <p className="text-sm text-slate-500">Short sessions beat one long reread.</p>
            </div>
            <span className="rounded-full border border-emerald-900/60 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-300">Recall · space · mix</span>
          </div>
          <ul className="grid gap-2 text-sm text-slate-400 md:grid-cols-2">
            {pathNotes.map((note) => <li key={note}>• {note}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
