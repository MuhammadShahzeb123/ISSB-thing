export type PlanningDifficulty = 'easy' | 'medium' | 'hard';

export interface PlanningRow {
  name: string;
  detail: string;
}

export interface PlanningTask {
  id: string;
  title: string;
  difficulty: PlanningDifficulty;
  setting: string;
  timeNow: string;
  planningMinutes: number;
  narrative: string;
  mustAchieve: string[];
  constraints: string[];
  groupSize: number;
  people: string[];
  resources: PlanningRow[];
  routes: PlanningRow[];
  map: string;
  mapAlt: string;
  script: string;
  solution: {
    problems: string[];
    priority: string;
    steps: string[];
    regroup: string;
  };
}

export const planningDifficulties: PlanningDifficulty[] = ['easy', 'medium', 'hard'];

export const groupPlanningTasks: PlanningTask[] = [
  {
    id: 'kot-miran',
    title: 'Kot Miran patients and rations',
    difficulty: 'easy',
    setting: 'A river hamlet in central Punjab',
    timeNow: '07:30',
    planningMinutes: 15,
    narrative: 'Your ISSB group is at Base on the west bank. A safe boat landing is at Base. Two injured villagers are at the Hamlet on the east bank. Fifteen ration bags are already stacked at Base. A footbridge is closed. District Hospital is on the metalled road west of Base.',
    mustAchieve: [
      'Both injured villagers are at District Hospital by 09:00.',
      'All fifteen ration bags are at the Hamlet by 10:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes. Write the plan before you open the solution.',
      'Do not use the closed footbridge.',
      'Do not enter the river except in the boat.',
      'Speeds stay constant. Count the boatman and the driver in the seat totals.',
      'A person or vehicle cannot do two jobs at the same time.',
    ],
    groupSize: 8,
    people: [
      'Boatman',
      'Medic',
      'Boat helper',
      'Jeep driver',
      'Three coordinators who can load bags at Base',
      'One spare helper',
    ],
    resources: [
      { name: 'Boat', detail: '6 seats including the boatman. Speed 12 km/h. Can carry 15 bags plus 3 crew on the supply trip.' },
      { name: 'Jeep', detail: '4 seats including the driver. Speed 36 km/h on the metalled road. Cannot use the river.' },
      { name: 'Radio', detail: 'Working set at Base. Hospital and Hamlet can reply.' },
    ],
    routes: [
      { name: 'Base to Hamlet by boat', detail: '2 km along the river. 2 / 12 hours = 10 minutes each way.' },
      { name: 'Collect the injured', detail: 'Allow 10 minutes at the Hamlet.' },
      { name: 'Transfer at Base', detail: 'Allow 5 minutes to move the injured from the boat into the jeep.' },
      { name: 'Base to Hospital', detail: '18 km metalled. 18 / 36 hours = 30 minutes by jeep.' },
      { name: 'Load rations', detail: 'Allow 10 minutes at Base. Unload at the Hamlet takes 10 minutes.' },
    ],
    map: '/images/gto/planning/kot-miran.svg',
    mapAlt: 'Sketch map of Kot Miran. Base is on the west bank with a metalled road of 18 km to the hospital. A boat route of 2 km crosses the river to the hamlet. The footbridge is marked closed.',
    script: 'It is half past seven in the morning. Your group of eight is at Base. Two injured villagers at the hamlet must reach the district hospital by nine. Fifteen ration bags at Base must reach the hamlet by ten. The footbridge is closed. You have fifteen minutes to plan. Use the boat and the jeep. Do not enter the river except in the boat.',
    solution: {
      problems: [
        'Two injured people. This is a life problem. Deadline 09:00.',
        'Fifteen ration bags. This is a welfare problem. Deadline 10:00.',
        'The footbridge is closed, so the river crossing is by boat only.',
      ],
      priority: 'Life before rations. The jeep must wait at Base because the injured are still on the far bank. The boat does the rescue first, then the rations. The jeep never goes to the hamlet.',
      steps: [
        '07:30. Boat leaves Base with the boatman, the medic and the helper. Three people are aboard.',
        '07:40. Boat reaches the Hamlet. 2 km at 12 km/h is 10 minutes.',
        '07:40 to 07:50. Load both injured. The medic checks them. Five people are aboard on the return, inside the limit of six.',
        '08:00. Boat is back at Base.',
        '08:00 to 08:05. Move the injured into the jeep. The medic boards the jeep.',
        '08:05. Jeep leaves with the driver, the medic and two injured. That fills four seats. 18 km at 36 km/h is 30 minutes.',
        '08:35. Jeep reaches the hospital, 25 minutes before 09:00.',
        '08:05 to 08:15. Coordinators load fifteen bags into the boat with the boatman and the helper.',
        '08:15. Boat leaves. 08:25 it reaches the Hamlet. Unloading finishes at 08:35, well before 10:00.',
      ],
      regroup: 'The medic and the driver stay with the patients until hospital staff take over. The boatman reports by radio from the Hamlet. Coordinators hold Base. Nobody uses the footbridge.',
    },
  },
  {
    id: 'chak-47',
    title: 'Chak 47 school before the storm',
    difficulty: 'easy',
    setting: 'A canal colony in southern Punjab',
    timeNow: '14:00',
    planningMinutes: 15,
    narrative: 'A storm will close the school roads at 16:00. Twelve children and one teacher are at the School. The short track toward Town is cut by a broken culvert. A local trolley and its driver are waiting at Canal Head. Your ISSB group is at Town with a coaster and a pickup. A clinic generator is sitting at the Workshop and must reach the Town clinic.',
    mustAchieve: [
      'All 13 people from the School are in Town by 16:00.',
      'The generator is at the Town clinic by 17:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'Do not cross the broken culvert or the ford.',
      'The trolley may use only the kacha road. The coaster may use only metalled road.',
      'You may phone the trolley driver at 14:00. Treat that call as the start of the trolley move.',
      'Seat limits include the driver.',
    ],
    groupSize: 8,
    people: [
      'Coaster driver',
      'Coaster conductor',
      'Pickup driver',
      'Pickup helper',
      'Four members who receive the children in Town and keep names',
    ],
    resources: [
      { name: 'Local trolley', detail: 'Already at Canal Head with its own driver, who is not one of the eight. It carries 15 passengers plus that driver. Speed 15 km/h on kacha only.' },
      { name: 'Coaster', detail: '15 seats including the driver. Speed 40 km/h on metalled road. Not allowed on kacha.' },
      { name: 'Pickup', detail: '3 seats including the driver. Speed 40 km/h on metalled road. It can carry the generator. Loading takes 15 minutes. Unloading takes 10 minutes.' },
      { name: 'Phone', detail: 'You can call the trolley driver from Town.' },
    ],
    routes: [
      { name: 'School to Canal Head', detail: '6 km kacha. 6 / 15 hours = 24 minutes by trolley.' },
      { name: 'Load the children', detail: 'Allow 10 minutes at the School and 10 minutes at Canal Head.' },
      { name: 'Canal Head to Town', detail: '10 km metalled. 10 / 40 hours = 15 minutes by coaster.' },
      { name: 'Workshop to Town clinic', detail: '8 km metalled. 8 / 40 hours = 12 minutes by pickup.' },
      { name: 'Broken track', detail: 'School toward the old culvert is closed. Do not use it.' },
    ],
    map: '/images/gto/planning/chak-47.svg',
    mapAlt: 'Sketch map of Chak 47. Town connects by 10 km of metalled road to Canal Head, then 6 km of kacha road to the School. A foot track to a broken culvert is marked closed. The Workshop is 8 km metalled from Town.',
    script: 'It is two in the afternoon. Thirteen people at the school must be in town before four, when the storm closes the roads. A generator at the workshop must reach the town clinic by five. The short track is cut by a broken culvert. A trolley waits at Canal Head. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Thirteen people at the School. Safety before the storm. Deadline 16:00.',
        'Generator for the clinic. Important, but not ahead of the children. Deadline 17:00.',
        'The culvert route is unusable, so the children must come via Canal Head.',
      ],
      priority: 'Children first. The coaster and the pickup are both free at 14:00 and do not need each other, so the generator runs in parallel. Do not send the coaster onto the kacha road.',
      steps: [
        '14:00. Phone the trolley. It covers 6 km at 15 km/h in 24 minutes and reaches the School at 14:24.',
        '14:24 to 14:34. Load 12 children and the teacher.',
        '14:34 to 14:58. Trolley returns to Canal Head. 24 minutes.',
        '14:00. Coaster leaves Town with the driver and the conductor. 10 km at 40 km/h is 15 minutes. It waits at Canal Head from 14:15.',
        '14:58 to 15:08. Load 13 passengers. Seats used: driver, conductor and 13 passengers = 15.',
        '15:08. Coaster leaves. It reaches Town at 15:23, before 16:00. The four receivers check names.',
        '14:00. Pickup leaves Town with the driver and the helper. Workshop at 14:12. Load until 14:27. Clinic at 14:39. Unload finished at 14:49, before 17:00.',
      ],
      regroup: 'Everyone except the local trolley driver is back in Town by 15:30. The trolley stays at Canal Head. The broken culvert stays closed.',
    },
  },
  {
    id: 'pind-dadan',
    title: 'Pind Dadan rail crash and store fire',
    difficulty: 'medium',
    setting: 'A market town on a branch railway',
    timeNow: '09:00',
    planningMinutes: 15,
    narrative: 'Your ISSB group of ten is at Pind Station. Six passengers are injured at a derailment north of the station. A wheat store is on fire to the east. Labourers are already outside. A cracked footbridge on the hospital road will close to every vehicle at 11:00. Until then only light vehicles may cross it. The fire tender is too heavy for that bridge.',
    mustAchieve: [
      'All six injured passengers are at the hospital before the footbridge closes at 11:00.',
      'Water is being applied to the wheat store before 09:40.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'Nobody walks or drives on the railway. Use the kacha service road beside it.',
      'The fire tender must not cross the cracked footbridge.',
      'The ambulance cannot use kacha roads.',
      'Loading one pair of patients at the site takes 6 minutes. Transfer at the station takes 4 minutes. Unload at the hospital takes 6 minutes.',
      'The local ambulance driver is extra. He is not one of the ten.',
    ],
    groupSize: 10,
    people: [
      'Fire tender driver, nozzleman and hose hand',
      'Jeep driver, medic and two stretcher helpers',
      'Ambulance attendant',
      'Station controller',
      'Reserve helper at the station',
    ],
    resources: [
      { name: 'Jeep', detail: '6 seats including the driver. 20 km/h on the kacha service road. 30 km/h on metalled road. It is a light vehicle and may use the footbridge before 11:00.' },
      { name: 'Ambulance', detail: 'Local driver, plus your medic, your attendant and two patients. 60 km/h on metalled road only. Light enough for the footbridge before 11:00.' },
      { name: 'Fire tender', detail: 'Three crew including the driver. 20 km/h on the kacha road to the store. Enough water for that store. Too heavy for the footbridge.' },
    ],
    routes: [
      { name: 'Station to derailment', detail: '2 km kacha service road. 2 / 20 hours = 6 minutes by jeep.' },
      { name: 'Station to wheat store', detail: '3 km kacha. 3 / 20 hours = 9 minutes by fire tender.' },
      { name: 'Station to hospital', detail: '10 km metalled, across the cracked footbridge. 10 / 60 hours = 10 minutes by ambulance.' },
    ],
    map: '/images/gto/planning/pind-dadan.svg',
    mapAlt: 'Sketch map of Pind Dadan. The station sits beside a railway. A 2 km kacha service road runs north to the derailment. A 3 km kacha road runs east to the wheat store. A 10 km metalled road runs west to the hospital across a cracked footbridge.',
    script: 'It is nine in the morning. Six injured passengers are at a derailment two kilometres north of Pind Station. A wheat store three kilometres east will be lost unless water is on it before twenty to ten. The hospital is ten kilometres west, but the footbridge on that road closes at eleven, and only light vehicles may use it until then. You have fifteen minutes to plan. Do not go onto the railway.',
    solution: {
      problems: [
        'Six injured passengers. Life. They must be in hospital before 11:00 because the bridge then shuts.',
        'Wheat store fire. Time critical property. Water must start before 09:40. People are already clear.',
        'The footbridge is a limit, not a separate rescue.',
      ],
      priority: 'Start the fire tender and the jeep at the same minute. They do not share a vehicle. Life is still the main effort. The tender never joins the medical runs. Move patients two at a time.',
      steps: [
        '09:00. Fire tender leaves with three crew. It arrives at 09:09 and water is on by 09:10, inside the 09:40 limit. That crew stays with the store.',
        '09:00. Jeep leaves with driver, medic and two helpers. Site at 09:06. Load pair A until 09:12. Station at 09:18. Six seats: four crew out, plus two patients back.',
        '09:18 to 09:22. Transfer pair A. Ambulance leaves with the local driver, medic, attendant and two patients. Hospital at 09:32. Unload until 09:38. Medic returns on the ambulance and is back at the station at 09:48.',
        '09:20. Jeep goes back without the medic. Driver and two helpers. Site at 09:26. Load pair B until 09:32. Station at 09:38. They wait.',
        '09:48 to 09:52. Ambulance loads pair B and reaches hospital at 10:02. It is back at the station at 10:18.',
        '09:40. Jeep leaves for pair C. Site at 09:46. Departs at 09:52. Station at 09:58.',
        '10:18 to 10:22. Ambulance loads pair C and reaches hospital at 10:32. The bridge is still open. All six are in before 11:00.',
      ],
      regroup: 'The controller logs each departure. The reserve helper stages stretchers at the station. Fire crew stay at the store until a local brigade relieves them. Medic reports from the hospital by phone. Nobody uses the railway or puts the tender on the bridge.',
    },
  },
  {
    id: 'serai-valley',
    title: 'Serai Valley landslide',
    difficulty: 'medium',
    setting: 'A valley road in northern Pakistan',
    timeNow: '06:30',
    planningMinutes: 15,
    narrative: 'A landslide has closed the short metalled road. Your ISSB group is at the Depot with twenty blankets, a jeep and a truck. A woman in labour is at Upper Camp. The clinic is on the far side of Bridge Fork. The river bridge can take the jeep only. The truck cannot cross it and cannot climb the kacha road.',
    mustAchieve: [
      'The woman is at the clinic by 08:30.',
      'All twenty blankets are at Upper Camp by 12:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'Do not use the landslide road.',
      'The truck stops at Bridge Fork. Only the jeep climbs to Upper Camp.',
      'Allow 10 minutes to help the woman into the jeep.',
      'Allow 10 minutes to move ten blankets from the truck into the jeep, and 8 minutes to unload them at Upper Camp.',
      'The jeep carries ten blankets besides the driver and one helper. It cannot carry the woman and blankets on the same trip.',
    ],
    groupSize: 8,
    people: [
      'Jeep driver and medic',
      'One jeep helper',
      'Truck driver and two loaders',
      'Two controllers at the Depot, then one moves up with the truck',
    ],
    resources: [
      { name: 'Jeep', detail: '4 seats including the driver. 40 km/h on metalled road. 20 km/h on the kacha climb. Light enough for the bridge. Cargo of ten blankets plus driver and one helper.' },
      { name: 'Truck', detail: 'Carries all twenty blankets. 40 km/h on metalled road. Cannot use the bridge or the kacha climb.' },
      { name: 'Radio', detail: 'Sets at the Depot, in the jeep and at the clinic.' },
    ],
    routes: [
      { name: 'Depot to Bridge Fork', detail: '12 km metalled. 12 / 40 hours = 18 minutes for jeep or truck.' },
      { name: 'Bridge Fork to Upper Camp', detail: '8 km kacha after the light bridge. 8 / 20 hours = 24 minutes by jeep. Truck cannot do this leg.' },
      { name: 'Bridge Fork to clinic', detail: '16 km metalled. 16 / 40 hours = 24 minutes by jeep.' },
    ],
    map: '/images/gto/planning/serai-valley.svg',
    mapAlt: 'Sketch map of Serai Valley. The depot is at the bottom of a 12 km metalled road to Bridge Fork. A light bridge and an 8 km kacha climb lead to Upper Camp. The clinic is 16 km metalled from the fork. A short road is marked closed by a landslide.',
    script: 'It is half past six in the morning. A landslide has closed the short road. A woman in labour at Upper Camp must reach the clinic by half past eight. Twenty blankets at the depot must reach Upper Camp by noon. The truck cannot cross the light bridge. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Woman in labour. Life. Deadline 08:30.',
        'Twenty blankets. Welfare before night cold. Deadline 12:00.',
        'Landslide and the weight limit split the route. The truck is only a shuttle as far as the fork.',
      ],
      priority: 'The jeep takes the woman first and does not carry blankets on that trip. Send the truck early so the blankets are waiting at the fork when the jeep comes back from the clinic.',
      steps: [
        '06:30. Jeep leaves the Depot with driver, medic and helper. Bridge Fork at 06:48. Upper Camp at 07:12. That is 18 minutes plus 24 minutes.',
        '07:12 to 07:22. Help the woman in. Seats: driver, medic, helper and the woman.',
        '07:22. Leave Camp. Fork at 07:46. Clinic at 08:10, twenty minutes before 08:30. The medic stays at the clinic.',
        '06:40. Truck leaves after the blankets are roped, with driver and two loaders. It is at the fork from 06:58 and waits. It does not cross the bridge.',
        '08:10. Jeep leaves the clinic with driver and helper. Fork at 08:34.',
        '08:34 to 08:44. Load the first ten blankets. Upper Camp at 09:08. Unload until 09:16. Back at the fork at 09:40.',
        '09:40 to 09:50. Load the second ten. Upper Camp at 10:14. Unload finished at 10:22, before 12:00.',
      ],
      regroup: 'Medic stays at the clinic until local staff take the woman. Loaders stay with the truck at the fork. Jeep team confirms the second unload by radio at 10:30. The landslide road stays unused.',
    },
  },
  {
    id: 'nala-culvert',
    title: 'Nala Culvert materials',
    difficulty: 'medium',
    setting: 'A highway culvert on the Grand Trunk road belt',
    timeNow: '06:00',
    planningMinutes: 15,
    narrative: 'Masons will repair a culvert once sand, cement and tools are on site. They need six hours after the materials arrive, then one hour to inspect, and a convoy must pass at 18:00. Your ISSB job is the transport, not the masonry. Tools are at GHQ. Sand is at a pit on a kacha spur. Cement is at a depot west of GHQ. Two trucks are at GHQ.',
    mustAchieve: [
      'Sand, cement and the tool chest are all at the culvert site by 09:00, so the masons can start on time.',
      'Show that a 06:00 start still leaves the convoy a safe margin at 18:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'Each truck has one driver and one helper. They cannot be in two places.',
      'Truck A is for sand only.',
      'Truck B may carry the tool chest and the cement together. Nothing else may be mixed.',
      'Loading sand takes 20 minutes. Loading cement takes 15 minutes. Loading tools takes 10 minutes. Unloading sand takes 15 minutes. Unloading tools and cement together takes 20 minutes.',
      'Do not invent a third truck.',
    ],
    groupSize: 6,
    people: [
      'Truck A driver and sand helper',
      'Truck B driver and helper',
      'Two members at GHQ who load the tool chest, then keep the radio watch',
    ],
    resources: [
      { name: 'Truck A', detail: '40 km/h on metalled road. 20 km/h on kacha. Carries the full sand load and nothing else.' },
      { name: 'Truck B', detail: 'Same speeds. Carries the tool chest and the full cement load together.' },
      { name: 'Tool chest', detail: 'Already at GHQ. Small enough to stay on truck B while cement is loaded.' },
    ],
    routes: [
      { name: 'GHQ to sand pit', detail: '12 km kacha. 12 / 20 hours = 36 minutes each way. The pit is a spur, not on the way to the site.' },
      { name: 'GHQ to cement depot', detail: '10 km metalled west. 10 / 40 hours = 15 minutes.' },
      { name: 'GHQ to site', detail: '30 km metalled east. 30 / 40 hours = 45 minutes.' },
      { name: 'Depot to site', detail: 'The road passes GHQ, so the distance is 10 plus 30 = 40 km metalled. 40 / 40 hours = 60 minutes. No need to unload at GHQ.' },
    ],
    map: '/images/gto/planning/nala-culvert.svg',
    mapAlt: 'Sketch map of Nala Culvert. GHQ is in the centre. A 12 km kacha spur leads to the sand pit. The cement depot is 10 km metalled to the west. The culvert site is 30 km metalled to the east.',
    script: 'It is six in the morning. Sand, cement and tools must be at the culvert by nine so the masons can finish before an evening convoy. Sand is up a kacha spur. Cement is west of GHQ. Tools are at GHQ. You have two trucks and fifteen minutes to plan.',
    solution: {
      problems: [
        'Three loads must arrive by 09:00. This is a time critical engineering task, not a life rescue.',
        'One truck cannot collect sand and also collect cement in time. Split the work.',
        'The masons need six hours plus one hour of inspection after the materials are there. The convoy is at 18:00.',
      ],
      priority: 'Run both trucks from 06:00. Sand is the longer kacha trip, so give it a truck of its own. Put tools on the cement truck before it goes to the depot, so you do not need a third trip.',
      steps: [
        '06:00. Truck A leaves GHQ for the sand pit. Arrives 06:36. Loads until 06:56. Back at GHQ at 07:32.',
        '07:32. Truck A leaves for the site with the sand. Arrives 08:17. Unload finished at 08:32, before 09:00.',
        '06:00 to 06:10. Truck B loads the tool chest at GHQ.',
        '06:10. Truck B drives to the cement depot. Arrives 06:25. Cement is aboard by 06:40. Tools stay on the truck.',
        '06:40. Truck B drives depot to site, 40 km, 60 minutes. Arrives 07:40. Tools and cement are unloaded by 08:00.',
        'All three loads are on site by 08:32. Masons can start then. Six hours ends at 14:32. Inspection ends at 15:32. The 18:00 convoy has more than two hours of margin.',
      ],
      regroup: 'Both trucks remain at the site after unloading so they do not block the masons by a late return through the work area. GHQ radio watch confirms the 08:32 arrival. Do not send either truck back onto the road until the culvert party says the bay is clear.',
    },
  },
  {
    id: 'gharo-nullah',
    title: 'Gharo Nullah three calls',
    difficulty: 'hard',
    setting: 'A checkpost where a canal road meets a railway',
    timeNow: '11:00',
    planningMinutes: 15,
    narrative: 'Your ISSB group of ten is at the Checkpost. Three things are happening at once. A lineman is injured at a pole beside the railway. An overhead tank at the colony will collapse unless a valve at the Pump House is shut. A school minibus with 14 children is stuck on a causeway and the water is rising. Vehicles cannot drive onto that causeway.',
    mustAchieve: [
      'The pump valve is shut by 11:45.',
      'The 14 children are off the causeway, on foot at Ridge, by 12:30.',
      'The lineman is at the hospital by 13:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'The railway is live. Do not walk the rails. The jeep may use the service track beside them.',
      'Do not drive onto the causeway. Children move on the foot track with guides.',
      'The motorcycle can use metalled road only. It cannot carry the lineman or the children.',
      'Allow 5 minutes to shut the valve, 25 minutes for the children to walk 1.5 km, 5 minutes to brief them, 10 minutes to put the lineman on the stretcher, and 5 minutes at the Checkpost before the hospital leg.',
    ],
    groupSize: 10,
    people: [
      'Motorcycle rider',
      'Jeep driver, medic and one stretcher hand',
      'Truck driver and four guides',
      'Controller at the Checkpost',
    ],
    resources: [
      { name: 'Motorcycle', detail: 'One rider. 40 km/h on metalled road. It can reach the Pump House and nothing else useful.' },
      { name: 'Jeep', detail: '5 seats including the driver. 15 km/h on the service track. 40 km/h on metalled road. Light enough for the hospital road.' },
      { name: 'Truck', detail: '30 km/h on metalled road. It carries the four guides to Ridge. It cannot use the causeway or the foot track.' },
      { name: 'Stretchers and a rope', detail: 'Already at the Checkpost. The rope is for the guides on the foot track, not for towing the bus.' },
    ],
    routes: [
      { name: 'Checkpost to Pump House', detail: '4 km metalled. 4 / 40 hours = 6 minutes by motorcycle.' },
      { name: 'Checkpost to Ridge', detail: '9 km metalled. 9 / 30 hours = 18 minutes by truck.' },
      { name: 'Ridge to the minibus', detail: '1.5 km foot track. Allow 25 minutes with children, each way.' },
      { name: 'Checkpost to the pole', detail: '5 km service track. 5 / 15 hours = 20 minutes by jeep.' },
      { name: 'Checkpost to hospital', detail: '18 km metalled. 18 / 40 hours = 27 minutes by jeep.' },
    ],
    map: '/images/gto/planning/gharo-nullah.svg',
    mapAlt: 'Sketch map of Gharo Nullah. The checkpost is central. A service track runs 5 km north beside the railway to the pole. Pump House is 4 km east by metalled road. Ridge is west, with a foot track to a minibus on an unsafe causeway. The hospital is 18 km south by metalled road.',
    script: 'It is eleven in the morning. Shut a pump valve by a quarter to twelve or a tank may collapse. Fourteen children must be off a flooded causeway by half past twelve. An injured lineman must reach hospital by one. The rails are live and vehicles must not drive onto the causeway. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Valve. The shortest clock. If it stays open the tank can collapse on nearby houses. Deadline 11:45.',
        'Fourteen children in rising water. Life. They only need to reach Ridge by 12:30.',
        'Injured lineman. Life, and he is stable enough for a stretcher. Deadline 13:00.',
      ],
      priority: 'All three start at 11:00 because each has its own vehicle. Do not hold the motorcycle or the truck for the lineman. Do not send the jeep to the causeway.',
      steps: [
        '11:00. Motorcycle leaves for the Pump House. Arrives 11:06. Valve is shut by 11:11, inside the 11:45 limit. The rider stays to watch it.',
        '11:00. Truck leaves with the driver and four guides. Ridge at 11:18.',
        '11:18 to 11:43. Guides walk 1.5 km. Allow 25 minutes. They reach the bus at 11:43.',
        '11:43 to 11:48. Brief the children and start them back. They are at Ridge at 12:13, off the causeway before 12:30. The truck does not cross.',
        '11:00. Jeep leaves with driver, medic and stretcher hand. Pole at 11:20. Stretcher until 11:30. Back at the Checkpost at 11:50.',
        '11:50 to 11:55. Controller confirms the hospital route. Jeep continues. 18 km at 40 km/h is 27 minutes. Hospital at 12:22, before 13:00. Seats used: driver, medic, stretcher hand and the lineman.',
      ],
      regroup: 'Call the Checkpost at 12:30. Rider is at the pump, children are at Ridge, jeep is at the hospital. Do not tow the bus and do not walk the rails.',
    },
  },
  {
    id: 'kinjhar-bend',
    title: 'Kinjhar Bend last ferry',
    difficulty: 'hard',
    setting: 'A lake bend in Sindh',
    timeNow: '15:00',
    planningMinutes: 15,
    narrative: 'Wind will stop the ferry after 17:00. Your ISSB group is at the West Jetty. Thirty villagers must cross to the East Jetty before the last safe departure. A midwife is at West Village and a blood box is in the store at the West Jetty. Both must reach the clinic. The clinic is not at the East Jetty. A kacha road goes around the lake and ends at the clinic. A jeep can use that road. The ferry cannot.',
    mustAchieve: [
      'The midwife and the blood box are at the clinic by 16:30.',
      'All thirty villagers are on the East Jetty, and the ferry makes no departure after 17:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'The ferry carries 15 passengers plus 2 crew. Crossing takes 20 minutes. Loading takes 10 minutes. Unloading takes 10 minutes. The return empty also takes 20 minutes.',
      'The ferry works from the West Jetty. It cannot stop at the clinic.',
      'From the East Jetty the clinic is a further walk you must not rely on. The around lake road is the clinic route.',
      'The jeep seats four including the driver. It cannot carry the thirty villagers in time.',
      'Do not put the jeep on the ferry.',
    ],
    groupSize: 8,
    people: [
      'Two ferry crew from your group',
      'Jeep driver and one helper',
      'Four marshals at the West Jetty who count the villagers into groups of fifteen',
    ],
    resources: [
      { name: 'Ferry', detail: '15 passengers and 2 crew. Fixed 20 minute crossing. It cannot reach the clinic.' },
      { name: 'Jeep', detail: '4 seats including the driver. 30 km/h on the short metalled road to West Village. 20 km/h on the around lake kacha. The blood box counts as cargo, not a seat.' },
      { name: 'Blood box', detail: 'Already at the West Jetty store.' },
    ],
    routes: [
      { name: 'West Jetty to West Village', detail: '6 km metalled. 6 / 30 hours = 12 minutes by jeep. Load the blood box before you leave the jetty.' },
      { name: 'Allow at the village', detail: '5 minutes for the midwife to board.' },
      { name: 'West Village to the clinic', detail: '18 km kacha around the lake. 18 / 20 hours = 54 minutes. Do not drive back to the jetty. This road ends at the clinic, not at the East Jetty.' },
      { name: 'Ferry cycle', detail: 'Load 10, cross 20, unload 10, return 20. Two full loads move 30 people.' },
    ],
    map: '/images/gto/planning/kinjhar-bend.svg',
    mapAlt: 'Sketch map of Kinjhar Bend. A lake sits in the centre. West Jetty is on the left, with a 6 km metalled road to West Village. A ferry crosses to East Jetty. From West Village an 18 km kacha road goes around the lake and ends at the clinic.',
    script: 'It is three in the afternoon. Thirty villagers must cross the lake by ferry, and the last safe departure is five. A midwife and a blood box must reach the clinic by half past four. The clinic is on the around lake road, not at the east jetty. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Midwife and blood box. Clinical emergency. Deadline 16:30. The ferry cannot reach the clinic.',
        'Thirty villagers. Safety before the wind stops the ferry. Last departure 17:00. The ferry holds 15 passengers, so two crossings are required.',
        'Sending the midwife on the ferry still lands her at the East Jetty, not at the clinic.',
      ],
      priority: 'Use both means at 15:00. The jeep takes the midwife and the blood box by road to the clinic. The ferry is kept for the villagers. Do not put the jeep on the ferry, and do not drive the jeep back to the jetty after picking up the midwife.',
      steps: [
        '15:00. Load the blood box. Jeep leaves the West Jetty with the driver and the helper. West Village at 15:12. That is 6 km at 30 km/h.',
        '15:12 to 15:17. Midwife boards. Seats used: driver, helper and midwife. The blood box is cargo.',
        '15:17. Jeep joins the kacha and does not return to the jetty. 18 km at 20 km/h is 54 minutes. Clinic at 16:11, 19 minutes before 16:30.',
        '15:00 to 15:10. Marshals load the first 15 villagers. Ferry departs at 15:10 and reaches the East Jetty at 15:30. Unload until 15:40.',
        '15:40 to 16:00. Ferry returns empty. 20 minutes.',
        '16:00 to 16:10. Load the second 15. Depart at 16:10, which is before the 17:00 wind stop. East Jetty at 16:30. Unload finished at 16:40.',
      ],
      regroup: 'Ferry crew stay with the boat at the East Jetty after the second unload. Marshals remain at the West Jetty until the second boat has left, then report by phone. Jeep driver confirms arrival at the clinic at 16:11. The marshals are on high ground at the jetty.',
    },
  },
  {
    id: 'baragali',
    title: 'Baragali track, sick and rations',
    difficulty: 'medium',
    setting: 'A hill rest house above a valley road',
    timeNow: '08:00',
    planningMinutes: 15,
    narrative: 'Your ISSB group is at the Rest House. Four sick people are at Lower Village and must reach the hospital. A landslide has shut the metalled road toward Upper Village, so a food truck cannot get through. Sixteen ration bags are at the Rest House and must reach the Upper Village store by pony. The van cannot use the pony track. The ponies cannot use the metalled hospital road.',
    mustAchieve: [
      'All four sick people are at the hospital by 11:00.',
      'All sixteen ration bags are at the Upper Village store by 18:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'Do not send the van onto the landslide road or the pony track.',
      'Allow 10 minutes to load the sick at Lower Village.',
      'Each pony carries 2 bags. Four ponies travel together as one wave, so one wave moves 8 bags.',
      'Allow 10 minutes to load a wave at the Rest House and 10 minutes to unload at Upper Village.',
      'Local pony handlers are extra. They are not part of the eight. Two of your group still walk with each wave.',
    ],
    groupSize: 8,
    people: [
      'Van driver and medic',
      'Four escorts, two per pony wave',
      'Two members who load bags and then keep the radio at the Rest House',
    ],
    resources: [
      { name: 'Van', detail: '8 seats including the driver. 40 km/h on metalled road only.' },
      { name: 'Four ponies', detail: '6 km/h on the ridge track. 2 bags each. They travel as a group of four.' },
      { name: 'Radio', detail: 'At the Rest House and with the van.' },
    ],
    routes: [
      { name: 'Rest House to Lower Village', detail: '4 km metalled. 4 / 40 hours = 6 minutes by van.' },
      { name: 'Lower Village to hospital', detail: '16 km metalled. 16 / 40 hours = 24 minutes by van. This road is open.' },
      { name: 'Rest House to Upper Village', detail: '6 km pony track. 6 / 6 hours = 60 minutes one way. The landslide road is not a route.' },
    ],
    map: '/images/gto/planning/baragali.svg',
    mapAlt: 'Sketch map of the Baragali track. The rest house connects by metalled road to Lower Village and then 16 km on to the hospital. A landslide blocks the metalled road toward Upper Village. A 6 km pony track crosses the ridge to Upper Village.',
    script: 'It is eight in the morning. Four sick people at Lower Village must reach hospital by eleven. Sixteen ration bags at the rest house must reach Upper Village by six in the evening. A landslide has closed the upper road. Ponies can use the ridge track. The van cannot. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Four sick people. Life. Deadline 11:00.',
        'Sixteen ration bags. Welfare. Deadline 18:00. The landslide blocks the truck road.',
        'The van and the ponies cannot swap routes.',
      ],
      priority: 'Life first, but both can start at 08:00 because they use different transport. Do not send the van up the blocked road to look at the landslide. Two pony waves move the bags, eight bags at a time.',
      steps: [
        '08:00. Van leaves with driver and medic. Lower Village at 08:06. Load four sick people until 08:16. Seats: driver, medic and four patients.',
        '08:16. Van leaves for hospital. 16 km at 40 km/h is 24 minutes. Hospital at 08:40, well before 11:00.',
        '08:00 to 08:10. Load the first eight bags. Two escorts go with the handlers.',
        '08:10. Ponies leave. Upper Village at 09:10. Unload until 09:20. They start back at 09:20 and reach the Rest House at 10:20.',
        '10:20 to 10:30. Load the second eight bags. The same two escorts can go again. Arrive Upper Village at 11:30. Unload finished at 11:40, long before 18:00.',
      ],
      regroup: 'Medic stays at the hospital until staff take over. Escorts and handlers are at Upper Village after the second unload and call the Rest House. The van does not try to fetch them across the landslide.',
    },
  },
  {
    id: 'rehri-fields',
    title: 'Rehri fields snake bite',
    difficulty: 'easy',
    setting: 'Irrigation fields outside a small dispensary',
    timeNow: '16:40',
    planningMinutes: 15,
    narrative: 'Your ISSB group is at Camp. A snake bite patient is at the Well with a local attendant. The patient must reach the dispensary. The pickup cannot use the track to the Well. A motorcycle can. After the patient is safe, a small pump part at the Workshop must reach the Well so the water pump can be repaired. That part is not as urgent as the patient.',
    mustAchieve: [
      'The snake bite patient is at the dispensary by 18:00.',
      'The pump part is at the Well by 19:00.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'The pickup is metalled road only. The motorcycle can use the track and the metalled road.',
      'The motorcycle has two seats including the rider. The medic does not fit on the return with the patient, so the medic waits at Camp and joins the pickup.',
      'Allow 5 minutes for the patient to mount at the Well, and 5 minutes to transfer the patient into the pickup at Camp.',
      'Allow 10 minutes to load the pump part at the Workshop.',
      'The local attendant stays at the Well. Do not count that person as a seat on your vehicles.',
    ],
    groupSize: 6,
    people: [
      'Motorcycle rider',
      'Medic',
      'Pickup driver',
      'Controller and two helpers at Camp',
    ],
    resources: [
      { name: 'Motorcycle', detail: '2 seats including the rider. 20 km/h on the track. 40 km/h on metalled road. It can carry the small pump part.' },
      { name: 'Pickup', detail: '4 seats including the driver. 40 km/h on metalled road only. It cannot reach the Well.' },
    ],
    routes: [
      { name: 'Camp to Well', detail: '3 km track. 3 / 20 hours = 9 minutes by motorcycle.' },
      { name: 'Camp to dispensary', detail: '10 km metalled. 10 / 40 hours = 15 minutes by pickup.' },
      { name: 'Camp to Workshop', detail: '4 km metalled. 4 / 40 hours = 6 minutes by motorcycle.' },
      { name: 'Workshop to Well', detail: 'There is no direct track. Go Workshop to Camp, then Camp to Well.' },
    ],
    map: '/images/gto/planning/rehri-fields.svg',
    mapAlt: 'Sketch map of Rehri fields. Camp is central. A 3 km track runs north to the Well. A 10 km metalled road runs east to the dispensary. A 4 km metalled road runs south to the Workshop.',
    script: 'It is twenty to five in the evening. A snake bite patient at the well must reach the dispensary by six. A pump part at the workshop must reach the well by seven. The pickup cannot use the track. The motorcycle has only two seats. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Snake bite. Life. Deadline 18:00.',
        'Pump part. Property and water supply. Deadline 19:00. It waits until the patient is moving.',
        'The pickup cannot reach the Well, so the motorcycle is the only link.',
      ],
      priority: 'Patient first. The medic stays at Camp because the motorcycle cannot carry rider, medic and patient together. The pump part uses the motorcycle only after the patient is in the pickup.',
      steps: [
        '16:40. Rider leaves Camp alone. Well at 16:49.',
        '16:49 to 16:54. Patient mounts. Local attendant stays behind.',
        '16:54. Motorcycle returns. Camp at 17:03. Rider and patient use the two seats.',
        '17:03 to 17:08. Transfer into the pickup. Driver, medic and patient leave at 17:08.',
        '17:08 to 17:23. Pickup covers 10 km at 40 km/h. Dispensary at 17:23, before 18:00.',
        '17:03. The motorcycle is free once the patient is off it. Rider goes to the Workshop. 4 km at 40 km/h is 6 minutes. Workshop at 17:09.',
        '17:09 to 17:19. Load the part. Back through Camp at 17:25. Well at 17:34. That is 9 minutes on the track. The part is there before 19:00.',
      ],
      regroup: 'Medic and driver stay at the dispensary until staff take the patient. Rider confirms the part is at the Well. Helpers never block the pickup by using it for the pump part.',
    },
  },
  {
    id: 'mehrabad',
    title: 'Mehrabad siding at night',
    difficulty: 'hard',
    setting: 'A freight yard at night on the plain',
    timeNow: '20:00',
    planningMinutes: 15,
    narrative: 'Your ISSB group is at the Yard. A coach attendant is badly injured at the Siding. The hospital is on the far side of a level crossing. A goods wagon is blocking that crossing. A railway gang will clear it only if your winch truck arrives by 21:00, and they will then have the crossing open at 21:40. A bus with wedding guests is waiting on the far side and cannot move until the crossing opens. The jeep can avoid the crossing on a kacha bypass. The winch truck cannot use that bypass.',
    mustAchieve: [
      'The injured attendant is at the hospital by 21:30.',
      'The winch truck is at the crossing by 21:00 so the gang can open it at 21:40.',
      'The bus can then reach the town hall by 23:00. The hall is 30 minutes beyond the crossing once the crossing is open. You do not drive the bus.',
    ],
    constraints: [
      'Planning time limit: 15 minutes.',
      'Do not walk the railway. The jeep uses the service track to the Siding.',
      'The winch truck is metalled road only. It is too heavy for the bypass.',
      'If the injured attendant waits for the crossing to open at 21:40, the hospital is still 18 minutes away and the 21:30 deadline is already missed.',
      'Allow 10 minutes to load the attendant at the Siding.',
      'You can phone the bus driver at 20:00 and tell him to move the moment the crossing opens.',
    ],
    groupSize: 10,
    people: [
      'Winch truck driver and two helpers who work under the railway gang',
      'Jeep driver, medic and stretcher hand',
      'Controller at the Yard',
      'Three members on the phone to the bus, the gang and the hospital',
    ],
    resources: [
      { name: 'Jeep', detail: '5 seats including the driver. 20 km/h on the service track and on the kacha bypass. 40 km/h on metalled road. It may use the bypass.' },
      { name: 'Winch truck', detail: '30 km/h on metalled road. Cannot use the bypass or the service track. The gang needs it at the crossing by 21:00.' },
      { name: 'Phone', detail: 'Working at the Yard. Bus driver, gang and hospital can answer.' },
    ],
    routes: [
      { name: 'Yard to Siding', detail: '6 km jeep track. 6 / 20 hours = 18 minutes. Same side of the crossing as the Yard.' },
      { name: 'Yard to crossing', detail: '8 km metalled. 8 / 30 hours = 16 minutes by winch truck.' },
      { name: 'Crossing to hospital', detail: '12 km metalled on the far side. 12 / 40 hours = 18 minutes by jeep, but only after 21:40 if you wait for the crossing. Too late for a 21:30 deadline.' },
      { name: 'Yard to hospital by bypass', detail: '12 km kacha. 12 / 20 hours = 36 minutes. This road never uses the crossing. Start it from the Yard after the attendant is back from the Siding.' },
      { name: 'Bus after the crossing opens', detail: '30 minutes from the crossing to the town hall. Opening time is 21:40 if the winch is there by 21:00.' },
    ],
    map: '/images/gto/planning/mehrabad.svg',
    mapAlt: 'Sketch map of Mehrabad siding at night. The yard connects by a 6 km jeep track to the siding and by 8 km of metalled road to a closed level crossing. The hospital is 12 km beyond the crossing. A 12 km kacha bypass loops south from the yard to the hospital and avoids the crossing.',
    script: 'It is eight at night. An injured attendant at the siding must reach hospital by half past nine. A winch truck must reach a blocked level crossing by nine so a gang can open it at twenty to ten. A bus on the far side then needs thirty minutes to reach the town hall by eleven. The jeep has a kacha bypass. The winch truck does not. You have fifteen minutes to plan.',
    solution: {
      problems: [
        'Injured attendant. Life. Deadline 21:30. Waiting for the crossing misses it, because the crossing opens at 21:40.',
        'Blocked crossing. Not the medical route for this patient. It is the bus route. The winch must be there by 21:00.',
        'Wedding bus. Time bound, not life threatening. Deadline 23:00 after a 30 minute drive once the crossing opens.',
      ],
      priority: 'Life uses the bypass, not the crossing. The winch still leaves at once, on its own road, or the bus misses the hall. Do not send the jeep to tow the wagon.',
      steps: [
        '20:00. Phone the bus driver to be ready to move at 21:40. Phone the gang to expect the winch.',
        '20:00. Winch truck leaves with driver and two helpers. 8 km at 30 km/h is 16 minutes. Crossing at 20:16, inside the 21:00 limit. The gang opens the crossing at 21:40.',
        '21:40. Bus leaves. Town hall at 22:10, before 23:00. Your group does not drive it.',
        '20:00. Jeep leaves with driver, medic and stretcher hand. Siding at 20:18. Load until 20:28. Back at the Yard at 20:46. Seats on the return: driver, medic, stretcher hand and the attendant.',
        '20:46. Jeep takes the kacha bypass, not the crossing. 12 km at 20 km/h is 36 minutes. Hospital at 21:22, eight minutes before 21:30.',
      ],
      regroup: 'Controller stays at the Yard on the phone. Winch crew stay with the gang until the crossing is open, then report. Medic stays at the hospital with the attendant. The phone party confirms the bus has cleared at 21:40. Nobody walks the rails.',
    },
  },
];
