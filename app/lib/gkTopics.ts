import type { GkCategory } from './generalKnowledge';

// General Knowledge topics for the study tab.
// Each summary is a spoken-style story in simple English, written to be read aloud.
// Facts re-checked against sources on 4 October 2026.

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
    title: `Indus Waters Treaty (1960)`,
    teaser: `6 rivers, a 1960 deal, and a 2026 court ruling that says the treaty still stands.`,
    summary: `Picture a farmer in Punjab in early spring. His wheat needs water, and that water comes down the Chenab from Kashmir. It reaches his canal because of a promise written in 1960.

In 1947 the new border cut through an old canal system. Rivers flowed from India into Pakistan, and both sides needed them. After 9 years of talks, the World Bank helped the 2 countries agree.

The Indus Waters Treaty was signed in Karachi on 19 September 1960. President Ayub Khan signed for Pakistan and Prime Minister Jawaharlal Nehru signed for India. The World Bank signed it too.

The treaty splits 6 rivers into 2 groups. The 3 eastern rivers, the Ravi, Beas and Sutlej, went to India. The 3 western rivers, the Indus, Jhelum and Chenab, went to Pakistan.

India may use some western river water for homes, limited farming and electricity. Its power plants there must follow strict design rules. The water should turn the turbines and then keep flowing to Pakistan.

Each country has an Indus Commissioner, and together they form the Permanent Indus Commission. Everyday questions go to this commission.

Technical differences go to a Neutral Expert, an engineer appointed through the World Bank. Serious disputes go to a Court of Arbitration, a panel of legal and technical experts.

On 22 April 2025, gunmen killed 26 people at Pahalgam in Indian-occupied Kashmir. India blamed Pakistan. Pakistan denied any role and offered to join a neutral inquiry.

The next day India said it would hold the treaty "in abeyance", which means on hold. Pakistan replied that the treaty has no rule that lets either side walk away alone.

Pakistan's National Security Committee gave a clear warning. Stopping or diverting Pakistan's water would be treated as an act of war.

Pakistan chose the path of law. On 8 August 2025, the Court of Arbitration set out the main rule.

India must "let flow" the western rivers for Pakistan's use. Exceptions for Indian dams must be read strictly.

On 15 May 2026, the court ruled again on how much water these plants may store. India stayed away from every hearing.

Then came the biggest decision. On 31 August 2026, all 5 members of the court agreed that the treaty "remains fully in force". They said India's abeyance is not allowed under the treaty or international law.

The court also limited work at Ratle, an Indian power project on the Chenab. India must not raise its dam wall and intake above set levels. This lasts until 90 days after the Neutral Expert's final decision, expected in 2027.

India rejected the ruling the same day and called the court illegal. It still shares some flood warnings, but through diplomats, not the Indus Commission. The commission itself has not met since May 2022.

For Pakistan this is not a far away legal fight. Our wheat, our cities and our power stations depend on the Indus system. Steady flows and data on time decide whether a sowing season succeeds.

Pakistan's path is calm and firm. Stay with the treaty, use its courts, and keep the door open for talks. A signed promise does not end because a neighbour is angry.`,
    keyPoints: [
      `Signed in Karachi on 19 September 1960 by Ayub Khan and Jawaharlal Nehru. The World Bank helped negotiate it and also signed it.`,
      `The eastern rivers, Ravi, Beas and Sutlej, are for India. The western rivers, Indus, Jhelum and Chenab, are for Pakistan.`,
      `On the western rivers India may build power plants only under strict design rules, and it must "let flow" the water to Pakistan.`,
      `Problems go to the Permanent Indus Commission, then a Neutral Expert, then a Court of Arbitration.`,
      `India declared the treaty "in abeyance" on 23 April 2025. On 31 August 2026 the Court of Arbitration ruled the treaty remains fully in force.`,
      `India rejects the court. The Neutral Expert's decision on the Kishenganga and Ratle designs is expected in 2027.`,
    ],
    remember: `1960, Karachi, World Bank. East for India, west for Pakistan. On 31 August 2026 the court said the treaty still stands.`,
    whyIssb: `The Indus system is the lifeline of Pakistan's farms, cities and power stations. The treaty protects that water by law, so Pakistan defends it in court as well as through diplomacy. Steady flows and shared data mean food on the table and lights at home.`,
    watch: [
      `The Neutral Expert's final decision on the Kishenganga and Ratle designs, expected in 2027.`,
      `Whether India respects the court's limits on concrete work at Ratle.`,
      `Whether the Permanent Indus Commission meets again and normal data sharing returns.`,
    ],
    sources: [
      { title: `UN Treaty Series: Indus Waters Treaty 1960 text`, url: `https://treaties.un.org/doc/Publication/UNTS/Volume%20419/volume-419-I-6032-English.pdf` },
      { title: `World Bank: Fact sheet on the Indus Waters Treaty and the role of the World Bank (2018, updated 2023)`, url: `https://www.worldbank.org/en/region/sar/brief/fact-sheet-the-indus-waters-treaty-1960-and-the-world-bank` },
      { title: `Radio Pakistan: Pakistan rejects Indian announcement to hold the treaty in abeyance (24 April 2025)`, url: `https://www.radio.gov.pk/24-04-2025/pakistan-rejects-indian-announcement-to-hold-indus-waters-treaty-in-abeyance` },
      { title: `Dawn: Govt hails Hague court's award saying India must 'let flow' waters (11 August 2025)`, url: `https://www.dawn.com/news/1930219` },
      { title: `LiveLaw: India's abeyance of the treaty impermissible, PCA (1 September 2026)`, url: `https://www.livelawbiz.com/arbitration/india-must-continue-to-honour-indus-waters-treaty-with-pakistan-cannot-keep-it-in-abeyance-permanent-court-of-arbitration-548103` },
      { title: `Reuters: India must uphold water-sharing treaty with Pakistan, court says (31 August 2026)`, url: `https://www.reuters.com/business/energy/india-must-uphold-water-sharing-treaty-with-pakistan-arbitration-court-says-2026-08-31/` },
      { title: `The Hindu: India rejects Hague court's Indus Waters Treaty ruling (31 August 2026)`, url: `https://www.thehindu.com/news/national/citing-lack-of-jurisdiction-india-rejects-hague-courts-indus-waters-treaty-ruling/article71411927.ece` },
    ],
  },
  {
    id: 'geography-pakistan',
    category: 'geography',
    title: `Geography of Pakistan`,
    teaser: `Mountains in the north, the Indus in the middle, deserts and a sea coast in the south.`,
    summary: `Imagine flying from Karachi to Gilgit on a clear morning. You leave a hot coast, cross green farms and brown deserts, and land among snowy peaks. That single flight shows most of Pakistan.

Pakistan lies in South Asia. Iran is to the west and Afghanistan to the north west. China touches the north east, and India lies to the east and south east.

A thin strip of Afghanistan, the Wakhan Corridor, keeps Pakistan apart from Tajikistan. It was drawn in the 1890s as a buffer, a gap between the British and Russian empires.

The south faces the Arabian Sea. The coast runs for about 1,000 kilometres, from Sindh to the Makran coast of Balochistan.

The north is a wall of mountains. The Himalaya, the Karakoram and the Hindu Kush all rise here. K2, the second highest peak on Earth at 8,611 metres, stands on the border with China.

Snow and glaciers in these mountains feed the Indus. The river is about 3,200 kilometres long. The Kabul joins it near Attock, and the Jhelum, Chenab, Ravi and Sutlej all end up in it.

Most Pakistanis live on the plains of the Indus and its rivers. Canals carry this water across Punjab and Sindh. Punjab is the most crowded province of all.

Away from the rivers, the land turns dry. The Thar Desert lies in Sindh, Cholistan in Bahawalpur, and the Thal between the Indus and the Jhelum. The Balochistan plateau fills the south west, with the Kharan Desert inside it.

Balochistan alone covers about 44 percent of Pakistan's area. Punjab, much smaller, holds more than half of the people. The 2023 census counted about 241 million Pakistanis.

Islamabad, at the foot of the northern hills, is the capital. Karachi, on the coast, is the largest city and the main port.

The climate is mostly hot and dry, with very cold winters in the far north. The summer monsoon, from about late June to September, brings most of the rain.

That rain can turn deadly. In 2022 floods put a third of the country under water and killed more than 1,700 people. In 2025 the monsoon killed 1,037 people, and Punjab saw its worst floods in 40 years.

Geography explains many of our choices. The northern mountains guard us and also store our water. A single coast carries our trade, and the rivers decide our harvests.

Know this map well, and you understand why Pakistan guards its rivers, its passes and its sea.`,
    keyPoints: [
      `Iran is to the west, Afghanistan to the north west, China to the north east and India to the east.`,
      `The Wakhan Corridor of Afghanistan separates Pakistan from Tajikistan.`,
      `K2, at 8,611 m, is the highest point. The Arabian Sea coast is about 1,000 km long.`,
      `The Indus, about 3,200 km long, is the main river, and most people live on its plains.`,
      `Balochistan is about 44 percent of the land. Punjab holds more than half of the 241 million people counted in 2023.`,
      `The monsoon brings most of the rain. The 2022 floods covered a third of the country.`,
    ],
    remember: `Mountains north, Indus in the middle, sea south. Iran west, Afghanistan north west, China north east, India east.`,
    whyIssb: `Pakistan's land shapes both its food and its defence. The northern mountains hold the snow that feeds the Indus, and the Indus feeds most of the people. A single coast and a few mountain passes carry almost all of the country's trade.`,
    sources: [
      { title: `Pakistan Bureau of Statistics: 7th Population and Housing Census results (5 August 2023)`, url: `https://www.pbs.gov.pk/wp-content/uploads/2024/02/Press-Release.pdf` },
      { title: `Britannica: Pakistan`, url: `https://www.britannica.com/place/Pakistan` },
      { title: `Britannica: Durand Line and the Wakhan Corridor`, url: `https://www.britannica.com/event/Durand-Line` },
      { title: `Britannica: Indus River`, url: `https://www.britannica.com/place/Indus-River` },
      { title: `Planning Commission: Pakistan Floods 2022 Post-Disaster Needs Assessment`, url: `https://www.pc.gov.pk/uploads/downloads/PDNA-2022.pdf` },
      { title: `NDMA: Monsoon 2025 report (November 2025)`, url: `https://www.ndma.gov.pk/storage/publications/November2025/FweqUWhEX19cob8DvM4L.pdf` },
    ],
  },
  {
    id: 'provinces-territories',
    category: 'pakistan',
    title: `Provinces & territories`,
    teaser: `4 provinces, a federal capital, and 2 northern territories tied to the Kashmir question.`,
    summary: `Look at a map of Pakistan and you see 4 large shapes. Each is a province with its own assembly, chief minister and capital. Around them sit a federal capital and 2 special territories in the north.

Punjab, with Lahore as its capital, has the most people. The 2023 census counted about 128 million there, more than half of Pakistan. It is also the most crowded province.

Sindh, capital Karachi, holds the main ports and the biggest city. About 56 million people live there. The Indus meets the sea through the Sindh delta.

Khyber Pakhtunkhwa, capital Peshawar, used to be called the North West Frontier Province. The 18th Amendment to the Constitution gave it its new name in April 2010.

In May 2018 the 25th Amendment merged the old tribal areas, known as FATA, into Khyber Pakhtunkhwa. President Mamnoon Hussain signed it on 31 May 2018. The tribal people got the same constitutional rights as every other citizen.

FATA had 7 agencies, Bajaur, Mohmand, Khyber, Kurram, Orakzai, North Waziristan and South Waziristan. They became districts of the province. In 2022 South Waziristan was split into Upper and Lower districts.

Khyber Pakhtunkhwa now has about 41 million people. It borders Afghanistan.

Balochistan, capital Quetta, is the largest province. It covers about 44 percent of Pakistan's land but has only about 15 million people. Gwadar and its port sit on its Makran coast.

Islamabad Capital Territory belongs to no province. It is the federal capital and had about 2.4 million people in 2023.

In the north are Azad Jammu and Kashmir, capital Muzaffarabad, and Gilgit Baltistan, capital Gilgit. They are not provinces. Each has its own elected assembly and government.

Both are part of the wider Kashmir dispute. Pakistan's position is clear.

The people of Jammu and Kashmir must decide their future in a free vote, called a plebiscite. UN resolutions of 1948 and 1949 called for that vote.

Both held elections in 2026. Gilgit Baltistan voted on 7 June, and Azad Jammu and Kashmir voted in phases from 27 July.

In September 2026 the government said Parliament would debate creating new provinces. By late September no bill had been presented.

The Constitution sets a high bar for this. Changing a province's borders needs a 2/3 majority in Parliament and in that province's own assembly.

This map is not just a list of names. A province runs schools, hospitals and police, so its borders shape daily life. Pakistan stays strong when every province feels heard.`,
    keyPoints: [
      `The 4 provinces are Punjab (Lahore), Sindh (Karachi), Khyber Pakhtunkhwa (Peshawar) and Balochistan (Quetta).`,
      `Islamabad Capital Territory is the federal capital and not part of any province.`,
      `The 18th Amendment renamed NWFP as Khyber Pakhtunkhwa in April 2010.`,
      `The 25th Amendment, signed on 31 May 2018, merged the 7 FATA agencies into Khyber Pakhtunkhwa as districts.`,
      `Balochistan has about 44 percent of the land. Punjab has about 128 million of the 241 million people counted in 2023.`,
      `AJK (capital Muzaffarabad) and Gilgit Baltistan (capital Gilgit) have their own assemblies and are part of the Kashmir dispute.`,
    ],
    remember: `Lahore, Karachi, Peshawar, Quetta. FATA joined KP in 2018. AJK and GB are not provinces.`,
    whyIssb: `Provinces run much of daily life, from schools to police, so their borders matter to every citizen. The FATA merger gave the tribal districts the same rights as the rest of Pakistan. Any new province has to come through the Constitution and the consent of the people affected.`,
    watch: [
      `The parliamentary debate on creating new provinces, expected from October 2026.`,
      `Delayed polling in 7 AJK constituencies in Poonch and Sudhnoti.`,
    ],
    sources: [
      { title: `Pakistan Bureau of Statistics: 2023 census results by province`, url: `https://www.pbs.gov.pk/wp-content/uploads/2024/02/Press-Release.pdf` },
      { title: `BBC: Pakistan constitutional reforms signed into law, NWFP renamed (19 April 2010)`, url: `http://news.bbc.co.uk/2/hi/south_asia/8630180.stm` },
      { title: `Dawn: President signs KP-Fata merger bill into law (31 May 2018)`, url: `https://www.dawn.com/news/1411156` },
      { title: `Arab News: Iftikhar Gilani elected AJK prime minister (28 August 2026)`, url: `https://www.arabnews.pk/pakistan/pakistan-ruling-partys-iftikhar-gilani-elected-azad-kashmirs-prime-minister-2656134` },
      { title: `Ministry of Foreign Affairs: UNCIP resolution of 5 January 1949 (plebiscite)`, url: `https://www.mofa.gov.pk/storage/files/1/654279df41c15.pdf` },
    ],
  },
  {
    id: 'rivers-dams',
    category: 'geography',
    title: `Rivers, dams & hydropower`,
    teaser: `Tarbela is the giant, Mangla now holds the most water, and 3 new dams are rising.`,
    summary: `In winter the Indus runs low. In the monsoon it can flood whole districts. Dams catch the summer water and give it back when farms need it.

The Indus is the main river, about 3,200 kilometres long. It rises in Tibet and flows through Gilgit Baltistan and Khyber Pakhtunkhwa into Punjab and Sindh. The Kabul River from Afghanistan joins it near Attock.

The Jhelum and Chenab enter from Indian-occupied Kashmir, and the Ravi and Sutlej come from India. In the end, all of them flow into the Indus.

Tarbela Dam stands on the Indus between Haripur and Swabi in Khyber Pakhtunkhwa. It was built from 1968 to 1976. It is the largest earth and rock fill dam in the world by volume.

Tarbela also has the most hydropower capacity in Pakistan, 4,888 megawatts. A 5th extension of 1,530 megawatts is being built, and its first unit should run in 2027.

Mangla Dam stands on the Jhelum in Mirpur, Azad Jammu and Kashmir. It was finished in 1967. A project completed in 2009 raised it by 30 feet.

After that raising, the water and power authority WAPDA calls Mangla the biggest water reservoir in Pakistan. Tarbela is the bigger dam, but Mangla now holds more usable water. Its power station is being upgraded from 1,000 to 1,310 megawatts by 2030.

Smaller dams have their own jobs. Warsak is on the Kabul River, about 30 kilometres from Peshawar. It was built with Canadian help and first made power in 1960.

Khanpur, on the Haro River, supplies water to Islamabad and Rawalpindi. Hub Dam, on the Hub River at the Sindh and Balochistan border, sends water to Karachi.

Ghazi Barotha, below Tarbela, can make 1,450 megawatts without a big lake. Its water runs through a long canal to the power house and back into the Indus.

Now 3 big projects will add storage and power. Diamer Bhasha, on the Indus near Chilas, will be a 272 metre high dam with 4,500 megawatts. WAPDA now plans to complete it in 2030.

Mohmand Dam, on the Swat River in Mohmand district, should start making 800 megawatts by early 2028. It will also send drinking water to Peshawar and reduce floods in Charsadda and Nowshera.

Dasu, on the Indus in Upper Kohistan, is building its first 2,160 megawatts with World Bank support. Its first power is expected around 2028.

These projects are slow and costly, and auditors have warned about delays at Diamer Bhasha. But every new reservoir gives Pakistan more control over its own water.

A river we cannot store is a river we cannot fully use. For a country at the lower end of its rivers, dams are part of national security.`,
    keyPoints: [
      `The Indus, about 3,200 km long, is the main river. The Kabul joins it near Attock.`,
      `Tarbela, on the Indus between Haripur and Swabi, was finished in 1976. It is the world's largest earth and rock fill dam by volume and has 4,888 MW.`,
      `Mangla, on the Jhelum in Mirpur AJK, was finished in 1967 and raised in 2009. WAPDA calls it Pakistan's biggest water reservoir.`,
      `Warsak is on the Kabul near Peshawar. Khanpur is on the Haro and serves Islamabad and Rawalpindi. Hub Dam serves Karachi.`,
      `Ghazi Barotha is a 1,450 MW run of river plant below Tarbela.`,
      `Being built now are Diamer Bhasha (4,500 MW, target 2030), Mohmand (800 MW, early 2028), Dasu stage 1 (2,160 MW, about 2028) and Tarbela's 5th extension (1,530 MW, 2027).`,
    ],
    remember: `Tarbela is the biggest dam. Mangla holds the most water. Warsak on the Kabul, Khanpur on the Haro, Hub for Karachi.`,
    whyIssb: `Pakistan gets most of its river water in a few summer months but needs it all year. Dams store that water for winter crops and make cheap, clean electricity. As a downstream country, Pakistan is safer when it has more storage of its own.`,
    watch: [
      `First power from Tarbela's 5th extension, planned for 2027.`,
      `First power from Mohmand Dam, planned for early 2028.`,
      `Progress on the Diamer Bhasha main dam after the audit warnings.`,
    ],
    sources: [
      { title: `Britannica: Tarbela Dam`, url: `https://www.britannica.com/topic/Tarbela-Dam` },
      { title: `WAPDA: Tarbela 5th Extension, generation from April 2027 (20 January 2026)`, url: `https://wapda.gov.pk/tarbela-5th-extension-56-complete-generation-to-commence-in-april-2027/` },
      { title: `WAPDA: Mangla Dam filled to maximum, the biggest water reservoir`, url: `https://wapda.gov.pk/mangla-dam-filled-to-maximum-reservoir-attains-1242-feet-level/` },
      { title: `WAPDA: Diamer Basha Dam Project`, url: `https://wapda.gov.pk/diamer-basha-dam-project/` },
      { title: `WAPDA: Mohmand Dam to start generation by early 2028 (19 January 2026)`, url: `https://wapda.gov.pk/construction-continues-on-10-key-sites-mohmand-dam-to-start-generation-by-early-2028/` },
      { title: `The Nation: AGP highlights Diamer Bhasha planning gaps and delays (30 June 2026)`, url: `https://www.nation.com.pk/30-Jun-2026/diamer-bhasha-dam-agp-highlights-planning-gaps-irregularities-award-contracts-recommends-probe` },
    ],
  },
  {
    id: 'borders-neighbours',
    category: 'geography',
    title: `Borders & neighbours`,
    teaser: `4 land neighbours, a long coast, and in 2026 several crossings tense or shut.`,
    summary: `Stand in Islamabad and turn slowly. Every direction points to a different neighbour. Each border has its own history and its own trouble.

To the east is India. In the south the border reaches Sir Creek on the coast, where the sea line is still disputed.

Near Sialkot runs the Working Boundary. Pakistan uses that name because Jammu, across it, is part of the Kashmir dispute.

In Kashmir there is no agreed border at all. The Line of Control began as a ceasefire line in 1949. The Simla Agreement of 1972 gave it its name, and both sides kept their legal positions.

Pakistan's position is clear. The people of Jammu and Kashmir should decide their future in a free vote, as UN resolutions call for.

Since April 2025 the Wagah crossing has been shut and trade with India has stopped. The ceasefire of May 2025 has held, but little else has returned.

India has kept the Kartarpur Corridor for Sikh pilgrims suspended since 7 May 2025. Pakistan keeps its side open.

Pakistan says Indian border guards killed 2 unarmed Pakistani civilians near Kasur on 2 October 2026. It protested and asked for a fair investigation.

To the west and north west is Afghanistan. The Durand Line, drawn in 1893, runs about 2,600 kilometres. Pakistan treats it as the international border, but Afghan governments have never formally accepted it.

Pakistan says the banned Tehreek-e-Taliban Pakistan, or TTP, attacks Pakistan from Afghan soil. Deadly clashes broke out in October 2025 and again in February and March 2026.

In mid October 2025 Pakistan shut the Afghan crossings to trade. On 4 October 2026 Torkham, Chaman, Ghulam Khan, Kharlachi and Angoor Adda were all still closed to trade. It is the longest closure ever.

To the south west is Iran. Taftan is the main land crossing, and Gabd lies near Gwadar on the coast.

War hit Iran in 2026. More than 34,000 people crossed into Pakistan at Taftan between March and mid July.

In April 2026 Pakistan also opened 6 transit roads to the Iran border. They include an 87 kilometre road from Gwadar to Gabd.

To the north east is China. The Khunjerab Pass, 4,693 metres high, carries the Karakoram Highway into Xinjiang. Since December 2024 it stays open all year, and Central Asian trucks now use it too.

To the south is the Arabian Sea, with Karachi, Port Qasim and Gwadar on the coast.

Each border asks something different of Pakistan. It needs patience on the Line of Control and firmness against the TTP. A strong country guards its borders and still keeps its gates ready to open.`,
    keyPoints: [
      `India lies east. The Line of Control in Kashmir began as the 1949 ceasefire line and was named in the 1972 Simla Agreement. It is not a settled border.`,
      `Wagah has been shut since April 2025, but the May 2025 ceasefire has held.`,
      `Afghanistan lies west and north west along the Durand Line of 1893, about 2,600 km long.`,
      `All 5 main Afghan crossings, including Torkham and Chaman, have been shut to trade since October 2025.`,
      `Iran lies south west. Taftan is the main crossing and Gabd is near Gwadar.`,
      `China lies north east across the Khunjerab Pass, 4,693 m, which has been open all year since December 2024.`,
    ],
    remember: `India east, Afghanistan west, Iran south west, China north east, sea south. The LoC is a ceasefire line, not a border.`,
    whyIssb: `Borders decide where trade, fuel, families and threats cross. In 2026 the Afghan crossings are shut and the Iran border is busy because of the war next door. Knowing each border's status helps Pakistan protect its people and keep trade moving.`,
    watch: [
      `Whether Torkham and Chaman reopen for trade.`,
      `Calm on the Line of Control and the Punjab border after the 2 October 2026 shooting.`,
      `Movement at Taftan while the war around Iran continues.`,
    ],
    sources: [
      { title: `UN Peacemaker: Karachi Agreement establishing the ceasefire line (27 July 1949)`, url: `https://peacemaker.un.org/en/node/9225` },
      { title: `Simla Agreement text (2 July 1972)`, url: `https://www.commonlii.org/in/other/treaties/INTSer/1972/16.html` },
      { title: `BBC: One year after India-Pakistan conflict, ceasefire holds but little else does (7 May 2026)`, url: `https://www.bbc.com/news/articles/c4g4093dy39o` },
      { title: `Dawn: Pakistan summons Indian envoy over killing of 2 civilians (3 October 2026)`, url: `https://www.dawn.com/news/2034466` },
      { title: `RFE/RL: One year of the Afghan-Pakistan border closure (4 October 2026)`, url: `https://www.rferl.org/a/afghanistan-pakistan-border-closure-year-taliban/33868985.html` },
      { title: `Pakistan Today: Year-round opening of Khunjerab Pass (27 March 2025)`, url: `https://www.pakistantoday.com.pk/2025/03/27/year-round-opening-of-khunjerab-pass-fuels-record-pak-china-trade` },
    ],
  },
  {
    id: 'khyber-pass',
    category: 'geography',
    title: `Khyber Pass`,
    teaser: `The 53 km gorge linking Peshawar and Kabul, shut to trade since October 2025.`,
    summary: `Take a 10 rupee note and turn it over. The picture on the back is the Khyber Pass, near Peshawar. Few places in Pakistan hold so much history in so little space.

The pass lies in Khyber District of Khyber Pakhtunkhwa. It cuts through the last hills of the Spin Ghar range. Spin Ghar means White Mountains in Pashto.

The road starts near Jamrud, just west of Peshawar. It climbs past Ali Masjid fort to Landi Kotal, then drops to Torkham on the Afghan border. From there it runs on to Jalalabad and Kabul.

The pass is about 53 kilometres long. Landi Kotal, at about 1,072 metres, is its highest point and a busy market town. Near Ali Masjid the gorge narrows to about 180 metres.

For centuries traders and armies used this gap between Central Asia and the subcontinent. It is still the main road between Peshawar and Kabul.

The British built a railway through it in the 1920s, with 34 tunnels and 92 bridges and culverts. Culverts are small tunnels that let water pass under a track. Floods from 2006 onward damaged the line, and it is now closed.

After 2001 the pass carried supplies for NATO forces in Afghanistan. In 2011 Pakistani routes carried nearly half of NATO's land shipments.

That year a NATO attack on the Salala post killed 24 Pakistani soldiers. Pakistan closed the routes and reopened them only in July 2012, after a US apology.

Today Torkham is quiet. After deadly clashes, Pakistan shut its Afghan crossings to trade on 12 October 2025. On 4 October 2026 Torkham was still closed to trade.

Pakistan's reason is security. It wants the Afghan Taliban to stop the banned TTP from using Afghan soil to attack Pakistan.

The closure hurts ordinary people too. In September 2026 the Khyber Chamber of Commerce put the losses at about 2.5 billion dollars. A Landi Kotal worker said he now travels nearly 200 kilometres to Rawalpindi to find work.

A new 4 lane expressway from Peshawar to Torkham is planned. The World Bank loan for it was signed in December 2019.

By July 2026 the project was still at the stage of choosing contractors. Completion is now planned for May 2029.

The Khyber teaches a simple lesson. A gate brings trade only when it is safe. Pakistan wants both a secure border and a busy road.`,
    keyPoints: [
      `The Khyber Pass is in Khyber District, Khyber Pakhtunkhwa, in the Spin Ghar or White Mountains.`,
      `The route runs Peshawar, Jamrud, Ali Masjid, Landi Kotal, Torkham, then on to Jalalabad and Kabul.`,
      `It is about 53 km long. Landi Kotal, about 1,072 m, is the highest point.`,
      `The Khyber railway of the 1920s had 34 tunnels. It is now closed.`,
      `In 2011 Pakistani routes carried nearly half of NATO's land supplies to Afghanistan.`,
      `Torkham has been shut to trade since 12 October 2025. The World Bank funded Peshawar to Torkham expressway is due by May 2029.`,
    ],
    remember: `Khyber means Peshawar, Landi Kotal, Torkham, Kabul. It is on the back of the 10 rupee note.`,
    whyIssb: `The Khyber is Pakistan's main road to Afghanistan and onward to Central Asia. When it is open, trade and jobs flow through Peshawar and Landi Kotal. When it closes for security, families on both sides feel it at once.`,
    watch: [
      `Whether Torkham reopens for trade, and on what security terms.`,
      `The start of construction on the Peshawar to Torkham expressway.`,
    ],
    sources: [
      { title: `Britannica: Khyber Pass`, url: `https://www.britannica.com/place/Khyber-Pass` },
      { title: `State Bank of Pakistan: Rs 10 banknote`, url: `https://www.sbp.org.pk/BANKNOTES/10Note.htm` },
      { title: `BBC: Pakistan to reopen supply lines to Nato (3 July 2012)`, url: `https://www.bbc.com/news/world-asia-18691691` },
      { title: `RFE/RL: One year of the Afghan-Pakistan border closure (4 October 2026)`, url: `https://www.rferl.org/a/afghanistan-pakistan-border-closure-year-taliban/33868985.html` },
      { title: `Dawn: Reopening of Torkham border demanded (4 September 2026)`, url: `https://www.dawn.com/news/2027305` },
    ],
  },
  {
    id: 'strategic-passes',
    category: 'military',
    title: `Strategic mountain passes`,
    teaser: `Khyber and Khojak face Afghanistan, Bolan opens Quetta, Khunjerab faces China, and Lowari serves Chitral.`,
    summary: `A mountain pass is a low gap where people can cross a range. Pakistan's north and west are walls of mountains. So a few gaps decide where armies, trucks and trains can go.

The Khyber Pass in Khyber Pakhtunkhwa links Peshawar with Kabul through Torkham. It is about 53 kilometres long, and its highest point is Landi Kotal. In 2011 nearly half of NATO's land supplies for Afghanistan moved on Pakistani routes like this.

Far to the south, the Bolan Pass in Balochistan links the plains at Sibi with Quetta. Sibi sits at its southern mouth. A road and a railway climb through it, with many tunnels and bridges.

Beyond Quetta, the Khojak Pass crosses the Khwaja Amran range to Chaman on the Afghan border. Under it runs the Khojak railway tunnel, about 3.9 kilometres long, opened in 1891.

Together, Bolan and Khojak form the southern road to Kandahar. In 1839 a British force called the Army of the Indus marched through both passes and took Kandahar.

The Bolan is still a security test. On 11 March 2025 terrorists blew up the track there and seized the Jaffar Express. Security forces killed all 33 attackers, but 21 passengers and 4 Frontier Corps men were martyred.

In the far north, the Khunjerab Pass links Gilgit Baltistan with Xinjiang in China. At 4,693 metres it is the highest paved international border crossing in the world. The Karakoram Highway climbs to it from Sost.

Snow once closed it from December to March. Since 1 December 2024 it stays open all year. In April 2026 the first Kyrgyz truck reached Sost through China.

The Lowari Pass is different, because it does not lead abroad. It joins Upper Dir with Chitral inside Khyber Pakhtunkhwa, high in the Hindu Kush.

The high pass was not an all weather road. The 8.5 kilometre Lowari Tunnel, inaugurated on 20 July 2017, gave Chitral an all weather link.

Since October 2025 the crossings at Torkham and Chaman have been shut to trade. That has made the Khunjerab route to China and Central Asia more important.

Every pass pairs a place with a purpose. Khyber and Khojak face Afghanistan, Khunjerab faces China, and Bolan and Lowari join Pakistan together from inside. Keeping these gaps safe is part of defending the country.`,
    keyPoints: [
      `The Khyber Pass in Khyber Pakhtunkhwa links Peshawar with Kabul through Torkham.`,
      `The Bolan Pass in Balochistan links Sibi with Quetta by road and rail. The Jaffar Express was hijacked there on 11 March 2025.`,
      `The Khojak Pass links Quetta with Chaman. Its railway tunnel opened in 1891.`,
      `The Khunjerab Pass, 4,693 m, links Gilgit Baltistan with Xinjiang and has been open all year since 1 December 2024.`,
      `The Lowari Pass links Upper Dir and Chitral inside Khyber Pakhtunkhwa. The 8.5 km Lowari Tunnel opened on 20 July 2017.`,
      `In 1839 the British Army of the Indus went through the Bolan and Khojak to take Kandahar.`,
    ],
    remember: `Afghanistan means Khyber and Khojak. China means Khunjerab. Inside Pakistan, Bolan and Lowari.`,
    whyIssb: `Passes are the few places where roads, railways and armies can cross Pakistan's mountains. Keeping them safe keeps trade and supply lines alive. In 2026, with the Afghan crossings shut, the Khunjerab route to China and Central Asia has become more important.`,
    watch: [`Reopening of the Torkham and Chaman crossings.`, `Growth of Central Asian trade through Khunjerab and Sost.`],
    sources: [
      { title: `Britannica: Khyber Pass`, url: `https://www.britannica.com/place/Khyber-Pass` },
      { title: `IRFCA: Khojak Tunnel (Khwaja Amran, 1891)`, url: `https://irfca.org/articles/khojak-tunnel.html` },
      { title: `National Army Museum: First Afghan War`, url: `https://www.nam.ac.uk/explore/first-afghan-war` },
      { title: `Dawn: Balochistan standoff ends after all Jaffar Express hostages rescued (13 March 2025)`, url: `https://pass.dawn.com/news/1897595` },
      { title: `The Nation: First Kyrgyz truck reaches Pakistan via China (26 April 2026)`, url: `https://www.nation.com.pk/26-Apr-2026/first-kyrgyz-truck-reaches-pakistan-via-china-qtta-framework` },
      { title: `Dawn: Lowari tunnel inaugurated (20 July 2017)`, url: `https://www.dawn.com/news/1346488` },
    ],
  },
  {
    id: 'cpec',
    category: 'pakistan',
    title: `CPEC (China Pakistan Economic Corridor)`,
    teaser: `Roads and power came first. Now Pakistan and China are trying to build factories and jobs.`,
    summary: `In 2013 Pakistan faced power cuts of 14 to 16 hours a day, says Planning Minister Ahsan Iqbal. CPEC began largely as an answer to that crisis.

CPEC stands for China Pakistan Economic Corridor. It is the flagship project of China's Belt and Road plan. It links Kashgar in western China with Gwadar on the Arabian Sea.

Work began after the Chinese premier visited Pakistan in 2013. On 20 April 2015 President Xi Jinping came to Islamabad. The 2 sides signed 51 agreements worth about 46 billion dollars.

The first phase built power plants, roads and port works. Official figures say it added about 8,000 megawatts of electricity and over 200,000 jobs.

Projects included coal plants at Sahiwal, Port Qasim and Thar, and the Karot hydropower plant. Roads included the Multan Sukkur motorway and the Hazara Expressway.

On 26 September 2025 the 14th Joint Cooperation Committee, the top body that steers CPEC, met in Beijing. It formally launched Phase 2.

Phase 2 has 5 corridors, for growth, innovation, green development, livelihood and regional connectivity. It is about factories, farming, minerals, technology and skills.

The plan named 9 special economic zones, which are industrial areas with special benefits for investors. By 2025 only 4 had moved beyond planning. They are Rashakai, Allama Iqbal Industrial City in Faisalabad, Dhabeji and Bostan.

Targets were missed. The zones were meant to draw 8 billion dollars and 500,000 jobs between 2018 and 2024. In September 2026 Rashakai had 22 enterprises in progress and nearly 3,000 workers.

The biggest waiting project is ML-1, the 1,726 kilometre railway from Karachi to Peshawar. China did not offer a cheap loan for it.

So Pakistan turned to the Asian Development Bank. Work on the first section, Karachi to Rohri, is targeted for January 2027.

There are real problems too. By June 2026 Pakistan owed about 423 billion rupees to CPEC power plants. Attacks killed 20 Chinese citizens in Pakistan between 2021 and 2024.

In January 2026 Pakistan announced a special unit only for protecting Chinese nationals. In a joint statement on 26 May 2026, both countries promised more industrial parks. They also agreed to grow Gwadar into a regional hub and keep Chinese workers safe.

CPEC already lit homes and built roads. The next test is harder. Pakistan must turn those roads into factories, exports and jobs for its young people.`,
    keyPoints: [
      `CPEC links Kashgar in China to Gwadar and is the flagship of China's Belt and Road.`,
      `It was launched in Islamabad on 20 April 2015 during Xi Jinping's visit, with 51 agreements worth about 46 billion dollars.`,
      `Phase 1 added about 8,000 MW of power and over 200,000 jobs, officials say.`,
      `Phase 2 was formally launched at the 14th JCC in Beijing on 26 September 2025, with 5 corridors.`,
      `The 4 SEZs that moved ahead are Rashakai, Allama Iqbal Industrial City, Dhabeji and Bostan.`,
      `ML-1, the 1,726 km Karachi to Peshawar railway, is now planned with ADB financing, starting with Karachi to Rohri.`,
    ],
    remember: `Phase 1 was power and roads. Phase 2 is factories, farms and skills. ML-1 is the big project still waiting.`,
    whyIssb: `CPEC brought electricity when Pakistan badly needed it and built roads that still carry trade. Its second phase will decide whether Pakistan makes and exports more goods. Paying bills on time and keeping workers safe will decide whether investors stay.`,
    watch: [
      `The 15th Joint Cooperation Committee meeting, still being prepared in August 2026.`,
      `ADB approval and the start of ML-1 work on Karachi to Rohri, targeted for January 2027.`,
      `A financing deal for the Karakoram Highway realignment between Thakot and Raikot.`,
    ],
    sources: [
      { title: `Reuters: China and Pakistan launch economic corridor plan worth $46 billion (20 April 2015)`, url: `https://www.reuters.com/article/world/china-and-pakistan-launch-economic-corridor-plan-worth-46-billion-idUSKBN0NA12T/` },
      { title: `PIDE: A Decade of CPEC, lessons, challenges and the road ahead (2025)`, url: `https://pide.org.pk/research/a-decade-of-cpec-lessons-challenges-and-the-road-ahead/` },
      { title: `Ministry of Planning: CPEC enters new era as 14th JCC concludes (26 September 2025)`, url: `https://pc.gov.pk/web/press/get_press/1635` },
      { title: `Dawn: Pakistan misses $8bn SEZ investment and 500,000-job targets (5 May 2026)`, url: `https://www.dawn.com/news/1997769` },
      { title: `Dawn: Work on $2.5bn ML-1 to begin in January (August 2026)`, url: `https://www.dawn.com/news/2023146` },
      { title: `MOFA: Joint statement between China and Pakistan (26 May 2026)`, url: `https://mofa.gov.pk/press-releases/joint-statement-between-the-peoples-republic-of-china-and-the-islamic-republic-of-pakistan-may-26-2026` },
    ],
  },
  {
    id: 'gwadar',
    category: 'pakistan',
    title: `Gwadar Port`,
    teaser: `A fishing town Pakistan got from Oman in 1958, now CPEC's port on the Arabian Sea.`,
    summary: `Gwadar sits on a hammerhead shaped peninsula on the Makran coast of Balochistan. Its Balochi name is said to mean gateway of winds. Not long ago it was a small fishing town.

For 175 years Gwadar belonged to the Sultan of Muscat and Oman. After years of talks, Prime Minister Feroz Khan Noon closed the deal. Oman handed Gwadar to Pakistan on 8 September 1958.

The modern port opened on 20 March 2007. China paid most of its first cost of 248 million dollars. It has 3 multipurpose berths, the places where ships tie up to load and unload.

Since 2013 a Chinese state company, China Overseas Port Holding Company, has run the port. Under CPEC, Gwadar is the southern end of the corridor from Kashgar.

On 14 October 2024 the New Gwadar International Airport was inaugurated. China paid for it with a 230 million dollar grant. It covers about 4,300 acres, the largest airport in Pakistan by area.

The first commercial flight, PIA's PK 503 from Karachi, landed on 20 January 2025 with 46 passengers. Traffic is still thin. A new airline, South Air, began regular flights in July 2026.

Life in the town is not easy. In 2025, after a long dry spell, Gwadar's main dams went dry. A Chinese funded desalination plant, which turns sea water into drinking water, helped supply the old town.

In 2026 the port saw more business. On 24 May it handled a ship carrying about 53,000 tonnes of steel. The steel was for transshipment, which means moving cargo on to other places.

New transit roads from Gwadar to Gabd on the Iran border opened under an April 2026 order. The port's Chinese operator says the trouble at Hormuz has made Gwadar more valuable.

Still, Gwadar is small next to Karachi. In 2023 to 2024 its share of cargo at the 3 main ports was well under 1 percent.

Karachi Port alone handled about 54 million tonnes in 2024 to 2025. Karachi Port and Port Qasim carry almost all of Pakistan's sea trade.

Security is another test. Armed separatist groups have attacked projects and security forces in Balochistan. The town also needs steady water and electricity.

Gwadar will succeed only if its own people gain first. A port that brings jobs, water and safety to Balochistan will make the whole country stronger.`,
    keyPoints: [
      `Gwadar is on the Makran coast of Balochistan. Oman handed it to Pakistan on 8 September 1958.`,
      `The port opened on 20 March 2007, and a Chinese state company, COPHC, has run it since 2013.`,
      `New Gwadar International Airport was inaugurated on 14 October 2024 with a 230 million dollar Chinese grant. The first commercial flight landed on 20 January 2025.`,
      `Gwadar faced a severe water shortage in 2025. A Chinese funded desalination plant helps supply the old town.`,
      `In 2026 new transit roads to Gabd on the Iran border opened, and bigger cargo ships began calling.`,
      `Karachi Port and Port Qasim still carry almost all of Pakistan's sea trade.`,
    ],
    remember: `Gwadar, from Oman in 1958. Port 2007. Airport 2024. Big promise, small traffic so far.`,
    whyIssb: `Gwadar gives Pakistan another port, far from Karachi and close to the mouth of the Gulf. It is the sea end of CPEC and a hope for jobs in Balochistan. Its success depends on security, water and real trade, not only on plans.`,
    watch: [
      `Whether more shipping lines call at Gwadar while Hormuz stays disrupted.`,
      `Flights and passengers at New Gwadar International Airport.`,
      `Water and power supply for Gwadar city.`,
    ],
    sources: [
      { title: `New York Times archive: Gwadar enclave given to Pakistan (8 September 1958)`, url: `https://www.nytimes.com/1958/09/08/archives/gwadar-enclave-given-to-pakistan-goodwill-gesture-by-sultan-of-oman.html` },
      { title: `Reuters: Musharraf opens Pakistani port (20 March 2007)`, url: `https://www.reuters.com/article/economy/musharraf-opens-pakistani-port-promises-another-idUSISL55050/` },
      { title: `Dawn: New Gwadar airport starts operations (20 January 2025)`, url: `https://www.dawn.com/news/1886512` },
      { title: `Business Recorder: Gwadar Port handles 53,000 MT vessel (25 May 2026)`, url: `https://www.brecorder.com/news/40422682` },
      { title: `The Nation: Gwadar handles 200,000 tonnes of transit cargo (2 August 2026)`, url: `https://www.nation.com.pk/02-Aug-2026/gwadar-handles-200-000-tonnes-transit-breakbulk-cargo-past-3-months` },
    ],
  },
  {
    id: 'china-pakistan',
    category: 'world',
    title: `China-Pakistan relations`,
    teaser: `75 years of ties, from the Karakoram Highway to JF-17s, submarines and an astronaut in training.`,
    summary: `Near Gilgit there is a cemetery for more than 140 Chinese workers. They died building the Karakoram Highway through some of the roughest land in Asia. Shared work and shared loss built this friendship.

Pakistan recognised the People's Republic of China on 5 January 1950. It was the first Muslim country to do so. Diplomatic relations began on 21 May 1951, so 2026 marks 75 years.

On 2 March 1963 the 2 countries signed a boundary agreement in Beijing. Zulfikar Ali Bhutto signed for Pakistan. The border was settled through peaceful talks.

In July 1971 Pakistan helped open a door between China and the United States. Henry Kissinger, the US national security adviser, flew secretly from Pakistan to Beijing. That trip led to President Nixon's visit to China in 1972.

The Karakoram Highway was built by both countries from 1959 to 1978. It crosses into China at the Khunjerab Pass, which has stayed open all year since December 2024.

Today the economic link is CPEC, the corridor from Kashgar to Gwadar. Pakistani figures show China has been Pakistan's largest trading partner since the 2015 to 2016 fiscal year.

Defence ties are deep. The JF-17 Thunder fighter was developed jointly by the Pakistan Aeronautical Complex at Kamra and China's Chengdu Aircraft Corporation. It was presented to the nation on 23 March 2007.

At sea, PNS Hangor, the first of 8 new Hangor class submarines, was commissioned in China on 30 April 2026. It reached Karachi in June. Of the 8, 4 are being built in China and 4 at Karachi Shipyard.

Space is the newest field. In April 2026 China chose 2 Pakistani pilots, Muhammad Zeeshan Ali and Khurram Daud, for astronaut training. The pilot finally selected should become the first foreign astronaut on China's Tiangong space station.

Prime Minister Shehbaz Sharif visited China from 23 to 26 May 2026 for the 75th anniversary. In a joint statement, China again spoke on Kashmir. It said the dispute should be settled peacefully under the UN Charter, Security Council resolutions and bilateral agreements.

Both sides also said no group, including the TTP, should use any territory to threaten the region. Pakistan promised stronger protection for Chinese workers after deadly attacks in recent years.

For Pakistan, China has been a partner in floods, earthquakes and hard times. The friendship works best when both sides deliver on payments, on security and on trust.`,
    keyPoints: [
      `Pakistan recognised the PRC on 5 January 1950, and diplomatic ties began on 21 May 1951. 2026 is the 75th year.`,
      `The boundary agreement was signed in Beijing on 2 March 1963.`,
      `In July 1971 Kissinger flew secretly from Pakistan to Beijing.`,
      `The JF-17 is made jointly by PAC Kamra and China's CAC. PNS Hangor, first of 8 new submarines, was commissioned on 30 April 2026.`,
      `China is Pakistan's largest trading partner, and CPEC links Kashgar to Gwadar.`,
      `In the 26 May 2026 joint statement, China backed a peaceful Kashmir settlement under UN Security Council resolutions.`,
    ],
    remember: `1950 recognition, 1951 ties, 1963 border deal, 75 years in 2026. Roads, jets, submarines and space.`,
    whyIssb: `China is Pakistan's largest trading partner and a close defence partner. Its support for a peaceful Kashmir settlement under UN resolutions backs Pakistan's main cause. Keeping the partnership healthy means paying dues, protecting Chinese workers and delivering on CPEC.`,
    watch: [
      `Selection and flight of the first Pakistani astronaut to Tiangong, with a decision expected in October 2026.`,
      `The 15th CPEC Joint Cooperation Committee meeting.`,
      `Delivery of more Hangor class submarines.`,
    ],
    sources: [
      { title: `Ministry of Foreign Affairs of China: Establishment of diplomatic relations with Pakistan`, url: `https://www.mfa.gov.cn/eng/wjb/zzjg_663340/tyfls_665260/tyfl_665264/2631_665276/202406/t20240606_11405554.html` },
      { title: `US Office of the Historian: Kissinger in Rawalpindi, July 1971`, url: `https://history.state.gov/historicaldocuments/frus1969-76v11/d96` },
      { title: `Britannica: Karakoram Highway`, url: `https://www.britannica.com/topic/Karakoram-Highway` },
      { title: `Radio Pakistan: Commissioning of the first Hangor class submarine (30 April 2026)`, url: `https://www.radio.gov.pk/30-04-2026/commissioning-ceremony-of-1st-hangor-class-submarine-pnsm-hangor-held-in-sanya-china` },
      { title: `Xinhua: Two Pakistani astronauts selected for China's space mission training (22 April 2026)`, url: `https://english.news.cn/20260422/5eced4ba3c2645f8a1e663f5326b52b5/c.html` },
      { title: `MOFA: Joint statement between China and Pakistan (26 May 2026)`, url: `https://mofa.gov.pk/press-releases/joint-statement-between-the-peoples-republic-of-china-and-the-islamic-republic-of-pakistan-may-26-2026` },
    ],
  },
  {
    id: 'arabian-sea',
    category: 'geography',
    title: `Arabian Sea & Pakistan's coastline`,
    teaser: `About 90 percent of Pakistan's trade moves by sea. In 2026, war near Hormuz tested it.`,
    summary: `Stand on the beach at Clifton in Karachi and look out to sea. That water leads to the Gulf, Africa and East Asia. Much of the fuel in Pakistan's cars and power plants arrives across it.

The Arabian Sea is the north western part of the Indian Ocean. It covers about 3.86 million square kilometres.

Iran and Pakistan lie to its north and India to its east. Arabia and the Horn of Africa lie to its west.

The sea has 2 narrow exits. The Strait of Hormuz leads to the Persian Gulf, and the Bab el Mandeb leads to the Red Sea. The Indus is the main river that flows into it.

Pakistan's coast is about 1,000 kilometres long, from Sir Creek near India to Gwadar Bay near Iran. Sindh has the Indus delta and its mangrove forests. Balochistan has the long and dry Makran coast.

At sea, Pakistan has an exclusive economic zone of about 240,000 square kilometres. That is the area where only Pakistan may fish and drill. In March 2015 a UN commission added about 50,000 square kilometres of seabed to Pakistan's rights.

Karachi Port and Port Qasim, both in Sindh, carry almost all of the country's sea trade. Gwadar in Balochistan is the newer port linked to CPEC.

In 2026 this sea stopped being a quiet background. On 28 February the United States and Israel struck Iran, and Iran closed the Strait of Hormuz. Tanker traffic almost stopped.

Pakistan felt it quickly. Insurance for each oil ship rose more than 10 times, and Qatar suspended most gas deliveries. By September many homes got gas only at meal times.

On 9 March 2026 the Pakistan Navy began Operation Muhafiz ul Bahr, which means Protector of the Seas. Warships escorted Pakistani ships on the Karachi to Gulf and Karachi to Red Sea routes.

Pakistan also worked for peace. It helped arrange a ceasefire between the United States and Iran on 8 April 2026.

In June it helped produce an interim deal, the Islamabad Memorandum. Both broke down, and the strait was still disrupted in late September.

The sea also holds life and wealth. Astola Island became Pakistan's first marine protected area on 15 June 2017. Officials say the Indus delta has the largest arid mangrove forest in South Asia.

A country with a single coast must guard it well. Working ports, a capable navy and calm diplomacy keep Pakistan's sea lifeline open.`,
    keyPoints: [
      `The Arabian Sea is the north western part of the Indian Ocean, about 3.86 million square km.`,
      `Pakistan's coast is about 1,000 km, from Sir Creek to Gwadar Bay.`,
      `The EEZ is about 240,000 square km, and a UN commission added about 50,000 square km of seabed in March 2015.`,
      `Karachi Port and Port Qasim carry almost all sea trade. Gwadar is the CPEC port.`,
      `Iran closed the Strait of Hormuz on 28 February 2026. The Navy began Operation Muhafiz ul Bahr on 9 March 2026.`,
      `Astola Island became Pakistan's first marine protected area on 15 June 2017.`,
    ],
    remember: `Karachi, Port Qasim, Gwadar. About 90 percent of trade by sea. Hormuz shut in 2026.`,
    whyIssb: `Almost all of Pakistan's trade and much of its fuel come by sea. The 2026 Hormuz crisis showed how fast a war nearby can cut gas and raise prices at home. Working ports, a strong navy and steady diplomacy protect that lifeline.`,
    watch: [
      `Talks to reopen the Strait of Hormuz and end the US naval blockade of Iran.`,
      `Qatari LNG deliveries to Pakistan before winter.`,
      `Navy escort operations under Muhafiz ul Bahr.`,
    ],
    sources: [
      { title: `Britannica: Arabian Sea`, url: `https://www.britannica.com/summary/Arabian-Sea` },
      { title: `Express Tribune: Pakistan's sea grows by 50,000 sq kms (21 March 2015)`, url: `https://tribune.com.pk/story/856716/territorial-waters-pakistans-sea-grows-by-50000-sq-kms` },
      { title: `Reuters: Pakistan navy launches shipping security operation (9 March 2026)`, url: `https://www.reuters.com/business/energy/pakistan-navy-launches-shipping-security-operation-amid-middle-east-tensions-2026-03-09/` },
      { title: `The News: Gas load management begins (September 2026)`, url: `https://www.thenews.pk/print/1439727-gas-load-management-begins-as-pakistan-faces-winter-lng-supply-risks` },
      { title: `BBC: How Pakistan helped secure a fragile ceasefire between the US and Iran (8 April 2026)`, url: `https://www.bbc.com/news/articles/cj401qvgg19o` },
      { title: `PID: Astola Island first Marine Protected Area (16 June 2017)`, url: `https://pid.gov.pk/site/press_detail/546` },
    ],
  },
  {
    id: 'mountains-peaks',
    category: 'geography',
    title: `Mountains & peaks`,
    teaser: `Pakistan's north holds 3 great ranges and 5 of the world's 14 highest peaks.`,
    summary: `Stand at Concordia, deep in the Karakoram, more than 4,600 metres above the sea. Here the Baltoro Glacier meets the Godwin Austen Glacier. Look north, and K2 fills the sky.

From this camp alone, a hiker can see 4 of the world's 14 peaks above 8,000 metres. Pakistan has 5 of these peaks in all.

Pakistan's north is not a single wall of mountains. It is 3 ranges that meet. The Karakoram holds K2, the Himalaya holds Nanga Parbat, and the Hindu Kush rises in Chitral toward Afghanistan.

K2 is 8,611 metres high. It is the 2nd highest mountain on Earth, after Everest. It stands on the border between Gilgit-Baltistan and China's Xinjiang region.

Officers of the Survey of India measured it in 1856. They named it K2 because it was the 2nd peak they measured in the Karakoram. It is also called Mount Godwin Austen, after an English geographer, and local people call it Chogori.

An Italian team, which included a Pakistani member, made the first climb. Lino Lacedelli and Achille Compagnoni reached the top on 31 July 1954.

Nanga Parbat is 8,126 metres high, the 9th highest peak in the world. It stands at the western end of the Himalaya, near Astore in Gilgit-Baltistan. Its name means naked mountain.

The Austrian climber Hermann Buhl first reached its top on 3 July 1953.

The Hindu Kush is the 3rd range. Its highest peak, Tirich Mir, is about 7,700 metres high and looks down on Chitral town.

Pakistanis climb these peaks too. On 4 October 2024, Sirbaz Khan from Hunza became the first Pakistani to climb all 14 peaks above 8,000 metres.

These mountains matter for more than pride. They hold more than 7,000 glaciers, huge masses of slow-moving ice, according to UNDP. Melting snow and ice give the Indus rivers much of their water every summer.

That water reaches our wheat, our cities and our power stations. But the ice is melting faster as the climate warms. New glacial lakes form, and some can burst and flood villages below.

The United Nations named 2025 the International Year of Glaciers' Preservation. For Pakistan, this is not a distant idea. It is about the rivers we live on.

The mountains are also a border. The Karakoram Highway crosses into China at the Khunjerab Pass, 4,693 metres high.

This ground demands respect. Thin air, deep snow and long supply lines decide how soldiers and supplies can move.

K2 is Karakoram, Nanga Parbat is Himalaya, and Tirich Mir is Hindu Kush. Learn those 3 pairs, and you know where Pakistan's water begins.`,
    keyPoints: [
      `K2 is 8,611 metres, the 2nd highest peak on Earth. It is in the Karakoram, on the border of Gilgit-Baltistan and China.`,
      `Nanga Parbat is 8,126 metres, the 9th highest peak. It is at the western end of the Himalaya, near Astore.`,
      `Tirich Mir, about 7,700 metres, is the highest peak of the Hindu Kush. It stands above Chitral.`,
      `Pakistan has 5 of the 14 peaks above 8,000 metres. They are K2, Nanga Parbat, Gasherbrum I, Broad Peak and Gasherbrum II.`,
      `K2 was first climbed on 31 July 1954 by an Italian team. Hermann Buhl first climbed Nanga Parbat on 3 July 1953.`,
      `On 4 October 2024, Sirbaz Khan became the first Pakistani to climb all 14 peaks above 8,000 metres.`,
    ],
    remember: `K2 is Karakoram, Nanga Parbat is Himalaya, Tirich Mir is Hindu Kush. 5 of the 14 peaks above 8,000 metres are in Pakistan.`,
    whyIssb: `These mountains store much of Pakistan's water as snow and ice. Their melt feeds the Indus rivers that water our crops and run our power stations. They are also a hard border, so height and weather shape every road, post and supply line.`,
    watch: [`Glacial lake flood warnings for Gilgit-Baltistan and Chitral each summer.`],
    sources: [
      { title: `Britannica: K2`, url: `https://www.britannica.com/place/K2` },
      { title: `Britannica: Nanga Parbat`, url: `https://www.britannica.com/place/Nanga-Parbat` },
      { title: `Britannica: Tirich Mir`, url: `https://www.britannica.com/place/Tirich-Mir` },
      { title: `Guinness World Records: First ascent of K2`, url: `https://www.guinnessworldrecords.com/world-records/first-ascent-of-k2` },
      { title: `The News: Sirbaz Khan summits all 14 eight-thousanders (4 October 2024)`, url: `https://www.thenews.com.pk/latest/1236723-sirbaz-khan-makes-history-by-summiting-all-14-eight-thousanders` },
      { title: `UN: International Year of Glaciers' Preservation`, url: `https://www.un-glaciers.org/en/background` },
    ],
  },
  {
    id: 'water-security',
    category: 'pakistan',
    title: `Water security for Pakistan`,
    teaser: `Pakistan sits downstream. Storage, timing and the 1960 treaty decide whether fields and cities get water.`,
    summary: `Picture a farmer near Marala, where the Chenab enters Pakistan, in May 2025. First the river drops. A few days later it rushes back.

Reuters reported that India had begun flushing silt, which is mud and sand, out of 2 dams upstream. River data at Marala then showed sharp rises and falls for days.

This is what water security means for Pakistan. It is not only about how much water comes. It is also about when it comes.

Pakistan is a lower riparian. That means our rivers pass through another country before they reach us. The Indus, Jhelum and Chenab carry most of our water.

Under the 1960 Indus Waters Treaty, these western rivers go mainly to Pakistan. Reuters notes that this water supports about 80 percent of Pakistani farms.

Our canals form the Indus Basin Irrigation System. The World Bank calls it the largest connected irrigation system in the world.

It has 3 major reservoirs, 19 barrages and over 120,000 small watercourses. Barrages are low dams that turn river water into canals.

Our first weakness is storage. In 2021, the WAPDA chairman said Pakistan can store only about 30 days of river water. He said we need at least 120 days.

Silt is also filling our dams. In 2018, WAPDA told senators that Tarbela had lost about 30 percent of its storage.

New dams are slow. Mohmand Dam was about 54 percent complete in July 2026 and is due in 2028. The Auditor General has reported long delays at Diamer-Bhasha.

Our second weakness is overuse. The Planning Commission says Pakistan already pumps more groundwater than is safe.

Then comes climate. The 2022 floods affected 33 million people and killed more than 1,700. In late August 2025, the Ravi, Sutlej and Chenab flooded large parts of Punjab.

Politics adds risk. On 23 April 2025, India said it was holding the treaty in abeyance, which means putting it on hold. Normal data sharing stopped, and in the 2025 floods India sent warnings through its High Commission instead.

Pakistan's National Security Committee said any attempt to stop or divert Pakistan's water would be treated as an act of war. On 31 August 2026, a Court of Arbitration in The Hague, a panel of international judges, ruled that the treaty remains fully in force. India rejected the court and its ruling.

Officials and experts told Reuters that India cannot stop the flow quickly, because its dams on these rivers hold little water. Water experts say the bigger danger is to timing, especially in the dry season.

So our answer has 2 parts. Abroad, we defend our lawful share through the treaty and the courts. At home, we build storage, line canals and save groundwater.

A country that stores its water can plan its harvest. A country that cannot is always waiting on someone else.`,
    keyPoints: [
      `Pakistan is the lower riparian, so its rivers pass through India first. Timing matters as much as volume.`,
      `The Indus Basin Irrigation System is the largest connected irrigation system in the world (World Bank).`,
      `Pakistan can store only about 30 days of river water. WAPDA says it needs at least 120 days.`,
      `India put the treaty in abeyance on 23 April 2025. On 31 August 2026 the Court of Arbitration said the treaty remains fully in force, and India rejected the ruling.`,
      `The 2022 floods affected 33 million people. Mohmand Dam is due in 2028, and Diamer-Bhasha faces delays.`,
    ],
    remember: `Downstream country, only 30 days of storage. Defend the treaty abroad, build storage at home.`,
    whyIssb: `Water decides whether wheat grows, cities drink and power stations run. Pakistan does not control where its rivers start, so it must protect its legal share and store water well. A country short of storage is weaker in every flood and every drought.`,
    watch: [
      `India's planned canals and dams on the western rivers, and the Neutral Expert's decisions on Kishenganga and Ratle.`,
      `Progress on Mohmand Dam (due 2028) and Diamer-Bhasha Dam.`,
      `Whether flood warnings and river data return to the normal treaty channel.`,
    ],
    sources: [
      { title: `Reuters: Panic in Pakistan as India vows to cut off water supply (27 April 2025)`, url: `https://www.reuters.com/world/asia-pacific/panic-pakistan-india-vows-cut-off-water-supply-over-kashmir-2025-04-27/` },
      { title: `Reuters: India starts work on hydro projects after suspending treaty (5 May 2025)`, url: `https://www.reuters.com/world/asia-pacific/india-starts-work-hydro-projects-after-suspending-treaty-with-pakistan-sources-2025-05-05/` },
      { title: `Dawn: Pakistan has only 30-day water carryover capacity, Wapda chief (16 October 2021)`, url: `https://www.dawn.com/news/1652253` },
      { title: `Planning Commission of Pakistan: Water chapter`, url: `https://www.pc.gov.pk/uploads/plans/Ch20-Water1.pdf` },
      { title: `World Bank: 2022 flood damages and losses over USD 30 billion (28 October 2022)`, url: `https://www.worldbank.org/en/news/press-release/2022/10/28/pakistan-flood-damages-and-economic-losses-over-usd-30-billion-and-reconstruction-needs-over-usd-16-billion-new-assessme` },
      { title: `ThePrint (PTI): India rejects Court of Arbitration order (31 August 2026)`, url: `https://theprint.in/india/no-jurisdiction-india-rejects-permanent-court-of-arbitrations-order-on-suspension-of-indus-waters-treaty/3030076/` },
    ],
  },
  {
    id: 'orgs-memberships',
    category: 'world',
    title: `Pakistan in international organisations`,
    teaser: `From the UN Security Council to the SCO chair, the rooms where Pakistan speaks for itself.`,
    summary: `On 22 July 2025, Foreign Minister Ishaq Dar sat in the president's chair of the UN Security Council in New York. The council voted on a Pakistani draft, and all 15 members said yes.

It became Resolution 2788. It asks all countries to settle disputes by peaceful means, such as talks, mediation and courts.

That moment shows why memberships matter. A seat in the right room gives a country a voice before decisions are made.

Pakistan joined the United Nations on 30 September 1947. Since 1960, more than 235,000 Pakistani personnel have served in UN peace missions. More than 180 have given their lives.

Our first mission was in the Congo in 1960. Pakistan is still one of the largest contributors of UN peacekeepers.

In June 2024, the UN General Assembly elected Pakistan to the Security Council with 182 votes. This is our 8th term, from 1 January 2025 to 31 December 2026.

In 2025, Pakistan chaired the council's Taliban sanctions committee, which oversees penalties such as travel bans and frozen assets. In 2026, after the United States and Israel attacked Iran, Pakistan condemned attacks on Iran and on Gulf states. It pushed for talks and hosted US and Iranian negotiators in Islamabad in April.

The Shanghai Cooperation Organisation, or SCO, was founded in Shanghai on 15 June 2001. It has 10 members, including China, Russia, India, Iran and Pakistan.

Pakistan became a full member on 9 June 2017. On 1 September 2026, at the summit in Bishkek, Pakistan took over the SCO chair for 2026 to 2027.

Lahore is the SCO's Tourism and Cultural Capital for that year. Islamabad will host the next summit in 2027. The SCO says it is not a military alliance.

The Organisation of Islamic Cooperation, the OIC, has 57 member states. It was founded in Rabat on 25 September 1969 and is based in Jeddah. Lahore hosted its 2nd Islamic Summit in February 1974.

Pakistan, Iran and Türkiye founded the Economic Cooperation Organization, ECO, in 1985. It now has 10 members, and its secretariat, or main office, is in Tehran.

The D-8 links developing Muslim countries, including Pakistan, Türkiye, Egypt and Indonesia. Since 1 January 2026, its Secretary General has been Sohail Mahmood, a former Pakistani foreign secretary.

Pakistan is also in the Commonwealth. It left in 1972 and rejoined in 1989.

Not every room works. SAARC, the South Asian group of 8 countries, has not held a summit since November 2014. The summit planned for Islamabad in 2016 never took place.

These names are not just letters. They are the rooms where Pakistan wins votes, trade and friends. Strong armed forces protect the country, and good diplomacy keeps it from standing alone.`,
    keyPoints: [
      `Pakistan joined the UN on 30 September 1947. More than 235,000 Pakistanis have served in UN peace missions since 1960.`,
      `Pakistan is on the UN Security Council for 2025 to 2026, its 8th term, after winning 182 votes.`,
      `Pakistan held the council presidency in July 2025. Resolution 2788 on peaceful settlement of disputes passed unanimously on 22 July 2025.`,
      `Pakistan has chaired the SCO since 1 September 2026, and Islamabad will host the 2027 summit.`,
      `The OIC has 57 members and is based in Jeddah. ECO is based in Tehran. A Pakistani has led the D-8 since 1 January 2026.`,
      `SAARC has not held a summit since November 2014.`,
    ],
    remember: `UN since 1947, Security Council 2025 to 2026, SCO chair 2026 to 2027. SAARC is the empty room.`,
    whyIssb: `Pakistan is a middle-sized country with powerful neighbours, so it needs friends and a voice. Seats at the UN, SCO and OIC let Pakistan shape decisions on war, trade and loans. Peacekeeping also shows the world a disciplined, professional military.`,
    watch: [
      `Pakistan's last months on the Security Council before its term ends on 31 December 2026.`,
      `Pakistan's SCO chair year and the 2027 Islamabad summit.`,
      `Any real move to revive SAARC summits.`,
    ],
    sources: [
      { title: `MOFA: Security Council adopts Pakistan-sponsored Resolution 2788 (22 July 2025)`, url: `https://mofa.gov.pk/press-releases/security-council-adopts-pakistan-sponsored-resolution-on-peaceful-settlement-of-disputes` },
      { title: `Dawn: Pakistan elected to UNSC for historic eighth term (7 June 2024)`, url: `https://www.dawn.com/news/1838300` },
      { title: `SCO Secretariat: 26th Council of Heads of State, Bishkek (1 September 2026)`, url: `https://eng.sectsco.org/20260901/2493609.html` },
      { title: `OIC: History`, url: `https://www.oic-oci.org/en/page/1` },
      { title: `APP: Sohail Mahmood assumes charge as D-8 Secretary General (3 January 2026)`, url: `https://www.app.com.pk/national/ambassador-sohail-mahmood-assumes-charge-of-secretary-general-of-d-8/` },
      { title: `Commonwealth Secretariat: Our history`, url: `https://thecommonwealth.org/history` },
    ],
  },
  {
    id: 'defence-pact-context',
    category: 'military',
    title: `Saudi-Türkiye-Pakistan defence ties`,
    teaser: `2 signed pacts now say an attack on one is an attack on all. The details stay unpublished.`,
    summary: `On Friday 7 August 2026, 3 leaders sat together at Al-Safa Palace in Makkah. They were Saudi Crown Prince Mohammed bin Salman, Turkish President Recep Tayyip Erdoğan and Prime Minister Shehbaz Sharif.

They signed the Makkah Joint Defence Agreement. Its joint statement says an armed attack on any 1 of the 3 states will be treated as an attack on all of them.

This did not come from nowhere. On 17 September 2025, in Riyadh, Pakistan and Saudi Arabia signed the Strategic Mutual Defence Agreement.

The Saudi Press Agency said it means any aggression against either country is aggression against both. Its aim is joint deterrence. Deterrence means stopping an attack by making it too costly to try.

Reuters said the pact came a week after Israeli strikes on Qatar shook the Gulf. In January 2026, Pakistan's defence production minister said a 3-country draft had been under discussion for about 10 months.

Then war spread across the region. On 28 February 2026, the United States and Israel attacked Iran. Iran and its allies then struck Saudi Arabia and other Gulf states.

Pakistan worked on 2 tracks. It hosted US and Iranian negotiators in Islamabad on 11 and 12 April 2026. At the same time, the Saudi defence ministry said Pakistani fighter jets had arrived under the pact.

In May 2026, sources told Reuters that about 8,000 Pakistani troops, a squadron of about 16 jets, mostly JF-17s, and an HQ-9 air defence system were in the kingdom. They said Saudi Arabia was paying the costs.

Each partner brings something different. Saudi Arabia guards Makkah and Madinah and is a major economic partner. Türkiye is a NATO member with a big defence industry, and Pakistan has long trained Saudi forces.

On 31 August 2026, the 3 countries' foreign ministers, defence ministers and military chiefs met in Istanbul. They agreed to open a secretariat, a permanent office, in Saudi Arabia. Its first secretary general will be a Pakistani, for 3 years.

Some things are still unclear. The full text has not been published, and the statement does not say what each country must do in a war.

Türkiye has not yet ratified the pact, which means its parliament has not approved it. On 25 September 2026, Türkiye's parliament speaker said he expected lawmakers to take it up from October.

The pact is already being tested. Yemen's Houthis have attacked Saudi Arabia since July 2026. On 2 October 2026, Ishaq Dar said the pact's top committee would meet in Riyadh to discuss these attacks.

Dar called the pact defensive, with no offensive agenda. He said more than 6 countries want to join, but all 3 founders must agree to any new member.

This pact brings pride and responsibility. Strong partners make an attack on any of us less likely. But every promise must be backed by trained soldiers, ready aircraft and clear rules on when to act.`,
    keyPoints: [
      `On 17 September 2025 in Riyadh, Pakistan and Saudi Arabia signed the Strategic Mutual Defence Agreement. Aggression against one is aggression against both.`,
      `On 7 August 2026 at Al-Safa Palace, Makkah, Saudi Arabia, Türkiye and Pakistan signed the Makkah Joint Defence Agreement.`,
      `Its statement says an armed attack on any 1 of the 3 is an attack on all. The full text and each country's duties are not public.`,
      `A secretariat will be set up in Saudi Arabia. A Pakistani secretary general will lead it first, for 3 years.`,
      `Türkiye's parliament had not yet ratified the pact by late September 2026.`,
      `Reuters sources said about 8,000 Pakistani troops, a jet squadron and an HQ-9 system were in Saudi Arabia by May 2026.`,
    ],
    remember: `Riyadh 2025 is the Saudi-Pakistan pact. Makkah 2026 adds Türkiye. Attack on 1 is attack on all, but the details are unpublished.`,
    whyIssb: `These pacts give Pakistan strong partners and make an attack on any member more costly. They also tie Pakistan to the security of the holy cities and the Gulf, where millions of Pakistanis live and work. Pakistan must honour its word while keeping control of when and how its forces act.`,
    watch: [`The Turkish parliament's vote on ratification.`, `The pact committee's response to Houthi attacks on Saudi Arabia.`, `Whether any new country is allowed to join.`],
    sources: [
      { title: `Reuters: Saudi Arabia, nuclear-armed Pakistan sign mutual defence pact (17 September 2025)`, url: `https://www.reuters.com/world/asia-pacific/saudi-arabia-nuclear-armed-pakistan-sign-mutual-defence-pact-2025-09-17/` },
      { title: `Reuters: Pakistan sends fighter jets to Saudi Arabia under defence pact (11 April 2026)`, url: `https://www.reuters.com/world/asia-pacific/saudi-arabia-says-pakistan-sends-fighter-jets-kingdom-under-defence-pact-2026-04-11/` },
      { title: `Reuters: Pakistan deploys jet squadron, thousands of troops to Saudi Arabia (18 May 2026)`, url: `https://www.reuters.com/world/asia-pacific/pakistan-deploys-jet-squadron-thousands-troops-saudi-arabia-during-iran-war-2026-05-18/` },
      { title: `PID: Makkah Al-Mukarramah Summit for Joint Defence (7 August 2026)`, url: `https://pid.gov.pk/site/press_detail/33499` },
      { title: `Reuters: Pact could expand, Turkish speaker says, ratification pending (25 September 2026)`, url: `https://www.reuters.com/world/middle-east/pact-with-saudi-pakistan-could-expand-muslim-world-iran-turkish-speaker-says-2026-09-25/` },
      { title: `Arab News: Defence pact talks amid Houthi attacks (2 October 2026)`, url: `https://www.arabnews.com/saudi-arabia/pakistan-saudi-arabia-turkiye-to-hold-defense-pact-talks-next-week-amid-houthi-attacks-3004291` },
    ],
  },
  {
    id: 'paf-fighters',
    category: 'military',
    title: `PAF fighter jets`,
    teaser: `JF-17, F-16 and J-10CE lead the fleet. Old Mirages and F-7s are slowly leaving.`,
    summary: `Picture the flight line at Minhas air base in Kamra. Next door is the factory where Pakistan builds the JF-17. In March 2022, the first J-10CE jets joined the PAF here too.

Pakistan both builds and buys its fighters. That mix explains a lot about the PAF.

The JF-17 Thunder is the most common PAF fighter. Pakistan Aeronautical Complex, or PAC, builds it at Kamra with China's Chengdu Aircraft Industry Corporation. PAC does 58 percent of the work on the aircraft's body.

It has 1 pilot, or 2 in the JF-17B trainer. PAC lists a top speed of Mach 1.6, which is 1.6 times the speed of sound, and a ceiling of 55,500 feet.

PAC says 7 PAF squadrons fly it. The newest Block III reached No. 16 Squadron in 2023. It has an AESA radar, a modern radar that steers its beam electronically and tracks many targets at once.

In July 2025, a JF-17 Block III won the Spirit of the Meet trophy at the Royal International Air Tattoo in England. Azerbaijan, Nigeria and Myanmar also fly the JF-17.

The American F-16 Fighting Falcon has served the PAF since the early 1980s. Pakistan flies older A and B models, rebuilt in a mid-life update, and 18 newer C and D Block 52 jets delivered from 2010.

Janes counted 72 PAF F-16s in service in December 2025. That month, the United States approved a 686 million dollar upgrade package. It adds 92 Link-16 data links, which let jets share what they see, and aims to keep them flying to 2040.

The J-10CE came from China. The first 6 joined No. 15 Squadron on 11 March 2022, and Quwa reported about 20 in service in 2026.

It has 1 pilot, an AESA radar and a top speed near Mach 1.8 in open specifications. It carries the long-range PL-15 missile, Reuters reported.

On 8 May 2025, 2 US officials told Reuters that a Pakistani J-10 had shot down at least 2 Indian aircraft the day before. The 2nd official said at least 1 was a Rafale.

The older jets are leaving slowly. Mirage jets first joined the PAF in 1968, and PAC at Kamra still runs a Mirage Rebuild Factory. The Chinese F-7PG, from the MiG-21 family, is being replaced by JF-17s.

The future is still being decided. On 7 May 2026, the PAF said it wants more J-10C jets and much upgraded JF-17s. It also has an initial collaborative mechanism, an early step toward working together, with China on the J-35 stealth fighter.

No J-35 has been officially shown in PAF service.

The lesson is clear. Skilled pilots, well-kept jets and strong networks win air battles, not just new aircraft. And a jet partly built at home is easier to keep flying in a crisis.`,
    keyPoints: [
      `The JF-17 Thunder is built at Kamra by PAC with China's CAC. It reaches Mach 1.6, has a ceiling of 55,500 feet and flies with 7 PAF squadrons.`,
      `The JF-17 Block III has an AESA radar. Azerbaijan, Nigeria and Myanmar also fly the JF-17.`,
      `The F-16 has served since the early 1980s. In December 2025 the US approved a 686 million dollar upgrade to keep it flying to 2040.`,
      `The J-10CE joined No. 15 Squadron on 11 March 2022. About 20 are in service (Quwa, 2026).`,
      `US officials told Reuters a Pakistani J-10 shot down at least 2 Indian aircraft on 7 May 2025.`,
      `The Mirage III/5 and F-7PG are old types being retired. The J-35 is only at an early cooperation stage.`,
    ],
    remember: `Built at home is the JF-17. Bought abroad are the F-16 and J-10CE. Leaving are the Mirage and F-7.`,
    whyIssb: `Fighters are Pakistan's first answer to any air attack, and they must be ready within minutes. A mix of home-built and imported jets protects Pakistan if one supplier stops helping. Training and maintenance matter as much as the jets themselves.`,
    watch: [`New J-10C orders and the upgraded JF-17 announced in May 2026.`, `Any official J-35 contract or delivery.`, `JF-17 export deals under discussion.`],
    sources: [
      { title: `PAC Kamra: JF-17 Thunder`, url: `https://www.pac.org.pk/jf-17` },
      { title: `The Aviationist: JF-17 Block III wins Spirit of the Meet at RIAT 2025 (21 July 2025)`, url: `https://theaviationist.com/2025/07/21/jf-17-riat-2025/` },
      { title: `Janes: US approves upgrade-related sale for Pakistan F-16s (12 December 2025)`, url: `https://www.janes.com/defence-intelligence-insights/defence-news/defence/us-approves-upgrade-related-sale-for-pakistan-f-16s` },
      { title: `Reuters: Pakistan's Chinese-made jet brought down two Indian fighter aircraft, US officials say (8 May 2025)`, url: `https://www.reuters.com/world/pakistans-chinese-made-jet-brought-down-two-indian-fighter-aircraft-us-officials-2025-05-08/` },
      { title: `Quwa: Pakistan Air Force lays out next procurement steps (7 May 2026)`, url: `https://quwa.org/pakistan-air-force-news/pakistan-air-force-lays-out-next-procurement-steps-05-07-2026/` },
    ],
    aircraft: [
      {
        id: 'jf-17',
        name: 'JF-17 Thunder',
        role: 'Multirole fighter (PAC/CAC)',
        crew: '1 (JF-17B: 2)',
        speed: 'Mach 1.6 (PAC)',
        capacity: 'Pilot only (combat); dual-seat trainer variant exists',
        other: 'Ceiling 55,500 ft; Blocks I to III; flown by 7 PAF squadrons; built at Kamra.',
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
        other: 'A/B (mid-life update) and C/D Block 52; 72 in service (Janes, Dec 2025); US-approved upgrade to 2040.',
        image: '/images/aircraft/f-16-fighting-falcon.jpg',
        imageCredit: 'PAF F-16A — Aldo Bidini / GFDL 1.2 via Wikimedia Commons',
      },
      {
        id: 'j-10ce',
        name: 'J-10CE',
        role: 'Multirole fighter (China export)',
        crew: '1',
        speed: 'Mach 1.8 class (open specs for the J-10 family)',
        capacity: 'Pilot only',
        other: 'AESA radar; carries the PL-15 long-range missile; about 20 in service (Quwa, 2026).',
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
        other: 'In PAF service since 1968; ROSE-upgraded legacy fleet being replaced.',
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
        other: 'Open counts vary, about 50 to 72 (2025); being replaced by JF-17s.',
        image: '/images/aircraft/f-7pg.jpg',
        imageCredit: 'PAF Chengdu F-7 — US Air Force / Public domain via Wikimedia Commons',
      },
    ],
  },
  {
    id: 'paf-transport',
    category: 'military',
    title: `PAF transport & tanker aircraft`,
    teaser: `Hercules move people and supplies. Il-78 tankers refuel fighters in the air. CN-235s fly lighter loads.`,
    summary: `Late on 6 February 2023, a C-130 Hercules took off from Chaklala in Rawalpindi. On board was a Pakistan Army search and rescue team. They were flying to Türkiye, where a huge earthquake had struck that day.

Soon 3 PAF C-130s and 1 Il-78 had carried relief to Türkiye. Fighters get the headlines, but this fleet turns plans into help on the ground.

The C-130 Hercules is a 4-engine turboprop transport. A turboprop is a jet engine that turns a propeller. The PAF has flown the C-130 since 1963.

The PAF flies several older models, including the C-130E and C-130H. In 2022, it began receiving 7 used C-130H aircraft from Belgium. Scramble, a Dutch aviation magazine, said this could raise the fleet to about 21.

The US Air Force lists a C-130H crew of 5 and a payload, or load, of about 19 tonnes. It flies at about 318 knots, roughly 590 kilometres an hour, at 20,000 feet.

It can land on rough dirt strips. That is why it carries troops, food, tents and medicine after floods and earthquakes.

The Ilyushin Il-78MP does 2 jobs. It is an aerial tanker, which means it refuels other aircraft in flight. Remove the fuel tanks from its cargo hold, and it becomes a cargo plane again.

Pakistan bought 4 Il-78s from Ukraine. They were rebuilt there and delivered between 2009 and 2011. No. 10 Squadron, the Bulls, flies them from Nur Khan air base, with a crew of 6 on each.

Their value showed in July 2025. 2 JF-17 Block III jets flew to the Royal International Air Tattoo in England, refuelled in the air by a PAF Il-78. A PAF C-130 won the show's Concours d'Elegance trophy.

The CN-235 is a smaller twin-engine transport. Open lists show 4 in PAF service. It needs a flight crew of 2, and Airbus lists a payload of up to about 6 tonnes.

It suits short trips, light cargo and passengers. For heavy loads, the Hercules still does the main work.

Why does this matter? A fighter without a tanker must turn back early. An army that cannot fly in supplies waits longer for help.

This is the quiet side of air power. Tanker crews and loadmasters, who load and tie down cargo, rarely make the news. Yet without them, fighters stay close to home and flood victims wait.`,
    keyPoints: [
      `The PAF has flown the C-130 Hercules since 1963. A C-130H has a crew of 5 and carries about 19 tonnes.`,
      `7 used C-130H aircraft came from Belgium from 2022, which could bring the fleet to about 21.`,
      `4 Il-78MP tanker-transports came from Ukraine between 2009 and 2011. No. 10 Squadron, the Bulls, flies them from Nur Khan.`,
      `The Il-78 refuels fighters in flight, or carries cargo once its hold tanks are removed.`,
      `The CN-235 is a light twin-engine transport. About 4 are in PAF service.`,
      `In 2023, PAF C-130s and an Il-78 flew earthquake relief to Türkiye. In 2025, an Il-78 refuelled JF-17s flying to England.`,
    ],
    remember: `C-130 for airlift since 1963. 4 Il-78s refuel and carry. CN-235 for light loads.`,
    whyIssb: `Pakistan faces floods, earthquakes and threats on more than one border. Transport aircraft move troops and relief fast, and tankers let fighters stay in the air longer. Without them, even the best pilots and soldiers cannot reach where they are needed.`,
    watch: [`Any official PAF plan to add or replace transport and tanker aircraft.`],
    sources: [
      { title: `Anadolu: Pakistan dispatches first rescue teams to Türkiye (7 February 2023)`, url: `https://www.aa.com.tr/en/asia-pacific/pakistan-dispatches-1st-batch-of-rescue-teams-relief-goods-to-turkiye/2809226` },
      { title: `Scramble: Pakistan increases transport capacity (2022)`, url: `https://scramble.nl/military-news/pakistan-increases-transport-capacity` },
      { title: `US Air Force (AMC): C-130 Hercules fact sheet`, url: `https://www.amc.af.mil/About-Us/Fact-Sheets/Display/Article/2848932/c-130-hercules/` },
      { title: `RIAT: Ilyushin Il-78 Midas, PAF No. 10 Squadron (2025)`, url: `https://www.airtattoo.com/riat-2025/aircraft-2025/ilyushin-il-78-midas/` },
      { title: `The News: PAF aircraft win awards at RIAT 2025 (19 July 2025)`, url: `https://www.thenews.com.pk/latest/1329520-paf-aircraft-win-global-awards-at-uk-airshow` },
    ],
    aircraft: [
      {
        id: 'c-130',
        name: 'C-130 Hercules',
        role: 'Tactical / medium transport',
        crew: '5 (C-130E/H)',
        speed: 'About 318 kt at 20,000 ft (C-130H)',
        capacity: 'About 19 t payload (USAF fact sheet)',
        other: 'In PAF service since 1963; E and H models; 7 ex-Belgian C-130H added from 2022.',
        image: '/images/aircraft/c-130-hercules.jpg',
        imageCredit: 'PAF C-130E 4171 — Papas Dos / CC BY 2.0 via Wikimedia Commons',
      },
      {
        id: 'il-78',
        name: 'Il-78MP Midas',
        role: 'Strategic tanker / transport',
        crew: '6',
        speed: 'Jet transport class',
        capacity: 'Freight or aerial refuelling fuel (removable hold tanks)',
        other: 'Four ex-Ukrainian airframes delivered 2009 to 2011; No. 10 Squadron at Nur Khan.',
        image: '/images/aircraft/il-78mp.jpg',
        imageCredit: 'PAF Il-78MP R09-001 — Václav Paluzga / CC BY-SA 3.0 via Wikimedia Commons',
      },
      {
        id: 'cn-235',
        name: 'CN-235',
        role: 'Light utility transport',
        crew: '2 (minimum flight crew)',
        speed: 'Turboprop utility class',
        capacity: 'Up to about 6 t of freight, or passengers',
        other: 'About 4 in PAF service. Photo is a type example (non-PAF markings); no free PAF-marked Commons file found.',
        image: '/images/aircraft/cn-235.jpg',
        imageCredit: 'CN-235 type (Royal Moroccan AF example) — Wikimedia Commons; type-verified, not PAF-marked',
      },
    ],
  },
  {
    id: 'paf-fleet-size',
    category: 'military',
    title: `How many planes does the PAF have?`,
    teaser: `About 450 combat aircraft by IISS count. The PAF itself does not publish exact numbers.`,
    summary: `Ask 3 experts how many aircraft the PAF has, and you may get 3 answers. That is not because anyone is lying. It is because they count different things.

The PAF does not publish a full list of its aircraft. So analysts build their own counts from photos, contracts and reports.

The best known count is The Military Balance, from the International Institute for Strategic Studies, or IISS, in London. Its 2025 edition, reported by Reuters, gave the PAF 452 combat-capable aircraft, meaning aircraft that can fight. It put PAF personnel at about 70,000.

FlightGlobal's World Air Forces directory counts differently. Its 2025 edition listed 1,399 military aircraft for Pakistan. That total covers all 3 services and includes trainers, helicopters and transports.

The same list counted 418 combat aircraft, the 6th largest combat fleet in the world. So the fair answer is about 400 to 450 combat aircraft, depending on the source.

Inside that number, the JF-17 Thunder is the largest single type. PAC says 7 PAF squadrons fly it.

Janes counted 72 F-16s in December 2025. Quwa reported about 20 J-10CE jets in 2026.

The older fleets are shrinking fast. FlightGlobal's 2025 list showed the F-7 fleet falling from 135 to 72 in a year. The old Mirage III and Mirage 5 jets are also due to be replaced.

Support aircraft are fewer but vital. Open lists show about 21 C-130 transports, 4 Il-78 tankers and 4 CN-235s. Quwa counted 7 to 9 Saab 2000 Erieye radar planes in 2024.

An Erieye is an airborne early warning aircraft. Its radar looks far across the border and helps guide fighters to targets.

Drones are growing too. A PAF video in September 2026 showed Wing Loong II, Shahpar, Bayraktar TB2 and Akinci drones, Janes reported.

Some numbers are claims, not facts. After May 2025, India said it had destroyed Pakistani aircraft, including an early warning plane.

Pakistan rejects this. Its military says no Pakistani aircraft was shot down, and only 1 suffered minor damage.

The future is still open. Pakistan has shown interest in the J-35 stealth fighter and the KJ-500 radar plane, but neither has been officially inducted.

Numbers matter, but they are not everything. IISS counted about 730 combat-capable aircraft for India in 2025, far more than Pakistan has.

So a smaller air force must be better trained, better linked and quicker to react. Every pilot, technician and radar operator counts.

When someone gives an exact number, ask 2 questions. Which source, and which year?`,
    keyPoints: [
      `The PAF does not publish full aircraft numbers. All counts are estimates.`,
      `The IISS Military Balance 2025 gave the PAF 452 combat-capable aircraft and about 70,000 personnel.`,
      `FlightGlobal's 2025 directory listed 1,399 military aircraft across all of Pakistan's services, including 418 combat aircraft.`,
      `The JF-17 is the largest type. Janes counted 72 F-16s in 2025, and Quwa counted about 20 J-10CEs in 2026.`,
      `The support fleet is about 21 C-130s, 4 Il-78s, 4 CN-235s and 7 to 9 Saab 2000 Erieye radar planes.`,
      `The F-7 fleet fell from 135 to 72 in FlightGlobal's 2025 count as old jets retire.`,
    ],
    remember: `About 450 combat aircraft (IISS 2025). About 1,400 aircraft of all kinds (FlightGlobal 2025). Always name the source and year.`,
    whyIssb: `Pakistan faces a larger rival air force, so every aircraft must count. Real numbers, with their limits, show how Pakistan balances quantity with training, radar and networks. Made-up exact numbers mislead people and damage trust.`,
    watch: [`New J-10C deliveries and the upgraded JF-17 promised in May 2026.`, `Any official KJ-500 or J-35 induction.`, `Retirement of the last Mirage and F-7 squadrons.`],
    sources: [
      { title: `Reuters: How do India and Pakistan's militaries compare (IISS figures, 30 April 2025)`, url: `https://www.reuters.com/world/asia-pacific/how-do-india-pakistans-militaries-compare-tensions-rise-after-kashmir-attack-2025-04-30/` },
      { title: `Al Jazeera: India and Pakistan's military capabilities (8 May 2025)`, url: `https://www.aljazeera.com/news/2025/5/8/what-are-india-and-pakistans-military-and-nuclear-capabilities` },
      { title: `Janes: US approves upgrade-related sale for Pakistan F-16s (12 December 2025)`, url: `https://www.janes.com/defence-intelligence-insights/defence-news/defence/us-approves-upgrade-related-sale-for-pakistan-f-16s` },
      { title: `Quwa: PAF lays out next procurement steps (7 May 2026)`, url: `https://quwa.org/pakistan-air-force-news/pakistan-air-force-lays-out-next-procurement-steps-05-07-2026/` },
      { title: `Janes: Pakistan fields new air-defence systems (September 2026)`, url: `https://www.janes.com/defence-intelligence-insights/defence-news/defence/special-report-pakistan-fields-new-air-defence-systems` },
      { title: `Dawn: Defence minister rubbishes Indian air chief's claims (9 August 2025)`, url: `https://www.dawn.com/news/1929745` },
    ],
  },
  {
    id: 'pakistan-air-defence',
    category: 'military',
    title: `Pakistan air-defence systems`,
    teaser: `Long-range missiles, medium-range missiles, short-range guns and shoulder-fired weapons. Each layer gives another chance.`,
    summary: `On the night of 7 to 8 May 2025, Indian drones flew toward cities across Pakistan, including Lahore and Karachi. Pakistan's military said its forces shot down 25 Israeli-made Harop drones.

It used both soft kill and hard kill. Soft kill means jamming or confusing a drone. Hard kill means hitting it with a weapon.

India said it had hit an air defence system at Lahore. As on other days that week, the 2 sides told different stories.

That night showed a basic truth. No single missile can protect a whole country. Air defence works in layers, so if a layer misses, the next gets a chance.

The Pakistan Army calls its system Comprehensive Layered Integrated Air Defence. It links long, medium and short range weapons with radars.

At long range is the HQ-9 family from China. The army brought the HQ-9/P into service in Karachi on 14 October 2021. The military said it can hit targets more than 100 kilometres away.

The PAF has its own long-range version, the HQ-9BE. Quwa reports an advertised range of up to 260 kilometres against aircraft.

In the middle sits the LY-80, which the army added in March 2017, with a range of about 40 kilometres. The PAF also uses the HQ-16FE, reported to reach up to 160 kilometres.

Closer in are the army's FM-90, with a range of about 15 kilometres, and the PAF's Spada 2000 Plus from the European firm MBDA, which covers about 20 kilometres.

The last layer is very short range missiles used by small teams of soldiers. Some are MANPADS, which means missiles fired from the shoulder. Pakistan makes its own Anza family, and the army also uses the Swedish RBS 70 and the Chinese FN-6 and FN-16.

New layers arrived after 2025. In September 2026, a PAF video showed the Chinese HQ-17AE short-range missile system. It also showed Türkiye's Korkut 35 millimetre anti-aircraft guns and Şahin 40 millimetre anti-drone guns.

Pakistan did not say how many systems it bought.

Missiles are blind without sensors. Ground radars, such as the American TPS-77 sets ordered in 2005, and Saab Erieye radar planes build the air picture, a live map of everything in the sky.

Pakistan's air defence also travels. In May 2026, sources told Reuters that Pakistan had sent an HQ-9 system to Saudi Arabia under the defence pact.

Some reports run ahead of the facts. In June 2025, a government post mentioned a Chinese offer of the HQ-19 missile defence system. The post was later deleted, and no induction has been officially confirmed.

The lesson is patience and detail. Air defence means radars that watch day and night, crews who drill every day, and layers that back each other up.`,
    keyPoints: [
      `Long range: the army's HQ-9/P (in service 14 October 2021, over 100 km) and the PAF's HQ-9BE (up to 260 km reported).`,
      `Medium range: the army's LY-80 (March 2017, about 40 km) and the PAF's HQ-16FE (up to 160 km reported).`,
      `Short range: the FM-90 (about 15 km) and the Spada 2000 Plus (about 20 km). Very short range: Anza, RBS 70 and FN-6/FN-16.`,
      `In September 2026, the PAF showed new HQ-17AE missiles and Turkish Korkut and Şahin guns.`,
      `Radars such as the TPS-77 and Erieye aircraft build the air picture for every layer.`,
      `The HQ-19 was only reported as an offer in June 2025. No induction is confirmed.`,
    ],
    remember: `HQ-9 far, LY-80 and HQ-16 middle, FM-90 and Spada near, Anza on the shoulder. New in 2026 are HQ-17AE, Korkut and Şahin.`,
    whyIssb: `Drones and missiles are now a main threat to Pakistan's cities and bases, as May 2025 showed. Layers of weapons, linked by radars, give defenders several chances to stop each attack. Strong air defence also deters attacks, because an enemy expects to lose more.`,
    watch: [
      `How many HQ-17AE, Korkut and Şahin systems enter service.`,
      `Any official decision on a missile defence system such as the HQ-19.`,
      `Progress on Pakistan's own GIDS LoMADS medium-range missile.`,
    ],
    sources: [
      { title: `Quwa: Pakistan air defence systems guide (updated 16 September 2026)`, url: `https://quwa.org/pakistan/air-defence-pk/` },
      { title: `TURDEF: Pakistan inducts new air defence system HQ-9 (17 October 2021)`, url: `https://turdef.com/article/pakistan-inducts-new-air-defence-system-hq-9` },
      { title: `Dawn: 25 Israeli-made drones shot down, ISPR (8 May 2025)`, url: `https://pass.dawn.com/news/1909390` },
      { title: `Janes: Pakistan fields new air-defence systems (September 2026)`, url: `https://www.janes.com/defence-intelligence-insights/defence-news/defence/special-report-pakistan-fields-new-air-defence-systems` },
      { title: `Reuters: Pakistan deploys jet squadron, thousands of troops to Saudi Arabia (18 May 2026)`, url: `https://www.reuters.com/world/asia-pacific/pakistan-deploys-jet-squadron-thousands-troops-saudi-arabia-during-iran-war-2026-05-18/` },
    ],
  },
  {
    id: 'recent-paf-military',
    category: 'military',
    title: `Recent PAF & military activity`,
    teaser: `From the May 2025 air battle to new pacts and jets, the PAF has been busy.`,
    summary: `Just after midnight on 7 May 2025, PAF radars saw Indian jets gathering near the border, the PAF later said. That night, Indian strikes hit targets in Pakistan and Azad Kashmir.

The crisis had begun on 22 April 2025, when gunmen killed 26 people at Pahalgam in Indian-administered Kashmir. India blamed Pakistan. Pakistan denied any role and offered to join a neutral investigation.

India called its strikes Operation Sindoor. Pakistan says 40 civilians, including 15 children, were killed. 11 members of the armed forces, 5 of them from the PAF, also died.

The PAF said about 70 Indian jets and 40 Pakistani jets took part in the air battle that night.

Pakistan's military now says it shot down 8 Indian aircraft. It lists 4 Rafales, 1 Su-30, 1 MiG-29, 1 Mirage 2000 and 1 large drone. India admits losing aircraft but has not said how many.

On 8 May, 2 US officials told Reuters that a Pakistani J-10 had downed at least 2 Indian aircraft, at least 1 of them a Rafale. India later claimed it shot down Pakistani jets. Pakistan rejects this and says it lost none.

On 10 May, after Indian missiles hit several PAF bases, Pakistan launched Operation Bunyan-um-Marsoos. Pakistan says it struck 26 military targets in India and Indian-administered Kashmir. A ceasefire began that same day.

Pakistan calls the whole conflict, from 22 April to 10 May 2025, Marka-e-Haq, or the Battle of Truth.

On 20 May 2025, General Asim Munir became a Field Marshal. In December 2025, he became Pakistan's first Chief of Defence Forces, a new post that leads joint work across all 3 services. Air Chief Marshal Zaheer Ahmed Babar Sidhu's term was extended to March 2028.

2026 brought new tasks. In April, Pakistani fighter jets reached Saudi Arabia under the defence pact. In May, sources told Reuters about 16 jets, mostly JF-17s, were there.

Since late February 2026, under Operation Ghazab lil Haq, the PAF has struck targets in Afghanistan. Pakistan says it is hitting Afghan Taliban posts and terrorist hideouts after cross-border attacks. The Taliban government says civilians have died, and neither side's figures can be checked independently.

The PAF is also modernising. In December 2025, the United States approved a 686 million dollar F-16 upgrade. In May 2026, the PAF said it plans more J-10C jets and upgraded JF-17s, and has started early cooperation with China on the J-35.

In September 2026, it showed new Chinese and Turkish air defence weapons.

These months teach 2 lessons. Claims are not proof, so careful people say who claimed what. And readiness, not noise, kept the country safe.`,
    keyPoints: [
      `On 22 April 2025, 26 people were killed at Pahalgam. Pakistan denied any role and offered a neutral probe.`,
      `On the night of 6 to 7 May 2025, India struck Pakistan (Operation Sindoor) and a large air battle followed. On 10 May, Pakistan launched Operation Bunyan-um-Marsoos, and a ceasefire began that day.`,
      `Pakistan now says it shot down 8 Indian aircraft, including 4 Rafales. US officials told Reuters a J-10 downed at least 2. India admits losses without giving a number.`,
      `Marka-e-Haq is Pakistan's name for the whole conflict, from 22 April to 10 May 2025.`,
      `Field Marshal Asim Munir became the first Chief of Defence Forces in December 2025. ACM Zaheer Ahmed Babar Sidhu leads the PAF until March 2028.`,
      `2026 brought PAF jets to Saudi Arabia, strikes in Afghanistan, and new fighter and air defence plans.`,
    ],
    remember: `Pahalgam 22 April, Sindoor 7 May, Bunyan-um-Marsoos 10 May. Pakistan claims 8 Indian aircraft, and India admits losses but gives no number.`,
    whyIssb: `May 2025 tested Pakistan's forces against a much larger neighbour, and the PAF's readiness shaped the outcome. Since then, the military has taken on new duties in the Gulf and on the Afghan border. These events, with their claims and their limits, show how deterrence keeps a fragile peace.`,
    watch: [
      `How stable the ceasefire stays on the Line of Control, and any India-Pakistan contacts.`,
      `Pakistan-Afghanistan border strikes and talks.`,
      `Delivery of new J-10C jets, upgraded JF-17s and progress on the J-35.`,
    ],
    sources: [
      { title: `Reuters: Pakistan's Chinese-made jet brought down two Indian aircraft, US officials say (8 May 2025)`, url: `https://www.reuters.com/world/pakistans-chinese-made-jet-brought-down-two-indian-fighter-aircraft-us-officials-2025-05-08/` },
      { title: `Radio Pakistan: Marka-e-Haq comes to victorious end (12 May 2025)`, url: `https://www.radio.gov.pk/12-05-2025/military-campaign-marka-e-comes-to-victorious-end` },
      { title: `Radio Pakistan: DG ISPR on the Marka-e-Haq anniversary (7 May 2026)`, url: `https://www.radio.gov.pk/07-05-2026/pakistan-completely-defeated-india-in-marka-e-haq-dg-ispr` },
      { title: `Dawn: Field Marshal Asim Munir notified as first CDF (5 December 2025)`, url: `https://pass.dawn.com/news/1959310` },
      { title: `Reuters: Pakistani and Afghan Taliban forces clash (28 February 2026)`, url: `https://www.reuters.com/world/asia-pacific/pakistan-afghan-taliban-forces-clash-diplomatic-efforts-intensify-2026-02-28/` },
      { title: `Quwa: PAF lays out next procurement steps (7 May 2026)`, url: `https://quwa.org/pakistan-air-force-news/pakistan-air-force-lays-out-next-procurement-steps-05-07-2026/` },
    ],
  },
  {
    id: 'abhinandan-tea-incident',
    category: 'military',
    title: `Captured pilot & "the tea is fantastic"`,
    teaser: `27 February 2019. A shot-down pilot, a rescue from an angry crowd, and a peace gesture.`,
    summary: `At about 8.45 a.m. on 27 February 2019, villagers in Horran looked up at a dogfight, a close battle between fighter jets. Horran lies in Bhimber district of Azad Kashmir, about 7 kilometres from the Line of Control, the ceasefire line in Kashmir.

A burning jet crashed in an empty field. Nearby, a parachute floated down.

The pilot was Wing Commander Abhinandan Varthaman of the Indian Air Force. The PAF had shot down his MiG-21 Bison.

To understand that morning, go back 2 weeks. On 14 February 2019, a suicide attack at Pulwama in Indian-administered Kashmir killed more than 40 Indian paramilitary police. India blamed a group based in Pakistan.

On 26 February, Indian jets struck near Balakot. India said it hit a militant camp. Pakistan said the bombs fell in an empty area and hit no one.

The next day, the PAF answered with Operation Swift Retort. Pakistan said its jets dropped bombs on open ground near targets across the Line of Control. It said this was deliberate, to show its ability without killing anyone.

In the air battle, Squadron Leader Hasan Siddiqui was credited with downing the MiG-21. Pakistan said a 2nd Indian jet was also shot down, which India denies.

On the ground, angry villagers chased the pilot, and he fired his pistol into the air. Pakistani soldiers reached him and took him away from the crowd.

Later that day, a video showed him holding a cup of tea. He said the officers of the Pakistan Army had looked after him very well. He called them thorough gentlemen, starting with the captain who rescued him from the mob.

Asked about his mission, he said, "I am not supposed to tell you this." Asked about the tea, he said, "The tea is fantastic, thank you."

On 28 February, Prime Minister Imran Khan told a joint session of Parliament that Pakistan would free the pilot as a peace gesture. On 1 March 2019, just before 9 p.m., he walked across the border at Wagah.

India also claimed it had shot down a PAF F-16 that day. In April 2019, Foreign Policy reported that a US count of Pakistan's F-16s found none missing.

The story came back in May 2025, when rumours said another Indian pilot had been captured. On 11 May 2025, Pakistan's military spokesman said clearly that Pakistan held no Indian pilot.

This is a lesson in conduct. The Geneva Conventions, the international rules of war, say a prisoner of war must be treated humanely and protected from violence and insults. Pakistani soldiers saved him from a mob, and Pakistan sent him home within 3 days.

The PAF showed skill in the air. Pakistan showed restraint and dignity on the ground.`,
    keyPoints: [
      `27 February 2019 was PAF Operation Swift Retort, a day after Indian jets struck near Balakot.`,
      `The PAF shot down a MiG-21 Bison. Wing Commander Abhinandan Varthaman came down near Horran village, Bhimber, Azad Kashmir.`,
      `Pakistani soldiers took him from an angry crowd. In a video he said, "The tea is fantastic, thank you."`,
      `PM Imran Khan announced his release as a peace gesture on 28 February. He crossed at Wagah on 1 March 2019.`,
      `India's claim of a downed PAF F-16 was contradicted by a US count reported in April 2019.`,
      `May 2025 was a different conflict. On 11 May 2025, Pakistan's military said it held no Indian pilot.`,
    ],
    remember: `27 February 2019, MiG-21, Abhinandan, "the tea is fantastic". Released at Wagah on 1 March 2019 as a peace gesture.`,
    whyIssb: `How a country treats a captured enemy shows its discipline and values. Pakistan's soldiers protected the pilot, and his quick return helped calm a dangerous crisis between nuclear-armed neighbours. Mixing up 2019 and 2025 spreads false stories, so the dates matter.`,
    sources: [
      { title: `Dawn: Teacup in hand, captured Indian pilot says Pakistan Army has looked after me very well (27 February 2019)`, url: `https://www.dawn.com/news/1466402` },
      { title: `BBC: Abhinandan, villagers recount dramatic capture of pilot (28 February 2019)`, url: `https://www.bbc.com/news/world-asia-47397418` },
      { title: `AP: Pakistan pledges to release captive Indian fighter pilot (28 February 2019)`, url: `https://apnews.com/article/73277bde1f964629bfb5c3b3140e4cab` },
      { title: `Reuters: Pakistan releases captured Indian pilot (1 March 2019)`, url: `https://www.reuters.com/article/world/pakistan-releases-captured-indian-pilot-confrontation-cools-idUSKCN1QI40B/` },
      { title: `Foreign Policy: Did India shoot down a Pakistani jet? US count says no (4 April 2019)`, url: `https://foreignpolicy.com/2019/04/04/did-india-shoot-down-a-pakistani-jet-u-s-count-says-no/` },
      { title: `ICRC: Prisoners of war, what you need to know`, url: `https://www.icrc.org/en/document/prisoners-war-what-you-need-know` },
    ],
  },
];
