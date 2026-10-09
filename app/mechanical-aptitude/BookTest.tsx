"use client";

import { useEffect, useRef, useState } from "react";
import {
  BOOK_DRILL_QUESTIONS,
  BOOK_EXAMPLE,
  BOOK_INTRO_QUESTIONS,
  BOOK_INTRO_TEXT,
  BOOK_TEST_QUESTIONS,
  type BookQuestion,
} from "./bookQuestions";

type SectionId = "intro" | "drill" | "test";
type Phase = "home" | "questions" | "results";

type SectionInfo = {
  id: SectionId;
  title: string;
  label: string;
  description: string;
  questions: BookQuestion[];
  /** Whole-section time limit in seconds (null = no timer). */
  totalSeconds: number | null;
  /** Per-question time limit in seconds (null = none). */
  perQuestionSeconds: number | null;
  passNote?: string;
};

const SECTIONS: SectionInfo[] = [
  {
    id: "intro",
    title: "Warm-up questions",
    label: "6 questions · no timer",
    description: "The book's first questions, right after the example. Take your time and learn the idea behind each one.",
    questions: BOOK_INTRO_QUESTIONS,
    totalSeconds: null,
    perQuestionSeconds: null,
  },
  {
    id: "drill",
    title: "Test questions (10 seconds)",
    label: "4 questions · 10 seconds each",
    description: "The book gives 10 seconds for each question. When time runs out, the next question opens.",
    questions: BOOK_DRILL_QUESTIONS,
    totalSeconds: null,
    perQuestionSeconds: 10,
    passNote: "You qualify if three are correct.",
  },
  {
    id: "test",
    title: "Full test",
    label: "50 problems · 20 minutes",
    description: "The book's main test: 50 problems in 20 minutes. That is 24 seconds for each. Work fast and skip what you can't do.",
    questions: BOOK_TEST_QUESTIONS,
    totalSeconds: 20 * 60,
    perQuestionSeconds: null,
  },
];

const STORAGE_KEY = "issb-mat-book-v1";

type Saved = Partial<Record<SectionId, { best: number; last: number; total: number; at: string }>>;

function readSaved(): Saved {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Saved;
  } catch {
    return {};
  }
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Figure({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="mx-auto block h-auto max-h-[380px] w-full max-w-[640px] object-contain" />
  );
}

export default function BookTest() {
  const [phase, setPhase] = useState<Phase>("home");
  const [sectionId, setSectionId] = useState<SectionId>("test");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [saved, setSaved] = useState<Saved>({});
  const deadlineRef = useRef<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS.find((item) => item.id === sectionId) ?? SECTIONS[2];
  const questions = section.questions;
  const current = questions[index];

  useEffect(() => {
    // Load saved scores after mount (localStorage only exists in the browser).
    const id = window.setTimeout(() => setSaved(readSaved()), 0);
    return () => window.clearTimeout(id);
  }, []);

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const finish = () => {
    deadlineRef.current = null;
    setPhase("results");
  };

  const resetDeadline = (info: SectionInfo) => {
    const seconds = info.perQuestionSeconds ?? info.totalSeconds;
    // Only called from click handlers, never during render.
    // eslint-disable-next-line react-hooks/purity
    deadlineRef.current = seconds ? Date.now() + seconds * 1000 : null;
    setSecondsLeft(seconds ?? 0);
  };

  const goNext = () => {
    if (index >= questions.length - 1) {
      finish();
      return;
    }
    setIndex(index + 1);
    if (section.perQuestionSeconds) resetDeadline(section);
  };

  useEffect(() => {
    if (phase !== "questions") return;
    const info = SECTIONS.find((item) => item.id === sectionId) ?? SECTIONS[2];
    const timer = window.setInterval(() => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left > 0) return;
      if (info.perQuestionSeconds && index < info.questions.length - 1) {
        deadlineRef.current = Date.now() + info.perQuestionSeconds * 1000;
        setSecondsLeft(info.perQuestionSeconds);
        setIndex(index + 1);
      } else {
        deadlineRef.current = null;
        setPhase("results");
      }
    }, 250);
    return () => window.clearInterval(timer);
  }, [phase, sectionId, index]);

  useEffect(() => {
    if (phase !== "results") return;
    const correct = questions.filter((question) => answers[question.id] === question.answer).length;
    const previous = readSaved();
    const old = previous[sectionId];
    const next: Saved = {
      ...previous,
      [sectionId]: { best: Math.max(old?.best ?? 0, correct), last: correct, total: questions.length, at: new Date().toISOString() },
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage may be full or blocked; scores are just not saved
    }
    const id = window.setTimeout(() => setSaved(next), 0);
    return () => window.clearTimeout(id);
  }, [phase, answers, questions, sectionId]);

  const start = (id: SectionId) => {
    const info = SECTIONS.find((item) => item.id === id) ?? SECTIONS[2];
    setSectionId(id);
    setIndex(0);
    setAnswers({});
    resetDeadline(info);
    setPhase("questions");
    window.setTimeout(scrollTop, 0);
  };

  const choose = (choice: number) => {
    if (!current) return;
    setAnswers((previous) => ({ ...previous, [current.id]: choice }));
  };

  const correctCount = questions.filter((question) => answers[question.id] === question.answer).length;

  return (
    <section className="px-4 py-10 sm:px-6" aria-labelledby="mat-book-title">
      <div ref={topRef} className="mx-auto max-w-6xl scroll-mt-24">
        {phase === "home" && (
          <>
            <header>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-800">ISSB MAT · from the DBISSB book</p>
              <h1 id="mat-book-title" className="mt-4 max-w-4xl text-4xl font-black leading-none [overflow-wrap:anywhere] sm:text-6xl">
                Mechanical Aptitude Test
              </h1>
              <div className="mt-6 max-w-3xl space-y-4 text-lg font-semibold leading-8 text-slate-700">
                {BOOK_INTRO_TEXT.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </header>

            <section className="mt-8 border-2 border-slate-950 bg-amber-50 p-5 shadow-[6px_6px_0_#171717] sm:p-8" aria-label="Worked example">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-800">Example</p>
              <p className="mt-2 text-xl font-black">{BOOK_EXAMPLE.question}</p>
              <div className="mt-4 bg-white p-3">
                <Figure src={BOOK_EXAMPLE.image} alt="Two pairs of scissors, A and B" />
              </div>
              <p className="mt-4 text-lg font-black">Answer: {BOOK_EXAMPLE.answer}.</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">
                Look at the blades and the pivot. Scissors B are made to cut better, so B is the answer. Most questions are like this: look closely, think of the simple rule, answer fast.
              </p>
            </section>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {SECTIONS.map((info, position) => {
                const record = saved[info.id];
                return (
                  <article key={info.id} className={`flex flex-col border-2 border-slate-950 p-5 shadow-[5px_5px_0_#171717] ${info.id === "test" ? "bg-blue-100" : "bg-white"}`}>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-600">Step {position + 1}</p>
                    <h2 className="mt-1 text-2xl font-black">{info.title}</h2>
                    <p className="mt-1 font-black text-blue-800">{info.label}</p>
                    <p className="mt-3 flex-1 text-sm font-semibold leading-6 text-slate-700">{info.description}</p>
                    {record && (
                      <p className="mt-3 text-sm font-black text-emerald-800">
                        Best {record.best}/{record.total} · last {record.last}/{record.total}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => start(info.id)}
                      className="mt-4 border-2 border-slate-950 bg-slate-950 px-5 py-3 font-black text-white hover:bg-blue-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      Start
                    </button>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 text-sm font-semibold text-slate-600">
              Want more? <a href="#extra-practice" className="font-black text-blue-800 underline">Extra practice</a> below has 100 more picture questions. Your scores are saved only on this device.
            </p>
          </>
        )}

        {phase === "questions" && current && (
          <div>
            <header className="flex flex-wrap items-center justify-between gap-4 border-2 border-slate-950 bg-white p-4 shadow-[4px_4px_0_#171717]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">{section.title}</p>
                <p className="mt-1 font-black">Question {index + 1} of {questions.length}</p>
              </div>
              {(section.perQuestionSeconds ?? section.totalSeconds) !== null && (
                <div
                  className={`border-2 border-slate-950 px-4 py-2 text-2xl font-black tabular-nums ${secondsLeft <= (section.perQuestionSeconds ? 3 : 60) ? "bg-rose-200" : "bg-amber-100"}`}
                  aria-live="polite"
                >
                  {formatTime(secondsLeft)}
                </div>
              )}
            </header>
            <div className="mt-2 h-2 border border-slate-950 bg-white">
              <div className="h-full bg-blue-700" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
            </div>

            <article className="mt-6 border-2 border-slate-950 bg-white p-4 shadow-[6px_6px_0_#171717] sm:p-8">
              <h2 className="text-xl font-black leading-8 [overflow-wrap:anywhere] sm:text-2xl">
                {index + 1}. {current.question}
              </h2>
              <div className="mt-5 border border-slate-300 bg-white p-2">
                <Figure src={current.image} alt={`Figure for question ${index + 1}`} />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {current.options.map((option, choice) => {
                  const picked = answers[current.id] === choice;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(choice)}
                      aria-pressed={picked}
                      className={`border-2 border-slate-950 px-4 py-4 text-left text-lg font-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${picked ? "bg-slate-950 text-white shadow-[4px_4px_0_#1d4ed8]" : "bg-white hover:bg-slate-100"}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </article>

            <div className="mt-6 flex flex-wrap justify-between gap-3">
              <div className="flex gap-3">
                {!section.perQuestionSeconds && (
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => setIndex(index - 1)}
                    className="border-2 border-slate-950 bg-white px-5 py-3 font-black disabled:opacity-40"
                  >
                    Back
                  </button>
                )}
                <button type="button" onClick={goNext} className="border-2 border-slate-950 bg-slate-950 px-5 py-3 font-black text-white hover:bg-blue-800">
                  {index === questions.length - 1 ? "Finish" : "Next"}
                </button>
              </div>
              <button type="button" onClick={finish} className="border-2 border-slate-950 bg-amber-100 px-5 py-3 font-black">
                End and see score
              </button>
            </div>
          </div>
        )}

        {phase === "results" && (
          <div>
            <header className="border-2 border-slate-950 bg-white p-5 shadow-[6px_6px_0_#171717] sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">{section.title} · score</p>
              <p className="mt-2 text-5xl font-black">{correctCount}/{questions.length}</p>
              <p className="mt-2 font-semibold text-slate-700">
                {Object.keys(answers).length} answered · {questions.length - Object.keys(answers).length} left blank
              </p>
              {section.passNote && (
                <p className={`mt-3 font-black ${correctCount >= 3 ? "text-emerald-800" : "text-rose-800"}`}>
                  {section.passNote} {correctCount >= 3 ? "You qualified." : "Not yet. Try again."}
                </p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => start(sectionId)} className="border-2 border-slate-950 bg-slate-950 px-5 py-3 font-black text-white">Try again</button>
                <button type="button" onClick={() => { setPhase("home"); window.setTimeout(scrollTop, 0); }} className="border-2 border-slate-950 bg-white px-5 py-3 font-black">Back to the test menu</button>
              </div>
            </header>

            <h2 className="mt-10 text-3xl font-black">Review</h2>
            <ol className="mt-5 space-y-6">
              {questions.map((question, position) => {
                const picked = answers[question.id];
                const right = picked === question.answer;
                return (
                  <li key={question.id} className={`border-2 border-slate-950 p-4 sm:p-6 ${right ? "bg-emerald-50" : "bg-rose-50"}`}>
                    <p className="text-lg font-black leading-7">{position + 1}. {question.question}</p>
                    <div className="mt-3 bg-white p-2">
                      <Figure src={question.image} alt={`Figure for question ${position + 1}`} />
                    </div>
                    <p className="mt-3 font-black">
                      Your answer: {picked === undefined ? "No answer" : question.options[picked]} {right ? "✓" : "✗"}
                    </p>
                    <p className="font-black text-emerald-800">
                      Correct answer: {question.options[question.answer]}
                      {question.answerSource === "derived" ? " (worked out, see note)" : " (book's answer key)"}
                    </p>
                    {question.explanation && <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">{question.explanation}</p>}
                    {question.flag && (
                      <p className="mt-2 border-l-4 border-amber-500 bg-amber-50 p-2 text-sm font-semibold leading-6 text-amber-900">Note: {question.flag}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
