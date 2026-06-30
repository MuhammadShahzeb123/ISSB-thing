'use client';

interface Rank {
  rank: string;
  category: 'Sailor' | 'Petty Officer' | 'Officer';
  natoCode: string;
  stars: number;
  description: string;
  nextRank: string;
  payScale: string;
}

const ranks: Rank[] = [
  { rank: "Ordinary Seaman", category: "Sailor", natoCode: "OR-1", stars: 0, description: "Entry-level sailor; basic naval duties.", nextRank: "Able Seaman", payScale: "BPS 7" },
  { rank: "Able Seaman", category: "Sailor", natoCode: "OR-2", stars: 0, description: "Qualified sailor with operational experience.", nextRank: "Leading Seaman", payScale: "BPS 8" },
  { rank: "Leading Seaman", category: "Sailor", natoCode: "OR-3", stars: 0, description: "Team leader at section level.", nextRank: "Petty Officer", payScale: "BPS 9" },
  { rank: "Petty Officer", category: "Petty Officer", natoCode: "OR-4", stars: 0, description: "Senior enlisted; supervises departmental sections.", nextRank: "Chief Petty Officer", payScale: "BPS 10-11" },
  { rank: "Chief Petty Officer", category: "Petty Officer", natoCode: "OR-5", stars: 0, description: "Senior petty officer; manages divisions.", nextRank: "Fleet Chief Petty Officer", payScale: "BPS 12-13" },
  { rank: "Fleet Chief Petty Officer", category: "Petty Officer", natoCode: "OR-6", stars: 0, description: "Very senior enlisted; advisor to commanding officer.", nextRank: "Master Chief Petty Officer", payScale: "BPS 14" },
  { rank: "Master Chief Petty Officer", category: "Petty Officer", natoCode: "OR-7", stars: 0, description: "Highest enlisted rank; discipline and welfare of all sailors.", nextRank: "Midshipman", payScale: "BPS 15-16" },
  { rank: "Midshipman", category: "Officer", natoCode: "OF-8", stars: 1, description: "Entry-level officer in training at Pakistan Naval Academy.", nextRank: "Sub-Lieutenant", payScale: "BPS 17" },
  { rank: "Sub-Lieutenant", category: "Officer", natoCode: "OF-1", stars: 1, description: "Junior officer; leads watch teams.", nextRank: "Lieutenant", payScale: "BPS 17" },
  { rank: "Lieutenant", category: "Officer", natoCode: "OF-2", stars: 2, description: "Commands a ship section or department.", nextRank: "Lieutenant Commander", payScale: "BPS 17-18" },
  { rank: "Lieutenant Commander", category: "Officer", natoCode: "OF-3", stars: 3, description: "Executive officer of small ships or department head.", nextRank: "Commander", payScale: "BPS 18-19" },
  { rank: "Commander", category: "Officer", natoCode: "OF-4", stars: 4, description: "Commands frigates, destroyers, or shore establishments.", nextRank: "Captain", payScale: "BPS 19" },
  { rank: "Captain", category: "Officer", natoCode: "OF-5", stars: 5, description: "Commands large warships, submarine flotillas, or naval bases.", nextRank: "Commodore", payScale: "BPS 20" },
  { rank: "Commodore", category: "Officer", natoCode: "OF-6", stars: 6, description: "One-star; commands naval flotillas or task groups.", nextRank: "Rear Admiral", payScale: "BPS 20" },
  { rank: "Rear Admiral", category: "Officer", natoCode: "OF-7", stars: 7, description: "Two-star; commands naval areas or zones.", nextRank: "Vice Admiral", payScale: "BPS 21" },
  { rank: "Vice Admiral", category: "Officer", natoCode: "OF-8", stars: 8, description: "Three-star; deputy chief of naval staff.", nextRank: "Admiral", payScale: "BPS 22" },
  { rank: "Admiral", category: "Officer", natoCode: "OF-9", stars: 9, description: "Four-star; Chief of Naval Staff (CNS).", nextRank: "Admiral of the Fleet (Honorary)", payScale: "Apex" },
  { rank: "Admiral of the Fleet", category: "Officer", natoCode: "OF-10", stars: 10, description: "Five-star honorary rank; never awarded. Equivalent to Field Marshal in Army.", nextRank: "None", payScale: "Honorary" },
];

const categoryColors: Record<string, string> = {
  "Sailor": "text-cyan-400 bg-cyan-900/20 border-cyan-800/50",
  "Petty Officer": "text-blue-400 bg-blue-900/20 border-blue-800/50",
  "Officer": "text-amber-400 bg-amber-900/20 border-amber-800/50",
};

export default function NavyRanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Pakistan Navy Ranks</h1>
        <p className="text-slate-400 text-center mb-6">Complete rank hierarchy from Ordinary Seaman to Admiral of the Fleet</p>

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
            <p><span className="text-white font-semibold">Sailor Entry:</span> Join as Ordinary Seaman through PN recruitment</p>
            <p><span className="text-white font-semibold">Sailor Path:</span> Ordinary Seaman → Able Seaman → Leading Seaman → Up to Master Chief Petty Officer</p>
            <p><span className="text-white font-semibold">Officer Path:</span> Commission through Pakistan Naval Academy → Midshipman → Up to Admiral</p>
            <p><span className="text-white font-semibold">Key Training:</span> Pakistan Naval Academy (PNA) provides 1.5-year program for officer cadets</p>
            <p><span className="text-white font-semibold">Specializations:</span> Surface Warfare, Underwater Warfare, Electronic Warfare, Communications, Navigation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
