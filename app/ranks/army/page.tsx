import RankStudyView, { type StudyRank } from '@/app/components/RankStudyView';

const ranks: StudyRank[] = [
  { rank: 'Sepoy', category: 'Soldier', natoCode: 'OR-1', stars: 0, description: 'The foundation of the army; basic soldiering duties.', nextRank: 'Lance Naik', payScale: 'BPS 7' },
  { rank: 'Lance Naik', category: 'NCO', natoCode: 'OR-2', stars: 0, description: 'Junior leader at the squad level.', nextRank: 'Naik', payScale: 'BPS 8' },
  { rank: 'Naik', category: 'NCO', natoCode: 'OR-3', stars: 0, description: 'NCO acting as a team leader.', nextRank: 'Havildar', payScale: 'BPS 9-10' },
  { rank: 'Havildar', category: 'NCO', natoCode: 'OR-4', stars: 0, description: 'Senior NCO in charge of a section.', nextRank: 'Naib Subedar', payScale: 'BPS 11-13' },
  { rank: 'Naib Subedar', category: 'JCO', natoCode: 'OR-5', stars: 0, description: 'Entry JCO; manages platoon logistics.', nextRank: 'Subedar', payScale: 'BPS 14' },
  { rank: 'Subedar', category: 'JCO', natoCode: 'OR-6', stars: 0, description: 'Oversees company administration.', nextRank: 'Subedar Major', payScale: 'BPS 15' },
  { rank: 'Subedar Major', category: 'JCO', natoCode: 'OR-7', stars: 0, description: 'Highest JCO rank; advisor to the unit CO.', nextRank: 'Second Lieutenant', payScale: 'BPS 16' },
  { rank: 'Second Lieutenant', category: 'Officer', natoCode: 'OF-1', stars: 1, description: 'Entry-level commissioned officer rank.', nextRank: 'Lieutenant', payScale: 'BPS 17' },
  { rank: 'Lieutenant', category: 'Officer', natoCode: 'OF-1', stars: 1, description: 'Commands a platoon of approximately 30-40 soldiers.', nextRank: 'Captain', payScale: 'BPS 17' },
  { rank: 'Captain', category: 'Officer', natoCode: 'OF-2', stars: 2, description: 'Commands a company of approximately 120 soldiers.', nextRank: 'Major', payScale: 'BPS 17' },
  { rank: 'Major', category: 'Officer', natoCode: 'OF-3', stars: 3, description: 'Battalion second-in-command or staff officer.', nextRank: 'Lieutenant Colonel', payScale: 'BPS 18' },
  { rank: 'Lieutenant Colonel', category: 'Officer', natoCode: 'OF-4', stars: 4, description: 'Commands a battalion of approximately 600-900 soldiers.', nextRank: 'Colonel', payScale: 'BPS 19' },
  { rank: 'Colonel', category: 'Officer', natoCode: 'OF-5', stars: 5, description: 'Senior field officer; brigade staff or garrison commander.', nextRank: 'Brigadier', payScale: 'BPS 20' },
  { rank: 'Brigadier', category: 'Officer', natoCode: 'OF-6', stars: 6, description: 'One-star; commands a brigade of approximately 3,000-5,000 troops.', nextRank: 'Major General', payScale: 'BPS 20' },
  { rank: 'Major General', category: 'Officer', natoCode: 'OF-7', stars: 7, description: 'Two-star; commands a division of approximately 10,000-20,000 troops.', nextRank: 'Lieutenant General', payScale: 'BPS 21' },
  { rank: 'Lieutenant General', category: 'Officer', natoCode: 'OF-8', stars: 8, description: 'Three-star; commands a corps of approximately 20,000-50,000 troops.', nextRank: 'General', payScale: 'BPS 22' },
  { rank: 'General', category: 'Officer', natoCode: 'OF-9', stars: 9, description: 'Four-star; Chief of Army Staff (COAS).', nextRank: 'Field Marshal (Honorary)', payScale: 'Apex' },
  { rank: 'Field Marshal', category: 'Officer', natoCode: 'OF-10', stars: 10, description: 'Five-star honorary rank; awarded for exceptional service.', nextRank: 'None', payScale: 'Honorary' },
];

export default function ArmyRanksPage() {
  return (
    <RankStudyView
      title="Pakistan Army Ranks"
      subtitle="Learn the sequence from Sepoy to Field Marshal with active recall, spaced review, and a full hierarchy view."
      ranks={ranks}
      categoryColors={{
        Soldier: 'text-slate-400 bg-slate-800/50 border-slate-700',
        NCO: 'text-blue-400 bg-blue-900/20 border-blue-800/50',
        JCO: 'text-purple-400 bg-purple-900/20 border-purple-800/50',
        Officer: 'text-amber-400 bg-amber-900/20 border-amber-800/50',
      }}
      pathNotes={[
        'Say the next rank aloud before revealing the card.',
        'Review difficult ranks again tomorrow and easy ranks after four days.',
        'Use the full hierarchy to connect each rank to its category and NATO code.',
        'Mix rank order with short general-knowledge sessions so recall transfers beyond one list.',
      ]}
    />
  );
}
