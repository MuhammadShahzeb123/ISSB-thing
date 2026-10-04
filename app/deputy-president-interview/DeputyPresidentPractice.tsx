"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  clipKey,
  deputyInterviewById,
  deputyInterviewTypes,
  type DeputyInterviewType,
} from "../lib/deputyPresidentInterviews";
import { deleteStoredClip, listStoredClips, preferredAudioMime, saveStoredClip } from "../lib/dpiRecordings";

type ClipView = { url: string; recordedAt: string; localOnly: boolean };
type Phase = "list" | "ask" | "review";

function formatWhen(iso: string) {
  const when = new Date(iso).toLocaleString("en-PK", {
    timeZone: "Asia/Karachi",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${when} PKT`;
}

function micMessage(error: unknown) {
  const name = error instanceof DOMException ? error.name : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "Microphone permission was blocked. Allow the mic for this site, then tap Record again.";
  }
  if (name === "NotFoundError" || name === "NotReadableError") {
    return "No microphone could be used. Check that a mic is connected and not busy in another app.";
  }
  return "The microphone could not start. Tap Record to try again.";
}

export default function DeputyPresidentPractice() {
  const [phase, setPhase] = useState<Phase>("list");
  const [typeId, setTypeId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [clips, setClips] = useState<Record<string, ClipView>>({});
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [storeNote, setStoreNote] = useState<string | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stopWaitRef = useRef<(() => void) | null>(null);
  const urlsRef = useRef<string[]>([]);
  const runRef = useRef(0);
  const armRef = useRef(false);

  const interview = typeId ? deputyInterviewById(typeId) : undefined;
  const question = interview?.questions[index];
  const activeKey = interview && question ? clipKey(interview.id, question.id) : null;
  const activeClip = activeKey ? clips[activeKey] : undefined;

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const rememberUrl = useCallback((id: string, url: string, recordedAt: string, localOnly: boolean) => {
    setClips((previous) => {
      const old = previous[id];
      if (old) URL.revokeObjectURL(old.url);
      return { ...previous, [id]: { url, recordedAt, localOnly } };
    });
    urlsRef.current.push(url);
  }, []);

  const forgetUrl = useCallback((id: string) => {
    setClips((previous) => {
      const old = previous[id];
      if (!old) return previous;
      URL.revokeObjectURL(old.url);
      const next = { ...previous };
      delete next[id];
      return next;
    });
  }, []);

  useEffect(() => {
    const urls = urlsRef.current;
    let cancelled = false;
    listStoredClips()
      .then((rows) => {
        if (cancelled) return;
        const next: Record<string, ClipView> = {};
        for (const row of rows) {
          if (!row.blob || row.blob.size < 1) continue;
          const url = URL.createObjectURL(row.blob);
          urlsRef.current.push(url);
          next[row.id] = { url, recordedAt: row.recordedAt, localOnly: false };
        }
        setClips(next);
      })
      .catch(() => {
        if (!cancelled) setStoreNote("Saved recordings could not be opened in this browser. New takes can still be played until you leave the page.");
      });
    return () => {
      cancelled = true;
      const recorder = recorderRef.current;
      if (recorder && recorder.state !== "inactive") recorder.stop();
      releaseStream();
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!recording) return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - started) / 1000);
      setElapsed(seconds);
      if (seconds >= 180 && recorderRef.current?.state === "recording") recorderRef.current.stop();
    }, 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  const stopRecording = useCallback(() => {
    runRef.current += 1;
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      releaseStream();
      setRecording(false);
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      stopWaitRef.current = () => {
        stopWaitRef.current = null;
        setRecording(false);
        resolve();
      };
      if (recorder.state !== "inactive") recorder.stop();
      else resolve();
    });
  }, []);

  const startRecording = useCallback(async () => {
    if (!interview || !question || recording || armRef.current) return;
    armRef.current = true;
    setError(null);
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("This browser cannot record audio. Use Chrome and tap Record again.");
      return;
    }
    const key = clipKey(interview.id, question.id);
    const run = runRef.current;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      if (run !== runRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      const mimeType = preferredAudioMime();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        releaseStream();
        const blobType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunks, { type: blobType });
        const finish = () => {
          setRecording(false);
          const wait = stopWaitRef.current;
          stopWaitRef.current = null;
          wait?.();
        };
        if (blob.size < 1) {
          setError("Nothing was captured. Tap Record and speak, then tap Stop.");
          finish();
          return;
        }
        const recordedAt = new Date().toISOString();
        const url = URL.createObjectURL(blob);
        void saveStoredClip({
          id: key,
          typeId: interview.id,
          questionId: question.id,
          blob,
          mimeType: blobType,
          recordedAt,
        })
          .then(() => {
            rememberUrl(key, url, recordedAt, false);
            setStoreNote(null);
          })
          .catch(() => {
            rememberUrl(key, url, recordedAt, true);
            setStoreNote("This take is only in the open tab. The browser would not store it for next time.");
          })
          .finally(finish);
      };
      recorderRef.current = recorder;
      recorder.start(250);
      setElapsed(0);
      setRecording(true);
    } catch (caught) {
      releaseStream();
      setRecording(false);
      setError(micMessage(caught));
    } finally {
      armRef.current = false;
    }
  }, [interview, question, recording, rememberUrl]);

  const tryAgain = useCallback(async () => {
    if (!activeKey) return;
    await stopRecording();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    forgetUrl(activeKey);
    try {
      await deleteStoredClip(activeKey);
    } catch {
      setStoreNote("The old take was cleared on screen, but this browser may still have a copy.");
    }
    setError(null);
  }, [activeKey, forgetUrl, stopRecording]);

  const openType = (next: DeputyInterviewType) => {
    setTypeId(next.id);
    setIndex(0);
    setPhase("ask");
    setError(null);
  };

  const leaveSession = async () => {
    await stopRecording();
    setPhase("list");
    setError(null);
  };

  const goTo = async (nextIndex: number) => {
    await stopRecording();
    setIndex(nextIndex);
    setError(null);
    setPhase("ask");
  };

  const recordedIn = (item: DeputyInterviewType) =>
    item.questions.filter((entry) => clips[clipKey(item.id, entry.id)]).length;

  return (
    <section className="dpi" id="interview-styles" aria-labelledby="dpi-styles-heading">
      {phase === "list" && (
        <>
          <h2 id="dpi-styles-heading">Choose an interview</h2>
          <p className="dpi-lead">
            Eight styles a deputy president might run. One tap starts that set. You answer out loud. The recording stays in this browser and is never uploaded.
          </p>
          <ul className="dpi-type-list">
            {deputyInterviewTypes.map((item) => {
              const done = recordedIn(item);
              return (
                <li key={item.id}>
                  <button type="button" className="dpi-type-card" onClick={() => openType(item)}>
                    <h3>{item.title}</h3>
                    <p>{item.blurb}</p>
                    <span className="dpi-type-meta">
                      Start · {item.questions.length} questions · {item.pace}
                      {done > 0 ? ` · ${done} recorded` : ""}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          {storeNote && <p className="dpi-note">{storeNote}</p>}
        </>
      )}

      {phase !== "list" && interview && question && (
        <>
          <div className="dpi-session-bar">
            <button type="button" className="prep-button prep-button-secondary" onClick={() => void leaveSession()}>
              All interviews
            </button>
            <p>
              {interview.title} · {phase === "review" ? "Review" : `Question ${index + 1} of ${interview.questions.length}`}
            </p>
          </div>

          {phase === "ask" && (
            <div className="prep-panel dpi-stage">
              <p className="prep-ask-label">{interview.pace}</p>
              <h2 id="dpi-styles-heading" className="dpi-question">{question.prompt}</h2>
              {question.cue && <p className="dpi-cue">{question.cue}</p>}
              <p className="dpi-note">{interview.note}</p>

              <button
                type="button"
                className="dpi-record"
                aria-pressed={recording}
                onClick={() => void (recording ? stopRecording() : startRecording())}
              >
                {recording ? `Stop · ${elapsed}s` : activeClip ? "Record again" : "Record answer"}
              </button>
              <p className="dpi-status" role="status">
                {recording
                  ? "Recording on this phone. Tap Stop when you finish. It stops itself at three minutes."
                  : "The mic stays off until you tap Record."}
              </p>
              {error && <p className="dpi-error" role="alert">{error}</p>}
              {storeNote && <p className="dpi-note">{storeNote}</p>}

              {activeClip && !recording && (
                <div className="dpi-playback">
                  <audio ref={audioRef} controls preload="metadata" src={activeClip.url} />
                  <p className="dpi-status">Saved {formatWhen(activeClip.recordedAt)}. Only on this browser.</p>
                </div>
              )}

              <div className="prep-actions dpi-actions">
                <button type="button" className="prep-button prep-button-secondary" disabled={!activeClip || recording} onClick={() => void audioRef.current?.play()}>
                  Play
                </button>
                <button type="button" className="prep-button prep-button-secondary" disabled={!activeClip && !recording} onClick={() => void tryAgain()}>
                  Try again
                </button>
                <button type="button" className="prep-button prep-button-secondary" disabled={index === 0} onClick={() => void goTo(index - 1)}>
                  Previous
                </button>
                {index < interview.questions.length - 1 ? (
                  <button type="button" className="prep-button" onClick={() => void goTo(index + 1)}>
                    Next question
                  </button>
                ) : (
                  <button type="button" className="prep-button" onClick={() => void stopRecording().then(() => setPhase("review"))}>
                    Review recordings
                  </button>
                )}
              </div>
              {index < interview.questions.length - 1 && (
                <button type="button" className="dpi-text-button" onClick={() => void stopRecording().then(() => setPhase("review"))}>
                  End early and review
                </button>
              )}
            </div>
          )}

          {phase === "review" && (
            <div className="prep-panel">
              <h2 id="dpi-styles-heading">What you recorded</h2>
              <p>
                {recordedIn(interview)} of {interview.questions.length} questions have a take in this browser. Nothing was sent anywhere.
              </p>
              <ol className="dpi-review">
                {interview.questions.map((entry, entryIndex) => {
                  const clip = clips[clipKey(interview.id, entry.id)];
                  return (
                    <li key={entry.id}>
                      <p className="dpi-review-q">{entry.prompt}</p>
                      <p className="dpi-status">{clip ? `Recorded ${formatWhen(clip.recordedAt)}` : "No recording yet"}</p>
                      {clip && <audio controls preload="none" src={clip.url} />}
                      <button type="button" className="prep-button prep-button-secondary" onClick={() => void goTo(entryIndex)}>
                        {clip ? "Record this again" : "Record this one"}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="prep-actions">
                <button type="button" className="prep-button" onClick={() => void leaveSession()}>
                  Back to interviews
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
