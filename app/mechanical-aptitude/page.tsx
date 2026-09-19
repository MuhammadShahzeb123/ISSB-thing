"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MechanicalDiagram from "./MechanicalDiagram";
import {
  CATEGORY_LABELS,
  mechanicalQuestions,
  PRINCIPLE_SOURCES,
  type MechanicalCategory,
  type MechanicalQuestion,
} from "./questions";

const PRACTICE_SIZES = [10, 20, 30, 50, 100] as const;
const SIMULATION_SIZE = 50;
const SIMULATION_SECONDS = 15 * 60;
const ISSB_FORMAT_URL = "https://issb.gov.pk/index.php/selection-system/";
const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS) as MechanicalCategory[];

type Mode = "practice" | "simulation";
type Phase = "setup" | "questions" | "results";

type SessionChoice = {
  label: string;
  originalIndex: number;
};

type SessionQuestion = {
  question: MechanicalQuestion;
  choices: SessionChoice[];
};

function hashText(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target], copy[index]];
  }
  return copy;
}

function createSession(size: number, categories: readonly MechanicalCategory[], seed: number): SessionQuestion[] {
  const random = seededRandom(seed);
  const pools = new Map(
    categories.map((category) => [
      category,
      shuffled(
        mechanicalQuestions.filter((question) => question.category === category),
        random,
      ),
    ]),
  );
  const selected: MechanicalQuestion[] = [];
  const offsets = new Map(categories.map((category) => [category, 0]));

  while (selected.length < size) {
    let added = false;
    for (const category of shuffled(categories, random)) {
      const pool = pools.get(category) ?? [];
      const offset = offsets.get(category) ?? 0;
      if (offset < pool.length && selected.length < size) {
        selected.push(pool[offset]);
        offsets.set(category, offset + 1);
        added = true;
      }
    }
    if (!added) break;
  }

  return shuffled(selected, random).map((question) => ({
    question,
    choices: shuffled(
      question.choices.map((label, originalIndex) => ({ label, originalIndex })),
      seededRandom(hashText(`${seed}:${question.id}:choices`)),
    ),
  }));
}

function makeSeed() {
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    return crypto.getRandomValues(new Uint32Array(1))[0];
  }
  return Date.now() >>> 0;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function modeDescription(mode: Mode) {
  return mode === "simulation"
    ? "50 questions · 15 minutes · all categories"
    : "Choose a length and focus categories. There is no timer.";
}

export default function MechanicalAptitudePage() {
  const [mode, setMode] = useState<Mode>("practice");
  const [practiceSize, setPracticeSize] = useState<(typeof PRACTICE_SIZES)[number]>(20);
  const [selectedCategories, setSelectedCategories] = useState<MechanicalCategory[]>(CATEGORY_KEYS);
  const [phase, setPhase] = useState<Phase>("setup");
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(SIMULATION_SECONDS);
  const deadlineRef = useRef<number | null>(null);

  const current = session[currentIndex];
  const selectedAnswer = current ? answers[current.question.id] : undefined;
  const answeredCount = Object.keys(answers).length;
  const availablePracticeQuestions = mechanicalQuestions.filter((question) => (
    selectedCategories.includes(question.category)
  )).length;
  const practiceSelectionIsValid = selectedCategories.length > 0 && availablePracticeQuestions >= practiceSize;

  const finishSession = useCallback(() => {
    deadlineRef.current = null;
    setPhase("results");
  }, []);

  const moveQuestion = useCallback((offset: number) => {
    setCurrentIndex((previous) => Math.min(Math.max(previous + offset, 0), session.length - 1));
  }, [session.length]);

  useEffect(() => {
    if (phase !== "questions" || mode !== "simulation") return;

    const updateTimer = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) {
        return;
      }

      const remaining = Math.max(
        0,
        Math.ceil((deadline - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
      if (remaining === 0) {
        finishSession();
      }
    };

    updateTimer();
    const interval = window.setInterval(updateTimer, 1000);
    document.addEventListener("visibilitychange", updateTimer);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", updateTimer);
    };
  }, [finishSession, mode, phase]);

  useEffect(() => {
    if (phase !== "questions" || !current) return;
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (["1", "2", "3", "4"].includes(event.key)) {
        const choice = current.choices[Number(event.key) - 1];
        if (choice) {
          setAnswers((previous) => ({ ...previous, [current.question.id]: choice.originalIndex }));
        }
      } else if (event.key === "ArrowLeft") {
        moveQuestion(-1);
      } else if (event.key === "ArrowRight") {
        moveQuestion(1);
      } else if (event.key === "Enter" && selectedAnswer !== undefined) {
        if (currentIndex === session.length - 1) finishSession();
        else moveQuestion(1);
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [current, currentIndex, finishSession, moveQuestion, phase, selectedAnswer, session.length]);

  const results = useMemo(() => {
    if (!session.length) return { correct: 0, byCategory: [] as { category: MechanicalCategory; correct: number; total: number }[] };
    const correct = session.filter(({ question }) => answers[question.id] === question.answerIndex).length;
    const byCategory = CATEGORY_KEYS.map((category) => {
      const categoryQuestions = session.filter(({ question }) => question.category === category);
      return {
        category,
        total: categoryQuestions.length,
        correct: categoryQuestions.filter(({ question }) => answers[question.id] === question.answerIndex).length,
      };
    }).filter(({ total }) => total > 0);
    return { correct, byCategory };
  }, [answers, session]);

  const startSession = () => {
    const categories = mode === "simulation" ? CATEGORY_KEYS : selectedCategories;
    const size = mode === "simulation" ? SIMULATION_SIZE : practiceSize;
    setSession(createSession(size, categories, makeSeed()));
    setCurrentIndex(0);
    setAnswers({});
    setSecondsLeft(SIMULATION_SECONDS);
    deadlineRef.current =
      mode === "simulation" ? Date.now() + SIMULATION_SECONDS * 1000 : null;
    setPhase("questions");
  };

  const restartSameSession = () => {
    setCurrentIndex(0);
    setAnswers({});
    setSecondsLeft(SIMULATION_SECONDS);
    deadlineRef.current =
      mode === "simulation" ? Date.now() + SIMULATION_SECONDS * 1000 : null;
    setPhase("questions");
  };

  const toggleCategory = (category: MechanicalCategory) => {
    setSelectedCategories((previous) => (
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    ));
  };

  if (phase === "setup") {
    return (
      <main className="neo-page min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <header className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-800">Original practice module</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black leading-none [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">Mechanical aptitude, built from principles.</h1>
              <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
                Train with 100 original questions across torque, pulleys, gears, machines, motion, friction,
                fluids, tools, and mechanisms. Questions and category coverage are unofficial practice
                content—not an official syllabus, recalled test, or official question bank.
              </p>
            </div>
            <aside className="border-2 border-slate-950 bg-amber-100 p-5 shadow-[6px_6px_0_#171717]" role="note">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800">Official public format</p>
              <p className="mt-2 text-2xl font-black">50 items · 15 minutes</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
                The official ISSB selection-system page states this format for Mechanical Aptitude Tests.
              </p>
              <a className="mt-4 inline-block font-black text-blue-800 underline decoration-2 underline-offset-4" href={ISSB_FORMAT_URL} target="_blank" rel="noreferrer">
                Read the official ISSB source
              </a>
            </aside>
          </header>

          <section className="mt-10 border-2 border-slate-950 bg-white p-5 shadow-[6px_6px_0_#171717] sm:p-8">
            <fieldset>
              <legend className="text-2xl font-black">1. Choose a mode</legend>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {(["practice", "simulation"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMode(option)}
                    aria-pressed={mode === option}
                    className={`border-2 border-slate-950 p-5 text-left transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                      mode === option ? "bg-blue-200 shadow-[5px_5px_0_#171717]" : "bg-white hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-xl font-black capitalize">{option}</span>
                    <span className="mt-2 block text-sm font-semibold leading-6 text-slate-700">{modeDescription(option)}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {mode === "practice" && (
              <>
                <fieldset className="mt-8 border-t-2 border-slate-950 pt-7">
                  <legend className="text-2xl font-black">2. Choose question count</legend>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {PRACTICE_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setPracticeSize(size)}
                        aria-pressed={practiceSize === size}
                        className={`min-w-16 border-2 border-slate-950 px-4 py-3 font-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                          practiceSize === size ? "bg-pink-200 shadow-[4px_4px_0_#171717]" : "bg-white hover:bg-slate-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="mt-8 border-t-2 border-slate-950 pt-7">
                  <legend className="text-2xl font-black">3. Choose focus categories</legend>
                  <p className="mt-2 text-sm font-semibold text-slate-600">Selection is balanced across the categories you keep active.</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {CATEGORY_KEYS.map((category) => {
                      const active = selectedCategories.includes(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => toggleCategory(category)}
                          aria-pressed={active}
                          className={`border-2 border-slate-950 p-3 text-left text-sm font-black leading-5 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                            active ? "bg-lime-200 shadow-[3px_3px_0_#171717]" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {CATEGORY_LABELS[category]}
                        </button>
                      );
                    })}
                  </div>
                  <p className={`mt-4 text-sm font-black ${practiceSelectionIsValid ? "text-slate-600" : "text-red-800"}`} role="status">
                    {availablePracticeQuestions} questions available for this selection
                    {!practiceSelectionIsValid && selectedCategories.length > 0 ? `; choose ${availablePracticeQuestions} or fewer.` : "."}
                  </p>
                </fieldset>
              </>
            )}

            <button
              type="button"
              onClick={startSession}
              disabled={mode === "practice" && !practiceSelectionIsValid}
              className="mt-9 w-full border-2 border-slate-950 bg-blue-300 px-6 py-4 text-lg font-black shadow-[6px_6px_0_#171717] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              Start {mode}
            </button>
          </section>
        </div>
      </main>
    );
  }

  if (phase === "results") {
    const percentage = Math.round((results.correct / session.length) * 100);
    return (
      <main className="neo-page min-h-screen px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <header className="border-2 border-slate-950 bg-blue-200 p-6 shadow-[6px_6px_0_#171717] sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-800">{mode} complete</p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h1 className="text-5xl font-black">{results.correct}/{session.length}</h1>
                <p className="mt-2 text-lg font-bold">{percentage}% correct · {answeredCount} answered</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={restartSameSession} className="border-2 border-slate-950 bg-white px-5 py-3 font-black shadow-[4px_4px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  Restart same session
                </button>
                <button type="button" onClick={() => setPhase("setup")} className="border-2 border-slate-950 bg-pink-200 px-5 py-3 font-black shadow-[4px_4px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  New setup
                </button>
              </div>
            </div>
          </header>

          <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Category results">
            {results.byCategory.map(({ category, correct, total }) => (
              <article key={category} className="border-2 border-slate-950 bg-white p-4 shadow-[3px_3px_0_#171717]">
                <p className="text-sm font-black leading-5">{CATEGORY_LABELS[category]}</p>
                <p className="mt-2 text-2xl font-black">{correct}/{total}</p>
              </article>
            ))}
          </section>

          <section className="mt-8 space-y-5" aria-labelledby="review-heading">
            <h2 id="review-heading" className="text-3xl font-black">Answer review</h2>
            {session.map(({ question, choices }, index) => {
              const answer = answers[question.id];
              const isCorrect = answer === question.answerIndex;
              const chosenLabel = answer === undefined ? "Not answered" : question.choices[answer];
              return (
                <article key={question.id} className={`border-2 border-slate-950 p-5 shadow-[5px_5px_0_#171717] sm:p-6 ${isCorrect ? "bg-lime-100" : "bg-rose-100"}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="min-w-0 text-xs font-black uppercase tracking-[0.16em] text-slate-600 [overflow-wrap:anywhere]">
                      {index + 1}. {question.id} · {CATEGORY_LABELS[question.category]} · {question.difficulty}
                    </p>
                    <span className="border-2 border-slate-950 bg-white px-3 py-1 text-xs font-black uppercase">{isCorrect ? "Correct" : "Review"}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-black leading-7 [overflow-wrap:anywhere]">{question.prompt}</h3>
                  <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
                    <div className="min-w-0">
                      <p className="font-bold">Your answer: <span className={isCorrect ? "text-green-800" : "text-red-800"}>{chosenLabel}</span></p>
                      {!isCorrect && <p className="mt-1 font-bold">Correct answer: {question.choices[question.answerIndex]}</p>}
                      <p className="mt-4 leading-7 text-slate-700">{question.explanation}</p>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-bold">
                        {question.sources.map((source) => (
                          <a key={source} href={PRINCIPLE_SOURCES[source].url} target="_blank" rel="noreferrer" className="text-blue-800 underline decoration-2 underline-offset-4">
                            {PRINCIPLE_SOURCES[source].label}
                          </a>
                        ))}
                      </div>
                    </div>
                    {question.diagram && (
                      <div className="mx-auto aspect-[2/1] w-full max-w-sm self-start border-2 border-slate-950 bg-white p-2">
                        <MechanicalDiagram diagram={question.diagram} />
                      </div>
                    )}
                  </div>
                  <span className="sr-only">Choice order shown during the session: {choices.map(({ label }) => label).join(", ")}</span>
                </article>
              );
            })}
          </section>
        </div>
      </main>
    );
  }

  if (!current) return null;
  const progress = ((currentIndex + 1) / session.length) * 100;

  return (
    <main className="neo-page min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-2 border-slate-950 bg-white p-4 shadow-[4px_4px_0_#171717]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">{mode}</p>
            <p className="mt-1 font-black">Question {currentIndex + 1} of {session.length} · {answeredCount} answered</p>
          </div>
          {mode === "simulation" && (
            <div className={`border-2 border-slate-950 px-4 py-2 text-2xl font-black tabular-nums ${secondsLeft <= 60 ? "bg-rose-200" : "bg-amber-100"}`} aria-live="polite">
              {formatTime(secondsLeft)}
            </div>
          )}
        </header>

        <div className="mt-5 h-3 overflow-hidden border-2 border-slate-950 bg-white" aria-hidden="true">
          <div className="h-full bg-blue-400" style={{ width: `${progress}%` }} />
        </div>

        <section className="mt-6 border-2 border-slate-950 bg-white p-5 shadow-[7px_7px_0_#171717] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="min-w-0 text-xs font-black uppercase tracking-[0.16em] text-slate-600 [overflow-wrap:anywhere]">
              {current.question.id} · {CATEGORY_LABELS[current.question.category]} · {current.question.difficulty}
            </p>
            <button type="button" onClick={() => setPhase("setup")} className="text-sm font-black text-blue-800 underline decoration-2 underline-offset-4 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
              Exit to setup
            </button>
          </div>

          <div className={`mt-5 grid gap-6 ${current.question.diagram ? "md:grid-cols-[minmax(0,1fr)_minmax(14rem,18rem)] md:items-start" : ""}`}>
            <h1 className="min-w-0 text-xl font-black leading-8 [overflow-wrap:anywhere] sm:text-2xl sm:leading-9 lg:text-3xl">{current.question.prompt}</h1>
            {current.question.diagram && (
              <div className="mx-auto aspect-[2/1] w-full max-w-sm border-2 border-slate-950 bg-amber-50 p-3 md:max-w-none">
                <MechanicalDiagram diagram={current.question.diagram} />
              </div>
            )}
          </div>

          <fieldset className="mt-7">
            <legend className="sr-only">Choose one answer</legend>
            <div className="grid gap-3 md:grid-cols-2">
              {current.choices.map((choice, index) => {
                const active = selectedAnswer === choice.originalIndex;
                return (
                  <button
                    key={`${current.question.id}-${choice.originalIndex}`}
                    type="button"
                    onClick={() => setAnswers((previous) => ({ ...previous, [current.question.id]: choice.originalIndex }))}
                    aria-pressed={active}
                    className={`flex min-h-20 items-center gap-4 border-2 border-slate-950 p-4 text-left font-bold leading-6 transition focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                      active ? "bg-blue-200 shadow-[4px_4px_0_#171717]" : "bg-white hover:bg-slate-100"
                    }`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center border-2 border-slate-950 bg-amber-100 font-black">{index + 1}</span>
                    <span className="min-w-0 [overflow-wrap:anywhere]">{choice.label}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t-2 border-slate-950 pt-5">
            <p className="hidden text-sm font-semibold text-slate-600 sm:block">Keys: 1–4 choose · ←/→ move · Enter advances</p>
            <div className="flex w-full gap-3 sm:w-auto">
              <button
                type="button"
                onClick={() => moveQuestion(-1)}
                disabled={currentIndex === 0}
                className="flex-1 border-2 border-slate-950 bg-white px-5 py-3 font-black disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:flex-none"
              >
                Previous
              </button>
              {currentIndex === session.length - 1 ? (
                <button type="button" onClick={finishSession} className="flex-1 border-2 border-slate-950 bg-pink-200 px-5 py-3 font-black shadow-[4px_4px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:flex-none">
                  Finish
                </button>
              ) : (
                <button type="button" onClick={() => moveQuestion(1)} className="flex-1 border-2 border-slate-950 bg-blue-200 px-5 py-3 font-black shadow-[4px_4px_0_#171717] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:flex-none">
                  Next
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
