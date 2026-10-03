"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef } from "react";
import WritingAssessmentPanel from "@/app/components/WritingAssessmentPanel";
import { watContent } from "@/app/content/psychological-tests/wat";
import type { WatPrompt } from "@/app/lib/psychological-tests/content";
import {
  type SessionPhase,
  useTimedWritingSession,
} from "@/app/lib/psychological-tests/useTimedWritingSession";
import MethodologyNote from "./MethodologyNote";
import TitleWithAudio from "@/app/components/TitleWithAudio";
import { psychNarration } from "@/app/lib/narrationCatalog";

const WORD_SECONDS = 12;
const SESSION_LENGTH = 200;
const WAT_PHASES: readonly SessionPhase[] = [
  { id: "writing", durationSeconds: WORD_SECONDS },
];

function isSinglePracticeWord(word: string) {
  return /^[A-Za-z][A-Za-z'-]*$/.test(word.trim());
}

/** Unique single words, repeated with fresh ids only if the bank is shorter than a full run. */
function sessionBank(prompts: readonly WatPrompt[]): WatPrompt[] {
  const seen = new Set<string>();
  const usable: WatPrompt[] = [];
  for (const prompt of prompts) {
    const word = prompt.word.trim().toUpperCase();
    if (!isSinglePracticeWord(word) || seen.has(word)) continue;
    seen.add(word);
    usable.push({ ...prompt, word });
  }
  if (usable.length === 0) return [];
  if (usable.length >= SESSION_LENGTH) return usable;

  const expanded = [...usable];
  let round = 1;
  while (expanded.length < SESSION_LENGTH) {
    for (const prompt of usable) {
      if (expanded.length >= SESSION_LENGTH) break;
      expanded.push({
        ...prompt,
        id: `${prompt.id}-cycle-${round}`,
      });
    }
    round += 1;
  }
  return expanded;
}

function shuffledSessionIds(prompts: readonly WatPrompt[]) {
  const ids = prompts.map((prompt) => prompt.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }
  return ids.slice(0, Math.min(SESSION_LENGTH, ids.length));
}

export default function WatPractice() {
  const responseRef = useRef<HTMLTextAreaElement>(null);
  const prompts = useMemo(() => sessionBank(watContent.prompts), []);
  const promptById = useMemo(
    () => new Map<string, WatPrompt>(prompts.map((prompt) => [prompt.id, prompt])),
    [prompts],
  );
  const phasesForPrompt = useCallback(() => WAT_PHASES, []);
  const {
    hydrated,
    session,
    currentPrompt,
    secondsLeft,
    start,
    reset,
    finish,
    updateAnswer,
  } = useTimedWritingSession({
    storageKey: "issb-psychological-wat-session-v3",
    contentVersion: watContent.contentVersion,
    prompts,
    phasesForPrompt,
  });

  useEffect(() => {
    if (!currentPrompt || session?.status !== "running") return;
    const field = responseRef.current;
    if (!field) return;
    field.focus();
    const length = field.value.length;
    field.setSelectionRange(length, length);
  }, [currentPrompt, session?.status]);

  const reviewedIds = useMemo(() => {
    if (!session) return [];
    const reached = Math.min(session.promptIndex + 1, session.promptIds.length);
    return session.promptIds.slice(0, reached);
  }, [session]);

  const completedResponses = useMemo(
    () =>
      reviewedIds.flatMap((promptId) => {
        const text = session?.answers[promptId]?.trim();
        return text ? [{ promptId, text }] : [];
      }),
    [reviewedIds, session],
  );

  const startRun = useCallback(() => {
    start(shuffledSessionIds(prompts));
  }, [prompts, start]);

  if (!hydrated) {
    return (
      <main className="neo-page min-h-screen px-4 py-12 sm:px-6">
        <p className="mx-auto max-w-5xl font-bold">Restoring practice…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="neo-page min-h-[100dvh] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <Link className="font-black text-blue-800" href="/psychological">
            ← Psychological tests
          </Link>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
                Word Association Test
              </p>
              <TitleWithAudio
                as="h1"
                script={psychNarration["wat-overview"]?.script}
                audioSrc={psychNarration["wat-overview"]?.audio}
                playLabel="Play word association overview"
              >
                <span className="mt-3 text-4xl font-black sm:text-6xl">
                  One word. Twelve seconds. Then the next.
                </span>
              </TitleWithAudio>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
                A full run is {SESSION_LENGTH} words. Only the current word is
                on screen. Type your sentence while it is up. At zero the
                response is saved, the next word appears, and the timer starts
                again at {WORD_SECONDS}. When all {SESSION_LENGTH} are done, or
                if you stop early, you can read every word next to what you
                wrote.
              </p>
              <div className="mt-8">
                <MethodologyNote>
                  The official ISSB page says English words appear in quick
                  succession for about 10 seconds each. This practice uses{" "}
                  {WORD_SECONDS} seconds and a run of {SESSION_LENGTH} words.
                  The word bank is practice content, not claimed official ISSB
                  material.
                </MethodologyNote>
              </div>
            </section>
            <section className="border-2 border-slate-950 bg-white p-6 shadow-[7px_7px_0_#171717]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                Full practice
              </p>
              <h2 className="mt-3 text-2xl font-black">
                {SESSION_LENGTH} words · {WORD_SECONDS}s each
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                {prompts.length} practice words available. Each run picks{" "}
                {SESSION_LENGTH}. About{" "}
                {Math.round((SESSION_LENGTH * WORD_SECONDS) / 60)} minutes,
                then a full review.
              </p>
              <ul className="mt-6 space-y-2 font-semibold text-slate-700">
                <li>One word on screen. No list during the run.</li>
                <li>Timer resets to {WORD_SECONDS} on every word.</li>
                <li>Review word and response when you finish.</li>
              </ul>
              <button
                className="wat-primary mt-8 w-full border-2 border-slate-950 px-5 py-4 text-lg font-black shadow-[4px_4px_0_#171717] transition hover:-translate-y-0.5"
                onClick={startRun}
                type="button"
              >
                Start {SESSION_LENGTH} words
              </button>
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (session.status === "finished") {
    const answered = completedResponses.length;
    const finishedAll = reviewedIds.length >= session.promptIds.length;
    return (
      <main className="neo-page min-h-[100dvh] px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
            Your responses
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            {answered} of {reviewedIds.length} written
          </h1>
          <p className="mt-3 font-semibold text-slate-700">
            {finishedAll
              ? `All ${session.promptIds.length} words are here.`
              : `Stopped at word ${reviewedIds.length} of ${session.promptIds.length}.`}{" "}
            Blank lines were left empty when the clock moved on.
          </p>
          <div className="mt-8 grid gap-2">
            {reviewedIds.map((id, index) => {
              const prompt = promptById.get(id);
              const text = session.answers[id]?.trim();
              return (
                <article
                  className="border-2 border-slate-950 bg-white px-3 py-3 sm:px-4"
                  key={`${index}-${id}`}
                >
                  <p className="text-xs font-black uppercase tracking-wide text-blue-800">
                    {index + 1} / {session.promptIds.length}
                  </p>
                  <p className="wat-review-word mt-1 text-2xl font-black leading-none">
                    {prompt?.word}
                  </p>
                  <p className="wat-review-text mt-2 whitespace-pre-wrap text-base leading-7">
                    {text || "No response"}
                  </p>
                </article>
              );
            })}
          </div>
          {completedResponses.length > 0 ? (
            <div className="mt-8">
              <WritingAssessmentPanel
                assessmentType="word-association"
                responses={completedResponses}
                title="WAT writing feedback"
              />
            </div>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="wat-primary border-2 border-slate-950 px-5 py-3 font-black shadow-[4px_4px_0_#171717]"
              onClick={startRun}
              type="button"
            >
              Start another {SESSION_LENGTH}
            </button>
            <button
              className="wat-secondary border-2 border-slate-950 px-5 py-3 font-black shadow-[4px_4px_0_#171717]"
              onClick={reset}
              type="button"
            >
              Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!currentPrompt) return null;
  const response = session.answers[currentPrompt.id] ?? "";
  const sweep = Math.max(0, Math.min(1, secondsLeft / WORD_SECONDS)) * 360;

  return (
    <main className="neo-page min-h-[100dvh] px-4 py-4 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-3xl flex-col">
        <header className="flex items-center justify-between gap-3">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-800">
            {session.promptIndex + 1} / {session.promptIds.length}
          </p>
          <div
            aria-label={`${secondsLeft} seconds left`}
            aria-live="polite"
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-slate-950"
            style={{
              background: `conic-gradient(#1d4ed8 ${sweep}deg, #e5e7eb 0deg)`,
            }}
          >
            <span className="wat-timer-value grid h-12 w-12 place-items-center rounded-full text-2xl font-black tabular-nums">
              {secondsLeft}
            </span>
          </div>
        </header>
        <section className="wat-word-stage mt-4 flex flex-1 flex-col items-center justify-center border-2 border-slate-950 px-4 py-10 text-center shadow-[8px_8px_0_#2563eb]">
          <h1 className="wat-word break-words text-5xl font-black leading-none sm:text-8xl">
            {currentPrompt.word}
          </h1>
        </section>
        <label className="sr-only" htmlFor="wat-response">
          Your sentence for {currentPrompt.word}
        </label>
        <textarea
          aria-label={`Response to ${currentPrompt.word}`}
          autoComplete="off"
          autoCorrect="on"
          className="wat-response mt-4 min-h-28 w-full border-2 border-slate-950 p-4 text-base leading-7 outline-none focus:shadow-[6px_6px_0_#2563eb] sm:min-h-32 sm:text-lg"
          enterKeyHint="done"
          id="wat-response"
          key={currentPrompt.id}
          onChange={(event) =>
            updateAnswer(currentPrompt.id, event.target.value)
          }
          placeholder="Type your sentence…"
          ref={responseRef}
          value={response}
        />
        <div className="mt-3 flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-600">
            Next word at 0. Timer restarts at {WORD_SECONDS}.
          </p>
          <button
            className="wat-secondary border-2 border-slate-950 px-4 py-3 text-sm font-black shadow-[3px_3px_0_#171717]"
            onClick={finish}
            type="button"
          >
            End and review
          </button>
        </div>
      </div>
    </main>
  );
}
