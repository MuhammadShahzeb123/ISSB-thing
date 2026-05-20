'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface Picture {
  id: number;
  imageUrl: string;
  title: string;
  category: 'positive' | 'negative' | 'neutral';
}

const pictures: Picture[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1526779259212-abb06a9ca5fd?w=800',
    title: 'Soldier carrying injured comrade through battleground',
    category: 'positive',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1533193830795-6a5c2d0e90b6?w=800',
    title: 'Flood victims being rescued by boat',
    category: 'positive',
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800',
    title: 'Leader briefing team before mission',
    category: 'positive',
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800',
    title: 'Family waiting anxiously at airport',
    category: 'negative',
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=800',
    title: 'Accident scene with damaged vehicles',
    category: 'negative',
  },
  {
    id: 6,
    imageUrl: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800',
    title: 'Military funeral with draped coffin',
    category: 'negative',
  },
  {
    id: 7,
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800',
    title: 'Team discussing around conference table',
    category: 'neutral',
  },
  {
    id: 8,
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800',
    title: 'Person looking at multiple paths in forest',
    category: 'neutral',
  },
  {
    id: 9,
    imageUrl: 'https://images.unsplash.com/photo-1521791055366-0d553872125f?w=800',
    title: 'Two people shaking hands over table',
    category: 'neutral',
  },
  {
    id: 10,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    title: 'Leader standing alone looking at horizon',
    category: 'positive',
  },
  {
    id: 11,
    imageUrl: 'https://images.unsplash.com/photo-1473649085228-583485e6e4d7?w=800',
    title: 'Soldier standing guard in desert',
    category: 'positive',
  },
  {
    id: 12,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800',
    title: 'Three figures at crossroads at night',
    category: 'negative',
  },
  {
    id: 13,
    imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
    title: 'Team climbing mountain together',
    category: 'positive',
  },
  {
    id: 14,
    imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800',
    title: 'Person arguing with another in office',
    category: 'negative',
  },
  {
    id: 15,
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    title: 'Empty warehouse with single light bulb',
    category: 'neutral',
  },
  {
    id: 16,
    imageUrl: 'https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?w=800',
    title: 'Military drill with perfect formation',
    category: 'positive',
  },
  {
    id: 17,
    imageUrl: 'https://images.unsplash.com/photo-1504159506876-f1338246d70a?w=800',
    title: 'Broken bridge with people stranded',
    category: 'negative',
  },
  {
    id: 18,
    imageUrl: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800',
    title: 'Person reading letter by window',
    category: 'neutral',
  },
  {
    id: 19,
    imageUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800',
    title: 'Firefighters battling large blaze',
    category: 'positive',
  },
  {
    id: 20,
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f448948?w=800',
    title: 'Prisoner behind bars looking out',
    category: 'negative',
  },
  {
    id: 21,
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
    title: 'Two soldiers back to back facing opposite directions',
    category: 'neutral',
  },
  {
    id: 22,
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800',
    title: 'Children playing in ruins of building',
    category: 'negative',
  },
  {
    id: 23,
    imageUrl: 'https://images.unsplash.com/photo-1529333166437-7750a6d5a6c9?w=800',
    title: 'Medal ceremony with flag in background',
    category: 'positive',
  },
  {
    id: 24,
    imageUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
    title: 'Person looking at city skyline at sunset',
    category: 'neutral',
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomTime(): number {
  return Math.floor(Math.random() * 5) + 20;
}

export default function PictureTestPage() {
  const [shuffledPictures, setShuffledPictures] = useState<Picture[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const [currentDescription, setCurrentDescription] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [showImage, setShowImage] = useState(true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const startTest = useCallback(() => {
    const shuffled = shuffleArray(pictures);
    setShuffledPictures(shuffled);
    setCurrentIndex(0);
    setDescriptions([]);
    setIsFinished(false);
    setIsStarted(true);
    setTimeLeft(getRandomTime());
    setCurrentDescription('');
    setShowImage(true);
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
    if (isStarted && !isFinished && shuffledPictures.length > 0) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [currentIndex, isStarted, isFinished, shuffledPictures]);

  const saveAndNext = useCallback(() => {
    setDescriptions((prev) => [...prev, currentDescription.trim()]);
    setCurrentDescription('');

    if (currentIndex >= shuffledPictures.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(getRandomTime());
      setShowImage(true);
      setTimeout(() => setShowImage(false), 2500);
    }
  }, [currentDescription, currentIndex, shuffledPictures.length]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Picture Association Test</h1>
          <p className="text-slate-400 text-lg mb-8">
            Describe each image in your own words. You have 20-25 seconds per picture.
            This tests your perception, thinking ability, and communication skills.
          </p>
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Instructions:</h3>
            <ul className="text-slate-400 text-left space-y-2">
              <li>Picture shows for 2-3 seconds, then hides</li>
              <li>20-25 seconds to describe what you saw</li>
              <li>Press Enter to save and move to next</li>
              <li>Describe in your own words - be natural</li>
              <li>Focus on: what you see, what it means, what story it tells</li>
            </ul>
          </div>
          <button
            onClick={startTest}
            className="px-12 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg shadow-emerald-600/25"
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
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Test Complete!</h2>
          <p className="text-slate-400 text-center mb-8">{shuffledPictures.length} pictures described</p>
          <div className="space-y-4">
            {shuffledPictures.map((pic, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
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
          <button
            onClick={startTest}
            className="w-full mt-8 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  const currentPic = shuffledPictures[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400">Picture {currentIndex + 1} / {shuffledPictures.length}</span>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">Time</span>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#334155" strokeWidth="4" fill="none" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke={timeLeft <= 5 ? '#ef4444' : '#10b981'}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - timeLeft / 25)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                {timeLeft}
              </span>
            </div>
          </div>
        </div>

        {showImage && (
          <div className="mb-6 rounded-xl overflow-hidden border-2 border-emerald-500/50">
            <img
              src={currentPic.imageUrl}
              alt="Describe this picture"
              className="w-full h-72 md:h-96 object-cover"
            />
          </div>
        )}

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          {showImage && (
            <p className="text-center text-slate-500 mb-4">Image will be hidden soon. Start typing your description...</p>
          )}
          <textarea
            ref={textareaRef}
            value={currentDescription}
            onChange={(e) => setCurrentDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you saw in the picture..."
            className="w-full bg-transparent text-white text-lg placeholder-slate-600 outline-none resize-none min-h-[150px]"
            autoFocus
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
            >
              Hide Image
            </button>
            <button
              onClick={saveAndNext}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-all"
            >
              Save & Next (Enter)
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {shuffledPictures.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-emerald-500 w-4' : i < currentIndex ? 'bg-green-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';