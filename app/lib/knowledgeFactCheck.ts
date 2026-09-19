// Fact-check layer for the photographed Urdu Islamic-studies notes.
//
// The transcriptions in extractedBatchA/B stay faithful to the print. This
// file records a verdict for each item, keyed by `${sectionId}:${itemIndex}`.
// Items not listed here were reviewed and found consistent with standard
// references (Ibn Hisham's Sirah, al-Mubarakpuri's Ar-Raheeq al-Makhtum,
// Tanzil Quran metadata and mainstream Hanafi fiqh manuals, which the notes
// follow). Where scholars or historians genuinely disagree, the item is
// marked "disputed" rather than forced into a single answer.

export type FactCheckStatus = 'verified' | 'context' | 'corrected' | 'disputed';

export type FactCheck = {
  status: Exclude<FactCheckStatus, 'verified'>;
  /**
   * corrected: the printed answer is wrong; `note` gives the right one.
   * disputed: sources genuinely disagree; `note` explains how.
   * context: the printed answer is right but incomplete or needs a caution.
   */
  note: string;
};

export const knowledgeFactChecks: Record<string, FactCheck> = {
  // Page 90–91: Uhud causes and mosques
  'batch-a-p90-islamic-knowledge:0': { status: 'corrected', note: 'The main causes were revenge for Badr and Quraysh’s need to reopen their trade route to Syria. The “cattle dispute” reason is not found in the standard sirah sources.' },
  'batch-a-p90-islamic-knowledge:9': { status: 'corrected', note: 'The Babri Masjid stood in Ayodhya, India. It was demolished by a Hindu nationalist mob on 6 December 1992. The printed wording is derogatory. Use neutral language in an interview.' },
  'batch-a-p91-mosques:0': { status: 'disputed', note: 'Ambiguous: several mosques are called “Shahi Masjid”. In this context the expected answer is usually Delhi’s Jama Masjid (Masjid-i-Jahan-Numa), built by Shah Jahan.' },

  // Page 92–93
  'batch-a-p92-islamic-knowledge:4': { status: 'disputed', note: 'This is an opinion list, not a fixed fact. Abdur Rahman ibn Abi Bakr is not normally counted among Islam’s great generals. Names such as Amr ibn al-As are more commonly given.' },
  'batch-a-p92-islamic-knowledge:5': { status: 'corrected', note: 'About 605 CE. When the Kaaba was rebuilt, the Prophet ﷺ, then aged 35, settled the tribes’ dispute over who would put the Black Stone back.' },
  'batch-a-p93-islamic-knowledge:5': { status: 'corrected', note: 'Jabal al-Nur (with the Cave of Hira) is in Makkah. Jabal al-Rahmah is at Arafat. They are not in the same place.' },

  // Page 94–95: battles
  'batch-a-p94-islamic-history:0': { status: 'disputed', note: 'The source does not name the battle. It follows a Qadisiyyah-style question. Casualty figures for early battles vary widely between historians.' },
  'batch-a-p94-islamic-history:1': { status: 'corrected', note: 'Yarmouk, 15 AH / 636 CE, with Khalid ibn al-Walid in field command. Heraclius ran the campaign from Antioch but did not fight. The Byzantine field commander was Vahan. Troop numbers are traditional estimates.' },
  'batch-a-p94-islamic-history:2': { status: 'disputed', note: 'Traditional Muslim sources give about 3,000 Muslim martyrs. Estimates of Byzantine losses range from tens of thousands upward.' },
  'batch-a-p94-islamic-history:3': { status: 'corrected', note: 'In North Africa under Uthman, Abdullah ibn Sa’d conquered Ifriqiya (modern Libya and Tunisia). Cyprus (649 CE) was taken by Mu’awiya’s fleet and is not in North Africa. Turkey and Athens were not conquered.' },
  'batch-a-p94-islamic-history:4': { status: 'context', note: 'Uthman approved the first navy. Mu’awiya, then governor of Syria, built and led it.' },
  'batch-a-p95-battles:0': { status: 'corrected', note: 'Traditional sources give about 3,000 Muslims against a very large Byzantine–Ghassanid army, often quoted as 100,000 or more.' },
  'batch-a-p95-battles:1': { status: 'context', note: 'Date, strength and opponents are correct. The source omits the opposing strength, which traditional accounts put at about 20,000.' },
  'batch-a-p95-battles:2': { status: 'disputed', note: 'Traditional accounts give 6,000 captives, 24,000 camels and about 40,000 sheep and goats.' },
  'batch-a-p95-battles:3': { status: 'context', note: '9 AH / 630 CE is correct. The expedition was against the Byzantine Empire, not a generic enemy.' },
  'batch-a-p95-battles:4': { status: 'corrected', note: 'About 30,000 Muslims marched, but no battle was fought because the Byzantine army never came out. There is no opposing strength or commander to give.' },
  'batch-a-p95-battles:5': { status: 'corrected', note: 'Masjid al-Dirar was destroyed on the return from Tabuk (9 AH), not after Hunayn.' },
  'batch-a-p95-battles:7': { status: 'corrected', note: 'Usually dated 15 AH / 636 CE, though some sources say 14 AH. Qadisiyyah opened Iraq. Persia itself fell later, mainly after Nahawand (642 CE). Sa’d ibn Abi Waqqas as commander is correct.' },

  // Page 96–97
  'batch-a-p96-battles:0': { status: 'disputed', note: 'About 70 Muslims were martyred. Traditional counts of Quraysh dead range from about 22 to 37.' },
  'batch-a-p96-battles:4': { status: 'disputed', note: 'The trench’s width and depth are estimates that differ between sources. Treat 5 gaz as approximate.' },
  'batch-a-p96-battles:7': { status: 'disputed', note: 'The siege of Khaybar is usually given as a few weeks to about a month and a half, not a full two months. Ninety-three killed is the traditional figure.' },
  'batch-a-p97-caliphs-badr-uhud:2': { status: 'corrected', note: 'Traditional accounts name rebels such as Sudan ibn Humran, Kinanah ibn Bishr and al-Ghafiqi ibn Harb. Some later sources blame Abdullah ibn Saba for stirring the revolt, but historians dispute his role. Avoid naming him as the killer.' },
  'batch-a-p97-caliphs-badr-uhud:5': { status: 'context', note: 'Jamal (656) and Nahrawan are correct. Siffin (657) is the other major event of Ali’s caliphate and should be mentioned.' },
  'batch-a-p97-caliphs-badr-uhud:7': { status: 'corrected', note: 'Badr: 17 Ramadan 2 AH, March 624 CE (not 623). About 313 Muslims against roughly 1,000 Quraysh.' },
  'batch-a-p97-caliphs-badr-uhud:8': { status: 'corrected', note: '70 prisoners and 14 Muslim martyrs are correct. About 70 Quraysh were killed, not 72.' },
  'batch-a-p97-caliphs-badr-uhud:9': { status: 'corrected', note: 'About 1,000 set out, and roughly 700 fought after Abdullah ibn Ubayy withdrew with about 300. Quraysh had about 3,000.' },

  // Page 98–99
  'batch-a-p98-ashra-list-continuation:3': { status: 'corrected', note: 'The name is Sa’id ibn Zayd (سعید بن زید), not Sa’d.' },
  'batch-a-p98-caliphs:2': { status: 'corrected', note: 'The Battle of Chains (Dhat al-Salasil) was fought in 633 CE (12 AH) in Iraq, where Khalid ibn al-Walid defeated the Sassanid commander Hormuz. Rome was not involved. A separate expedition of the same name took place in 8 AH.' },
  'batch-a-p98-caliphs:3': { status: 'corrected', note: 'This means Abu Bakr, whose given name was Abdullah. He died on 22 Jumada al-Akhirah 13 AH, August 634 CE. “534” is a misprint for 634.' },
  'batch-a-p98-caliphs:5': { status: 'corrected', note: 'About 10 years and 6 months (634–644 CE).' },
  'batch-a-p99-worship-companions:5': { status: 'disputed', note: 'Sumayyah is widely called the first martyr of Islam. Some sources name al-Harith ibn Abi Halah as the first male martyr, while others name Yasir, Sumayyah’s husband.' },
  'batch-a-p99-worship-companions:8': { status: 'disputed', note: 'Their number changed over time. Seventy is often quoted, and some reports mention several hundred.' },
  'batch-a-p99-worship-companions:9': { status: 'corrected', note: 'Uwais al-Qarni never met the Prophet ﷺ, so he is counted as a Tabi’i (Successor), not a Sahabi. He is praised in a hadith in Sahih Muslim.' },

  // Page 100–101: worship
  'batch-a-p100-worship:1': { status: 'corrected', note: 'Sawm means to abstain. Ramadan fasting became obligatory in Sha’ban 2 AH, after the Hijrah, not in 13 Nabawi at the Mi’raj.' },
  'batch-a-p100-worship:4': { status: 'disputed', note: 'Most scholars date it to 9 AH, and some say 6 AH.' },
  'batch-a-p100-worship:9': { status: 'corrected', note: 'Both are usually dated later. The hijab verses are dated to about 5 AH, and the tayammum verse to the Banu al-Mustaliq expedition (5 or 6 AH).' },
  'batch-a-p101-religious-terms:5': { status: 'corrected', note: 'Funeral prayer is a correct example. I’tikaf in the last ten days of Ramadan is a communal sunnah (sunnah mu’akkadah ’ala al-kifayah), not a fard kifayah.' },

  // Page 102–103
  'batch-a-p102-scriptures-prayers:1': { status: 'disputed', note: 'A popular figure with no fixed counting method. Direct mentions of salah and its forms number under 100.' },
  'batch-a-p102-scriptures-prayers:2': { status: 'disputed', note: 'Reports agree that two prayers, morning and evening, were offered before the Mi’raj, but they differ on exactly which.' },
  'batch-a-p102-scriptures-prayers:3': { status: 'disputed', note: 'The five prayers were made obligatory at the Mi’raj. Its exact date (often given as 27 Rajab, about a year before the Hijrah) is disputed.' },
  'batch-a-p102-scriptures-prayers:4': { status: 'disputed', note: 'Jumu’ah was first held in Madinah before the Hijrah, led by Mus’ab ibn Umair or As’ad ibn Zurarah. The Prophet ﷺ led his first Jumu’ah after arriving.' },
  'batch-a-p102-scriptures-prayers:5': { status: 'corrected', note: 'The Prophet ﷺ led his first Friday prayer in the valley of Banu Salim ibn Awf (now Masjid al-Jumu’ah), just after leaving Quba, in Rabi’ al-Awwal 1 AH.' },
  'batch-a-p102-scriptures-prayers:8': { status: 'corrected', note: 'The Hanafi rule is a journey of about 48 miles (77–78 km) or more with an intended stay of less than 15 days. Other schools use different limits.' },
  'batch-a-p102-scriptures-prayers:9': { status: 'disputed', note: 'The year numeral is unclear in the photo. The funeral prayer is generally dated to the first year in Madinah.' },
  'batch-a-p103-quran-hadith-angels:4': { status: 'corrected', note: 'A hadith is a report of what the Prophet ﷺ said, did or approved. The sunnah is his established practice and way. The source’s distinction is too simple.' },
  'batch-a-p103-quran-hadith-angels:5': { status: 'corrected', note: 'Sahih Muslim is by Imam Muslim ibn al-Hajjaj al-Naysaburi, not “Hajjaj bin Muslim”. Sunan Abi Dawud is by Abu Dawud Sulayman ibn al-Ash’ath. Sunan al-Nasa’i is by Ahmad ibn Shu’ayb al-Nasa’i.' },
  'batch-a-p103-quran-hadith-angels:8': { status: 'context', note: 'The descriptions match tradition. Israfil will blow the Sur (صور), not “شور”. The name Izra’il comes from tradition, while the Quran says “Malak al-Mawt”.' },

  // Page 104–107: Quran
  'batch-a-p104-quran-questions:1': { status: 'corrected', note: 'Maryam, the only woman named in the Quran, and the wife of Pharaoh, traditionally named Asiya (66:11). Aisha is not named, though 24:11–26 defends her honour.' },
  'batch-a-p104-quran-questions:2': { status: 'context', note: 'Correct examples. The wife of Nuh is condemned alongside Lut’s wife in 66:10.' },
  'batch-a-p104-quran-questions:3': { status: 'corrected', note: 'Umar ibn al-Khattab advised Abu Bakr after many huffaz were killed at Yamamah, and Zayd ibn Thabit did the compiling. Uthman is called Jami’ al-Quran for the standard copies he sent out, but he was not the first hafiz.' },
  'batch-a-p104-quran-questions:4': { status: 'context', note: 'Uthman had standard copies written in the Quraysh dialect and sent to the main cities.' },
  'batch-a-p104-quran-questions:5': { status: 'corrected', note: 'Hajjaj ibn Yusuf was an Umayyad governor, not a caliph. Dots and vowel marks were developed by scholars such as Abu al-Aswad al-Du’ali, Nasr ibn Asim and Yahya ibn Ya’mar, partly under Hajjaj’s patronage.' },
  'batch-a-p104-quran-questions:6': { status: 'disputed', note: 'The first complete translation into a European language was Latin (1143, Robert of Ketton). Earlier partial translations existed, for example into Persian.' },
  'batch-a-p105-quran-facts:2': { status: 'disputed', note: 'Scholars list different numbers of names for the Quran. Al-Suyuti gives 55.' },
  'batch-a-p105-quran-facts:3': { status: 'context', note: 'Commonly quoted. Revelation is usually summarised as about 23 years (610–632 CE).' },
  'batch-a-p105-quran-facts:4': { status: 'disputed', note: 'Revelation began in Ramadan 610 CE. Reports differ on the day (17th, 21st, 24th or 27th), so the exact Gregorian date is uncertain.' },
  'batch-a-p105-quran-facts:5': { status: 'corrected', note: 'The standard (Kufan) count is 6,236 verses. 6,666 is a popular but unsupported figure. The other totals (30 juz, 7 manzils, 114 surahs, 558 ruku’ in South Asian copies, 14 sajdahs in the Hanafi count) are correct, and letter counts vary by method.' },
  'batch-a-p105-quran-facts:7': { status: 'context', note: 'Al-Fatihah is more often called Umm al-Kitab or Fatihat al-Kitab (the Opening). “Bab al-Quran” is a less common title.' },
  'batch-a-p105-quran-facts:8': { status: 'corrected', note: 'A hadith calls Yasin the “heart of the Quran”. Yasin is a Makkan surah, and the claim that it was revealed at the time of the Hijrah is not established.' },
  'batch-a-p105-quran-facts:9': { status: 'disputed', note: 'The meaning of this line is unclear, so do not memorise it.' },
  'batch-a-p106-quran-questions:3': { status: 'corrected', note: 'The usual division is 86 Makkan and 28 Madani surahs (86 + 28 = 114).' },
  'batch-a-p106-quran-questions:4': { status: 'corrected', note: 'The usual count is 28 Madani surahs (86 Makkan + 28 Madani = 114).' },
  'batch-a-p106-quran-questions:5': { status: 'context', note: 'Al-Fatihah is more often called Umm al-Kitab or Fatihat al-Kitab.' },
  'batch-a-p106-quran-questions:10': { status: 'corrected', note: 'The longest verse is Al-Baqarah 2:282, the verse on debts. Ayat al-Kursi (2:255) is described as the greatest verse in virtue, not the longest.' },
  'batch-a-p107-quran-definitions-counts:4': { status: 'disputed', note: 'Scholars list different numbers of names. Al-Suyuti gives 55.' },
  'batch-a-p107-quran-definitions-counts:6': { status: 'disputed', note: 'Ramadan 610 CE is correct, but reports differ on the day (17th, 21st, 24th or 27th).' },

  // Batch B, pages 108–112
  'batch-b-120253-p108-prophets:0': { status: 'context', note: 'Musa is mentioned most often, over 130 times. The source leaves the “first mentioned” part unanswered.' },
  'batch-b-120253-p108-prophets:1': { status: 'corrected', note: 'Ibrahim is named 69 times in the Quran.' },
  'batch-b-120253-p108-prophets:9': { status: 'context', note: 'Correct but unusual as a title. The common titles are Habibullah and Rahmatun lil-’Alamin.' },
  'batch-b-120253-p109-seerah:0': { status: 'disputed', note: 'Most sources date the second migration to Abyssinia to 6 Nabawi, and some say 7.' },
  'batch-b-120253-p109-seerah:2': { status: 'disputed', note: 'The date of the Mi’raj is disputed. 27 Rajab, about a year before the Hijrah, is the popular view.' },
  'batch-b-120253-p109-seerah:4': { status: 'disputed', note: 'Salah was made obligatory at the Mi’raj, whose date is disputed.' },
  'batch-b-120253-p109-seerah:8': { status: 'context', note: 'Umm Salamah is also reported to have memorised the Quran.' },
  'batch-b-120259-p110-family-seerah:0': { status: 'corrected', note: 'Qasim, Abdullah and Ibrahim. “Tahir” and “Tayyib” are titles of Abdullah, not separate sons.' },
  'batch-b-120259-p110-family-seerah:2': { status: 'disputed', note: 'Monday, 12 Rabi’ al-Awwal in the Year of the Elephant. Modern conversions give 570 or 571 CE, with different days in April.' },
  'batch-b-120259-p111-events:1': { status: 'corrected', note: 'The final prohibition (5:90–91) is usually dated to 3–4 AH, after Uhud. Earlier verses restricted alcohol in stages.' },
  'batch-b-120259-p111-events:3': { status: 'corrected', note: 'Yamamah was fought in 11–12 AH (632 CE), under Abu Bakr, against Musaylimah. It was after the Prophet’s ﷺ death, not in 8 AH.' },
  'batch-b-120259-p111-events:8': { status: 'context', note: 'The final verses on riba came late, and it was formally abolished in the Farewell Sermon in 10 AH.' },
  'batch-b-120259-p111-events:9': { status: 'corrected', note: 'Monday, 12 Rabi’ al-Awwal 11 AH. Most modern conversions give 8 June 632 CE.' },
  'batch-b-120259-p111-p110-wives:6': { status: 'disputed', note: 'Scholars differ on whether Maria al-Qibtiyya was a wife or a concubine, and she is usually not counted among the Mothers of the Believers. Safiyyah bint Huyayy, who is counted, is missing from this list.' },
  'batch-b-120304-p112-religion:1': { status: 'disputed', note: 'Most sources give 15 Shawwal 3 AH, and some give 7 or 11 Shawwal.' },
  'batch-b-120304-p112-religion:3': { status: 'disputed', note: 'The adhan is usually dated to 1 AH, and some say 2 AH.' },
  'batch-b-120304-p112-religion:5': { status: 'corrected', note: 'The hijab verses are usually dated to about 5 AH.' },
};

/** English study cards that need a caution beyond the corrections already in their answer text. */
export const englishCardFactChecks: Record<string, FactCheck> = {
  'knowledge-page-4:40': { status: 'disputed', note: 'Published figures differ: 438 km in the CIA World Factbook, and about 523 km or 596 km in Pakistani references. The line runs through disputed territory.' },
  'knowledge-page-8:6': { status: 'context', note: 'Outdated. Check the current service chiefs before an interview.' },
  'knowledge-page-8:7': { status: 'context', note: 'Outdated. Check the current service chiefs before an interview.' },
  'knowledge-page-8:8': { status: 'context', note: 'Outdated. Check the current service chiefs before an interview.' },
};
