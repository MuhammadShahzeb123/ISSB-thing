"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import WritingAssessmentPanel from "@/app/components/WritingAssessmentPanel";
import { watContent } from "@/app/content/psychological-tests/wat";
import type { WatPrompt } from "@/app/lib/psychological-tests/content";
import {
  type SessionPhase,
  useTimedWritingSession,
} from "@/app/lib/psychological-tests/useTimedWritingSession";
import MethodologyNote from "./MethodologyNote";

const SESSION_WORDS = 175;
const WORD_SECONDS = 10;
const WAT_PHASES: readonly SessionPhase[] = [
  { id: "writing", durationSeconds: WORD_SECONDS },
];

function shuffledSessionIds(prompts: readonly WatPrompt[]) {
  const ids = prompts.map((prompt) => prompt.id);
  for (let index = ids.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [ids[index], ids[swapIndex]] = [ids[swapIndex], ids[index]];
  }
  return ids.slice(0, Math.min(SESSION_WORDS, ids.length));
}

export default function WatPractice() {
  const phasesForPrompt = useCallback(() => WAT_PHASES, []);
  const {
    hydrated,
    session,
    currentPrompt,
    secondsLeft,
    start,
    reset,
    updateAnswer,
  } = useTimedWritingSession({
    storageKey: "issb-psychological-wat-session-v1",
    contentVersion: watContent.contentVersion,
    prompts: watContent.prompts,
    phasesForPrompt,
  });

  const completedCount = useMemo(
    () =>
      session
        ? session.promptIds.filter((id) => session.answers[id]?.trim()).length
        : 0,
    [session],
  );
  const completedResponses = useMemo(
    () =>
      session
        ? session.promptIds.flatMap((promptId) => {
            const text = session.answers[promptId]?.trim();
            return text ? [{ promptId, text }] : [];
          })
        : [],
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
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <section>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
                Word Association Test
              </p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">
                Respond before the word changes.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
                A simulation selects {SESSION_WORDS} words from the preserved
                legacy practice bank. Each response autosaves under the word’s
                stable content ID.
              </p>
              <div className="mt-8">
                <MethodologyNote>
                  The official ISSB page says English words appear in quick
                  succession for 10 seconds each. The {SESSION_WORDS}-word
                  session shape and this bank are practice choices, not claimed
                  official content.
                </MethodologyNote>
              </div>
            </section>
            <section className="border-2 border-slate-950 bg-white p-6 shadow-[7px_7px_0_#171717]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                Legacy practice content
              </p>
              <h2 className="mt-3 text-2xl font-black">
                {watContent.prompts.length} available words
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                {watContent.pendingNotice}
              </p>
              <ul className="mt-6 space-y-2 font-semibold text-slate-700">
                <li>{WORD_SECONDS} seconds per word</li>
                <li>No early skip in simulation mode</li>
                <li>Refresh-safe timing and drafts</li>
              </ul>
              <button
                className="mt-8 w-full border-2 border-slate-950 bg-blue-700 px-5 py-3 font-black text-white shadow-[4px_4px_0_#171717] transition hover:-translate-y-0.5"
                onClick={() => start(shuffledSessionIds(watContent.prompts))}
                type="button"
              >
                Start WAT simulation
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
              const prompt = watContent.prompts.find((item) => item.id === id);
              return (
                <article
                  className="border-2 border-slate-950 bg-white p-4"
                  key={id}
                >
                  <p className="text-xs font-black uppercase tracking-wide text-blue-800">
                    {index + 1}. {prompt?.word}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-slate-700">
                    {session.answers[id]?.trim() || "No response"}
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
                Word {session.promptIndex + 1} of {session.promptIds.length}
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
          <section className="mt-6 border-2 border-slate-950 bg-slate-950 p-8 text-center text-white shadow-[8px_8px_0_#2563eb] sm:p-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300">
              Write the first natural response
            </p>
            <h1 className="mt-5 break-words text-5xl font-black sm:text-7xl">
              {currentPrompt.word}
            </h1>
          </section>
          <textarea
            aria-label={`Response to ${currentPrompt.word}`}
            autoFocus
            className="mt-6 min-h-40 w-full border-2 border-slate-950 bg-white p-5 text-lg leading-8 outline-none focus:shadow-[6px_6px_0_#2563eb]"
            onChange={(event) =>
              updateAnswer(currentPrompt.id, event.target.value)
            }
            placeholder="Type your response…"
            value={response}
          />
          <p className="mt-3 text-sm font-semibold text-slate-600">
            There is no early-submit control in simulation mode.
          </p>
        </div>
      </div>
    </main>
  );
}
