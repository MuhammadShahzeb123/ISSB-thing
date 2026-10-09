// Essay course: sixteen short audio-led lessons that teach how to write an
// essay, following "How to Write Essays" by Don Shiach (How To Books, 2007)
// in the book's own order. Teach only what the book teaches. The book is
// copyrighted, so summaries and examples are in our own words, built on the
// book's samples, with only short credited quotes.
//
// Narration lives in public/audio/essay-course/<id>.txt (script) and
// <id>.mp3 (made by hand in Google AI Studio). See app/lib/essayCourseNarration.ts.
// The AI check rubric for each lesson lives on the server in
// app/lib/essay-course/rubrics.ts.

export const ESSAY_COURSE_VERSION = "essay-course-v1";

export type EssayCourseTask = {
  /** What the learner must do, in one or two short sentences. */
  prompt: string;
  /** The title, passage or sentences the learner works on. */
  given?: string;
  placeholder: string;
  /** Rough length guide shown under the box. */
  lengthHint: string;
};

export type EssayCourseLesson = {
  id: string;
  number: number;
  title: string;
  /** Where this comes from in the book. */
  chapter: string;
  teaser: string;
  /** Short points in our own words. */
  points: readonly string[];
  /** One short quote from the book, credited by chapter. */
  quote?: string;
  example: {
    heading: string;
    weak: string;
    better: string;
    why: string;
  };
  /** The final lesson has no task: it leads into the full Essay test. */
  task?: EssayCourseTask;
};

export const essayCourseLessons: readonly EssayCourseLesson[] = [
  {
    id: "answer-the-question",
    number: 1,
    title: "Answer the question that is set",
    chapter: "Introduction and Chapter 1, Planning your essay",
    teaser: "The golden rule: relevance is all.",
    points: [
      "Two students can know the same things and still get very different marks. What counts is how you use what you know.",
      "Answer the exact question on the paper, not the one you wish they had asked.",
      "Do not write down everything you know. Pick only what answers the question.",
      "Before writing, read the title twice and ask: what exactly am I being asked to do?",
    ],
    quote: "Relevance is all!",
    example: {
      heading: "Title: What were the origins of the First World War?",
      weak:
        "The First World War was fought from 1914 to 1918. Millions of soldiers died in the trenches of the Western Front, and new weapons such as tanks and gas were used. The Treaty of Versailles ended the war in 1919…",
      better:
        "The First World War grew out of tensions that had built up for years: rival alliances, an arms race between the great powers, and the murder of Archduke Franz Ferdinand in 1914, which set those alliances in motion.",
      why: "The weak answer shows off knowledge about the war itself. The question only asks why it began, so the better answer sticks to the causes.",
    },
    task: {
      prompt: "Read the title. In two or three sentences, say exactly what it asks you to do, and name one thing you would leave out because it is not relevant.",
      given: "Should the government intervene to prevent different media from being owned and controlled by a few media moguls?",
      placeholder: "This title asks me to…",
      lengthHint: "2 to 3 sentences",
    },
  },
  {
    id: "underline-key-words",
    number: 2,
    title: "Underline the key words",
    chapter: "Chapter 1, Planning your essay",
    teaser: "Three or four words that focus your whole essay.",
    points: [
      "Before planning, underline three or four key words in the title. Longer titles may need a few more.",
      "Each key word gives you a job. “Why” asks for reasons. A name tells you whose actions matter.",
      "Key words keep you focused and stop you from showing off everything you know.",
      "It takes seconds and can save the whole essay.",
    ],
    quote: "Pick and choose well.",
    example: {
      heading: "Title: Why does Shakespeare’s Hamlet delay carrying out his revenge for the murder of his father?",
      weak: "Underlined: Shakespeare, murder, father. (These point to the plot in general, so the essay drifts into retelling the story.)",
      better:
        "Underlined: Why, Hamlet, delay, revenge. Why = explain his reasons. Hamlet = his motives, not another character’s. Delay = the essay is about the waiting. Revenge = the task he is putting off.",
      why: "The better choice picks the words that tell you what to do and what to focus on.",
    },
    task: {
      prompt: "Write down the key words you would underline in this title, and for each one say in a few words what it tells you to do.",
      given: "Should the voting age be lowered to sixteen? Write an essay that weighs up the arguments for and against this action.",
      placeholder: "Key word – what it tells me to do…",
      lengthHint: "4 to 6 key words with a short note each",
    },
  },
  {
    id: "make-a-plan",
    number: 3,
    title: "Make a plan before you write",
    chapter: "Chapter 1, Planning your essay",
    teaser: "Five to seven minutes that pay off in marks.",
    points: [
      "A plan helps you organise, and it makes the examiner’s job easy. Meet them more than halfway.",
      "Every essay has three parts: a definite opening, a considered development (the body) and an emphatic conclusion.",
      "How to plan: underline key words, jot quick notes, keep only what is relevant, then put the notes in order – one main point for each body paragraph.",
      "In an exam, plan for no longer than five to seven minutes when the essay has an hour or less.",
      "Quality, not length. The author, a former examiner, crossed out page after page of answers that were not relevant.",
    ],
    quote: "An essay must have a definite opening, a considered development and an emphatic conclusion.",
    example: {
      heading: "Title: ‘The internet is a very mixed blessing.’ Write an essay making clear your opinions about its advantages and disadvantages.",
      weak: "Notes: internet good, info, games, YouTube, bad stuff, hackers, kids, my phone, Wi‑Fi is slow at home, useful for school…",
      better:
        "Opening: the internet brings huge benefits and real problems; I will weigh both and give my view.\nBody 1: knowledge and learning for everyone.\nBody 2: business and staying in touch.\nBody 3: problems – false information and online crime.\nBody 4: harm to young people – addiction and bullying.\nConclusion: a blessing overall, if it is used with care and rules.",
      why: "The weak notes are a random list with irrelevant bits. The better plan keeps only relevant points and puts them in the three-part shape, one point per paragraph.",
    },
    task: {
      prompt: "Write a short plan: one line for the opening, three or four body points in order, and one line for the conclusion.",
      given: "‘The internet is a very mixed blessing. It brings as many problems as it does blessings.’ Make your opinions clear.",
      placeholder: "Opening:\nBody 1:\nBody 2:\nBody 3:\nConclusion:",
      lengthHint: "5 to 7 short lines",
    },
  },
  {
    id: "avoid-waffle",
    number: 4,
    title: "Start strong and avoid waffle",
    chapter: "Chapter 2, The opening paragraph",
    teaser: "Deal with the topic from the very first sentence.",
    points: [
      "Your first paragraph shapes how the examiner feels about the whole essay.",
      "Waffle is empty, general talk that could fit any essay. Examiners spot it at once.",
      "Deal with the topic from the first sentence. A good trick is to use key words from the title in your opening line.",
      "Be specific, but do not pack everything in. The detail belongs in the body.",
    ],
    quote: "Avoid ‘waffling’ in your opening paragraph!",
    example: {
      heading: "Title: ‘In Great Expectations, Pip has to regain his moral values after losing them along the way.’ Discuss.",
      weak:
        "“This is a very important issue and there are many different approaches that can be taken in regard to it. Many experts have considered this matter, but no one has come up with proven solutions.” (The book’s example of waffle: it says nothing about the topic.)",
      better:
        "Pip’s values of kindness, hard work and humility, learnt as a child at the forge from Joe and Biddy, are slowly lost when he comes into his ‘great expectations’ and leaves for London.",
      why: "The better sentence names Pip, his values and where he lost them – the key words of the question – in the very first line.",
    },
    task: {
      prompt: "Rewrite this waffly first sentence as one specific first sentence that uses the key words of the title.",
      given: "Title: ‘Celebrity culture is a prominent and unwelcome feature of contemporary society.’ Discuss.\nWaffly opening: “This topic has been discussed by many people for a long time and there are lots of different views about it.”",
      placeholder: "Your new first sentence…",
      lengthHint: "1 sentence",
    },
  },
  {
    id: "opening-paragraph",
    number: 5,
    title: "Build your opening paragraph",
    chapter: "Chapter 2, The opening paragraph",
    teaser: "Four or five sentences that map out the ground.",
    points: [
      "Aim for an opening paragraph of four or five sentences.",
      "Do not answer the whole question yet. Map out the ground: say what you will do, then do it in the body.",
      "Each sentence should grow out of the one before and make a small promise you keep later.",
      "Useful phrases: “In this essay I intend to explore…”, “This essay will discuss…”, “This essay will focus on…”.",
      "Test it: does it deal with the topic at once, is it specific, does it map out what comes next, does it avoid waffle?",
    ],
    example: {
      heading: "Title: Should the voting age be lowered to sixteen? Weigh up the arguments for and against.",
      weak: "Voting is a very important thing in every country. There are many views on this question. Some people agree and some people disagree. In this essay I will look at it.",
      better:
        "Debate about the voting age usually centres on whether sixteen-year-olds are mature enough to make a reasoned judgement about their vote. Yet it is fair to ask whether most voters of any age decide with mature judgement, or simply out of habit or prejudice. Perhaps maturity is not the real issue at all. More central to the debate may be the rights of every citizen in a democracy, whatever their age.",
      why: "The better paragraph (adapted from the book’s example) goes straight to the topic and sets up three things the body will discuss: maturity, how voters really decide, and citizens’ rights.",
    },
    task: {
      prompt: "Write an opening paragraph of four or five sentences that deals with the topic at once and maps out what your essay will cover.",
      given: "‘The warming of the planet is the most serious issue that faces mankind today.’ Discuss this statement.",
      placeholder: "Your opening paragraph…",
      lengthHint: "4 to 5 sentences",
    },
  },
  {
    id: "key-sentence",
    number: 6,
    title: "One point per paragraph, with a key sentence",
    chapter: "Chapter 3, The body of the essay",
    teaser: "The key sentence unlocks the paragraph.",
    points: [
      "The body is where you keep the promise of your opening, and where you earn most of your marks.",
      "Paragraphs guide the reader. A page with no breaks looks jumbled and is tiring to read.",
      "Deal with one main point in each paragraph. Too many points in one paragraph confuse the reader and stay on the surface.",
      "State the point in a key sentence, and put it first.",
    ],
    quote: "Key sentences provide a ‘key’ to unlock for your reader what the paragraph is about.",
    example: {
      heading: "A body paragraph about celebrity culture",
      weak:
        "Celebrities are on TV a lot. Fashion is also very important to young people now. Social media has changed everything. Many young people want to be famous and some of them want to be doctors.",
      better:
        "Celebrity culture, then, is a well-established feature of our mass media. Programmes about celebrities appear daily in the television schedules, and producers have learnt that putting the word ‘celebrity’ in a title brings in more viewers…",
      why: "The weak paragraph jumps between four points with no key sentence. The better one (from the book’s example) opens with one clear point and sticks to it.",
    },
    task: {
      prompt: "Choose one main point for a body paragraph. Write its key sentence, then list two or three details you would use to support it.",
      given: "‘The internet is a very mixed blessing. It brings as many problems as it does blessings.’",
      placeholder: "Key sentence:\nDetails:",
      lengthHint: "1 key sentence + 2 to 3 details",
    },
  },
  {
    id: "develop-and-close",
    number: 7,
    title: "Develop the point and close the paragraph",
    chapter: "Chapter 3, The body of the essay",
    teaser: "Key sentence, examples, then a closing sentence.",
    points: [
      "Give the key sentence ‘flesh’ with specific examples and details.",
      "End with a closing sentence that sums up the paragraph – an ‘intermediate conclusion’, often starting with “Thus”.",
      "The last sentence can also point the way to the next paragraph, so the essay flows.",
      "Shape: key sentence → a few developing sentences → closing sentence.",
    ],
    example: {
      heading: "Title: Do charity concerts for famine relief do any lasting good?",
      weak: "Charity concerts might not help much. They raise money. But things are still bad. So they are not that good.",
      better:
        "It could be argued, however, that nothing has really changed since the first of these concerts. Famine, drought, disease and civil war still afflict many of the countries that received the money. The funds ease the suffering but do not cure its causes, and the need remains as great as ever. Thus, many professionals in the aid agencies now look beyond fund-raising concerts to other solutions.",
      why: "The better paragraph (based on the book’s Band Aid example) states one point, backs it with specific evidence, and closes with a “Thus” sentence that leads into the next paragraph.",
    },
    task: {
      prompt: "Write one full body paragraph: a key sentence, three sentences that develop it with specific examples, and a closing sentence.",
      given: "Use either title: ‘The internet is a very mixed blessing.’ or ‘Should the voting age be lowered to sixteen?’",
      placeholder: "Your body paragraph…",
      lengthHint: "5 sentences",
    },
  },
  {
    id: "linking-words",
    number: 8,
    title: "Link your paragraphs",
    chapter: "Chapter 3, Continuity",
    teaser: "Signposts that keep the reader on your path.",
    points: [
      "The essay should read as one connected whole. Linking words and phrases are the signposts.",
      "Useful links: However, Nevertheless, Furthermore, Moreover, On the contrary, Secondly, Therefore, Thus, Finally, “To counter this argument…”, “Another essential feature of…”.",
      "The link need not be the first word, but it should be in the first sentence of the new paragraph.",
      "When “however” sits in the middle of a sentence, put a comma before and after it.",
      "“This” and “that” can also link back to the paragraph before (“this obsession”).",
    ],
    example: {
      heading: "Three paragraphs on climate change",
      weak:
        "¶1 Experts disagree on the causes of climate change, but the weather is changing.\n¶2 Selfish national interests get in the way of controlling pollution.\n¶3 Some progress has been made over the years.",
      better:
        "¶1 Although experts disagree on the causes of climate change, hardly anyone disputes that the world’s weather is changing.\n¶2 However, short-term gains and the selfish interests of individual countries continually get in the way.\n¶3 Nevertheless, some progress has been made over the years…",
      why: "“However” and “Nevertheless” (from the book’s example) show the reader how each paragraph turns from the last.",
    },
    task: {
      prompt: "Rewrite the first sentence of each paragraph so it carries a suitable linking word or phrase.",
      given:
        "Title: Is social media good for young people?\n¶2 Social media helps students learn and stay in touch with family abroad.\n¶3 Social media can be addictive and harm sleep and study.\n¶4 Schools and parents can teach young people to use it wisely.",
      placeholder: "¶2 …\n¶3 …\n¶4 …",
      lengthHint: "3 sentences",
    },
  },
  {
    id: "back-it-up",
    number: 9,
    title: "Back up every claim",
    chapter: "Chapter 3, Close references (with Chapters 7, 11, 12 and 15)",
    teaser: "Evidence, not assertions and not retelling.",
    points: [
      "A claim without evidence is only an assertion. Match every assertion with detail and specific references.",
      "In literature, a close reference is a key event, something a character says or does, or a short quotation – like a lawyer’s evidence.",
      "Do not retell the story. Pick a few sharp details that prove the point.",
      "In history and politics, know your facts and select the ones that matter.",
      "Keep quotations short and relevant, and use your subject’s proper terms without jargon for its own sake.",
    ],
    example: {
      heading: "Title: What justification has Elizabeth for considering Darcy to be proud? (Pride and Prejudice)",
      weak: "Darcy is very proud and snobbish and Elizabeth does not like him. He is rich and thinks he is better than everyone, so she thinks he is proud.",
      better:
        "Elizabeth has considerable evidence that Darcy is proud. First, he refuses to dance with her at the ball, implying she is not good enough for him. Then there is his open contempt for her mother. Most importantly, his marriage proposal suggests he had to overcome his doubts about her lower social position.",
      why: "The better paragraph (based on the book’s example) backs the claim with three brief close references, without retelling the novel.",
    },
    task: {
      prompt: "Rewrite this bare claim as a short paragraph that backs it up with at least two specific pieces of evidence. Do not tell a long story.",
      given: "Claim: “Pakistan’s armed forces play a big role in helping people during natural disasters.”",
      placeholder: "Your paragraph with specific evidence…",
      lengthHint: "3 to 5 sentences",
    },
  },
  {
    id: "closing-paragraph",
    number: 10,
    title: "End with a strong conclusion",
    chapter: "Chapter 4, The closing paragraph",
    teaser: "Your last impression before the mark.",
    points: [
      "The closing paragraph is the last impression before the examiner decides your mark.",
      "Give your judgement if the title asks for one, sum up your reasons, and bring the essay back to the question.",
      "Do not repeat your points word for word. Restate them in a fresh, concise way. No waffle.",
      "Signal it: “In conclusion, then…”, “Finally…”, “As I have argued…”, “As I have shown…”, “Therefore…”, “Based on this evidence…”, “The bulk of the evidence, then, points to…”.",
      "End with a significant final sentence that leaves the reader something to think about.",
    ],
    quote: "It is the human race itself that faces extinction.",
    example: {
      heading: "Title: What must be done to prevent ecological disaster?",
      weak: "So these were some points about the environment. Everyone has their own opinion and only time will tell what happens.",
      better:
        "In conclusion, then, I would argue that unless all the countries of the world, rich and poor, make some sacrifices, the resources we have taken for granted will run out. The most powerful nations must lead the way. The time for empty talk is past; the time for action has arrived. It is the human race itself that faces extinction.",
      why: "The better paragraph (based on the book’s example) signals the end, gives a clear judgement, and finishes with a powerful final sentence.",
    },
    task: {
      prompt: "Write a closing paragraph for the voting age essay. Signal the end, give your judgement, sum up your reasons in fresh words, and finish with a strong final sentence.",
      given: "Should the voting age be lowered to sixteen? Weigh up the arguments for and against.",
      placeholder: "In conclusion, then, …",
      lengthHint: "3 to 5 sentences",
    },
  },
  {
    id: "for-and-against",
    number: 11,
    title: "The for and against essay",
    chapter: "Chapters 5 and 6, Summary and the discursive essay",
    teaser: "Balance both sides, then make your view clear.",
    points: [
      "Your essay needs a beginning, a middle and an end – in that order.",
      "Discursive (argumentative) essays put the arguments for and against, then reach a judgement.",
      "Examiners look for clarity, organised points, balance and a sound overall structure.",
      "Keep a tight hold on the argument, back each point with examples, and deal with the counter-arguments.",
      "Rhetorical questions are fine, but do not overdo them.",
    ],
    quote: "Your essay needs a beginning, a middle and an end. In that order!",
    example: {
      heading: "Title: ‘Watching professional sport has become far too important for many people.’ Discuss, making your own view clear.",
      weak:
        "Sport is good because it is fun and healthy. Sport is bad because some fans fight. TV shows a lot of sport. Some people like it and some people don’t. It depends on the person.",
      better:
        "Paragraph openings from the book’s sample: “However, it is not only the people who watch sport on television who are the fanatics.” → “On the other hand, such an obsession may arise because of a lack of close relationships.” → “The media… continually feeds this obsession.” → “Nevertheless, …” → “In conclusion, then, I would argue that there is a distinct danger of too many people becoming over-obsessed…”",
      why: "The weak answer lists points with no links and no judgement. The book’s sample moves between both sides, links every paragraph and ends with a clear view.",
    },
    task: {
      prompt: "Plan a for and against essay: two arguments for, two against, the counter-argument you would answer, and your own final view in one sentence.",
      given: "Argue the case for or against the banning of smoking in all public places.",
      placeholder: "For:\nAgainst:\nCounter-argument I will answer:\nMy view:",
      lengthHint: "6 short lines",
    },
  },
  {
    id: "learn-from-models",
    number: 12,
    title: "Learn from model essays",
    chapter: "Chapters 7 to 15, Sample essays",
    teaser: "The same structure works in every subject.",
    points: [
      "The book’s samples cover literature, poetry, media, history, novels, film, politics and critical thinking. One structure works for all.",
      "Each subject adds its own needs: facts at your fingertips in history and politics, close references and short quotes in literature, described scenes in film, and the proper terms of the subject.",
      "Assessor’s checklist: specific opening with no waffle? A key sentence and one main point per paragraph? Evidence? A closing sentence? Links and flow? A conclusion that sums up and returns to the question?",
      "Critical thinking: find the conclusion, the reasons and the counter-arguments, then look for flaws and hidden assumptions.",
    ],
    example: {
      heading: "Reading a model paragraph like an examiner",
      weak: "Reading: “This is a good paragraph. It makes sense and I agree with it.”",
      better:
        "Studying: “Key sentence: the first one, about the 1930s. Evidence: mass unemployment, poor housing, hunger, no free medical care. A rhetorical question, then a closing sentence that draws a conclusion: the bitter memory would cost the Conservatives dearly.” (Based on the book’s 1945 election paragraph.)",
      why: "Studying a model means naming its parts, so you can copy the method in your own essays.",
    },
    task: {
      prompt: "Study this paragraph. Name its key sentence, its linking word, the evidence it gives, and what its closing sentence does.",
      given:
        "Moreover, Pakistan’s young population is one of its greatest strengths. More than half of the country’s people are under thirty. Young Pakistanis already lead in freelancing, sport and the armed forces, and many have started small technology firms. Thus, if they are given education and jobs, they could drive the country forward for decades.",
      placeholder: "Key sentence:\nLinking word:\nEvidence:\nClosing sentence does:",
      lengthHint: "4 short lines",
    },
  },
  {
    id: "sentences-and-commas",
    number: 13,
    title: "Sentences and commas",
    chapter: "Chapter 16, Grammar and accuracy",
    teaser: "Complete sentences, varied lengths, the right commas.",
    points: [
      "Anyone makes the odd slip, but many errors will cost you marks. Keep them few.",
      "Write complete sentences that make sense on their own. “Because the voters turned against the party.” is not one.",
      "Mix short simple sentences (for an emphatic point) with longer complex ones (to explain). Avoid long chains of short sentences.",
      "Do not join two sentences with a comma. Use a full stop and a capital letter.",
      "Put commas around interjections like however, of course and nevertheless. Avoid ‘comma-itis’ – commas scattered everywhere.",
    ],
    example: {
      heading: "Full stops, not commas",
      weak:
        "The football authorities are very concerned about agents, they are seen to be profiting from the game and not putting much back into it, naturally sports agents defend themselves against these charges.",
      better:
        "The football authorities are very concerned about agents. They are seen to be profiting from the game and not putting much back into it. Naturally, sports agents defend themselves against these charges.",
      why: "The book’s example: those commas are not strong enough to separate whole sentences, so full stops are needed.",
    },
    task: {
      prompt: "Rewrite this passage with correct full stops, capital letters and commas.",
      given:
        "Load shedding has become a part of daily life in many cities, families plan their day around it, students, study by candle light and shopkeepers, lose business, the government however says that new power plants will soon end the problem",
      placeholder: "Your corrected passage…",
      lengthHint: "Same passage, corrected",
    },
  },
  {
    id: "apostrophes-and-spelling",
    number: 14,
    title: "Apostrophes and spelling",
    chapter: "Chapters 16 and 17, Apostrophes and spelling",
    teaser: "it’s / its, their / there / they’re, and no plural apostrophes.",
    points: [
      "it’s = it is. its = belonging to it. Mixing them up is a bad error.",
      "Apostrophes show possession (the school’s reputation) or missing letters (don’t, can’t, won’t).",
      "Possessive words never take one: yours, ours, hers, theirs.",
      "Never use an apostrophe just to make a plural. Plurals take one only when they own something: politicians’ instincts, women’s rights.",
      "their (belonging to them), there (a place, or something exists), they’re (they are). were, where, we’re work the same way.",
      "Learn the spelling of words you use often in essays, such as necessary, argument, government and environment.",
    ],
    example: {
      heading: "Headlines and plurals from the book",
      weak: "Its a Record!  ·  It’s Wheels Came Off!  ·  Wild animal’s deserve to be protected from poacher’s.",
      better: "It’s a Record!  ·  Its Wheels Came Off!  ·  Wild animals deserve to be protected from poachers.",
      why: "“It’s” means “it is”; “its” means “belonging to it”; plain plurals need no apostrophe.",
    },
    task: {
      prompt: "Rewrite this passage, correcting every apostrophe and spelling mistake.",
      given:
        "Its clear that the citys roads are in bad shape. Their are pothole’s on every street and the council say’s it’s budget is to small. Were all waiting for they’re promised repair’s, but nobody knows were the money has gone.",
      placeholder: "Your corrected passage…",
      lengthHint: "Same passage, corrected",
    },
  },
  {
    id: "exam-technique",
    number: 15,
    title: "Writing under exam conditions",
    chapter: "Chapter 19, Examinations",
    teaser: "Follow the instructions and manage your time.",
    points: [
      "An exam also tests how good you are at sitting exams.",
      "Give the examiners what they want. Do not argue with the paper in your head – follow the instructions to the letter.",
      "Use the marks to share out your time: a part worth 15 marks deserves nearly twice the time of a part worth 8.",
      "Answers in note form are usually marked out of only half the marks.",
      "For the ISSB essay (about 30 minutes): a few minutes to plan, most of the time on the body, and a couple of minutes to conclude and check.",
    ],
    example: {
      heading: "The book’s example: four questions with equal marks",
      weak: "Uneven time: 18 + 18 + 12 + 7 = 55 marks. (Two favourite answers, then a rushed third and a skimpy fourth.)",
      better: "Equal time: 17 + 17 + 15 + 15 = 64 marks.",
      why: "Same knowledge, nine more marks – just from sharing out the time sensibly.",
    },
    task: {
      prompt: "Write a simple time plan for a 30 minute essay: minutes for planning, the opening, the body, the conclusion and checking. Add one sentence on why.",
      placeholder: "Planning: … min\nOpening: … min\nBody: … min\nConclusion: … min\nChecking: … min",
      lengthHint: "5 lines + 1 sentence",
    },
  },
  {
    id: "put-it-together",
    number: 16,
    title: "Put it all together",
    chapter: "Chapter 5, Summary of essay structure",
    teaser: "One routine for every essay – then take the test.",
    points: [
      "1. Read the title twice and underline the key words. Relevance is all.",
      "2. Plan for a few minutes: notes, keep what is relevant, put it in order.",
      "3. Opening of four or five sentences: on topic from line one, no waffle, map out the ground.",
      "4. Body: one point per paragraph, key sentence first, specific evidence, a closing sentence, linking words.",
      "5. If the title asks you to discuss: weigh both sides, answer the counter-arguments, give your view.",
      "6. Closing paragraph: signal it, give your judgement, sum up freshly, end with a significant sentence.",
      "7. Check sentences, commas, apostrophes and spelling.",
    ],
    quote: "Your essay needs a beginning, a middle and an end. In that order!",
    example: {
      heading: "The whole essay at a glance",
      weak: "One long block of text that starts with waffle, wanders through everything the writer knows, and stops when time runs out.",
      better: "Opening (4–5 sentences) → Body paragraphs (key sentence + evidence + closing sentence, linked) → Conclusion (judgement + fresh summary + final significant sentence).",
      why: "This is the shape the AI examiner in the Essay test looks for.",
    },
  },
];

export function findEssayCourseLesson(id: string): EssayCourseLesson | undefined {
  return essayCourseLessons.find((lesson) => lesson.id === id);
}
