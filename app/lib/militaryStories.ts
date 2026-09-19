export interface MilitaryStory {
  id: string;
  name: string;
  rank: string;
  award: 'Nishan-e-Haider' | 'Hilal-e-Kashmir (equivalent)';
  place: string;
  story: string;
  what: string;
  how: string;
  result: string;
  death: string;
  deathDate: string;
  memory: string;
  sources: { title: string; url: string }[];
  caution?: string;
}

export const awardExplanation: string = "Nishan-e-Haider is Pakistan's highest gallantry award, not a military rank. These 11 stories cover its 10 recipients and Naik Saif Ali Janjua, whose Hilal-e-Kashmir is officially equivalent. Captain, Major and the other service titles shown are ranks. Karnal is part of Captain Karnal Sher Khan's name, not the rank Colonel. Combat details follow the linked official Pakistani accounts; a local battlefield success does not mean victory in an entire war.";

export const militaryStories: MilitaryStory[] = [
  {
    id: 'muhammad-sarwar',
    name: 'Muhammad Sarwar',
    rank: 'Captain',
    award: 'Nishan-e-Haider',
    place: 'Tilpatra, Kashmir',
    story: 'Captain Muhammad Sarwar led an attack on a fortified position at Tilpatra in Kashmir. Barbed wire stopped his company close to the defenders. Radio Pakistan records that, despite a shoulder wound, he moved forward with six men and cut the wire under fire. The opening allowed the attack to continue towards its objective. He was killed by machine-gun fire on 27 July 1948. Remember: Sarwar, wounded shoulder, wire cut, way forward.',
    what: 'Opened a way through barbed wire during an attack on a fortified position.',
    how: 'Moved forward with six men and cut the wire despite a shoulder wound and enemy fire.',
    result: 'Removed the obstacle blocking the company and enabled the attack to continue.',
    death: 'Killed by machine-gun fire during the attack.',
    deathDate: '27 July 1948',
    memory: 'Sarwar: shoulder wound, wire cut, way forward.',
    sources: [
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Capt. Muhammad Sarwar Shaheed',
        url: 'https://www.radio.gov.pk/27-07-2025/martyrdom-anniversary-of-capt-muhammad-sarwar-shaheed-today',
      },
    ],
  },
  {
    id: 'saif-ali-janjua',
    name: 'Saif Ali Janjua',
    rank: 'Naik',
    award: 'Hilal-e-Kashmir (equivalent)',
    place: 'Bhudha Khanna, Kashmir',
    story: 'Naik Saif Ali Janjua commanded a platoon defending a post at Bhudha Khanna in Kashmir. The Army biography records that he led his men through repeated attacks and helped repel attempts to take the post. This kept the local position defended while the fighting continued. He was seriously wounded in the battle and died on 26 October 1948. His award was Hilal-e-Kashmir, equivalent to Nishan-e-Haider. Remember: Janjua, platoon leader holding a Kashmir post.',
    what: 'Defended a Kashmir post against repeated attacks.',
    how: 'Commanded the platoon at Bhudha Khanna and led its resistance to the attacking troops.',
    result: 'Helped repel attacks and maintain the local defence.',
    death: 'Died after being seriously wounded in the battle.',
    deathDate: '26 October 1948',
    memory: 'Janjua: platoon, Kashmir post, equivalent award.',
    sources: [
      {
        title: 'Pakistan Army archived biography: Naik Saif Ali Janjua',
        url: 'https://web.archive.org/web/20191107182258/https:/pakistanarmy.gov.pk/Naik-Saif-Ali-Janjua.php',
      },
    ],
    caution: 'His Hilal-e-Kashmir was declared equivalent to Nishan-e-Haider, not a second separate award. The biography does not identify the weapon that caused his fatal wounds.',
  },
  {
    id: 'tufail-muhammad',
    name: 'Tufail Muhammad',
    rank: 'Major',
    award: 'Nishan-e-Haider',
    place: 'Lakshmipur, then East Pakistan',
    story: 'Major Tufail Muhammad led an assault on an Indian post at Lakshmipur in then East Pakistan. Radio Pakistan describes how he divided his men into three groups and attacked in darkness. Despite bullet wounds in his abdomen, he used grenades against machine-gun positions and kept directing the attack. His men drove the opposing troops out of the post. He died from his wounds on 7 August 1958. Remember: Tufail, wounded commander, grenades, post cleared.',
    what: 'Led an assault to remove an Indian post at Lakshmipur.',
    how: 'Divided his men into three groups, attacked in darkness and used grenades despite being wounded.',
    result: 'His force drove the opposing troops out of the post.',
    death: 'Died from his combat wounds after being taken to hospital.',
    deathDate: '7 August 1958',
    memory: 'Tufail: wounded commander, grenades, post cleared.',
    sources: [
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Major Tufail Muhammad',
        url: 'https://www.radio.gov.pk/07-08-2018/major-tufail-shaheed-nishan-e-haider-martyrdom-anniversary-today',
      },
    ],
  },
  {
    id: 'raja-aziz-bhatti',
    name: 'Raja Aziz Bhatti',
    rank: 'Major',
    award: 'Nishan-e-Haider',
    place: 'Burki and the BRB Canal, Lahore',
    story: 'Major Raja Aziz Bhatti commanded a company defending the BRB Canal near Burki, Lahore. Radio Pakistan records that he stayed with his forward platoon for five days under tank and artillery fire, organizing the defence alongside his men. This helped hold the local canal line against repeated attacks. He was killed by an enemy shell on 12 September 1965. Remember: Bhatti, forward platoon, canal defence.',
    what: 'Organized the defence of the BRB Canal near Burki.',
    how: 'Stayed with his forward platoon under tank and artillery fire for five days.',
    result: 'Helped hold the local canal line against repeated attacks near Lahore.',
    death: 'Killed by an enemy shell while organizing the defence.',
    deathDate: '12 September 1965',
    memory: 'Bhatti: forward platoon, five days, BRB Canal.',
    sources: [
      {
        title: 'Radio Pakistan: 60th martyrdom anniversary of Major Aziz Bhatti Shaheed',
        url: 'https://www.radio.gov.pk/12-09-2025/60th-martyrdom-anniversary-of-major-aziz-bhatti-shaheed-being-observed-today',
      },
    ],
  },
  {
    id: 'rashid-minhas',
    name: 'Rashid Minhas',
    rank: 'Pilot Officer',
    award: 'Nishan-e-Haider',
    place: 'Goth Ahmed Shah, Sujawal, Sindh',
    story: 'Pilot Officer Rashid Minhas was preparing for a training flight when his instructor seized the aircraft and headed towards India. The official Pakistani account says Minhas fought for control, then forced the aircraft to crash before it crossed the border. This prevented the aircraft from being taken to India. He died in the crash near Sujawal on 20 August 1971. Remember: Minhas, training aircraft, resisted hijacking.',
    what: 'Resisted an attempt to take a training aircraft to India.',
    how: 'Struggled for control and, according to the official account, forced a crash before the border.',
    result: 'Prevented the aircraft from being taken across the border to India.',
    death: 'Died in the aircraft crash at Goth Ahmed Shah, Sujawal.',
    deathDate: '20 August 1971',
    memory: 'Minhas: training aircraft, struggle for control, border not crossed.',
    sources: [
      {
        title: 'Pakistan Army archived biography: Pilot Officer Rashid Minhas',
        url: 'https://web.archive.org/web/20200912111147/https:/pakistanarmy.gov.pk/Pilot-Officer-Rashid-Minhas.php',
      },
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Rashid Minhas, including crash location',
        url: 'https://www.radio.gov.pk/20-08-2023/martyrdom-anniversary-of-rashid-minhas-shaheed-nishan-e-haider-being-observed-today',
      },
    ],
    caution: 'The deliberate-crash description follows the official Pakistani account. Do not add unverified cockpit dialogue or technical details.',
  },
  {
    id: 'muhammad-akram',
    name: 'Muhammad Akram',
    rank: 'Major',
    award: 'Nishan-e-Haider',
    place: 'Hilli, then East Pakistan, now Bangladesh',
    story: 'Major Muhammad Akram commanded a company at Hilli in then East Pakistan. The Army account says he resisted repeated attacks and led an anti-tank party ahead of the defensive positions to engage enemy tanks. His resistance helped hold the local position and delay the Indian advance. He was killed fighting on 5 December 1971. Remember: Akram, Hilli, company commander leading the anti-tank party.',
    what: 'Defended his company position at Hilli against repeated attacks.',
    how: 'Led his men in defence and took an anti-tank party ahead of their positions to engage tanks.',
    result: 'Helped hold the local position and delay the advance at Hilli.',
    death: 'Killed fighting at Hilli.',
    deathDate: '5 December 1971',
    memory: 'Akram: Hilli, company defence, anti-tank party.',
    sources: [
      {
        title: 'Pakistan Army archived biography: Major Mohammad Akram',
        url: 'https://web.archive.org/web/20190922230311/https://pakistanarmy.gov.pk/Major-Mohammad-Akram.php',
      },
      {
        title: 'Radio Pakistan: 53rd martyrdom anniversary of Major Muhammad Akram',
        url: 'https://www.radio.gov.pk/05-12-2024/53rd-martyrdom-anniversary-of-maj-muhammad-akram-being-observed-today',
      },
    ],
    caution: 'Describe a local defence and delay, not a Pakistani victory in the wider war in East Pakistan.',
  },
  {
    id: 'shabbir-sharif',
    name: 'Shabbir Sharif',
    rank: 'Major',
    award: 'Nishan-e-Haider',
    place: 'High ground near Sulemanki Headworks',
    story: 'Major Shabbir Sharif led a company of 6 Frontier Force to capture high ground near Sulemanki Headworks. According to the official Army account, his men attacked defenders supported by tanks, took the ground and repelled counterattacks. Holding that ground strengthened their local position. He was killed by a tank shell on 6 December 1971. Remember: Shabbir, take the high ground, then hold it.',
    what: 'Captured high ground near Sulemanki Headworks and defended it against counterattacks.',
    how: 'Led his company against a position supported by tanks, then resisted attempts to retake it.',
    result: 'Secured and held a local tactical position.',
    death: 'Killed by a tank shell during the fighting.',
    deathDate: '6 December 1971',
    memory: 'Shabbir: Sulemanki, take the high ground, hold it.',
    sources: [
      {
        title: 'Pakistan Army archived biography: Major Shabbir Sharif',
        url: 'https://web.archive.org/web/20190922223314/https://pakistanarmy.gov.pk/Major-Shabbir-Sharif.php',
      },
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Major Shabbir Sharif Shaheed',
        url: 'https://www.radio.gov.pk/06-12-2019/martyrdom-anniversary-of-major-shabbir-sharif-shaheed-being-observed-today',
      },
    ],
    caution: 'The capture and defence of this position were local actions, not an overall victory in the war.',
  },
  {
    id: 'muhammad-hussain',
    name: 'Muhammad Hussain',
    rank: 'Sawar',
    award: 'Nishan-e-Haider',
    place: 'Harar Khurd',
    story: 'Sawar Muhammad Hussain served as a driver with 20th Lancers. Near Harar Khurd, he spotted enemy tanks by a minefield and directed recoilless-rifle fire onto them. ISPR credits the resulting fire with destroying tanks and strengthening the local defence. He was killed by machine-gun fire while directing the guns on 10 December 1971. Remember: Hussain, the driver who spotted tanks and guided fire.',
    what: 'Spotted enemy tanks and helped anti-tank crews engage them.',
    how: 'Directed recoilless-rifle fire near a minefield, taking initiative beyond his driving duties.',
    result: 'Helped destroy enemy tanks and defend the local position, according to ISPR.',
    death: 'Killed by machine-gun fire while directing the guns.',
    deathDate: '10 December 1971',
    memory: 'Hussain: driver, tank spotter, fire guide.',
    sources: [
      {
        title: 'ISPR archived biography: Sowar Muhammad Hussain Shaheed',
        url: 'https://web.archive.org/web/20190809100331/https:/www.ispr.gov.pk/sowar-hussain-shaheed.php',
      },
    ],
    caution: 'He directed the fire of anti-tank crews. Do not turn this into a claim that he destroyed the tanks alone as a tank gunner.',
  },
  {
    id: 'muhammad-mahfuz',
    name: 'Muhammad Mahfuz',
    rank: 'Lance Naik',
    award: 'Nishan-e-Haider',
    place: 'Pul Kunjry, Wagah-Attari sector',
    story: "Lance Naik Muhammad Mahfuz attacked a bunker at Pul Kunjry in the Wagah-Attari sector. Radio Pakistan says his machine gun was destroyed, so he entered the bunker and fought an enemy soldier at close quarters. His action supported his unit's assault on the position. He was killed by bayonet wounds during the night of 17 to 18 December 1971; his anniversary is observed on 18 December. Remember: Mahfuz, broken gun, bunker assault.",
    what: 'Attacked an enemy bunker during the Pul Kunjry operation.',
    how: 'Continued forward after his machine gun was destroyed and fought inside the bunker.',
    result: "Supported his unit's local assault on the position.",
    death: 'Killed by bayonet wounds during close combat inside the bunker, according to Radio Pakistan.',
    deathDate: 'Night of 17 to 18 December 1971',
    memory: 'Mahfuz: broken gun, bunker assault; remembered on 18 December.',
    sources: [
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Lance Naik Muhammad Mehfooz',
        url: 'https://radio.gov.pk/18-12-2021/50th-martyrdom-anniversary-of-lance-naik-muhammad-mehfooz-today',
      },
    ],
    caution: 'The action occurred during the night of 17 to 18 December. The martyrdom anniversary is commemorated on 18 December.',
  },
  {
    id: 'karnal-sher-khan',
    name: 'Karnal Sher Khan',
    rank: 'Captain',
    award: 'Nishan-e-Haider',
    place: 'Gultary area, Kargil sector',
    story: 'Captain Karnal Sher Khan defended mountain posts in the Gultary area during Kargil. The Army account says he led a counterattack after Indian troops took part of a post, recovering the lost portion. This supported the local defence, not an overall victory in Kargil. He was killed fighting on 5 July 1999. Remember: Captain Sher Khan, counterattack on a mountain post.',
    what: 'Defended mountain posts and counterattacked after part of a post was captured.',
    how: 'Personally led the counterattack to recover the lost portion, according to the Army account.',
    result: 'Recovered part of a local post and supported its defence, according to the official account.',
    death: 'Killed fighting during the Kargil conflict.',
    deathDate: '5 July 1999',
    memory: 'Captain Sher Khan: mountain post, counterattack; Karnal is his name.',
    sources: [
      {
        title: 'Pakistan Army archived biography: Captain Karnal Sher Khan',
        url: 'https://web.archive.org/web/20190922223934/https://pakistanarmy.gov.pk/Captain-Karnal-Sher-Khan.php',
      },
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Captain Karnal Sher Khan Shaheed',
        url: 'https://www.radio.gov.pk/05-07-2026/martyrdom-anniversary-of-captain-karnal-sher-khan-nishan-e-haider-being-observed-today',
      },
    ],
    caution: 'His actual rank was Captain. Karnal was part of his name, not the rank Colonel. The post action follows the official Pakistani account, not a claim of overall victory in Kargil.',
  },
  {
    id: 'lalak-jan',
    name: 'Lalak Jan',
    rank: 'Havildar',
    award: 'Nishan-e-Haider',
    place: 'Forward mountain post, Kargil sector',
    story: 'Havildar Lalak Jan volunteered for a forward mountain position in Kargil. According to the Army account, he helped repel repeated Indian attacks and stayed at his post after severe injuries during mortar fire. Radio Pakistan says he refused evacuation and continued fighting. His continued resistance helped hold the local position. He died from his wounds on 7 July 1999. Remember: Lalak Jan, wounded but still holding the post.',
    what: 'Defended a forward mountain post against repeated attacks.',
    how: 'Volunteered for the position, continued fighting after being wounded and refused evacuation.',
    result: 'Helped repel attacks and sustain the local defence.',
    death: 'Died from severe combat wounds while remaining at his post.',
    deathDate: '7 July 1999',
    memory: 'Lalak Jan: volunteered forward, wounded, held the post.',
    sources: [
      {
        title: 'Pakistan Army archived biography: Havildar Lalak Jan',
        url: 'https://web.archive.org/web/20190922223820/https://pakistanarmy.gov.pk/Havildar-Lalak-Jan.php',
      },
      {
        title: 'Radio Pakistan: 26th martyrdom anniversary of Havildar Lalak Jan',
        url: 'https://www.radio.gov.pk/07-07-2025/26th-martyrdom-anniversary-of-kargil-hero-halvaldar-lalak-being-observed-today',
      },
    ],
    caution: 'Describe resistance at a local post, not an overall victory in Kargil. Do not add an unsupported final shot, explosion or last words.',
  },
];
