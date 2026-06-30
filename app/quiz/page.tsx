'use client';

import { useState, useCallback } from 'react';

const countries: { country: string; capital: string }[] = [
  { country: "Afghanistan", capital: "Kabul" },
  { country: "Albania", capital: "Tirana" },
  { country: "Algeria", capital: "Algiers" },
  { country: "Andorra", capital: "Andorra la Vella" },
  { country: "Angola", capital: "Luanda" },
  { country: "Antigua and Barbuda", capital: "Saint John's" },
  { country: "Argentina", capital: "Buenos Aires" },
  { country: "Armenia", capital: "Yerevan" },
  { country: "Australia", capital: "Canberra" },
  { country: "Austria", capital: "Vienna" },
  { country: "Azerbaijan", capital: "Baku" },
  { country: "Bahamas", capital: "Nassau" },
  { country: "Bahrain", capital: "Manama" },
  { country: "Bangladesh", capital: "Dhaka" },
  { country: "Barbados", capital: "Bridgetown" },
  { country: "Belarus", capital: "Minsk" },
  { country: "Belgium", capital: "Brussels" },
  { country: "Belize", capital: "Belmopan" },
  { country: "Benin", capital: "Porto-Novo" },
  { country: "Bhutan", capital: "Thimphu" },
  { country: "Bolivia", capital: "Sucre" },
  { country: "Bosnia and Herzegovina", capital: "Sarajevo" },
  { country: "Botswana", capital: "Gaborone" },
  { country: "Brazil", capital: "Brasilia" },
  { country: "Brunei", capital: "Bandar Seri Begawan" },
  { country: "Bulgaria", capital: "Sofia" },
  { country: "Burkina Faso", capital: "Ouagadougou" },
  { country: "Burundi", capital: "Gitega" },
  { country: "Cambodia", capital: "Phnom Penh" },
  { country: "Cameroon", capital: "Yaounde" },
  { country: "Canada", capital: "Ottawa" },
  { country: "Chad", capital: "N'Djamena" },
  { country: "Chile", capital: "Santiago" },
  { country: "China", capital: "Beijing" },
  { country: "Colombia", capital: "Bogota" },
  { country: "Costa Rica", capital: "San Jose" },
  { country: "Croatia", capital: "Zagreb" },
  { country: "Cuba", capital: "Havana" },
  { country: "Cyprus", capital: "Nicosia" },
  { country: "Czech Republic", capital: "Prague" },
  { country: "Denmark", capital: "Copenhagen" },
  { country: "Djibouti", capital: "Djibouti" },
  { country: "Dominica", capital: "Roseau" },
  { country: "Dominican Republic", capital: "Santo Domingo" },
  { country: "Ecuador", capital: "Quito" },
  { country: "Egypt", capital: "Cairo" },
  { country: "El Salvador", capital: "San Salvador" },
  { country: "Eritrea", capital: "Asmara" },
  { country: "Estonia", capital: "Tallinn" },
  { country: "Ethiopia", capital: "Addis Ababa" },
  { country: "Fiji", capital: "Suva" },
  { country: "Finland", capital: "Helsinki" },
  { country: "France", capital: "Paris" },
  { country: "Gabon", capital: "Libreville" },
  { country: "Gambia", capital: "Banjul" },
  { country: "Georgia", capital: "Tbilisi" },
  { country: "Germany", capital: "Berlin" },
  { country: "Ghana", capital: "Accra" },
  { country: "Greece", capital: "Athens" },
  { country: "Grenada", capital: "St. George's" },
  { country: "Guatemala", capital: "Guatemala City" },
  { country: "Guinea", capital: "Conakry" },
  { country: "Guinea-Bissau", capital: "Bissau" },
  { country: "Guyana", capital: "Georgetown" },
  { country: "Haiti", capital: "Port-au-Prince" },
  { country: "Honduras", capital: "Tegucigalpa" },
  { country: "Hungary", capital: "Budapest" },
  { country: "Iceland", capital: "Reykjavik" },
  { country: "India", capital: "New Delhi" },
  { country: "Indonesia", capital: "Jakarta" },
  { country: "Iran", capital: "Tehran" },
  { country: "Iraq", capital: "Baghdad" },
  { country: "Ireland", capital: "Dublin" },
  { country: "Israel", capital: "Jerusalem" },
  { country: "Italy", capital: "Rome" },
  { country: "Jamaica", capital: "Kingston" },
  { country: "Japan", capital: "Tokyo" },
  { country: "Jordan", capital: "Amman" },
  { country: "Kazakhstan", capital: "Astana" },
  { country: "Kenya", capital: "Nairobi" },
  { country: "Kiribati", capital: "Tarawa" },
  { country: "Kosovo", capital: "Pristina" },
  { country: "Kuwait", capital: "Kuwait City" },
  { country: "Kyrgyzstan", capital: "Bishkek" },
  { country: "Laos", capital: "Vientiane" },
  { country: "Latvia", capital: "Riga" },
  { country: "Lebanon", capital: "Beirut" },
  { country: "Lesotho", capital: "Maseru" },
  { country: "Liberia", capital: "Monrovia" },
  { country: "Libya", capital: "Tripoli" },
  { country: "Liechtenstein", capital: "Vaduz" },
  { country: "Lithuania", capital: "Vilnius" },
  { country: "Luxembourg", capital: "Luxembourg City" },
  { country: "Madagascar", capital: "Antananarivo" },
  { country: "Malawi", capital: "Lilongwe" },
  { country: "Malaysia", capital: "Kuala Lumpur" },
  { country: "Maldives", capital: "Male" },
  { country: "Mali", capital: "Bamako" },
  { country: "Malta", capital: "Valletta" },
  { country: "Marshall Islands", capital: "Majuro" },
  { country: "Mauritania", capital: "Nouakchott" },
  { country: "Mauritius", capital: "Port Louis" },
  { country: "Mexico", capital: "Mexico City" },
  { country: "Micronesia", capital: "Palikir" },
  { country: "Moldova", capital: "Chisinau" },
  { country: "Monaco", capital: "Monaco" },
  { country: "Mongolia", capital: "Ulaanbaatar" },
  { country: "Montenegro", capital: "Podgorica" },
  { country: "Morocco", capital: "Rabat" },
  { country: "Mozambique", capital: "Maputo" },
  { country: "Myanmar", capital: "Naypyidaw" },
  { country: "Namibia", capital: "Windhoek" },
  { country: "Nepal", capital: "Kathmandu" },
  { country: "Netherlands", capital: "Amsterdam" },
  { country: "New Zealand", capital: "Wellington" },
  { country: "Nicaragua", capital: "Managua" },
  { country: "Niger", capital: "Niamey" },
  { country: "Nigeria", capital: "Abuja" },
  { country: "North Korea", capital: "Pyongyang" },
  { country: "North Macedonia", capital: "Skopje" },
  { country: "Norway", capital: "Oslo" },
  { country: "Oman", capital: "Muscat" },
  { country: "Pakistan", capital: "Islamabad" },
  { country: "Palau", capital: "Ngerulmud" },
  { country: "Panama", capital: "Panama City" },
  { country: "Papua New Guinea", capital: "Port Moresby" },
  { country: "Paraguay", capital: "Asuncion" },
  { country: "Peru", capital: "Lima" },
  { country: "Philippines", capital: "Manila" },
  { country: "Poland", capital: "Warsaw" },
  { country: "Portugal", capital: "Lisbon" },
  { country: "Qatar", capital: "Doha" },
  { country: "Romania", capital: "Bucharest" },
  { country: "Russia", capital: "Moscow" },
  { country: "Rwanda", capital: "Kigali" },
  { country: "Saint Kitts and Nevis", capital: "Basseterre" },
  { country: "Saint Lucia", capital: "Castries" },
  { country: "Saint Vincent and the Grenadines", capital: "Kingstown" },
  { country: "Samoa", capital: "Apia" },
  { country: "San Marino", capital: "San Marino" },
  { country: "Saudi Arabia", capital: "Riyadh" },
  { country: "Senegal", capital: "Dakar" },
  { country: "Serbia", capital: "Belgrade" },
  { country: "Seychelles", capital: "Victoria" },
  { country: "Sierra Leone", capital: "Freetown" },
  { country: "Singapore", capital: "Singapore" },
  { country: "Slovakia", capital: "Bratislava" },
  { country: "Slovenia", capital: "Ljubljana" },
  { country: "Solomon Islands", capital: "Honiara" },
  { country: "Somalia", capital: "Mogadishu" },
  { country: "South Africa", capital: "Pretoria" },
  { country: "South Korea", capital: "Seoul" },
  { country: "South Sudan", capital: "Juba" },
  { country: "Spain", capital: "Madrid" },
  { country: "Sri Lanka", capital: "Sri Jayawardenepura Kotte" },
  { country: "Sudan", capital: "Khartoum" },
  { country: "Suriname", capital: "Paramaribo" },
  { country: "Sweden", capital: "Stockholm" },
  { country: "Switzerland", capital: "Bern" },
  { country: "Syria", capital: "Damascus" },
  { country: "Taiwan", capital: "Taipei" },
  { country: "Tajikistan", capital: "Dushanbe" },
  { country: "Tanzania", capital: "Dodoma" },
  { country: "Thailand", capital: "Bangkok" },
  { country: "Togo", capital: "Lome" },
  { country: "Tonga", capital: "Nuku'alofa" },
  { country: "Trinidad and Tobago", capital: "Port of Spain" },
  { country: "Tunisia", capital: "Tunis" },
  { country: "Turkey", capital: "Ankara" },
  { country: "Turkmenistan", capital: "Ashgabat" },
  { country: "Tuvalu", capital: "Funafuti" },
  { country: "Uganda", capital: "Kampala" },
  { country: "Ukraine", capital: "Kyiv" },
  { country: "United Arab Emirates", capital: "Abu Dhabi" },
  { country: "United Kingdom", capital: "London" },
  { country: "United States", capital: "Washington, D.C." },
  { country: "Uruguay", capital: "Montevideo" },
  { country: "Uzbekistan", capital: "Tashkent" },
  { country: "Vanuatu", capital: "Port Vila" },
  { country: "Vatican City", capital: "Vatican City" },
  { country: "Venezuela", capital: "Caracas" },
  { country: "Vietnam", capital: "Hanoi" },
  { country: "Yemen", capital: "Sana'a" },
  { country: "Zambia", capital: "Lusaka" },
  { country: "Zimbabwe", capital: "Harare" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function QuizPage() {
  const [shuffled, setShuffled] = useState<typeof countries>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [quizSize, setQuizSize] = useState(20);

  const startQuiz = useCallback(() => {
    const shuffledList = shuffleArray(countries).slice(0, quizSize);
    setShuffled(shuffledList);
    setCurrentIndex(0);
    setAnswers({});
    setCurrentAnswer('');
    setIsStarted(true);
    setIsFinished(false);
  }, [quizSize]);

  const finishQuiz = () => {
    setAnswers(prev => ({ ...prev, [currentIndex]: currentAnswer.trim() }));
    setIsFinished(true);
  };

  const nextQuestion = () => {
    setAnswers(prev => ({ ...prev, [currentIndex]: currentAnswer.trim() }));
    setCurrentAnswer('');
    if (currentIndex >= shuffled.length - 1) {
      setIsFinished(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextQuestion();
    }
  };

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Capitals Quiz</h1>
          <p className="text-slate-400 text-lg mb-8">
            Test your knowledge of world capitals! You&apos;ll be shown a country name and need to type its capital.
            Results are checked case-insensitively so spelling counts more than capitalization.
          </p>
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
            <h3 className="text-white font-semibold mb-4">Instructions:</h3>
            <ul className="text-slate-400 text-left space-y-2">
              <li>You&apos;ll be shown a country name</li>
              <li>Type the capital of that country</li>
              <li>Press Enter or click Next to move on</li>
              <li>Results are checked case-insensitively</li>
              <li>At the end, you can see which ones you got right</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 mb-8 border border-slate-700">
            <label className="text-white font-semibold block mb-3">How many questions?</label>
            <div className="flex justify-center gap-3">
              {[10, 20, 30, 50, 100].map(n => (
                <button
                  key={n}
                  onClick={() => setQuizSize(n)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    quizSize === n
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="px-12 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xl rounded-lg transition-all duration-200 shadow-lg shadow-purple-600/25"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    let correct = 0;
    const results = shuffled.map((item, i) => {
      const userAnswer = normalize(answers[i] || '');
      const correctAnswer = normalize(item.capital);
      const isCorrect = userAnswer.length > 0 && (userAnswer === correctAnswer || correctAnswer.includes(userAnswer) || userAnswer.includes(correctAnswer));
      if (isCorrect) correct++;
      return { ...item, userAnswer: answers[i] || '', isCorrect };
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-2 text-center">Quiz Results</h2>
          <p className="text-slate-400 text-center mb-8">
            You got <span className="text-green-400 font-bold">{correct}</span> out of{' '}
            <span className="font-bold text-white">{shuffled.length}</span> correct
            ({Math.round((correct / shuffled.length) * 100)}%)
          </p>

          <div className="space-y-3 mb-8">
            {results.map((item, i) => (
              <div
                key={i}
                className={`rounded-lg p-4 border ${
                  item.isCorrect
                    ? 'bg-green-900/20 border-green-800/50'
                    : item.userAnswer
                    ? 'bg-red-900/20 border-red-800/50'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-slate-500 font-mono text-sm min-w-[2rem]">{i + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-bold">{item.country}</span>
                      {item.isCorrect ? (
                        <span className="text-green-400 text-sm">&#10003; Correct</span>
                      ) : (
                        <span className="text-red-400 text-sm">&#10007; Wrong</span>
                      )}
                    </div>
                    <div className="mt-1">
                      <span className="text-slate-400">Your answer: </span>
                      <span className={item.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {item.userAnswer || 'No answer'}
                      </span>
                      {!item.isCorrect && (
                        <span className="text-slate-500 ml-4">
                          Correct: <span className="text-emerald-400">{item.capital}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={startQuiz}
            className="w-full px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const current = shuffled[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-slate-400">Question {currentIndex + 1} / {shuffled.length}</span>
          <span className="text-slate-400">
            Answered: {Object.keys(answers).length} / {shuffled.length}
          </span>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-12 mb-6 border border-slate-700">
          <div className="text-center">
            <p className="text-slate-500 text-sm uppercase tracking-widest mb-4">What is the capital of</p>
            <h2 className="text-5xl font-bold text-white tracking-wide">{current.country}</h2>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type the capital..."
            className="w-full bg-transparent text-white text-2xl text-center placeholder-slate-600 outline-none py-4"
            autoFocus
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
            <span className="text-slate-500 text-sm">Press Enter for next</span>
            <div className="flex gap-3">
              {currentIndex === shuffled.length - 1 ? (
                <button
                  onClick={finishQuiz}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-all"
                >
                  Finish Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-all"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {shuffled.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-purple-500 w-4'
                  : answers[i] !== undefined
                  ? 'bg-green-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
