'use client';

interface Rank {
  rank: string;
  category: 'Airman/Airwoman' | 'Warrant Officer' | 'Officer';
  natoCode: string;
  stars: number;
  description: string;
  nextRank: string;
  payScale: string;
}

const ranks: Rank[] = [
  { rank: "Aircraftman", category: "Airman/Airwoman", natoCode: "OR-1", stars: 0, description: "Entry-level enlisted personnel; basic air force duties.", nextRank: "Leading Aircraftman", payScale: "BPS 7" },
  { rank: "Leading Aircraftman", category: "Airman/Airwoman", natoCode: "OR-2", stars: 0, description: "Junior technician with basic technical skills.", nextRank: "Senior Aircraftman", payScale: "BPS 8" },
  { rank: "Senior Aircraftman", category: "Airman/Airwoman", natoCode: "OR-3", stars: 0, description: "Experienced technician with specialized skills.", nextRank: "Junior Technician", payScale: "BPS 9" },
  { rank: "Junior Technician", category: "Airman/Airwoman", natoCode: "OR-4", stars: 0, description: "Qualified technical specialist in their trade.", nextRank: "Corporal Technician", payScale: "BPS 10" },
  { rank: "Corporal Technician", category: "Airman/Airwoman", natoCode: "OR-5", stars: 0, description: "Team leader managing small technical teams.", nextRank: "Senior Technician", payScale: "BPS 11" },
  { rank: "Senior Technician", category: "Airman/Airwoman", natoCode: "OR-6", stars: 0, description: "Senior technical expert supervising work centers.", nextRank: "Assistant Warrant Officer", payScale: "BPS 12-13" },
  { rank: "Assistant Warrant Officer", category: "Warrant Officer", natoCode: "OR-7", stars: 0, description: "Entry-level warrant officer; station-level responsibilities.", nextRank: "Warrant Officer", payScale: "BPS 14" },
  { rank: "Warrant Officer", category: "Warrant Officer", natoCode: "OR-8", stars: 0, description: "Senior warrant officer; discipline and welfare of all airmen.", nextRank: "Chief Warrant Officer", payScale: "BPS 15" },
  { rank: "Chief Warrant Officer", category: "Warrant Officer", natoCode: "OR-9", stars: 0, description: "Highest enlisted rank; advisor to base commander.", nextRank: "Officer Cadet", payScale: "BPS 16" },
  { rank: "Officer Cadet", category: "Officer", natoCode: "OC", stars: 0, description: "Training phase at PAF Academy Risalpur before commissioning.", nextRank: "Pilot Officer", payScale: "Training" },
  { rank: "Pilot Officer", category: "Officer", natoCode: "OF-1", stars: 1, description: "Entry-level commissioned officer.", nextRank: "Flying Officer", payScale: "BPS 17" },
  { rank: "Flying Officer", category: "Officer", natoCode: "OF-2", stars: 1, description: "Junior officer; leads flights or sections.", nextRank: "Flight Lieutenant", payScale: "BPS 17" },
  { rank: "Flight Lieutenant", category: "Officer", natoCode: "OF-3", stars: 2, description: "Commands a flight of ~15-30 personnel.", nextRank: "Squadron Leader", payScale: "BPS 17-18" },
  { rank: "Squadron Leader", category: "Officer", natoCode: "OF-4", stars: 3, description: "Commands a squadron or serves as staff officer.", nextRank: "Wing Commander", payScale: "BPS 18-19" },
  { rank: "Wing Commander", category: "Officer", natoCode: "OF-5", stars: 4, description: "Commands a wing; senior operational commander.", nextRank: "Group Captain", payScale: "BPS 19" },
  { rank: "Group Captain", category: "Officer", natoCode: "OF-6", stars: 5, description: "Commands a base or large operational unit.", nextRank: "Air Commodore", payScale: "BPS 19-20" },
  { rank: "Air Commodore", category: "Officer", natoCode: "OF-7", stars: 6, description: "One-star; commands an overall PAF base.", nextRank: "Air Vice Marshal", payScale: "BPS 20" },
  { rank: "Air Vice Marshal", category: "Officer", natoCode: "OF-8", stars: 7, description: "Two-star; commands one of the three PAF zones.", nextRank: "Air Marshal", payScale: "BPS 20" },
  { rank: "Air Marshal", category: "Officer", natoCode: "OF-9", stars: 8, description: "Three-star; senior position, typically fighter pilots.", nextRank: "Air Chief Marshal", payScale: "BPS 21" },
  { rank: "Air Chief Marshal", category: "Officer", natoCode: "OF-10", stars: 9, description: "Four-star; Chief of the Air Staff (CAS).", nextRank: "Marshal of the Air Force (Honorary)", payScale: "Apex" },
  { rank: "Marshal of the Air Force", category: "Officer", natoCode: "OF-11", stars: 10, description: "Five-star honorary rank; never awarded. Equivalent to Field Marshal in Army.", nextRank: "None", payScale: "Honorary" },
];

const categoryColors: Record<string, string> = {
  "Airman/Airwoman": "text-cyan-400 bg-cyan-900/20 border-cyan-800/50",
  "Warrant Officer": "text-blue-400 bg-blue-900/20 border-blue-800/50",
  "Officer": "text-amber-400 bg-amber-900/20 border-amber-800/50",
};

export default function AirForceRanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Pakistan Air Force Ranks</h1>
        <p className="text-slate-400 text-center mb-6">Complete rank hierarchy from Aircraftman to Marshal of the Air Force</p>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(categoryColors).map(([cat, colors]) => (
            <span key={cat} className={`px-3 py-1 rounded-full text-sm font-semibold border ${colors}`}>
              {cat}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          {ranks.map((rank, i) => (
            <div
              key={rank.rank}
              className={`rounded-xl p-5 border transition-all hover:scale-[1.01] ${
                categoryColors[rank.category]
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-2xl font-bold text-slate-500 font-mono min-w-[2.5rem] text-right">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-white">{rank.rank}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                        {rank.natoCode}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400">
                        {rank.payScale}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{rank.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:min-w-[200px]">
                  <span className="text-slate-500 text-sm">Next:</span>
                  <span className="text-emerald-400 text-sm font-semibold">
                    {rank.nextRank === "None" ? "—" : rank.nextRank}
                  </span>
                </div>
              </div>

              {i < ranks.length - 1 && (
                <div className="flex justify-center mt-3">
                  <div className="text-slate-600 text-lg">↓</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Career Progression Path</h2>
          <div className="text-slate-400 space-y-2 text-sm">
            <p><span className="text-white font-semibold">Enlisted Entry:</span> Join as Aircraftman through PAF recruitment</p>
            <p><span className="text-white font-semibold">Airmen Path:</span> Aircraftman → Leading Aircraftman → Senior Aircraftman → Up to Chief Warrant Officer</p>
            <p><span className="text-white font-semibold">Officer Path:</span> Commission through PAF Academy Risalpur → Pilot Officer → Up to Air Chief Marshal</p>
            <p><span className="text-white font-semibold">Key Training:</span> PAF Academy Risalpur provides academic, military, and flying training</p>
            <p><span className="text-white font-semibold">Turkish Influence:</span> PAF adopted Turkish-style rank insignia in 2006</p>
          </div>
        </div>
      </div>
    </div>
  );
}
