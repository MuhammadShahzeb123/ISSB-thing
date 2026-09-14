"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import { sentenceCompletionContent } from "@/app/content/psychological-tests/sentence-completion";
import {
  type SessionPhase,
  useTimedWritingSession,
} from "@/app/lib/psychological-tests/useTimedWritingSession";
import MethodologyNote from "./MethodologyNote";

const PRACTICE_SECONDS = 15;
const SCT_PHASES: readonly SessionPhase[] = [
  { id: "writing", durationSeconds: PRACTICE_SECONDS },
];

export default function SentenceCompletionPractice() {
  const phasesForPrompt = useCallback(() => SCT_PHASES, []);
  const {
    hydrated,
    session,
    currentPrompt,
    secondsLeft,
    start,
    reset,
    updateAnswer,
  } = useTimedWritingSession({
    storageKey: "issb-psychological-sct-session-v1",
    contentVersion: sentenceCompletionContent.contentVersion,
    prompts: sentenceCompletionContent.prompts,
    phasesForPrompt,
  });

  const completedCount = useMemo(
    () =>
      session
        ? session.promptIds.filter((id) => session.answers[id]?.trim()).length
        : 0,
    [session],
  );

  if (!hydrated) {
    return (
      <main className="neo-page min-h-screen px-4 py-12 sm:px-6">
        <p className="mx-auto max-w-5xl font-bold">Restoring practice…</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="neo-page min-h-screen px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <Link className="font-black text-blue-800" href="/psychological">
            ← Psychological tests
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
                Sentence Completion
              </p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">
                Complete each thought naturally.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
                This directly addressable simulation preserves the current
                prompt set as practice-only content until the user-owned
                replacement arrives.
              </p>
              <div className="mt-8">
                <MethodologyNote>
                  The official ISSB page describes 26 incomplete sentences plus
                  an example and says there are no right or wrong sentences.
                  This app’s 30 prompts and {PRACTICE_SECONDS}-second
                  per-prompt pacing are practice choices, not claimed official
                  content or timing.
                </MethodologyNote>
              </div>
            </section>
            <section className="border-2 border-slate-950 bg-white p-6 shadow-[7px_7px_0_#171717]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                Practice content pending replacement
              </p>
              <h2 className="mt-3 text-2xl font-black">
                {sentenceCompletionContent.prompts.length} current prompts
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                {sentenceCompletionContent.pendingNotice}
              </p>
              <ul className="mt-6 space-y-2 font-semibold text-slate-700">
                <li>{PRACTICE_SECONDS} seconds per prompt</li>
                <li>No early skip in simulation mode</li>
                <li>Stable-ID autosave and refresh recovery</li>
              </ul>
              <button
                className="mt-8 w-full border-2 border-slate-950 bg-blue-700 px-5 py-3 font-black text-white shadow-[4px_4px_0_#171717] transition hover:-translate-y-0.5"
                onClick={() => start()}
                type="button"
              >
                Start sentence completion
              </button>
            </section>
          </div>
        </div>
      </main>
    );
  }

  if (session.status === "finished") {
    return (
      <main className="neo-page min-h-screen px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
            Simulation complete
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            {completedCount} of {session.promptIds.length} responses saved
          </h1>
          <div className="mt-8 grid gap-3">
            {session.promptIds.map((id, index) => {
              const prompt = sentenceCompletionContent.prompts.find(
                (item) => item.id === id,
              );
              return (
                <article
                  className="border-2 border-slate-950 bg-white p-4"
                  key={id}
                >
                  <p className="text-xs font-black uppercase tracking-wide text-blue-800">
                    {index + 1}. {prompt?.stem}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-slate-700">
                    {session.answers[id]?.trim() || "No response"}
                  </p>
                </article>
              );
            })}
          </div>
          <button
            className="mt-8 border-2 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#171717]"
            onClick={reset}
            type="button"
          >
            Clear saved session
          </button>
        </div>
      </main>
    );
  }

  if (!currentPrompt) return null;
  const response = session.answers[currentPrompt.id] ?? "";
  const progress = ((session.promptIndex + 1) / session.promptIds.length) * 100;

  return (
    <main className="neo-page min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-4xl items-center">
        <div className="w-full">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-800">
                Prompt {session.promptIndex + 1} of {session.promptIds.length}
              </p>
              <p className="mt-2 font-semibold text-slate-700">
                Draft autosaved · simulation advances at the deadline
              </p>
            </div>
            <div className="border-2 border-slate-950 bg-white px-5 py-3 text-center shadow-[4px_4px_0_#171717]">
              <p className="text-3xl font-black tabular-nums">{secondsLeft}</p>
              <p className="text-xs font-black uppercase tracking-wide">
                seconds
              </p>
            </div>
          </header>
          <div className="mt-5 h-3 border-2 border-slate-950 bg-white">
            <div
              className="h-full bg-blue-700 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <section className="mt-6 border-2 border-slate-950 bg-white p-8 shadow-[8px_8px_0_#171717] sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-800">
              Complete the sentence
            </p>
            <h1 className="mt-5 text-3xl font-black leading-10 sm:text-5xl sm:leading-tight">
              {currentPrompt.stem}
            </h1>
            <textarea
              aria-label={`Completion for ${currentPrompt.stem}`}
              autoFocus
              className="mt-8 min-h-32 w-full border-2 border-slate-950 bg-slate-50 p-4 text-lg leading-8 outline-none focus:shadow-[5px_5px_0_#2563eb]"
              onChange={(event) =>
                updateAnswer(currentPrompt.id, event.target.value)
              }
              placeholder="Type your completion…"
              value={response}
            />
          </section>
          <p className="mt-4 text-sm font-semibold text-slate-600">
            There is no early-submit control in simulation mode.
          </p>
        </div>
      </div>
    </main>
  );
}
