'use client';

interface Rank {
  rank: string;
  category: 'Soldier' | 'NCO' | 'JCO' | 'Officer';
  natoCode: string;
  stars: number;
  description: string;
  nextRank: string;
  payScale: string;
}

const ranks: Rank[] = [
  { rank: "Sepoy", category: "Soldier", natoCode: "OR-1", stars: 0, description: "The foundation of the army; basic soldiering duties.", nextRank: "Lance Naik", payScale: "BPS 7" },
  { rank: "Lance Naik", category: "NCO", natoCode: "OR-2", stars: 0, description: "Junior leader at the squad level.", nextRank: "Naik", payScale: "BPS 8" },
  { rank: "Naik", category: "NCO", natoCode: "OR-3", stars: 0, description: "NCO acting as a team leader.", nextRank: "Havildar", payScale: "BPS 9-10" },
  { rank: "Havildar", category: "NCO", natoCode: "OR-4", stars: 0, description: "Senior NCO in charge of a section.", nextRank: "Naib Subedar", payScale: "BPS 11-13" },
  { rank: "Naib Subedar", category: "JCO", natoCode: "OR-5", stars: 0, description: "Entry JCO; manages platoon logistics.", nextRank: "Subedar", payScale: "BPS 14" },
  { rank: "Subedar", category: "JCO", natoCode: "OR-6", stars: 0, description: "Oversees company administration.", nextRank: "Subedar Major", payScale: "BPS 15" },
  { rank: "Subedar Major", category: "JCO", natoCode: "OR-7", stars: 0, description: "Highest JCO rank; advisor to the unit CO.", nextRank: "Second Lieutenant", payScale: "BPS 16" },
  { rank: "Second Lieutenant", category: "Officer", natoCode: "OF-1", stars: 1, description: "Entry-level commissioned officer rank.", nextRank: "Lieutenant", payScale: "BPS 17" },
  { rank: "Lieutenant", category: "Officer", natoCode: "OF-1", stars: 1, description: "Commands a platoon of ~30-40 soldiers.", nextRank: "Captain", payScale: "BPS 17" },
  { rank: "Captain", category: "Officer", natoCode: "OF-2", stars: 2, description: "Commands a company of ~120 soldiers.", nextRank: "Major", payScale: "BPS 17" },
  { rank: "Major", category: "Officer", natoCode: "OF-3", stars: 3, description: "Battalion second-in-command or staff officer.", nextRank: "Lieutenant Colonel", payScale: "BPS 18" },
  { rank: "Lieutenant Colonel", category: "Officer", natoCode: "OF-4", stars: 4, description: "Commands a battalion of ~600-900 soldiers.", nextRank: "Colonel", payScale: "BPS 19" },
  { rank: "Colonel", category: "Officer", natoCode: "OF-5", stars: 5, description: "Senior field officer; brigade staff or garrison commander.", nextRank: "Brigadier", payScale: "BPS 20" },
  { rank: "Brigadier", category: "Officer", natoCode: "OF-6", stars: 6, description: "One-star; commands a brigade of ~3,000-5,000 troops.", nextRank: "Major General", payScale: "BPS 20" },
  { rank: "Major General", category: "Officer", natoCode: "OF-7", stars: 7, description: "Two-star; commands a division of ~10,000-20,000 troops.", nextRank: "Lieutenant General", payScale: "BPS 21" },
  { rank: "Lieutenant General", category: "Officer", natoCode: "OF-8", stars: 8, description: "Three-star; commands a corps of ~20,000-50,000 troops.", nextRank: "General", payScale: "BPS 22" },
  { rank: "General", category: "Officer", natoCode: "OF-9", stars: 9, description: "Four-star; Chief of Army Staff (COAS).", nextRank: "Field Marshal (Honorary)", payScale: "Apex" },
  { rank: "Field Marshal", category: "Officer", natoCode: "OF-10", stars: 10, description: "Five-star honorary rank; awarded for exceptional service. Held by Ayub Khan and Asim Munir.", nextRank: "None", payScale: "Honorary" },
];

const categoryColors: Record<string, string> = {
  Soldier: "text-slate-400 bg-slate-800/50 border-slate-700",
  NCO: "text-blue-400 bg-blue-900/20 border-blue-800/50",
  JCO: "text-purple-400 bg-purple-900/20 border-purple-800/50",
  Officer: "text-amber-400 bg-amber-900/20 border-amber-800/50",
};

export default function ArmyRanksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Pakistan Army Ranks</h1>
        <p className="text-slate-400 text-center mb-6">Complete rank hierarchy from Sepoy to Field Marshal</p>

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
            <p><span className="text-white font-semibold">Entry:</span> Join as Sepoy through army recruitment centers</p>
            <p><span className="text-white font-semibold">NCO Path:</span> Sepoy → Lance Naik → Naik → Havildar (promoted based on merit and service)</p>
            <p><span className="text-white font-semibold">JCO Path:</span> Havildar → Naib Subedar → Subedar → Subedar Major (from outstanding NCOs)</p>
            <p><span className="text-white font-semibold">Officer Path:</span> Commission through Pakistan Military Academy (PMA) → Second Lieutenant → Up to General</p>
            <p><span className="text-white font-semibold">Soldier to Officer:</span> Soldiers can apply for commission through PMA Long Course or In-Service Commission</p>
          </div>
        </div>
      </div>
    </div>
  );
}
