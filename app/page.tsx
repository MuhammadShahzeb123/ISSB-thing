'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { watWords, shuffleWords } from './words';
import type { Word } from './words';

function getRandomTime(): number {
  return Math.floor(Math.random() * 5) + 6;
}

export default function WATPage() {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [sentences, setSentences] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState('');
  const [showWord, setShowWord] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startTest = useCallback(() => {
    const shuffled = shuffleWords(watWords);
    setShuffledWords(shuffled);
    setCurrentIndex(0);
    setSentences([]);
    setIsFinished(false);
    setIsStarted(true);
    setShowWord(true);
    setTimeLeft(getRandomTime());
  }, []);

  useEffect(() => {
    if (!isStarted || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted, isFinished]);

  useEffect(() => {
    if (timeLeft === 0 && !isFinished) {
      saveAndNext();
    }
  }, [timeLeft, isFinished]);

  useEffect(() => {
    if (isStarted && !isFinished && shuffledWords.length > 0) {
      setTimeLeft(getRandomTime());
      setCurrentSentence('');
      setShowWord(true);
      setTimeout(() => {
        setShowWord(false);
        setTimeout(() => {
          textareaRef.current?.focus();
        }, 300);
      }, 1000);
    }
  }, [currentIndex, isStarted, isFinished, shuffledWords]);

  const saveAndNext = useCallback(() => {
    setSentences((prev) => [...prev, currentSentence.trim()]);
    setCurrentSentence('');

    if (currentIndex >= shuffledWords.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentSentence, currentIndex, shuffledWords.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveAndNext();
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Word Association Test</h1>
          <p className="text-slate-400 text-lg mb-8">
            Practice for your ISSB with 200 real WAT words. Each word appears for 6-10 seconds.
            Write a meaningful sentence using the word shown.
          </p>
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Instructions:</h3>
            <ul className="text-slate-400 text-left space-y-2">
              <li>Each word appears for 6-10 seconds (random timing)</li>
              <li>Write a complete, meaningful sentence using the word</li>
              <li>Press Enter to save and move to next word</li>
              <li>Keep sentences positive and officer-like</li>
              <li>Your responses will be saved for review</li>
            </ul>
          </div>
          <button
            onClick={startTest}
            className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/25"
          >
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Test Complete!</h2>
          <p className="text-slate-400 text-center mb-8">{shuffledWords.length} words completed</p>
          <div className="space-y-3">
            {shuffledWords.map((word, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-start gap-4">
                  <span className="text-slate-500 font-mono text-sm min-w-[2rem]">{i + 1}.</span>
                  <div className="flex-1">
                    <span className="text-blue-400 font-bold text-xl">{word.word}</span>
                    <p className="text-slate-300 mt-1">{sentences[i] || <span className="text-slate-600 italic">No response</span>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={startTest}
            className="w-full mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  const currentWord = shuffledWords[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400">Word {currentIndex + 1} / {shuffledWords.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Time</span>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#334155" strokeWidth="4" fill="none" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke={timeLeft <= 2 ? '#ef4444' : '#3b82f6'}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeLeft / 10)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${timeLeft <= 2 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className={`bg-slate-800/50 rounded-2xl p-12 mb-6 border border-slate-700 transition-all duration-500 ${showWord ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="text-center">
              <h2 className="text-6xl font-bold text-white tracking-wide">{currentWord.word}</h2>
              <p className="text-slate-500 mt-4">Write your sentence below</p>
            </div>
          </div>

          {!showWord && (
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <textarea
                ref={textareaRef}
                value={currentSentence}
                onChange={(e) => setCurrentSentence(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Write a sentence with "${currentWord.word}"...`}
                className="w-full bg-transparent text-white text-2xl placeholder-slate-600 outline-none resize-none min-h-[100px]"
                autoFocus
              />
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                <span className="text-slate-500 text-sm">Press Enter to save & next</span>
                <span className="text-slate-500">{currentSentence.length} chars</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {shuffledWords.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-blue-500 w-4' : i < currentIndex ? 'bg-green-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}