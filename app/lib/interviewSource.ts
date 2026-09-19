export interface InterviewSourcePage {
  sourceImage: string;
  sourcePage: string;
  language: 'en' | 'ur';
  prompts: string[];
  note?: string;
}

export const interviewSourcePages: InterviewSourcePage[] = [
  {
    sourceImage: 'IMG20260919120150.jpg', sourcePage: '72, 73', language: 'ur',
    prompts: [
      'عراق کے صدر', 'عراق کے وزیر اعظم', 'سری لنکا کی صدر', 'برطانیہ کے وزیر اعظم', 'چائنہ کے صدر', 'چائنہ کے وزیر اعظم',
      'سعودی عرب کے بادشاہ', 'سعودی وزیر خارجہ', 'جاپان کے وزیر اعظم', 'امیر کویت', 'کویت کے وزیر اعظم',
      'انڈونیشیا کے صدر', 'مالدیپ کے بادشاہ', 'نیپال کے بادشاہ', 'نیپال کے وزیر اعظم', 'ملائیشیا کے وزیر اعظم',
      'ایران کے صدر', 'ایران کے وزیر خارجہ', 'ترکی کے صدر', 'ترکی کے وزیر اعظم', 'انڈیا کے صدر', 'انڈیا کے وزیر اعظم',
      'انڈیا کے وزیر خارجہ', 'انڈیا کے وزیر داخلہ', 'بنگلہ دیش کے صدر', 'بنگلہ دیش کے وزیر خارجہ', 'امریکہ کے صدر',
      'امریکی وزیر خارجہ', 'امریکہ کے وزیر دفاع', 'امریکہ میں پاکستانی سفیر', 'برطانیہ میں پاکستانی سفیر', 'افغانستان کے صدر',
      'آسٹریلیا کے صدر', 'صدر پاکستان', 'وزیر اعظم پاکستان', 'وفاقی وزیر خزانہ', 'وفاقی وزیر داخلہ', 'وفاقی وزیر تعلیم',
      'وفاقی وزیر توانائی', 'وفاقی وزیر ریلوے', 'وفاقی وزیر دفاع', 'وفاقی وزیر صحت', 'وفاقی وزیر پیداوار', 'وفاقی وزیر کھیل',
      'وفاقی وزیر مذہبی امور، زکوٰۃ و عشر',
    ],
    note: 'The source leaves the answers blank. Several titles are obsolete or incorrect: Maldives and Nepal are republics, Türkiye no longer has a prime minister, Australia has no president, and Pakistan has a High Commissioner in the UK. Verify the current structure and officeholder rather than filling old titles with guesses. Afghanistan requires de facto/de jure context.',
  },
  {
    sourceImage: 'IMG20260919120143.jpg', sourcePage: '66 and facing interview notes', language: 'ur',
    prompts: [
      'آپ کے دوستوں کی آپ کے بارے میں کیا رائے ہے؟', 'اپنے سب سے قریبی دوست کا حلیہ بتائیں۔',
      'آپ کون سا اخبار پڑھتے ہیں؟', 'اخبار کے ایڈیٹر کا نام بتائیں۔', 'اخبار کی قیمت بتائیں۔', 'اخبار کے کتنے صفحات ہیں؟',
      'آپ کے مشاغل کیا ہیں؟', 'VCR سے کیا بنتا ہے؟', 'VCR کی خوبیاں اور خامیاں بیان کریں۔', 'BP سے کیا بنتا ہے؟',
      'BP کبھی دیکھی ہے؟', 'کیوں اور کب دیکھی تھی؟', 'کہاں دیکھی تھی؟', 'BP کیسی لگی؟',
      'میٹرک میں کتنے نمبر تھے؟', 'میٹرک کہاں سے کیا ہے؟', 'میٹرک کس سن میں کیا؟', 'میٹرک میں آپ کا رول نمبر کیا تھا؟',
      'میٹرک کے نمبروں کا مجموعہ؟', 'میٹرک کے نمبروں کا فیصد؟', 'میٹرک کون سے مضامین میں کیا؟',
      'میٹرک کے بعد ایف اے میں کتنا گیپ ہے؟', 'ڈپلومہ کس سال میں کیا؟', 'کون سے کالج سے کیا؟', 'ڈپلومہ میں کتنے نمبر تھے؟',
      'ڈپلومہ میں آپ کا رول نمبر کیا تھا؟', 'ڈپلومہ کے نمبروں کا مجموعہ؟', 'ڈپلومہ کے نمبروں کا فیصد؟', 'نمبروں کا مجموعہ؟',
      'ڈپلومہ میں آپ کا پسندیدہ مضمون؟', 'کھیل کون سے کھیلتے ہیں؟', 'پاکستان کی ہاکی ٹیم کا کپتان کون ہے؟',
      'دنیا کا تیز ترین دوڑنے والا کون ہے؟', 'باؤلنگ کتنے قسم کی ہوتی ہے؟', 'آپ کا پسندیدہ کھلاڑی کون ہے؟',
      'ایک روزہ میچ میں سب سے زیادہ سکور کس نے کیا؟', 'کرکٹ کی پچ کی لمبائی کتنی ہوتی ہے؟', 'وکٹوں کا درمیانی فاصلہ کتنا ہوتا ہے؟',
      'کرکٹ کی گیند کا وزن کتنا ہوتا ہے؟', 'مختلف فیلڈرز کے نام بتائیں۔', 'آؤٹ کتنی قسم کے ہوتے ہیں؟',
    ],
    note: 'Use your own life details, not scripted answers. BP is ambiguous in the source; ask what the interviewer means. Its printed expansions are blueprint, boiling point and blood pressure. Sports captains and records need a current check. The claim that a VCR has no disadvantages is an opinion, not a model answer.',
  },
];
