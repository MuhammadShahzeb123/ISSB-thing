'use client';

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import {
  emptyProfile,
  entryOptions,
  focusModes,
  interviewerVoices,
  lengthOptions,
  modeTitle,
  voiceById,
  type CandidateProfile,
  type LiveInterviewSettings,
} from '../lib/live/dpInterview';
import { LiveInterviewSession, type LivePhase, type Speaker, type TranscriptEntry } from '../lib/live/liveSession';

const SETTINGS_KEY = 'issb-live-dpi-settings-v1';

type Stage = 'setup' | 'live' | 'review';

type Report = {
  summary: string;
  verdict: 'strong' | 'promising' | 'needs-work';
  qualities: { name: string; score: number; note: string }[];
  strengths: string[];
  improvements: { area: string; advice: string }[];
  rework: { question: string; said: string; better: string }[];
  nextStep: string;
};

const defaultSettings: LiveInterviewSettings = {
  mode: 'full',
  minutes: 15,
  voice: interviewerVoices[0].id,
  urdu: true,
  coaching: false,
  profile: emptyProfile,
};

const verdictLabel: Record<Report['verdict'], string> = {
  strong: 'Strong practice interview',
  promising: 'Promising, with clear fixes',
  'needs-work': 'Needs more practice',
};

function clock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function transcriptText(entries: TranscriptEntry[], interviewer: string, settings: LiveInterviewSettings) {
  const who = (role: Speaker) => (role === 'dp' ? interviewer || 'Deputy President' : settings.profile.name || 'Candidate');
  const header = `${modeTitle(settings.mode)} with ${interviewer || 'the Deputy President'}\n${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} PKT\n\n`;
  return header + entries.map((entry) => `${who(entry.role)}: ${entry.text}`).join('\n\n');
}

const profileFields: { key: Exclude<keyof CandidateProfile, 'entry'>; label: string; placeholder: string; long?: boolean }[] = [
  { key: 'name', label: 'Name', placeholder: 'Ali Raza' },
  { key: 'age', label: 'Age', placeholder: '19' },
  { key: 'city', label: 'Home town', placeholder: 'Multan' },
  { key: 'education', label: 'Education and marks', placeholder: 'Matric 1010/1100, FSc pre-engineering 920/1100', long: true },
  { key: 'family', label: 'Family', placeholder: 'Father a schoolteacher, mother at home, two younger sisters', long: true },
  { key: 'hobbies', label: 'Hobbies and sports', placeholder: 'Cricket (fast bowler for college team), reading history', long: true },
  { key: 'attempts', label: 'Previous ISSB attempts', placeholder: 'First attempt, or: Screened out once in 2025' },
];

export default function LiveInterview() {
  const headingId = useId();
  const [stage, setStage] = useState<Stage>('setup');
  const [settings, setSettings] = useState<LiveInterviewSettings>(defaultSettings);
  const [headphones, setHeadphones] = useState(false);
  const [phase, setPhase] = useState<LivePhase>('connecting');
  const [speaker, setSpeaker] = useState<Speaker | null>(null);
  const [entries, setEntries] = useState<TranscriptEntry[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interviewer, setInterviewer] = useState('');
  const [report, setReport] = useState<Report | null>(null);
  const [reportState, setReportState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [reportError, setReportError] = useState<string | null>(null);
  const sessionRef = useRef<LiveInterviewSession | null>(null);
  const micBarRef = useRef<HTMLSpanElement>(null);
  const dpBarRef = useRef<HTMLSpanElement>(null);
  const transcriptEndRef = useRef<HTMLLIElement>(null);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<LiveInterviewSettings> & { headphones?: boolean };
        // Load after mount so the server render matches the first client paint.
        // eslint-disable-next-line react-hooks/set-state-in-effect -- persisted device state
        setSettings((current) => ({ ...current, ...saved, profile: { ...emptyProfile, ...(saved.profile ?? {}) } }));
        if (typeof saved.headphones === 'boolean') setHeadphones(saved.headphones);
      }
    } catch {
      // private browsing or blocked storage
    } finally {
      hydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...settings, headphones }));
    } catch {
      // ignore
    }
  }, [settings, headphones]);

  useEffect(() => () => sessionRef.current?.end(), []);

  useEffect(() => {
    if (stage === 'live' && showTranscript) transcriptEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [entries, stage, showTranscript]);

  const updateProfile = (key: keyof CandidateProfile, value: string) =>
    setSettings((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));

  const finish = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;
    session.end();
    setEntries(session.transcript);
    setStage('review');
  }, []);

  const start = async (event: FormEvent) => {
    event.preventDefault();
    sessionRef.current?.end();
    setError(null);
    setEntries([]);
    setSeconds(0);
    setMuted(false);
    setReport(null);
    setReportState('idle');
    setSpeaker(null);
    setPhase('connecting');
    setStage('live');
    const session = new LiveInterviewSession(
      settings,
      {
        onPhase: (next, detail) => {
          setPhase(next);
          if (next === 'live') setInterviewer(session.interviewer);
          if (next === 'error') {
            setError(detail ?? 'The interview stopped.');
            setEntries(session.transcript);
            setStage(session.transcript.length ? 'review' : 'setup');
          }
        },
        onTranscript: setEntries,
        onSpeaker: setSpeaker,
        onLevels: (mic, dp) => {
          micBarRef.current?.style.setProperty('--level', String(Math.min(1, mic * 6)));
          dpBarRef.current?.style.setProperty('--level', String(Math.min(1, dp * 5)));
        },
        onClock: setSeconds,
      },
      { headphones },
    );
    sessionRef.current = session;
    await session.start();
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    sessionRef.current?.setMuted(next);
  };

  const requestReport = async () => {
    setReportState('loading');
    setReportError(null);
    try {
      const response = await fetch('/api/live-interview/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings, transcript: entries.map(({ role, text }) => ({ role, text })) }),
      });
      const data = (await response.json().catch(() => null)) as { report?: Report; error?: { message?: string } } | null;
      if (!response.ok || !data?.report) throw new Error(data?.error?.message ?? 'Feedback could not be written right now.');
      setReport(data.report);
      setReportState('idle');
    } catch (caught) {
      setReportState('error');
      setReportError(caught instanceof Error ? caught.message : 'Feedback could not be written right now.');
    }
  };

  const download = () => {
    const blob = new Blob([transcriptText(entries, interviewer, settings)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dp-interview-${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const voice = voiceById(settings.voice);
  const candidateName = settings.profile.name || 'You';
  const status =
    phase === 'connecting'
      ? 'Connecting to the interviewer…'
      : phase === 'reconnecting'
        ? 'Reconnecting. Hold on, the interview will continue…'
        : speaker === 'dp'
          ? `${interviewer || 'The Deputy President'} is speaking${headphones ? '' : ' (your mic waits until he finishes)'}`
          : speaker === 'candidate'
            ? 'Listening to you…'
            : muted
              ? 'Your microphone is muted.'
              : 'Your turn. Speak clearly when you are ready.';

  return (
    <section className="live-dpi" aria-labelledby={headingId}>
      {stage === 'setup' && (
        <form className="live-setup" onSubmit={(event) => void start(event)}>
          <div className="live-hero">
            <p className="live-kicker">Live interview · Gemini 3.8 Live</p>
            <h2 id={headingId}>Sit the Deputy President interview out loud</h2>
            <p>
              A live AI deputy president talks with you in real time. He asks about your life, digs into your answers, runs a
              rapid-fire round and checks your current affairs. When you finish you get the full transcript and written
              feedback.
            </p>
          </div>

          {error && (
            <p className="dpi-error" role="alert">
              {error}
            </p>
          )}

          <fieldset className="live-fieldset">
            <legend>1. What kind of interview?</legend>
            <div className="live-choice-grid">
              {focusModes.map((mode) => (
                <label key={mode.id} className={`live-choice${settings.mode === mode.id ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="live-mode"
                    value={mode.id}
                    checked={settings.mode === mode.id}
                    onChange={() => setSettings((current) => ({ ...current, mode: mode.id }))}
                  />
                  <strong>{mode.title}</strong>
                  <span>{mode.blurb}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="live-fieldset">
            <legend>2. Who interviews you?</legend>
            <div className="live-choice-grid live-choice-grid--compact">
              {interviewerVoices.map((option) => (
                <label key={option.id} className={`live-choice${settings.voice === option.id ? ' is-selected' : ''}`}>
                  <input
                    type="radio"
                    name="live-voice"
                    value={option.id}
                    checked={settings.voice === option.id}
                    onChange={() => setSettings((current) => ({ ...current, voice: option.id }))}
                  />
                  <strong>
                    {option.rank} {option.name}
                  </strong>
                  <span>{option.blurb}</span>
                </label>
              ))}
            </div>
            <div className="live-inline">
              <span className="live-inline-label">Length</span>
              {lengthOptions.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className="live-pill"
                  aria-pressed={settings.minutes === minutes}
                  onClick={() => setSettings((current) => ({ ...current, minutes }))}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="live-fieldset">
            <legend>3. Your bio data (optional, but it makes the questions real)</legend>
            <div className="live-form-grid">
              <label className="prep-field">
                Applying for
                <select value={settings.profile.entry} onChange={(event) => updateProfile('entry', event.target.value)}>
                  {entryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              {profileFields.map((field) => (
                <label key={field.key} className={`prep-field${field.long ? ' live-field--wide' : ''}`}>
                  {field.label}
                  {field.long ? (
                    <textarea
                      rows={2}
                      value={settings.profile[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) => updateProfile(field.key, event.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings.profile[field.key]}
                      placeholder={field.placeholder}
                      onChange={(event) => updateProfile(field.key, event.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="live-fieldset">
            <legend>4. Options</legend>
            <label className="live-check">
              <input
                type="checkbox"
                checked={headphones}
                onChange={(event) => setHeadphones(event.target.checked)}
              />
              <span>
                <strong>I am wearing headphones.</strong> You can interrupt the interviewer. Without headphones your mic pauses
                while he speaks, so his voice does not echo back.
              </span>
            </label>
            <label className="live-check">
              <input
                type="checkbox"
                checked={settings.urdu}
                onChange={(event) => setSettings((current) => ({ ...current, urdu: event.target.checked }))}
              />
              <span>
                <strong>Allow Urdu when I am stuck.</strong> The interview stays in English, but he can repeat a question in
                Urdu and accept an Urdu answer.
              </span>
            </label>
            <label className="live-check">
              <input
                type="checkbox"
                checked={settings.coaching}
                onChange={(event) => setSettings((current) => ({ ...current, coaching: event.target.checked }))}
              />
              <span>
                <strong>Coaching mode.</strong> A one-line tip after each answer. Leave this off for a realistic interview.
              </span>
            </label>
          </fieldset>

          <button type="submit" className="dpi-record live-start">
            Start live interview with {voice.rank} {voice.name}
          </button>
          <p className="dpi-note">
            Uses your microphone. Your voice is streamed to Google Gemini to run the interview. This site does not record or
            store it. Find a quiet room and speak as you would to a real board.
          </p>
        </form>
      )}

      {stage === 'live' && (
        <div className="live-stage" aria-live="polite">
          <div className="live-topbar">
            <span className={`live-badge${phase === 'live' ? ' is-on' : ''}`}>
              {phase === 'live' ? 'Live' : phase === 'reconnecting' ? 'Reconnecting' : 'Connecting'}
            </span>
            <span className="live-topbar-title">
              {modeTitle(settings.mode)} · {interviewer || `${voice.rank} ${voice.name}`}
            </span>
            <span className="live-clock">
              {clock(seconds)} / {settings.minutes}:00
            </span>
          </div>

          <div className={`live-status live-status--${phase === 'live' ? (speaker ?? 'idle') : 'wait'}`}>
            <div className="live-meter-row">
              <span className="live-meter-label">{interviewer ? interviewer.split(' ').at(-1) : 'DP'}</span>
              <span className="live-meter">
                <span ref={dpBarRef} className="live-meter-fill live-meter-fill--dp" />
              </span>
            </div>
            <p className="live-status-text" role="status">
              {status}
            </p>
            <div className="live-meter-row">
              <span className="live-meter-label">{candidateName}</span>
              <span className="live-meter">
                <span ref={micBarRef} className="live-meter-fill" />
              </span>
            </div>
          </div>

          <div className="live-controls">
            <button type="button" className="prep-button prep-button-secondary" aria-pressed={muted} onClick={toggleMute}>
              {muted ? 'Unmute mic' : 'Mute mic'}
            </button>
            <button
              type="button"
              className="prep-button prep-button-secondary"
              aria-pressed={showTranscript}
              onClick={() => setShowTranscript((value) => !value)}
            >
              {showTranscript ? 'Hide transcript' : 'Show transcript'}
            </button>
            <button type="button" className="prep-button live-end" onClick={finish}>
              End interview
            </button>
          </div>

          {showTranscript && (
            <ol className="live-transcript">
              {entries.map((entry) => (
                <li key={entry.id} className={`live-line live-line--${entry.role}${entry.open ? ' is-open' : ''}`}>
                  <span className="live-line-who">{entry.role === 'dp' ? interviewer || 'DP' : candidateName}</span>
                  <span className="live-line-text">{entry.text || '…'}</span>
                </li>
              ))}
              <li ref={transcriptEndRef} className="live-transcript-end" aria-hidden="true" />
            </ol>
          )}
        </div>
      )}

      {stage === 'review' && (
        <div className="live-review">
          <div className="prep-panel">
            <p className="live-kicker">Interview finished</p>
            <h2 id={headingId}>{modeTitle(settings.mode)}</h2>
            {error && (
              <p className="dpi-error" role="alert">
                {error}
              </p>
            )}
            <p>
              {entries.filter((entry) => entry.role === 'candidate').length} answers · {clock(seconds)} minutes with{' '}
              {interviewer || `${voice.rank} ${voice.name}`}.
            </p>
            <div className="prep-actions">
              <button
                type="button"
                className="prep-button"
                disabled={reportState === 'loading' || !entries.some((entry) => entry.role === 'candidate')}
                onClick={() => void requestReport()}
              >
                {reportState === 'loading' ? 'Writing feedback…' : report ? 'Write feedback again' : 'Get written feedback'}
              </button>
              <button type="button" className="prep-button prep-button-secondary" disabled={!entries.length} onClick={download}>
                Download transcript
              </button>
              <button
                type="button"
                className="prep-button prep-button-secondary"
                onClick={() => {
                  setStage('setup');
                  setError(null);
                }}
              >
                New interview
              </button>
            </div>
            {reportError && (
              <p className="dpi-error" role="alert">
                {reportError}
              </p>
            )}
          </div>

          {report && (
            <article className="prep-panel live-report">
              <p className={`live-verdict live-verdict--${report.verdict}`}>{verdictLabel[report.verdict] ?? report.verdict}</p>
              <p className="gk-modal-summary">{report.summary}</p>
              <h3>Officer-like qualities</h3>
              <ul className="live-scores">
                {report.qualities.map((quality) => (
                  <li key={quality.name}>
                    <span className="live-score-name">{quality.name}</span>
                    <span className="live-score-bar" aria-label={`${quality.score} out of 5`}>
                      {[1, 2, 3, 4, 5].map((step) => (
                        <span key={step} className={step <= quality.score ? 'is-on' : ''} />
                      ))}
                    </span>
                    <span className="live-score-note">{quality.note}</span>
                  </li>
                ))}
              </ul>
              <h3>What went well</h3>
              <ul>
                {report.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3>Fix these next</h3>
              <ul>
                {report.improvements.map((item) => (
                  <li key={item.area}>
                    <strong>{item.area}.</strong> {item.advice}
                  </li>
                ))}
              </ul>
              {report.rework.length > 0 && (
                <>
                  <h3>Answers to rework</h3>
                  <ol className="live-rework">
                    {report.rework.map((item) => (
                      <li key={item.question}>
                        <p className="dpi-review-q">{item.question}</p>
                        <p>
                          <strong>You said:</strong> {item.said}
                        </p>
                        <p>
                          <strong>Better:</strong> {item.better}
                        </p>
                      </li>
                    ))}
                  </ol>
                </>
              )}
              <p className="prep-note">
                <strong>Practise tomorrow: </strong>
                {report.nextStep}
              </p>
              <p className="prep-muted">Practice feedback written by AI. It is not an ISSB result.</p>
            </article>
          )}

          <div className="prep-panel">
            <h3>Transcript</h3>
            {entries.length ? (
              <ol className="live-transcript live-transcript--review">
                {entries.map((entry) => (
                  <li key={entry.id} className={`live-line live-line--${entry.role}`}>
                    <span className="live-line-who">{entry.role === 'dp' ? interviewer || 'DP' : candidateName}</span>
                    <span className="live-line-text">{entry.text}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="prep-muted">Nothing was said yet.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
