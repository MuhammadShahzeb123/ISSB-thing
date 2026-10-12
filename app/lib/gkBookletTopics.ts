import type { GkTopic } from './gkTopics';

// Added 12 October 2026 from the user's "Current Affairs MCQS Booklet" PDF (dated 31 August 2026).
// Every fact re-checked against official or major news sources on 12 October 2026. Where the booklet
// was out of date or wrong (US and Iran ceasefire, Madagascar's leader, Bolivia's date, revised per
// capita income, 2026 Nobel Prizes) the verified fact is used.

export const gkBookletTopics: readonly GkTopic[] = [
  {
    id: 'pakistan-economy-2026',
    category: 'pakistan',
    title: `Pakistan's economy in numbers, Economic Survey 2025-26`,
    teaser: `3.7% growth, $1,901 per person, 252 million people. The numbers every interview panel expects you to know.`,
    summary: `Every June, a day before the budget, the Finance Minister stands up with a thick book. It is the Pakistan Economic Survey, the country's report card for the year. In June 2026 Muhammad Aurangzeb presented the survey for 2025-26.

The headline was growth. The economy grew 3.70%, up from 3.18% the year before. The whole economy was worth about Rs 126.9 trillion, or about $452 billion.

Divide that by the people and you get per capita income. It rose to $1,901, from $1,751. The rupee stayed steady at about Rs 280 to the dollar.

Farming grew 2.89%. Industry grew 3.51%, pulled up by large factories, which grew 6.11%. Services, the biggest part of the economy at about 58%, grew 4.09%.

Prices told a mixed story. Average inflation from July to April was 6.2%, higher than 4.7% the year before. When world oil prices jumped during the Iran war, inflation in April 2026 touched 10.9%.

The government spent more carefully. From July to March the budget deficit fell to 0.7% of GDP, and the primary balance, spending without interest, showed a surplus of 3.2%.

Overseas Pakistanis kept the country afloat. They sent home $30.3 billion in nine months, 8.2% more than before. Reserves stood at about $21.8 billion at the end of March 2026.

But the debt is heavy. Total public debt reached about Rs 83.3 trillion, around Rs 57.6 trillion inside the country and Rs 25.7 trillion from abroad.

People matter most. The survey counts about 252 million Pakistanis. Literacy rose to 63%. Unemployment rose to 7.1%. The 2025 monsoon floods killed more than 1,000 people, a reminder that climate is part of the economy too.

So what does it mean? Pakistan has steadied after a near default in 2023. Growth is back, but it is slow, debt is high, and too few people pay tax. A candidate who knows these few numbers can speak about the economy with confidence.`,
    keyPoints: [
      `Economic Survey 2025-26, presented June 2026 by Finance Minister Muhammad Aurangzeb.`,
      `GDP growth 3.70% (FY2025: 3.18%). Size about Rs 126.9 trillion (about $452 billion).`,
      `Per capita income $1,901 (FY2025 revised: $1,751). Rupee about Rs 280 per $.`,
      `Agriculture 2.89%, industry 3.51% (large-scale manufacturing 6.11%), services 4.09% and about 58% of GDP.`,
      `Average CPI inflation July to April 6.2%. April 2026 year on year 10.9% after the oil shock.`,
      `Fiscal deficit July to March 0.7% of GDP. Primary surplus 3.2%.`,
      `Remittances $30.3 billion (July to March, up 8.2%). Reserves about $21.8 billion (end March 2026).`,
      `Public debt about Rs 83.3 trillion (domestic Rs 57.6 trillion, external Rs 25.7 trillion).`,
      `Population about 252 million. Literacy 63%. Unemployment 7.1%.`,
    ],
    remember: `3.7% growth, $1,901 per person, 252 million people, 63% literate, debt about Rs 83 trillion.`,
    whyIssb: `Panels ask simple economy questions to see if you follow the news. Quote 2 or 3 numbers, give the year, and say what they mean.`,
    watch: [
      `Older notes say per capita income was $1,824 in 2024-25. The 2025-26 survey revised that year to $1,751.`,
      `Many figures cover only July to March or July to April. Say "in the first 9 months" when you quote them.`,
    ],
    sources: [
      { title: `Finance Division: Pakistan Economic Survey 2025-26 (chapters)`, url: `https://www.finance.gov.pk/survey_2026.html` },
      { title: `Finance Division: Highlights, Pakistan Economic Survey 2025-26`, url: `https://finance.gov.pk/survey/chapter_26/Highlights_of_the_PES_2026.pdf` },
      { title: `NDMA: Monsoon 2025 consolidated report (1,037 deaths)`, url: `https://www.ndma.gov.pk/storage/publications/November2025/FweqUWhEX19cob8DvM4L.pdf` },
    ],
  },
  {
    id: 'wars-2025-2026',
    category: 'world',
    title: `The wars of 2025 and 2026, from Sindoor to the Strait of Hormuz`,
    teaser: `Bunyan um Marsoos, Midnight Hammer, Ghazab lil Haq, Epic Fury. Who fought whom, and where things stand in October 2026.`,
    summary: `Since 2025, the region around Pakistan has hardly had a quiet month. Wars now come with code names, and examiners love to ask them.

It began on 7 May 2025. After the Pahalgam attack in Kashmir, India struck Pakistan and called it Operation Sindoor. Pakistan hit back on 10 May with Operation Bunyan um Marsoos, meaning a wall of lead. The same day a ceasefire was announced. Pakistan thanked the United States for helping, while India said the 2 armies agreed it directly.

A month later, on 13 June 2025, Israel attacked Iran in Operation Rising Lion. On 22 June American bombers hit Iran's nuclear sites in Operation Midnight Hammer. A ceasefire came on 24 June, after 12 days.

Then Pakistan's western border caught fire. In October 2025 Afghan Taliban forces attacked border posts, and Qatar and Türkiye helped arrange a ceasefire. Attacks by militants based in Afghanistan continued. On the night of 26 February 2026, Pakistan launched Operation Ghazab lil Haq, Righteous Fury, against the Taliban regime and its terrorist allies. A short pause was kept for Eid in March 2026, but the operation went on, and there is still no lasting ceasefire.

Two days later, on 28 February 2026, the United States and Israel struck Iran again. America called it Operation Epic Fury. Iran's Supreme Leader, Ayatollah Ali Khamenei, was killed, and his son Mojtaba Khamenei became the third Supreme Leader. After 38 days a ceasefire began on 7 April 2026. It broke down in July when Iran attacked ships in the Strait of Hormuz and America struck back. In October 2026 the 2 sides are still talking, with no final deal.

Older wars go on too. Russia and Ukraine have fought since February 2022. Sudan's army and the Rapid Support Forces since April 2023. Israel's war on Gaza began in October 2023. Myanmar, Yemen and eastern Congo are still at war.

Why does this matter for Pakistan? Oil prices, trade routes and our 2 long borders all depend on these fights. A future officer must know who fought whom, when, and where it stands now.`,
    keyPoints: [
      `India and Pakistan, 7 to 10 May 2025: India's Operation Sindoor, Pakistan's Operation Bunyan um Marsoos. Ceasefire 10 May 2025.`,
      `Israel and Iran, 13 to 24 June 2025: Israel's Operation Rising Lion. US Operation Midnight Hammer on Iran's nuclear sites, 22 June.`,
      `Pakistan and Afghanistan: border clashes October 2025 (Qatar and Türkiye mediated). Operation Ghazab lil Haq from 26 February 2026. Eid pause 19 to 24 March, then resumed. No lasting ceasefire as of October 2026.`,
      `US and Israel against Iran from 28 February 2026: US Operation Epic Fury. Ali Khamenei killed. Mojtaba Khamenei named third Supreme Leader (8 to 9 March 2026).`,
      `Ceasefire 7 April 2026 after 38 days. Broke down in July 2026 over attacks on shipping in the Strait of Hormuz. Talks continue in October 2026.`,
      `Still ongoing: Russia and Ukraine (Feb 2022), Sudan SAF vs RSF (Apr 2023), Gaza (Oct 2023), Myanmar, Yemen, DR Congo and M23.`,
    ],
    remember: `Sindoor and Bunyan um Marsoos (May 2025). Midnight Hammer (June 2025). Ghazab lil Haq (Feb 2026). Epic Fury (Feb 2026).`,
    whyIssb: `You may be asked about any of these. Give the date, the sides, the operation name and the status today, calmly and without slogans.`,
    watch: [
      `The booklet (August 2026) calls the US and Iran ceasefire fragile but holding since April. It actually broke down in July 2026.`,
      `On the May 2025 ceasefire, Pakistan credits US help while India says it was agreed directly between the 2 militaries. Mention both if asked.`,
    ],
    sources: [
      { title: `Geo News, 26 Feb 2026: Operation Ghazab lil Haq launched`, url: `https://www.geo.tv/latest/653134-pakistan-forces-give-effective-response-to-taliban-regimes-unprovoked-border-action-info-ministry` },
      { title: `Dawn: Temporary pause in Operation Ghazab lil Haq has concluded, FO says`, url: `https://www.dawn.com/news/1985608` },
      { title: `US Department of War, Apr 2026: Epic Fury quelled for now`, url: `https://www.war.gov/News/News-Stories/Article/Article/4454276/epic-fury-quelled-for-now-objectives-accomplished-us-forces-remain-ready/` },
      { title: `BBC, 8 Mar 2026: Mojtaba Khamenei to succeed his father`, url: `https://www.bbc.com/news/articles/c043260749ko` },
      { title: `AP: A timeline of the Iran war and talks aimed at ending it`, url: `https://apnews.com/article/iran-us-timeline-trump-hormuz-war-ceasefire-04da58cbae991183f8b52ef5bf615963` },
      { title: `CFR Global Conflict Tracker: Conflict between Afghanistan and Pakistan`, url: `https://www.cfr.org/global-conflict-tracker/conflict/war-afghanistan` },
    ],
  },
  {
    id: 'new-world-leaders-2025-2026',
    category: 'world',
    title: `New faces in power, world leaders 2025 and 2026`,
    teaser: `Trump again, Carney, Merz, Takaichi, Tarique Rahman, Balen Shah. Who took charge, and where.`,
    summary: `Leaders change, and the old answer in your notebook can become wrong overnight. Since January 2025 many countries have new faces at the top.

Start with the big powers. Donald Trump returned to the White House on 20 January 2025 as the 47th President of the United States. He had also been the 45th. In Canada, Mark Carney became Prime Minister on 14 March 2025. In Germany, Friedrich Merz became Chancellor on 6 May 2025.

In Asia, Lee Jae myung became President of South Korea on 4 June 2025, after his predecessor was removed. In Japan, Sanae Takaichi became the first woman Prime Minister on 21 October 2025.

Europe kept changing. Karol Nawrocki became President of Poland on 6 August 2025. In France, Sébastien Lecornu was named Prime Minister in September 2025 and named again in October. In the Czech Republic, Andrej Babiš returned as Prime Minister in December 2025.

In Africa, Netumbo Nandi Ndaitwah became Namibia's first woman President in March 2025. In Madagascar, protests forced out the President, and Colonel Michael Randrianirina of the army was sworn in on 17 October 2025.

Latin America moved too. Rodrigo Paz became President of Bolivia on 8 November 2025. José Antonio Kast took office in Chile on 11 March 2026.

Now our own neighbourhood. In Bangladesh, the BNP won a landslide election, and Tarique Rahman became Prime Minister on 17 February 2026. In Nepal, after the youth protests of 2025, the former rapper and Kathmandu mayor Balendra Shah, known as Balen, became Prime Minister on 27 March 2026, aged 35. In Iran, after Ali Khamenei was killed in war, his son Mojtaba Khamenei became Supreme Leader in March 2026.

Why learn these? Pakistan deals with every one of these governments. When the panel asks who leads Bangladesh or Iran today, the right answer shows that you read the news, not just old books.`,
    keyPoints: [
      `USA: Donald Trump, 47th President (also 45th), 20 Jan 2025.`,
      `Canada: PM Mark Carney, 14 Mar 2025. Germany: Chancellor Friedrich Merz, 6 May 2025.`,
      `South Korea: President Lee Jae myung, 4 Jun 2025. Japan: PM Sanae Takaichi, first woman, 21 Oct 2025.`,
      `Poland: President Karol Nawrocki, 6 Aug 2025. France: PM Sébastien Lecornu, Sep 2025 (named again Oct 2025). Czech Republic: PM Andrej Babiš, Dec 2025.`,
      `Namibia: President Netumbo Nandi Ndaitwah, first woman, Mar 2025. Madagascar: Col. Michael Randrianirina, 17 Oct 2025, after a military takeover.`,
      `Bolivia: President Rodrigo Paz, 8 Nov 2025. Chile: President José Antonio Kast, 11 Mar 2026.`,
      `Bangladesh: PM Tarique Rahman (BNP), 17 Feb 2026. Nepal: PM Balendra (Balen) Shah, 27 Mar 2026. Iran: Supreme Leader Mojtaba Khamenei, Mar 2026.`,
    ],
    remember: `Neighbours: Tarique Rahman (Bangladesh), Balen Shah (Nepal), Mojtaba Khamenei (Iran).`,
    whyIssb: `"Who is the Prime Minister of ...?" is a quick test of whether you follow the news. Give the name and when they took office.`,
    watch: [
      `The booklet names Madagascar's leader as "Michael Rajoelina". He is Colonel Michael Randrianirina. Andry Rajoelina was the President he replaced.`,
      `The booklet dates Rodrigo Paz to 19 October 2025. That was the run-off vote. He took office on 8 November 2025.`,
    ],
    sources: [
      { title: `Reuters, 17 Feb 2026: Tarique Rahman sworn in as Bangladesh's PM`, url: `https://www.reuters.com/world/asia-pacific/tarique-rahman-sworn-bangladeshs-pm-after-landslide-election-victory-2026-02-17/` },
      { title: `Reuters, 27 Mar 2026: Shah sworn in as Nepal prime minister`, url: `https://www.reuters.com/world/china/ex-rapper-shah-sworn-nepal-prime-minister-after-sweeping-election-win-2026-03-27/` },
      { title: `AP: Kast takes office in Chile`, url: `https://apnews.com/article/chile-kast-inauguration-new-administration-00d398c96e0ff25378838dc8831dcbe8` },
      { title: `BBC: Colonel Michael Randrianirina sworn in as Madagascar's president`, url: `https://www.bbc.com/news/articles/cr7mn1n53jno` },
      { title: `CBS News, 9 Mar 2026: Iran names Mojtaba Khamenei new supreme leader`, url: `https://www.cbsnews.com/news/mojtaba-khamenei-iran-new-supreme-leader/` },
    ],
  },
  {
    id: 'nobel-prizes-2025-2026',
    category: 'world',
    title: `Nobel Prizes 2025 and 2026`,
    teaser: `Machado and Navi Pillay for peace, optogenetics, neutrinos and metal organic frameworks. The winners in plain words.`,
    summary: `Every October a phone rings early in the morning somewhere in the world. A voice from Stockholm or Oslo says, you have won the Nobel Prize. Here are the latest winners, and what they did.

First, 2025. The Peace Prize went to María Corina Machado of Venezuela, for her long, peaceful struggle for democracy in her country.

The Physics Prize went to John Clarke, Michel Devoret and John Martinis. They showed that strange quantum effects can happen in an electric circuit big enough to hold in your hand. That work helps build quantum computers.

Chemistry went to Susumu Kitagawa, Richard Robson and Omar Yaghi for metal organic frameworks. These are crystals full of tiny rooms that can catch water from desert air or trap carbon dioxide.

Medicine went to Mary Brunkow, Fred Ramsdell and Shimon Sakaguchi, who found the regulatory T cells that stop our immune system from attacking our own body.

Literature went to László Krasznahorkai of Hungary. Economics went to Joel Mokyr, Philippe Aghion and Peter Howitt, for explaining how new ideas and technology drive growth.

Now 2026, announced this October. Medicine went to Karl Deisseroth, Peter Hegemann and Georg Nagel for optogenetics, a way to switch brain cells on and off with light.

Physics went to Francis Halzen, who led the IceCube observatory buried in the ice of the South Pole. It caught tiny particles called neutrinos coming from deep space.

Chemistry went to Henri Kagan and Kenso Soai, who showed how molecules can come out in only one mirror image form, a puzzle at the heart of life and medicine.

Literature went to the Canadian poet Anne Carson. The Peace Prize went to Navi Pillay of South Africa, a judge and former UN human rights chief, for her work for peace and international law. Economics went to Robert Hall and Michael Woodford, for showing how the economy can be kept steady.

Remember our own story too. Abdus Salam won the Physics Prize in 1979, and Malala Yousafzai won the Peace Prize in 2014. They are Pakistan's 2 Nobel laureates.`,
    keyPoints: [
      `2025 Peace: María Corina Machado (Venezuela). Literature: László Krasznahorkai (Hungary).`,
      `2025 Physics: John Clarke, Michel Devoret, John Martinis (quantum effects in an electric circuit).`,
      `2025 Chemistry: Susumu Kitagawa, Richard Robson, Omar Yaghi (metal organic frameworks).`,
      `2025 Medicine: Mary Brunkow, Fred Ramsdell, Shimon Sakaguchi (regulatory T cells). 2025 Economics: Joel Mokyr, Philippe Aghion, Peter Howitt (innovation-driven growth).`,
      `2026 Medicine: Karl Deisseroth, Peter Hegemann, Georg Nagel (optogenetics). 2026 Physics: Francis Halzen (IceCube, cosmic neutrinos).`,
      `2026 Chemistry: Henri Kagan, Kenso Soai (asymmetric synthesis). 2026 Literature: Anne Carson (Canada). 2026 Peace: Navi Pillay (South Africa). 2026 Economics: Robert Hall, Michael Woodford.`,
      `Pakistan's laureates: Dr Abdus Salam (Physics 1979), Malala Yousafzai (Peace 2014).`,
    ],
    remember: `Peace 2025 Machado, Peace 2026 Navi Pillay. Pakistan: Abdus Salam 1979, Malala 2014.`,
    whyIssb: `Nobel questions are common in GK tests. Know at least the Peace and Literature winners and one line on why.`,
    watch: [
      `The booklet stops at 2025. The 2026 prizes were announced from 5 to 12 October 2026.`,
    ],
    sources: [
      { title: `NobelPrize.org: All Nobel Prizes 2026`, url: `https://www.nobelprize.org/all-nobel-prizes-2026/` },
      { title: `NobelPrize.org: All Nobel Prizes (list)`, url: `https://www.nobelprize.org/prizes/lists/all-nobel-prizes/` },
      { title: `NobelPrize.org: Nobel Prize in Physics 2026 press release`, url: `https://www.nobelprize.org/prizes/physics/2026/press-release/` },
    ],
  },
  {
    id: 'sports-champions-2025-2026',
    category: 'general',
    title: `Champions of 2025 and 2026, cricket, football and tennis`,
    teaser: `India's run of cricket titles, Pakistan's Under 19 triumph, Zalmi's PSL and Spain's World Cup.`,
    summary: `Sport questions are the easiest marks in a GK test, if you know who lifted the trophy. Here are the big winners of 2025 and 2026.

In February and March 2025 Pakistan hosted the ICC Champions Trophy, its first ICC event in nearly 30 years. India played its matches in Dubai and won the final there, beating New Zealand by 4 wickets.

In September 2025 India beat Pakistan by 5 wickets in the Asia Cup final in Dubai. In December Pakistan's young players hit back. In the Under 19 Asia Cup final, Pakistan beat India by 191 runs, and Sameer Minhas scored a stunning 172.

In women's cricket, India won its first 50 over World Cup in November 2025, beating South Africa in Navi Mumbai. In July 2026 Australia beat England at Lord's to win the Women's T20 World Cup for the 7th time.

India also won the men's T20 World Cup in March 2026, beating New Zealand by 96 runs in Ahmedabad.

At home, Lahore Qalandars won PSL 10 in May 2025. Peshawar Zalmi won PSL 11 in May 2026, beating the new team Hyderabad Kingsmen, and lifted their 2nd title. In India, Royal Challengers Bengaluru won their first IPL in 2025.

In football, the 2026 World Cup was the first with 48 teams, hosted by the United States, Canada and Mexico. On 19 July 2026 Spain beat Argentina 1 to 0 after extra time in New Jersey. Ferran Torres scored, and Spain won their 2nd World Cup.

In tennis, 2025 belonged to 2 young men. Jannik Sinner won the Australian Open and Wimbledon. Carlos Alcaraz won the French Open and the US Open. Among women, Madison Keys, Coco Gauff, Iga Świątek and Aryna Sabalenka each won one.

Why does sport matter in an interview? It shows you follow the world beyond books, and teamwork on the field is a lesson every officer understands.`,
    keyPoints: [
      `ICC Champions Trophy 2025: hosted by Pakistan (India's games in Dubai). India beat New Zealand by 4 wickets, 9 Mar 2025.`,
      `Asia Cup 2025 (UAE): India beat Pakistan by 5 wickets, 28 Sep 2025.`,
      `U19 Asia Cup 2025: Pakistan beat India by 191 runs, 21 Dec 2025. Sameer Minhas 172.`,
      `Women's ODI World Cup 2025: India's first title (beat South Africa, Navi Mumbai, 2 Nov 2025).`,
      `Men's T20 World Cup 2026: India beat New Zealand by 96 runs, Ahmedabad, 8 Mar 2026.`,
      `Women's T20 World Cup 2026: Australia beat England by 7 wickets at Lord's, 5 Jul 2026 (7th title).`,
      `PSL 10 (2025): Lahore Qalandars. PSL 11 (2026): Peshawar Zalmi beat Hyderabad Kingsmen, 3 May 2026 (2nd title). IPL 2025: RCB (first title).`,
      `FIFA World Cup 2026 (USA, Canada, Mexico, 48 teams): Spain 1 to 0 Argentina after extra time, 19 Jul 2026. Ferran Torres. Spain's 2nd title.`,
      `Tennis 2025: Sinner (Australian Open, Wimbledon), Alcaraz (French Open, US Open). Women: Keys, Gauff, Świątek, Sabalenka.`,
    ],
    remember: `India: Champions Trophy 2025, Asia Cup 2025, T20 WC 2026. Pakistan: U19 Asia Cup 2025. Spain: FIFA WC 2026.`,
    whyIssb: `A quick sports question checks if you follow current events. Know the winner, the runner-up and the year.`,
    sources: [
      { title: `Al Jazeera: Champions Trophy 2025 final, India beat New Zealand`, url: `https://www.aljazeera.com/sports/2025/3/9/icc-champions-trophy-2025-final-india-beats-new-zealand-by-four-wickets` },
      { title: `ESPNcricinfo: Asia Cup 2025 final report`, url: `https://www.espncricinfo.com/series/men-s-t20-asia-cup-2025-1496919/india-vs-pakistan-final-1496938/match-report` },
      { title: `PCB: Sameer Minhas leads Pakistan U19 to Asia Cup glory`, url: `https://www.pcb.com.pk/news-detail/sameer-minhas-leads-pakistan-u19-to-acc-men-s-u19-asia-cup-glory.html` },
      { title: `BBC Sport: India beat New Zealand to defend T20 World Cup title`, url: `https://www.bbc.com/sport/cricket/articles/c15x2denz30o` },
      { title: `BBC Sport: Australia thrash England to win seventh T20 title`, url: `https://www.bbc.com/sport/cricket/articles/clywwv37l41o` },
      { title: `Dawn: Peshawar Zalmi lift PSL trophy a second time`, url: `https://www.dawn.com/news/1997223` },
      { title: `FIFA: Spain crowned World Cup 2026 champions`, url: `https://inside.fifa.com/news/spain-crowned-world-cup-2026-champions-new-york-new-jersey` },
    ],
  },
];
