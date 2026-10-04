import type { GkCategory } from './generalKnowledge';

// General Knowledge topics for the study tab.
// Story briefings with a point of view. Facts stay at HSSC level. Research note: water status as of late Aug/early Oct 2026.

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
    teaser: 'Six rivers, two neighbours, and a 1960 bargain that still decides whether the fields drink.',
    summary:
      'Picture the map the day the border was drawn. Canals that had watered one Punjab were suddenly cut in two, and somebody had to decide who got which river before the next sowing. In 1960 Pakistan and India signed the Indus Waters Treaty, with the World Bank in the room as broker. The eastern rivers, the Ravi, the Beas and the Sutlej, went mainly to India. The western rivers, the Indus, the Jhelum and the Chenab, went mainly to Pakistan. India may still take a limited share of the western rivers for homes, for uses that do not consume the water, for some farming, and for hydropower built to the treaty\'s rules. It may not simply keep the water that the deal gives to Pakistan. Ordinary arguments sit with a Permanent Indus Commission. When that table fails, the fight can go to a Neutral Expert or a Court of Arbitration. That is the story. A downstream country betting its harvest on a piece of paper, and an upstream country that does not get to tear the paper up alone.',
    keyPoints: [
      'The deal was signed in 1960 by Pakistan and India, and the World Bank brokered it, because partition had split the canals and the rivers had to be assigned in writing.',
      'The eastern rivers, Ravi, Beas and Sutlej, go mainly to India. The western rivers, Indus, Jhelum and Chenab, go mainly to Pakistan. Learn that split and you have the plot.',
      'India may use the western rivers for limited purposes, including run of river hydropower under the treaty rules, but the water allocated to Pakistan is supposed to keep flowing.',
      'The Permanent Indus Commission handles the day to day. Heavier disputes can go to a Neutral Expert or a Court of Arbitration.',
      'In 2025 India said it was holding the treaty in abeyance. Pakistan rejects a one sided exit. Reporting in August 2026 on the arbitration said the treaty remains in force, and India disputes that process. State both positions. Do not invent a legal ending that has not been handed down.',
    ],
    remember:
      '1960. World Bank. East is Ravi, Beas and Sutlej for India. West is Indus, Jhelum and Chenab for Pakistan. One side cannot end it alone.',
    whyIssb:
      'This is how the Indus plain eats. Wheat, cities and power stations all wait on water that starts as snow in someone else\'s mountains. The treaty matters because a river ignores the border, and a rumour that the deal is already dead is not the same thing as a new treaty both sides have signed.',
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
    teaser: 'A country hung on one river, with a sea at its feet and four neighbours pressed against the mountains.',
    summary:
      'Start at the water, not the capital. Pakistan sits in South Asia with the Arabian Sea along its south, India to the east, Afghanistan and Iran to the west, and China in the high north east. The north is a wall of Himalaya, Karakoram and Hindu Kush. South of that wall the Indus and its tributaries lay down the plain that feeds the country. Then the land dries into the Thar, Cholistan and Kharan, and finally meets the coast of Sindh and Balochistan. Islamabad is the capital. Karachi is the giant, the port and the economic engine. Four provinces do the governing, Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan, with Islamabad Capital Territory beside them, and Azad Jammu and Kashmir and Gilgit Baltistan administered under a status people still argue about. Say that carefully. The climate is mostly arid or semi arid. The monsoon decides floods and harvests. Winter in the north can shut a valley. If you can sketch that in one breath, you understand the country better than a list of facts ever will.',
    keyPoints: [
      'Islamabad is the capital. Karachi is the largest city and the economic hub. They are not the same story.',
      'Four provinces, Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan, plus Islamabad Capital Territory. Azad Jammu and Kashmir and Gilgit Baltistan are administered territories, and their status is politically sensitive, so state the fact and do not decorate it.',
      'The Indus and its tributaries, Jhelum, Chenab, Ravi, the Beas in the historical basin, and the Sutlej, feed most of the irrigated farming. The river is the spine.',
      'K2, also called Godwin Austen, stands in the Karakoram. It is the second highest peak on Earth.',
      'The climate is largely arid or semi arid. Monsoon rain makes the crops and the floods. Northern winters can be severe.',
      'The places that keep coming back are Gwadar on the Arabian Sea, the passes toward Afghanistan and China, and the Indus as a lifeline. That is the geography that politics is built on.',
    ],
    remember:
      'Arabian Sea to the south. India to the east. Afghanistan and Iran to the west. China to the north east. The Indus runs through the middle.',
    whyIssb:
      'Maps are not decoration. Where the river runs decides food. Where the passes sit decides trade and war. Where the only coastline is decides how the fuel arrives. Get the shape of the country wrong and every later argument about water, China or the sea starts in the wrong place.',
    sources: [
      { title: 'Study map practice on this site', url: '/countries' },
      { title: 'Pakistan overview — World Factbook-style primers (verify latest figures before quoting numbers)' },
    ],
  },
  {
    id: 'provinces-territories',
    category: 'pakistan',
    title: 'Provinces & territories',
    teaser: 'Four capitals, one federal city, and a northern map that people still argue over.',
    summary:
      'Ask someone to name Pakistan and they reach for the flag. Ask the map and it answers with four provinces that do not live the same life. Punjab, capital Lahore, is the crowded Indus plain, the country\'s most populous province and its great farm. Sindh, capital Karachi, holds the main port and the city that never really sleeps. Khyber Pakhtunkhwa, capital Peshawar, is the old North West Frontier Province, the Sarhad of an earlier generation, and since the 25th Amendment in 2018 it also holds the former FATA agencies that used to sit outside ordinary provincial rule. Balochistan, capital Quetta, is the largest province by area and one of the emptiest by people, with Gwadar out on the Makran coast staring at the Arabian Sea. Islamabad Capital Territory is the federal capital, deliberately not swallowed by any province. North of the provinces, Azad Jammu and Kashmir and Gilgit Baltistan are administered territories, not a fifth and sixth province. Say that out loud until it sticks. The 2018 merger is the modern twist. The agencies people still name are Bajaur, Mohmand, Khyber, Kurram, Orakzai, North Waziristan and South Waziristan.',
    keyPoints: [
      'Punjab, capital Lahore. The most populous province, and the Indus plain\'s farm.',
      'Sindh, capital Karachi, which is also the country\'s main port city.',
      'Khyber Pakhtunkhwa, formerly the NWFP or Sarhad, capital Peshawar. The former FATA agencies joined it under the 25th Amendment in 2018.',
      'Balochistan, capital Quetta. Largest by area, sparse in people, with Gwadar on the Makran coast.',
      'Islamabad Capital Territory is the federal capital, not a province.',
      'The former FATA agencies, for the names people still use, are Bajaur, Mohmand, Khyber, Kurram, Orakzai, North Waziristan and South Waziristan.',
    ],
    remember: 'Lahore, Karachi, Peshawar, Quetta, and Islamabad. Khyber Pakhtunkhwa is the old NWFP. FATA merged into it in 2018.',
    whyIssb: 'A province is not a trivia chip. It is who collects the revenue, who polices the road, and whose capital you mean when you say the frontier or the port. Mixing Quetta with Karachi, or calling the old tribal agencies a separate province after 2018, is how a confident answer falls apart.',
    sources: [{ title: 'Photo-sourced GK cards on this site', url: '/general-knowledge' }],
  },
  {
    id: 'rivers-dams',
    category: 'geography',
    title: 'Rivers, dams & hydropower',
    teaser: 'Two giant water banks, Tarbela and Mangla, and a handful of dams people constantly mix up.',
    summary:
      'Follow the Indus and you are following the country\'s bet against a dry year. The main stem is the Indus itself. The Jhelum and the Chenab are the great western tributaries the water treaty cares about. The Kabul comes out of Afghanistan and meets the Indus near Attock, which is why that town keeps turning up in exam answers. Then come the dams, and here the story has a clear hero and a clear second. Tarbela, on the Indus in the Haripur and Swabi area of Khyber Pakhtunkhwa, is the largest dam in Pakistan, the big reservoir, built for power and for holding irrigation water. Mangla, on the Jhelum near Mirpur in Azad Jammu and Kashmir, is the second largest storage dam. Everyone else is a supporting character. Warsak sits on the Kabul near Peshawar. Khanpur sits on the Haro near Khanpur in Khyber Pakhtunkhwa, a water supply and irrigation dam, not a giant. Ghazi Barotha is a run of river scheme on the Indus between Tarbela and Attock, clever but not a huge storage lake. Hub Dam, on the Hub River near Karachi where Sindh and Balochistan meet, feeds the city. Do not dress it up as an Indus storage dam. And do not invent megawatt or acre foot figures in the heat of the moment. River, place, and which one is largest. That is the honest version.',
    keyPoints: [
      'Name the rivers first. The Indus is the main stem. The Jhelum and the Chenab are the western tributaries in the Indus Waters Treaty. The Kabul joins the Indus near Attock.',
      'Tarbela Dam is on the Indus, in the Haripur and Swabi area of Khyber Pakhtunkhwa. It is the largest dam in Pakistan, the biggest storage, and it does both hydropower and irrigation.',
      'Mangla Dam is on the Jhelum, near Mirpur in Azad Jammu and Kashmir. It is the second largest storage dam after Tarbela.',
      'Warsak Dam is on the Kabul River near Peshawar. If the question says near Peshawar, this is usually the dam they want.',
      'Khanpur Dam is on the Haro River near Khanpur in Khyber Pakhtunkhwa. It is water supply and irrigation, not the giant.',
      'Ghazi Barotha is a run of river scheme on the Indus between Tarbela and Attock. Hub Dam is on the Hub River near Karachi and mainly supplies the city. Do not confuse either of them with Tarbela or Mangla.',
    ],
    remember:
      'Largest is Tarbela, Indus, Haripur and Swabi. Second is Mangla, Jhelum, Mirpur. Warsak is the Kabul near Peshawar. Khanpur is the Haro. Attock is where the Kabul meets the Indus.',
    whyIssb: 'Storage is the difference between a river that arrives in a flood and a river you can still use in a lean month. Tarbela and Mangla are the country\'s two great water banks. Mix up the river or the place and you have told the wrong story about how Pakistan actually stays irrigated.',
    sources: [
      { title: 'Indus Waters Treaty topic card', url: '/general-knowledge' },
      { title: 'Source GK Q&A — dam locations', url: '/general-knowledge' },
    ],
  },
  {
    id: 'borders-neighbours',
    category: 'geography',
    title: 'Borders & neighbours',
    teaser: 'Four land neighbours, one sea, and one line that is a ceasefire, not a settled border.',
    summary:
      'Stand in the middle of the country and turn. To the east and south east is India, and part of that frontier is the Line of Control in Jammu and Kashmir. Call it what it is. A ceasefire line, not an agreed international boundary. People who blur that are picking a side without admitting it, and the honest line is the careful one. To the west and north west is Afghanistan, along the Durand Line, with Torkham through the Khyber and Chaman further south as the crossings everyone names. To the west and south west is Iran, a Balochistan frontier of trade and trouble, with Taftan and the coastal routes as the practical doors. To the north east the Karakoram rises into China, and the Khunjerab Pass carries the Karakoram Highway into Xinjiang. South, there is no fifth land neighbour. There is the Arabian Sea, with Karachi and Port Qasim in Sindh and Gwadar and the Makran coast in Balochistan. Do not invent border lengths or troop numbers. Neighbour, direction, and one true thing about the crossing. That is a complete answer.',
    keyPoints: [
      'India lies to the east and south east. The Line of Control in Jammu and Kashmir is a ceasefire line, not an agreed international boundary.',
      'Afghanistan lies to the west and north west, along the Durand Line. The crossings to remember are Torkham, through the Khyber, and Chaman.',
      'Iran lies to the west and south west. The Balochistan frontier uses Taftan and the coastal routes for trade and for security.',
      'China lies to the north east, across the high Karakoram. Khunjerab Pass links Gilgit Baltistan to Xinjiang on the Karakoram Highway.',
      'The Arabian Sea is the southern frontier. Karachi and Port Qasim are in Sindh. Gwadar and the Makran coast are in Balochistan.',
    ],
    remember: 'India, Afghanistan, Iran, China, and the Arabian Sea. Torkham and Chaman face Afghanistan. Khunjerab faces China.',
    whyIssb: 'Borders are where trade, refugees, fuel and arguments actually cross. Name the wrong pass and you have sent a truck to China that was meant for Kabul. Call the Line of Control a finished international border and you have settled, in one careless sentence, a dispute that whole governments refuse to settle.',
    sources: [{ title: 'Countries map practice', url: '/countries' }],
  },
  {
    id: 'khyber-pass',
    category: 'geography',
    title: 'Khyber Pass',
    teaser: 'The gate between Peshawar and Kabul. Armies used it. Caravans used it. So did the supply trucks.',
    summary:
      'If someone says Pepper Pass, smile and give them the real name. It is the Khyber Pass, and it has been letting the world into the subcontinent, or out of it, for as long as anyone has written the journey down. It cuts through the Khyber District of Khyber Pakhtunkhwa, in the foothills of the Spin Ghar, the Safed Koh, the White Mountains. The route in the head should be Peshawar, then Jamrud, then Landi Kotal, then Torkham on the border, then on toward Jalalabad and Kabul. Landi Kotal is the high bazaar town, up around a thousand metres and more. The main corridor is on the order of about 50 kilometres, about 30 miles, depending on where you start counting. For centuries it was a Silk Road and an invasion road, because it is the short, hard way from the Indus plains toward Kabul and there is no easy way around it. In the 2000s a huge share of NATO\'s ground supplies into Afghanistan rolled through the same notch. Today the argument is border management at Torkham, and the road itself, the Khyber Pass Economic Corridor works meant to upgrade Peshawar to Torkham. Do not confuse it with the Bolan, which is a Balochistan story toward the Quetta and old Kandahar axis, or with Khojak near Chaman, or with Khunjerab, which faces China.',
    keyPoints: [
      'It sits in Khyber District, Khyber Pakhtunkhwa, through the foothills of the Spin Ghar, also called the Safed Koh or White Mountains.',
      'The route to hold in your head is Peshawar, Jamrud, Landi Kotal, Torkham at the border, then toward Jalalabad and Kabul.',
      'The main corridor is on the order of about 50 kilometres or about 30 miles, depending on the start and end you choose. The high area around Landi Kotal is about a thousand metres and more.',
      'Its power is simple. It is the shortest practical land link from the Indus plains toward Kabul, and it is hard to bypass.',
      'Do not mix it with the Bolan in Balochistan, the Khojak near Chaman, or the Khunjerab toward China.',
      'The modern chapter is the Torkham crossing, border management with Afghanistan, and the Khyber Pass Economic Corridor road upgrades between Peshawar and Torkham.',
    ],
    remember: 'Khyber means Peshawar, Torkham, Afghanistan. It is not the Bolan. Landi Kotal is the high bazaar town.',
    whyIssb:
      'This notch is why Peshawar has always faced west. Trade, invasion and, in the 2000s, a war\'s supply line all chose the same gap because the mountains do not offer a kinder one. Get the name and the neighbour right and the rest of the frontier starts to make sense.',
    sources: [
      { title: 'Encyclopaedia Britannica — Khyber Pass', url: 'https://www.britannica.com/place/Khyber-Pass' },
      { title: 'World Bank — Khyber Pass Economic Corridor factsheet', url: 'https://www.worldbank.org/en/news/factsheet/2019/10/01/khyber-pass-economic-corridor-kpec' },
    ],
  },
  {
    id: 'strategic-passes',
    category: 'military',
    title: 'Strategic mountain passes',
    teaser: 'Four passes, four different neighbours and stories. Mix them up and the map collapses.',
    summary:
      'Pakistan\'s mountain rim is not one gate. It is a set of named doors, and each door faces a different life. The Khyber, in Khyber Pakhtunkhwa, faces Afghanistan at Torkham and has carried armies and trade toward Kabul for centuries. The Bolan, in Balochistan near Quetta, is the other famous Afghan facing road, the historic way toward southern Afghanistan, with a railway and a road that made Quetta matter. The Khojak, near Chaman, is the Balochistan Afghanistan frontier pass people confuse with both of the others. The Khunjerab is a different continent of cold. It links Gilgit Baltistan with Xinjiang, and it is the highest paved international border crossing on the Karakoram Highway, the door toward China, not toward Kabul. Then there is the Lowari, a pass and now a tunnel, which only gets you to Chitral inside Khyber Pakhtunkhwa. It is internal connectivity, not a foreign border, and treating it like one is a tell that you memorised names without a map. The side to take is simple. A pass is a neighbour plus a town. If you cannot name both, you do not know the pass yet.',
    keyPoints: [
      'The Khyber Pass, in Khyber Pakhtunkhwa, faces Afghanistan at Torkham. It is the historic military and trade corridor toward Kabul.',
      'The Bolan Pass, in Balochistan near Quetta, is the historic route toward southern Afghanistan, and it carries real railway and road weight.',
      'The Khojak Pass is near Chaman, on the Balochistan Afghanistan frontier. It is not the Khyber and it is not the Bolan.',
      'The Khunjerab Pass links Gilgit Baltistan with Xinjiang in China. It is the highest paved international border crossing on the Karakoram Highway.',
      'The Lowari Pass and tunnel open the way to Chitral inside Khyber Pakhtunkhwa. That is internal connectivity, not a border with another country.',
    ],
    remember: 'Toward Afghanistan, think Khyber, Khojak and the Bolan axis. Toward China, think Khunjerab. Always add the province.',
    whyIssb: 'These names are how goods, armies and families have crossed the same mountains for generations. Pair each pass with the wrong neighbour and you have redrawn the frontier by accident. Khunjerab is China. Khyber is Afghanistan. Lowari is home.',
    sources: [{ title: 'Khyber Pass topic card', url: '/general-knowledge' }],
  },
  {
    id: 'cpec',
    category: 'pakistan',
    title: 'CPEC (China–Pakistan Economic Corridor)',
    teaser: 'China\'s western door to the Arabian Sea, built first as power and roads, then asked to become industry.',
    summary:
      'CPEC is the China Pakistan Economic Corridor, and it is a flagship of China\'s Belt and Road, not a mystery acronym and not CPAC. The idea is almost rude in its simplicity. Take China\'s Xinjiang, come over the Karakoram Highway and the Khunjerab, run down the length of Pakistan, and reach the Arabian Sea at Gwadar. Phase one did the loud work. Power plants, highways, and the Gwadar linked infrastructure that let people point at a map and say the corridor exists. The long term plan was framed for roughly 2017 to 2030. What people now call phase two, or CPEC 2.0, is the harder chapter. Industry, special economic zones, agriculture, mining, information technology, and business to business investment, instead of one more mega project for the cameras. The zone names that keep being cited are Rashakai, Allama Iqbal Industrial City, Dhabeji and Bostan, and their progress is not the same from one gate to the next. In May 2026, Pakistani and Chinese joint messaging again talked up industrial parks, skills, supply chains, and the security of Chinese personnel and projects. Here is the side worth taking. The energy and the roads were a real gain. The promise that zones would fill themselves with factories was always the part that had to be earned, and security in parts of Balochistan, the debt and circular debt argument, and slow zone take up are constraints, not talking points you skip.',
    keyPoints: [
      'The core idea is a land bridge from China\'s Xinjiang, over the Karakoram Highway and the Khunjerab, through Pakistan, to the Arabian Sea at Gwadar.',
      'The early harvest was power plants, motorways and highways, and Gwadar port and airport related works.',
      'The long term plan was framed for roughly 2017 to 2030. Pakistan and China have discussed revising it under a CPEC 2.0 frame of growth, innovation, green development, livelihood and openness.',
      'The special economic zone names people cite are Rashakai, Allama Iqbal Industrial City, Dhabeji and Bostan. Progress is not even across them.',
      'In May 2026, joint Pakistani and Chinese messaging reaffirmed industrial parks, skills, supply chains, and protection of Chinese personnel and projects.',
      'Count the gains, connectivity and energy, and count the drag, security in parts of Balochistan, the debt and circular debt context, and slow zone take up. A slogan is not an answer.',
    ],
    remember: 'CPEC is the China to Gwadar corridor. Phase one was energy and roads. Phase two is industry, zones and business to business investment.',
    whyIssb:
      'It is the biggest attempt in this generation to change how Pakistan plugs into the world economy, and also the biggest place where hope ran ahead of factories. The corridor matters because Gwadar, the power grid and the Karakoram road are no longer drawings. It matters just as much that a zone on a list is not yet a payroll.',
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
    teaser: 'A Balochistan harbour asked to become the sea end of a continental road. Karachi is still the giant.',
    summary:
      'Gwadar is a port city on the Makran coast of Balochistan, west of Karachi, looking at the Arabian Sea from a shoreline most of the country has never stood on. Under CPEC it is sold as Pakistan\'s western deep water gate. Shorter overland access for western China to the Indian Ocean, and a logistics and free zone future sitting beside the berths. The new Gwadar International Airport was inaugurated in October 2024 and handed to Pakistan\'s airport authority. Turning that runway into ordinary commercial life was still the planning focus into 2026 and 2027. There is a loud argument about what the port really is. A commercial hub for trade, or a wider Indian Ocean door for China. The grounded way to tell it is geography plus the stated project goals, and then your own view if someone asks. The view worth having is this. Gwadar is a real bet, not a myth, and it is not yet the port that carries the country. Karachi, with Port Qasim beside it, remains the established giant. Water for the town, local development, and security are the unglamorous chapters, and they are the ones that decide whether the bet pays.',
    keyPoints: [
      'Gwadar sits on the Makran coast of Balochistan, on the Arabian Sea, west of Karachi.',
      'In CPEC it is the southern end of the corridor, with free zone and logistics ambitions beside the port itself.',
      'The new Gwadar International Airport was inaugurated in October 2024 and handed to Pakistan\'s airport authority. Commercial use was still a 2026 and 2027 planning focus.',
      'The strategic argument is commercial hub versus a wider Indian Ocean door for China. Stick to the geography and the stated goals, then give a view if you are asked.',
      'Water supply, local development and security are the practical problems. They are challenges, not slogans.',
    ],
    remember: 'Gwadar is the Balochistan port at the sea end of CPEC. Karachi is still the larger, established port complex.',
    whyIssb: 'A deep water harbour on a short road from western China is a strategic fact, whether you cheer it or worry about it. It changes the map of the Arabian Sea. Pretending it has already replaced Karachi is the other mistake, the one the hype wants you to make.',
    sources: [{ title: 'CPEC topic card', url: '/general-knowledge' }],
  },
  {
    id: 'china-pakistan',
    category: 'world',
    title: 'China–Pakistan relations',
    teaser: 'Not a slogan. A choice Pakistan made in the 1950s and has kept through wars, roads and shipyards.',
    summary:
      'People reach for all weather the way they reach for a proverb. The useful version is colder and more interesting. Pakistan and China opened diplomatic relations in the early 1950s, and both sides still call the tie an all weather strategic cooperative partnership. Under the proverb there are three pillars you can actually point at. Diplomacy that shows up in high level visits. Defence cooperation that has run for decades in aircraft, ships and exercises, which you should describe only as far as you can source it. And an economic spine called CPEC, the piece of the Belt and Road that runs to Gwadar. The land link is not abstract. The Khunjerab Pass and the Karakoram Highway join Gilgit Baltistan to Xinjiang. Through 2025 and 2026 the public message from both capitals stressed the industrial chapter of CPEC and the protection of Chinese personnel working in Pakistan. Take a side. This relationship is a strategic choice, not a folk tale, and it has costs as well as cover. Debt questions, project security, and arguments about Xinjiang will come up. The adult answer is the pillars, then a clean I do not know when the file runs out.',
    keyPoints: [
      'Diplomatic relations date from the early 1950s. Both sides often call the relationship an all weather strategic cooperative partnership.',
      'The economic spine is CPEC and the wider Belt and Road projects.',
      'Defence cooperation is long standing, in aircraft, ships and joint exercises. Quote only what you can actually source.',
      'The border link is the Khunjerab Pass and the Karakoram Highway, between Gilgit Baltistan and Xinjiang.',
      'Messaging in 2025 and 2026 stressed CPEC\'s industrial phase and the protection of Chinese personnel in Pakistan.',
    ],
    remember: 'Three pillars. Diplomacy, defence cooperation, and the CPEC economy. The border link is Khunjerab.',
    whyIssb: 'China is the partner Pakistan leans on when the neighbourhood turns rough, and the partner whose projects now sit inside Pakistani towns. That is why the relationship shapes loans, weapons, roads and arguments at the same time. Friendship as a slogan explains none of it. The pillars do.',
    sources: [{ title: 'CPEC and Gwadar topic cards', url: '/general-knowledge' }],
  },
  {
    id: 'arabian-sea',
    category: 'geography',
    title: 'Arabian Sea & Pakistan’s coastline',
    teaser: 'One ocean, and almost everything Pakistan buys by ship has to cross it.',
    summary:
      'Pakistan does not have a menu of coastlines. It has the Arabian Sea, and that single fact organises the navy, the fuel bill and the port argument. Karachi Port and Port Qasim, both in Sindh, are the working giants. Gwadar, in Balochistan, is the western harbour tied to CPEC\'s maritime end. The sea lanes run to the Persian Gulf, which is where the energy is, and onward to East Africa and East Asia. When the Gulf or the Strait of Hormuz tightens, Pakistani fuel and freight feel it as insurance and delay, not as a distant headline. There is an exclusive economic zone and there are fisheries, real economic themes, but do not invent a square kilometre figure you have not checked. The side to take is blunt. A land country that forgets it has only one sea will not understand why a port, a tanker, or a crisis in the Gulf shows up in the price of everything.',
    keyPoints: [
      'The main ports are Karachi Port and Port Qasim in Sindh, and Gwadar in Balochistan.',
      'The sea lanes tie Pakistan to the Persian Gulf for energy, and to East Africa and East Asia for wider trade.',
      'Tension in Hormuz or the wider Gulf can raise freight and insurance costs for Pakistani fuel and goods.',
      'The exclusive economic zone and the fisheries are real themes. Do not invent area figures.',
    ],
    remember: 'One sea, the Arabian Sea. Three names, Karachi, Port Qasim and Gwadar.',
    whyIssb: 'Almost all of the country\'s seaborne trade, and the fuel that keeps the cities running, comes across this water. The Arabian Sea is not a blue edge on the map. It is the road the economy actually uses.',
    sources: [{ title: 'World affairs briefings', url: '/current-affairs' }],
  },
  {
    id: 'mountains-peaks',
    category: 'geography',
    title: 'Mountains & peaks',
    teaser: 'Three ranges share the north. Only one of them holds K2.',
    summary:
      'The north of Pakistan is not one mountain with three names. It is three range systems arguing over the sky, and interviewers love the person who can tell them apart. The Karakoram holds K2, Mount Godwin Austen, about 8,611 metres, the second highest peak on Earth, in the Baltoro region of Gilgit Baltistan. That is Pakistan\'s signature peak, and it is not in the Himalaya. The Himalaya along the eastern northern rim holds Nanga Parbat, about 8,126 metres, the famous one people then confuse with K2. The Hindu Kush is the northwestern highland system, the one that leans toward Afghanistan. Through this whole belt the high passes, Khunjerab among them, cut the roads toward China. Take the side of precision. Calling every snowy summit the Himalaya is how a beautiful country gets described wrongly. K2 is Karakoram. Nanga Parbat is Himalaya. The Hindu Kush is the third name, not a synonym.',
    keyPoints: [
      'The Karakoram includes K2, Mount Godwin Austen, about 8,611 metres, the second highest peak on Earth, in the Baltoro region of Gilgit Baltistan.',
      'The Himalaya forms the eastern part of the northern rim. Nanga Parbat, about 8,126 metres, is the famous Himalayan peak in Pakistan.',
      'The Hindu Kush is the northwestern highland system, toward Afghanistan.',
      'Khunjerab and the other high passes cut through this belt toward China.',
    ],
    remember: 'The highest peak in Pakistan is K2, in the Karakoram. Nanga Parbat is in the Himalaya.',
    whyIssb: 'These ranges are why the north is a border, a watershed and a barrier at the same time. They feed the rivers, block the roads, and carry the crossings into China and toward Afghanistan. Mix up K2 and Nanga Parbat and you have moved a mountain into the wrong range.',
    sources: [{ title: 'Geography Q&A cards on this site', url: '/general-knowledge' }],
  },
  {
    id: 'water-security',
    category: 'pakistan',
    title: 'Water security for Pakistan',
    teaser: 'Pakistan drinks last. The rivers arrive from upstream, and timing matters as much as the year\'s total.',
    summary:
      'Pakistan is the lower riparian on the western Indus rivers. The snow and the rain fall, the water comes downhill, and the country at the bottom has to catch what the year allows. Food, cities and industry depend on predictable flows, on storage at Tarbela, Mangla and the smaller dams, and on the canal system that spreads that water across the plain. Climate makes the plot meaner. Glacier melt and monsoon extremes do not arrive on a polite schedule. Upstream projects make it political as well as technical. The treaty is the rulebook. It allocates the rivers and limits how India may design works on the western rivers. Inside Pakistan the work is storage, lining and efficiency in the canals, groundwater that is being worked too hard, urban supply, and flood management. Here is the side to take, because the viral version is wrong. India cannot twist a household tap and empty the Indus overnight. Geography and run of river design limit a sudden total cutoff. What can be damaged, and what is worth fighting for, is predictability. Data shared on time. Inspections that happen. Flows you can plan a sowing around. Defend the lawful share. Name the treaty. Prefer technical cooperation over a war slogan.',
    keyPoints: [
      'As the lower riparian, Pakistan is exposed to timing, not only to the year\'s total volume.',
      'The Indus Waters Treaty allocates the rivers and limits upstream design on the western rivers.',
      'The domestic job is storage, more efficient canals, groundwater stress, city supply and flood management.',
      'Do not claim India can turn the Indus off overnight. Geography and run of river dams limit a sudden total cutoff. Data sharing and predictability still matter enormously.',
      'The adult stance is lawful water rights, the treaty by name, and technical cooperation. Leave the warmongering slogans out.',
    ],
    remember: 'Water security is the Indus basin, plus storage, plus the treaty rules, plus climate stress. The keyword is predictability.',
    whyIssb: 'A missed timing on the Indus is a missed crop, a city on short supply, or a flood that arrives as a surprise. Water is national resilience in the most ordinary sense. Bread, electricity and whether a town has a tap that works.',
    sources: [
      { title: 'Indus Waters Treaty topic', url: '/general-knowledge' },
      { title: 'Current affairs — India–Pakistan freeze / IWT', url: '/current-affairs' },
    ],
  },
  {
    id: 'orgs-memberships',
    category: 'world',
    title: 'Pakistan in international organisations',
    teaser: 'The rooms Pakistan sits in, from the UN to a South Asian club that barely meets.',
    summary:
      'A country is also a set of memberships, and the interesting part is which rooms still function. Pakistan sits in the United Nations, headquarters in New York, and it has long put troops into peacekeeping, which is a concrete thing to say instead of a vague we support peace. It sits in the Organisation of Islamic Cooperation, the political room of the Muslim world. It sits in the Shanghai Cooperation Organisation, a regional security and economic club whose cast includes China, Russia, Central Asian states, India and Pakistan. It sits in SAARC, the South Asian Association for Regional Cooperation, and here the honest line is that the club is often stalled by politics. It sits in ECO, the Economic Cooperation Organization, with Iran, Türkiye, Central Asian partners and others. And it lives in the orbit of the IMF and the World Bank whenever the economy is in the news. The World Bank is also the broker of the Indus Waters Treaty, which is the one fact that ties a financial institution to a river. Take a side on SAARC. A regional body that cannot meet is not a triumph of South Asian unity. It is a chair left empty. The other memberships are how Pakistan actually speaks outside its own borders.',
    keyPoints: [
      'The United Nations, headquarters in New York. Pakistan contributes to peacekeeping.',
      'The Organisation of Islamic Cooperation, the OIC.',
      'The Shanghai Cooperation Organisation, the SCO, a regional security and economic grouping that includes China, Russia, Central Asia, India and Pakistan.',
      'SAARC, the South Asian Association for Regional Cooperation, often stalled by politics.',
      'ECO, the Economic Cooperation Organization, with Pakistan, Iran, Türkiye, Central Asian partners and others.',
      'The IMF and the World Bank show up constantly in economic news. The World Bank also brokered the Indus Waters Treaty.',
    ],
    remember: 'UN, OIC, SCO, SAARC and ECO. The World Bank is the broker of the Indus Waters Treaty.',
    whyIssb: 'These acronyms are the difference between a country that only reacts and a country that has a seat when rules, loans and crises are discussed. Peacekeeping is people in the field. A stalled SAARC is a region that cannot bear to sit together. Both are facts about how the world is actually organised.',
    sources: [{ title: 'Abbreviations Q&A category', url: '/general-knowledge' }],
  },
  {
    id: 'defence-pact-context',
    category: 'military',
    title: 'Saudi–Türkiye–Pakistan defence ties',
    teaser: 'Saudi Arabia, Türkiye and Pakistan are drawing closer. That is not the same thing as an automatic war promise.',
    summary:
      'Through 2025 and 2026, reporting on Pakistan\'s defence diplomacy with Saudi Arabia and Türkiye got thicker, including coverage tied to talks in Mecca. The cast is not new. Saudi Arabia is already a strategic economic and defence partner. Türkiye already has a long history of defence industry and training ties with Pakistan. Pakistan brings a professional military and production partnerships of its own. What people want, the moment they hear defence pact, is a clause that says an attack on one is an attack on all. Do not give them that clause unless you have read it. This file is evolving diplomacy. Separate a memorandum, a training deal or a factory agreement from a full collective defence guarantee. It is not a NATO clone unless a signed text says so, and inventing articles is how rumours become answers. The side to take is the unfashionable one. Closer ties in the Muslim world and a serious defence industry relationship are real and worth knowing. Pretending a photograph of three flags is a mutual defence treaty is how you get the next question wrong. For the dated blow by blow, use the current affairs briefing rather than a half remembered headline.',
    keyPoints: [
      'The partners to know are Saudi Arabia, with strategic economic and defence links, Türkiye, with a history of defence industry and training cooperation, and Pakistan, with a professional military and production partnerships.',
      'For anything dated, use the current affairs briefing on this site. Do not invent treaty articles from memory.',
      'A memorandum or an industry deal is not the same thing as a full collective defence guarantee.',
      'The wider themes are Middle East stability, diplomacy in the Muslim world, and the reputation of Pakistan\'s professional military.',
    ],
    remember: 'Closer defence ties are not an automatic mutual defence treaty. Do not invent the clause. The dated file lives in current affairs.',
    whyIssb: 'Who trains with whom, and who might show up in a crisis, changes the balance of the Middle East and of Pakistan\'s own options. The danger is the exciting version. A real partnership is news. A guarantee nobody has signed is fiction.',
    sources: [{ title: 'World affairs & wars page', url: '/current-affairs' }],
  },
  {
    id: 'paf-fighters',
    category: 'military',
    title: 'PAF fighter jets',
    teaser: 'Thunder, Falcon and J-10 up front. Mirage and F-7 still in the story, and leaving it.',
    summary:
      'The Pakistan Air Force does not fly one aeroplane and it does not publish a full public order of battle, so anyone quoting a secret exact headcount is performing. What you can say, from open directories such as IISS and FlightGlobal, is the shape of the fleet. The front of it is three types. The JF-17 Thunder, built by PAC with China\'s CAC, is the homegrown multirole fighter, the one Pakistan can keep building. It is single seat, with the JF-17B as the dual seat trainer. Open figures put it around Mach 1.6, with a ceiling around 55,000 feet, about 16,800 metres. Blocks 1 to 3 are in service, and Block III is the one with the modern AESA radar and weapons suite. The F-16 Fighting Falcon is the American veteran, A and B models brought up through MLU and ADF, and C and D Block 52s. Single seat in the A and C, two seats in the B and D, and a Mach 2 class aeroplane. The J-10CE is the newer Chinese single engine multirole, crew of one, AESA radar, the export CE for Pakistan, and open reporting in 2025 tied the PL-15E beyond visual range missile to the type. Behind them are the ageing French Mirage III and Mirage 5, many of them ROSE upgraded, mostly single seat, a Mach 2 class family being eased toward the Thunder and the J-10. And the F-7PG, a Chinese interceptor out of the MiG-21 lineage, single seat, leaving the front line. Take the Thunder\'s side of the story. A force that can build its own fighter is telling a different future from a force that only imports one. Still name the Falcon. It has been the proven sword for a generation.',
    keyPoints: [
      'The JF-17 Thunder, from PAC and CAC, is the main indigenous multirole fighter. Crew of one, or two in the JF-17B. Open figures put top speed near Mach 1.6 and the ceiling near 55,000 feet. Blocks 1 to 3 are in service, and Block III brings the modern radar and weapons.',
      'The F-16 Fighting Falcon is the long serving American multirole. Pakistan flies A and B models, MLU and ADF, and C and D Block 52s. Crew of one, or two in the trainers. Speed is about Mach 2 class.',
      'The J-10CE is a Chinese single engine multirole with an AESA radar, the export version for Pakistan, crew of one. Open reporting in 2025 links the PL-15E beyond visual range missile to this type.',
      'The Mirage III and Mirage 5, with ROSE upgrades, are French origin strike and multirole jets, mostly single seat. They are an ageing fleet being phased toward the JF-17 and the J-10.',
      'The F-7PG is a Chinese interceptor from the MiG-21 lineage, single seat, and it is leaving front line roles.',
      'Say type, then origin, then role, then crew, then one performance cue. Do not invent squadron counts.',
    ],
    remember: 'Front line is JF-17, F-16 and J-10CE. Legacy is Mirage III and 5, plus the F-7PG. Combat crew is usually one. Trainers have two.',
    whyIssb: 'These are the aircraft that police Pakistan\'s sky and, in a crisis, the ones that have to arrive in minutes. The mix matters. A homegrown fighter, a proven American one, a new Chinese long arm, and a legacy fleet on the way out. That is a force in the middle of a generation change, not a museum and not a single wonder jet.',
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
    teaser: 'The unglamorous fleet. Hercules to move the army, a tanker to stretch the fighters, and a small utility type on the way out.',
    summary:
      'Fighters get the posters. Wars and floods are moved by the other aeroplanes. PAF air mobility sits on three names. The Lockheed C-130 Hercules is the turboprop workhorse, tactical airlift in B, E and H variants, with open counts in the twenty plus range. Crew is typically four to six, pilots plus loadmasters or a flight engineer depending on the fit, and payload is on the order of about 20 tonnes, varying with the variant and the range. Do not invent a kilogram figure you have not checked. The Ilyushin Il-78MP, the Midas, is the jet that can do two jobs. Strategic freight, and aerial refuelling so a fighter does not have to come home early. Open sources count four of them, crew around six, flown by Number 10 MRTT Squadron at Nur Khan. The CN-235 is the twin turboprop utility, a handful in the open lists, often four, crew of about two or three, far less aeroplane than a Hercules, and Pakistani coverage has treated it as limited and a retirement candidate. The side to take is that a fighter without a tanker and a transport is a local aircraft. The Hercules is how people and cargo actually move. The Il-78 is how the sharp end stays airborne.',
    keyPoints: [
      'The C-130 Hercules is the turboprop tactical transport. Pakistan operates B, E and H variants, with an open count in the twenty plus range. Crew is typically four to six. Payload is about the 20 tonne class, depending on variant and range.',
      'The Il-78MP Midas is a four jet dual role tanker and transport. Open sources count four. Crew is about six. It can refuel fighters and haul freight, and Number 10 MRTT Squadron at Nur Khan flies it.',
      'The CN-235 is a twin turboprop medium utility. Open lists show a handful, often four, with a crew of about two or three. It carries less and goes less far than a C-130, and coverage in Pakistan has called it a limited, possible retirement type.',
      'The clean split is C-130 for tactical lift, Il-78 for tanking and strategic lift, CN-235 for light utility.',
    ],
    remember: 'C-130 for airlift. Four Il-78 tanker transports. CN-235 for light utility.',
    whyIssb: 'Air power is not only the jet in the photograph. Relief after a flood, a battalion that has to move, and a fighter that needs fuel at altitude all depend on this smaller, duller fleet. Ignore it and you have described a parade, not an air force.',
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
    teaser: 'About four hundred combat jets in the open sources. Anyone with an exact secret total is guessing.',
    summary:
      'There is no public sentence from the Pakistan Air Force that says the force owns exactly this many aircraft, and you should not invent one. Open directories, the IISS Military Balance, FlightGlobal\'s World Air Forces, and the Wikipedia aggregations that lean on them, give bands. The honest answer names the source, the year, and whether you mean fighters or everything with wings. Combat jets, in IISS Military Balance 2025 style tallies, sit on the order of about 400. A rough open split is JF-17 around 150 to 175, F-16 around 75, J-10CE in the twenty plus range, Mirage III and 5 together around 80, and F-7PG around 50. Deliveries and retirements move those numbers. Wider counts that sail past a thousand are usually mixing in trainers, helicopters that may belong to other services, and drones. Say so if you quote them. Transports in the same open snapshot are C-130s in the twenty plus range, four Il-78s, and a handful of CN-235s. Airborne early warning, the Saab 2000 Erieye, is often listed around nine. The line worth memorising, and worth defending when someone demands a spicier number, is this. Open sources put front line combat jets around four hundred. The exact total is not officially published.',
    keyPoints: [
      'IISS Military Balance 2025 style tallies put the fighter fleet on the order of about 400. Roughly, JF-17 around 150 to 175, F-16 around 75, J-10CE in the twenty plus range, Mirage III and 5 together around 80, and F-7PG around 50. The figures move.',
      'Counts above a thousand usually mix in trainers, helicopters, sometimes other services, and drones. Do not blend those into the fighter total without saying so.',
      'The transport snapshot is C-130s in the twenty plus range, four Il-78s, and a handful of CN-235s. Again, estimates.',
      'Saab 2000 Erieye early warning aircraft are often listed around nine in open sources.',
      'The safe line is that open sources put front line combat jets around four hundred, and that an exact number is not officially published.',
    ],
    remember: 'About 400 combat jets in the open source band. Name the year and the source. Never invent a classified total.',
    whyIssb: 'Size is how you judge whether a force can fight for more than an afternoon. A fake precise number sounds confident and collapses the moment someone asks where you read it. The band, with the source attached, is the number that survives contact with a follow up question.',
    sources: [
      { title: 'Wikipedia — List of active Pakistan Air Force aircraft', url: 'https://en.wikipedia.org/wiki/List_of_active_Pakistan_Air_Force_aircraft' },
      { title: 'IISS Military Balance (subscription reference — cite carefully)' },
    ],
  },
  {
    id: 'pakistan-air-defence',
    category: 'military',
    title: 'Pakistan air-defence systems',
    teaser: 'Not one magic missile. A stack, long, medium, short, and the soldier with a tube on his shoulder.',
    summary:
      'Pakistan\'s ground based air defence is a stack, spread across army and air force units, and the stack is the point. A single famous missile does not make a sky safe. At long range, open reporting describes the HQ-9 family. The army\'s HQ-9/P, in the HIMADS role, is talked about in the 125 kilometre class. The air force has disclosed the HQ-9BE, with a longer open envelope, in the 260 kilometre class against aircraft. In the middle sit the LY-80 and LY-80EV for the army, the export face of the HQ-16 family, talked about in a roughly 40 to 70 kilometre class, and the air force\'s HQ-16FE, described in open reporting as a stretched medium to long system. Close in, point defence is the Spada 2000 Plus, an Aspide system, around PAF bases, Crotale variants, and the army\'s FM-90. Below that are the MANPADS, the Pakistani Anza series, and other man portable names that show up in open lists, such as the RBS 70 and FN series, which you should verify before you get exotic. None of it sees by itself. Long range radars and the Erieye early warning aircraft build the air picture that cues both fighters and missiles. Battery counts are not fully public. Do not invent them. The side to take is the stack. Long, then medium, then short, then the shoulder fired weapon. Name three or four systems and stop.',
    keyPoints: [
      'Long range is the HQ-9 family. The army\'s HQ-9/P is described in open reporting in about the 125 kilometre class. The air force has disclosed the HQ-9BE, with an open envelope nearer 260 kilometres against aircraft.',
      'Medium range is the LY-80 and LY-80EV for the army, the HQ-16 export family, roughly a 40 to 70 kilometre class, and the air force HQ-16FE, described as an extended system.',
      'Short range and point defence include the Spada 2000 Plus, an Aspide system, for air force bases, Crotale variants, and the army\'s FM-90.',
      'MANPADS include the Pakistani Anza series, plus other portable systems in open lists such as the RBS 70 and FN series. Verify an exotic name before you repeat it.',
      'Radars and the Erieye early warning aircraft cue the fighters and the missiles. They are part of the defence, not a footnote.',
      'Describe the layers and name three or four systems. Do not invent battery numbers.',
    ],
    remember: 'HQ-9 at long range. LY-80 and HQ-16 in the middle. Spada, Crotale and FM-90 in close. Anza on the shoulder.',
    whyIssb: 'A modern air force that only talks about fighters has forgotten how raids are actually stopped. The layers are what give a defender more than one chance, from far outside a city to the last kilometre over a base. That is the difference between a single weapon and a defence.',
    sources: [
      { title: 'Quwa — Pakistan air defence overview', url: 'https://quwa.org/pakistan/air-defence-pk/' },
      { title: 'Wikipedia — List of equipment of the Pakistan Air Force', url: 'https://en.wikipedia.org/wiki/List_of_equipment_of_the_Pakistan_Air_Force' },
    ],
  },
  {
    id: 'recent-paf-military',
    category: 'military',
    title: 'Recent PAF & military activity',
    teaser: 'May 2025 was a real crisis with two narratives. Do not crown a winner the evidence has not settled.',
    summary:
      'Keep three files separate or they will contaminate each other. The first is modernisation. JF-17 Block III production, the induction of the J-10CE, and open reporting about interest in a future stealth type in the J-35 family, which is programme talk until an aircraft is actually in service. The second is the crisis of May 2025. After the Pahalgam attack in April 2025, India launched strikes it called Operation Sindoor on 6 and 7 May 2025. Pakistan reported a major air battle and claimed that several Indian Air Force jets were shot down. Open assessments have discussed beyond visual range engagements and Chinese origin weapons in Pakistani use. India and Pakistan do not agree on the details. Say both claims. The third file is defence diplomacy, the thicker ties with Saudi Arabia and Türkiye that the current affairs page dates properly. Domestic security operations continue to pull in more than one service, and you should quote only what you can source. The side to take is against the viral cut. A clip is not a battle damage assessment. Claimed is not the same word as confirmed. The person who can hold both versions without inventing a scoreline is the person who actually followed the week.',
    keyPoints: [
      'On 6 and 7 May 2025, after the Pahalgam attack in April 2025, India launched Operation Sindoor. Pakistan reported a major air battle and claimed that several Indian jets were downed. Open assessments discuss beyond visual range fighting and Chinese origin weapons. The two sides dispute the details, so state both claims.',
      'Modernisation is a separate thread. JF-17 Block III production, J-10CE induction, and reported interest in future stealth types such as the J-35 family. Treat the stealth talk as a programme, not as an aircraft in service.',
      'Defence diplomacy with Saudi Arabia and Türkiye is a third file. The dated version is on the current affairs page.',
      'Counter terror operations at home still involve the services jointly. Quote only what you can source.',
    ],
    remember: 'May 2025 is Operation Sindoor and Pakistan\'s response claims. Modernisation is JF-17 Block III and the J-10CE. Diplomacy is the Saudi and Türkiye file.',
    whyIssb: 'A crisis between two nuclear armed neighbours is not content. It is the kind of week that moves markets, closes airspace and gets people killed. Telling it properly means separating a force that is re arming, a battle both sides describe differently, and a diplomatic track that was already running.',
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
    teaser: 'February 2019. A captured pilot, a cup of tea, and a date people keep welding onto the wrong war.',
    summary:
      'On 27 February 2019, the day after the Balakot strikes, the crisis that Pakistan narrates as Operation Swift Retort put a MiG-21 Bison into Pakistani territory near the Line of Control. The pilot was Wing Commander Abhinandan Varthaman of the Indian Air Force. He ejected, he was captured, and in a custody video that travelled around the world he said Pakistani officers had looked after him, refused to discuss the mission with the line that he was not supposed to tell them, and, asked about the tea in his hand, said the tea is fantastic, thank you. He was handed back at Wagah on 1 March 2019, a goodwill and de escalation step announced by Pakistan\'s leadership. That is the whole episode, and it is a good one, because a captured pilot was treated as a person and sent home. It is also the episode people now staple onto May 2025, which is a different clash and did not produce this tea quote. If someone says the 6 May tea incident, correct them. The side to take is the date, and the conduct. Professional treatment of a prisoner, and the discipline not to blur two wars into one viral memory.',
    keyPoints: [
      'The date is 27 February 2019, not 6 May. It was the day after the Balakot related escalation, the episode Pakistan narrates as Operation Swift Retort.',
      'The pilot was then Wing Commander Abhinandan Varthaman of the Indian Air Force, flying a MiG-21 Bison. He ejected and was captured in Pakistani territory near the Line of Control.',
      'In the video he said the tea is fantastic, thank you, said he had been looked after, and refused mission details.',
      'He was handed back at Wagah on 1 March 2019 as a goodwill step.',
      'May 2025 was a different clash. It did not produce this quote. If someone merges the two, separate them.',
    ],
    remember: '27 February 2019. Abhinandan. A MiG-21. The tea is fantastic. Returned on 1 March 2019. Not May 2025.',
    whyIssb: 'How a captured pilot is treated is a test of a country in the hottest hour it has, and this hour was caught on camera. The line about the tea is famous because it is human. The duty, once it is famous, is to keep the year attached to it, so a 2019 homecoming is not recycled as proof of a 2025 battle.',
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
