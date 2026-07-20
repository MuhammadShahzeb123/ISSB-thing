import RankStudyView, { type StudyRank } from '@/app/components/RankStudyView';

const ranks: StudyRank[] = [
  { rank: 'Aircraftman', category: 'Airman/Airwoman', natoCode: 'OR-1', stars: 0, description: 'Entry-level enlisted personnel; basic air force duties.', nextRank: 'Leading Aircraftman', payScale: 'BPS 7' },
  { rank: 'Leading Aircraftman', category: 'Airman/Airwoman', natoCode: 'OR-2', stars: 0, description: 'Junior technician with basic technical skills.', nextRank: 'Senior Aircraftman', payScale: 'BPS 8' },
  { rank: 'Senior Aircraftman', category: 'Airman/Airwoman', natoCode: 'OR-3', stars: 0, description: 'Experienced technician with specialized skills.', nextRank: 'Junior Technician', payScale: 'BPS 9' },
  { rank: 'Junior Technician', category: 'Airman/Airwoman', natoCode: 'OR-4', stars: 0, description: 'Qualified technical specialist in their trade.', nextRank: 'Corporal Technician', payScale: 'BPS 10' },
  { rank: 'Corporal Technician', category: 'Airman/Airwoman', natoCode: 'OR-5', stars: 0, description: 'Team leader managing small technical teams.', nextRank: 'Senior Technician', payScale: 'BPS 11' },
  { rank: 'Senior Technician', category: 'Airman/Airwoman', natoCode: 'OR-6', stars: 0, description: 'Senior technical expert supervising work centers.', nextRank: 'Assistant Warrant Officer', payScale: 'BPS 12-13' },
  { rank: 'Assistant Warrant Officer', category: 'Warrant Officer', natoCode: 'OR-7', stars: 0, description: 'Entry-level warrant officer; station-level responsibilities.', nextRank: 'Warrant Officer', payScale: 'BPS 14' },
  { rank: 'Warrant Officer', category: 'Warrant Officer', natoCode: 'OR-8', stars: 0, description: 'Senior warrant officer; discipline and welfare of all airmen.', nextRank: 'Chief Warrant Officer', payScale: 'BPS 15' },
  { rank: 'Chief Warrant Officer', category: 'Warrant Officer', natoCode: 'OR-9', stars: 0, description: 'Highest enlisted rank; advisor to base commander.', nextRank: 'Officer Cadet', payScale: 'BPS 16' },
  { rank: 'Officer Cadet', category: 'Officer', natoCode: 'OC', stars: 0, description: 'Training phase at PAF Academy Risalpur before commissioning.', nextRank: 'Pilot Officer', payScale: 'Training' },
  { rank: 'Pilot Officer', category: 'Officer', natoCode: 'OF-1', stars: 1, description: 'Entry-level commissioned officer.', nextRank: 'Flying Officer', payScale: 'BPS 17' },
  { rank: 'Flying Officer', category: 'Officer', natoCode: 'OF-2', stars: 1, description: 'Junior officer; leads flights or sections.', nextRank: 'Flight Lieutenant', payScale: 'BPS 17' },
  { rank: 'Flight Lieutenant', category: 'Officer', natoCode: 'OF-3', stars: 2, description: 'Commands a flight of approximately 15-30 personnel.', nextRank: 'Squadron Leader', payScale: 'BPS 17-18' },
  { rank: 'Squadron Leader', category: 'Officer', natoCode: 'OF-4', stars: 3, description: 'Commands a squadron or serves as staff officer.', nextRank: 'Wing Commander', payScale: 'BPS 18-19' },
  { rank: 'Wing Commander', category: 'Officer', natoCode: 'OF-5', stars: 4, description: 'Commands a wing; senior operational commander.', nextRank: 'Group Captain', payScale: 'BPS 19' },
  { rank: 'Group Captain', category: 'Officer', natoCode: 'OF-6', stars: 5, description: 'Commands a base or large operational unit.', nextRank: 'Air Commodore', payScale: 'BPS 19-20' },
  { rank: 'Air Commodore', category: 'Officer', natoCode: 'OF-7', stars: 6, description: 'One-star; commands an overall PAF base.', nextRank: 'Air Vice Marshal', payScale: 'BPS 20' },
  { rank: 'Air Vice Marshal', category: 'Officer', natoCode: 'OF-8', stars: 7, description: 'Two-star; commands one of the three PAF zones.', nextRank: 'Air Marshal', payScale: 'BPS 20' },
  { rank: 'Air Marshal', category: 'Officer', natoCode: 'OF-9', stars: 8, description: 'Three-star; senior position, typically fighter pilots.', nextRank: 'Air Chief Marshal', payScale: 'BPS 21' },
  { rank: 'Air Chief Marshal', category: 'Officer', natoCode: 'OF-10', stars: 9, description: 'Four-star; Chief of the Air Staff (CAS).', nextRank: 'Marshal of the Air Force (Honorary)', payScale: 'Apex' },
  { rank: 'Marshal of the Air Force', category: 'Officer', natoCode: 'OF-11', stars: 10, description: 'Five-star honorary rank; equivalent to Field Marshal in the Army.', nextRank: 'None', payScale: 'Honorary' },
];

export default function AirForceRanksPage() {
  return (
    <RankStudyView
      title="Pakistan Air Force Ranks"
      subtitle="Use interleaved recall to connect airmen, warrant officers, and commissioned ranks from Aircraftman to Air Chief Marshal."
      ranks={ranks}
      categoryColors={{
        'Airman/Airwoman': 'text-cyan-400 bg-cyan-900/20 border-cyan-800/50',
        'Warrant Officer': 'text-blue-400 bg-blue-900/20 border-blue-800/50',
        Officer: 'text-amber-400 bg-amber-900/20 border-amber-800/50',
      }}
      pathNotes={[
        'Learn the three broad groups first, then retrieve the next link in each sequence.',
        'Say the commission transition out loud: Officer Cadet to Pilot Officer.',
        'Use scheduled review instead of rereading the full page each day.',
        'Mix this deck with Army and Navy cards to practise discrimination between similar ladders.',
      ]}
    />
  );
}
