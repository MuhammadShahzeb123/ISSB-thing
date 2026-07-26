'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { storySentences, shuffleStorySentences, type StorySentence } from './storySentences';
import { completionSentences, shuffleCompletionSentences, type CompletionSentence } from './completionSentences';

// ─── Shared Types ──────────────────────────────────────────────────────────────

interface Picture {
  id: number;
  imageUrl: string;
  title: string;
  category: 'positive' | 'negative' | 'neutral';
}

type ActiveTest = 'hub' | 'picture' | 'story' | 'completion';

// ─── Picture Data ──────────────────────────────────────────────────────────────

const pictures: Picture[] = [
  { id: 1, imageUrl: 'https://images.unsplash.com/photo-1526779259212-abb06a9ca5fd?w=800', title: 'Soldier carrying injured comrade through battleground', category: 'positive' },
  { id: 2, imageUrl: 'https://images.unsplash.com/photo-1533193830795-6a5c2d0e90b6?w=800', title: 'Flood victims being rescued by boat', category: 'positive' },
  { id: 3, imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800', title: 'Leader briefing team before mission', category: 'positive' },
  { id: 4, imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800', title: 'Family waiting anxiously at airport', category: 'negative' },
  { id: 5, imageUrl: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800', title: 'Accident scene with damaged vehicles', category: 'negative' },
  { id: 6, imageUrl: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800', title: 'Military funeral with draped coffin', category: 'negative' },
  { id: 7, imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', title: 'Team discussing around conference table', category: 'neutral' },
  { id: 8, imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800', title: 'Person looking at multiple paths in forest', category: 'neutral' },
  { id: 9, imageUrl: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800', title: 'Two people shaking hands over table', category: 'neutral' },
  { id: 10, imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', title: 'Leader standing alone looking at horizon', category: 'positive' },
  { id: 11, imageUrl: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?w=800', title: 'Soldier standing guard in desert', category: 'positive' },
  { id: 12, imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800', title: 'Three figures at crossroads at night', category: 'negative' },
  { id: 13, imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800', title: 'Team climbing mountain together', category: 'positive' },
  { id: 14, imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800', title: 'Person arguing with another in office', category: 'negative' },
  { id: 15, imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', title: 'Empty warehouse with single light bulb', category: 'neutral' },
  { id: 16, imageUrl: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=800', title: 'Military drill with perfect formation', category: 'positive' },
  { id: 17, imageUrl: 'https://images.unsplash.com/photo-1504159506876-f1338246d70a?w=800', title: 'Broken bridge with people stranded', category: 'negative' },
  { id: 18, imageUrl: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800', title: 'Person reading letter by window', category: 'neutral' },
  { id: 19, imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800', title: 'Firefighters battling large blaze', category: 'positive' },
  { id: 20, imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f448948?w=800', title: 'Prisoner behind bars looking out', category: 'negative' },
  { id: 21, imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800', title: 'Two soldiers back to back facing opposite directions', category: 'neutral' },
  { id: 22, imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800', title: 'Children playing in ruins of building', category: 'negative' },
  { id: 23, imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6d5a6c9?w=800', title: 'Medal ceremony with flag in background', category: 'positive' },
  { id: 24, imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800', title: 'Person looking at city skyline at sunset', category: 'neutral' },
];

// ─── Shared Utilities ──────────────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomPictureTime(): number {
  return Math.floor(Math.random() * 5) + 20;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  TEST SELECTION HUB
// ═══════════════════════════════════════════════════════════════════════════════

function TestHub({ onSelect }: { onSelect: (test: ActiveTest) => void }) {
  const tests = [
    {
      key: 'picture' as const,
      title: 'Picture Association Test',
      description: 'Describe each image in your own words. Tests perception, thinking ability, and communication skills.',
      accent: 'emerald',
      icon: '🖼',
      stats: ['24 pictures', '20-25s per image', 'Quick descriptions'],
    },
    {
      key: 'story' as const,
      title: 'Sentence Story Writing',
      description: 'Given a sentence, write a complete story around it. Tests creativity, narrative ability, and expression.',
      accent: 'amber',
      icon: '✍',
      stats: ['30 sentences', 'No time limit', 'Full stories'],
    },
    {
      key: 'completion' as const,
      title: 'Sentence Completion',
      description: 'Complete half-finished sentences related to PAF and Pakistan Army. Tests decision-making and attitude.',
      accent: 'sky',
      icon: '📝',
      stats: ['30 prompts', 'PAF & Army themed', 'Compound sentences'],
    },
  ];

  const accentMap: Record<string, { border: string; bg: string; text: string; glow: string; btn: string }> = {
    emerald: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/10',
      btn: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    },
    amber: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/10',
      btn: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    },
    sky: {
      border: 'border-sky-500/30',
      bg: 'bg-sky-950/20',
      text: 'text-sky-400',
      glow: 'shadow-sky-500/10',
      btn: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto max-w-4xl py-12">
        <div className="text-center mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">ISSB psychology practice</p>
          <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl mb-4">Psychological Tests</h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Three essential ISSB psychological assessment tests. Choose a test to begin practising.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {tests.map((test) => {
            const colors = accentMap[test.accent];
            return (
              <div
                key={test.key}
                className={`rounded-2xl border ${colors.border} ${colors.bg} p-6 flex flex-col shadow-xl ${colors.glow} transition-all hover:scale-[1.02]`}
              >
                <div className="text-4xl mb-4">{test.icon}</div>
                <h2 className="text-xl font-bold text-white mb-2">{test.title}</h2>
                <p className="text-sm text-slate-400 mb-6 flex-1">{test.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {test.stats.map((stat) => (
                    <span key={stat} className={`text-xs px-2 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {stat}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => onSelect(test.key)}
                  className={`w-full rounded-xl px-6 py-3 font-bold transition ${colors.btn}`}
                >
                  Start Test
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PICTURE ASSOCIATION TEST
// ═══════════════════════════════════════════════════════════════════════════════

function PictureTest({ onBack }: { onBack: () => void }) {
  const [shuffledPictures, setShuffledPictures] = useState<Picture[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showImage, setShowImage] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startTest = useCallback(() => {
    setShuffledPictures(shuffleArray(pictures));
    setCurrentIndex(0);
    setDescriptions([]);
    setIsFinished(false);
    setIsStarted(true);
    setTimeLeft(getRandomPictureTime());
    setCurrentDescription('');
    setShowImage(true);
  }, []);

  useEffect(() => {
    if (!isStarted || isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isStarted, isFinished]);

  const saveAndNext = useCallback(() => {
    setDescriptions((prev) => [...prev, currentDescription.trim()]);
    setCurrentDescription('');
    if (currentIndex >= shuffledPictures.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(getRandomPictureTime());
      setShowImage(true);
      setTimeout(() => setShowImage(false), 2500);
    }
  }, [currentDescription, currentIndex, shuffledPictures.length]);

  useEffect(() => {
    if (timeLeft !== 0 || isFinished) return;
    const timeout = window.setTimeout(saveAndNext, 0);
    return () => window.clearTimeout(timeout);
  }, [timeLeft, isFinished, saveAndNext]);

  useEffect(() => {
    if (isStarted && !isFinished && shuffledPictures.length > 0) {
      const timeout = window.setTimeout(() => textareaRef.current?.focus(), 300);
      return () => window.clearTimeout(timeout);
    }
  }, [currentIndex, isStarted, isFinished, shuffledPictures]);

  const handleSkip = () => {
    setShowImage(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveAndNext();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-3xl py-12">
          <button onClick={onBack} className="mb-8 text-sm text-slate-500 hover:text-white transition-colors">← Back to tests</button>
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">ISSB psychology practice</p>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl mb-4">Picture Association Test</h1>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Describe each image in your own words. You have 20-25 seconds per picture.
              This tests your perception, thinking ability, and communication skills.
            </p>
            <div className="mb-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                ['24', 'pictures'],
                ['20-25s', 'per image'],
                ['Quick', 'descriptions'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <h2 className="mb-4 font-semibold text-white">Instructions</h2>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>• Picture shows for 2-3 seconds, then hides</li>
                <li>• 20-25 seconds to describe what you saw</li>
                <li>• Press Enter to save and move to next</li>
                <li>• Describe in your own words — be natural</li>
                <li>• Focus on: what you see, what it means, what story it tells</li>
              </ul>
            </div>
            <button onClick={startTest} className="rounded-xl bg-emerald-500 px-10 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-4xl py-8">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Session complete</p>
            <h2 className="mb-2 text-4xl font-bold text-white">Picture Association Results</h2>
            <p className="text-slate-400">{shuffledPictures.length} pictures described</p>
          </div>
          <div className="space-y-4">
            {shuffledPictures.map((pic, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img src={pic.imageUrl} alt={pic.title} className="w-full h-48 md:h-full object-cover" />
                  </div>
                  <div className="p-4 md:w-2/3">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-slate-500 text-sm">Picture {i + 1}</span>
                      <span className={`text-xs uppercase ${getCategoryColor(pic.category)}`}>{pic.category}</span>
                    </div>
                    <p className="text-emerald-400 text-sm mb-2">Hint: {pic.title}</p>
                    <p className="text-slate-300">{descriptions[i] || <span className="text-slate-600 italic">No response</span>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={startTest} className="flex-1 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-emerald-400">
              Practice Again
            </button>
            <button onClick={onBack} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-8 py-4 font-bold text-white transition hover:bg-slate-700">
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentPic = shuffledPictures[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto max-w-3xl py-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400 text-sm">Picture {currentIndex + 1} / {shuffledPictures.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Time</span>
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="#1e293b" strokeWidth="4" fill="none" />
                <circle
                  cx="28" cy="28" r="24"
                  stroke={timeLeft <= 5 ? '#ef4444' : '#10b981'}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - timeLeft / 25)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {showImage && (
          <div className="mb-6 rounded-xl overflow-hidden border-2 border-emerald-500/40">
            <img src={currentPic.imageUrl} alt="Describe this picture" className="w-full h-64 md:h-80 object-cover" />
          </div>
        )}

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          {showImage && (
            <p className="text-center text-slate-500 mb-4 text-sm">Image will be hidden soon. Start typing your description...</p>
          )}
          <textarea
            ref={textareaRef}
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you saw in the picture..."
            className="w-full bg-transparent text-white text-lg placeholder-slate-700 outline-none resize-none min-h-[140px]"
            autoFocus
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
            <button onClick={handleSkip} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition">
              Hide Image
            </button>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600">{currentDescription.length} chars</span>
              <button onClick={saveAndNext} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-semibold rounded-lg transition">
                Save & Next (Enter)
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {shuffledPictures.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-emerald-500 w-4' : i < currentIndex ? 'bg-emerald-500/50' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SENTENCE STORY WRITING TEST
// ═══════════════════════════════════════════════════════════════════════════════

function SentenceStoryTest({ onBack }: { onBack: () => void }) {
  const [shuffledSentences, setShuffledSentences] = useState<StorySentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [stories, setStories] = useState<string[]>([]);
  const [currentStory, setCurrentStory] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startTest = useCallback(() => {
    setShuffledSentences(shuffleStorySentences(storySentences));
    setCurrentIndex(0);
    setStories([]);
    setIsFinished(false);
    setIsStarted(true);
    setCurrentStory('');
    setWordCount(0);
  }, []);

  const handleStoryChange = (value: string) => {
    setCurrentStory(value);
    setWordCount(value.trim() === '' ? 0 : value.trim().split(/\s+/).length);
  };

  const saveAndNext = useCallback(() => {
    setStories((prev) => [...prev, currentStory.trim()]);
    setCurrentStory('');
    setWordCount(0);
    if (currentIndex >= shuffledSentences.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentStory, currentIndex, shuffledSentences.length]);

  useEffect(() => {
    if (isStarted && !isFinished && shuffledSentences.length > 0) {
      const timeout = window.setTimeout(() => textareaRef.current?.focus(), 300);
      return () => window.clearTimeout(timeout);
    }
  }, [currentIndex, isStarted, isFinished, shuffledSentences]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveAndNext();
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'negative' ? 'text-red-400' : 'text-amber-400';
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-3xl py-12">
          <button onClick={onBack} className="mb-8 text-sm text-slate-500 hover:text-white transition-colors">← Back to tests</button>
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">ISSB psychology practice</p>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl mb-4">Sentence Story Writing</h1>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              You will be given a sentence. Write a complete story inspired by it.
              This tests your creativity, narrative ability, and expression.
            </p>
            <div className="mb-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                ['30', 'sentences'],
                ['No', 'time limit'],
                ['Full', 'stories'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <h2 className="mb-4 font-semibold text-white">Instructions</h2>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>• Read the given sentence carefully</li>
                <li>• Write a complete story based on or inspired by it</li>
                <li>• There is no time limit — take your time</li>
                <li>• Press Enter to save and move to the next sentence</li>
                <li>• You can do the test again as many times as you want</li>
                <li>• Review your stories at the end for coherence and grammar</li>
              </ul>
            </div>
            <button onClick={startTest} className="rounded-xl bg-amber-500 px-10 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-4xl py-8">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">Session complete</p>
            <h2 className="mb-2 text-4xl font-bold text-white">Your Story Responses</h2>
            <p className="text-slate-400">{shuffledSentences.length} sentences completed</p>
          </div>
          <div className="space-y-4">
            {shuffledSentences.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-500 text-sm">Sentence {i + 1}</span>
                  <span className={`text-xs uppercase ${getCategoryColor(s.category)}`}>{s.category}</span>
                  {stories[i] && (
                    <span className="text-xs text-slate-600">{stories[i].trim().split(/\s+/).length} words</span>
                  )}
                </div>
                <p className="text-amber-300 font-medium mb-3 italic">&ldquo;{s.sentence}&rdquo;</p>
                <p className="text-slate-300">{stories[i] || <span className="text-slate-600 italic">No response</span>}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={startTest} className="flex-1 rounded-xl bg-amber-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-amber-400">
              Practice Again
            </button>
            <button onClick={onBack} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-8 py-4 font-bold text-white transition hover:bg-slate-700">
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSentence = shuffledSentences[currentIndex];
  const progress = ((currentIndex + 1) / shuffledSentences.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto max-w-3xl py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-slate-400 text-sm">Sentence {currentIndex + 1} / {shuffledSentences.length}</span>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: progress + '%' }} />
            </div>
          </div>
          <span className={`text-xs uppercase px-3 py-1 rounded-full border ${currentSentence.category === 'negative' ? 'border-red-500/30 bg-red-950/30 text-red-400' : 'border-amber-500/30 bg-amber-950/30 text-amber-400'}`}>
            {currentSentence.category}
          </span>
        </div>

        <div className="mb-6 rounded-3xl border border-amber-900/60 bg-amber-950/20 p-10 text-center shadow-2xl shadow-amber-950/20 md:p-14">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">Write a story based on</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed italic">&ldquo;{currentSentence.sentence}&rdquo;</h2>
          <p className="mt-5 text-sm text-slate-500">Write a complete story. No time limit.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <textarea
            ref={textareaRef}
            value={currentStory}
            onChange={(e) => handleStoryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your story here..."
            className="min-h-[200px] w-full resize-none bg-transparent text-lg leading-relaxed text-white outline-none placeholder:text-slate-700"
            autoFocus
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-600">{wordCount} words</span>
              <span className="text-xs text-slate-600">{currentStory.length} chars</span>
            </div>
            <button onClick={saveAndNext} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-400">
              Save & Next (Enter)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SENTENCE COMPLETION TEST
// ═══════════════════════════════════════════════════════════════════════════════

function SentenceCompletionTest({ onBack }: { onBack: () => void }) {
  const [shuffledSentences, setShuffledSentences] = useState<CompletionSentence[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [completions, setCompletions] = useState<string[]>([]);
  const [currentCompletion, setCurrentCompletion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startTest = useCallback(() => {
    setShuffledSentences(shuffleCompletionSentences(completionSentences));
    setCurrentIndex(0);
    setCompletions([]);
    setIsFinished(false);
    setIsStarted(true);
    setCurrentCompletion('');
  }, []);

  const saveAndNext = useCallback(() => {
    setCompletions((prev) => [...prev, currentCompletion.trim()]);
    setCurrentCompletion('');
    if (currentIndex >= shuffledSentences.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentCompletion, currentIndex, shuffledSentences.length]);

  useEffect(() => {
    if (isStarted && !isFinished && shuffledSentences.length > 0) {
      const timeout = window.setTimeout(() => textareaRef.current?.focus(), 300);
      return () => window.clearTimeout(timeout);
    }
  }, [currentIndex, isStarted, isFinished, shuffledSentences]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveAndNext();
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'paf': return 'Pakistan Air Force';
      case 'army': return 'Pakistan Army';
      default: return 'Defense';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'paf': return 'border-sky-500/30 bg-sky-950/30 text-sky-400';
      case 'army': return 'border-green-500/30 bg-green-950/30 text-green-400';
      default: return 'border-slate-500/30 bg-slate-950/30 text-slate-400';
    }
  };

  const getCategoryAccent = (category: string) => {
    switch (category) {
      case 'paf': return { border: 'border-sky-900/60', bg: 'bg-sky-950/20', text: 'text-sky-400', glow: 'shadow-sky-950/20' };
      case 'army': return { border: 'border-green-900/60', bg: 'bg-green-950/20', text: 'text-green-400', glow: 'shadow-green-950/20' };
      default: return { border: 'border-slate-700/60', bg: 'bg-slate-900/20', text: 'text-slate-400', glow: 'shadow-slate-950/20' };
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-3xl py-12">
          <button onClick={onBack} className="mb-8 text-sm text-slate-500 hover:text-white transition-colors">← Back to tests</button>
          <div className="text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-400">ISSB psychology practice</p>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl mb-4">Sentence Completion</h1>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Complete half-finished sentences related to PAF and Pakistan Army.
              This tests your decision-making, attitude, and knowledge of military life.
            </p>
            <div className="mb-8 grid gap-3 text-left sm:grid-cols-3">
              {[
                ['30', 'prompts'],
                ['PAF & Army', 'themed'],
                ['Compound', 'sentences'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
            <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-left">
              <h2 className="mb-4 font-semibold text-white">Instructions</h2>
              <ul className="space-y-3 text-sm text-slate-400">
                <li>• Read the first half of a compound sentence</li>
                <li>• Complete it naturally and logically</li>
                <li>• Sentences are themed around PAF, Army, and military life</li>
                <li>• Press Enter to save and move to the next sentence</li>
                <li>• Be positive, constructive, and realistic in your responses</li>
                <li>• Review your completions at the end</li>
              </ul>
            </div>
            <button onClick={startTest} className="rounded-xl bg-sky-500 px-10 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400">
              Start Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto max-w-4xl py-8">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-400">Session complete</p>
            <h2 className="mb-2 text-4xl font-bold text-white">Your Completions</h2>
            <p className="text-slate-400">{shuffledSentences.length} sentences completed</p>
          </div>
          <div className="space-y-4">
            {shuffledSentences.map((s, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-slate-500 text-sm">Sentence {i + 1}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(s.category)}`}>
                    {getCategoryLabel(s.category)}
                  </span>
                </div>
                <p className="text-sky-300 font-medium mb-3">
                  {s.prompt} <span className="text-white font-semibold">{completions[i] || <span className="text-slate-600 italic">No response</span>}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={startTest} className="flex-1 rounded-xl bg-sky-500 px-8 py-4 font-bold text-slate-950 transition hover:bg-sky-400">
              Practice Again
            </button>
            <button onClick={onBack} className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-8 py-4 font-bold text-white transition hover:bg-slate-700">
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = shuffledSentences[currentIndex];
  const progress = ((currentIndex + 1) / shuffledSentences.length) * 100;
  const accent = getCategoryAccent(current.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto max-w-3xl py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="text-slate-400 text-sm">Sentence {currentIndex + 1} / {shuffledSentences.length}</span>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-sky-500 transition-all" style={{ width: progress + '%' }} />
            </div>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${getCategoryColor(current.category)}`}>
            {getCategoryLabel(current.category)}
          </span>
        </div>

        <div className={`mb-6 rounded-3xl border ${accent.border} ${accent.bg} p-10 text-center shadow-2xl ${accent.glow} md:p-14`}>
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.3em] ${accent.text}`}>&ldquo;Complete the sentence&rdquo;</p>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            {current.prompt}
          </h2>
          <p className="mt-5 text-sm text-slate-500">Complete the sentence naturally. Write your response below.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <textarea
            ref={textareaRef}
            value={currentCompletion}
            onChange={(e) => setCurrentCompletion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Complete the sentence..."
            className="min-h-[120px] w-full resize-none bg-transparent text-lg leading-relaxed text-white outline-none placeholder:text-slate-700"
            autoFocus
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800">
            <span className="text-xs text-slate-600">{currentCompletion.length} chars</span>
            <button onClick={saveAndNext} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Save & Next (Enter)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function PictureTestPage() {
  const [activeTest, setActiveTest] = useState<ActiveTest>('hub');

  return (
    <>
      {activeTest === 'hub' && <TestHub onSelect={setActiveTest} />}
      {activeTest === 'picture' && <PictureTest onBack={() => setActiveTest('hub')} />}
      {activeTest === 'story' && <SentenceStoryTest onBack={() => setActiveTest('hub')} />}
      {activeTest === 'completion' && <SentenceCompletionTest onBack={() => setActiveTest('hub')} />}
    </>
  );
}
