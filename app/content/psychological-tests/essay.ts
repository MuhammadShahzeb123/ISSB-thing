// Essay writing practice: topics, timing and the writing guide.
//
// The guide below is a faithful summary of "How to Write Essays" by Don
// Shiach (How To Books, 2007), chapters 1-6, 16, 17 and 19. The book is
// copyrighted, so it is summarised in our own words with only short quotes
// where the exact wording matters. Do not add advice the book does not give
// to `essayBookGuide`; ISSB-specific tips live in `essayIssbNotes`.

export const ESSAY_BOOK_CREDIT =
  "Based on How to Write Essays by Don Shiach (How To Books, 2007).";

export const essayTiming = {
  /** Practice writing time. Prep sites report 30 minutes for the ISSB essay. */
  minutes: 30,
  /** The book: plan for no longer than five to seven minutes when the essay has an hour or less. */
  planMinutes: "5 to 7",
  targetWords: { min: 300, max: 400 },
} as const;

export type EssayTopic = {
  id: string;
  title: string;
  category: "Pakistan" | "Society" | "Youth" | "Character" | "Current issues";
};

export const essayTopics: readonly EssayTopic[] = [
  { id: "social-media-youth", title: "Social media: a blessing or a curse for Pakistani youth?", category: "Youth" },
  { id: "problems-of-youth", title: "The problems of youth in Pakistan today", category: "Youth" },
  { id: "drug-addiction", title: "Drug addiction among young people: causes and cures", category: "Youth" },
  { id: "unemployment-youth", title: "Unemployment and Pakistani youth", category: "Youth" },
  { id: "education-system", title: "Our education system: its weaknesses and how to fix them", category: "Pakistan" },
  { id: "poverty", title: "How can Pakistan overcome poverty?", category: "Pakistan" },
  { id: "corruption", title: "Corruption in Pakistan: causes and cure", category: "Pakistan" },
  { id: "population-growth", title: "Population growth: Pakistan's hidden challenge", category: "Pakistan" },
  { id: "water-scarcity", title: "Water scarcity in Pakistan", category: "Pakistan" },
  { id: "terrorism", title: "Terrorism and its effects on Pakistan", category: "Pakistan" },
  { id: "democracy", title: "Democracy in Pakistan: promise and problems", category: "Pakistan" },
  { id: "kashmir", title: "The Kashmir dispute", category: "Current issues" },
  { id: "climate-change", title: "Climate change and Pakistan", category: "Current issues" },
  { id: "inflation", title: "Inflation: causes and remedies", category: "Current issues" },
  { id: "cpec", title: "CPEC: opportunities and challenges for Pakistan", category: "Current issues" },
  { id: "online-education", title: "Online education: merits and demerits", category: "Current issues" },
  { id: "technology", title: "Merits and demerits of modern technology", category: "Society" },
  { id: "co-education", title: "Co-education in our country: for and against", category: "Society" },
  { id: "freedom-of-speech", title: "Freedom of speech: rights and responsibilities", category: "Society" },
  { id: "electronic-media", title: "The role of electronic media in our society", category: "Society" },
  { id: "discipline", title: "Discipline is the key to success", category: "Character" },
  { id: "time-management", title: "Time management: how to make the most of your day", category: "Character" },
  { id: "teamwork", title: "Teamwork and its importance", category: "Character" },
  { id: "character-vs-knowledge", title: "Character matters more than knowledge. Discuss.", category: "Character" },
  { id: "good-leader", title: "The qualities of a good leader", category: "Character" },
];

export function findEssayTopic(id: string): EssayTopic | undefined {
  return essayTopics.find((topic) => topic.id === id);
}

export type EssayGuideSection = {
  id: string;
  title: string;
  teaser: string;
  /** Book chapter the section is drawn from. */
  chapter: string;
  points: readonly string[];
  /** Short exact quotes from the book, used where the wording matters. */
  quotes?: readonly string[];
  /** Phrases the book lists for the writer to use. */
  phrases?: readonly string[];
};

export const essayBookGuide: readonly EssayGuideSection[] = [
  {
    id: "title",
    title: "1. Answer the question that is set",
    teaser: "Underline 3 or 4 key words. Relevance is all.",
    chapter: "Chapter 1, Planning your essay",
    points: [
      "Write about the exact task in the title, not the essay you would like to write.",
      "Read the title with great care and underline three or four key words. They keep your thinking on what you are being asked.",
      "Do not pour out everything you know. Pick only what answers this title. A brilliant essay on the wrong question still gets a poor grade.",
    ],
    quotes: [
      "Answer the specific question that is set, not some other question that you might like to be answering. Relevance is all!",
    ],
  },
  {
    id: "plan",
    title: "2. Make a short plan",
    teaser: "Jot notes, put them in order, then write. 5 to 7 minutes.",
    chapter: "Chapter 1, Planning your essay",
    points: [
      "A plan pays off in relevance, organisation and clarity.",
      "After underlining the key words, jot down brief words and phrases that come to mind. Then put them in the order you will use them.",
      "Work out a paragraph structure: an opening paragraph, a first body paragraph, a linked next paragraph, more paragraphs as needed, then a concluding paragraph.",
      "In a timed essay of an hour or less, spend no more than five to seven minutes planning, or you lose writing time.",
      "Quality counts, not length. Filling pages with material that is not relevant or structured earns nothing.",
    ],
    quotes: [
      "An essay must have a definite opening, a considered development and an emphatic conclusion.",
    ],
  },
  {
    id: "opening",
    title: "3. The opening paragraph",
    teaser: "No waffle. Hit the topic from the first sentence.",
    chapter: "Chapter 2, The opening paragraph",
    points: [
      "The first paragraph makes the first impression on the person marking you.",
      "Avoid waffle: general, empty sentences that could open any essay on any topic and say nothing.",
      "Deal with the topic from the very first sentence. A good trick is to use some key words from the title in that sentence.",
      "Aim for about four or five sentences. Say what approach you will take and map out the ground the body will cover. Do not try to answer everything here.",
      "Then keep your promise in the body of the essay.",
    ],
    quotes: ["Avoid ‘waffling’ in your opening paragraph!"],
    phrases: [
      "In this essay I intend to explore …",
      "This essay will discuss …",
      "This essay will focus on …",
      "In order to discuss …, I will analyse …",
    ],
  },
  {
    id: "body",
    title: "4. Body paragraphs",
    teaser: "One point per paragraph. Key sentence first.",
    chapter: "Chapter 3, The body of the essay",
    points: [
      "The body is where you earn most of your marks. Without it, the essay is ‘like a sandwich without the filling’.",
      "Use paragraphs. Pages of unbroken writing are hard to follow.",
      "Deal with one main point in each paragraph, then develop it. Packing many points into one paragraph makes you confusing and shallow.",
      "Put the key sentence (topic sentence) first. It tells the reader what the paragraph is about.",
      "Develop the point with specific examples and detail.",
      "End with a closing sentence that sums up the paragraph, draws a small conclusion, or points to the next paragraph.",
    ],
  },
  {
    id: "evidence",
    title: "5. Back up every claim",
    teaser: "Assertions need detail, examples and evidence.",
    chapter: "Chapter 3 and the sample essays",
    points: [
      "A claim with no support stays ‘a mere assertion’. Back it up with concrete, relevant detail.",
      "Use brief references to facts, events or examples. Do not retell a whole story; use only what proves your point.",
      "Quotations should be short and relevant, not used for the sake of it.",
      "A rhetorical question can raise an issue you then answer, but do not overdo them.",
    ],
    quotes: [
      "Assertions must be complemented by detail and specific references.",
    ],
  },
  {
    id: "linking",
    title: "6. Link your paragraphs",
    teaser: "Signpost words show the reader where you are going.",
    chapter: "Chapter 3, Continuity",
    points: [
      "The essay must read as one continuous, connected whole, not a jump from point to point.",
      "Put a linking word or phrase in the first sentence of each new paragraph. It need not be the first word.",
      "‘This’ and ‘that’ can point back to what you said before.",
      "When ‘however’ sits in the middle of a sentence, put a comma before and after it.",
    ],
    phrases: [
      "Another essential feature of …",
      "While it can be argued that …, it is also true that …",
      "However, …",
      "To counter this argument, …",
      "Nevertheless, the evidence is that …",
      "Furthermore, … / Moreover, …",
      "On the contrary, …",
      "Therefore, … / Thus, …",
      "Finally, …",
    ],
  },
  {
    id: "discursive",
    title: "7. For and against essays",
    teaser: "Weigh both sides and make your own view clear.",
    chapter: "Chapter 6, A discursive essay",
    points: [
      "A discursive (argumentative) essay puts arguments for and against a point of view.",
      "You are judged on clear, concise expression, organised points, balancing both sides, and overall structure.",
      "These essays often ramble. Keep a tight hold on your argument and back each point with detailed examples.",
      "Allow for the counter-arguments to your view and deal with them.",
      "When the title asks for your view, state it clearly, usually in the conclusion.",
    ],
  },
  {
    id: "conclusion",
    title: "8. The closing paragraph",
    teaser: "Give your judgement, sum up, end on a strong line.",
    chapter: "Chapter 4, The closing paragraph",
    points: [
      "The last paragraph is the last impression before the essay is marked.",
      "If the title asks for a judgement, give it here and sum up the reasons.",
      "Refer back to your arguments, but do not just repeat them. Find a fresh, short way to restate your conclusion.",
      "Be specific. Waffle is as bad here as in the opening.",
      "Finish with a significant sentence that is relevant and leaves the reader something to think about.",
    ],
    phrases: [
      "In conclusion, then, …",
      "As I have argued, …",
      "As I have shown, …",
      "Based on this evidence, …",
      "The bulk of the evidence, then, points to …",
    ],
  },
  {
    id: "sentences",
    title: "9. Sentences and punctuation",
    teaser: "Full sentences, varied length, full stops in the right place.",
    chapter: "Chapter 16, Grammar and accuracy",
    points: [
      "Too many grammar, punctuation and spelling errors lose marks. One slip is forgiven; many are not.",
      "Write in complete sentences. ‘Because the voters turned against the party.’ is not a sentence. Read each sentence in your head to check it makes sense on its own.",
      "Vary your sentences: short simple ones for an emphatic point, longer complex ones to explain. A string of short choppy sentences is monotonous.",
      "Every sentence starts with a capital letter and ends with a full stop. Do not join two sentences with a comma.",
      "Words like however, of course, for example and nevertheless take a comma after them at the start of a sentence, and commas on both sides in the middle.",
      "Avoid ‘comma-itis’: commas scattered where they are not needed.",
      "it's means ‘it is’; its means ‘belonging to it’. Do not mix them up.",
      "No apostrophe in a plain plural (governments, not government's). Possessive words like hers, ours, theirs never take one.",
    ],
  },
  {
    id: "spelling",
    title: "10. Spelling",
    teaser: "their/there/they're and were/where/we're are avoidable errors.",
    chapter: "Chapter 17, Spelling",
    points: [
      "their = belonging to them. there = a place, or ‘there is’. they're = they are.",
      "were = past of ‘to be’. where = which place. we're = we are.",
      "Learn words you use often in essays. Examples from the book's list: accommodation, argument, beginning, definite, embarrassment, environment, government, necessary, occurred, separate, whether.",
    ],
  },
  {
    id: "timed",
    title: "11. Writing against the clock",
    teaser: "Give the examiner what they want. Manage your time.",
    chapter: "Chapter 19, Examinations",
    points: [
      "Give the examiners what they want. Follow every instruction to the letter.",
      "Read the question carefully and underline the key words.",
      "Divide your time with discipline and follow a structured essay plan.",
      "An answer left in note form at the end earns far fewer marks than a proper essay.",
    ],
  },
];

/** The book's own one-page summary (chapter 5), used for the checklist. */
export const essayStructureSummary = {
  chapter: "Chapter 5, Summary of essay structure",
  quote: "Your essay needs a beginning, a middle and an end. In that order!",
};

export const essayChecklist: readonly { id: string; label: string }[] = [
  { id: "keywords", label: "I underlined 3 or 4 key words in the title" },
  { id: "plan", label: "I jotted notes and put them in order (5 to 7 min)" },
  { id: "first-sentence", label: "My first sentence deals with the topic, using key words. No waffle" },
  { id: "opening-map", label: "My opening (4 or 5 sentences) says what approach I will take" },
  { id: "one-point", label: "Each body paragraph makes one main point" },
  { id: "key-sentence", label: "Each body paragraph starts with a key sentence" },
  { id: "examples", label: "Every claim is backed by a specific example or fact" },
  { id: "closing-sentence", label: "Each paragraph ends with a sum-up or a link forward" },
  { id: "links", label: "Each new paragraph has a linking word (However, Furthermore …)" },
  { id: "balance", label: "I dealt with the other side and made my own view clear" },
  { id: "conclusion", label: "My conclusion gives a judgement and ends on a strong sentence" },
  { id: "proofread", label: "I checked: full sentences, full stops, it's/its, their/there/they're" },
];

export const essayOutlineTemplate = `Key words in the title:

Opening (4-5 sentences): my approach is ...

Body 1, key point:
  example / fact:
Body 2, key point:
  example / fact:
Body 3, other side (counter-argument):
  my answer to it:

Conclusion, my judgement:
Final sentence idea:`;

/** ISSB-specific practice notes, kept separate from the book's guidance. */
export const essayIssbNotes = {
  points: [
    "Prep sites report one essay on the first day: about 300 to 400 words in 30 minutes.",
    "Topics are usually Pakistan, society, youth, character and current issues, not specialist subjects.",
    "Write what you honestly think and can support. A balanced, practical essay reads better than slogans.",
  ],
  sources: [
    { label: "ISSB Psychologist: Day 1 guide", href: "https://issbpsychologist.com/issb-full-form/" },
    { label: "ISSB Psychologist: essay topics", href: "https://issbpsychologist.com/essay-writing-topics/" },
  ],
};
