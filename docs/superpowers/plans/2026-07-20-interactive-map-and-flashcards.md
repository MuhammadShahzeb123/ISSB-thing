# Interactive World Map + Anki-style Flashcards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the world map on `/countries` zoomable/pannable with an on-map capital tooltip, split that page into Explore/Study modes, and add a real SM-2 (Anki-style) spaced-repetition flashcard system shared by `/countries` and all three tabs of `/ministers`.

**Architecture:** A pure SM-2 scheduling function and a `useSpacedRepetitionDeck` hook live in `app/lib/`, consumed by a generic `<SpacedRepetitionDeck>` UI component in `app/components/`. `/countries` and `/ministers` each plug their own data and card-content renderers into that shared component. The map's zoom/pan comes from `react-zoom-pan-pinch`; the capital tooltip is computed from `getBoundingClientRect()` so it stays correctly anchored regardless of zoom level.

**Tech Stack:** Next.js 16 (App Router, `'use client'` pages), React 19, TypeScript (strict), Tailwind CSS v4, `react-zoom-pan-pinch` (new dependency). No test framework is installed; see Global Constraints for how correctness is verified.

## Global Constraints

- Do not modify `app/components/RankStudyView.tsx` or `app/study/page.tsx` — they keep their existing fixed-interval (10min/1day/4day) scheduling, per the approved spec's non-goals.
- Do not modify `app/quiz/page.tsx`.
- Persistence is `localStorage` only, following the existing hydration pattern (`hasHydrated` ref + `setTimeout(0)` on mount) used in `RankStudyView.tsx` and `app/study/page.tsx` — no backend.
- Flashcard direction is "identifier → who/what holds it" (country → capital, portfolio/role → person), not the reverse. This was an explicit judgment call the user approved.
- New dependency allowed: `react-zoom-pan-pinch` (peer deps `{ react: '*', 'react-dom': '*' }` — confirmed compatible with the installed React 19 / Next 16 stack via `npm view react-zoom-pan-pinch peerDependencies`).
- No test runner is installed in this project (confirmed via `package.json` — only `eslint`/`typescript` devDependencies) and the approved spec scopes testing to: automated checks for pure logic via Node's built-in TypeScript type-stripping (Node v22.16.0 is installed, which supports `--experimental-strip-types`), `tsc`/`eslint` for shared UI infra, and manual dev-server verification for the two pages. Do not add Jest/Vitest/Testing Library — that would be unapproved scope.
- Every task must still pass `npm run lint` and, at the end (Task 6), `npm run build`.
- Code style: single quotes, semicolons, 2-space indent, Tailwind utility classes inline — match the existing files exactly (see `app/countries/page.tsx`, `app/ministers/page.tsx`, `app/components/RankStudyView.tsx` for the conventions already in use).

---

### Task 1: Pure SM-2 scheduling engine

**Files:**
- Create: `app/lib/spacedRepetition.ts`
- Create: `scripts/verify-spaced-repetition.ts`

**Interfaces:**
- Produces: `export type Rating = 'again' | 'hard' | 'easy'`; `export interface CardState { easeFactor: number; intervalDays: number; repetitions: number; dueAt: number }`; `export type DeckProgress = Record<string, CardState>`; `export const NEW_CARD_STATE: CardState`; `export function scheduleReview(previous: CardState | undefined, rating: Rating, now: number): CardState`; `export function shuffle<T>(items: T[]): T[]`; `export function buildSession<T>(items: T[], progress: DeckProgress, getId: (item: T) => string, now: number): T[]`. Task 2's hook imports all of these from `@/app/lib/spacedRepetition`.

- [ ] **Step 1: Write the verification script (it will fail — the module doesn't exist yet)**

Create `scripts/verify-spaced-repetition.ts`:

```ts
import assert from 'node:assert/strict';
import { scheduleReview, buildSession, type CardState } from '../app/lib/spacedRepetition.ts';

const now = 1_700_000_000_000;

// New card rated Easy: first success is always a fixed 1-day step.
const afterFirstEasy = scheduleReview(undefined, 'easy', now);
assert.equal(afterFirstEasy.repetitions, 1);
assert.equal(afterFirstEasy.intervalDays, 1);
assert.equal(afterFirstEasy.easeFactor, 2.65);
assert.equal(afterFirstEasy.dueAt, now + 24 * 60 * 60 * 1000);

// Second success is always a fixed 6-day step.
const afterSecondEasy = scheduleReview(afterFirstEasy, 'easy', now);
assert.equal(afterSecondEasy.repetitions, 2);
assert.equal(afterSecondEasy.intervalDays, 6);
assert.equal(afterSecondEasy.easeFactor, 2.8);

// Third success compounds: round(previousInterval * easeFactor).
const afterThirdEasy = scheduleReview(afterSecondEasy, 'easy', now);
assert.equal(afterThirdEasy.repetitions, 3);
assert.equal(afterThirdEasy.easeFactor, 2.95);
assert.equal(afterThirdEasy.intervalDays, 18); // round(6 * 2.95) = round(17.7)

// A fresh card rated Hard still gets the fixed 1-day first step, but a lower ease factor.
const afterFirstHard = scheduleReview(undefined, 'hard', now);
assert.equal(afterFirstHard.repetitions, 1);
assert.equal(afterFirstHard.intervalDays, 1);
assert.equal(afterFirstHard.easeFactor, 2.35);

// Again is a lapse: resets repetitions/interval, drops ease factor, reschedules ~10 minutes out.
const afterLapse = scheduleReview(afterThirdEasy, 'again', now);
assert.equal(afterLapse.repetitions, 0);
assert.equal(afterLapse.intervalDays, 0);
assert.equal(afterLapse.easeFactor, 2.75); // 2.95 - 0.2
assert.equal(afterLapse.dueAt, now + 10 * 60 * 1000);

// Ease factor never drops below the 1.3 floor, even after repeated lapses.
const lowEaseState: CardState = { easeFactor: 1.35, intervalDays: 0, repetitions: 0, dueAt: now };
const afterFlooredLapse = scheduleReview(lowEaseState, 'again', now);
assert.equal(afterFlooredLapse.easeFactor, 1.3);

// buildSession puts due cards first (shuffled) and not-due cards after (shuffled), covering every item once.
const items = ['a', 'b', 'c', 'd'];
const progress = {
  a: { easeFactor: 2.5, intervalDays: 5, repetitions: 1, dueAt: now + 100_000 }, // not due
  b: { easeFactor: 2.5, intervalDays: 5, repetitions: 1, dueAt: now - 100_000 }, // due
};
const session = buildSession(items, progress, (item) => item, now);
assert.equal(session.length, 4);
assert.deepEqual([...session].sort(), ['a', 'b', 'c', 'd']);
const notDueIndex = session.indexOf('a');
const dueIndexB = session.indexOf('b');
assert.ok(dueIndexB < notDueIndex, 'due cards should be scheduled before not-due cards');

console.log('All spaced-repetition scheduling checks passed.');
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `node --experimental-strip-types scripts/verify-spaced-repetition.ts`
Expected: an error resolving `../app/lib/spacedRepetition.ts` (Cannot find module), because the file doesn't exist yet. (Ignore the `ExperimentalWarning: Type Stripping is an experimental feature` line — that's expected noise, not a failure.)

- [ ] **Step 3: Implement the scheduling engine**

Create `app/lib/spacedRepetition.ts`:

```ts
export type Rating = 'again' | 'hard' | 'easy';

export interface CardState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: number;
}

export type DeckProgress = Record<string, CardState>;

export const NEW_CARD_STATE: CardState = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  dueAt: 0,
};

const MIN_EASE_FACTOR = 1.3;
const LAPSE_INTERVAL_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Ease factor is rounded to 2 decimal places on every update so repeated
// +/-0.15 adjustments don't accumulate IEEE-754 floating point noise
// (e.g. 2.8 + 0.15 is 2.9499999999999997, not 2.95).
function roundEase(value: number): number {
  return Math.round(value * 100) / 100;
}

export function scheduleReview(previous: CardState | undefined, rating: Rating, now: number): CardState {
  const state = previous ?? NEW_CARD_STATE;

  if (rating === 'again') {
    const easeFactor = Math.max(MIN_EASE_FACTOR, roundEase(state.easeFactor - 0.2));
    return { easeFactor, intervalDays: 0, repetitions: 0, dueAt: now + LAPSE_INTERVAL_MS };
  }

  const easeDelta = rating === 'hard' ? -0.15 : 0.15;
  const easeFactor = Math.max(MIN_EASE_FACTOR, roundEase(state.easeFactor + easeDelta));
  const repetitions = state.repetitions + 1;

  let intervalDays: number;
  if (repetitions === 1) {
    intervalDays = 1;
  } else if (repetitions === 2) {
    intervalDays = 6;
  } else {
    const growth = rating === 'hard' ? Math.max(1.2, easeFactor - 0.3) : easeFactor;
    intervalDays = Math.max(1, Math.round(state.intervalDays * growth));
  }

  return { easeFactor, intervalDays, repetitions, dueAt: now + intervalDays * DAY_MS };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function buildSession<T>(
  items: T[],
  progress: DeckProgress,
  getId: (item: T) => string,
  now: number,
): T[] {
  const due = items.filter((item) => {
    const state = progress[getId(item)];
    return !state || state.dueAt <= now;
  });
  const notDue = items.filter((item) => {
    const state = progress[getId(item)];
    return state && state.dueAt > now;
  });
  return [...shuffle(due), ...shuffle(notDue)];
}
```

- [ ] **Step 4: Run the verification script again and confirm it passes**

Run: `node --experimental-strip-types scripts/verify-spaced-repetition.ts`
Expected: prints `All spaced-repetition scheduling checks passed.` and exits with code 0 (again, ignore the `ExperimentalWarning` line).

- [ ] **Step 5: Lint and commit**

Run: `npm run lint`
Expected: no errors.

```bash
git add app/lib/spacedRepetition.ts scripts/verify-spaced-repetition.ts
git commit -m "feat: add SM-2 spaced-repetition scheduling engine"
```

---

### Task 2: Shared spaced-repetition hook and deck UI component

**Files:**
- Create: `app/lib/useSpacedRepetitionDeck.ts`
- Create: `app/components/SpacedRepetitionDeck.tsx`

**Interfaces:**
- Consumes: `scheduleReview`, `buildSession`, `type Rating`, `type DeckProgress` from `@/app/lib/spacedRepetition` (Task 1).
- Produces: `export function useSpacedRepetitionDeck<T>(options: { storageKey: string; items: T[]; getId: (item: T) => string }): { deck: T[]; currentCard: T | undefined; cardIndex: number; isRevealed: boolean; reveal: () => void; rate: (rating: Rating) => void; sessionComplete: boolean; dueCount: number; reviewedCount: number; startSession: () => void; resetProgress: () => void }` from `@/app/lib/useSpacedRepetitionDeck`. `export default function SpacedRepetitionDeck<T>(props: { storageKey: string; items: T[]; getId: (item: T) => string; renderFront: (item: T) => ReactNode; renderBack: (item: T) => ReactNode; accentColor?: 'cyan' | 'amber' | 'violet' | 'emerald'; emptyLabel?: string }): JSX.Element` from `@/app/components/SpacedRepetitionDeck`. Tasks 4 and 5 render this with `key={storageKey}` so each deck fully remounts (and re-initializes) when a page switches which dataset it studies.

- [ ] **Step 1: Write the hook**

Create `app/lib/useSpacedRepetitionDeck.ts`:

```ts
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildSession, scheduleReview, type DeckProgress, type Rating } from '@/app/lib/spacedRepetition';

interface UseSpacedRepetitionDeckOptions<T> {
  storageKey: string;
  items: T[];
  getId: (item: T) => string;
}

interface UseSpacedRepetitionDeckResult<T> {
  deck: T[];
  currentCard: T | undefined;
  cardIndex: number;
  isRevealed: boolean;
  reveal: () => void;
  rate: (rating: Rating) => void;
  sessionComplete: boolean;
  dueCount: number;
  reviewedCount: number;
  startSession: () => void;
  resetProgress: () => void;
}

export function useSpacedRepetitionDeck<T>({
  storageKey,
  items,
  getId,
}: UseSpacedRepetitionDeckOptions<T>): UseSpacedRepetitionDeckResult<T> {
  const [progress, setProgress] = useState<DeckProgress>({});
  const [deck, setDeck] = useState<T[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [now, setNow] = useState(0);
  const hasHydrated = useRef(false);
  const didInit = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setProgress(JSON.parse(saved) as DeckProgress);
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
    () =>
      items.filter((item) => {
        const state = progress[getId(item)];
        return !state || state.dueAt <= now;
      }).length,
    [items, getId, progress, now],
  );
  const reviewedCount = Object.keys(progress).length;
  const currentCard = deck[cardIndex];

  const startSession = useCallback(() => {
    setDeck(buildSession(items, progress, getId, Date.now()));
    setCardIndex(0);
    setIsRevealed(false);
    setSessionComplete(false);
  }, [items, progress, getId]);

  useEffect(() => {
    if (didInit.current || now === 0) return;
    didInit.current = true;
    startSession();
    // Only ever auto-starts once, right after localStorage progress has hydrated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const reveal = useCallback(() => setIsRevealed(true), []);

  const rate = useCallback(
    (rating: Rating) => {
      if (!currentCard) return;
      const id = getId(currentCard);
      const nextState = scheduleReview(progress[id], rating, Date.now());
      setProgress((current) => ({ ...current, [id]: nextState }));

      if (cardIndex >= deck.length - 1) {
        setSessionComplete(true);
      } else {
        setCardIndex((index) => index + 1);
        setIsRevealed(false);
      }
    },
    [cardIndex, currentCard, deck.length, getId, progress],
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    setDeck([]);
    setCardIndex(0);
    setIsRevealed(false);
    setSessionComplete(false);
    didInit.current = false;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
  }, [storageKey]);

  return {
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
  };
}
```

- [ ] **Step 2: Write the generic deck UI component**

Create `app/components/SpacedRepetitionDeck.tsx`:

```tsx
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
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/lib/useSpacedRepetitionDeck.ts app/components/SpacedRepetitionDeck.tsx
git commit -m "feat: add shared spaced-repetition deck hook and UI component"
```

---

### Task 3: Map zoom/pan and anchored capital tooltip

**Files:**
- Modify: `app/countries/page.tsx` (the `WorldAtlas` function only — leave `CountriesPage` untouched, Task 4 handles it)
- Modify: `app/globals.css:28-78` (the `.world-map-*` rules)
- Modify: `package.json` (new dependency)

**Interfaces:**
- Produces: `WorldAtlas`'s rendered DOM now includes zoom controls and a tooltip layer; its props (`WorldAtlasProps`) and exported behavior (`onHover`, `onSelect` callbacks) are unchanged, so Task 4 doesn't need to know anything new about it.

- [ ] **Step 1: Install the pan/zoom library**

Run: `npm install react-zoom-pan-pinch`
Expected: `package.json` gains a new `"react-zoom-pan-pinch": "^<version>"` line under `dependencies`, and `npm install` exits 0.

- [ ] **Step 2: Replace the `WorldAtlas` function**

In `app/countries/page.tsx`, add this import alongside the existing `'use client'` import block at the top of the file:

```ts
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
```

Then replace the entire `WorldAtlas` function (currently the block starting at `function WorldAtlas({ selectedCountry, visibleCountries, onHover, onSelect }: WorldAtlasProps) {` through its closing `}`) with:

```tsx
function WorldAtlas({ selectedCountry, visibleCountries, onHover, onSelect }: WorldAtlasProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [svgMarkup, setSvgMarkup] = useState('');
  const [tooltip, setTooltip] = useState<{ country: Country; x: number; y: number } | null>(null);
  const visibleNames = useMemo(
    () => new Set(visibleCountries.map((country) => country.country)),
    [visibleCountries],
  );

  useEffect(() => {
    let cancelled = false;

    fetch('/world.svg')
      .then((response) => response.text())
      .then((markup) => {
        if (!cancelled) setSvgMarkup(markup);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup('');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const positionTooltip = useCallback((path: SVGPathElement, country: Country) => {
    const shell = shellRef.current;
    if (!shell) return;
    const pathRect = path.getBoundingClientRect();
    const shellRect = shell.getBoundingClientRect();
    setTooltip({
      country,
      x: pathRect.left + pathRect.width / 2 - shellRect.left,
      y: pathRect.top + pathRect.height / 2 - shellRect.top,
    });
  }, []);

  useEffect(() => {
    if (!svgMarkup || !mapRef.current) return;

    const paths = Array.from(mapRef.current.querySelectorAll<SVGPathElement>('path'));
    const cleanups: Array<() => void> = [];

    paths.forEach((path) => {
      const classLabel = (path.getAttribute('class') ?? '')
        .replace(/\b(world-map-country|is-muted|is-selected)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const label =
        path.dataset.country ??
        path.getAttribute('name') ??
        classLabel;
      const country = countryForMapLabel(label);

      if (!country) return;

      path.dataset.country = country.country;
      path.classList.add('world-map-country');
      path.setAttribute('role', 'button');
      path.setAttribute('tabindex', '0');
      path.setAttribute('aria-label', country.country + ', capital ' + country.capital);

      const isVisible = () => visibleNames.has(country.country);
      const handleHover = () => {
        if (!isVisible()) return;
        onHover(country);
        positionTooltip(path, country);
      };
      const handleLeave = () => {
        onHover(null);
        setTooltip(null);
      };
      const handleSelect = () => {
        if (isVisible()) onSelect(country);
      };
      const handleKeyDown = (event: Event) => {
        const keyboardEvent = event as KeyboardEvent;
        if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
          keyboardEvent.preventDefault();
          handleSelect();
        }
      };

      path.addEventListener('pointerenter', handleHover);
      path.addEventListener('pointerleave', handleLeave);
      path.addEventListener('focus', handleHover);
      path.addEventListener('blur', handleLeave);
      path.addEventListener('click', handleSelect);
      path.addEventListener('keydown', handleKeyDown);

      cleanups.push(() => {
        path.removeEventListener('pointerenter', handleHover);
        path.removeEventListener('pointerleave', handleLeave);
        path.removeEventListener('focus', handleHover);
        path.removeEventListener('blur', handleLeave);
        path.removeEventListener('click', handleSelect);
        path.removeEventListener('keydown', handleKeyDown);
      });
    });

    paths.forEach((path) => {
      const countryName = path.dataset.country;
      path.classList.toggle('is-muted', Boolean(countryName && !visibleNames.has(countryName)));
      path.classList.toggle('is-selected', countryName === selectedCountry?.country);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [onHover, onSelect, positionTooltip, selectedCountry, svgMarkup, visibleNames]);

  return (
    <div className="world-map-shell" ref={shellRef} aria-label="Interactive world map">
      {svgMarkup ? (
        <>
          <TransformWrapper ref={transformRef} minScale={1} maxScale={8} wheel={{ step: 0.15 }} doubleClick={{ mode: 'zoomIn' }}>
            <TransformComponent wrapperClass="world-map-transform-wrapper" contentClass="world-map-transform-content">
              <div ref={mapRef} dangerouslySetInnerHTML={{ __html: svgMarkup }} />
            </TransformComponent>
          </TransformWrapper>
          <div className="world-map-zoom-controls">
            <button type="button" onClick={() => transformRef.current?.zoomIn()} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => transformRef.current?.zoomOut()} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => transformRef.current?.resetTransform()} aria-label="Reset zoom">Reset</button>
          </div>
          {tooltip && (
            <div className="world-map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
              <p className="world-map-tooltip-country">{tooltip.country.country}</p>
              <p className="world-map-tooltip-capital">{tooltip.country.capital}</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-500">
          Loading the atlas...
        </div>
      )}
      <p className="world-map-attribution">Map data: SimpleMaps.com · MIT License</p>
    </div>
  );
}
```

If TypeScript reports that `TransformWrapper`'s `ref`, `wheel`, or `doubleClick` props don't match this shape, check `node_modules/react-zoom-pan-pinch/dist/index.d.ts` for the exact exported types installed and adjust the usage to match (the imperative methods you need are zoom in, zoom out, and reset — the exact option-object shape may differ slightly between minor versions).

- [ ] **Step 3: Update the map styles**

In `app/globals.css`, replace the `.world-map-shell` and `.world-map-shell svg` rules (lines 28-42) with:

```css
.world-map-shell {
  position: relative;
  overflow: hidden;
  aspect-ratio: 2000 / 857;
  background:
    radial-gradient(circle at 50% 35%, rgba(8, 145, 178, 0.12), transparent 42%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.35), rgba(2, 6, 23, 0.18));
}

.world-map-transform-wrapper,
.world-map-transform-content {
  width: 100%;
  height: 100%;
}

.world-map-shell svg {
  display: block;
  width: 100%;
  height: 100%;
  padding: 1.25rem;
}

.world-map-zoom-controls {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.world-map-zoom-controls button {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: rgba(15, 23, 42, 0.85);
  color: #e2e8f0;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease;
}

.world-map-zoom-controls button:hover {
  border-color: rgba(34, 211, 238, 0.7);
  color: #22d3ee;
}

.world-map-tooltip {
  position: absolute;
  z-index: 30;
  transform: translate(-50%, -120%);
  pointer-events: none;
  padding: 0.4rem 0.65rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(34, 211, 238, 0.5);
  background: rgba(8, 15, 30, 0.92);
  box-shadow: 0 8px 20px rgba(2, 6, 23, 0.45);
  white-space: nowrap;
}

.world-map-tooltip-country {
  font-size: 0.8rem;
  font-weight: 700;
  color: #ffffff;
}

.world-map-tooltip-capital {
  font-size: 0.72rem;
  color: #67e8f9;
}
```

Leave the remaining rules (`.world-map-shell path.world-map-country` through `.world-map-attribution`, currently lines 44-78) unchanged.

- [ ] **Step 4: Manually verify in the browser**

Run: `npm run dev`, then open `http://localhost:3000/countries`.

Check:
- Scrolling the mouse wheel over the map zooms in/out; the `+`/`−`/Reset buttons in the top-right corner work too.
- Dragging pans the map; panning and zooming don't break clicking a country (click still selects it and updates the sidebar).
- Hovering (or tab-focusing) a country shows a small tooltip with its name and capital, anchored right over that country's shape — including after zooming in and panning around (the tooltip must stay correctly placed, not drift).
- Moving the mouse off a country (or blurring it) hides the tooltip.

- [ ] **Step 5: Lint and commit**

Run: `npm run lint`
Expected: no errors.

```bash
git add app/countries/page.tsx app/globals.css package.json package-lock.json
git commit -m "feat: add zoom/pan and an anchored capital tooltip to the world map"
```

---

### Task 4: Countries page — Explore/Study mode split

**Files:**
- Modify: `app/countries/page.tsx` (the `CountriesPage` function only; `WorldAtlas` from Task 3 is unchanged)

**Interfaces:**
- Consumes: `WorldAtlas` (Task 3, unchanged props), `SpacedRepetitionDeck` (Task 2) from `@/app/components/SpacedRepetitionDeck`, `Country` type (already defined at the top of this file).

- [ ] **Step 1: Replace the `CountriesPage` function**

In `app/countries/page.tsx`, add this import alongside the existing imports:

```ts
import SpacedRepetitionDeck from '@/app/components/SpacedRepetitionDeck';
```

Replace the entire `export default function CountriesPage() { ... }` function (from `export default function CountriesPage() {` to the final closing `}` of the file) with:

```tsx
export default function CountriesPage() {
  const [mode, setMode] = useState<'explore' | 'study'>('explore');
  const [search, setSearch] = useState('');
  const [filterContinent, setFilterContinent] = useState('All');
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries.find((country) => country.country === 'Pakistan') ?? countries[0],
  );
  const [studyPool, setStudyPool] = useState<Country[]>(countries);

  const continents = useMemo(() => {
    const set = new Set(countries.map((country) => country.continent));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    let result = [...countries];

    if (filterContinent !== 'All') {
      result = result.filter((country) => country.continent === filterContinent);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (country) =>
          country.country.toLowerCase().includes(query) ||
          country.capital.toLowerCase().includes(query),
      );
    }

    return result;
  }, [search, filterContinent]);

  const displayedCountry = hoveredCountry ?? selectedCountry;

  const selectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const openStudyMode = useCallback(() => {
    setStudyPool(filtered.length ? filtered : countries);
    setMode('study');
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Active recall atlas
          </p>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
            World Capitals Map
          </h1>
          <p className="mx-auto max-w-2xl text-slate-400">
            Hover or focus a country to see its capital. Scroll or use the zoom controls to get close
            enough to click any country, no matter how small.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              type="button"
              onClick={() => setMode('explore')}
              className={mode === 'explore' ? 'rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950' : 'rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:text-white'}
            >
              Explore map
            </button>
            <button
              type="button"
              onClick={openStudyMode}
              className={mode === 'study' ? 'rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950' : 'rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:text-white'}
            >
              Study cards
            </button>
          </div>
        </div>

        {mode === 'explore' ? (
          <>
            <div className="mb-5 flex flex-col gap-4 md:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a country or capital..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"
              />
              <select
                value={filterContinent}
                onChange={(event) => setFilterContinent(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500"
              >
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-2xl shadow-cyan-950/10">
                <div className="flex flex-col gap-2 border-b border-slate-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-white">Explore the atlas</h2>
                    <p className="text-sm text-slate-500">
                      {filtered.length} of {countries.length} countries in view
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-cyan-900/70 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300">
                    Hover or focus · scroll to zoom · click to pin
                  </span>
                </div>
                <WorldAtlas
                  selectedCountry={selectedCountry}
                  visibleCountries={filtered}
                  onHover={setHoveredCountry}
                  onSelect={selectCountry}
                />
              </section>

              <aside className="rounded-2xl border border-cyan-900/60 bg-cyan-950/25 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Selected country
                </p>
                {displayedCountry ? (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h2 className="text-2xl font-bold text-white">{displayedCountry.country}</h2>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        {displayedCountry.continent}
                      </span>
                    </div>
                    <p className="mb-1 text-sm text-slate-500">Capital</p>
                    <p className="text-xl font-semibold text-emerald-300">{displayedCountry.capital}</p>
                  </>
                ) : (
                  <p className="text-slate-400">Choose a country on the map.</p>
                )}
                <button
                  type="button"
                  onClick={openStudyMode}
                  className="mt-6 w-full rounded-lg border border-cyan-800/60 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  Study these on cards →
                </button>
              </aside>
            </div>
          </>
        ) : (
          <div>
            <p className="mb-5 text-center text-sm text-slate-500">
              Studying {studyPool.length === countries.length ? 'all countries' : studyPool.length + ' filtered countries'}.{' '}
              <button type="button" onClick={() => setMode('explore')} className="text-cyan-400 underline-offset-2 hover:underline">
                Back to the map
              </button>
            </p>
            <SpacedRepetitionDeck
              key="countries"
              storageKey="issb-sm2-countries"
              items={studyPool}
              getId={(country) => country.country}
              accentColor="cyan"
              renderFront={(country) => country.country}
              renderBack={(country) => (
                <>
                  <p className="text-xl font-semibold text-white">{country.capital}</p>
                  <p className="mt-2 text-sm text-slate-400">{country.continent}</p>
                </>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

This removes the old "Recall drill" card and the "Quick study queue" pill-list section entirely — both are superseded by Study mode.

- [ ] **Step 2: Manually verify in the browser**

Run: `npm run dev` (if not already running), open `http://localhost:3000/countries`.

Check:
- Default view is Explore mode: search box, continent filter, map, and a single "Selected country" sidebar card — no recall drill panel, no pill list below the map.
- Filter to one continent (e.g. "Oceania"), click "Study these on cards →" (or the "Study cards" toggle) — the deck should say "Studying N filtered countries" and only quiz Oceania countries.
- Complete a few cards: reveal, rate "Again" on one, "Easy" on another. Open DevTools → Application → Local Storage → `http://localhost:3000` and confirm a `issb-sm2-countries` key exists with per-country `easeFactor`/`intervalDays`/`repetitions`/`dueAt` fields that look sane (e.g., the "Again"-rated country has `repetitions: 0` and a `dueAt` about 10 minutes in the future).
- Reload the page, switch to Study mode again — due/reviewed counts should reflect the saved progress, not reset to zero.
- Click "Back to the map" — Explore mode should show correctly.

- [ ] **Step 3: Lint and commit**

Run: `npm run lint`
Expected: no errors.

```bash
git add app/countries/page.tsx
git commit -m "feat: split Countries page into Explore map and Study cards modes"
```

---

### Task 5: Ministers page — per-tab List/Study toggle

**Files:**
- Modify: `app/ministers/page.tsx` (entire file)

**Interfaces:**
- Consumes: `SpacedRepetitionDeck` (Task 2) from `@/app/components/SpacedRepetitionDeck`.

- [ ] **Step 1: Replace the whole file**

Replace the full contents of `app/ministers/page.tsx` with:

```tsx
'use client';

import { useState } from 'react';
import SpacedRepetitionDeck from '@/app/components/SpacedRepetitionDeck';

interface Minister {
  name: string;
  portfolio: string;
  party: string;
  additional?: string;
}

const ministers: Minister[] = [
  { name: "Mian Muhammad Shehbaz Sharif", portfolio: "Prime Minister", party: "PML(N)" },
  { name: "Mr. Mohammad Ishaq Dar", portfolio: "Foreign Affairs", party: "PML(N)", additional: "Deputy Prime Minister" },
  { name: "Mr. Muhammad Aurangzeb", portfolio: "Finance & Revenue", party: "PML(N)" },
  { name: "Khawaja Muhammad Asif", portfolio: "Defence", party: "PML(N)" },
  { name: "Syed Mohsin Raza Naqvi", portfolio: "Interior & Narcotics Control", party: "Independent" },
  { name: "Mr. Attaullah Tarar", portfolio: "Information & Broadcasting", party: "PML(N)" },
  { name: "Mr. Azam Nazeer Tarar", portfolio: "Law & Justice", party: "PML(N)", additional: "Human Rights" },
  { name: "Mr. Abdul Aleem Khan", portfolio: "Communication", party: "PML(N)" },
  { name: "Mr. Jam Kamal Khan", portfolio: "Commerce", party: "PML(N)" },
  { name: "Mr. Ahsan Iqbal Chaudry", portfolio: "Planning, Development & Special Initiatives", party: "PML(N)" },
  { name: "Dr. Khalid Maqbool Siddiqui", portfolio: "Federal Education & Professional Training", party: "MQM" },
  { name: "Rana Tanveer Hussain", portfolio: "National Food Security & Research", party: "PML(N)" },
  { name: "Engr. Amir Muqam", portfolio: "Kashmir Affairs, GB & SAFRAN", party: "PML(N)" },
  { name: "Sardar Awais Ahmad Khan Leghari", portfolio: "Power", party: "PML(N)" },
  { name: "Mr. Ahad Khan Cheema", portfolio: "Economic Affairs", party: "PML(N)", additional: "Establishment" },
  { name: "Mr. Musadik Masood Malik", portfolio: "Climate Change & Environmental Coordination", party: "PML(N)" },
  { name: "Mr. Qaiser Ahmed Sheikh", portfolio: "Board of Investment", party: "PML(N)" },
  { name: "Mian Riaz Hussain Pirzada", portfolio: "Housing & Works", party: "PML(N)" },
  { name: "Chaudhry Salik Hussain", portfolio: "Overseas Pakistanis & Human Resource Development", party: "PML(Q)" },
  { name: "Dr. Tariq Fazal Chaudhary", portfolio: "Parliamentary Affairs", party: "PML(N)" },
  { name: "Mr. Ali Pervaiz Malik", portfolio: "Petroleum", party: "PML(N)" },
  { name: "Mr. Aurangzeb Khan Khichi", portfolio: "National Heritage & Culture", party: "PML(N)" },
  { name: "Mr. Khalid Hussain Magsi", portfolio: "Science & Technology", party: "BAP" },
  { name: "Mr. Muhammad Hanif Abbasi", portfolio: "Railways", party: "PML(N)" },
  { name: "Mr. Muhammad Mueen Wattoo", portfolio: "Water Resources", party: "PML(N)" },
  { name: "Mr. Muhammad Junaid Anwar", portfolio: "Maritime Affairs", party: "PML(N)" },
  { name: "Syed Mustafa Kamal", portfolio: "National Health Services, Regulations & Coordination", party: "MQM" },
  { name: "Mr. Muhammad Raza Hayat Harraj", portfolio: "Defence Production", party: "PML(N)" },
  { name: "Ms. Shaza Fatima Khawaja", portfolio: "Information Technology & Telecommunication", party: "PML(N)" },
  { name: "Rana Mubashar Iqbal", portfolio: "Public Affairs Unit", party: "PML(N)" },
  { name: "Syed Imran Ahmad Shah", portfolio: "Poverty Alleviation & Social Safety", party: "PML(N)" },
  { name: "Sardar Muhammad Yousaf", portfolio: "Religious Affairs & Interfaith Harmony", party: "PML(N)" },
];

const topOfficials = [
  { name: "Asif Ali Zardari", role: "President of Pakistan", party: "PPP" },
  { name: "Mian Muhammad Shehbaz Sharif", role: "Prime Minister", party: "PML(N)" },
  { name: "Justice Yahya Afridi", role: "Chief Justice of Pakistan", party: "N/A" },
  { name: "Syed Yousaf Raza Gillani", role: "Chairman Senate", party: "PPP" },
  { name: "Sardar Ayaz Sadiq", role: "Speaker National Assembly", party: "PML(N)" },
];

const armedForces = [
  { name: "General Asim Munir", role: "Chief of Army Staff (COAS)", branch: "Pakistan Army" },
  { name: "Air Chief Marshal Zaheer Ahmad Babar", role: "Chief of Air Staff", branch: "Pakistan Air Force" },
  { name: "Admiral Naveed Ashraf", role: "Chief of Naval Staff", branch: "Pakistan Navy" },
  { name: "General Sahir Shamshad Mirza", role: "Chairman Joint Chiefs of Staff Committee", branch: "Joint" },
  { name: "Lt. Gen. Muhammad Asim Malik", role: "Director General ISI", branch: "Pakistan Army" },
];

type Tab = 'top' | 'ministers' | 'forces';
type ViewMode = 'list' | 'study';

export default function MinistersPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('ministers');
  const [viewMode, setViewMode] = useState<Record<Tab, ViewMode>>({ top: 'list', ministers: 'list', forces: 'list' });

  const filteredMinisters = ministers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.portfolio.toLowerCase().includes(search.toLowerCase()) ||
    m.party.toLowerCase().includes(search.toLowerCase())
  );
  const ministersStudyPool = search.trim() ? filteredMinisters : ministers;

  const setTabView = (tab: Tab, mode: ViewMode) => {
    setViewMode((current) => ({ ...current, [tab]: mode }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Pakistan Leadership</h1>
        <p className="text-slate-400 text-center mb-6">Federal Cabinet, Top Officials & Armed Forces Chiefs (2026)</p>

        <div className="flex justify-center gap-3 mb-6">
          {[
            { key: 'top' as const, label: 'Top Officials' },
            { key: 'ministers' as const, label: 'Federal Ministers' },
            { key: 'forces' as const, label: 'Armed Forces Chiefs' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setTabView(activeTab, 'list')}
            className={viewMode[activeTab] === 'list' ? 'rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white' : 'rounded-lg px-4 py-2 text-sm text-slate-500 transition hover:text-white'}
          >
            List
          </button>
          <button
            type="button"
            onClick={() => setTabView(activeTab, 'study')}
            className={viewMode[activeTab] === 'study' ? 'rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white' : 'rounded-lg px-4 py-2 text-sm text-slate-500 transition hover:text-white'}
          >
            Study cards
          </button>
        </div>

        {activeTab === 'top' && viewMode.top === 'list' && (
          <div className="space-y-4">
            {topOfficials.map((person, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-lg">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{person.name}</h3>
                    <p className="text-blue-400">{person.role}</p>
                    {person.party !== 'N/A' && (
                      <span className="text-xs text-slate-500 mt-1 inline-block px-2 py-0.5 bg-slate-700/50 rounded-full">{person.party}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'top' && viewMode.top === 'study' && (
          <SpacedRepetitionDeck
            key="ministers-top"
            storageKey="issb-sm2-ministers-top"
            items={topOfficials}
            getId={(person) => person.role}
            accentColor="violet"
            renderFront={(person) => person.role}
            renderBack={(person) => (
              <>
                <p className="text-xl font-semibold text-white">{person.name}</p>
                {person.party !== 'N/A' && <p className="mt-2 text-sm text-slate-400">{person.party}</p>}
              </>
            )}
          />
        )}

        {activeTab === 'ministers' && viewMode.ministers === 'list' && (
          <>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, portfolio, or party..."
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors mb-4"
            />
            <p className="text-slate-500 text-sm mb-4">Showing {filteredMinisters.length} ministers</p>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">#</th>
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">Portfolio</th>
                      <th className="px-6 py-4 text-left text-blue-400 font-semibold">Party</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMinisters.map((m, i) => (
                      <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-3 text-slate-500 font-mono text-sm">{i + 1}</td>
                        <td className="px-6 py-3 text-white font-medium">
                          {m.name}
                          {m.additional && (
                            <span className="block text-xs text-slate-500 mt-0.5">+ {m.additional}</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-emerald-400">{m.portfolio}</td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 text-xs rounded-full bg-slate-700/50 text-slate-300">{m.party}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ministers' && viewMode.ministers === 'study' && (
          <div>
            <p className="mb-5 text-center text-sm text-slate-500">
              Studying {ministersStudyPool.length === ministers.length ? 'all federal ministers' : ministersStudyPool.length + ' filtered ministers'}.
            </p>
            <SpacedRepetitionDeck
              key="ministers-cabinet"
              storageKey="issb-sm2-ministers-cabinet"
              items={ministersStudyPool}
              getId={(m) => m.portfolio}
              accentColor="emerald"
              renderFront={(m) => m.portfolio}
              renderBack={(m) => (
                <>
                  <p className="text-xl font-semibold text-white">{m.name}</p>
                  <p className="mt-2 text-sm text-slate-400">{m.party}{m.additional ? ' · ' + m.additional : ''}</p>
                </>
              )}
            />
          </div>
        )}

        {activeTab === 'forces' && viewMode.forces === 'list' && (
          <div className="space-y-4">
            {armedForces.map((person, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
                    {person.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{person.name}</h3>
                    <p className="text-emerald-400">{person.role}</p>
                    <span className="text-xs text-slate-500 mt-1 inline-block px-2 py-0.5 bg-slate-700/50 rounded-full">{person.branch}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'forces' && viewMode.forces === 'study' && (
          <SpacedRepetitionDeck
            key="ministers-forces"
            storageKey="issb-sm2-ministers-forces"
            items={armedForces}
            getId={(person) => person.role}
            accentColor="amber"
            renderFront={(person) => person.role}
            renderBack={(person) => (
              <>
                <p className="text-xl font-semibold text-white">{person.name}</p>
                <p className="mt-2 text-sm text-slate-400">{person.branch}</p>
              </>
            )}
          />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Manually verify in the browser**

Run: `npm run dev` (if not already running), open `http://localhost:3000/ministers`.

Check:
- Each of the three tabs defaults to List view, unchanged from before.
- Switching a tab to "Study cards" shows a flashcard deck: Top Officials and Armed Forces Chiefs quiz role → name, Federal Ministers quizzes portfolio → name.
- Switching tabs preserves each tab's own List/Study choice independently (e.g., set Ministers to Study, switch to Top Officials, switch back to Ministers — it should still be on Study).
- Type a search query on the Federal Ministers tab, then switch it to Study — the deck should only contain the filtered ministers.
- Rate a couple of cards on each of the three decks, reload the page, and confirm (via DevTools → Application → Local Storage) that `issb-sm2-ministers-top`, `issb-sm2-ministers-cabinet`, and `issb-sm2-ministers-forces` are three independent keys with independent progress.

- [ ] **Step 3: Lint and commit**

Run: `npm run lint`
Expected: no errors.

```bash
git add app/ministers/page.tsx
git commit -m "feat: add per-tab spaced-repetition study mode to the Ministers page"
```

---

### Task 6: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Re-run the pure-logic verification script**

Run: `node --experimental-strip-types scripts/verify-spaced-repetition.ts`
Expected: `All spaced-repetition scheduling checks passed.`

- [ ] **Step 2: Full lint pass**

Run: `npm run lint`
Expected: no errors across the whole repo.

- [ ] **Step 3: Production build**

Run: `npm run build`
Expected: build completes successfully with no type or build errors (this also re-runs `tsc` implicitly via Next's build step).

- [ ] **Step 4: Full manual smoke test**

Run: `npm run dev`.

Countries (`/countries`):
- [ ] Explore mode: search, continent filter, hover tooltip, zoom (wheel + buttons), pan, click-to-select all work together without errors in the browser console.
- [ ] Study mode: full session (including at least one "Again") completes, "Review complete" screen appears, "Start another review" restarts it.
- [ ] "Reset progress" clears the `issb-sm2-countries` localStorage key and the due/reviewed stats return to their initial state.

Ministers (`/ministers`):
- [ ] All three tabs' List views render exactly as before (compare against `git show HEAD~6:app/ministers/page.tsx` if in doubt about original content).
- [ ] All three tabs' Study views work independently with their own localStorage keys.

- [ ] **Step 5: Fix anything found, then this task needs no separate commit**

If Steps 1-4 surface an issue, fix it in the relevant file, re-run the specific check that failed, and fold the fix into a small commit on top (e.g. `git commit -m "fix: <what was wrong>"`). If everything passes cleanly, no commit is needed for this task.
