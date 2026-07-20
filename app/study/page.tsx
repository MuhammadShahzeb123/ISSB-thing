'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Category = 'ISSB' | 'Pakistan' | 'World' | 'Science' | 'Service knowledge';

interface Fact {
  id: string;
  category: Category;
  prompt: string;
  answer: string;
  detail: string;
}

type Rating = 'again' | 'hard' | 'easy';
type ReviewProgress = Record<string, { dueAt: number; reviews: number; streak: number; lastRating: Rating }>;

const facts: Fact[] = [
  { id: 'issb-dimensions', category: 'ISSB', prompt: 'What are the three assessment dimensions named by ISSB?', answer: 'Psychologist, GTO, and Deputy President.', detail: 'The official selection system describes a three-dimensional assessment protocol.' },
  { id: 'issb-duration', category: 'ISSB', prompt: 'How long does the ISSB selection process last according to the official site?', answer: 'Four days.', detail: 'The official site says the activities are flexible and regularly adjusted to service requirements.' },
  { id: 'issb-gto', category: 'ISSB', prompt: 'What does the GTO dimension observe?', answer: 'Behaviour in group settings through situational tests and group activities.', detail: 'Think: GTO = group behaviour under practical conditions.' },
  { id: 'issb-psychologist', category: 'ISSB', prompt: 'What is the focus of the psychologist dimension?', answer: 'It uncovers the candidate’s subconscious through psychological tests and assessments.', detail: 'Prepare for authenticity and consistency rather than memorised “perfect” answers.' },
  { id: 'issb-deputy', category: 'ISSB', prompt: 'What does the Deputy President dimension analyse?', answer: 'Intellect, emotional pattern, and social behaviour through interviews.', detail: 'A clear, truthful explanation is more useful than a rehearsed persona.' },
  { id: 'pak-capital', category: 'Pakistan', prompt: 'What is the capital of Pakistan?', answer: 'Islamabad.', detail: 'Recall it before looking at the World Capitals Map.' },
  { id: 'pak-k2', category: 'Pakistan', prompt: 'In which mountain range is K2 located?', answer: 'The Karakoram.', detail: 'K2 is also known as Mount Godwin-Austen.' },
  { id: 'pak-river', category: 'Pakistan', prompt: 'Which major river gives the Indus Valley its name?', answer: 'The Indus River.', detail: 'The Indus is central to Pakistan’s geography and irrigation.' },
  { id: 'pak-poet', category: 'Pakistan', prompt: 'Who is widely known as Pakistan’s national poet?', answer: 'Allama Muhammad Iqbal.', detail: 'His poetry and philosophy are important parts of Pakistan Studies.' },
  { id: 'pak-minar', category: 'Pakistan', prompt: 'Where is Minar-e-Pakistan located?', answer: 'Lahore.', detail: 'It stands in Iqbal Park.' },
  { id: 'pak-sea', category: 'Pakistan', prompt: 'Which sea borders Pakistan to the south?', answer: 'The Arabian Sea.', detail: 'Pakistan’s coastline is in the northern Arabian Sea.' },
  { id: 'pak-national-language', category: 'Pakistan', prompt: 'What is Pakistan’s national language?', answer: 'Urdu.', detail: 'English is also widely used for official and higher-education purposes.' },
  { id: 'world-un', category: 'World', prompt: 'Where is the headquarters of the United Nations?', answer: 'New York City, United States.', detail: 'The UN also has major offices in Geneva, Nairobi, and Vienna.' },
  { id: 'world-saarc', category: 'World', prompt: 'Where is the SAARC Secretariat located?', answer: 'Kathmandu, Nepal.', detail: 'SAARC stands for South Asian Association for Regional Cooperation.' },
  { id: 'world-oic', category: 'World', prompt: 'Where is the headquarters of the Organisation of Islamic Cooperation?', answer: 'Jeddah, Saudi Arabia.', detail: 'The OIC is an intergovernmental organisation of Muslim-majority and Muslim-community countries.' },
  { id: 'world-nato', category: 'World', prompt: 'Where is NATO headquarters?', answer: 'Brussels, Belgium.', detail: 'Brussels is also the capital of Belgium.' },
  { id: 'world-ocean', category: 'World', prompt: 'Which is the largest ocean?', answer: 'The Pacific Ocean.', detail: 'It covers more area than all of Earth’s land combined.' },
  { id: 'world-suez', category: 'World', prompt: 'Which two bodies of water are connected by the Suez Canal?', answer: 'The Mediterranean Sea and the Red Sea.', detail: 'This makes it a major route between Europe and Asia.' },
  { id: 'world-hormuz', category: 'World', prompt: 'What does the Strait of Hormuz connect?', answer: 'The Persian Gulf and the Gulf of Oman.', detail: 'It is a strategically important energy corridor.' },
  { id: 'world-equator', category: 'World', prompt: 'What does the Equator divide Earth into?', answer: 'The Northern and Southern Hemispheres.', detail: 'It is at 0° latitude.' },
  { id: 'science-force', category: 'Science', prompt: 'What is the SI unit of force?', answer: 'The newton (N).', detail: 'One newton is the force needed to accelerate one kilogram by one metre per second squared.' },
  { id: 'science-red-planet', category: 'Science', prompt: 'Which planet is called the Red Planet?', answer: 'Mars.', detail: 'Iron minerals on its surface create the reddish appearance.' },
  { id: 'science-photosynthesis', category: 'Science', prompt: 'What process lets green plants convert light energy into chemical energy?', answer: 'Photosynthesis.', detail: 'Plants use light, carbon dioxide, and water to make glucose and release oxygen.' },
  { id: 'science-ozone', category: 'Science', prompt: 'What does the ozone layer help absorb?', answer: 'Ultraviolet radiation from the Sun.', detail: 'It is concentrated in the stratosphere.' },
  { id: 'science-speed-light', category: 'Science', prompt: 'What is the approximate speed of light in vacuum?', answer: '300,000 kilometres per second.', detail: 'The exact defined value is 299,792.458 km/s.' },
  { id: 'science-dna', category: 'Science', prompt: 'What does DNA carry?', answer: 'Genetic information.', detail: 'DNA stands for deoxyribonucleic acid.' },
  { id: 'science-human-heart', category: 'Science', prompt: 'How many chambers does the human heart have?', answer: 'Four.', detail: 'Two atria and two ventricles.' },
  { id: 'science-atmosphere', category: 'Science', prompt: 'Which gas makes up most of Earth’s atmosphere?', answer: 'Nitrogen.', detail: 'It makes up roughly 78% of the atmosphere.' },
  { id: 'service-army', category: 'Service knowledge', prompt: 'What does COAS stand for?', answer: 'Chief of Army Staff.', detail: 'Use the full phrase when answering an interview question.' },
  { id: 'service-navy', category: 'Service knowledge', prompt: 'What does CNS stand for in naval usage?', answer: 'Chief of Naval Staff.', detail: 'The title refers to the senior professional head of a navy.' },
  { id: 'service-air', category: 'Service knowledge', prompt: 'What does CAS stand for in air-force usage?', answer: 'Chief of the Air Staff.', detail: 'The same abbreviation can mean different things in other contexts, so use the branch context.' },
  { id: 'service-army-entry', category: 'Service knowledge', prompt: 'What is the first rank in the Army officer ladder shown in this app?', answer: 'Second Lieutenant.', detail: 'The enlisted/JCO ladder is separate from the commissioned officer ladder.' },
  { id: 'service-navy-entry', category: 'Service knowledge', prompt: 'What is the officer-training entry point in the Navy ladder shown here?', answer: 'Midshipman.', detail: 'It follows the enlisted sailor and petty-officer sequence in the study deck.' },
  { id: 'service-air-entry', category: 'Service knowledge', prompt: 'What is the training-stage entry point in the Air Force officer ladder shown here?', answer: 'Officer Cadet.', detail: 'The next step in that ladder is Pilot Officer.' },
  { id: 'service-nato', category: 'Service knowledge', prompt: 'What does a NATO rank code help you compare?', answer: 'The level of a rank across military systems.', detail: 'It is a comparison code, not a replacement for the service-specific rank name.' },
  { id: 'service-leadership', category: 'Service knowledge', prompt: 'Why should rank recall be practised in both directions?', answer: 'To recognise a rank from its position and to name the next rank from a prompt.', detail: 'Two-way retrieval is stronger than only rereading a top-to-bottom list.' },
];

const categoryColors: Record<Category, string> = {
  ISSB: 'border-cyan-900/60 bg-cyan-950/20 text-cyan-300',
  Pakistan: 'border-emerald-900/60 bg-emerald-950/20 text-emerald-300',
  World: 'border-blue-900/60 bg-blue-950/20 text-blue-300',
  Science: 'border-violet-900/60 bg-violet-950/20 text-violet-300',
  'Service knowledge': 'border-amber-900/60 bg-amber-950/20 text-amber-300',
};

const DAY = 24 * 60 * 60 * 1000;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export default function StudyPage() {
  const [category, setCategory] = useState<'All' | Category>('All');
  const [progress, setProgress] = useState<ReviewProgress>({});
  const [session, setSession] = useState<Fact[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [now, setNow] = useState(0);
  const hasHydrated = useRef(false);

  const availableFacts = useMemo(
    () => (category === 'All' ? facts : facts.filter((fact) => fact.category === category)),
    [category],
  );
  const currentFact = session[currentIndex];
  const dueCount = useMemo(
    () => availableFacts.filter((fact) => !progress[fact.id] || progress[fact.id].dueAt <= now).length,
    [availableFacts, now, progress],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem('issb-general-knowledge-progress');
        if (saved) setProgress(JSON.parse(saved) as ReviewProgress);
      } catch {
        // Continue with an in-memory deck.
      } finally {
        hasHydrated.current = true;
        setNow(Date.now());
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    try {
      window.localStorage.setItem('issb-general-knowledge-progress', JSON.stringify(progress));
    } catch {
      // Progress is optional.
    }
  }, [progress]);

  const startSession = useCallback(() => {
    const now = Date.now();
    const due = availableFacts.filter((fact) => !progress[fact.id] || progress[fact.id].dueAt <= now);
    const notDue = availableFacts.filter((fact) => progress[fact.id] && progress[fact.id].dueAt > now);
    const nextSession = [...shuffle(due), ...shuffle(notDue)];

    setSession(nextSession);
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsStarted(true);
    setSessionComplete(false);
  }, [availableFacts, progress]);

  const rateCurrent = (rating: Rating) => {
    if (!currentFact) return;

    const previous = progress[currentFact.id];
    const interval = rating === 'again' ? 10 * 60 * 1000 : rating === 'hard' ? DAY : 4 * DAY;
    setProgress((current) => ({
      ...current,
      [currentFact.id]: {
        dueAt: Date.now() + interval,
        reviews: (previous?.reviews ?? 0) + 1,
        streak: rating === 'again' ? 0 : (previous?.streak ?? 0) + 1,
        lastRating: rating,
      },
    }));

    if (currentIndex >= session.length - 1) {
      setSessionComplete(true);
    } else {
      setCurrentIndex((index) => index + 1);
      setIsRevealed(false);
    }
  };

  const resetProgress = () => {
    setProgress({});
    setIsStarted(false);
    setSession([]);
    setSessionComplete(false);
    try {
      window.localStorage.removeItem('issb-general-knowledge-progress');
    } catch {
      // Ignore storage failures.
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-4xl items-center justify-center">
          <div className="w-full text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-violet-400">ISSB general knowledge</p>
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">Memory Lab</h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-400">
              A mixed retrieval deck for ISSB facts, Pakistan Studies, world knowledge, science, and service terminology.
            </p>
            <div className="mb-7 flex flex-wrap justify-center gap-2">
              {(['All', ...Object.keys(categoryColors)] as Array<'All' | Category>).map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setCategory(item)}
                  className={category === item ? 'rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white' : 'rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white'}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mb-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-2xl font-bold text-white">{availableFacts.length}</p><p className="text-sm text-slate-500">cards in this deck</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-2xl font-bold text-amber-300">{dueCount}</p><p className="text-sm text-slate-500">due for recall</p></div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><p className="text-2xl font-bold text-emerald-300">{Object.keys(progress).length}</p><p className="text-sm text-slate-500">reviewed so far</p></div>
            </div>
            <div className="mb-8 rounded-2xl border border-violet-900/50 bg-violet-950/15 p-6 text-left">
              <h2 className="mb-3 font-semibold text-white">The loop</h2>
              <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
                <p><span className="font-semibold text-violet-300">1. Retrieve</span><br />Answer from memory before revealing.</p>
                <p><span className="font-semibold text-violet-300">2. Rate</span><br />Be honest about how easy it felt.</p>
                <p><span className="font-semibold text-violet-300">3. Return</span><br />Cards come back at a useful interval.</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={startSession} className="rounded-xl bg-violet-500 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400">
                Start {category === 'All' ? 'mixed' : category} review
              </button>
              <button type="button" onClick={resetProgress} className="rounded-xl border border-slate-700 px-6 py-4 text-sm text-slate-400 transition hover:border-slate-500 hover:text-white">
                Reset progress
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-emerald-900/50 bg-emerald-950/15 p-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">Session complete</p>
            <h2 className="mb-3 text-4xl font-bold text-white">Knowledge bank updated</h2>
            <p className="mx-auto mb-7 max-w-xl text-slate-400">Your honest ratings scheduled the next review. A short return tomorrow is more useful than cramming all of these facts again tonight.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={startSession} className="rounded-xl bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-400">Review again</button>
              <button type="button" onClick={() => setIsStarted(false)} className="rounded-xl border border-slate-700 px-6 py-3 text-slate-300 transition hover:border-slate-500">Change deck</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center">
        <div className="w-full">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-400">{currentFact.category}</p>
              <p className="mt-1 text-sm text-slate-500">Card {currentIndex + 1} of {session.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">{dueCount} due in this deck</p>
              <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-violet-500 transition-all" style={{ width: ((currentIndex + 1) / session.length) * 100 + '%' }} />
              </div>
            </div>
          </div>

          <section className={'rounded-3xl border p-6 shadow-2xl sm:p-10 ' + categoryColors[currentFact.category]}>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] opacity-70">Answer before reveal</p>
            <h1 className="mb-8 text-3xl font-bold text-white sm:text-5xl">{currentFact.prompt}</h1>

            {!isRevealed ? (
              <button type="button" onClick={() => setIsRevealed(true)} className="rounded-xl bg-violet-500 px-7 py-3 font-semibold text-white transition hover:bg-violet-400">
                Reveal answer
              </button>
            ) : (
              <>
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xl font-semibold text-white">{currentFact.answer}</p>
                  <p className="mt-3 text-sm text-slate-400">{currentFact.detail}</p>
                </div>
                <p className="mb-3 mt-8 text-sm text-slate-400">How easy was that recall?</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ['again', 'Again', '10 min'],
                    ['hard', 'Hard', 'Tomorrow'],
                    ['easy', 'Easy', '4 days'],
                  ].map(([rating, label, timing]) => (
                    <button
                      type="button"
                      key={rating}
                      onClick={() => rateCurrent(rating as Rating)}
                      className={rating === 'again' ? 'rounded-xl border border-red-900/70 bg-red-950/30 px-4 py-3 text-left transition hover:border-red-500' : rating === 'hard' ? 'rounded-xl border border-amber-900/70 bg-amber-950/30 px-4 py-3 text-left transition hover:border-amber-500' : 'rounded-xl border border-emerald-900/70 bg-emerald-950/30 px-4 py-3 text-left transition hover:border-emerald-500'}
                    >
                      <span className="block font-semibold text-white">{label}</span>
                      <span className="text-xs text-slate-500">{timing}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>

          <div className="mt-5 flex items-center justify-between gap-3 text-sm">
            <button type="button" onClick={() => setIsStarted(false)} className="text-slate-500 transition hover:text-white">Change deck</button>
            <button type="button" onClick={startSession} className="text-slate-500 transition hover:text-white">Shuffle remaining</button>
          </div>
        </div>
      </div>
    </div>
  );
}
