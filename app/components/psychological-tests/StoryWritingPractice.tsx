"use client";

import Link from "next/link";
import { useCallback, useMemo } from "react";
import WritingAssessmentPanel from "@/app/components/WritingAssessmentPanel";
import {
  storyPracticeTiming,
  storyWritingContent,
} from "@/app/content/psychological-tests/story-writing";
import type { StoryPrompt } from "@/app/lib/psychological-tests/content";
import {
  type SessionPhase,
  useTimedWritingSession,
} from "@/app/lib/psychological-tests/useTimedWritingSession";
import MethodologyNote from "./MethodologyNote";

const STORY_PHASES: readonly SessionPhase[] = [
  {
    id: "observation",
    durationSeconds: storyPracticeTiming.observationSeconds,
  },
  { id: "writing", durationSeconds: storyPracticeTiming.writingSeconds },
];

function PromptPreview({ prompt }: { prompt: StoryPrompt }) {
  if (prompt.kind === "sentence") {
    return (
      <div className="border-2 border-slate-950 bg-white p-8 text-center shadow-[7px_7px_0_#171717] sm:p-12">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-800">
          Original practice-only opening sentence
        </p>
        <p className="mt-5 text-2xl font-black leading-10 sm:text-4xl">
          “{prompt.openingSentence}”
        </p>
      </div>
    );
  }

  if (!prompt.imageUrl) {
    return (
      <div className="flex min-h-80 items-center justify-center border-2 border-dashed border-slate-950 bg-amber-100 p-8 text-center">
        <div className="max-w-md">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-900">
            User-owned picture pending
          </p>
          <p className="mt-4 text-2xl font-black">
            Picture prompt {prompt.sequence}
          </p>
          <p className="mt-3 font-semibold leading-7 text-slate-700">
            This stable slot is ready for the final asset. No random stock image
            or claimed official stimulus has been substituted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      aria-label={prompt.alt}
      className="min-h-80 border-2 border-slate-950 bg-cover bg-center"
      role="img"
      style={{ backgroundImage: `url("${prompt.imageUrl}")` }}
    />
  );
}

export default function StoryWritingPractice() {
  const phasesForPrompt = useCallback(() => STORY_PHASES, []);
  const {
    hydrated,
    session,
    currentPrompt,
    currentPhase,
    secondsLeft,
    start,
    reset,
    updateAnswer,
  } = useTimedWritingSession({
    storageKey: "issb-psychological-story-writing-session-v1",
    contentVersion: storyWritingContent.contentVersion,
    prompts: storyWritingContent.prompts,
    phasesForPrompt,
  });

  const completedCount = useMemo(
    () =>
      session
        ? session.promptIds.filter((id) => session.answers[id]?.trim()).length
        : 0,
    [session],
  );
  const pictureResponses = useMemo(
    () =>
      session
        ? session.promptIds.flatMap((promptId) => {
            const prompt = storyWritingContent.prompts.find(
              (item) => item.id === promptId,
            );
            const text = session.answers[promptId]?.trim();
            return prompt?.kind === "picture" && prompt.imageUrl && text
              ? [{ promptId, text }]
              : [];
          })
        : [],
    [session],
  );
  const sentenceStoryResponses = useMemo(
    () =>
      session
        ? session.promptIds.flatMap((promptId) => {
            const prompt = storyWritingContent.prompts.find(
              (item) => item.id === promptId,
            );
            const text = session.answers[promptId]?.trim();
            return prompt?.kind === "sentence" && text
              ? [{ promptId, text }]
              : [];
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
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
                Story Writing
              </p>
              <h1 className="mt-3 text-4xl font-black sm:text-6xl">
                Observe first. Write from memory.
              </h1>
              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
                One fixed session: four picture slots followed by two opening
                sentences. The editor is hidden while observing; the stimulus
                is hidden while writing.
              </p>
              <div className="mt-8">
                <MethodologyNote>
                  The official ISSB page describes four scored picture stories
                  after an example, with 30 seconds to observe and 3 minutes 30
                  seconds to write. It describes opening-sentence stories
                  separately as four minutes total. This simulator deliberately
                  applies {storyPracticeTiming.label.toLowerCase()} to every
                  prompt as a configurable practice choice.
                </MethodologyNote>
              </div>
            </section>
            <section className="border-2 border-slate-950 bg-white p-6 shadow-[7px_7px_0_#171717]">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                Fixed six-prompt session
              </p>
              <ol className="mt-5 space-y-3 font-bold">
                <li>1–4. Picture prompts · assets pending</li>
                <li>5–6. Original sentence prompts · practice only</li>
              </ol>
              <div className="mt-6 border-2 border-amber-900 bg-amber-100 p-4 text-sm font-semibold leading-6 text-amber-950">
                {storyWritingContent.pendingNotice}
              </div>
              <p className="mt-5 text-sm font-semibold leading-6 text-slate-700">
                {storyPracticeTiming.methodology} No early skip is available in
                simulation mode.
              </p>
              <button
                className="mt-8 w-full border-2 border-slate-950 bg-blue-700 px-5 py-3 font-black text-white shadow-[4px_4px_0_#171717] transition hover:-translate-y-0.5"
                onClick={() => start()}
                type="button"
              >
                Start fixed session
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
            Session complete
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            {completedCount} of {session.promptIds.length} stories saved
          </h1>
          <div className="mt-8 grid gap-4">
            {session.promptIds.map((id, index) => {
              const prompt = storyWritingContent.prompts.find(
                (item) => item.id === id,
              );
              return (
                <article
                  className="border-2 border-slate-950 bg-white p-5"
                  key={id}
                >
                  <p className="text-xs font-black uppercase tracking-wide text-blue-800">
                    Prompt {index + 1} · {prompt?.kind}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
                    {session.answers[id]?.trim() || "No response"}
                  </p>
                </article>
              );
            })}
          </div>
          {pictureResponses.length > 0 ? (
            <div className="mt-8">
              <WritingAssessmentPanel
                assessmentType="picture-association"
                responses={pictureResponses}
                title="Picture association feedback"
              />
            </div>
          ) : null}
          {sentenceStoryResponses.length > 0 ? (
            <div className="mt-8">
              <WritingAssessmentPanel
                assessmentType="story-writing"
                responses={sentenceStoryResponses}
                title="Story writing feedback"
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

  if (!currentPrompt || !currentPhase) return null;
  const isObserving = currentPhase.id === "observation";
  const response = session.answers[currentPrompt.id] ?? "";
  const progress = ((session.promptIndex + 1) / session.promptIds.length) * 100;

  return (
    <main className="neo-page min-h-screen px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-800">
              Prompt {session.promptIndex + 1} of {session.promptIds.length} ·{" "}
              {isObserving ? "Observation" : "Writing"}
            </p>
            <p className="mt-2 font-semibold text-slate-700">
              {isObserving
                ? "Plan the story mentally. The editor appears at zero."
                : "The stimulus is hidden. Your draft autosaves as you type."}
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

        {isObserving ? (
          <section className="mt-6">
            <PromptPreview prompt={currentPrompt} />
            <p className="mt-4 text-center text-sm font-black uppercase tracking-wide text-slate-600">
              Editor locked during observation
            </p>
          </section>
        ) : (
          <section className="mt-6">
            <div className="border-2 border-slate-950 bg-neutral-950 p-5 text-center text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-300">
                Stimulus hidden during writing
              </p>
              <p className="mt-2 font-semibold">
                Continue the story you planned during observation.
              </p>
            </div>
            <textarea
              aria-label={`Story response for prompt ${session.promptIndex + 1}`}
              autoFocus
              className="mt-5 min-h-80 w-full border-2 border-slate-950 bg-white p-5 text-lg leading-8 outline-none focus:shadow-[6px_6px_0_#2563eb]"
              onChange={(event) =>
                updateAnswer(currentPrompt.id, event.target.value)
              }
              placeholder="Write your story…"
              value={response}
            />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              Autosaved under {currentPrompt.id}. There is no early-submit
              control in simulation mode.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
