<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ISSB Prep – notes for agents

Next.js 16 (webpack) + React 19 + Tailwind 4, no test runner. Verify changes with:

```bash
npx tsc --noEmit -p tsconfig.json   # typecheck (stale .next/types from another branch can error; delete .next or ignore ^.next/)
npm run lint                        # React Compiler rules ON. 5 errors pre-date this work (OfficerRanksBrowser, SiteNav, WatPractice)
node scripts/verify-content.cjs     # content checks: maths bank, photo coverage, stories, no en/em dashes
npm run build                       # next build
npm run dev -- --port 3111          # dev server
```

## Content

- Current affairs live in `app/lib/affairs/{pakistan,neighbours,world}.ts`, aggregated by `app/lib/affairsStories.ts`
  (`affairsAsOf` is the research date). Each story: simple English, short paragraphs, digits for numbers, no en/em dashes,
  facts attributed, a closing point of view, `keyFacts`, `question`, dated `sources`.
- `app/lib/gkTopics.ts` holds the 21 GK study topics (spoken-style `summary`, paragraphs split on blank lines).
- `app/lib/currentAffairs.ts` now only holds the country primers.

## Narration (audio)

Everything Gemini-related runs on **Gemini 3.8 Live** (`gemini-3.8-live`). It only answers with audio (a TEXT-only
response modality is rejected), so written text comes from its own transcription.

`npm run narration` (`scripts/build-tts.mjs`) has Live read GK, current affairs, GTO and psych scripts aloud
(`Sadaltager` voice, Pakistani English delivery) and writes `public/audio/<dir>/*.mp3`, `manifest.json` and
`app/lib/narrationCatalog.ts`. Needs `GEMINI_API_KEY` in `.env.local`. Nishan-e-Haider audio is never regenerated.

- Verbatim narrator, paragraph chunks; each chunk is checked against Live's transcript of what it said and re-read if it drifted.
- Flags: `--only=affairs,gk,gto,psych`, `--ids=a,b`, `--force`, `--parallel=3`, `--dry --show`.
- Only run one narration process at a time (each job rewrites the catalog and manifest).
- The project allows about 3 Live sessions at once (a 4th gets `1011 You exceeded your current quota`); keep
  `--parallel` at 3 or lower, and remember narration competes with students' live interviews.

## Live Deputy President interview

- `app/deputy-president-interview/LiveInterview.tsx` + `app/lib/live/liveSession.ts` talk to Gemini Live from the browser
  with an ephemeral token minted by `app/api/live-interview/token/route.ts` (persona, voice and limits are locked
  server-side in `app/lib/live/dpInterview.ts`).
- Feedback is spoken: "End interview" (or time running out) sends `DEBRIEF_PROMPT`, the mic stops sending, the DP gives
  about a minute of feedback, and the session closes itself once it has played out. Debrief transcript entries are
  flagged `debrief` and shown above the transcript on the review screen.
- Mic capture and playback are AudioWorklets in `public/worklets/` (16 kHz PCM16 up, 24 kHz PCM16 down).
- Server env: `GEMINI_API_KEY` (never exposed to the client). The offline record-yourself practice stays below it.
