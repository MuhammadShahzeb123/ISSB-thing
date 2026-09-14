"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type SessionPhase = {
  id: string;
  durationSeconds: number;
};

type StoredSession = {
  schemaVersion: 1;
  contentVersion: string;
  promptIds: string[];
  promptIndex: number;
  phaseIndex: number;
  deadline: number;
  answers: Record<string, string>;
  status: "running" | "finished";
  startedAt: number;
};

type SessionOptions<TPrompt extends { id: string }> = {
  storageKey: string;
  contentVersion: string;
  prompts: readonly TPrompt[];
  phasesForPrompt: (prompt: TPrompt) => readonly SessionPhase[];
};

function isStoredSession(value: unknown): value is StoredSession {
  if (!value || typeof value !== "object") return false;
  const session = value as Partial<StoredSession>;
  return (
    session.schemaVersion === 1 &&
    typeof session.contentVersion === "string" &&
    Array.isArray(session.promptIds) &&
    session.promptIds.every((id) => typeof id === "string") &&
    typeof session.promptIndex === "number" &&
    typeof session.phaseIndex === "number" &&
    typeof session.deadline === "number" &&
    typeof session.answers === "object" &&
    (session.status === "running" || session.status === "finished") &&
    typeof session.startedAt === "number"
  );
}

export function useTimedWritingSession<TPrompt extends { id: string }>({
  storageKey,
  contentVersion,
  prompts,
  phasesForPrompt,
}: SessionOptions<TPrompt>) {
  const promptById = useMemo(
    () => new Map(prompts.map((prompt) => [prompt.id, prompt])),
    [prompts],
  );
  const [session, setSession] = useState<StoredSession | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const normalize = useCallback(
    (candidate: StoredSession, currentTime: number) => {
      if (
        candidate.contentVersion !== contentVersion ||
        candidate.promptIds.some((id) => !promptById.has(id))
      ) {
        return null;
      }

      const next = {
        ...candidate,
        promptIds: [...candidate.promptIds],
        answers: { ...candidate.answers },
      };

      while (next.status === "running" && currentTime >= next.deadline) {
        const prompt = promptById.get(next.promptIds[next.promptIndex]);
        if (!prompt) return null;
        const phases = phasesForPrompt(prompt);
        const nextPhaseIndex = next.phaseIndex + 1;

        if (nextPhaseIndex < phases.length) {
          next.phaseIndex = nextPhaseIndex;
          next.deadline += phases[nextPhaseIndex].durationSeconds * 1000;
          continue;
        }

        const nextPromptIndex = next.promptIndex + 1;
        if (nextPromptIndex >= next.promptIds.length) {
          next.status = "finished";
          break;
        }

        const nextPrompt = promptById.get(next.promptIds[nextPromptIndex]);
        if (!nextPrompt) return null;
        const nextPhases = phasesForPrompt(nextPrompt);
        next.promptIndex = nextPromptIndex;
        next.phaseIndex = 0;
        next.deadline += nextPhases[0].durationSeconds * 1000;
      }

      return next;
    },
    [contentVersion, phasesForPrompt, promptById],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (isStoredSession(parsed)) {
            setSession(normalize(parsed, Date.now()));
          }
        }
      } catch {
        window.localStorage.removeItem(storageKey);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [normalize, storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (session) {
        window.localStorage.setItem(storageKey, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(storageKey);
      }
    } catch {
      return;
    }
  }, [hydrated, session, storageKey]);

  useEffect(() => {
    if (session?.status !== "running") return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [session?.status]);

  useEffect(() => {
    if (!session || session.status !== "running" || now < session.deadline) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setSession((current) => (current ? normalize(current, now) : current));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [normalize, now, session]);

  const start = useCallback(
    (promptIds = prompts.map((prompt) => prompt.id)) => {
      const firstPrompt = promptById.get(promptIds[0]);
      if (!firstPrompt) return;
      const startedAt = Date.now();
      const phases = phasesForPrompt(firstPrompt);
      setNow(startedAt);
      setSession({
        schemaVersion: 1,
        contentVersion,
        promptIds,
        promptIndex: 0,
        phaseIndex: 0,
        deadline: startedAt + phases[0].durationSeconds * 1000,
        answers: {},
        status: "running",
        startedAt,
      });
    },
    [contentVersion, phasesForPrompt, promptById, prompts],
  );

  const reset = useCallback(() => setSession(null), []);

  const updateAnswer = useCallback((promptId: string, answer: string) => {
    setSession((current) =>
      current
        ? {
            ...current,
            answers: { ...current.answers, [promptId]: answer },
          }
        : current,
    );
  }, []);

  const currentPromptId = session?.promptIds[session.promptIndex];
  const currentPrompt = currentPromptId
    ? promptById.get(currentPromptId) ?? null
    : null;
  const phases = currentPrompt ? phasesForPrompt(currentPrompt) : [];
  const currentPhase = phases[session?.phaseIndex ?? 0] ?? null;
  const secondsLeft =
    session?.status === "running"
      ? Math.max(0, Math.ceil((session.deadline - now) / 1000))
      : 0;

  return {
    hydrated,
    session,
    currentPrompt,
    currentPhase,
    secondsLeft,
    start,
    reset,
    updateAnswer,
  };
}
