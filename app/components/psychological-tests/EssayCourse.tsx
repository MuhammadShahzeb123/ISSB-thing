"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import TitleWithAudio from "@/app/components/TitleWithAudio";
import {
  ESSAY_COURSE_VERSION,
  essayCourseLessons,
  type EssayCourseLesson,
} from "@/app/content/psychological-tests/essay-course";
import { ESSAY_BOOK_CREDIT } from "@/app/content/psychological-tests/essay";
import type { EssayCourseCheckResult } from "@/app/lib/essay-course/check";
import { essayCourseNarration } from "@/app/lib/essayCourseNarration";

const DONE_KEY = "issb-essay-course-done-v1";
const ANSWERS_KEY = "issb-essay-course-answers-v1";
const AUTOPLAY_KEY = "issb-essay-course-autoplay-v1";
const MAX_ANSWER = 3_000;
const CLIENT_TIMEOUT_MS = 115_000;

type DoneMap = Record<string, true>;
type AnswerMap = Record<string, string>;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // private browsing or full storage
  }
}

export default function EssayCourse({ onStartTest }: { onStartTest: () => void }) {
  const [done, setDone] = useState<DoneMap>({});
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [autoplay, setAutoplay] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    // Load device progress after mount so the first paint matches the server render.
    const timer = window.setTimeout(() => {
      setDone(readJson<DoneMap>(DONE_KEY, {}));
      setAnswers(readJson<AnswerMap>(ANSWERS_KEY, {}));
      setAutoplay(readJson<boolean>(AUTOPLAY_KEY, true) !== false);
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated.current) writeJson(DONE_KEY, done);
  }, [done]);
  useEffect(() => {
    if (hydrated.current) writeJson(ANSWERS_KEY, answers);
  }, [answers]);
  useEffect(() => {
    if (hydrated.current) writeJson(AUTOPLAY_KEY, autoplay);
  }, [autoplay]);

  const doneCount = essayCourseLessons.filter((lesson) => done[lesson.id]).length;
  const nextUp = essayCourseLessons.find((lesson) => !done[lesson.id]) ?? essayCourseLessons[0];
  const openLesson = openId ? essayCourseLessons.find((lesson) => lesson.id === openId) ?? null : null;

  const openIdRef = useRef(openId);
  const autoplayRef = useRef(autoplay);
  useEffect(() => {
    openIdRef.current = openId;
    autoplayRef.current = autoplay;
  }, [openId, autoplay]);

  const closeModal = useCallback(() => setOpenId(null), []);

  const toggleDone = (id: string) =>
    setDone((current) => {
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  // When a lesson's audio finishes: mark it done and open the next lesson.
  // Returning the next file keeps the same player going (like GK stories).
  const onAudioEnded = useCallback((): string | void => {
    const id = openIdRef.current;
    if (!id) return;
    setDone((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    const index = essayCourseLessons.findIndex((lesson) => lesson.id === id);
    const next = index >= 0 ? essayCourseLessons[index + 1] : undefined;
    if (!next) return;
    setOpenId(next.id);
    if (autoplayRef.current) return essayCourseNarration[next.id]?.audio;
  }, []);

  return (
    <section className="prep-panel essay-course" aria-labelledby="essay-course-heading">
      <p className="gk-tile-kicker">Learn first · audio course</p>
      <h2 id="essay-course-heading">Essay course: learn to write an essay</h2>
      <p>
        Sixteen short lessons, about two minutes each, that follow a well-known essay guide step by step.
        Press <strong>Play</strong> in a lesson to listen. When a lesson ends it is marked done and the next one opens.
        Each lesson has a worked example and a short <strong>Your turn</strong> task the AI coach can check.
      </p>
      <div className="essay-course-progress" aria-label={`${doneCount} of ${essayCourseLessons.length} lessons done`}>
        <div className="essay-course-progress-bar" style={{ width: `${(doneCount / essayCourseLessons.length) * 100}%` }} />
      </div>
      <div className="prep-actions essay-course-actions">
        <button type="button" className="prep-button" onClick={() => setOpenId(nextUp.id)}>
          {doneCount === 0 ? "Start lesson 1" : doneCount === essayCourseLessons.length ? "Review lesson 1" : `Continue: lesson ${nextUp.number}`}
        </button>
        <span className="prep-muted">
          {doneCount}/{essayCourseLessons.length} done · saved on this device
        </span>
        <label className="essay-course-toggle">
          <input type="checkbox" checked={autoplay} onChange={(event) => setAutoplay(event.target.checked)} />
          Keep playing the next lesson
        </label>
        {doneCount > 0 && (
          <button type="button" className="prep-button-secondary" onClick={() => setDone({})}>
            Reset progress
          </button>
        )}
      </div>

      <div className="gk-tile-grid essay-course-grid">
        {essayCourseLessons.map((lesson) => {
          const isDone = Boolean(done[lesson.id]);
          return (
            <button
              key={lesson.id}
              type="button"
              className={`gk-tile essay-course-tile${isDone ? " gk-tile--done" : ""}`}
              onClick={() => setOpenId(lesson.id)}
            >
              <span className="gk-tile-meta">
                <span className="gk-badge gk-badge--source">Lesson {lesson.number}</span>
                <span className={isDone ? "gk-badge gk-done-badge" : "gk-badge gk-remaining-badge"}>
                  {isDone ? "Done" : "To do"}
                </span>
              </span>
              <strong className="gk-tile-title">{lesson.title}</strong>
              <span className="gk-tile-teaser">{lesson.teaser}</span>
              <span className="gk-tile-cta">{lesson.task ? "Listen & try →" : "Listen, then take the test →"}</span>
            </button>
          );
        })}
      </div>
      <p className="prep-muted essay-credit">{ESSAY_BOOK_CREDIT} Taught in our own words, with short quotes.</p>

      {openLesson && (
        <LessonModal
          lesson={openLesson}
          done={Boolean(done[openLesson.id])}
          answer={answers[openLesson.id] ?? ""}
          onAnswer={(value) => setAnswers((current) => ({ ...current, [openLesson.id]: value }))}
          onClose={closeModal}
          onToggleDone={() => toggleDone(openLesson.id)}
          onOpen={setOpenId}
          onAudioEnded={onAudioEnded}
          onStartTest={() => {
            setDone((prev) => ({ ...prev, [openLesson.id]: true }));
            setOpenId(null);
            onStartTest();
          }}
        />
      )}
    </section>
  );
}

function LessonModal({
  lesson,
  done,
  answer,
  onAnswer,
  onClose,
  onToggleDone,
  onOpen,
  onAudioEnded,
  onStartTest,
}: {
  lesson: EssayCourseLesson;
  done: boolean;
  answer: string;
  onAnswer: (value: string) => void;
  onClose: () => void;
  onToggleDone: () => void;
  onOpen: (id: string) => void;
  onAudioEnded: () => string | void;
  onStartTest: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const index = essayCourseLessons.findIndex((item) => item.id === lesson.id);
  const previous = essayCourseLessons[index - 1];
  const next = essayCourseLessons[index + 1];
  const narration = essayCourseNarration[lesson.id];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.scrollTop = 0;
    dialog.querySelector<HTMLElement>(".gk-modal-body")?.scrollTo(0, 0);
  }, [lesson.id]);

  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div ref={dialogRef} className="gk-modal essay-course-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button type="button" className="gk-mark-btn" onClick={onToggleDone}>
            {done ? "Mark not done" : "Mark done"}
          </button>
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <article className="gk-modal-body">
          <p className="gk-tile-kicker">
            Lesson {lesson.number} of {essayCourseLessons.length} · {lesson.chapter}
          </p>
          <TitleWithAudio
            as="h2"
            className="gk-modal-title-row"
            script={narration?.script}
            audioSrc={narration?.audio}
            playLabel={`Play lesson ${lesson.number}: ${lesson.title}`}
            onEnded={onAudioEnded}
          >
            <span id={titleId}>{lesson.title}</span>
          </TitleWithAudio>

          <ul className="essay-guide-list">
            {lesson.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {lesson.quote && <p className="essay-quote">&ldquo;{lesson.quote}&rdquo; <span className="prep-muted">— Don Shiach</span></p>}

          <h3>Worked example</h3>
          <p className="essay-course-example-heading">{lesson.example.heading}</p>
          <div className="essay-course-example">
            <div className="essay-course-version essay-course-version--weak">
              <span className="essay-course-tag">Weak</span>
              <p>{lesson.example.weak}</p>
            </div>
            <div className="essay-course-version essay-course-version--better">
              <span className="essay-course-tag">Better</span>
              <p>{lesson.example.better}</p>
            </div>
          </div>
          <p className="prep-note">
            <strong>Why: </strong>
            {lesson.example.why}
          </p>

          {lesson.task ? (
            <YourTurn key={lesson.id} lesson={lesson} answer={answer} onAnswer={onAnswer} />
          ) : (
            <div className="essay-course-final">
              <h3>Your turn: the full Essay test</h3>
              <p>
                Pick a title, plan, write for 30 minutes, and the AI examiner marks your essay against the rules from this
                course.
              </p>
              <button type="button" className="prep-button" onClick={onStartTest}>
                Take the Essay test →
              </button>
            </div>
          )}

          <nav className="essay-course-nav" aria-label="Lessons">
            {previous ? (
              <button type="button" className="prep-button-secondary" onClick={() => onOpen(previous.id)}>
                ← Lesson {previous.number}
              </button>
            ) : (
              <span />
            )}
            {next ? (
              <button type="button" className="prep-button-secondary" onClick={() => onOpen(next.id)}>
                Lesson {next.number} →
              </button>
            ) : (
              <button type="button" className="prep-button-secondary" onClick={onStartTest}>
                Essay test →
              </button>
            )}
          </nav>
          <p className="prep-muted">{ESSAY_BOOK_CREDIT}</p>
        </article>
      </div>
    </div>
  );
}

function YourTurn({
  lesson,
  answer,
  onAnswer,
}: {
  lesson: EssayCourseLesson;
  answer: string;
  onAnswer: (value: string) => void;
}) {
  const task = lesson.task!;
  const fieldId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EssayCourseCheckResult | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  async function check() {
    const trimmed = answer.trim();
    if (trimmed.length < 10) {
      setError("Write a little more before checking.");
      return;
    }
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timer = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/essay-course-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: ESSAY_COURSE_VERSION, lessonId: lesson.id, answer: trimmed }),
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => null)) as
        | EssayCourseCheckResult
        | { error?: { message?: string } }
        | null;
      if (!response.ok || !payload || !("verdict" in payload)) {
        const message = payload && "error" in payload ? payload.error?.message : undefined;
        setError(message ?? "The coach is busy right now. Please try again. Your answer is saved.");
        return;
      }
      setResult(payload);
    } catch {
      if (controllerRef.current === controller) {
        setError("The check took too long. Please try again. Your answer is saved.");
      }
    } finally {
      window.clearTimeout(timer);
      if (controllerRef.current === controller) setLoading(false);
    }
  }

  return (
    <div className="essay-course-task">
      <h3>Your turn</h3>
      <p>{task.prompt}</p>
      {task.given && <p className="essay-course-given">{task.given}</p>}
      <label className="prep-field" htmlFor={fieldId}>
        Your answer <span className="prep-muted">({task.lengthHint})</span>
      </label>
      <textarea
        id={fieldId}
        className="essay-course-answer"
        rows={6}
        maxLength={MAX_ANSWER}
        value={answer}
        placeholder={task.placeholder}
        onChange={(event) => onAnswer(event.target.value)}
      />
      <div className="prep-actions">
        <button type="button" className="prep-button" onClick={check} disabled={loading || answer.trim().length === 0}>
          {loading ? "Checking…" : "Check with AI coach"}
        </button>
        <span className="prep-muted">Optional. Your answer stays on this device until you press Check.</span>
      </div>
      {loading && <p className="rgto-loading">The coach is reading your answer. This can take up to a minute.</p>}
      {error && <p className="rgto-error" role="alert">{error}</p>}
      {result && <CheckFeedback result={result} />}
    </div>
  );
}

function CheckFeedback({ result }: { result: EssayCourseCheckResult }) {
  const tone = result.verdict === "strong" ? "correct" : result.verdict === "almost" ? "partly-correct" : "incorrect";
  const label = result.verdict === "strong" ? "Strong" : result.verdict === "almost" ? "Almost there" : "Not yet";
  return (
    <section className={`rgto-feedback rgto-feedback--${tone}`} aria-live="polite">
      <p className="rgto-verdict">
        <span>{label}</span>
        <span>{result.score}/10</span>
      </p>
      <p>{result.summary}</p>
      {result.didWell.length > 0 && (
        <>
          <h4>What worked</h4>
          <ul>
            {result.didWell.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {result.toFix.length > 0 && (
        <>
          <h4>Fix next</h4>
          <ul>
            {result.toFix.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {result.betterVersion && (
        <>
          <h4>A better version</h4>
          <p className="essay-course-given">{result.betterVersion}</p>
        </>
      )}
      <p className="prep-muted">AI feedback can be wrong. Use it as a coach, not a final mark.</p>
    </section>
  );
}
