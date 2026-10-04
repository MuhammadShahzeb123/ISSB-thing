export type DeputyQuestion = {
  id: string;
  prompt: string;
  /** Short cue for the candidate. Not a model answer. */
  cue?: string;
};

export type DeputyInterviewType = {
  id: string;
  title: string;
  blurb: string;
  pace: string;
  note: string;
  questions: readonly DeputyQuestion[];
};

/**
 * Practice styles for a deputy-president style interview.
 * These are rehearsal prompts, not an official ISSB paper.
 */
export const deputyInterviewTypes: readonly DeputyInterviewType[] = [
  {
    id: "opening",
    title: "Opening and biodata",
    blurb: "Name, family, education, and why the armed forces. The board is checking that your life matches your form.",
    pace: "About a minute each",
    note: "Keep dates, marks, and names the same as your biodata. If a number is weak, explain it. Do not dress it up.",
    questions: [
      { id: "name", prompt: "Tell me your full name, where you live, and what you are doing now.", cue: "Name, city, study or work. Stop there." },
      { id: "family", prompt: "Who is in your family, and what does each person do?", cue: "Parents, brothers and sisters. Roles, not a speech." },
      { id: "school", prompt: "Walk through your education: schools, years, and results. Where did your marks rise or fall?", cue: "Own the dip. Say what you did next." },
      { id: "hobbies", prompt: "Which games or hobbies are actually yours, not ones you wrote to impress a board?", cue: "Only claim what you can be questioned on." },
      { id: "why-forces", prompt: "Why the armed forces, and why this service rather than another?", cue: "Your reason, plus one real thing you know about the service." },
      { id: "if-not", prompt: "What will you do if you are not selected this time?", cue: "A real plan. No drama." },
    ],
  },
  {
    id: "personal",
    title: "Personal life and events",
    blurb: "Aim, failure, a turning point, and one incident you cannot forget. They want what you did, not a movie plot.",
    pace: "About a minute each",
    note: "Use a real event. Say what you decided, what you did, and what changed. Leave out private medical detail and anyone else's secrets.",
    questions: [
      { id: "aim", prompt: "What is your aim in life, in one sentence, and what have you already done toward it?", cue: "Aim, then one action you have taken." },
      { id: "failure", prompt: "Tell me about a failure that was your fault. What changed afterwards?", cue: "Your part first. Then the repair." },
      { id: "turning", prompt: "What was a turning point for you? What was different the next day?", cue: "One day, one decision." },
      { id: "incident", prompt: "Describe one unforgettable incident. What did you do, not only what happened around you?", cue: "Your action has to be in the story." },
      { id: "disagree", prompt: "When did you last disagree with someone older than you, and how did it end?", cue: "Respect and a result. Not a win." },
      { id: "duty-home", prompt: "What responsibility at home or college is actually yours?", cue: "A task you do when nobody is watching." },
    ],
  },
  {
    id: "affairs",
    title: "Current affairs and Pakistan",
    blurb: "Pakistan, the neighbourhood, and how you handle news. A calm fact beats a loud opinion.",
    pace: "About a minute each",
    note: "Name the issue, one fact you are sure of, why it matters, and stop. If you do not know, say so.",
    questions: [
      { id: "this-month", prompt: "What is one problem in Pakistan you have followed recently? Give one fact, and say why it matters.", cue: "Fact, then why a citizen should care. Not an ISSB slogan." },
      { id: "iwt", prompt: "Explain the Indus Waters Treaty in your own words. Who was at the table, and which rivers went to which side?", cue: "1960. India: Ravi, Beas, Sutlej. Pakistan: Indus, Jhelum, Chenab. Say if you are unsure of a detail." },
      { id: "cpec", prompt: "What is CPEC, which two countries are in it, and what is one benefit and one risk?", cue: "China and Pakistan. One gain, one cost. No rumour." },
      { id: "neighbours", prompt: "Name Pakistan's neighbours and one issue you associate with each border. Say when you are unsure.", cue: "India, China, Afghanistan, Iran. Coast on the Arabian Sea." },
      { id: "rumour", prompt: "How do you tell a news report from a rumour on your phone?", cue: "Who published it, whether anyone else reported it, and what you still do not know." },
      { id: "unknown-crisis", prompt: "If the board asks about a war or crisis you have not read, what will you say?", cue: "Say you have not followed it, then offer the piece you do understand." },
    ],
  },
  {
    id: "military",
    title: "Military awareness and motivation",
    blurb: "Why you want the uniform, what an officer owes people, and one gallantry story you can tell cleanly.",
    pace: "About a minute each",
    note: "You are a candidate, not an instructor. Know a little well. Do not invent ranks, operations, or casualty numbers.",
    questions: [
      { id: "officer", prompt: "What does an officer owe the people under their command?", cue: "Care, clear orders, and your own example." },
      { id: "which-service", prompt: "Name the three services and the one you want. What does that service actually do?", cue: "Army, Navy, Air Force. One real task of yours." },
      { id: "academy", prompt: "What do you know about the training you hope to join, and what will be hard for you?", cue: "Name the academy if you know it. Name a real weakness." },
      { id: "nh", prompt: "Tell me about one Nishan-e-Haider recipient: the name, what he did, and how he died. If you mix a detail, say so.", cue: "One person. Action, then sacrifice. Do not guess a date." },
      { id: "courage", prompt: "What is the difference between courage and showing off?", cue: "Courage accepts a cost. Showing off wants an audience." },
      { id: "trust", prompt: "Why should the board trust you with responsibility while you are still young and untrained?", cue: "A small trust you already kept. Not a promise to be a hero." },
    ],
  },
  {
    id: "stress",
    title: "Stress and follow-up",
    blurb: "Short, pressing questions. The point is to stay polite and exact when the tone gets sharp.",
    pace: "Twenty to forty seconds",
    note: "Do not argue with the tone. If you were wrong, correct the fact. If you do not know, say that in one line.",
    questions: [
      { id: "prove-team", prompt: "You said you are a team player. Prove it with one hour from your life. Now.", cue: "Place, people, what you did. Then stop." },
      { id: "shorter", prompt: "That kind of answer is too long. Give your reason for joining again, in twenty seconds.", cue: "One reason. No story." },
      { id: "hesitated", prompt: "You hesitated. Do you not know, or are you hiding something?", cue: "Pick the truth. Do not fill the silence with a new story." },
      { id: "marks", prompt: "Your marks do not match what you just claimed. Which number is true?", cue: "The number on the certificate." },
      { id: "disagree-board", prompt: "Someone on the board disagrees with you. Do you change your answer to please them?", cue: "Change it only if you were wrong. Say why." },
      { id: "not-convinced", prompt: "I am not convinced. Why should this interview continue?", cue: "One concrete thing you still want them to know. No pleading." },
    ],
  },
  {
    id: "situational",
    title: "Situational judgment",
    blurb: "A messy minute. They listen for what you do first, who you protect, and whether you tell the truth.",
    pace: "About a minute each",
    note: "Say the first action, then the next. Do not give a lecture on leadership words.",
    questions: [
      { id: "shouting", prompt: "Your group is lost on a task and two people are shouting. What do you do in the next minute?", cue: "Lower the noise, restate the task, give one next step." },
      { id: "hide-mistake", prompt: "A friend asks you to hide a mistake on a form. What do you say?", cue: "You will not hide it. Offer to help them correct it." },
      { id: "unsafe", prompt: "You think an instruction is unsafe. How do you raise it without refusing to work?", cue: "State the danger, ask to confirm, then do the safe version of the task." },
      { id: "mocked", prompt: "You see a junior being mocked by the group. What do you do?", cue: "Stop the mocking. Do not join it to look easygoing." },
      { id: "late", prompt: "You are late and everyone is waiting. What is the first thing you say?", cue: "Own it. No long excuse. Ask what you should do now." },
      { id: "dont-know", prompt: "You do not know the answer in front of the board. Say the sentence you would actually use.", cue: "I do not know that. Here is the part I do know." },
    ],
  },
  {
    id: "rapid",
    title: "Rapid-fire general knowledge",
    blurb: "Fast Pakistan facts. Hit the answer, or say you do not know. Do not invent a number.",
    pace: "A few seconds each",
    note: "Short replies. If a fact has two versions in your head, give the one you can defend and flag the doubt.",
    questions: [
      { id: "capital", prompt: "What is the capital of Pakistan, and which city was the first capital?", cue: "Islamabad. Karachi was the first capital." },
      { id: "provinces", prompt: "Name the four provinces and a capital for each.", cue: "Punjab Lahore, Sindh Karachi, Khyber Pakhtunkhwa Peshawar, Balochistan Quetta." },
      { id: "dam", prompt: "Which dam is Pakistan's largest reservoir, and which river is it on?", cue: "Tarbela, on the Indus." },
      { id: "peak", prompt: "What is the highest peak in Pakistan, and which range is it in?", cue: "K2, Karakoram." },
      { id: "quaid", prompt: "What is the Quaid-e-Azam's name, and when did Pakistan become independent?", cue: "Muhammad Ali Jinnah. 14 August 1947." },
      { id: "rivers", prompt: "Name the three eastern and three western rivers associated with the Indus Waters Treaty.", cue: "Eastern: Ravi, Beas, Sutlej. Western: Indus, Jhelum, Chenab." },
      { id: "gwadar", prompt: "Where is Gwadar, and which sea is it on?", cue: "Balochistan, on the Arabian Sea." },
      { id: "three-parts", prompt: "What three parts of ISSB testing are you preparing for?", cue: "Psychological tests, GTO tasks, and the deputy president interview. You do not need to pretend you know the timetable." },
    ],
  },
  {
    id: "closing",
    title: "Closing",
    blurb: "Strengths, a real worry, and one question you would ask the board. Leave them a clear last minute.",
    pace: "About a minute each",
    note: "End plain. Do not ask whether you are selected. Do not beg.",
    questions: [
      { id: "strength", prompt: "What is a real strength, shown in something you did, not a word you like?", cue: "One example. The word can come last." },
      { id: "worry", prompt: "What should the board worry about in you, and what are you doing about it?", cue: "A real habit, and the work already started." },
      { id: "learned", prompt: "What have you learned about yourself while preparing?", cue: "One surprise, not a list of virtues." },
      { id: "referee", prompt: "Who would speak for you if we called them, and what would they not praise?", cue: "A real person. Include the unflattering part." },
      { id: "your-question", prompt: "Do you have a question for the board? Ask one about the service, not about your result.", cue: "Training, duty, or what new officers struggle with." },
      { id: "last-minute", prompt: "In one minute: why should Pakistan trust you in uniform?", cue: "Character you have already shown. Then stop." },
    ],
  },
];

export function deputyInterviewById(id: string) {
  return deputyInterviewTypes.find((item) => item.id === id);
}

export function clipKey(typeId: string, questionId: string) {
  return `${typeId}::${questionId}`;
}
