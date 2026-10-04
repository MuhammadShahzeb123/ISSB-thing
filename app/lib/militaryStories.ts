export interface MilitaryStory {
  id: string;
  name: string;
  rank: string;
  award: 'Nishan-e-Haider';
  unit: string;
  service: 'Pakistan Army' | 'Pakistan Air Force' | 'Pakistan Navy';
  conflict: string;
  place: string;
  /** One-line card hook. */
  summary: string;
  /** Full spoken-style story shown in the card body. No key-point lists. */
  story: string;
  /** Flowing spoken narration. No dashes, colons, or bullets. */
  spokenScript: string;
  what: string;
  how: string;
  result: string;
  death: string;
  deathDate: string;
  memory: string;
  /** Local path under /public, when a free-licensed image is available. */
  image?: string;
  /** Card photos are person portraits only (no monuments). */
  imageKind?: 'portrait';
  imageCredit?: string;
  sources: { title: string; url: string }[];
  caution?: string;
}

export const awardExplanation: string =
  "Nishan-e-Haider is Pakistan's highest gallantry award, not a military rank. These cards cover all 11 people honoured at Nishan-e-Haider level (including Naik Saif Ali Janjua). Captain, Major and the other service titles shown are ranks. Karnal is part of Captain Karnal Sher Khan's name, not the rank Colonel. Combat details follow the linked official Pakistani accounts; a local battlefield success does not mean victory in an entire war.";

export const militaryStories: MilitaryStory[] = [
  {
    id: 'muhammad-sarwar',
    name: 'Muhammad Sarwar',
    rank: 'Captain',
    award: 'Nishan-e-Haider',
    unit: '2 Punjab Regiment',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1947–48',
    place: 'Tilpatra, Kashmir',
    summary: 'He cut the wire under fire so his company could move.',
    story: `Start in Kashmir in 1948.

The fighting is close, and the ground in front of Captain Muhammad Sarwar's company is not open.

There is a fortified position at Tilpatra.

His job is to take the attack forward.

Then the wire stops them.

Barbed wire sits between his men and the defenders.

Machine guns are waiting on the other side.

Sarwar is already wounded in the shoulder.

He does not wait for someone else to fix the problem.

Radio Pakistan records that he moves forward with six men and cuts the wire under fire.

Think about the situation.

You are hurt.

The wire is still up.

Your company cannot advance until someone opens a path.

And the guns on the other side are still firing.

He cuts the path anyway.

The opening lets the attack continue toward its objective.

Then comes the final moment.

On 27 July 1948, Captain Muhammad Sarwar is killed by machine-gun fire.

Pakistan later awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

He is the first man to receive Pakistan's highest gallantry award.`,
    spokenScript: "Captain Muhammad Sarwar. Start in Kashmir in 1948. The fighting is close, and the ground in front of Captain Muhammad Sarwar's company is not open. There is a fortified position at Tilpatra. His job is to take the attack forward. Then the wire stops them. Barbed wire sits between his men and the defenders. Machine guns are waiting on the other side. Sarwar is already wounded in the shoulder. He does not wait for someone else to fix the problem. Radio Pakistan records that he moves forward with six men and cuts the wire under fire. Think about the situation. You are hurt. The wire is still up. Your company cannot advance until someone opens a path. And the guns on the other side are still firing. He cuts the path anyway. The opening lets the attack continue toward its objective. Then comes the final moment. On 27 July 1948, Captain Muhammad Sarwar is killed by machine gun fire. Pakistan later awards him the Nishan e Haider, posthumously. And here is the sharp fact. He is the first man to receive Pakistan's highest gallantry award.",
    what: 'Opened a way through barbed wire during an attack on a fortified position.',
    how: 'Moved forward with six men and cut the wire despite a shoulder wound and enemy fire.',
    result: 'Removed the obstacle blocking the company and enabled the attack to continue.',
    death: 'Killed by machine-gun fire during the attack.',
    deathDate: '27 July 1948',
    memory: 'Sarwar: shoulder wound, wire cut, way forward.',
    image: '/images/martyrs/muhammad-sarwar.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (Pakistan Army likeness; educational use)',
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
    award: 'Nishan-e-Haider',
    unit: '18 Azad Kashmir Regiment',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1947–48',
    place: 'Bhudha Khanna, Kashmir',
    summary: 'A platoon leader who held a Kashmir post until his wounds took him.',
    story: `Now to Bhudha Khanna in Kashmir.

This story belongs to a junior leader, not a company commander.

Naik Saif Ali Janjua.

He commands a platoon defending a post.

The job sounds simple.

Hold the post.

The Army biography records that attacks keep coming.

He leads his men through them.

He helps repulse attempts to take the position.

Think about the situation.

You are a naik with a platoon.

The post is yours to keep.

If it falls, the local line opens.

You stay with the fight.

He is seriously wounded in the battle.

He dies of those wounds on 26 October 1948.

Pakistan later places him among the Nishan-e-Haider level recipients.

And here is the sharp fact.

He was first awarded the Hilal-e-Kashmir, later declared equivalent to Nishan-e-Haider, which is why he stands in this list of eleven.`,
    spokenScript: "Naik Saif Ali Janjua. Now to Bhudha Khanna in Kashmir. This story belongs to a junior leader, not a company commander. Naik Saif Ali Janjua. He commands a platoon defending a post. The job sounds simple. Hold the post. The Army biography records that attacks keep coming. He leads his men through them. He helps repulse attempts to take the position. Think about the situation. You are a naik with a platoon. The post is yours to keep. If it falls, the local line opens. You stay with the fight. He is seriously wounded in the battle. He dies of those wounds on 26 October 1948. Pakistan later places him among the Nishan e Haider level recipients. And here is the sharp fact. He was first awarded the Hilal e Kashmir, later declared equivalent to Nishan e Haider, which is why he stands in this list of eleven.",
    what: 'Defended a Kashmir post against repeated attacks.',
    how: 'Commanded the platoon at Bhudha Khanna and led its resistance to the attacking troops.',
    result: 'Helped repel attacks and maintain the local defence.',
    death: 'Died after being seriously wounded in the battle.',
    deathDate: '26 October 1948',
    memory: 'Janjua: platoon, Kashmir post, held the line.',
    image: '/images/martyrs/saif-ali-janjua.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikimedia Commons CC BY 2.0 (portrait crop from battle-account board)',
    sources: [
      {
        title: 'Pakistan Army archived biography: Naik Saif Ali Janjua',
        url: 'https://web.archive.org/web/20191107182258/https:/pakistanarmy.gov.pk/Naik-Saif-Ali-Janjua.php',
      },
    ],
    caution: 'Originally awarded Hilal-e-Kashmir, later declared equivalent to Nishan-e-Haider. Listed here among the eleven NH-level recipients. The biography does not identify the weapon that caused his fatal wounds.',
  },
  {
    id: 'tufail-muhammad',
    name: 'Tufail Muhammad',
    rank: 'Major',
    award: 'Nishan-e-Haider',
    unit: 'East Pakistan Rifles (Border Guards)',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani border skirmish, 1958',
    place: 'Lakshmipur, then East Pakistan',
    summary: 'Wounded in the abdomen, he still cleared the post with grenades.',
    story: `Leave the high mountains for a moment.

This one is night fighting in then East Pakistan.

Major Tufail Muhammad.

His target is an Indian post at Lakshmipur.

Radio Pakistan describes how he divides his men into three groups and attacks in darkness.

His job is to clear the post.

Then he is hit.

Bullet wounds in the abdomen.

He does not leave the fight.

He uses grenades against machine-gun positions.

He keeps directing the attack.

Think about the situation.

You are bleeding from the stomach.

Machine guns are still alive in front of you.

Your men are waiting on your orders.

You throw grenades and keep them moving.

His men drive the opposing troops out of the post.

Then comes the final moment.

He dies of his wounds on 7 August 1958.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

This is not a full war chapter. It is a border fight, and he still finishes the assault while dying.`,
    spokenScript: "Major Tufail Muhammad. Leave the high mountains for a moment. This one is night fighting in then East Pakistan. Major Tufail Muhammad. His target is an Indian post at Lakshmipur. Radio Pakistan describes how he divides his men into three groups and attacks in darkness. His job is to clear the post. Then he is hit. Bullet wounds in the abdomen. He does not leave the fight. He uses grenades against machine gun positions. He keeps directing the attack. Think about the situation. You are bleeding from the stomach. Machine guns are still alive in front of you. Your men are waiting on your orders. You throw grenades and keep them moving. His men drive the opposing troops out of the post. Then comes the final moment. He dies of his wounds on 7 August 1958. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. This is not a full war chapter. It is a border fight, and he still finishes the assault while dying.",
    what: 'Led an assault to remove an Indian post at Lakshmipur.',
    how: 'Divided his men into three groups, attacked in darkness and used grenades despite being wounded.',
    result: 'His force drove the opposing troops out of the post.',
    death: 'Died from his combat wounds after being taken to hospital.',
    deathDate: '7 August 1958',
    memory: 'Tufail: wounded commander, grenades, post cleared.',
    image: '/images/martyrs/tufail-muhammad.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (Pakistan Army likeness; educational use)',
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
    unit: '17 Punjab Regiment',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1965',
    place: 'Burki and the BRB Canal, Lahore',
    summary: 'Five days on the BRB Canal. The only Nishan-e-Haider of 1965.',
    story: `Now let's move to Lahore.

This is a completely different story.

And this one has a very specific hero.

Major Raja Aziz Bhatti.

He was a company commander in the 17 Punjab Regiment.

His men were defending the BRB Canal near Lahore.

The Indian Army was attacking toward the Lahore area.

Major Bhatti's job was simple to describe but extremely difficult to do.

Hold the position.

Day after day.

Night after night.

For approximately five days and nights, Bhatti and his men remained under heavy enemy fire.

There were artillery shells, machine-gun fire, small-arms fire, and tanks.

He was exhausted.

He had barely slept.

But he kept directing his men and artillery.

The Army Institute of Military History says that Bhatti organized the defence of the canal while facing continuous enemy small-arms, tank and artillery fire.

Think about the situation.

You're sitting in a defensive position.

You know enemy tanks are nearby.

Artillery shells are exploding around you.

Your soldiers are tired.

Some of them are wounded.

And you're still responsible for telling them where to fire, where to move, and to hold this position.

He didn't leave.

Then came the final moment.

On 12 September 1965, Major Bhatti was directing his artillery fire from the forward position.

An Indian tank shell hit him.

He was killed.

He had spent days defending the position, and he died while still directing the fight.

Pakistan later awarded him the Nishan-e-Haider, posthumously.

And here's something important.

Major Aziz Bhatti was the only Nishan-e-Haider recipient of the 1965 war.`,
    spokenScript: "Major Raja Aziz Bhatti. Now let's move to Lahore. This is a completely different story. And this one has a very specific hero. Major Raja Aziz Bhatti. He was a company commander in the 17 Punjab Regiment. His men were defending the BRB Canal near Lahore. The Indian Army was attacking toward the Lahore area. Major Bhatti's job was simple to describe but extremely difficult to do. Hold the position. Day after day. Night after night. For approximately five days and nights, Bhatti and his men remained under heavy enemy fire. There were artillery shells, machine gun fire, small arms fire, and tanks. He was exhausted. He had barely slept. But he kept directing his men and artillery. The Army Institute of Military History says that Bhatti organized the defence of the canal while facing continuous enemy small arms, tank and artillery fire. Think about the situation. You're sitting in a defensive position. You know enemy tanks are nearby. Artillery shells are exploding around you. Your soldiers are tired. Some of them are wounded. And you're still responsible for telling them where to fire, where to move, and to hold this position. He didn't leave. Then came the final moment. On 12 September 1965, Major Bhatti was directing his artillery fire from the forward position. An Indian tank shell hit him. He was killed. He had spent days defending the position, and he died while still directing the fight. Pakistan later awarded him the Nishan e Haider, posthumously. And here's something important. Major Aziz Bhatti was the only Nishan e Haider recipient of the 1965 war.",
    what: 'Organized the defence of the BRB Canal near Burki.',
    how: 'Stayed with his forward platoon under tank and artillery fire for five days.',
    result: 'Helped hold the local canal line against repeated attacks near Lahore.',
    death: 'Killed by an enemy tank shell while directing artillery fire.',
    deathDate: '12 September 1965',
    memory: 'Bhatti: forward platoon, five days, BRB Canal.',
    image: '/images/martyrs/raja-aziz-bhatti.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (educational use)',
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
    unit: 'No. 2 Fighter Conversion Unit',
    service: 'Pakistan Air Force',
    conflict: 'Indo-Pakistani War of 1971',
    place: 'Goth Ahmed Shah, Sujawal, Sindh',
    summary: 'He crashed the trainer rather than let it cross into India.',
    story: `This one is not a trench story.

It happens in the air over Sindh.

Pilot Officer Rashid Minhas is with No. 2 Fighter Conversion Unit.

He is preparing for a training flight.

Then the aircraft is seized.

The man who tries to take it is Flight Lieutenant Matiur Rahman, also written Matiur Rehman.

During the 1971 war he tries to hijack the trainer Minhas is flying so he can defect to India.

Minhas's job is suddenly brutal and clear.

Stop the aircraft from crossing the border.

The official Pakistani account says he fights for control.

Then he forces a crash before the border.

Think about the situation.

You are young.

You are in a trainer, not a combat sortie.

Someone senior is trying to steal the jet out of the country.

If the plane reaches India, Pakistan loses the aircraft and the story.

Both men die when the plane crashes near Goth Ahmed Shah, Sujawal, on 20 August 1971.

Pakistan awards Minhas the Nishan-e-Haider, posthumously.

He is the only Pakistan Air Force recipient of the award.

Extra detail, and you should say it cleanly.

Pakistan remembers Matiur Rahman as a traitor.

Bangladesh remembers him as a hero and awarded him Bir Sreshtho.

Same crash. Two countries. Two verdicts.`,
    spokenScript: "Pilot Officer Rashid Minhas. This one is not a trench story. It happens in the air over Sindh. Pilot Officer Rashid Minhas is with No. 2 Fighter Conversion Unit. He is preparing for a training flight. Then the aircraft is seized. The man who tries to take it is Flight Lieutenant Matiur Rahman, also written Matiur Rehman. During the 1971 war he tries to hijack the trainer Minhas is flying so he can defect to India. Minhas's job is suddenly brutal and clear. Stop the aircraft from crossing the border. The official Pakistani account says he fights for control. Then he forces a crash before the border. Think about the situation. You are young. You are in a trainer, not a combat sortie. Someone senior is trying to steal the jet out of the country. If the plane reaches India, Pakistan loses the aircraft and the story. Both men die when the plane crashes near Goth Ahmed Shah, Sujawal, on 20 August 1971. Pakistan awards Minhas the Nishan e Haider, posthumously. He is the only Pakistan Air Force recipient of the award. Extra detail, and you should say it cleanly. Pakistan remembers Matiur Rahman as a traitor. Bangladesh remembers him as a hero and awarded him Bir Sreshtho. Same crash. Two countries. Two verdicts.",
    what: 'Resisted an attempt to take a training aircraft to India.',
    how: 'Struggled for control and, according to the official account, forced a crash before the border.',
    result: 'Prevented the aircraft from being taken across the border to India.',
    death: 'Died in the aircraft crash at Goth Ahmed Shah, Sujawal.',
    deathDate: '20 August 1971',
    memory: 'Minhas: training aircraft, struggle for control, border not crossed.',
    image: '/images/martyrs/rashid-minhas.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (PAF service photo; educational use)',
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
    unit: '4 Frontier Force Regiment',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1971',
    place: 'Hilli, then East Pakistan, now Bangladesh',
    summary: 'At Hilli he led the anti-tank party until he fell.',
    story: `Now to Hilli, in then East Pakistan.

Major Muhammad Akram commands a company of 4 Frontier Force.

The Indian advance is pressing the position.

His job is to hold.

The Army account says he resists repeated attacks.

He does more than sit behind the line.

He leads an anti-tank party ahead of the defensive positions to engage enemy tanks.

Think about the situation.

You are in East Pakistan in December 1971.

Tanks are part of the problem in front of you.

Your company is tired from repeated assaults.

And you walk the anti-tank fight forward yourself.

His resistance helps hold the local position and delay the advance at Hilli.

Then comes the final moment.

He is killed fighting on 5 December 1971.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

This is a local stand and a delay, not a claim that East Pakistan was saved.`,
    spokenScript: "Major Muhammad Akram. Now to Hilli, in then East Pakistan. Major Muhammad Akram commands a company of 4 Frontier Force. The Indian advance is pressing the position. His job is to hold. The Army account says he resists repeated attacks. He does more than sit behind the line. He leads an anti tank party ahead of the defensive positions to engage enemy tanks. Think about the situation. You are in East Pakistan in December 1971. Tanks are part of the problem in front of you. Your company is tired from repeated assaults. And you walk the anti tank fight forward yourself. His resistance helps hold the local position and delay the advance at Hilli. Then comes the final moment. He is killed fighting on 5 December 1971. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. This is a local stand and a delay, not a claim that East Pakistan was saved.",
    what: 'Defended his company position at Hilli against repeated attacks.',
    how: 'Led his men in defence and took an anti-tank party ahead of their positions to engage tanks.',
    result: 'Helped hold the local position and delay the advance at Hilli.',
    death: 'Killed fighting at Hilli.',
    deathDate: '5 December 1971',
    memory: 'Akram: Hilli, company defence, anti-tank party.',
    image: '/images/martyrs/muhammad-akram.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikimedia Commons / ISPR (CC BY-SA 4.0)',
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
    unit: '6 Frontier Force Regiment',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1971',
    place: 'High ground near Sulemanki Headworks',
    summary: 'Take the high ground near Sulemanki. Then hold it.',
    story: `Shift west to the Sulemanki area.

Major Shabbir Sharif leads a company of 6 Frontier Force.

In front of them is high ground near the headworks.

His job is not only to attack.

It is to take the ground and keep it.

According to the official Army account, the defenders are supported by tanks.

His men attack anyway.

They take the high ground.

Then the counterattacks come.

They hold.

Think about the situation.

You have just seized a piece of ground the enemy wanted.

Tanks were part of the defence.

Now the enemy wants it back.

Holding it is the second half of the story.

Then comes the final moment.

On 6 December 1971, Major Shabbir Sharif is killed by a tank shell.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

Take the high ground. Then hold it. That is the whole lesson of Sulemanki.`,
    spokenScript: "Major Shabbir Sharif. Shift west to the Sulemanki area. Major Shabbir Sharif leads a company of 6 Frontier Force. In front of them is high ground near the headworks. His job is not only to attack. It is to take the ground and keep it. According to the official Army account, the defenders are supported by tanks. His men attack anyway. They take the high ground. Then the counterattacks come. They hold. Think about the situation. You have just seized a piece of ground the enemy wanted. Tanks were part of the defence. Now the enemy wants it back. Holding it is the second half of the story. Then comes the final moment. On 6 December 1971, Major Shabbir Sharif is killed by a tank shell. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. Take the high ground. Then hold it. That is the whole lesson of Sulemanki.",
    what: 'Captured high ground near Sulemanki Headworks and defended it against counterattacks.',
    how: 'Led his company against a position supported by tanks, then resisted attempts to retake it.',
    result: 'Secured and held a local tactical position.',
    death: 'Killed by a tank shell during the fighting.',
    deathDate: '6 December 1971',
    memory: 'Shabbir: Sulemanki, take the high ground, hold it.',
    image: '/images/martyrs/shabbir-sharif.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (educational use)',
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
    unit: '20 Lancers (Armoured Corps)',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1971',
    place: 'Harar Khurd',
    summary: 'A driver who spotted tanks and guided the guns onto them.',
    story: `This hero is not an officer with a company.

He is a driver.

Sawar Muhammad Hussain of 20 Lancers.

Near Harar Khurd he sees enemy tanks by a minefield.

His formal job is to drive.

What he actually does is larger.

He directs recoilless-rifle fire onto those tanks.

ISPR credits the resulting fire with destroying tanks and strengthening the local defence.

Think about the situation.

You are not the gunner by appointment.

You see the threat first.

You stay exposed long enough to guide the guns.

That is initiative under fire.

Then comes the final moment.

On 10 December 1971, he is killed by machine-gun fire while directing the guns.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

A sawar who was supposed to drive becomes the man who spots tanks and walks the fire onto them.`,
    spokenScript: "Sawar Muhammad Hussain. This hero is not an officer with a company. He is a driver. Sawar Muhammad Hussain of 20 Lancers. Near Harar Khurd he sees enemy tanks by a minefield. His formal job is to drive. What he actually does is larger. He directs recoilless rifle fire onto those tanks. ISPR credits the resulting fire with destroying tanks and strengthening the local defence. Think about the situation. You are not the gunner by appointment. You see the threat first. You stay exposed long enough to guide the guns. That is initiative under fire. Then comes the final moment. On 10 December 1971, he is killed by machine gun fire while directing the guns. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. A sawar who was supposed to drive becomes the man who spots tanks and walks the fire onto them.",
    what: 'Spotted enemy tanks and helped anti-tank crews engage them.',
    how: 'Directed recoilless-rifle fire near a minefield, taking initiative beyond his driving duties.',
    result: 'Helped destroy enemy tanks and defend the local position, according to ISPR.',
    death: 'Killed by machine-gun fire while directing the guns.',
    deathDate: '10 December 1971',
    memory: 'Hussain: driver, tank spotter, fire guide.',
    image: '/images/martyrs/muhammad-hussain.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (educational use)',
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
    unit: '15 Punjab Regiment',
    service: 'Pakistan Army',
    conflict: 'Indo-Pakistani War of 1971',
    place: 'Pul Kunjry, Wagah-Attari sector',
    summary: 'Broken machine gun. Then the bunker at close quarters.',
    story: `Now to the Wagah-Attari sector.

Lance Naik Muhammad Mahfuz of 15 Punjab.

The fight is at Pul Kunjry.

His job in the assault is to press a bunker.

Radio Pakistan says his machine gun is destroyed.

He does not stop.

He enters the bunker and fights at close quarters.

Think about the situation.

Your main weapon is gone.

The bunker is still there.

Your unit's assault still needs that position broken.

You go in anyway.

He is killed by bayonet wounds during the night of 17 to 18 December 1971.

His anniversary is observed on 18 December.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

Broken gun. Then the bunker. That is the memory that survives.`,
    spokenScript: "Lance Naik Muhammad Mahfuz. Now to the Wagah Attari sector. Lance Naik Muhammad Mahfuz of 15 Punjab. The fight is at Pul Kunjry. His job in the assault is to press a bunker. Radio Pakistan says his machine gun is destroyed. He does not stop. He enters the bunker and fights at close quarters. Think about the situation. Your main weapon is gone. The bunker is still there. Your unit's assault still needs that position broken. You go in anyway. He is killed by bayonet wounds during the night of 17 to 18 December 1971. His anniversary is observed on 18 December. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. Broken gun. Then the bunker. That is the memory that survives.",
    what: 'Attacked an enemy bunker during the Pul Kunjry operation.',
    how: 'Continued forward after his machine gun was destroyed and fought inside the bunker.',
    result: 'Supported his unit\'s local assault on the position.',
    death: 'Killed by bayonet wounds during close combat inside the bunker, according to Radio Pakistan.',
    deathDate: 'Night of 17 to 18 December 1971',
    memory: 'Mahfuz: broken gun, bunker assault; remembered on 18 December.',
    image: '/images/martyrs/muhammad-mahfuz.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (educational use)',
    sources: [
      {
        title: 'Radio Pakistan: Martyrdom anniversary of Lance Naik Muhammad Mehfooz',
        url: 'https://radio.gov.pk/18-12-2021/50th-martyrdom-anniversary-of-lance-naik-muhammad-mehfooz-today',
      },
    ],
    caution: 'The action occurred during the night of 17 to 18 December. The martyrdom anniversary is commemorated on 18 December. Portrait hosted for educational ISSB study use with attribution; re-check licence before commercial reuse.',
  },
  {
    id: 'karnal-sher-khan',
    name: 'Karnal Sher Khan',
    rank: 'Captain',
    award: 'Nishan-e-Haider',
    unit: '12 Northern Light Infantry',
    service: 'Pakistan Army',
    conflict: 'Kargil conflict, 1999',
    place: 'Gultary area, Kargil sector',
    summary: 'He counterattacked a mountain post and took it back.',
    story: `Climb into the Kargil sector in 1999.

Captain Karnal Sher Khan of 12 Northern Light Infantry.

Say the name carefully.

Karnal is part of his name, not the rank Colonel.

His rank is Captain.

He is defending mountain posts in the Gultary area.

Then Indian troops take part of a post.

His job becomes the hardest version of defence.

Get it back.

The Army account says he leads the counterattack himself.

He recovers the lost portion.

Think about the situation.

You are high on a ridge.

Part of your post is gone.

Thin air. Thin numbers.

And you still have to push men back uphill into fire.

This supports the local defence.

It is not an overall victory in Kargil.

Then comes the final moment.

He is killed fighting on 5 July 1999.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

Captain Sher Khan, counterattack on a mountain post, and Karnal is his name.`,
    spokenScript: "Captain Karnal Sher Khan. Climb into the Kargil sector in 1999. Captain Karnal Sher Khan of 12 Northern Light Infantry. Say the name carefully. Karnal is part of his name, not the rank Colonel. His rank is Captain. He is defending mountain posts in the Gultary area. Then Indian troops take part of a post. His job becomes the hardest version of defence. Get it back. The Army account says he leads the counterattack himself. He recovers the lost portion. Think about the situation. You are high on a ridge. Part of your post is gone. Thin air. Thin numbers. And you still have to push men back uphill into fire. This supports the local defence. It is not an overall victory in Kargil. Then comes the final moment. He is killed fighting on 5 July 1999. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. Captain Sher Khan, counterattack on a mountain post, and Karnal is his name.",
    what: 'Defended mountain posts and counterattacked after part of a post was captured.',
    how: 'Personally led the counterattack to recover the lost portion, according to the Army account.',
    result: 'Recovered part of a local post and supported its defence, according to the official account.',
    death: 'Killed fighting during the Kargil conflict.',
    deathDate: '5 July 1999',
    memory: 'Captain Sher Khan: mountain post, counterattack; Karnal is his name.',
    image: '/images/martyrs/karnal-sher-khan.jpg',
    imageKind: 'portrait',
    imageCredit: 'Wikipedia fair-use portrait (educational use)',
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
    caution: 'His actual rank was Captain. Karnal was part of his name, not the rank Colonel. Portrait hosted for educational ISSB study use with attribution; re-check licence before commercial reuse.',
  },
  {
    id: 'lalak-jan',
    name: 'Lalak Jan',
    rank: 'Havildar',
    award: 'Nishan-e-Haider',
    unit: '12 Northern Light Infantry',
    service: 'Pakistan Army',
    conflict: 'Kargil conflict, 1999',
    place: 'Forward mountain post, Kargil sector',
    summary: 'Wounded at a forward post. He refused to leave.',
    story: `Still in Kargil.

Still with 12 Northern Light Infantry.

This time the man is Havildar Lalak Jan.

He volunteers for a forward mountain position.

His job is to hold that post against repeated attacks.

According to the Army account, he helps repel them.

Then mortar fire wounds him badly.

Radio Pakistan says he refuses evacuation.

He keeps fighting.

Think about the situation.

You are already hurt.

Someone can pull you back.

The post still needs rifles on the lip.

You stay.

His continued resistance helps hold the local position.

Then comes the final moment.

He dies of his wounds on 7 July 1999.

Pakistan awards him the Nishan-e-Haider, posthumously.

And here is the sharp fact.

Lalak Jan volunteered forward, was wounded, and still held the post.`,
    spokenScript: "Havildar Lalak Jan. Still in Kargil. Still with 12 Northern Light Infantry. This time the man is Havildar Lalak Jan. He volunteers for a forward mountain position. His job is to hold that post against repeated attacks. According to the Army account, he helps repel them. Then mortar fire wounds him badly. Radio Pakistan says he refuses evacuation. He keeps fighting. Think about the situation. You are already hurt. Someone can pull you back. The post still needs rifles on the lip. You stay. His continued resistance helps hold the local position. Then comes the final moment. He dies of his wounds on 7 July 1999. Pakistan awards him the Nishan e Haider, posthumously. And here is the sharp fact. Lalak Jan volunteered forward, was wounded, and still held the post.",
    what: 'Defended a forward mountain post against repeated attacks.',
    how: 'Volunteered for the position, continued fighting after being wounded and refused evacuation.',
    result: 'Helped repel attacks and sustain the local defence.',
    death: 'Died from severe combat wounds while remaining at his post.',
    deathDate: '7 July 1999',
    memory: 'Lalak Jan: volunteered forward, wounded, held the post.',
    image: '/images/martyrs/lalak-jan.jpg',
    imageKind: 'portrait',
    imageCredit: 'Urdu Wikipedia fair-use portrait (educational use)',
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
