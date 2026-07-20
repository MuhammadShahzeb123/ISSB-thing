# Interactive World Map + Anki-style Flashcards for Countries & Ministers

**Date:** 2026-07-20
**Status:** Approved for planning

## Problem

Two pages in this ISSB prep app need work:

1. `app/countries/page.tsx` renders the world SVG map but it's static (no zoom, no pan), hover only updates a sidebar card (no on-map popup), and the page is cluttered — a search/filter row, the map, a "selected country" card, a "recall drill" card, and a "quick study queue" pill list are all stacked and competing for attention. The recall drill is also redundant with the separate `/quiz` (Capitals Quiz) page.
2. `app/ministers/page.tsx` only offers list/table views (Top Officials, Federal Ministers, Armed Forces Chiefs). There's no way to actively drill this data into memory, unlike the Rank pages (`RankStudyView.tsx`) and Memory Lab (`app/study/page.tsx`), which already have flashcard-style review.

The existing flashcard implementations in `RankStudyView.tsx` and `app/study/page.tsx` use fixed-interval scheduling (Again → 10 min, Hard → 1 day, Easy → 4 days) rather than true spaced repetition. This project introduces a proper SM-2 (Anki-style) engine, but scopes its use to the two pages being built now — the existing Rank pages and Memory Lab keep their current scheme unchanged.

## Goals

- Make the world map interactive: zoom, pan, and a capital-name popup anchored to the hovered/focused country.
- Decongest the Countries page UI by splitting it into two clear modes.
- Add a real spaced-repetition (SM-2) flashcard engine, shared and reusable.
- Apply that engine to Countries (replacing the ad hoc recall drill) and to all three Ministers tabs (additive — list views stay).

## Non-goals

- No changes to `RankStudyView.tsx` or `app/study/page.tsx`'s scheduling logic — they keep their fixed-interval scheme.
- No changes to `/quiz` (Capitals Quiz).
- No backend/server persistence — progress stays in `localStorage`, same as today.

## Architecture

### 1. Shared SM-2 spaced-repetition engine

New file: `app/lib/spacedRepetition.ts`

- `useSpacedRepetitionDeck<T>({ storageKey, items, getId })` — a hook managing:
  - Per-card state: `{ easeFactor: number, intervalDays: number, repetitions: number, dueAt: number }`, keyed by `getId(item)`.
  - `easeFactor` starts at 2.5, floored at 1.3.
  - Rating a card (`again | hard | easy`) maps to an SM-2-style quality score and updates state:
    - **Again** (lapse): `repetitions = 0`, ease factor reduced slightly (floored at 1.3), card becomes due again in ~10 minutes (relearning step).
    - **Hard**: counts as a pass; `repetitions += 1`; ease factor nudged down slightly; interval grows slowly.
    - **Easy**: counts as a pass; `repetitions += 1`; ease factor nudged up; interval grows fastest.
  - Passing-interval progression (standard SM-2): 1st success → 1 day, 2nd success → 6 days, subsequent successes → `previousInterval * easeFactor`, rounded to whole days.
  - `dueAt = now + interval`.
  - Session building: due cards first (shuffled), then not-due cards (shuffled) as filler — same session-composition approach already used in `RankStudyView.tsx`.
  - Progress persisted to `localStorage[storageKey]`, hydrated on mount (matches the existing hydration pattern — deferred via `setTimeout(0)` + a `hasHydrated` ref to avoid SSR/client mismatches).
  - Returns: `{ deck, currentCard, cardIndex, isRevealed, reveal(), rate(rating), sessionComplete, dueCount, reviewedCount, startSession(), resetProgress() }`.

- `<SpacedRepetitionDeck>` component (new file: `app/components/SpacedRepetitionDeck.tsx`) — generic card/reveal/rate UI consuming the hook, visually consistent with the existing flashcard screens (stat row, progress bar, reveal button, three-button rating row). Takes `renderFront(item)` and `renderBack(item)` render props so each page supplies its own card content, plus `accentColor` / `title` / `subtitle` props for per-page theming.

### 2. Map interactivity (`app/countries/page.tsx`)

- Add dependency: `react-zoom-pan-pinch`.
- Wrap the existing map shell's content in `<TransformWrapper>` / `<TransformComponent>`: enables wheel-to-zoom, drag-to-pan, pinch-to-zoom (mobile), plus explicit `+` / `−` / reset buttons overlaid on the map (driven via the library's `useControls` hook or a ref).
- Tooltip: on `pointerenter`/`focus` of a country `<path>`, read `path.getBoundingClientRect()` and the map shell container's `getBoundingClientRect()` to compute the shape's on-screen center, then position a tooltip (country name + capital) at that point via an absolutely-positioned overlay layer that sits *outside* `<TransformComponent>` (so it is unaffected by the current zoom/pan transform and stays correctly anchored). Tooltip hides on `pointerleave`/`blur`.
- The SVG markup, alias/normalization logic, and path event wiring (`countryForMapLabel`, `normalizeMapName`, click-to-select, muted/selected classes) stay as-is.

### 3. Countries page redesign

Two-mode toggle at the top of the page (same visual pattern as the existing `flashcards`/`ladder` toggle in `RankStudyView.tsx`): **Explore map** / **Study cards**.

**Explore map mode:**
- Search + continent filter row stays (drives which map countries are highlighted vs. muted).
- Map is the dominant element (wider layout than today), with zoom/pan/tooltip from §2.
- Sidebar reduced to a single "hovered or selected country" info card (country, continent, capital) — the old "Recall drill" card and "Quick study queue" pill list are removed entirely.
- A small "Study these on cards →" link switches to Study mode, carrying over the active continent filter.

**Study cards mode:**
- Renders `<SpacedRepetitionDeck>` with `storageKey="issb-sm2-countries"`.
- Card front = country name; back = capital + continent.
- Item pool = the continent-filtered list if a filter was active when switching modes, else all 195 countries.
- Stats row (due / reviewed) shown above the deck, same as Memory Lab.

This fully replaces the old ad hoc recall drill. `/quiz` is untouched.

### 4. Ministers page redesign (`app/ministers/page.tsx`)

Each of the three existing tabs gets its own **List / Study cards** toggle. List views (table for Federal Ministers, card-grid for Top Officials and Armed Forces Chiefs) are unchanged. Study mode is additive, using `<SpacedRepetitionDeck>` with a separate `localStorage` key per tab so progress doesn't cross-contaminate:

| Tab | Storage key | Card front | Card back |
|---|---|---|---|
| Top Officials | `issb-sm2-ministers-top` | role (e.g. "Chairman Senate") | name + party |
| Federal Ministers | `issb-sm2-ministers-cabinet` | portfolio (e.g. "Finance & Revenue") | name + party (+ additional role, e.g. "Deputy PM", if present) |
| Armed Forces Chiefs | `issb-sm2-ministers-forces` | role (e.g. "Chief of Naval Staff") | name + branch |

Card direction is "role/portfolio → who holds it," matching how this is actually quizzed, rather than "name → what do they hold." If the active search filter (Federal Ministers tab only) is non-empty when Study mode is entered, the deck pool is limited to the filtered ministers; otherwise it's the full tab dataset.

## Data flow / state summary

- `useSpacedRepetitionDeck` owns all scheduling state per deck; pages only decide *which item pool* to hand it and *how* to render front/back.
- No cross-page state — each deck's `localStorage` key is independent, including from the pre-existing Rank/Memory-Lab decks (different key namespace, untouched).

## Testing

- Manual verification (this is a personal study app with no existing test suite): run `npm run dev`, exercise both Countries modes (search/filter, hover tooltip anchoring at various zoom levels, pan, zoom controls, mode switch, a full study session including an "Again" lapse and localStorage persistence across reload) and all three Ministers tabs in both List and Study mode.
- `npm run lint` and `npm run build` must pass (this project has no test runner configured beyond ESLint/TypeScript).

## Open risk

`react-zoom-pan-pinch`'s peer dependency range needs to be confirmed compatible with React 19 / Next 16 (current stack). If incompatible, fall back to a hand-rolled wheel/drag/buttons implementation using CSS transforms on the map container, keeping the same tooltip approach (unaffected either way since it's computed off `getBoundingClientRect`, not off the zoom mechanism).
