// Unified commissioned-officer ranks across Pakistan Army, Air Force and Navy.
// Equivalents follow the official inter-services chart published by PAF careers.
// Non-officer (OR/JCO/warrant) ranks are intentionally excluded.

export type ServiceKey = 'army' | 'airforce' | 'navy';

export type OfficerRankRow = {
  id: string;
  /** NATO OF code (approximate Commonwealth mapping). */
  natoCode: string;
  /** Star count used for ISSB memory cues (0 = junior / training). */
  stars: number;
  army: string;
  airforce: string;
  navy: string;
  /** Compact role cue shared across services at this grade. */
  cue: string;
  /** Optional note (e.g. honorary five-star). */
  note?: string;
};

/** Lowest → highest. Each row is one equivalent grade. */
export const officerRankRows: readonly OfficerRankRow[] = [
  {
    id: 'of1-entry',
    natoCode: 'OF-1',
    stars: 1,
    army: 'Second Lieutenant',
    airforce: 'Pilot Officer',
    navy: 'Midshipman',
    cue: 'Entry commissioned / training grade.',
  },
  {
    id: 'of1-junior',
    natoCode: 'OF-1',
    stars: 1,
    army: 'Lieutenant',
    airforce: 'Flying Officer',
    navy: 'Sub Lieutenant',
    cue: 'Junior officer; platoon / flight / watch team leadership.',
  },
  {
    id: 'of2',
    natoCode: 'OF-2',
    stars: 2,
    army: 'Captain',
    airforce: 'Flight Lieutenant',
    navy: 'Lieutenant',
    cue: 'Company / flight / department-level command.',
  },
  {
    id: 'of3',
    natoCode: 'OF-3',
    stars: 3,
    army: 'Major',
    airforce: 'Squadron Leader',
    navy: 'Lieutenant Commander',
    cue: 'Battalion 2IC / squadron / small-ship executive officer.',
  },
  {
    id: 'of4',
    natoCode: 'OF-4',
    stars: 4,
    army: 'Lieutenant Colonel',
    airforce: 'Wing Commander',
    navy: 'Commander',
    cue: 'Battalion / wing / frigate-level command.',
  },
  {
    id: 'of5',
    natoCode: 'OF-5',
    stars: 5,
    army: 'Colonel',
    airforce: 'Group Captain',
    navy: 'Captain',
    cue: 'Senior field / base / large-ship command.',
  },
  {
    id: 'of6',
    natoCode: 'OF-6',
    stars: 6,
    army: 'Brigadier',
    airforce: 'Air Commodore',
    navy: 'Commodore',
    cue: 'One-star; brigade / base / flotilla command.',
  },
  {
    id: 'of7',
    natoCode: 'OF-7',
    stars: 7,
    army: 'Major General',
    airforce: 'Air Vice Marshal',
    navy: 'Rear Admiral',
    cue: 'Two-star; division / air command / naval area.',
  },
  {
    id: 'of8',
    natoCode: 'OF-8',
    stars: 8,
    army: 'Lieutenant General',
    airforce: 'Air Marshal',
    navy: 'Vice Admiral',
    cue: 'Three-star; corps / senior air / deputy CNS level.',
  },
  {
    id: 'of9',
    natoCode: 'OF-9',
    stars: 9,
    army: 'General',
    airforce: 'Air Chief Marshal',
    navy: 'Admiral',
    cue: 'Four-star service chief (COAS / CAS / CNS).',
  },
  {
    id: 'of10',
    natoCode: 'OF-10',
    stars: 10,
    army: 'Field Marshal',
    airforce: 'Marshal of the Air Force',
    navy: 'Admiral of the Fleet',
    cue: 'Five-star honorary rank — exceptional / ceremonial.',
    note: 'Honorary. Not a routine promotion step.',
  },
];

export const serviceLabels: Record<ServiceKey, string> = {
  army: 'Pakistan Army',
  airforce: 'Pakistan Air Force',
  navy: 'Pakistan Navy',
};

export type RecallPrompt = {
  id: string;
  service: ServiceKey;
  promptRank: string;
  nextRank: string;
  equivalents: { army: string; airforce: string; navy: string };
  natoCode: string;
};

/** Build next-rank quiz prompts for every service name on each row (except the top). */
export function buildNextRankPrompts(): RecallPrompt[] {
  const prompts: RecallPrompt[] = [];
  for (let i = 0; i < officerRankRows.length - 1; i += 1) {
    const current = officerRankRows[i];
    const next = officerRankRows[i + 1];
    (['army', 'airforce', 'navy'] as const).forEach((service) => {
      prompts.push({
        id: `${current.id}-${service}`,
        service,
        promptRank: current[service],
        nextRank: next[service],
        equivalents: { army: next.army, airforce: next.airforce, navy: next.navy },
        natoCode: next.natoCode,
      });
    });
  }
  return prompts;
}

export const nextRankPrompts = buildNextRankPrompts();
