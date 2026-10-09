"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import PracticeTimer from "@/app/components/PracticeTimer";
import { downloadText } from "@/app/lib/practice";
import {
  ESSAY_BOOK_CREDIT,
  essayBookGuide,
  essayChecklist,
  essayIssbNotes,
  essayOutlineTemplate,
  essayStructureSummary,
  essayTiming,
  essayTopics,
  findEssayTopic,
  type EssayGuideSection,
} from "@/app/content/psychological-tests/essay";
import { essayMetrics } from "@/app/lib/essay-assessment/metrics";
import {
  ESSAY_ASSESSMENT_VERSION,
  ESSAY_MAX_CUSTOM_TOPIC_LENGTH,
  ESSAY_MAX_LENGTH,
  ESSAY_MAX_PLAN_LENGTH,
  ESSAY_MIN_WORDS,
  type EssayAssessmentResult,
} from "@/app/lib/essay-assessment/types";

const DRAFT_KEY = "issb-essay-drafts-v1";
const LAST_TOPIC_KEY = "issb-essay-last-topic-v1";
const CUSTOM = "custom";

type Draft = { plan: string; essay: string; checks: string[]; customTopic?: string };
const EMPTY: Draft = { plan: "", essay: "", checks: [] };

function readDrafts(): Record<string, Draft> {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? (parsed as Record<string, Draft>) : {};
  } catch {
    return {};
  }
}

function saveDraft(topicId: string, draft: Draft) {
  try {
    const drafts = readDrafts();
    if (draft.plan || draft.essay || draft.checks.length || draft.customTopic) drafts[topicId] = draft;
    else delete drafts[topicId];
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
    window.localStorage.setItem(LAST_TOPIC_KEY, topicId);
  } catch {
    // storage blocked: the draft still lives on the page
  }
}

function errorMessage(value: unknown): string {
  if (value && typeof value === "object" && "error" in value) {
    const error = (value as { error?: { message?: unknown } }).error;
    if (error && typeof error.message === "string") return error.message;
  }
  return "The essay checker is busy right now. Please try again. Your essay is saved.";
}

const CATEGORIES = Array.from(new Set(essayTopics.map((topic) => topic.category)));

export default function EssayPractice() {
  const [openSection, setOpenSection] = useState<EssayGuideSection | null>(null);
  const [topicId, setTopicId] = useState<string>(essayTopics[0].id);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [result, setResult] = useState<EssayAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const feedbackRef = useRef<HTMLDivElement>(null);

  // Restore the last topic and its draft after mount (localStorage only).
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const last = window.localStorage.getItem(LAST_TOPIC_KEY);
        const id = last && (last === CUSTOM || findEssayTopic(last)) ? last : essayTopics[0].id;
        setTopicId(id);
        setDraft({ ...EMPTY, ...readDrafts()[id] });
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed(Math.round((Date.now() - started) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [loading]);

  const update = (patch: Partial<Draft>) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      saveDraft(topicId, next);
      return next;
    });
  };

  const chooseTopic = (id: string) => {
    if (id === topicId) return;
    setTopicId(id);
    setDraft({ ...EMPTY, ...readDrafts()[id] });
    setResult(null);
    setError(null);
    try {
      window.localStorage.setItem(LAST_TOPIC_KEY, id);
    } catch {
      // ignore
    }
  };

  const randomTopic = () => {
    const pool = essayTopics.filter((topic) => topic.id !== topicId);
    chooseTopic(pool[Math.floor(Math.random() * pool.length)].id);
  };

  const topicTitle = topicId === CUSTOM ? draft.customTopic?.trim() || "" : findEssayTopic(topicId)?.title ?? "";
  const metrics = useMemo(() => essayMetrics(draft.essay), [draft.essay]);
  const hints = useMemo(() => liveHints(metrics), [metrics]);
  const { min, max } = essayTiming.targetWords;

  const check = async () => {
    if (loading) return;
    if (!topicTitle) {
      setError("Type your essay title first.");
      return;
    }
    if (metrics.words < ESSAY_MIN_WORDS) {
      setError(`Write at least ${ESSAY_MIN_WORDS} words first. The target is ${min} to ${max}.`);
      return;
    }
    setLoading(true);
    setElapsed(0);
    setError(null);
    try {
      const response = await fetch("/api/essay-assessment", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: ESSAY_ASSESSMENT_VERSION,
          topicId,
          ...(topicId === CUSTOM ? { customTopic: topicTitle } : {}),
          essay: draft.essay,
          plan: draft.plan,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(payload));
      setResult(payload as EssayAssessmentResult);
      window.setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (checkError) {
      setResult(null);
      setError(
        checkError instanceof Error && checkError.message !== "Failed to fetch"
          ? checkError.message
          : "Could not reach the essay checker. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="prep-page">
      <div className="prep-shell">
        <Link className="essay-back" href="/psychological">← Psychological tests</Link>
        <header className="prep-header">
          <p className="gk-tile-kicker">Psychological test</p>
          <h1>Essay writing</h1>
          <p>
            Pick a title, plan for {essayTiming.planMinutes} minutes, then write about {min} to {max} words
            in {essayTiming.minutes} minutes. When you finish, the AI examiner marks your essay against the
            rules below and shows you exactly what to fix.
          </p>
        </header>

        <section className="prep-panel" aria-labelledby="essay-guide-heading">
          <p className="gk-tile-kicker">Read first</p>
          <h2 id="essay-guide-heading">How to write the essay</h2>
          <p>
            Eleven steps from a well-known essay guide. Tap a card to read it. The AI examiner marks
            you on these same rules.
          </p>
          <p className="essay-quote">
            &ldquo;{essayStructureSummary.quote}&rdquo;
          </p>
          <div className="gk-tile-grid">
            {essayBookGuide.map((section) => (
              <button key={section.id} type="button" className="gk-tile" onClick={() => setOpenSection(section)}>
                <strong className="gk-tile-title">{section.title}</strong>
                <span className="gk-tile-teaser">{section.teaser}</span>
                <span className="gk-tile-cta">Read →</span>
              </button>
            ))}
          </div>
          <p className="prep-muted essay-credit">{ESSAY_BOOK_CREDIT} Summarised in our own words, with short quotes.</p>
          <div className="prep-note">
            <strong>ISSB notes (from prep sites, not from the book)</strong>
            <ul>
              {essayIssbNotes.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
            <p className="prep-muted">
              Sources:{" "}
              {essayIssbNotes.sources.map((source, index) => (
                <span key={source.href}>
                  {index ? " · " : ""}
                  <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                </span>
              ))}
            </p>
          </div>
        </section>

        <section className="prep-panel" aria-labelledby="essay-write-heading">
          <p className="gk-tile-kicker">Your turn</p>
          <h2 id="essay-write-heading">Write your essay</h2>

          <div className="essay-topic-row">
            <label className="prep-field essay-topic-select">
              Essay title
              <select value={topicId} onChange={(event) => chooseTopic(event.target.value)} disabled={!hydrated}>
                {CATEGORIES.map((category) => (
                  <optgroup key={category} label={category}>
                    {essayTopics.filter((topic) => topic.category === category).map((topic) => (
                      <option key={topic.id} value={topic.id}>{topic.title}</option>
                    ))}
                  </optgroup>
                ))}
                <option value={CUSTOM}>My own title…</option>
              </select>
            </label>
            <button type="button" className="prep-button prep-button-secondary" onClick={randomTopic} disabled={!hydrated}>
              Random title
            </button>
          </div>
          {topicId === CUSTOM ? (
            <label className="prep-field">
              Type your title
              <input
                type="text"
                maxLength={ESSAY_MAX_CUSTOM_TOPIC_LENGTH}
                value={draft.customTopic ?? ""}
                placeholder="e.g. Role of youth in nation building"
                onChange={(event) => update({ customTopic: event.target.value })}
              />
            </label>
          ) : null}
          <div className="prep-ask-block">
            <p className="prep-ask-label">Your title</p>
            <p className="prep-ask">{topicTitle || "Type a title above"}</p>
          </div>

          <PracticeTimer seconds={essayTiming.minutes * 60} label={`${essayTiming.minutes} minute essay`} />

          <details className="prep-details essay-helper">
            <summary>Checklist and outline helper</summary>
            <p className="prep-muted">Tick each one as you go. Ticks are saved with your draft.</p>
            <ul className="essay-checklist">
              {essayChecklist.map((item) => {
                const checked = draft.checks.includes(item.id);
                return (
                  <li key={item.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          update({ checks: checked ? draft.checks.filter((id) => id !== item.id) : [...draft.checks, item.id] })
                        }
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="prep-button prep-button-secondary"
              onClick={() => update({ plan: draft.plan.trim() ? `${draft.plan.trimEnd()}\n\n${essayOutlineTemplate}` : essayOutlineTemplate })}
            >
              Put the outline in my plan box
            </button>
          </details>

          <label className="prep-field">
            Plan ({essayTiming.planMinutes} minutes): key words, your points in order
            <textarea
              className="essay-plan"
              dir="auto"
              maxLength={ESSAY_MAX_PLAN_LENGTH}
              value={draft.plan}
              placeholder={"Key words: ...\n1. Opening: my approach\n2. Point + example\n3. Point + example\n4. Other side + my answer\n5. Conclusion: my judgement"}
              onChange={(event) => update({ plan: event.target.value })}
            />
          </label>

          <label className="prep-field">
            Essay (press Enter to start a new paragraph)
            <textarea
              className="essay-text"
              dir="auto"
              maxLength={ESSAY_MAX_LENGTH}
              value={draft.essay}
              placeholder="Start with a sentence that deals with the title straight away…"
              onChange={(event) => update({ essay: event.target.value })}
            />
          </label>

          <div className="essay-counter" aria-live="polite">
            <span className={metrics.words >= min && metrics.words <= max ? "essay-ok" : undefined}>
              <strong>{metrics.words}</strong> words <small>({min}–{max})</small>
            </span>
            <span><strong>{metrics.paragraphs}</strong> paragraphs</span>
            <span><strong>{metrics.sentences}</strong> sentences</span>
            <span><strong>{metrics.averageWordsPerSentence || 0}</strong> words per sentence</span>
          </div>
          {hints.length ? (
            <ul className="essay-hints">
              {hints.map((hint) => <li key={hint}>{hint}</li>)}
            </ul>
          ) : null}
          <p className="prep-muted">Your plan and essay are saved only in this browser.</p>

          <div className="prep-actions">
            <button type="button" className="prep-button" onClick={check} disabled={loading || !hydrated || !draft.essay.trim()}>
              {loading ? `Marking… ${elapsed}s` : result ? "Check again" : "Check my essay"}
            </button>
            <button
              type="button"
              className="prep-button prep-button-secondary"
              disabled={!draft.essay.trim()}
              onClick={() => downloadText("issb-essay.txt", `${topicTitle}\n\nPLAN\n${draft.plan}\n\nESSAY\n${draft.essay}\n`)}
            >
              Download
            </button>
            <button
              type="button"
              className="prep-button prep-button-secondary"
              disabled={!draft.essay && !draft.plan}
              onClick={() => {
                if (window.confirm("Clear this plan and essay?")) {
                  update({ plan: "", essay: "", checks: [] });
                  setResult(null);
                }
              }}
            >
              Clear
            </button>
          </div>
          {loading ? (
            <p className="rgto-loading" role="status">
              The AI examiner is reading your essay against the rules above. This usually takes 30 to 60 seconds,
              sometimes up to 2 minutes when Google is busy. Keep this page open.
            </p>
          ) : null}
          {error ? <p className="rgto-error" role="alert">{error}</p> : null}
          <div ref={feedbackRef}>{result ? <EssayFeedback result={result} /> : null}</div>
        </section>
      </div>

      {openSection ? (
        <GuideModal onClose={() => setOpenSection(null)}>
          {(titleId) => <GuideBody section={openSection} titleId={titleId} />}
        </GuideModal>
      ) : null}
    </main>
  );
}

function liveHints(metrics: ReturnType<typeof essayMetrics>): string[] {
  if (!metrics.words) return [];
  const hints: string[] = [];
  const opening = metrics.sentencesPerParagraph[0] ?? 0;
  if (metrics.paragraphs < 3) {
    hints.push("You need at least three paragraphs: an opening, a body and a conclusion.");
  } else if (opening < 3 || opening > 6) {
    hints.push(`Your opening has ${opening} sentence${opening === 1 ? "" : "s"}. The guide suggests about four or five.`);
  }
  const thin = metrics.sentencesPerParagraph
    .map((count, index) => ({ count, index }))
    .filter(({ count, index }) => count < 2 && index > 0 && index < metrics.paragraphs - 1);
  if (thin.length) {
    hints.push(
      `Body paragraph${thin.length > 1 ? "s" : ""} ${thin.map(({ index }) => index + 1).join(", ")} ${thin.length > 1 ? "have" : "has"} one sentence. Add a key sentence, an example and a closing sentence.`,
    );
  }
  if (metrics.averageWordsPerSentence > 30) hints.push("Your sentences are very long. Break some up with full stops.");
  return hints;
}

function GuideModal({ onClose, children }: { onClose: () => void; children: (titleId: string) => ReactNode }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="gk-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>Close</button>
        </div>
        <article className="gk-modal-body">{children(titleId)}</article>
      </div>
    </div>
  );
}

function GuideBody({ section, titleId }: { section: EssayGuideSection; titleId: string }) {
  return (
    <>
      <p className="gk-tile-kicker">{section.chapter}</p>
      <h2 id={titleId}>{section.title}</h2>
      <ul className="essay-guide-list">
        {section.points.map((point) => <li key={point}>{point}</li>)}
      </ul>
      {section.quotes?.map((quote) => (
        <p key={quote} className="essay-quote">&ldquo;{quote}&rdquo;</p>
      ))}
      {section.phrases?.length ? (
        <>
          <h3>Phrases you can use</h3>
          <ul className="essay-phrases">
            {section.phrases.map((phrase) => <li key={phrase}>{phrase}</li>)}
          </ul>
        </>
      ) : null}
      <p className="prep-muted">{ESSAY_BOOK_CREDIT}</p>
    </>
  );
}

function EssayFeedback({ result }: { result: EssayAssessmentResult }) {
  const tone = result.overall >= 70 ? "correct" : result.overall >= 55 ? "partly-correct" : "incorrect";
  return (
    <section className={`rgto-feedback rgto-feedback--${tone} essay-feedback`} aria-live="polite">
      <p className="rgto-verdict">
        <span>{result.band}</span>
        <span>{result.overall}/100</span>
      </p>
      <p>{result.summary}</p>
      <p className="prep-muted">
        {result.metrics.words} words · {result.metrics.paragraphs} paragraphs · {result.metrics.sentences} sentences
      </p>

      <h4>Marks by rule</h4>
      <ul className="essay-scores">
        {result.subscores.map((item) => (
          <li key={item.id}>
            <div className="essay-score-head">
              <strong>{item.label}</strong>
              <span>{item.score}/10 <small>· worth {item.weight}</small></span>
            </div>
            <div className="essay-bar" aria-hidden="true"><span style={{ width: `${item.score * 10}%` }} /></div>
            {item.reason ? <p>{item.reason}</p> : null}
          </li>
        ))}
      </ul>

      {result.weakSentences.length ? (
        <>
          <h4>Fix these sentences</h4>
          <ul className="essay-rewrites">
            {result.weakSentences.map((item) => (
              <li key={`${item.original}:${item.rewrite}`}>
                <p><span className="essay-label">Yours:</span> {item.original}</p>
                <p><span className="essay-label">Why it is weak:</span> {item.problem}</p>
                <p><span className="essay-label essay-label--good">Better:</span> {item.rewrite}</p>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {result.nextSteps.length ? (
        <>
          <h4>What to practise next</h4>
          <ol className="rgto-ol">{result.nextSteps.map((item) => <li key={item}>{item}</li>)}</ol>
        </>
      ) : null}
      {result.strengths.length ? (
        <>
          <h4>What you did well</h4>
          <ul>{result.strengths.map((item) => <li key={item}>{item}</li>)}</ul>
        </>
      ) : null}
      <p className="prep-muted">{result.disclaimer}</p>
    </section>
  );
}
