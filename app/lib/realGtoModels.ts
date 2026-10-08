/**
 * Group planning problems taken from real GTO model slides the user bought.
 * Every fact here comes from the slides (shape text, the map and the speaker
 * notes). Where a slide is silent or unclear we say so in `notGiven` instead
 * of guessing. Our own working is kept apart in `reference` and labelled.
 *
 * Shared by the GTO page and by /api/planning-assessment, which looks a
 * problem up by id so the browser cannot change what Gemma is told.
 */

export interface RealGtoRow {
  label: string;
  detail: string;
}

export interface RealGtoModel {
  id: string;
  title: string;
  /** Title exactly as printed on the slide. */
  slideTitle: string;
  teaser: string;
  timeNow: string;
  finishBy: string;
  planningMinutes: number;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  /** True when the slides carry a written story; false when only map + notes exist. */
  hasWrittenStory: boolean;
  story: string[];
  /** GTO speaker notes, copied character for character. */
  slideNotesVerbatim: string;
  slideNotesReading: string[];
  modelKey: RealGtoRow[];
  numbers: { intro: string; rows: RealGtoRow[] };
  speedsAndTimes: RealGtoRow[];
  resources: string[];
  limitations: string[];
  tasks: string[];
  notGiven: string[];
  reference: { title: string; caveat: string; points: string[] };
}

export const realGtoGuide = {
  title: 'How to solve a group planning task',
  deckTitle: 'Group Planning',
  qualities: [
    'Thinking ability',
    'Motivation level',
    'Ability to guide others',
    'Comprehension',
    'Problem solution',
    'Utilizing mind',
    'Responsibility',
  ],
  procedure: [
    'GTO brief',
    'Story',
    'Essential details of the model, limitations',
    'Situation / problem',
    'Solution keeping in view the briefing',
  ],
  howTo: [
    'Comprehend the situation',
    'Required / solution',
    'Speed',
    'Details about services',
    'Transport, heli, bus, aeroplane, hospitals, police station',
    'Facilities available, troops',
    'Calculation keeping in view the limits, time',
    'S = VT (distance = speed × time)',
  ],
};

export const realGtoModels: RealGtoModel[] = [
  {
    id: 'hiking-track-injury',
    title: 'Hiking track injury',
    slideTitle: 'HIKING TRACK _INJURY',
    teaser: 'A friend is hurt on hilltop A at 8 am. Get him to a dispensary before sunset at 6 pm. No signal, no transport.',
    timeNow: '08:00',
    finishBy: '18:00 (sunset)',
    planningMinutes: 15,
    image: '/images/gto/real-models/gto-hiking-track-injury.webp',
    imageWidth: 2400,
    imageHeight: 1661,
    imageAlt: 'Hiking track model. Lake L top left with a boat. River E runs east to west into the lake, with a raft at marker 8 and marker 28 at the lake end. Desert J in the middle. Hill A in the centre right with three markers of 2. Mountain C on the left with a dispensary at marker 22, and markers 19, 14 and 18. Mountain B at the bottom with markers 5, 7, 9 and 11. Forest F of trees and mountain D on the right with markers 17 and 25 and a dispensary. A yellow arrow at the top points north.',
    hasWrittenStory: true,
    story: [
      'This model shows an area where nobody lives. It is famous for hiking and trekking.',
      'A group of college students started trekking early in the morning and reached the hilltop at A at 8 am. Their plan is to stay for 3 days at the hilltop resort.',
      'They were tired when they arrived, so they ordered snacks and started playing. Unfortunately, one boy fell from the rocky cliff into a ditch and was injured.',
      'You are his friend. You have to take him quickly to a nearby dispensary for treatment and an injection of tetanus before sunset (6 pm) to avoid infection.',
      'The transport which dropped the group at the base camp has left, and there is no mobile signal in this area.',
    ],
    slideNotesVerbatim: '8am injured---first aid 6pm',
    slideNotesReading: ['Injured at 8 am. First aid (treatment and the tetanus injection) must happen by 6 pm.'],
    modelKey: [
      { label: 'North', detail: 'The slide text says a round compass on the right side has a red needle pointing north. On the map itself north is the yellow arrow at the top right, pointing up.' },
      { label: 'Colours', detail: 'Blue is water. Green is forest. Brown is desert. A red cross is a dispensary.' },
      { label: 'Tracks', detail: 'Dotted black line: track on plain ground. Brown (orange) line: track on hilly ground.' },
      { label: 'A, B, C, D', detail: 'Trekking spots famous with tourists. On top of each is a small resort for night stay, refreshments and picnic. The group is on top of A.' },
      { label: 'E', detail: 'A river flowing from east to west, into lake L. Rafts are available on rent here (the raft picture next to marker 8).' },
      { label: 'L', detail: 'A lake at the top left. It can be crossed by boat in 1 hour. Famous for paragliding, picnic and swimming. A boat is drawn on it.' },
      { label: 'J', detail: 'A desert in the middle. No tracks are visible. A sandstorm is predicted every afternoon for half an hour.' },
      { label: 'F', detail: 'The forest (trees) between A and D. The slide text does not mention F. In the original slide the letter is partly hidden behind a tree, so it can look like an E.' },
      { label: 'Dispensaries', detail: 'Two red crosses: one beside C, next to marker 22, and one beside D, next to marker 25.' },
    ],
    numbers: {
      intro: 'The slide does not say what the yellow numbers mean and gives no unit. They read as running distances in km, counted from A along each track (they add up the same way on every route). This is exactly where each one sits:',
      rows: [
        { label: '2, 2, 2 (on A)', detail: 'One where each brown hill track leaves A: at the top (towards river E), on the left (towards desert J) and at the bottom (towards B).' },
        { label: '8', detail: 'At the raft point on river E, where the dotted track from the top of A reaches the river.' },
        { label: '28', detail: 'At the west end of river E, where it meets lake L.' },
        { label: '17', detail: 'At the top of D, where the dotted track from the raft point arrives after looping east and then south.' },
        { label: '25', detail: 'At the bottom of D, next to D\u2019s dispensary.' },
        { label: '5, 7, 9, 11', detail: 'Along B\u2019s brown track, from its east end (5, where the dotted track from the bottom of A arrives) to its west end (11).' },
        { label: '14, 19, 22', detail: 'Along C\u2019s brown track, from the bottom (14, where the dotted track from B\u2019s west end arrives) up to 22, next to C\u2019s dispensary.' },
        { label: '18', detail: 'At the top of C\u2019s track, at the top left corner of desert J, just below lake L.' },
      ],
    },
    speedsAndTimes: [
      { label: 'Plain tracks (dotted)', detail: '3 km/h' },
      { label: 'Hilly tracks (brown)', detail: '2 km/h' },
      { label: 'Desert J', detail: '2 km/h. No tracks. Sandstorm every afternoon for half an hour.' },
      { label: 'Raft on river E', detail: '10 km/h along the river (with the current, east to west). 3 km/h against it.' },
      { label: 'Boat on lake L', detail: 'Crosses the lake in 1 hour.' },
      { label: 'Deadline', detail: 'Injured at 8 am. Treatment and tetanus injection before sunset, 6 pm. That is 10 hours.' },
    ],
    resources: [
      'Your friends in the college group, at A.',
      'The small resort on top of A (and on B, C and D): night stay, refreshments, picnic.',
      'Rafts on rent at river E.',
      'Boats on lake L.',
      'Dispensaries at C (marker 22) and D (marker 25).',
    ],
    limitations: [
      'No mobile signal. You cannot call anyone.',
      'The transport that dropped the group at the base camp has left.',
      'The boy is injured. The slide does not say how badly or whether he can walk.',
      'Desert J has no tracks and a daily afternoon sandstorm of half an hour.',
      'He must reach a dispensary before 6 pm.',
    ],
    tasks: [
      'Give first aid at A and decide how to move the injured boy.',
      'Choose the route to a dispensary that gets him there before 6 pm. Work out every leg as distance ÷ speed and write the clock time at each point.',
      'Compare at least two routes and say why yours is best. Give a backup if your first route fails.',
      'Say who goes with him and what the rest of the group does.',
    ],
    notGiven: [
      'The unit of the yellow numbers is not written. They read as km counted from A.',
      'The text mentions a round compass with a red needle, but the map shows a yellow north arrow instead.',
      'Where the lake boat starts and lands is not marked. The river meets the lake at 28, and C\u2019s track starts at the lake shore near 18.',
      'No time is given for hiring a raft or changing from raft to boat.',
      'There is no track and no distance through forest F.',
      'How serious the injury is, and whether he can walk.',
    ],
    reference: {
      title: 'Our working from the slide numbers',
      caveat: 'This is not printed on the slides. It treats the yellow numbers as km counted from A, and assumes the lake boat takes him from the river mouth (28) across to the top of C\u2019s track (18). Changeover times are not given, so keep a margin.',
      points: [
        'Best: river and lake to C. A to the top exit, 2 km hilly = 1 h (9:00). Dotted track 2 to 8, 6 km plain = 2 h (11:00). Raft 8 to 28, 20 km with the current at 10 km/h = 2 h (13:00). Boat across lake L = 1 h (14:00). C track 18 to 22, 4 km hilly = 2 h (16:00). About 2 hours spare, and he rides on the raft and boat for 3 of the 8 hours instead of being carried.',
        'Via B to C: 1 h (A) + 1 h (2 to 5, 3 km plain) + 3 h (5 to 11, 6 km hilly) + 1 h (11 to 14, 3 km plain) + 4 h (14 to 22, 8 km hilly) = 10 h. Arrives exactly 6 pm with no margin, carrying him over two hills.',
        'Via E to D: 1 h (A) + 2 h (2 to 8) + 3 h (8 to 17, 9 km plain) + 4 h (17 to 25, 8 km hilly) = 10 h. Arrives exactly 6 pm with no margin.',
        'Across desert J to C: 1 h (A) + 8 h (2 to 18, 16 km at 2 km/h) + 0.5 h sandstorm + 2 h (18 to 22) = 11.5 h. Arrives about 7:30 pm. Too late, and there are no tracks to follow.',
        'Forest F has no track or distance, so it cannot be planned.',
        'Order: first aid at A straight away, then leave on the river and lake route with the fittest friends taking turns to help him. The rest stay together at the A resort. Backup: if no raft is available at E, carry on along the dotted track to D, which only just makes 6 pm.',
      ],
    },
  },
  {
    id: 'prison-break',
    title: 'Prison break',
    slideTitle: 'PRISON BREAK',
    teaser: 'An island prison, a shore point A with boats, jeeps, a bus and a hospital, and a Police HQ 100 down the road. Start 8 am, finish 5:30 pm.',
    timeNow: '08:00',
    finishBy: '17:30',
    planningMinutes: 15,
    image: '/images/gto/real-models/gto-prison-break.webp',
    imageWidth: 2400,
    imageHeight: 1736,
    imageAlt: 'Prison break model. A fort on an island in the sea in the centre. Point A on the shore south east of the island with a rowing boat, a motor boat, a red cross, two jeeps and a bus. A road runs from A through forest with markers 10, 20 and 40, crosses a river at a stone bridge near marker 80, then goes north past marker 100 to the Police HQ building at the top left. A compass is at the top right.',
    hasWrittenStory: false,
    story: [
      'The slides for this model have no written story. In the real test the GTO tells the story aloud. These slides give only the title PRISON BREAK, the map and the GTO\u2019s short notes. Everything below comes from those three things.',
      'In the middle of the map is a fort on an island in the sea. With the title, this is the prison. On the shore just south east of the island is point A. At A there are a rowing boat, a motor boat, a red cross, two jeeps and a bus.',
      'A road runs from A west and south west through forest, crosses a river on a narrow stone bridge, then turns north to the Police HQ at the top left.',
    ],
    slideNotesVerbatim: 'Rb mb 20cap load 10min- jeep 5 cap bus 52 load  bus jeep 5min\u2014hosp handle 20 patients in 20 min\u2014narrow bridge for jeep only  ---start 8 am finish 5:30 pm',
    slideNotesReading: [
      'Rowing boat (Rb) and motor boat (mb): capacity 20, loading 10 minutes.',
      'Jeep: capacity 5. Bus: capacity 52. Loading a bus or a jeep: 5 minutes.',
      'Hospital: can handle 20 patients in 20 minutes.',
      'The bridge is narrow: jeeps only. The bus cannot cross.',
      'Start 8 am. Finish 5:30 pm.',
    ],
    modelKey: [
      { label: 'Prison', detail: 'The large picture in the middle: a fort on an island in the sea. The slide does not label it, but with the title PRISON BREAK this is the prison.' },
      { label: 'A', detail: 'Red box on the shore, just south east of the island. Next to A: a red rowing boat, a motor boat, a red cross, two jeeps and one bus.' },
      { label: 'Red cross', detail: 'Medical point next to A. It is the only medical sign on the map, so the hospital in the notes is most likely this one.' },
      { label: 'Road', detail: 'Black line from A, west and south west through the forest, over the stone bridge, then north to Police HQ.' },
      { label: 'Stone bridge', detail: 'Where the road crosses the river, next to marker 80. The notes say it is narrow and only jeeps can use it.' },
      { label: 'Police HQ', detail: 'Red label and building at the top left, at the end of the road.' },
      { label: 'River', detail: 'Blue band from near the south west corner of the island, south west under the stone bridge to the bottom left of the map.' },
      { label: 'Trees', detail: 'Forest covers the land.' },
      { label: 'North', detail: 'Compass at the top right. The red point at the top shows north.' },
    ],
    numbers: {
      intro: 'Black numbers along the road. The slide gives no unit; they read as distance from A along the road (most likely km).',
      rows: [
        { label: '10', detail: 'On the road just south west of A.' },
        { label: '20', detail: 'A little further along the road.' },
        { label: '40', detail: 'On the long southern stretch of road.' },
        { label: '80', detail: 'Next to the stone bridge over the river.' },
        { label: '100', detail: 'On the last stretch north of the bridge, below the Police HQ building.' },
      ],
    },
    speedsAndTimes: [
      { label: 'Rowing boat and motor boat', detail: 'Capacity 20. Loading 10 minutes.' },
      { label: 'Jeep', detail: 'Capacity 5. Loading 5 minutes.' },
      { label: 'Bus', detail: 'Capacity 52. Loading 5 minutes. Cannot cross the bridge.' },
      { label: 'Hospital', detail: '20 patients in 20 minutes.' },
      { label: 'Time window', detail: 'Start 8 am, finish 5:30 pm. That is 9 hours 30 minutes.' },
      { label: 'Speeds', detail: 'Not given on the slides for any boat or vehicle.' },
    ],
    resources: [
      '1 rowing boat and 1 motor boat at A.',
      '2 jeeps and 1 bus at A.',
      'Hospital (red cross) next to A.',
      'Police HQ at the end of the road, about 100 from A.',
    ],
    limitations: [
      'Only jeeps can cross the narrow bridge near 80.',
      'Boats carry 20 and need 10 minutes to load. Jeeps carry 5, the bus 52; each needs 5 minutes to load.',
      'The hospital can take only 20 patients every 20 minutes.',
      'Everything must be done between 8 am and 5:30 pm.',
    ],
    tasks: [
      'This practice wording is ours, because the slides have no written story. Read the map and notes and write the problem as you see it: a prison break at the island prison.',
      'Decide what comes first and explain your order (for example: any injured, stopping the escape, informing the police).',
      'Plan how you use both boats, both jeeps and the bus, with their capacities and loading times. Remember only jeeps cross the bridge.',
      'If you move any injured, use the hospital limit of 20 patients every 20 minutes.',
      'Fit everything between 8 am and 5:30 pm. Where the slide gives no number (speeds, how many people), write the number you assume and use it the same way throughout.',
    ],
    notGiven: [
      'The story itself: how many prisoners escaped, how many people are hurt, where anyone went.',
      'Speeds of the boats, jeeps and bus.',
      'Distance from A to the island.',
      'Whether the capacity of 20 is for each boat or only one of them (the note reads "Rb mb 20cap").',
      'The unit of the road numbers.',
      'Any phone or radio. None is shown.',
    ],
    reference: {
      title: 'Checklist from the slide facts',
      caveat: 'The slides have no official answer. These points only use the notes and the map. Speeds and numbers of people must come from your own stated assumptions.',
      points: [
        'The bus can only work on the A side of the bridge (A to 80). Any road trip to Police HQ at 100 must be done by jeep.',
        'Boat trips = people \u00f7 20, rounded up, and every trip costs 10 minutes of loading.',
        'Two jeeps move 10 people per run, with 5 minutes of loading each time.',
        'The hospital takes 20 patients per 20 minutes, so send injured in batches of 20, no faster than one batch every 20 minutes.',
        'Police HQ is the farthest point. No phone or radio is shown, so say how the police get told (for example a jeep run) and how long it takes with your assumed speed.',
        'From 8 am to 5:30 pm is 9 hours 30 minutes. Give a clock time for each step and finish inside it.',
      ],
    },
  },
  {
    id: 'security-guards',
    title: 'Security guards',
    slideTitle: 'SECURITY GUARDS',
    teaser: 'Vital places around a 300 ring road, a jeep-only bridge and one helicopter at A. Notes: 10 each to E, F and D. Start 5 pm, finish 7:30 pm.',
    timeNow: '17:00',
    finishBy: '19:30',
    planningMinutes: 15,
    image: '/images/gto/real-models/gto-security-guards.webp',
    imageWidth: 2400,
    imageHeight: 1749,
    imageAlt: 'Security guards model. A ring road with markers 10, 20, 60, 120, 180, 240, 280 and 300. A on the east with a building, two army trucks, a jeep and a helicopter. B a nuclear power plant at marker 10, C a grid station at 20, G a stone bridge over the river at 60, D a dam with a helipad and red 110 outside the ring, E a site with stacked pipes and a crane at 120, F an ordnance factory with a helipad and red 60 near 240. A river and railway cross inside the ring at a suspension bridge. A compass is at the top right.',
    hasWrittenStory: false,
    story: [
      'The slides for this model have no written story. In the real test the GTO tells the story aloud. These slides give only the title SECURITY GUARDS, the map and the GTO\u2019s short notes. Everything below comes from those three things.',
      'Important places sit around a ring road: a nuclear power plant, a grid station, a dam, an ordnance factory and a site with large pipes. At A, on the east side, there are two army trucks, a jeep and a helicopter.',
      'The notes say 10 each for E, F and D, with a start at 5 pm and a finish at 7:30 pm.',
    ],
    slideNotesVerbatim: 'bridge only for jeeps- loading 10 min\u2014helo TO/landing 10 min \u2013fuel 250km\u2014refueling at A 45min-E F D 10 ea +444\u2014st 5pm\u2014finish 7:30pm',
    slideNotesReading: [
      'Bridge only for jeeps. (The note does not say which bridge. The road bridge on the ring is G.)',
      'Loading: 10 minutes.',
      'Helicopter: take off or landing 10 minutes. Fuel for 250 km. Refuelling at A takes 45 minutes.',
      'E, F, D: 10 each. With the title, this most likely means 10 security guards at each place.',
      '"+444": the meaning is not clear. It is shown exactly as written.',
      'Start 5 pm. Finish 7:30 pm.',
    ],
    modelKey: [
      { label: 'A', detail: 'East side, on the ring road next to marker 300. A large building (not named) with two army trucks, one jeep and one helicopter.' },
      { label: 'B', detail: 'Nuclear power plant (cooling towers), south east, just outside the ring at marker 10.' },
      { label: 'C', detail: 'Electricity grid station, south, at marker 20.' },
      { label: 'G', detail: 'Stone bridge where the ring road crosses the river, south west, at marker 60.' },
      { label: 'D', detail: 'A dam on the river, far south west, outside the ring, with a helipad (H) and a red 110 next to it. No road is drawn from the ring to D.' },
      { label: 'E', detail: 'West side at marker 120. A site with large stacked pipes and a crane. The slide does not name it.' },
      { label: 'F', detail: 'North west, near marker 240. An ordnance factory (a banner reads "Ordnance Factory Board", with an artillery gun), with a helipad (H) and a red 60 next to it.' },
      { label: 'River', detail: 'Blue. Enters the ring from the north east, passes under a suspension bridge in the middle, leaves the ring through G and ends at the dam D.' },
      { label: 'Railway', detail: 'Tracks inside the ring meet at the suspension bridge in the middle and run east towards A.' },
      { label: 'North', detail: 'Compass at the top right. North is at the top.' },
    ],
    numbers: {
      intro: 'The slide gives no unit. Black numbers sit on the ring road; red numbers sit next to the two helipads.',
      rows: [
        { label: 'Black 10, 20, 60, 120, 180, 240, 280, 300', detail: 'Read clockwise from A (south first): B 10, C 20, G 60, E 120, then 180, F 240, 280, and 300 back beside A. So they read as distance from A going clockwise, and the full ring is 300.' },
        { label: 'Red 60', detail: 'Next to F\u2019s helipad. The slide does not say if this is a flying or a road distance. It equals the road distance from A to F going anticlockwise (300 minus 240).' },
        { label: 'Red 110', detail: 'Next to D\u2019s helipad. The slide does not say if this is a flying distance. There is no road drawn to D.' },
      ],
    },
    speedsAndTimes: [
      { label: 'Loading', detail: '10 minutes.' },
      { label: 'Helicopter', detail: 'Take off or landing 10 minutes. Fuel for 250 km. Refuelling at A 45 minutes.' },
      { label: 'Bridge', detail: 'Jeeps only.' },
      { label: 'Time window', detail: 'Start 5 pm, finish 7:30 pm. That is 2 hours 30 minutes.' },
      { label: 'Speeds and capacities', detail: 'Not given on the slides for the trucks, the jeep or the helicopter.' },
    ],
    resources: [
      '2 army trucks, 1 jeep and 1 helicopter at A.',
      'Helipads at D and F.',
      'Refuelling for the helicopter at A.',
      'The ring road (300 around) and the jeep-only bridge.',
    ],
    limitations: [
      'Only jeeps can cross the bridge.',
      'Helicopter fuel lasts 250 km, then 45 minutes to refuel at A.',
      'Every take off or landing costs 10 minutes. Every loading costs 10 minutes.',
      'Everything must be done between 5 pm and 7:30 pm.',
    ],
    tasks: [
      'This practice wording is ours, because the slides have no written story. Plan how security guards reach E, F and D, 10 at each place as the notes read, between 5 pm and 7:30 pm.',
      'For each place choose road or helicopter, and which way round the ring road.',
      'Respect the jeep-only bridge, 10 minutes loading, 10 minutes per take off or landing, 250 km of fuel and 45 minutes refuelling at A.',
      'Write any speed or capacity you assume and use it the same way throughout. Give a clock time for every step.',
    ],
    notGiven: [
      'The story itself: why guards are needed, how many guards there are and where they start (A is most likely, as all transport is there).',
      'Speeds and seats of the trucks, the jeep and the helicopter.',
      'Whether the red 60 and 110 are flying distances or road distances.',
      'What "+444" means.',
      'Which bridge is jeep only (most likely G, the road bridge).',
      'Whether B and C also need guards.',
      'The unit of the numbers.',
    ],
    reference: {
      title: 'Checklist from the slide facts',
      caveat: 'The slides have no official answer. These points only use the notes and the map. Speeds and capacities must come from your own stated assumptions.',
      points: [
        'Trucks cannot cross the jeep-only bridge at G, so a truck going to E must go anticlockwise: A, 280, F (240), 180, E (120). That is 60 to F and 180 to E. The jeep may go clockwise through G: 120 to E.',
        'No road is drawn to D, and D has a helipad, so D is a helicopter job. A to D and back is 2 \u00d7 110 = 220, inside the 250 km fuel. Any second trip needs 45 minutes of refuelling at A first.',
        'F also has a helipad (red 60), and F is 60 from A by road going anticlockwise.',
        'Each helicopter trip costs 10 minutes loading + 10 minutes take off + flying time + 10 minutes landing.',
        '5 pm to 7:30 pm is 150 minutes. Run road and air moves at the same time, and show the clock time for each step.',
      ],
    },
  },
];

export function findRealGtoModel(id: string): RealGtoModel | undefined {
  return realGtoModels.find((model) => model.id === id);
}

/** Full plain-text brief of one problem, used for Gemma and for downloads. */
export function realGtoBriefText(model: RealGtoModel): string {
  const rows = (items: RealGtoRow[]) => items.map((item) => `- ${item.label}: ${item.detail}`).join('\n');
  const list = (items: string[]) => items.map((item) => `- ${item}`).join('\n');
  return [
    `TITLE: ${model.title} (slide title: ${model.slideTitle})`,
    `STORY TIME NOW: ${model.timeNow}. FINISH BY: ${model.finishBy}. PLANNING TIME: ${model.planningMinutes} minutes.`,
    `STORY${model.hasWrittenStory ? '' : ' (the slides have no written story; only map and notes)'}:\n${model.story.join('\n')}`,
    `GTO SLIDE NOTES (verbatim): ${model.slideNotesVerbatim}\nREADING OF THE NOTES:\n${list(model.slideNotesReading)}`,
    `MODEL KEY:\n${rows(model.modelKey)}`,
    `NUMBERS ON THE MAP: ${model.numbers.intro}\n${rows(model.numbers.rows)}`,
    `SPEEDS, CAPACITIES AND TIMES:\n${rows(model.speedsAndTimes)}`,
    `RESOURCES:\n${list(model.resources)}`,
    `LIMITATIONS:\n${list(model.limitations)}`,
    `TASKS:\n${list(model.tasks)}`,
    `NOT GIVEN OR UNCLEAR ON THE SLIDES:\n${list(model.notGiven)}`,
  ].join('\n\n');
}
