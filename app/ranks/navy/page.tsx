import RankStudyView, { type StudyRank } from '@/app/components/RankStudyView';

const ranks: StudyRank[] = [
  { rank: 'Ordinary Seaman', category: 'Sailor', natoCode: 'OR-1', stars: 0, description: 'Entry-level sailor; basic naval duties.', nextRank: 'Able Seaman', payScale: 'BPS 7' },
  { rank: 'Able Seaman', category: 'Sailor', natoCode: 'OR-2', stars: 0, description: 'Qualified sailor with operational experience.', nextRank: 'Leading Seaman', payScale: 'BPS 8' },
  { rank: 'Leading Seaman', category: 'Sailor', natoCode: 'OR-3', stars: 0, description: 'Team leader at section level.', nextRank: 'Petty Officer', payScale: 'BPS 9' },
  { rank: 'Petty Officer', category: 'Petty Officer', natoCode: 'OR-4', stars: 0, description: 'Senior enlisted; supervises departmental sections.', nextRank: 'Chief Petty Officer', payScale: 'BPS 10-11' },
  { rank: 'Chief Petty Officer', category: 'Petty Officer', natoCode: 'OR-5', stars: 0, description: 'Senior petty officer; manages divisions.', nextRank: 'Fleet Chief Petty Officer', payScale: 'BPS 12-13' },
  { rank: 'Fleet Chief Petty Officer', category: 'Petty Officer', natoCode: 'OR-6', stars: 0, description: 'Very senior enlisted; advisor to commanding officer.', nextRank: 'Master Chief Petty Officer', payScale: 'BPS 14' },
  { rank: 'Master Chief Petty Officer', category: 'Petty Officer', natoCode: 'OR-7', stars: 0, description: 'Highest enlisted rank; discipline and welfare of all sailors.', nextRank: 'Midshipman', payScale: 'BPS 15-16' },
  { rank: 'Midshipman', category: 'Officer', natoCode: 'OF-8', stars: 1, description: 'Entry-level officer in training at Pakistan Naval Academy.', nextRank: 'Sub-Lieutenant', payScale: 'BPS 17' },
  { rank: 'Sub-Lieutenant', category: 'Officer', natoCode: 'OF-1', stars: 1, description: 'Junior officer; leads watch teams.', nextRank: 'Lieutenant', payScale: 'BPS 17' },
  { rank: 'Lieutenant', category: 'Officer', natoCode: 'OF-2', stars: 2, description: 'Commands a ship section or department.', nextRank: 'Lieutenant Commander', payScale: 'BPS 17-18' },
  { rank: 'Lieutenant Commander', category: 'Officer', natoCode: 'OF-3', stars: 3, description: 'Executive officer of small ships or department head.', nextRank: 'Commander', payScale: 'BPS 18-19' },
  { rank: 'Commander', category: 'Officer', natoCode: 'OF-4', stars: 4, description: 'Commands frigates, destroyers, or shore establishments.', nextRank: 'Captain', payScale: 'BPS 19' },
  { rank: 'Captain', category: 'Officer', natoCode: 'OF-5', stars: 5, description: 'Commands large warships, submarine flotillas, or naval bases.', nextRank: 'Commodore', payScale: 'BPS 20' },
  { rank: 'Commodore', category: 'Officer', natoCode: 'OF-6', stars: 6, description: 'One-star; commands naval flotillas or task groups.', nextRank: 'Rear Admiral', payScale: 'BPS 20' },
  { rank: 'Rear Admiral', category: 'Officer', natoCode: 'OF-7', stars: 7, description: 'Two-star; commands naval areas or zones.', nextRank: 'Vice Admiral', payScale: 'BPS 21' },
  { rank: 'Vice Admiral', category: 'Officer', natoCode: 'OF-8', stars: 8, description: 'Three-star; deputy chief of naval staff.', nextRank: 'Admiral', payScale: 'BPS 22' },
  { rank: 'Admiral', category: 'Officer', natoCode: 'OF-9', stars: 9, description: 'Four-star; Chief of Naval Staff (CNS).', nextRank: 'Admiral of the Fleet (Honorary)', payScale: 'Apex' },
  { rank: 'Admiral of the Fleet', category: 'Officer', natoCode: 'OF-10', stars: 10, description: 'Five-star honorary rank; equivalent to Field Marshal in the Army.', nextRank: 'None', payScale: 'Honorary' },
];

export default function NavyRanksPage() {
  return (
    <RankStudyView
      title="Pakistan Navy Ranks"
      subtitle="Build a mental ladder from Ordinary Seaman to Admiral with retrieval prompts and scheduled rechecks."
      ranks={ranks}
      categoryColors={{
        Sailor: 'text-cyan-400 bg-cyan-900/20 border-cyan-800/50',
        'Petty Officer': 'text-blue-400 bg-blue-900/20 border-blue-800/50',
        Officer: 'text-amber-400 bg-amber-900/20 border-amber-800/50',
      }}
      pathNotes={[
        'Group the sailor, petty-officer, and officer sections before memorising individual names.',
        'After revealing a card, name both the next rank and the rank category.',
        'Use Again for a weak link, Hard for a slow recall, and Easy only for instant recall.',
        'Return to the full hierarchy occasionally to practise the transitions between groups.',
      ]}
    />
  );
}
