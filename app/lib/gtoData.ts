export interface TopicPage {
  sourceImage: string;
  sourcePage: string;
  kind: 'discussion' | 'lecture';
  language: 'en' | 'ur';
  topics: string[];
  note?: string;
}

export const sourcePlanningScenarios = [
  {
    id: 'bridge-repair', title: 'Repair the broken bridge', sourceImage: 'IMG20260919120052.jpg', sourcePage: '33',
    brief: 'Start work at 06:00 and rebuild a damaged bridge by 18:00. Trucks are available at GHQ and travel at 60 km/h. The sketch marks GHQ, point B, point E, a sand hill and a cement depot. Arrange the transport of labour and materials.',
    sourceText: 'صبح 6 بجے کام شروع کر کے شام 6 بجے تک ایک ٹوٹا ہوا پل دوبارہ تعمیر کرنا ہے۔ GHQ میں ٹرک موجود ہیں جن کی رفتار 60 km/h ہے۔ ایک ٹرک Point E کی طرف جاتا ہے اور دوسرا سیمنٹ ڈپو کی طرف۔ ریت، سیمنٹ، لکڑیاں اور دوسری چیزیں پل تک پہنچانی ہیں۔',
    facts: ['Work window: 06:00 to 18:00.', 'Truck speed stated in the text: 60 km/h.', 'Named locations: GHQ, B, E, sand hill, cement depot and bridge.', 'The sketch includes labels 60, 40 and 45, without a clearly stated unit.'],
    caveats: ['The supplied worked answer has inconsistent times: a 40-minute leg after 09:54 is reported as 10:14.', 'The cement-depot timeline also does not follow consistently from its stated travel and loading times.', 'Truck capacity, material quantities, repair duration and some route distances are not specified. Do not invent them or treat the printed answer as a validated solution.'],
    prompts: ['What facts must you clarify before sending the trucks?', 'Which materials and people are essential before repair can begin?', 'Write a route table with travel, loading and return time for each truck.', 'Check whether the final delivery leaves enough time to rebuild and inspect the bridge.'],
  },
];

export const topicPages: TopicPage[] = [
  {
    sourceImage: 'IMG20260919120049.jpg', sourcePage: '30, 31', kind: 'discussion', language: 'en',
    topics: [
      'In view of the prevailing sectarianism in the country, all religious-based militant groups should be banned. Give your views.',
      'Northern Areas should be merged in Pakistan with full-fledged status of a province. Discuss.',
      'What could be effective for the defence of Pakistan: education or weapons? Discuss.',
      'What role can Pakistan play to bring Islamic countries on one platform? Discuss.',
      'In Pakistan elections should be held after every four years instead of five years. Discuss.',
      'The parliamentary form of government has failed in Pakistan. We should not hesitate in opting for a presidential form. Give your views.',
      'The ratio of vacations in educational and other institutions in Pakistan is greater than in other countries. Discuss.',
      'Religion and government are two different things. These should not be amalgamated. Discuss.',
      'We should link the signing of the CTBT with the Kashmir problem. Discuss.',
    ],
    note: 'Historical debate wording is preserved. Northern Areas is an older name for Gilgit-Baltistan; verify current constitutional arrangements before answering.',
  },
  {
    sourceImage: 'IMG20260919120049.jpg', sourcePage: '30, 31', kind: 'discussion', language: 'ur',
    topics: [
      'پاکستان میں بڑھتی ہوئی فرقہ واریت کو نظر رکھتے ہوئے تمام مذہبی جماعتوں پر پابندی لگا دینی چاہیے۔ آپ کا کیا خیال ہے؟',
      'تمام شمالی علاقہ جات کو ایک مکمل صوبے کی شکل دے کر اس کو پاکستان میں ضم کر دینا چاہیے۔ آپ کا کیا خیال ہے؟',
      'پاکستان کے دفاع کیلئے کیا چیز ضروری ہے، تعلیم یا اسلحہ؟ بحث کریں۔',
      'تمام اسلامی ممالک کو ایک پلیٹ فارم پر اکٹھا کرنے کیلئے پاکستان کیا کردار ادا کر سکتا ہے؟ بحث کریں۔',
      'پاکستان میں الیکشن پانچ کے بجائے چار سالوں میں ہونے چاہیے۔ بحث کریں۔',
      'پاکستان میں پارلیمانی نظام حکومت فیل ہو چکا ہے۔ ہمیں صدارتی نظام حکومت اپناتے ہوئے ہچکچانا نہیں چاہیے۔',
      'پاکستان میں تعلیمی اور دیگر اداروں میں چھٹیوں کا تناسب دوسرے ممالک سے زیادہ ہے۔ بحث کریں۔',
      'مذہب اور حکومت دو الگ الگ چیزیں ہیں۔ ان کو ایک نظر سے نہیں دیکھنا چاہیے۔ بحث کریں۔',
      'ہمیں CTBT پر دستخط کرنے کی پرابلم کو کشمیر کی پرابلم کے ساتھ منسلک کرنا چاہیے۔ بحث کریں۔',
    ],
    note: 'The first Urdu motion refers to religious parties, while the English wording refers to militant groups. The source meanings differ; they have not been silently merged.',
  },
  {
    sourceImage: 'IMG20260919120052.jpg', sourcePage: '32', kind: 'discussion', language: 'en',
    topics: [
      'International sports competition between countries is a source of healthy relationships.',
      'Television can play a vital role to improve the literacy rate in Pakistan. Discuss.',
      'What are the motives of the United States for its keen interest and undue interference in the internal affairs of Pakistan?',
      'What is most important for Pakistan to preserve its freedom and sovereignty: continue its nuclear programme, increase the strength of its armed forces or improve its foreign policy?',
      "Women, despite their adequate potential in various fields, cannot match up to men's performance. Discuss.",
    ],
    note: 'These are debate motions from the source, not established facts. Challenge unsupported or discriminatory premises and give a reasoned opinion.',
  },
  {
    sourceImage: 'IMG20260919120052.jpg', sourcePage: '32', kind: 'discussion', language: 'ur',
    topics: [
      'بین الاقوامی کھیلیں تمام ممالک کے لئے صحت مند تعلقات کا بہترین ذریعہ ہیں۔ بحث کریں۔',
      'پاکستان میں شرح خواندگی میں اضافے کے لئے ٹیلی ویژن بہت اہم کردار ادا کر سکتا ہے۔ بحث کریں۔',
      'امریکہ کی پاکستان کے اندرونی معاملات میں غیر معمولی دلچسپی اور مداخلت کی کیا وجوہات ہیں؟',
      'پاکستان کو اپنی آزادی اور بقا کو برقرار رکھنے کے لئے کیا چیز زیادہ ضروری ہے: نیوکلیئر پروگرام کو جاری رکھنا، مسلح افواج میں اضافہ یا اپنی خارجہ پالیسی میں رد و بدل اور بہتری؟ بحث کریں۔',
      'طبقہ نسواں مختلف میدانوں میں اپنی تمام صلاحیتوں کے باوجود مردوں کے مقابلے میں کم تر ہے۔ بحث کریں۔',
    ],
  },
  {
    sourceImage: 'IMG20260919120046.jpg', sourcePage: '28, 29', kind: 'discussion', language: 'en',
    topics: [
      'Who plays the important role in the grooming of children, father or mother?',
      "Struggle for women's rights is obligatory in country or not? Discuss.",
      'The personal interests are prevailing over our national interest. Discuss.',
      'The movement for the rights of women is imposing negative effects on society.',
      'Why are western nations more developed than us?',
      'What is the reason for deterioration of moral values in our society?',
      'Football is cheaper than cricket. Why is the Government of Pakistan not bringing up a healthy environment for this game?',
      'Causes of terrorism in Pakistan.',
      'Is the reason for unemployment education or poverty? Discuss.',
      'Deeni Madrasas are playing an important role in educating poor children but their impression is not good. What steps should be taken to improve their impression?',
      'The reasons for increasing smuggling in Pakistan and what steps should be taken to overcome this?',
      'Should we recognize India as a regional power? Discuss.',
      'Islam gives the message of peace but we are murdering one another. Discuss.',
      'How can we counter western and Indian media?',
      'Is India sincere in SAARC? If not, what steps should be taken?',
    ],
  },
];
