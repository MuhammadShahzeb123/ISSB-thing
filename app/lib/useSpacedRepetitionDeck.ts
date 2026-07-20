'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { buildSession, scheduleReview, type DeckProgress, type Rating } from '@/app/lib/spacedRepetition';

interface UseSpacedRepetitionDeckOptions<T> {
  storageKey: string;
  items: T[];
  getId: (item: T) => string;
}

interface UseSpacedRepetitionDeckResult<T> {
  deck: T[];
  currentCard: T | undefined;
  cardIndex: number;
  isRevealed: boolean;
  reveal: () => void;
  rate: (rating: Rating) => void;
  sessionComplete: boolean;
  dueCount: number;
  reviewedCount: number;
  startSession: () => void;
  resetProgress: () => void;
}

export function useSpacedRepetitionDeck<T>({
  storageKey,
  items,
  getId,
}: UseSpacedRepetitionDeckOptions<T>): UseSpacedRepetitionDeckResult<T> {
  const [progress, setProgress] = useState<DeckProgress>({});
  const [deck, setDeck] = useState<T[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [now, setNow] = useState(0);
  const hasHydrated = useRef(false);
  const didInit = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setProgress(JSON.parse(saved) as DeckProgress);
      } catch {
        // A private browsing session may disable localStorage; the deck still works.
      } finally {
        hasHydrated.current = true;
        setNow(Date.now());
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [storageKey]);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch {
      // Progress is a convenience, not a reason to block practice.
    }
  }, [progress, storageKey]);

  const dueCount = useMemo(
    () =>
      items.filter((item) => {
        const state = progress[getId(item)];
        return !state || state.dueAt <= now;
      }).length,
    [items, getId, progress, now],
  );
  const reviewedCount = Object.keys(progress).length;
  const currentCard = deck[cardIndex];

  const startSession = useCallback(() => {
    setDeck(buildSession(items, progress, getId, Date.now()));
    setCardIndex(0);
    setIsRevealed(false);
    setSessionComplete(false);
  }, [items, progress, getId]);

  useEffect(() => {
    if (didInit.current || now === 0) return;
    didInit.current = true;
    startSession();
    // Only ever auto-starts once, right after localStorage progress has hydrated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now]);

  const reveal = useCallback(() => setIsRevealed(true), []);

  const rate = useCallback(
    (rating: Rating) => {
      if (!currentCard) return;
      const id = getId(currentCard);
      const nextState = scheduleReview(progress[id], rating, Date.now());
      setProgress((current) => ({ ...current, [id]: nextState }));

      if (cardIndex >= deck.length - 1) {
        setSessionComplete(true);
      } else {
        setCardIndex((index) => index + 1);
        setIsRevealed(false);
      }
    },
    [cardIndex, currentCard, deck.length, getId, progress],
  );

  const resetProgress = useCallback(() => {
    setProgress({});
    setDeck([]);
    setCardIndex(0);
    setIsRevealed(false);
    setSessionComplete(false);
    didInit.current = false;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage failures.
    }
  }, [storageKey]);

  return {
    deck,
    currentCard,
    cardIndex,
    isRevealed,
    reveal,
    rate,
    sessionComplete,
    dueCount,
    reviewedCount,
    startSession,
    resetProgress,
  };
}
