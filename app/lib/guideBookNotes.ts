// Practical notes taken from two candidate guide books the user shared on 9 October 2026:
// an older ISSB / commission guide book (179 pages) and the Pro Genius Students psych guide.
// Rewritten in our own words. These are reported candidate experience, not official ISSB rules,
// and timings differ between batches, so each card says so where it matters.

export type GuideNote = {
  id: string;
  title: string;
  teaser: string;
  points: readonly string[];
  caution?: string;
};

export const guideBookCredit =
  'From candidate guide books (an older ISSB commission guide and the Pro Genius Students psych guide), rewritten in our own words. Reported experience, not official ISSB rules. Check issb.gov.pk for the official format.';

export const psychGuideNotes: readonly GuideNote[] = [
  {
    id: 'issb-four-days',
    title: 'Your 4 days at ISSB, in order',
    teaser: 'Reporting day forms, psych day, 2 GTO days, then departure. Know the rhythm before you go.',
    points: [
      'Reporting day: security check, phone handed in, room given (usually shared), documents checked, chest number and ISSB card issued, photo and height and weight taken, then the long biodata form session in the test hall.',
      'Day 1, psych day: intelligence tests first (repeaters usually sit out), then the psych tests in one sitting, written in a file of pages called the dossier.',
      'Days 2 and 3, GTO days: indoor tasks (discussion, lecturette, planning) and outdoor tasks. The Deputy President and psychologist interviews fit around these days.',
      'Departure day: some candidates are called for a re-interview, then phones are returned and you leave. Results come later.',
      'Carry: original CNIC or Form B, the call letter, original matric and inter certificates and result cards, blue ballpoints, a white tracksuit with white sports shoes, and normal clean clothes.',
      'Inside ISSB you address group members by chest number, not by name or "bhai". Move at a jog in the task area, and stay in bounds.',
    ],
    caution: 'The official ISSB website is issb.gov.pk. Some old guides still print an older address.',
  },
  {
    id: 'wat-tips',
    title: 'Word Association, what guide books add',
    teaser: 'One quick sentence per word. If the sentence will not come, write a related word, never leave it blank.',
    points: [
      'Each word flashes for only a few seconds, so write the first sound, positive, real sentence that comes to you.',
      'Stuck? Write a word linked to it (Love → "Mother"). Still stuck? Write the word itself and move on.',
      'Turn negative words into action, not hate. For "Kill": "I killed a snake that entered the classroom" works. "I killed my enemy" does not.',
      'Never insult your nation or a group. "I hate my nation" or "Pakistanis are lazy" raise red flags at once.',
    ],
    caution: 'Counts and timings vary by report. The older guide book says 76 words at 8 seconds each. This site practises at 12 seconds so beginners can build speed first.',
  },
  {
    id: 'sct-tips',
    title: 'Sentence Completion, what guide books add',
    teaser: 'Several sheets of half sentences, in English and in Urdu. Finish each one with a sensible, positive thought.',
    points: [
      'Candidates report 3 sheets of about 26 half sentences each, 2 in English and 1 in Urdu, at roughly 7 minutes per sheet.',
      'Complete the thought in a way that shows judgement. "Today girls are... intelligent and working hard" is better than "...fashionable".',
      'Keep it short and grammatical. One clear idea per line beats a long clever one.',
    ],
    caution: '26 sentences in 7 minutes is about 16 seconds each. This site uses 15 seconds per prompt, which is close.',
  },
  {
    id: 'picture-story-tips',
    title: 'Picture Story (TAT), what guide books add',
    teaser: '30 seconds to look, 3 minutes 30 seconds to write. A named hero, a real problem, effort, a setback, a fix, a result.',
    points: [
      'The picture is black and white and deliberately dim. Look for the main person, what just happened, and what they might do next.',
      'Give the hero a real name, an age and a role, like "Behram, 21, a university athlete". Never "Mr X".',
      'A strong pattern: a real problem, a first effort, a setback, a smarter second plan, then a good result that helps others too.',
      'Keep it positive and practical, about 8 to 10 lines. Avoid deaths, killings and accidents as the main event, and avoid a lucky rescue by someone else.',
      'Example plot from the Pro Genius guide: a student weak in English reads newspapers aloud, gets little progress, then asks his teacher for speaking practice and records himself until he becomes fluent.',
    ],
    caution: 'Both guides agree on 30 seconds viewing and 3 minutes 30 seconds writing, the same as this site. The Pro Genius guide says 4 pictures, the older guide says 3.',
  },
  {
    id: 'pointer-story-tips',
    title: 'Pointer stories, the half sentence story',
    teaser: 'You get the opening of a sentence and must turn it into a full story in about 3 minutes.',
    points: [
      'A line such as "On a dark stormy night, she was all alone in her home and suddenly..." appears on screen. Your story must start from it.',
      'Do not let the opening drag you into fear or crime. Turn it: the "sudden" thing can be good news, a chance to help, or a problem you solve.',
      'Use solid names (Junaid, Yasmin), not Mr X. End with action and a lesson, not a dream.',
      'Practice openings from the guides: "He joined the army for money, but...", "He worked very hard but...", "On seeing a lonely girl on the road, he...", "Their relations were very good but suddenly...".',
    ],
    caution: 'Guides report 3 pointer stories at about 3 minutes (Pro Genius says 3 minutes 30 seconds). A slide from another batch showed 2 stories at 4 minutes. Practise with whatever your batch announces.',
  },
  {
    id: 'self-description-tips',
    title: 'Self description, write only what is true',
    teaser: 'A short timed write on your strengths and weaknesses. The psychologist will check it against you.',
    points: [
      'You list your merits and demerits honestly, often as others see you (parents, friends, teachers) and as you see yourself.',
      'Remember what you wrote. The psychologist reads the whole dossier before your interview and will ask about it.',
      'For each weakness, add what you are doing about it. "I get nervous on stage, so I joined the debating club" shows maturity.',
    ],
    caution: 'The older guide says 5 minutes, a later batch slide suggests about 8 minutes. Plan for a short, honest page either way.',
  },
  {
    id: 'interviews-tips',
    title: 'The 2 interviews, how they differ',
    teaser: 'The Deputy President checks maturity and confidence. The psychologist checks if your dossier matches the real you.',
    points: [
      'Deputy President (a Lt Col or Col): introduction, studies, family, why the forces, ISSB days, GK, Pakistan studies, Islamiat, basic physics and quick mental maths such as 60 percent of 60 or 0.5 divided by 0.0005.',
      'Psychologist (often a Captain or Major, male or female): compares your answers with your psych tests and biodata, and may ask awkward or personal questions on purpose.',
      'Answer uncomfortable questions calmly, briefly and with dignity. The test is your composure, not a shocking reply.',
      'Expect "what will you do if you are not recommended?" and "what if your mother says no?". Have a mature, honest answer ready.',
    ],
  },
];

export const gtoGuideNotes: readonly GuideNote[] = [
  {
    id: 'gto-colour-rules',
    title: 'Task area colours and the 2 feet rule',
    teaser: 'Red means out of bounds. Red and white is for materials only. Other colours are safe for both.',
    points: [
      'Red painted parts are out of bounds for candidates and materials.',
      'Red and white parts are out of bounds for candidates, but materials may touch them.',
      'Blue, yellow, white or other colours are in bounds for both.',
      'The ground between start and finish is usually out of bounds. Touch it and you restart from the last step, not from the start.',
      'The 2 feet rule: no step longer than a normal stride, and no jumping, unless the GTO says jumping is allowed. Some tasks also ban throwing, so materials pass hand to hand.',
      'Usual materials: plank (small and large), bamboo, rope, drum, box, tyre. Everyone and every item must cross the finish line.',
    ],
  },
  {
    id: 'gto-task-sequence',
    title: 'Outdoor group tasks, in the order you meet them',
    teaser: 'Progressive group task, half group task, command task, final group task, then mutual assessment.',
    points: [
      'Progressive Group Task: about 3 stages that get harder. The whole group works together.',
      'Half Group Task: the group is split into 2 or 3 smaller teams, each with a shorter task. Quieter candidates are easier to see here.',
      'Command Task: each candidate in turn is the commander. You get a short time to plan, pick helpers, then brief and lead them. Nobody may disobey the commander.',
      'Final Group Task: the whole group again, often briefed and run in English. The GTO may give short concessions, like "the ground is in bounds for chest number 4 for 20 seconds". Use them fast.',
      'Mutual assessment: you rank every group member, including yourself, in honest order. It tests your judgement and fairness.',
    ],
    caution: 'Reported times vary: the older guide gives about 40 minutes for the progressive task, 10 for the half group task and 20 for the final group task. This is candidate experience, not an official schedule.',
  },
  {
    id: 'gto-indoor-notes',
    title: 'Discussion, lecturette and planning, extra tips',
    teaser: 'Discussion and lecturette are usually in Urdu. Planning is a 15 minute team problem on a model.',
    points: [
      'Group discussion: about 15 minutes on a topic, no fixed turns. Enter with a point, bring others in, never shout.',
      'Lecturette: a topic, about 2 minutes to think, then about 3 minutes to speak. A Quran or Hadith reference, a line of Iqbal and one real example make a talk memorable.',
      'Group planning: listen closely to the briefing on roads, speeds, distances and resources. Plan as a group, not in small side groups.',
      'Many planning problems are never fully solved. The GTO watches how you think and work with others.',
      'Common topics from the guide: democracy or dictatorship, mobile phones in college, co-education, can Pakistan run without IMF loans, is the media misusing its freedom, Pak Afghan relations.',
    ],
  },
  {
    id: 'obstacles-notes',
    title: 'Individual obstacles, the guide book version',
    teaser: '9 obstacles (5 for women) in about 2 minutes, in any order. Red parts are out of bounds.',
    points: [
      'Start inside the circle and go on the whistle. Stop when the second whistle blows.',
      'Any order is allowed, but a planned sequence saves running time.',
      'If you fail one, you may try it again, but guides advise not more than twice. Move on rather than waste the clock.',
      'If time ends mid obstacle, climb down safely. Never jump from height.',
      'The 9 usually named: monkey bridge, Tarzan swing, rope climb, ditch, high jump, zig zag, boxing ring, tyre and hanging log. See the animations on the outdoor page.',
    ],
    caution: 'Guide books print marks for each obstacle (rope climb highest). ISSB does not publish these, so we do not treat them as official.',
  },
];
