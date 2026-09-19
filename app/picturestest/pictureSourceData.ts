export interface SourcePromptSet {
  id: string;
  title: string;
  language: 'en' | 'ur';
  sourceImage: string;
  sourcePage: string;
  seconds: number;
  prompts: string[];
  note?: string;
}

export const pictureSentenceSets: SourcePromptSet[] = [
  {
    id: 'english-2', title: 'English set 2', language: 'en', sourceImage: 'IMG20260919120015.jpg', sourcePage: '12', seconds: 360,
    prompts: [
      'In case of war', 'By chance he', 'The question is', 'He realized that he must',
      'When he failed he tried to', 'For the time being he is', 'His success made him', 'He is sick because',
      'In my view he', 'The only trouble is', 'The result proved that he was', 'In his class',
      'In the middle of the night', 'It appears that you', 'Sitting alone he', 'It was easy for him to',
      'During the last two years', 'For each mistake', 'Sometimes he thinks', 'I enjoy',
      'In some ways he', 'While playing the match', 'Although he is rich yet', 'To control his anger',
      'Almost every year he', 'At last he found out',
    ],
  },
  {
    id: 'english-3', title: 'English set 3', language: 'en', sourceImage: 'IMG20260919120015.jpg', sourcePage: '13', seconds: 360,
    prompts: [
      'In this hospital', 'On seeing the blood he', 'He came to know that', 'If I was in his place',
      'I think I can', 'He is able to', 'To achieve his purpose he', 'Under the most tiring circumstances he',
      'He dislikes to', 'In the end he', 'The most valuable thing in life is', 'It is quite natural that girl',
      'Early in his life', 'He was very young when', 'When he failed he', 'He never tires of',
      'With his money', 'On the way', 'If you insult him', 'He rushed out of his office',
      'It was obvious that', 'The difference between', 'To become a leader', 'He indicated that',
      'He was sad therefore', 'It is bad habit to',
    ],
  },
  {
    id: 'english-4', title: 'English set 4', language: 'en', sourceImage: 'IMG20260919120020.jpg', sourcePage: '14', seconds: 360,
    prompts: [
      'In a fit of rage he', 'In his opinion', 'He always hated to', 'My mother thinks',
      'His relatives are', 'There is a risk of', 'To look smart she', 'Because she is a girl',
      'Rejection made him', 'The reason of his success', 'The guard hesitated to', 'He was under pressure',
      'The fact is', 'He is interested to', 'To avoid failure he', 'The more he tried',
      'He was alarmed when', 'He possesses', 'It is difficult to work when', 'The woman cried because',
      'His memory is', 'When I met her first time', 'My father is always', 'My next task is',
      'The cause of his anger', 'I cannot understand why',
    ],
  },
  {
    id: 'english-5', title: 'English set 5', language: 'en', sourceImage: 'IMG20260919120020.jpg', sourcePage: '15', seconds: 360,
    prompts: [
      'They are usually', 'I am not aware that', 'He is always willing to', 'When she grew old',
      'Far away from his house', 'He became impatient when', 'It is very seldom that he', 'His family is',
      'If it is necessary I will', 'To gain popularity he', 'A large portion of his time', 'The teacher feels',
      'He was hopeful', 'Our leaders are', 'He wants to win', 'It is not necessary that',
      'His heart sank because', 'He decided that', 'To express his anger', 'It was very clear that',
      'The best time of his life', 'The best thing about mother', 'They help one another to', 'If you do not work',
      'Because of a little discomfort', 'It is high time to',
    ],
  },
  {
    id: 'english-6', title: 'English set 6', language: 'en', sourceImage: 'IMG20260919120024.jpg', sourcePage: '16', seconds: 360,
    prompts: [
      'The best part', 'I have applied', 'To change his behaviour', 'I always feel that',
      'He loved to', 'He was very tense because', 'I am glad', 'He says something but',
      'You may like', 'Due to his ill health', 'It is quite accurate to say', 'He was very excited about',
      'We should not forget', 'He spread the rumour that', 'Behind his cool', 'The only fear',
      'Young generation is', 'Music is', 'I cannot tolerate', 'In the company of others',
      'We might invite', 'Wars can lead to', 'I am used to', 'Happiness cannot be',
      'She is capable of', 'His only worry is',
    ],
  },
  {
    id: 'english-7', title: 'English set 7', language: 'en', sourceImage: 'IMG20260919120024.jpg', sourcePage: '17', seconds: 360,
    prompts: [
      'It is not wise to', 'Almost everybody has', 'Today we know', 'It is fairly easy',
      'He wanted to say', 'I have tried', 'In my student days', 'I have often been asked',
      'He forget to', 'I have yet to', 'He was anxious to', 'I have often experienced',
      'He feels the need', 'His share of', 'He was very serious', 'It is beyond my knowledge',
      'His attitude towards subordinates', 'I remember', 'When working with people', 'Privately he',
      'It is cruel', 'It is always true that', 'He took a job because', 'If you allow me',
      'In his heart', 'He was always',
    ],
  },
  {
    id: 'english-8', title: 'English set 8', language: 'en', sourceImage: 'IMG20260919120028.jpg', sourcePage: '18', seconds: 360,
    prompts: [
      'At last I hope', 'He objected to', 'In my thoughts', 'To support himself',
      'The person who', 'He felt ashamed of', 'He admitted that', 'He is shy',
      'It seems as if', 'He was invited to', 'In my family', 'He got the message that',
      'On seeing a stranger', 'It takes a great deal of courage', 'My parents are', 'They became so rich',
      'The source of his strength is', 'He was surprised', 'Beautiful girls', 'On his way',
      'I am very', 'I was surprised to know', 'All my senses', 'In a short time',
      'If you have nothing to do', 'He has to accept that',
    ],
  },
  {
    id: 'english-9', title: 'English set 9', language: 'en', sourceImage: 'IMG20260919120028.jpg', sourcePage: '19', seconds: 360,
    prompts: [
      'I recognized that', 'My aim is', 'It is needless to say', 'He is poor but',
      'People around me', 'He plans to', 'Until you apologize', 'He felt sorry because',
      'It is painful', 'He is considered to be', 'She solved the problem because', 'In his dreams',
      'I am having trouble', 'To save his skin', 'He hates to', 'He needed help because',
      'I feel a little hurt', 'Women today', 'I imagine myself to be', 'He missed',
      'It would be useful', 'The result of this conflict', 'I feel bad', 'It is fashionable now',
      'I never really wanted', 'As the last resort',
    ],
  },
  {
    id: 'english-10', title: 'English set 10', language: 'en', sourceImage: 'IMG20260919120031.jpg', sourcePage: '20', seconds: 360,
    prompts: [
      'You should remember', 'His mistakes', 'The pay is', 'When he became rich',
      'He offered me', 'During his childhood', 'Although he was young yet', 'It is important for me',
      'My future', 'His attention is', 'I have never done', 'It is part of life',
      'He is popular because', 'For us dancing is', 'Depending on others', 'It appears that',
      'Under normal circumstances', 'It seems to me that', 'You cannot deny that', 'He has never used',
      'Some women are', 'My father always says', 'When he is alone', 'He became uneasy because',
      'He was careful to', 'He forced me to',
    ],
  },
];

export const lifeEventPrompts = [
  'Unforgettable incident of my life', 'Aim of my life', 'Depressive moment of my life',
  'Sweetest dream of my life', 'Happiest day of my life', 'Failure of life',
  'Worst moment of life', 'My ambition of my life', 'Turning point of my life',
  'Highest achievement of my life', 'Strange event of my life', 'Thrilling event of my life',
  'Painful event of my life', 'Charming period of my life', 'Fruitful period of my life',
  'Successful moment of my life', 'Defeat of my life', 'Shocking news of my life',
  'Bad period of my life', 'Worry of my life', 'Latest dream of my life',
  'Frequent dream of my life', 'Happiest dream of my life', 'Pleasant dream of my life',
];

export const pictureWordPages = [
  {
    sourceImage: 'IMG20260919120042.jpg', sourcePage: '26',
    words: `Shine Rumour Careful Defense
Confidence Serious Revenge Atom
Humble Talk Natural Take
Easy Shock Prepare Greed
Time Mother Father Sister
Brother Risk Award Withdraw
Defeat Snake Continue Custom
Music Enjoy Army Use
Help Interest Sweet Careful
Fast Train Reaction Group
Health Blood Fortune Merry
Loyalty Ask Duty Fail
Action Problem Fight Worry
Fault Field Trouble Death
Stop Run Differ Light
Luck Pity Victory Dislike
Sister Sad Peace Meet
Rent Simple Honest Hate
Study Wait Write Sick
Trial Matching Life Punish
Insist Flower Fit Good`.split(/\s+/),
  },
  {
    sourceImage: 'IMG20260919120042.jpg', sourcePage: '27',
    words: `Hearth Atom Lead Lonely
Sensible Religion Need Home
Accept Alone Father System
Make Nature Work Atom
Country Army Step Company
Love Duty Girl Eat
Decide Beat Fight Lie
Give Enjoy Fly Save
Sick War Alone Father
System Make Nature Work
Difficulty Health Impossible Lonely
Affection Sympathy Company Courage
Meet Secure Love Responsibility
Character Understand Sports Responsible
Tried Boat Failure Science
Space Sky Goal Busy
Mother Save False Knowledge
Sleep Unfair Sister Foe
Project Regular Adventure Climb
Fly Now Tie Flow
Light Pressure Dig Sink
Cooperative Change Challenge Coward
Rest Decide Alone Avoid`.split(/\s+/),
  },
  {
    sourceImage: 'IMG20260919120035.jpg', sourcePage: '23',
    words: `Family Danger Officer Agree
Sad Soldier Regarded Alone
Drink Begin Holiday Playground
Fellow Dictatorship Boat Plan
Gay Solve Weak Wisdom
Wife Time Fast Annoy
Fear Wine Escape Risk
Bold Kill Luck Climb
Future Zeal Haste Leader
Appeal Faith Make Race
Last Will Wish Care
Mountain Efficiency Weak Week
Uppermost Wisdom Service Old
Persuade Worry Lead Leader
Young Guide Failure Injustice
Question Zeal Insult Dislike
Use Wrong Bold Future
Fair Mistake Danger Hate
Respect Faith Climb Kill
Soft Hope Favour Fever
Offer Play Sex Keep
Overcome Follow Pick Hot
Cold Warm Say Tension`.split(/\s+/),
  },
  {
    sourceImage: 'IMG20260919120039.jpg', sourcePage: '24',
    words: `Dark Pain Hide War
Lazy Smoke Burn Foot
Differ Meet Bow Pick
Tear Habit Clean Tire
Car Lazy Crush Front
Show Fall Wound Step
Defend Oppose Catch Habit
Dirt Slip Key Dear
Lazy Spend Past Swim
Error Loose Lost Opposite
Guilt Swim Night Wrong
Dark Press Steam Join
Lie Hesitate Dirt Beer
Bow Fear Tear Rule
Team Chair Joy Stop
Find Money Death Football
Flower Puzzle Shoot Unable
Pick Find Cinema Advice
Stop Need Quick Child`.split(/\s+/),
  },
  {
    sourceImage: 'IMG20260919120039.jpg', sourcePage: '25',
    words: `House Sensible Life Power
Relax Punish Sword Interview
Bright Careful Success Trust
Solve Story Break Fear
Defeat Enemy Garden Faith
Help Cinema Money Peace
Fine Delay Character Travel
Journey Ghost Respect Duty
Life Poor Use Climb
Problem Attempt Happy Books
Rest Short Design Co-operater
Discipline Plan Neglect Step
Climb Life Win Honesty
Machine Afraid Lead Think
Hobby Obtain Idea Solve
Beat Continuous Punctuality Copy
Cut Beautiful Book Bad
Arrived Air Appeal Alone
Avoid Agree Action Assist
Award Snake Drop Slip
Task Think Protect Home
Afraid Able Excuse Luck
Good Knife Encourage Danger`.split(/\s+/),
  },
];

export const pictureStoryPrompts = [
  'Their relations were very good but suddenly...',
  'She was all alone in her room suddenly...',
  'Her life was glamours till...',
  'Their relation suddenly changed when...',
  'Their relation took new turn when...',
  'He could not stand firm because...',
  'Ali was sitting with his friends suddenly...',
  'He was unable to bear the expenses of his family then he...',
  'In a dark stormy night she was all alone in her room suddenly...',
  'He worked very hard but...',
  'On seeing a lonely girl on the road he...',
  'He joined services to earn money but when he became a leader he...',
  'He was very hard worker but failed to fulfill his expenses so he...',
  'On his youth Ahmad wanted to...',
  'Because of his youth he...',
  'He could not stand firm because...',
  'She was standing on a lonely road suddenly she...',
  'He could not afford his family expenditure then he decided...',
  'He wanted to became, a rich man but when become leader of men he...',
  'Amjad feels his youth and he wants to proved...',
  'He decided to join army for money but...',
  'Zahoor was a poor boy one day he...',
  'Their relation took a new turn when...',
  'Friends were sitting in around suddenly...',
  'When he saw her in trouble then he...',
].map((prompt, index) => ({
  id: `pointer-${index + 1}`,
  prompt,
  sourceImage: 'IMG20260919120031.jpg',
  sourcePage: '21',
}));
