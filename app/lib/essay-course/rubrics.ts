// What the AI coach checks for each Your turn task. Every point comes from
// "How to Write Essays" by Don Shiach (the chapter is in the lesson). Do not
// add rules the book does not teach.

export const essayCourseRubrics: Readonly<Record<string, readonly string[]>> = {
  "answer-the-question": [
    "Says what the title actually asks: whether the government should step in to stop a few owners (moguls) controlling the media.",
    "Mentions that the answer must deal with several forms of media and with ownership and control (who holds the power).",
    "Names something irrelevant to leave out, such as general media history or everything the writer knows about one channel.",
    "Stays on the specific question rather than a different question the writer would prefer.",
  ],
  "underline-key-words": [
    "Picks the key words the book underlines: voting age, sixteen, weighs up, arguments for and against (close equivalents are fine).",
    "Explains what each key word tells the writer to do (for example, weighs up = consider both sides and judge).",
    "Does not underline empty words such as 'write', 'an', 'essay' or 'this'.",
    "Three to six key words, not the whole title.",
  ],
  "make-a-plan": [
    "Has the three-part shape: an opening, a body and a conclusion.",
    "Body points are relevant to the internet as a mixed blessing (advantages and disadvantages) and cover both sides.",
    "Points are in a sensible order with one main point for each body paragraph.",
    "Notes are brief, not full sentences of essay, and nothing irrelevant is kept.",
    "The conclusion line states a view, because the title asks for the writer's opinion.",
  ],
  "avoid-waffle": [
    "One sentence that deals with the topic immediately, with no waffle or generalised filler.",
    "Uses key words of the title: celebrity culture, prominent / unwelcome, contemporary society.",
    "Says something specific (for example, where celebrity culture shows up) without packing in every detail.",
    "Could not be the opening of an essay on a different topic.",
  ],
  "opening-paragraph": [
    "Four or five sentences.",
    "The first sentence deals with global warming and the claim that it is the most serious issue, with no waffle.",
    "Maps out the ground the body will cover (the points or approach to come) without answering everything in detail.",
    "Each sentence follows on from the one before (continuity).",
    "Is specific to the title; may use phrases such as 'This essay will discuss' but does not have to.",
  ],
  "key-sentence": [
    "Gives one clear main point, not several.",
    "The key sentence states that point plainly and would work as the first sentence of a paragraph.",
    "The point is relevant to the internet as a mixed blessing.",
    "The supporting details are specific examples or illustrations that back the key sentence, not new separate points.",
  ],
  "develop-and-close": [
    "Opens with a key sentence that states one main point.",
    "About three sentences develop that point with specific examples or details, not vague claims.",
    "A closing sentence sums up the paragraph as an intermediate conclusion (for example, starting 'Thus') and/or points to the next paragraph.",
    "Stays on one point and is relevant to the chosen title.",
  ],
  "linking-words": [
    "Each of the three sentences carries a suitable linking word or phrase (for example Furthermore, However, On the other hand, Nevertheless, Therefore, Thus).",
    "The links fit the logic: paragraph 3 turns to a problem (contrast), paragraph 4 answers it (for example Nevertheless or Therefore).",
    "When 'however' or a similar word sits in the middle of a sentence, it has a comma before and after it; at the start, a comma after it.",
    "The original meaning of each sentence is kept.",
  ],
  "back-it-up": [
    "Keeps the claim as a key sentence and backs it with at least two specific, accurate pieces of evidence (named events, places, years or actions).",
    "Evidence is brief and to the point, not a long retelling of events.",
    "Avoids vague support such as 'many people say' or 'everyone knows'.",
    "Ends with a sentence that draws a conclusion from the evidence (an intermediate conclusion) - a bonus, not required.",
    "Facts must be accurate; flag anything doubtful.",
  ],
  "closing-paragraph": [
    "Signals the end with a phrase such as 'In conclusion, then', 'Finally', 'As I have argued' or 'Based on this evidence'.",
    "Gives a clear judgement on lowering the voting age to sixteen.",
    "Sums up the reasons in fresh words without slavishly repeating every point, and with no waffle.",
    "Brings the essay back to the question that was set.",
    "Ends with a significant final sentence that leaves the reader something to think about.",
  ],
  "for-and-against": [
    "Two relevant arguments for a ban on smoking in public places and two relevant arguments against.",
    "The arguments are specific (for example health of non-smokers and workers, civil liberties), not vague.",
    "Names a counter-argument and how it would be dealt with.",
    "States the writer's own final view clearly in one sentence.",
    "The plan is balanced and keeps a tight hold on the topic.",
  ],
  "learn-from-models": [
    "Key sentence: the first sentence ('Moreover, Pakistan's young population is one of its greatest strengths').",
    "Linking word: 'Moreover' (and 'Thus' at the closing sentence).",
    "Evidence: more than half the people are under thirty; young people leading in freelancing, sport and the armed forces; small technology firms.",
    "Closing sentence: begins 'Thus' and draws an intermediate conclusion from the evidence (with education and jobs, the young could drive the country forward).",
  ],
  "sentences-and-commas": [
    "Comma splices are replaced with full stops and capital letters (after 'cities', 'it', 'business').",
    "Unnecessary commas are removed ('students, study', 'shopkeepers, lose') - no comma-itis.",
    "'however' in the middle of the sentence has a comma before and after it.",
    "The passage ends with a full stop and every sentence is complete.",
    "The meaning and words of the passage are kept.",
  ],
  "apostrophes-and-spelling": [
    "Its -> It's (it is); it's budget -> its budget (belonging to it).",
    "citys -> city's (possession); pothole's -> potholes and repair's -> repairs (plain plurals); say's -> says.",
    "Their are -> There are; they're promised -> their promised; were the money -> where the money; Were all -> We're all.",
    "to small -> too small.",
    "No new errors are introduced and the meaning is kept.",
  ],
  "exam-technique": [
    "Gives a few minutes to planning (the book: no more than five to seven minutes for an essay of an hour or less, so fewer for thirty minutes).",
    "Gives most of the time to the body.",
    "Keeps time for a conclusion and for checking.",
    "The minutes add up to about thirty.",
    "Explains the plan with the book's reasoning: share out time sensibly, do not run out and finish in note form.",
  ],
};
