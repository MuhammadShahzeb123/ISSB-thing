import type { GkCategory } from './generalKnowledge';

// Compact ISSB study topics for the General Knowledge tab.
// Factual, interview-friendly English. Research note: water status as of late Aug/early Oct 2026.

export type GkAircraft = {
  id: string;
  name: string;
  role: string;
  crew: string;
  speed: string;
  capacity: string;
  other: string;
  image: string;
  imageCredit: string;
};

export type GkTopic = {
  id: string;
  category: GkCategory;
  title: string;
  teaser: string;
  summary: string;
  keyPoints: readonly string[];
  remember: string;
  whyIssb: string;
  watch?: readonly string[];
  sources: readonly { title: string; url?: string }[];
  /** Optional verified aircraft gallery for PAF topics. */
  aircraft?: readonly GkAircraft[];
};

export const gkTopics: readonly GkTopic[] = [
  {
    id: 'indus-waters-treaty',
    category: 'pakistan',
    title: 'Indus Waters Treaty (1960)',
    teaser: 'World Bank–brokered water-sharing pact between Pakistan and India — still the core of river politics.',
    summary:
      'The Indus Waters Treaty (IWT) was signed in 1960 by Pakistan and India with the World Bank as broker. It divides the Indus basin: Eastern Rivers (Ravi, Beas, Sutlej) go mainly to India; Western Rivers (Indus, Jhelum, Chenab) go mainly to Pakistan, with limited Indian uses allowed (domestic, non-consumptive, limited agriculture, and regulated hydropower). A Permanent Indus Commission handles day-to-day cooperation; disputes can go to a Neutral Expert or a Court of Arbitration.',
    keyPoints: [
      'HSSC core: signed 1960 by Pakistan and India; World Bank brokered it.',
      'Eastern Rivers (Ravi, Beas, Sutlej) → mainly India. Western Rivers (Indus, Jhelum, Chenab) → mainly Pakistan.',
      'India may use Western Rivers for limited purposes (including run-of-river hydropower under treaty rules) but must let the allocated water flow to Pakistan.',
      'Day-to-day body: Permanent Indus Commission. Disputes can go to a Neutral Expert or a Court of Arbitration.',
      'Current-affairs add-on (beyond pure textbook): India said in 2025 it was holding the treaty “in abeyance”; Pakistan rejects unilateral exit. August 2026 arbitration reporting said the treaty remains in force — India disputes that process. State both positions; do not invent legal outcomes.',
    ],
    remember:
      '1960 · World Bank · East Ravi–Beas–Sutlej (India) · West Indus–Jhelum–Chenab (Pakistan). One side cannot end it alone.',
    whyIssb:
      'Water security is a classic ISSB interview topic. State the allocation clearly, name the World Bank role, and separate legal findings (Aug 2026 award) from political positions (India’s abeyance claim).',
    watch: [
      'Whether Permanent Indus Commission meetings and data exchange resume.',
      'Kishenganga / Ratle design disputes and Neutral Expert timelines.',
      'Any new Pakistani or Indian official statements after the Aug 2026 award.',
    ],
    sources: [
      { title: 'UN Treaty Series text of the Indus Waters Treaty 1960', url: 'https://treaties.un.org/doc/Publication/UNTs/Volume%20419/volume-419-I-6032-English.pdf' },
      { title: 'Al Jazeera: PCA award on treaty status (1 Sep 2026)', url: 'https://www.aljazeera.com/news/2026/9/1/pakistan-wins-indus-waters-battle-at-the-hague-but-india-threat-remains' },
    ],
  },
  {
    id: 'geography-pakistan',
    category: 'geography',
    title: 'Geography of Pakistan',
    teaser: 'Location, size, neighbours, regions — the map every candidate should be able to sketch.',
    summary:
      'Pakistan is in South Asia, with a coastline on the Arabian Sea. It shares land borders with India (east), Afghanistan and Iran (west), and China (north-east). The landscape runs from high Himalaya / Karakoram / Hindu Kush mountains in the north, through the Indus plain and deserts (Thar, Cholistan, Kharan), to coastal Balochistan and Sindh.',
    keyPoints: [
      'Capital: Islamabad. Largest city / economic hub: Karachi.',
      'Four provinces: Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan. Plus Islamabad Capital Territory and the administered territories of Azad Jammu & Kashmir and Gilgit-Baltistan (status is politically sensitive — state facts carefully).',
      'Core river system: Indus and its tributaries (Jhelum, Chenab, Ravi, Beas historically, Sutlej) — the Indus basin feeds most irrigated agriculture.',
      'Northern highlands hold K2 (Godwin-Austen) in the Karakoram — second-highest peak on Earth.',
      'Climate: largely arid / semi-arid; monsoon rains matter for floods and crops; winters can be severe in the north.',
      'Strategic depth themes interviewers like: Gwadar on the Arabian Sea, mountain passes to Afghanistan/China, and the Indus as a lifeline.',
    ],
    remember:
      'Sketch: Arabian Sea south; India east; Afghanistan/Iran west; China north-east; Indus spine through the country.',
    whyIssb:
      'Interviewers expect a clean mental map before current affairs. Geography answers should stay short, correct, and free of invented statistics.',
    sources: [
      { title: 'Study map practice on this site', url: '/countries' },
      { title: 'Pakistan overview — World Factbook-style primers (verify latest figures before quoting numbers)' },
    ],
  },
  {
    id: 'provinces-territories',
    category: 'pakistan',
    title: 'Provinces & territories',
    teaser: 'Four provinces, the capital territory, and northern administered areas — names and capitals.',
    summary:
      'Pakistan’s provincial structure is a staple ISSB question. Know the four provinces and their capitals, plus Islamabad Capital Territory. When asked about the north, distinguish carefully between provinces and administered territories.',
    keyPoints: [
      'Punjab — capital Lahore. Most populous province; Indus plain agriculture.',
      'Sindh — capital Karachi (also Pakistan’s main port city).',
      'Khyber Pakhtunkhwa (formerly NWFP / “Sarhad”) — capital Peshawar. Includes former FATA agencies after the 25th Amendment merger (2018).',
      'Balochistan — capital Quetta. Largest by area; sparse population; Gwadar on the Makran coast.',
      'Islamabad Capital Territory — federal capital.',
      'Former FATA agencies (for recall): Bajaur, Mohmand, Khyber, Kurram, Orakzai, North Waziristan, South Waziristan.',
    ],
    remember: 'Lahore, Karachi, Peshawar, Quetta + Islamabad. KP = old NWFP; FATA merged into KP (2018).',
    whyIssb: 'Fast recall of province capitals is a common warm-up question before deeper geopolitics.',
    sources: [{ title: 'Photo-sourced GK cards on this site', url: '/general-knowledge' }],
  },
  {
    id: 'rivers-dams',
    category: 'geography',
    title: 'Rivers, dams & hydropower',
    teaser: 'HSSC essentials: which river, which district/city, and which dam is the largest.',
    summary:
      'For school and ISSB recall, learn each major dam as three facts only: river, location (district/city), and relative size. Skip reservoir-cubic-metre trivia unless an interviewer asks. Agriculture and cities still depend on the Indus basin and these storages.',
    keyPoints: [
      'Main rivers to name: Indus (main stem); Jhelum and Chenab (western tributaries in the Indus Waters Treaty); Kabul joins the Indus near Attock.',
      'Tarbela Dam — Indus River; Haripur / Swabi area of Khyber Pakhtunkhwa. Largest dam in Pakistan (biggest reservoir / storage). Hydropower + irrigation storage.',
      'Mangla Dam — Jhelum River; near Mirpur, Azad Jammu & Kashmir. Second-largest storage dam after Tarbela.',
      'Warsak Dam — Kabul River; near Peshawar, Khyber Pakhtunkhwa. Older hydropower dam (often asked as “near Peshawar”).',
      'Khanpur Dam — Haro River; near Khanpur, Khyber Pakhtunkhwa (water supply / irrigation, not the largest).',
      'Ghazi-Barotha — Indus River; run-of-river scheme between Tarbela and Attock (Ghazi / Barotha area). Not a big storage dam like Tarbela or Mangla.',
      'Hub Dam — Hub River; near Karachi (Sindh / Balochistan border area). Mainly water supply for Karachi — do not confuse with Indus storages.',
      'HSSC size rule: Tarbela = largest; Mangla = second. Do not invent exact MW or acre-feet figures in an interview unless you rechecked them.',
    ],
    remember:
      'Largest = Tarbela (Indus, Haripur/Swabi KP). 2nd = Mangla (Jhelum, Mirpur AJK). Warsak = Kabul near Peshawar. Khanpur = Haro. Attock = Kabul meets Indus.',
    whyIssb: 'Classic warm-up: name river + place + which is largest, then stop. Extra engineering detail is beyond normal HSSC level.',
    sources: [
      { title: 'Indus Waters Treaty topic card', url: '/general-knowledge' },
      { title: 'Source GK Q&A — dam locations', url: '/general-knowledge' },
    ],
  },
  {
    id: 'borders-neighbours',
    category: 'geography',
    title: 'Borders & neighbours',
    teaser: 'Who Pakistan borders, which frontiers matter strategically, and how to name them carefully.',
    summary:
      'Pakistan has four land neighbours and a southern maritime frontier on the Arabian Sea. Border answers should name the neighbour, the general direction, and one strategic note — without inventing lengths or troop figures.',
    keyPoints: [
      'India (east / south-east): includes the Line of Control (LoC) in Jammu & Kashmir — a ceasefire line, not an agreed international boundary.',
      'Afghanistan (west / north-west): Durand Line frontier; key crossings include Torkham (via Khyber) and Chaman.',
      'Iran (west / south-west): Balochistan frontier; trade and security links via Taftan and coastal routes.',
      'China (north-east): high Karakoram frontier; Khunjerab Pass links to Xinjiang (Karakoram Highway).',
      'Arabian Sea (south): Karachi and Port Qasim (Sindh); Gwadar and the Makran coast (Balochistan).',
    ],
    remember: 'India · Afghanistan · Iran · China + Arabian Sea. Torkham/Chaman to Afghanistan; Khunjerab to China.',
    whyIssb: 'Sets up CPEC, Afghanistan, and India–Pakistan questions without sounding memorised from a pamphlet.',
    sources: [{ title: 'Countries map practice', url: '/countries' }],
  },
  {
    id: 'khyber-pass',
    category: 'geography',
    title: 'Khyber Pass',
    teaser: 'Historic mountain gateway between Peshawar and Afghanistan — trade, armies, and NATO logistics.',
    summary:
      'The Khyber Pass is a mountain pass in Khyber Pakhtunkhwa on the Pakistan–Afghanistan border. It connects the Peshawar Valley (via Jamrud / Landi Kotal) with Afghanistan toward the Jalalabad–Kabul route, with the border town of Torkham as the key crossing. For centuries it was a Silk Road / invasion corridor; in the 2000s it carried a large share of NATO ground supplies into Afghanistan.',
    keyPoints: [
      'Location: Khyber District, KP, through the Spin Ghar (Safed Koh / White Mountains) foothills.',
      'Route idea: Peshawar → Jamrud → Landi Kotal → Torkham (border) → toward Jalalabad / Kabul.',
      'Length of the main pass corridor is on the order of ~50 km / ~30 miles depending on start/end points used; summit area around Landi Kotal (~1,000 m+).',
      'Strategic value: shortest practical land link from the Indus plains toward Kabul; hard to bypass.',
      'Other famous Pakistani passes (do not confuse): Bolan (Balochistan, Quetta route — internal/strategic toward Kandahar axis historically), Khojak (near Chaman), Khunjerab (China).',
      'Modern angle: Torkham crossing, border management with Afghanistan, and the Khyber Pass Economic Corridor road upgrades (Peshawar–Torkham).',
    ],
    remember: 'Khyber = Peshawar–Torkham–Afghanistan. Not Bolan. Landi Kotal is the high point bazaar town.',
    whyIssb:
      'If an interviewer says “Pepper Pass,” they almost certainly mean Khyber Pass. Correct gently and give location + strategic why.',
    sources: [
      { title: 'Encyclopaedia Britannica — Khyber Pass', url: 'https://www.britannica.com/place/Khyber-Pass' },
      { title: 'World Bank — Khyber Pass Economic Corridor factsheet', url: 'https://www.worldbank.org/en/news/factsheet/2019/10/01/khyber-pass-economic-corridor-kpec' },
    ],
  },
  {
    id: 'strategic-passes',
    category: 'military',
    title: 'Strategic mountain passes',
    teaser: 'Khyber, Bolan, Khojak, Khunjerab — four names that separate a prepared candidate from a vague one.',
    summary:
      'Pakistan’s mountain frontiers are pierced by a few named passes that keep appearing in ISSB papers and interviews. Learn where each one sits and which neighbour it serves.',
    keyPoints: [
      'Khyber Pass — KP / Afghanistan (Torkham). Historic military & trade corridor to Kabul.',
      'Bolan Pass — Balochistan, near Quetta. Historic route toward southern Afghanistan; railway/road significance.',
      'Khojak Pass — near Chaman, Balochistan–Afghanistan frontier.',
      'Khunjerab Pass — Gilgit-Baltistan / Xinjiang (China). Highest paved international border crossing on the Karakoram Highway.',
      'Lowari Pass / Tunnel — Chitral access within KP (internal connectivity, not a foreign border).',
    ],
    remember: 'Afghanistan: Khyber, Khojak, Bolan axis. China: Khunjerab. Always name the province/region.',
    whyIssb: 'Short lists score well. Pair each pass with one neighbour and one town.',
    sources: [{ title: 'Khyber Pass topic card', url: '/general-knowledge' }],
  },
  {
    id: 'cpec',
    category: 'pakistan',
    title: 'CPEC (China–Pakistan Economic Corridor)',
    teaser: 'Flagship Belt and Road project linking Xinjiang to Gwadar — energy, roads, then industry.',
    summary:
      'CPEC is the China–Pakistan Economic Corridor, a flagship of China’s Belt and Road Initiative. Phase I focused on energy plants, highways, and Gwadar-linked infrastructure. Phase II (“CPEC 2.0”) emphasises industrialisation, Special Economic Zones (SEZs), agriculture, mining, ICT, and business-to-business investment rather than only mega-construction.',
    keyPoints: [
      'Core idea: connect China’s Xinjiang (via Karakoram Highway / Khunjerab) through Pakistan to the Arabian Sea at Gwadar.',
      'Early harvest: power generation capacity additions, motorways/highways, Gwadar port and airport-related works.',
      'Long-Term Plan originally framed for roughly 2017–2030; Pakistan and China have discussed revising it under a CPEC 2.0 frame (growth, innovation, green, livelihood, openness).',
      'Priority SEZ names often cited: Rashakai, Allama Iqbal Industrial City, Dhabeji, Bostan (progress varies by zone).',
      'May 2026 Pakistan–China joint messaging reaffirmed industrial parks, skills, supply chains, and security of Chinese personnel/projects.',
      'Interview balance: note connectivity & energy gains, and also real constraints (security in parts of Balochistan, debt/circular-debt context, slow SEZ take-up) without slogan answers.',
    ],
    remember: 'CPEC = China ↔ Gwadar corridor. Phase I = energy + roads; Phase II = industry / SEZs / B2B.',
    whyIssb:
      'Often confused with “CPAC.” Say the full name once, then CPEC. Tie it to Gwadar and China–Pakistan “all-weather” friendship carefully and factually.',
    watch: [
      'SEZ operational progress and export-oriented plants.',
      'ML-1 railway financing (Karachi–Peshawar upgrades discussed for years).',
      'Security incidents affecting Chinese projects/personnel.',
    ],
    sources: [
      { title: 'ISDP factsheet — CPEC 2.0', url: 'https://www.isdp.eu/publication/factsheet-reading-cpec-2-0-beyond-connectivity-a-corridor-a-strategy-or-a-strategic-dependency/' },
      { title: 'Business Recorder — CPEC Phase-II B2B pipeline (May 2026)', url: 'https://www.brecorder.com/news/40421496' },
    ],
  },
  {
    id: 'gwadar',
    category: 'pakistan',
    title: 'Gwadar Port',
    teaser: 'Deep-water port on Balochistan’s Makran coast — commercial hub of the CPEC maritime end.',
    summary:
      'Gwadar is a port city in Balochistan on the Arabian Sea. Under CPEC it is promoted as Pakistan’s western deep-water gateway: shorter overland access for western China to the Indian Ocean, and a potential logistics / free-zone hub for the region.',
    keyPoints: [
      'Location: Makran coast, Balochistan — west of Karachi.',
      'CPEC role: southern terminus of the corridor; free zones and industrial/logistics ambitions sit alongside the port.',
      'New Gwadar International Airport was inaugurated in October 2024 and handed to Pakistan’s airport authority; commercialisation remains a 2026–27 focus in official planning notes.',
      'Strategic debate: commercial trade hub vs wider Indian Ocean access for China — for ISSB, stick to geography and stated project goals, then give a balanced personal view if asked.',
      'Local development, water supply, and security are recurring practical issues — mention them as challenges, not talking points.',
    ],
    remember: 'Gwadar = Balochistan Arabian Sea port = CPEC’s sea end. Karachi remains the larger established port complex.',
    whyIssb: 'Pairs with CPEC and naval/geostrategy questions.',
    sources: [{ title: 'CPEC topic card', url: '/general-knowledge' }],
  },
  {
    id: 'china-pakistan',
    category: 'world',
    title: 'China–Pakistan relations',
    teaser: '“All-weather” partnership: diplomacy, defence cooperation, and the CPEC economic spine.',
    summary:
      'Pakistan and China maintain a deep strategic partnership covering diplomacy, defence production/cooperation, and economic ties via CPEC. For interviews, separate friendship rhetoric from concrete pillars: border stability at Khunjerab, economic corridor projects, and regular high-level visits.',
    keyPoints: [
      'Diplomatic relations date from the early 1950s; both sides often call the relationship “all-weather strategic cooperative.”',
      'Economic spine: CPEC / Belt and Road projects.',
      'Defence: long-standing military-technical cooperation (aircraft, ships, joint exercises — quote only facts you can source).',
      'Border: Khunjerab Pass and Karakoram Highway link Gilgit-Baltistan with Xinjiang.',
      '2025–26 messaging stressed CPEC 2.0 industrialisation and protection of Chinese personnel in Pakistan.',
    ],
    remember: 'Three pillars: diplomacy, defence cooperation, CPEC economy. Border link = Khunjerab.',
    whyIssb: 'Expect a follow-up on Gwadar, debt, or Xinjiang — answer calmly, stick to verified facts, and say when you do not know.',
    sources: [{ title: 'CPEC and Gwadar topic cards', url: '/general-knowledge' }],
  },
  {
    id: 'arabian-sea',
    category: 'geography',
    title: 'Arabian Sea & Pakistan’s coastline',
    teaser: 'Southern maritime frontier — Karachi, Port Qasim, Gwadar, and sea lines of communication.',
    summary:
      'Pakistan’s only ocean frontage is the Arabian Sea. It matters for trade (almost all seaborne commerce), naval strategy, energy imports, and CPEC’s maritime outlet at Gwadar.',
    keyPoints: [
      'Main ports: Karachi Port and Port Qasim (Sindh); Gwadar (Balochistan).',
      'Sea lines of communication connect Pakistan to the Persian Gulf (energy), East Africa, and East Asia.',
      'Hormuz / Gulf tensions can raise freight and insurance costs for Pakistani fuel and goods.',
      'EEZ and fisheries exist as economic themes; avoid inventing square-kilometre figures unless verified.',
    ],
    remember: 'One sea: Arabian Sea. Three names to drop: Karachi, Qasim, Gwadar.',
    whyIssb: 'Links geography to energy security and regional wars without overclaiming.',
    sources: [{ title: 'World affairs briefings', url: '/current-affairs' }],
  },
  {
    id: 'mountains-peaks',
    category: 'geography',
    title: 'Mountains & peaks',
    teaser: 'Himalaya, Karakoram, Hindu Kush — and K2 as Pakistan’s signature peak.',
    summary:
      'Northern Pakistan holds parts of three great ranges. Interviewers often ask for the highest peak in Pakistan and which range it sits in.',
    keyPoints: [
      'Karakoram — includes K2 (Mount Godwin-Austen), ~8,611 m, second-highest on Earth; Baltoro region of Gilgit-Baltistan.',
      'Himalaya — eastern northern rim; Nanga Parbat (~8,126 m) is a famous Himalayan peak in Pakistan.',
      'Hindu Kush — northwestern highland system toward Afghanistan.',
      'Khunjerab and other high passes cut through this highland belt toward China.',
    ],
    remember: 'Highest in Pakistan = K2 in the Karakoram. Nanga Parbat = Himalaya.',
    whyIssb: 'Clean three-range answer beats a long tourist speech.',
    sources: [{ title: 'Geography Q&A cards on this site', url: '/general-knowledge' }],
  },
  {
    id: 'water-security',
    category: 'pakistan',
    title: 'Water security for Pakistan',
    teaser: 'Why the Indus basin, storage, and treaty politics sit at the centre of national resilience.',
    summary:
      'Pakistan is a lower-riparian state on the western Indus rivers. Food, cities, and industry depend on predictable flows, storage (Tarbela, Mangla, etc.), and canal irrigation. Climate variability (glacier melt, monsoon extremes) and upstream projects make water a strategic — not only technical — subject.',
    keyPoints: [
      'Lower-riparian vulnerability: timing of flows matters as much as annual volume.',
      'Treaty framework: Indus Waters Treaty allocates rivers and limits upstream design on Western Rivers.',
      'Domestic agenda: storage, lining/efficiency of canals, groundwater stress, urban supply, and flood management.',
      'Do not claim India can “turn off” the Indus overnight — geography and run-of-river dam design limit sudden total cutoff; still, data-sharing and predictability matter.',
      'Interview stance: defend lawful water rights, name the treaty, urge technical cooperation, avoid warmongering slogans.',
    ],
    remember: 'Water = Indus basin + storage + IWT rules + climate stress. Predictability is the keyword.',
    whyIssb: 'Shows mature judgment: facts first, then a calm national-interest view.',
    sources: [
      { title: 'Indus Waters Treaty topic', url: '/general-knowledge' },
      { title: 'Current affairs — India–Pakistan freeze / IWT', url: '/current-affairs' },
    ],
  },
  {
    id: 'orgs-memberships',
    category: 'world',
    title: 'Pakistan in international organisations',
    teaser: 'UN, OIC, SCO, SAARC, ECO, IMF — the acronyms interviewers fire in rapid rounds.',
    summary:
      'Pakistan is an active member of several political and economic organisations. Know the full form, HQ if commonly asked, and one purpose line.',
    keyPoints: [
      'UN — United Nations (New York HQ). Pakistan contributes to peacekeeping.',
      'OIC — Organisation of Islamic Cooperation.',
      'SCO — Shanghai Cooperation Organisation (regional security/economy; China, Russia, Central Asia, India, Pakistan, etc.).',
      'SAARC — South Asian Association for Regional Cooperation (often stalled politically).',
      'ECO — Economic Cooperation Organization (Pakistan, Iran, Türkiye, Central Asian partners, etc.).',
      'IMF / World Bank — financial / development institutions frequently in economic news (World Bank also brokered the IWT).',
    ],
    remember: 'UN · OIC · SCO · SAARC · ECO. World Bank = IWT broker.',
    whyIssb: 'Acronym rounds are easy marks if you rehearse aloud.',
    sources: [{ title: 'Abbreviations Q&A category', url: '/general-knowledge' }],
  },
  {
    id: 'defence-pact-context',
    category: 'military',
    title: 'Saudi–Türkiye–Pakistan defence ties',
    teaser: 'Recent defence diplomacy triangle — know the idea, then point to the dated briefing page.',
    summary:
      'In 2025–2026 reporting, Pakistan’s defence diplomacy with Saudi Arabia and Türkiye deepened (including Mecca-linked defence cooperation coverage). Treat this as evolving diplomacy, not a NATO-style automatic mutual-defence clone, unless a specific signed text says so.',
    keyPoints: [
      'Know partners: Saudi Arabia (strategic economic + defence links), Türkiye (defence industry and training cooperation history), Pakistan (professional military and production partnerships).',
      'For interview answers, cite the dated briefing on this site’s Current Affairs page rather than inventing treaty articles.',
      'Separate: defence cooperation MoUs / industry deals vs a full collective-defence guarantee.',
      'Tie-in topics: Middle East stability, Muslim-world diplomacy, and Pakistan’s professional military image.',
    ],
    remember: 'Point to /current-affairs for the Mecca defence-pact follow-up. Do not invent clause text.',
    whyIssb: 'Shows you track living files and know where your facts come from.',
    sources: [{ title: 'World affairs & wars page', url: '/current-affairs' }],
  },
  {
    id: 'paf-fighters',
    category: 'military',
    title: 'PAF fighter jets',
    teaser: 'JF-17, F-16, J-10CE, Mirage III/5, F-7PG — names, crew, speed and role in one compact brief.',
    summary:
      'The Pakistan Air Force combat fleet mixes Chinese/Pakistani JF-17 Thunder and J-10CE jets, US-origin F-16 Fighting Falcons, and ageing French Mirage III/5 and Chinese F-7PG aircraft. Public inventories are estimates (IISS / FlightGlobal / open directories) — the PAF does not publish a full official order of battle. Treat numbers as approximate and dated.',
    keyPoints: [
      'JF-17 Thunder (PAC/CAC) — main indigenous multirole fighter; single-seat (JF-17B dual-seat trainer). Typical open figures: max speed ~Mach 1.6; service ceiling ~55,000 ft / ~16,800 m. Blocks 1–3 in service; Block III adds modern AESA / weapons suite.',
      'F-16 Fighting Falcon — long-serving US multirole; PAF flies A/B (MLU/ADF) and C/D Block 52 variants. Single-seat (A/C) / dual-seat (B/D). Max speed about Mach 2 class; crew 1 (or 2 in trainer variants).',
      'J-10CE — Chinese single-engine multirole with AESA radar; export “CE” for Pakistan. Crew 1. Public reporting ties PL-15E BVR missiles to this type in 2025 coverage.',
      'Mirage III / Mirage 5 (ROSE upgrades) — French-origin strike / multirole; single-seat (some dual trainers). Ageing fleet, being phased toward JF-17/J-10 replacements. Crew typically 1.',
      'F-7PG — Chinese interceptor derived from MiG-21 lineage; single-seat. Phasing out of front-line roles as newer types arrive.',
      'Interview tip: name type → origin → role → crew → one performance cue. Do not invent exact squadron counts.',
    ],
    remember: 'Front line: JF-17 + F-16 + J-10CE. Legacy: Mirage III/5 + F-7PG. Crew = usually 1 (trainers = 2).',
    whyIssb: 'Service knowledge questions reward clean type cards, not memorised secret OOB numbers.',
    watch: ['JF-17 Block III deliveries', 'Reported J-10CE fleet growth', 'Any official PAF inventory statements'],
    sources: [
      { title: 'Wikipedia — List of active Pakistan Air Force aircraft', url: 'https://en.wikipedia.org/wiki/List_of_active_Pakistan_Air_Force_aircraft' },
      { title: 'PAC — JF-17 Thunder', url: 'https://www.pac.org.pk/jf-17' },
    ],
    aircraft: [
      {
        id: 'jf-17',
        name: 'JF-17 Thunder',
        role: 'Multirole fighter (PAC/CAC)',
        crew: '1 (JF-17B: 2)',
        speed: '~Mach 1.6',
        capacity: 'Pilot only (combat); dual-seat trainer variant exists',
        other: 'Ceiling ~55,000 ft; Blocks 1–3; Pakistan’s primary home-built fighter.',
        image: '/images/aircraft/jf-17-thunder.jpg',
        imageCredit: 'PAF JF-17 12-139 — Anna Zvereva / CC BY-SA 2.0 via Wikimedia Commons',
      },
      {
        id: 'f-16',
        name: 'F-16 Fighting Falcon',
        role: 'Multirole fighter (US)',
        crew: '1 (A/C) or 2 (B/D)',
        speed: '~Mach 2 class',
        capacity: 'Pilot (+ instructor in dual-seat)',
        other: 'PAF A/B MLU/ADF and C/D Block 52 in open sources.',
        image: '/images/aircraft/f-16-fighting-falcon.jpg',
        imageCredit: 'PAF F-16A — Aldo Bidini / GFDL 1.2 via Wikimedia Commons',
      },
      {
        id: 'j-10ce',
        name: 'J-10CE',
        role: 'Multirole fighter (China export)',
        crew: '1',
        speed: 'Supersonic (Mach 1.8 class in open specs for J-10 family)',
        capacity: 'Pilot only',
        other: 'AESA radar; associated in open reporting with PL-15E BVR missile.',
        image: '/images/aircraft/j-10ce.jpg',
        imageCredit: 'J-10CE (PAF display, Zhuhai 2024) — CC0 via Wikimedia Commons',
      },
      {
        id: 'mirage-5',
        name: 'Mirage 5 / III (ROSE)',
        role: 'Strike / multirole (France; upgraded)',
        crew: '1 (some dual trainers)',
        speed: '~Mach 2 class (type family)',
        capacity: 'Pilot only in combat variants',
        other: 'Legacy ROSE-upgraded fleet; gradually being replaced.',
        image: '/images/aircraft/mirage-5.jpg',
        imageCredit: 'PAF Mirage 5PA2 inflight — Hamid Faraz / Asuspine, GFDL 1.2 via Wikimedia Commons',
      },
      {
        id: 'f-7pg',
        name: 'F-7PG',
        role: 'Interceptor (China)',
        crew: '1',
        speed: 'Supersonic (MiG-21-derived family)',
        capacity: 'Pilot only',
        other: 'Open sources list ~50 airframes; phasing out of front line.',
        image: '/images/aircraft/f-7pg.jpg',
        imageCredit: 'PAF Chengdu F-7 — US Air Force / Public domain via Wikimedia Commons',
      },
    ],
  },
  {
    id: 'paf-transport',
    category: 'military',
    title: 'PAF transport & tanker aircraft',
    teaser: 'C-130 Hercules, Il-78MP dual-role tanker/transport, and CN-235 utility — logistics backbone.',
    summary:
      'PAF air mobility centres on the Lockheed C-130 Hercules for tactical airlift, the Ilyushin Il-78MP for strategic lift and aerial refuelling, and a small CN-235 utility fleet (open sources note retirement pressure). Exact payload figures vary by variant and configuration — quote roles and crew carefully.',
    keyPoints: [
      'C-130 Hercules — turboprop tactical transport; PAF operates B/E/H variants (open count ~20+). Crew typically 4–6 (pilots + loadmasters/flight engineers depending on fit). Payload on the order of ~20 tonnes class depending on variant/range — do not invent exact kg without a checked source.',
      'Il-78MP Midas — four jet dual-role tanker/transports (open count: 4). Crew ~6. Can refuel fighters in flight and haul freight. Operated by No. 10 MRTT Squadron (Nur Khan).',
      'CN-235 — twin-turboprop medium utility; open lists show a handful (often 4). Crew ~2–3. Smaller payload/range than C-130; reported as limited operational value / retirement candidate in Pakistani coverage.',
      'Interview angle: C-130 = tactical workhorse; Il-78 = tanker + strategic lift; CN-235 = light utility.',
    ],
    remember: 'C-130 airlift · Il-78 tanker/transport (4) · CN-235 light utility.',
    whyIssb: 'Shows you understand that air power is not only fighters.',
    sources: [
      { title: 'Wikipedia — List of active Pakistan Air Force aircraft', url: 'https://en.wikipedia.org/wiki/List_of_active_Pakistan_Air_Force_aircraft' },
      { title: 'Wikipedia — No. 10 Squadron PAF', url: 'https://en.wikipedia.org/wiki/No._10_Squadron_PAF' },
    ],
    aircraft: [
      {
        id: 'c-130',
        name: 'C-130 Hercules',
        role: 'Tactical / medium transport',
        crew: '~4–6',
        speed: 'Turboprop cruise ~300+ kt class',
        capacity: '~20 t payload class (variant/range dependent)',
        other: 'PAF B/E/H fleet; long-serving airlift backbone.',
        image: '/images/aircraft/c-130-hercules.jpg',
        imageCredit: 'PAF C-130E 4171 — Papas Dos / CC BY 2.0 via Wikimedia Commons',
      },
      {
        id: 'il-78',
        name: 'Il-78MP Midas',
        role: 'Strategic tanker / transport',
        crew: '~6',
        speed: 'Jet transport class',
        capacity: 'Freight + aerial refuelling stores (mission dependent)',
        other: 'Four ex-Ukrainian airframes; No. 10 Squadron.',
        image: '/images/aircraft/il-78mp.jpg',
        imageCredit: 'PAF Il-78MP R09-001 — Václav Paluzga / CC BY-SA 3.0 via Wikimedia Commons',
      },
      {
        id: 'cn-235',
        name: 'CN-235',
        role: 'Medium utility transport',
        crew: '~2–3',
        speed: 'Turboprop utility class',
        capacity: 'Light/medium freight or passengers (far below C-130)',
        other: 'Same aircraft type as PAF CN-235M; photo is type example (non-PAF markings) — no free PAF-marked Commons file found.',
        image: '/images/aircraft/cn-235.jpg',
        imageCredit: 'CN-235 type (Royal Moroccan AF example) — Wikimedia Commons; type-verified, not PAF-marked',
      },
    ],
  },
  {
    id: 'paf-fleet-size',
    category: 'military',
    title: 'How many planes does the PAF have?',
    teaser: 'Public estimates only — cite the source band, never invent an exact secret total.',
    summary:
      'There is no single official public “PAF has exactly N aircraft” number. Open-source directories (IISS Military Balance, FlightGlobal World Air Forces, Wikipedia aggregations) give bands. For ISSB, state the source, the year, and whether you mean combat aircraft only or all fixed-wing types.',
    keyPoints: [
      'Combat / fighter band commonly cited from IISS Military Balance 2025-style tallies: on the order of ~400 fighters (roughly JF-17 ~150–175, F-16 ~75, J-10CE ~20+, Mirage III/5 ~80 combined, F-7PG ~50) — figures move with deliveries and retirements.',
      'Wider “all aircraft” counts on secondary sites sometimes exceed 1,000 when trainers, helicopters (including other services), and UAVs are mixed in — do not blend those without saying so.',
      'Transport snapshot: C-130 ~20+, Il-78 = 4, CN-235 handful — again estimates.',
      'AEW&C: Saab 2000 Erieye often listed around ~9 in open sources.',
      'Safe interview line: “Open sources put front-line combat jets around four hundred; exact numbers are classified / not officially published.”',
    ],
    remember: '~400 combat jets (open-source band) · cite year/source · never invent a precise classified total.',
    whyIssb: 'Honesty about uncertainty scores better than a fake exact number.',
    sources: [
      { title: 'Wikipedia — List of active Pakistan Air Force aircraft', url: 'https://en.wikipedia.org/wiki/List_of_active_Pakistan_Air_Force_aircraft' },
      { title: 'IISS Military Balance (subscription reference — cite carefully)' },
    ],
  },
  {
    id: 'pakistan-air-defence',
    category: 'military',
    title: 'Pakistan air-defence systems',
    teaser: 'Layered SAMs: HQ-9 family long-range, HQ-16/LY-80 medium, Spada/Crotale/FM-90 short-range, plus MANPADS.',
    summary:
      'Pakistan fields a layered ground-based air defence across Army and Air Force units, increasingly Chinese long/medium-range SAMs plus older Western short-range systems. Exact battery counts are not fully public — learn the layers and names.',
    keyPoints: [
      'Long-range: HQ-9/P (Army HIMADS, ~125 km class in open reporting); PAF has disclosed HQ-9BE (longer envelope in open specs, ~260 km class against aircraft).',
      'Medium-range: LY-80 / LY-80EV (Army; HQ-16 export family, ~40–70 km class); PAF HQ-16FE (extended medium/long in open reporting).',
      'Short-range / point defence: Spada 2000-Plus (Aspide) for PAF bases; Crotale variants; Army FM-90.',
      'MANPADS: Anza series (Pakistani), plus other man-portable systems in open lists (e.g. RBS-70, FN-series — verify before quoting exotic names).',
      'Sensors / C2: long-range radars, AEW&C (Erieye) cue fighters and SAMs inside an integrated air picture.',
      'Interview stance: describe layers (long → medium → short → guns/MANPADS), name 3–4 systems, avoid inventing battery numbers.',
    ],
    remember: 'HQ-9 long · LY-80/HQ-16 medium · Spada/Crotale/FM-90 short · Anza MANPADS.',
    whyIssb: 'Shows modern multi-domain awareness beyond aircraft names alone.',
    sources: [
      { title: 'Quwa — Pakistan air defence overview', url: 'https://quwa.org/pakistan/air-defence-pk/' },
      { title: 'Wikipedia — List of equipment of the Pakistan Air Force', url: 'https://en.wikipedia.org/wiki/List_of_equipment_of_the_Pakistan_Air_Force' },
    ],
  },
  {
    id: 'recent-paf-military',
    category: 'military',
    title: 'Recent PAF & military activity',
    teaser: 'May 2025 India–Pakistan aerial clash, ongoing modernisation, and defence diplomacy — dated, careful wording.',
    summary:
      'For ISSB current affairs, separate (1) force modernisation, (2) the May 2025 India–Pakistan crisis, and (3) defence diplomacy. Always say what is claimed vs independently confirmed.',
    keyPoints: [
      '6–7 May 2025: After the April 2025 Pahalgam attack, India launched Operation Sindoor strikes; Pakistan reported a major air battle and claimed multiple IAF jets downed. Open assessments discuss beyond-visual-range engagements and Chinese-origin weapons in PAF use. India and Pakistan dispute details — state both sides’ claims.',
      'Modernisation thread: JF-17 Block III production, J-10CE induction, reported interest in future stealth types (e.g. J-35 family in open reporting — treat as programme talk until in service).',
      'Defence diplomacy: deepening ties with Saudi Arabia and Türkiye appear in 2025–26 briefings on this site’s Current Affairs page.',
      'Domestic security / counter-terror operations continue to involve joint services — quote only facts you can source.',
    ],
    remember: 'May 2025 = Operation Sindoor / PAF response claims. Modernisation = JF-17 III + J-10CE. Diplomacy = Saudi/Türkiye file.',
    whyIssb: 'Interviewers probe whether you confuse viral claims with verified facts.',
    watch: ['Official ISPR / MoFA statements', 'Independent wreckage/analysis updates', 'CPEC security incidents'],
    sources: [
      { title: 'Wikipedia — 2025 India–Pakistan conflict', url: 'https://en.wikipedia.org/wiki/2025_India%E2%80%93Pakistan_conflict' },
      { title: 'World affairs page on this site', url: '/current-affairs' },
    ],
  },
  {
    id: 'abhinandan-tea-incident',
    category: 'military',
    title: 'Captured pilot & “the tea is fantastic”',
    teaser: 'Famous 27 Feb 2019 Abhinandan Varthaman episode — do not confuse with the May 2025 air crisis.',
    summary:
      'Wing Commander Abhinandan Varthaman (IAF MiG-21 Bison) was shot down and captured near the LoC on 27 February 2019 during the post-Balakot / Swift Retort crisis. In a widely shared custody video he praised his treatment and, when asked about the tea, said “The tea is fantastic, thank you.” He was returned to India on 1 March 2019. This is NOT the May 2025 conflict — that later crisis did not produce this tea quote.',
    keyPoints: [
      'Date: 27 February 2019 (not 6 May). Context: day after Balakot-related escalation; PAF Operation Swift Retort narrated on the Pakistani side.',
      'Pilot: then Wing Commander Abhinandan Varthaman, IAF; aircraft MiG-21 Bison; ejected and was captured in Pakistani territory near the LoC.',
      'Viral line: “The tea is fantastic, thank you,” while holding a cup; also said Pakistani officers had looked after him well, while refusing mission details (“I am not supposed to tell you this”).',
      'Return: handed back at Wagah on 1 March 2019 as a goodwill / de-escalation step announced by Pakistan’s leadership.',
      'ISSB angle: professional treatment of PoWs, media discipline, and knowing correct dates so you do not mix 2019 with May 2025.',
      'If someone says “6 May tea incident,” politely correct: May 2025 was a different clash; the tea quote is February 2019.',
    ],
    remember: '27 Feb 2019 · Abhinandan · MiG-21 · “tea is fantastic” · returned 1 Mar 2019. Not May 2025.',
    whyIssb: 'Tests factual precision under popular-memory pressure.',
    sources: [
      { title: 'Dawn — tea cup interview video coverage (27 Feb 2019)', url: 'https://www.dawn.com/news/1466402' },
      { title: 'Wikipedia — Abhinandan Varthaman', url: 'https://en.wikipedia.org/wiki/Abhinandan_Varthaman' },
    ],
  },
];

export const gkTopicCategoryCounts = Object.fromEntries(
  (['pakistan', 'military', 'geography', 'world', 'science', 'islamic', 'abbreviations', 'general', 'current'] as const).map(
    (category) => [category, gkTopics.filter((topic) => topic.category === category).length],
  ),
) as Record<GkCategory, number>;
