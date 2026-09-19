'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import DimensionNav from './DimensionNav';
import { downloadText, formatClock, shuffleItems } from '../lib/practice';
import { completionPracticeSets, completionSentences, type CompletionPracticeSet } from '../picturestest/completionSentences';

type FinishReason = 'completed' | 'ended' | 'expired';

interface CompletionSession {
  set: CompletionPracticeSet;
  questions: { prompt: string; sourceNumber: number }[];
  answers: (string | null)[];
  index: number;
  draft: string;
  phase: 'practice' | 'review';
  startedAt: number;
  endedAt: number | null;
  deadline: number | null;
  duration: number | null;
  shuffled: boolean;
  reason: FinishReason | null;
}

function CompletionSource({ set }: { set: CompletionPracticeSet }) {
  return set.sourceImage ? (
    <p className="prep-muted" dir="ltr">
      Source: <Link href={`/sources#${set.sourceImage}`} target="_blank" rel="noopener noreferrer">
        {set.sourceImage}{set.sourcePage ? `, page ${set.sourcePage}` : ''}
      </Link>
    </p>
  ) : <p className="prep-muted">Original site practice prompts, not a photographed source.</p>;
}

export default function SentenceCompletionPractice({ onBack }: { onBack: () => void }) {
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [selectedId, setSelectedId] = useState(completionPracticeSets.find((set) => set.language === 'en')?.id ?? '');
  const [lengthMode, setLengthMode] = useState<'whole' | 'short'>('whole');
  const [shortCount, setShortCount] = useState('10');
  const [shuffled, setShuffled] = useState(false);
  const [timed, setTimed] = useState(true);
  const [session, setSession] = useState<CompletionSession | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const sessionRef = useRef<CompletionSession | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const composingRef = useRef(false);

  const availableSets = completionPracticeSets.filter((set) => set.language === language);
  const selectedSet = availableSets.find((set) => set.id === selectedId) ?? availableSets[0];
  const photoSets = completionPracticeSets.filter((set) => set.origin === 'photo');
  const photoStemCount = photoSets.reduce((total, set) => total + set.prompts.length, 0);
  const selectedCount = lengthMode === 'whole' ? selectedSet?.prompts.length ?? 0 : Number(shortCount);
  const countIsValid = Number.isInteger(selectedCount) && selectedCount > 0 && selectedCount <= (selectedSet?.prompts.length ?? 0);
  const plannedDuration = selectedSet && countIsValid
    ? Math.max(1, Math.ceil(selectedSet.seconds * selectedCount / selectedSet.prompts.length))
    : 0;
  const phase = session?.phase ?? 'setup';
  const currentIndex = session?.index ?? 0;
  const deadline = session?.deadline ?? null;
  const current = session?.questions[session.index];

  const updateSession = useCallback((next: CompletionSession | null) => {
    sessionRef.current = next;
    setSession(next);
  }, []);

  const finishSession = useCallback((reason: FinishReason) => {
    const active = sessionRef.current;
    if (!active || active.phase !== 'practice') return;
    const now = Date.now();
    const expired = active.deadline !== null && now >= active.deadline;
    if (reason === 'expired' && !expired) return;
    const answers = [...active.answers];
    answers[active.index] = active.draft.trim();
    composingRef.current = false;
    if (expired) setSecondsLeft(0);
    updateSession({
      ...active,
      answers,
      phase: 'review',
      endedAt: expired ? active.deadline : now,
      reason: expired ? 'expired' : reason,
    });
  }, [updateSession]);

  useEffect(() => {
    if (phase !== 'practice' || deadline === null) return;
    const tick = () => {
      const active = sessionRef.current;
      if (!active || active.phase !== 'practice' || active.deadline !== deadline) return;
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setSecondsLeft(remaining);
      if (remaining === 0) finishSession('expired');
    };
    const interval = window.setInterval(tick, 200);
    const timeout = window.setTimeout(tick, Math.max(0, deadline - Date.now()));
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      window.removeEventListener('focus', tick);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [phase, deadline, finishSession]);

  useEffect(() => {
    if (phase === 'practice') inputRef.current?.focus();
    else headingRef.current?.focus();
  }, [phase, currentIndex]);

  const startSession = (now: number) => {
    if (!selectedSet || !countIsValid || sessionRef.current?.phase === 'practice') return;
    const sourceQuestions = selectedSet.prompts.map((prompt, index) => ({ prompt, sourceNumber: index + 1 }));
    const questions = (shuffled ? shuffleItems(sourceQuestions) : sourceQuestions).slice(0, selectedCount);
    composingRef.current = false;
    setSecondsLeft(timed ? plannedDuration : 0);
    updateSession({
      set: selectedSet,
      questions,
      answers: Array<string | null>(questions.length).fill(null),
      index: 0,
      draft: '',
      phase: 'practice',
      startedAt: now,
      endedAt: null,
      deadline: timed ? now + plannedDuration * 1000 : null,
      duration: timed ? plannedDuration : null,
      shuffled,
      reason: null,
    });
  };

  const changeDraft = (value: string, expectedIndex: number) => {
    const active = sessionRef.current;
    if (!active || active.phase !== 'practice' || active.index !== expectedIndex) return;
    if (active.deadline !== null && Date.now() >= active.deadline) {
      finishSession('expired');
      return;
    }
    updateSession({ ...active, draft: value });
  };

  const saveAndNext = (expectedIndex: number) => {
    const active = sessionRef.current;
    if (!active || active.phase !== 'practice' || active.index !== expectedIndex) return;
    if (active.deadline !== null && Date.now() >= active.deadline) {
      finishSession('expired');
      return;
    }
    if (active.index === active.questions.length - 1) {
      finishSession('completed');
      return;
    }
    const answers = [...active.answers];
    answers[active.index] = active.draft.trim();
    composingRef.current = false;
    updateSession({ ...active, answers, index: active.index + 1, draft: '' });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>, expectedIndex: number) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229 || composingRef.current) return;
    event.preventDefault();
    if (!event.repeat) saveAndNext(expectedIndex);
  };

  const downloadResponses = () => {
    if (!session || session.phase !== 'review') return;
    const source = session.set.sourceImage
      ? `${session.set.sourceImage}, page ${session.set.sourcePage || 'not recorded'} (/sources#${session.set.sourceImage})`
      : 'Original site practice prompts';
    const text = [
      'Sentence completion practice',
      `Set: ${session.set.title}`,
      `Language: ${session.set.language === 'ur' ? 'Urdu' : 'English'}`,
      `Source: ${source}`,
      `Started: ${new Date(session.startedAt).toISOString()}`,
      `Practice: ${session.questions.length} of ${session.set.prompts.length} stems; ${session.shuffled ? 'shuffled' : 'listed order'}`,
      `Timing: ${session.duration === null ? 'untimed' : `${formatClock(session.duration)} for this session`}`,
      `Ended: ${session.reason === 'expired' ? 'time expired' : session.reason === 'ended' ? 'ended by you' : 'all stems visited'}`,
      ...(session.set.note ? [`Source note: ${session.set.note}`] : []),
      '',
      ...session.questions.flatMap((question, index) => [
        `${index + 1}. ${question.prompt} (set position ${question.sourceNumber})`,
        `Response: ${session.answers[index] === null ? '[Not reached]' : session.answers[index] || '[No response]'}`,
        '',
      ]),
      'Personal writing practice only. No psychological scores or model answers are generated.',
    ].join('\n');
    downloadText(`sentence-completion-${session.set.id.replace(/[^a-z0-9_-]/gi, '-')}.txt`, text);
  };

  return (
    <div className="neo-page prep-page">
      <div className="prep-shell">
        <DimensionNav active="psychological" />
        {!session ? (
          <>
            <header className="prep-header">
              <button type="button" className="prep-button prep-button-secondary mb-5" onClick={onBack}>Back to psychological hub</button>
              <h1 ref={headingRef} tabIndex={-1}>Sentence completion</h1>
              <p>{photoSets.length} photographed sets contain {photoStemCount} stems, with {completionSentences.length} original site prompts also available. Choose one exact set in English or Urdu.</p>
            </header>
            <section className="prep-panel" aria-labelledby="completion-setup-title">
              <h2 id="completion-setup-title">Set up your practice</h2>
              <p>Complete each stem naturally in your own words. There are no model answers, personality scores, or requirements to make every response positive.</p>
              <div className="prep-filters">
                <label className="prep-field" htmlFor="completion-language">
                  Language
                  <select id="completion-language" value={language} onChange={(event) => {
                    const nextLanguage = event.target.value as 'en' | 'ur';
                    setLanguage(nextLanguage);
                    setSelectedId(completionPracticeSets.find((set) => set.language === nextLanguage)?.id ?? '');
                  }}>
                    <option value="en">English ({completionPracticeSets.filter((set) => set.language === 'en').length} sets)</option>
                    <option value="ur">Urdu ({completionPracticeSets.filter((set) => set.language === 'ur').length} sets)</option>
                  </select>
                </label>
                <label className="prep-field" htmlFor="completion-set">
                  Exact source set
                  <select id="completion-set" value={selectedSet?.id ?? ''} disabled={!availableSets.length} onChange={(event) => setSelectedId(event.target.value)}>
                    {!availableSets.length && <option value="">No sets available in this language</option>}
                    {availableSets.map((set) => (
                      <option key={`${set.sourceImage ?? 'original'}-${set.id}`} value={set.id}>
                        {set.title} | {set.prompts.length} stems{set.sourceImage ? ` | page ${set.sourcePage} | ${set.sourceImage}` : ' | original practice'}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {selectedSet ? (
                <>
                  <h3 lang={selectedSet.language} dir={selectedSet.language === 'ur' ? 'rtl' : 'ltr'}>{selectedSet.title}</h3>
                  <CompletionSource set={selectedSet} />
                  <p className="prep-muted">{selectedSet.prompts.length} stems in this set. {selectedSet.origin === 'photo' ? 'Source timing' : 'Optional practice timing'}: {formatClock(selectedSet.seconds)} for the whole set. Source links open in a separate tab.</p>
                  {selectedSet.note && <p className="prep-note" lang={/[\u0600-\u06ff]/.test(selectedSet.note) ? 'ur' : 'en'} dir="auto">{selectedSet.note}</p>}
                  {!selectedSet.prompts.length && <p className="prep-note" role="status">No reliably readable stems are available from this source set. Its source record is retained, but practice is unavailable. Choose another set; no missing stems have been invented.</p>}
                  <fieldset className="prep-filters" disabled={!selectedSet.prompts.length} aria-label="Session options">
                    <label className="prep-field" htmlFor="completion-length">
                      Session length
                      <select id="completion-length" value={lengthMode} onChange={(event) => setLengthMode(event.target.value as 'whole' | 'short')}>
                        <option value="whole">Whole set ({selectedSet.prompts.length} stems)</option>
                        <option value="short">Short practice</option>
                      </select>
                    </label>
                    {lengthMode === 'short' && (
                      <label className="prep-field" htmlFor="completion-short-count">
                        Number of stems
                        <input id="completion-short-count" type="number" min={1} max={selectedSet.prompts.length || 1} step={1} value={shortCount} onChange={(event) => setShortCount(event.target.value)} aria-invalid={!countIsValid} aria-describedby={!countIsValid && selectedSet.prompts.length ? 'completion-count-error' : undefined} />
                      </label>
                    )}
                    <label className="prep-field" htmlFor="completion-order">
                      Order
                      <select id="completion-order" value={shuffled ? 'shuffle' : 'source'} onChange={(event) => setShuffled(event.target.value === 'shuffle')}>
                        <option value="source">Listed order</option>
                        <option value="shuffle">Shuffle within this set</option>
                      </select>
                    </label>
                    <label className="prep-field" htmlFor="completion-timing">
                      Timing
                      <select id="completion-timing" value={timed ? 'timed' : 'untimed'} onChange={(event) => setTimed(event.target.value === 'timed')}>
                        <option value="timed">Timed session</option>
                        <option value="untimed">Untimed session</option>
                      </select>
                    </label>
                  </fieldset>
                  {!countIsValid && selectedSet.prompts.length > 0 && <p id="completion-count-error" className="prep-note" role="alert">Choose a whole number from 1 to {selectedSet.prompts.length}.</p>}
                  {countIsValid && <p className="prep-note">
                    {lengthMode === 'whole' ? 'Whole-set practice keeps every stem from the selected set.' : 'Short practice uses only the selected number of stems. With listed order, these are the first stems in the set.'}
                    {' '}{timed ? `There is one ${formatClock(plannedDuration)} deadline for this session, not a separate timer per stem. Your current response is saved when time expires.` : 'Untimed practice has no deadline. Save each response at your own pace.'}
                    {lengthMode === 'short' && timed && ' Short-session timing is proportional practice time, not the full photographed test format.'}
                  </p>}
                  <div className="prep-actions">
                    <button type="button" className="prep-button" onClick={() => startSession(Date.now())} disabled={!countIsValid}>Start {timed ? 'timed' : 'untimed'} practice</button>
                  </div>
                  {selectedSet.prompts.length > 0 && <details className="prep-details">
                    <summary>Preview all {selectedSet.prompts.length} stems in their listed order</summary>
                    <ol className="mt-4">
                      {selectedSet.prompts.map((prompt, index) => (
                        <li key={`${selectedSet.id}-${index}`}><p lang={selectedSet.language} dir={selectedSet.language === 'ur' ? 'rtl' : 'ltr'} className={selectedSet.language === 'ur' ? 'urdu-text' : undefined}>{prompt}</p></li>
                      ))}
                    </ol>
                  </details>}
                </>
              ) : <p className="prep-note" role="status">No source sets are currently available for this language.</p>}
              <p className="prep-muted">Enter saves and advances. Shift+Enter adds a line. Composing text with an input method does not submit. Responses stay in this tab only; download your review before leaving.</p>
            </section>
          </>
        ) : session.phase === 'review' ? (
          <>
            <header className="prep-header">
              <h1 ref={headingRef} tabIndex={-1}>Your sentence completions</h1>
              <p role="status">
                {session.reason === 'expired' ? 'Time is up. Your current response was saved.' : session.reason === 'ended' ? 'You ended the session. Your current response was saved.' : 'You reached the end of the session.'}
                {' '}{session.answers.filter((answer) => answer !== null && answer !== '').length} responses written, {session.answers.filter((answer) => answer === '').length} left blank, and {session.answers.filter((answer) => answer === null).length} not reached out of {session.questions.length} stems.
              </p>
            </header>
            <section className="prep-panel" aria-labelledby="completion-review-set">
              <h2 id="completion-review-set" lang={session.set.language} dir={session.set.language === 'ur' ? 'rtl' : 'ltr'}>{session.set.title}</h2>
              <CompletionSource set={session.set} />
              <p className="prep-muted">{session.shuffled ? 'Shuffled order' : 'Listed order'}. {session.duration === null ? 'Untimed practice' : `${formatClock(session.duration)} session limit`}. Elapsed time: {formatClock(((session.endedAt ?? session.startedAt) - session.startedAt) / 1000)}.</p>
              {session.set.note && <p className="prep-note" lang={/[\u0600-\u06ff]/.test(session.set.note) ? 'ur' : 'en'} dir="auto">{session.set.note}</p>}
              <p className="prep-note">Review whether your writing says what you intended and is clear to read. This is your response record, not an assessment of your personality or suitability.</p>
              <div className="prep-actions">
                <button type="button" className="prep-button" onClick={downloadResponses}>Download responses</button>
                <button type="button" className="prep-button prep-button-secondary" onClick={() => updateSession(null)}>Back to setup</button>
                <button type="button" className="prep-button prep-button-secondary" onClick={onBack}>Back to psychological hub</button>
              </div>
              <p className="prep-muted mt-3">Download before starting another session or leaving this page. Responses are not stored after you leave.</p>
            </section>
            {session.questions.map((question, index) => (
              <article className="prep-panel" key={`${session.set.id}-${question.sourceNumber}`}>
                <p className="prep-muted">Stem {index + 1} of {session.questions.length}, set position {question.sourceNumber}</p>
                <h2 lang={session.set.language} dir={session.set.language === 'ur' ? 'rtl' : 'ltr'} className={session.set.language === 'ur' ? 'urdu-text' : undefined}>{question.prompt}</h2>
                {session.answers[index] ? (
                  <p className={`prep-answer whitespace-pre-wrap break-words${session.set.language === 'ur' ? ' urdu-text' : ''}`} lang={session.set.language} dir={session.set.language === 'ur' ? 'rtl' : 'ltr'}>{session.answers[index]}</p>
                ) : <p className="prep-muted">{session.answers[index] === null ? 'Not reached in this session.' : 'No response entered.'}</p>}
              </article>
            ))}
          </>
        ) : current && (
          <>
            <header className="prep-header">
              <h1>Sentence completion</h1>
              <p lang={session.set.language} dir={session.set.language === 'ur' ? 'rtl' : 'ltr'}>{session.set.title}</p>
            </header>
            <section className="prep-panel" aria-labelledby="completion-stem">
              <div className="prep-status">
                <p aria-live="polite">Stem {session.index + 1} of {session.questions.length}. Set position {current.sourceNumber} of {session.set.prompts.length}.</p>
                {session.deadline !== null ? <div className="prep-clock" role="timer" aria-live="off" aria-label="Time remaining for the whole session">{formatClock(secondsLeft)}</div> : <p className="prep-muted">Untimed practice</p>}
              </div>
              <progress className="w-full" max={session.questions.length} value={session.index} aria-label="Stems visited before the current prompt" />
              <CompletionSource set={session.set} />
              {session.deadline !== null && secondsLeft <= 30 && <p className="prep-note" role="status">30 seconds or less remain for the session. Your current response will be saved automatically.</p>}
              <h2 id="completion-stem" className={`prep-question${session.set.language === 'ur' ? ' urdu-text' : ''}`} lang={session.set.language} dir={session.set.language === 'ur' ? 'rtl' : 'ltr'}>{current.prompt}</h2>
              <label className="prep-field" htmlFor="completion-response">
                <span id="completion-answer-label">Your completion</span>
                <textarea
                  key={current.sourceNumber}
                  ref={inputRef}
                  id="completion-response"
                  lang={session.set.language}
                  dir={session.set.language === 'ur' ? 'rtl' : 'ltr'}
                  className={session.set.language === 'ur' ? 'urdu-text' : undefined}
                  value={session.draft}
                  onChange={(event) => changeDraft(event.target.value, session.index)}
                  onCompositionStart={() => { composingRef.current = true; }}
                  onCompositionEnd={(event) => {
                    composingRef.current = false;
                    changeDraft(event.currentTarget.value, session.index);
                  }}
                  onKeyDown={(event) => handleKeyDown(event, session.index)}
                  aria-labelledby="completion-answer-label completion-stem"
                  aria-describedby="completion-keyboard-help"
                  placeholder={session.set.language === 'ur' ? 'جملہ اپنے الفاظ میں مکمل کریں' : 'Complete the stem in your own words...'}
                  rows={4}
                />
              </label>
              <p className="prep-muted" id="completion-keyboard-help">Enter saves and advances. Shift+Enter adds a line. A blank response can be skipped. Text composition does not submit.</p>
              <div className="prep-actions mt-4">
                <button type="button" className="prep-button" onClick={(event) => { if (event.detail < 2) saveAndNext(session.index); }}>
                  {session.index === session.questions.length - 1 ? (session.draft.trim() ? 'Save and review' : 'Skip and review') : (session.draft.trim() ? 'Save and next' : 'Skip this stem')}
                </button>
                <button type="button" className="prep-button prep-button-secondary" onClick={() => finishSession('ended')}>End session and review</button>
              </div>
              <p className="prep-muted mt-3">{session.draft.length} characters in this response. Ending early keeps your current text and opens a partial review.</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
