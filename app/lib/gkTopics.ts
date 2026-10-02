import type { GkCategory } from './generalKnowledge';

// Compact ISSB study topics for the General Knowledge tab.
// Factual, interview-friendly English. Research note: water status as of late Aug/early Oct 2026.

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
      'Signed 19 September 1960; entered into force after ratifications; effective from 1 April 1960.',
      'Eastern Rivers → India (unrestricted use after a transition period that ended by 1970/1973). Western Rivers → Pakistan (unrestricted use of waters India must let flow).',
      'India may build run-of-river hydropower on Western Rivers under Annexure D design rules, with notice to Pakistan.',
      'Dispute ladder: Permanent Indus Commission → Neutral Expert → Court of Arbitration (Annexure G).',
      'April 2025: India announced it was holding the treaty “in abeyance” after an attack in Indian-administered Jammu & Kashmir. Pakistan rejects unilateral suspension.',
      '31 August 2026: Court of Arbitration (PCA secretariat) ruled unanimously that the treaty remains fully in force and India must observe its obligations. India rejects the court’s jurisdiction and keeps its abeyance stance.',
      'Practical friction: Permanent Indus Commission has not met since May 2022 (per Pakistani reporting); data-sharing and inspections have been disrupted.',
    ],
    remember:
      'Six rivers, two sides: East (Ravi–Beas–Sutlej) India; West (Indus–Jhelum–Chenab) Pakistan. Treaty cannot be ended by one side alone — only by a new joint treaty.',
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
    teaser: 'Indus system, key dams, and why storage and irrigation keep coming up in interviews.',
    summary:
      'Pakistan’s agriculture and cities depend on the Indus basin. Know the main rivers, where major dams sit, and the link to the Indus Waters Treaty. Avoid quoting outdated reservoir statistics unless you rechecked them.',
    keyPoints: [
      'Main stem: Indus. Major western tributaries relevant to the treaty: Jhelum and Chenab (plus Indus itself).',
      'Kabul River joins the Indus near Attock.',
      'Tarbela Dam — Indus River, Khyber Pakhtunkhwa (large earth-fill dam; hydropower + irrigation storage).',
      'Mangla Dam — Jhelum River (Azad Jammu & Kashmir / Punjab interface; storage + power).',
      'Warsak — Kabul River near Peshawar. Khanpur — Haro River (KP). Ghazi-Barotha — Indus run-of-river / diversion scheme.',
      'Interview angle: storage, siltation, flood management, and treaty limits on Indian Western-River projects.',
    ],
    remember: 'Tarbela (Indus), Mangla (Jhelum), Warsak (Kabul). Attock = Kabul meets Indus.',
    whyIssb: 'Links geography, water security, and the IWT in one tidy answer.',
    sources: [{ title: 'Indus Waters Treaty topic card', url: '/general-knowledge' }],
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
];

export const gkTopicCategoryCounts = Object.fromEntries(
  (['pakistan', 'military', 'geography', 'world', 'science', 'islamic', 'abbreviations', 'general', 'current'] as const).map(
    (category) => [category, gkTopics.filter((topic) => topic.category === category).length],
  ),
) as Record<GkCategory, number>;
