import type { GkTopic } from './gkTopics';

// World records and world rivers, added 9 October 2026 from the user's PDFs
// (World GK records booklet, Major Rivers of the World map). Every fact re-checked against current sources;
// where the PDF was out of date (most populous country and city, highest road, longest platform, largest sea,
// coldest planet, tallest dam, largest museum) the verified fact is used.

export const gkWorldTopics: readonly GkTopic[] = [
  {
    id: 'world-records-nature',
    category: 'geography',
    title: `World records of nature, the biggest, highest and deepest`,
    teaser: `The deepest ocean, the largest lake, the fastest bird. And 3 quiz answers that old books get wrong.`,
    summary: `Open any quiz book and the same questions come back. Which is the biggest, the highest, the deepest? Nature holds most of the answers, and each answer tells a story about our planet.

Start with water. The Pacific is the largest and deepest ocean. Its Mariana Trench drops to almost 11,000 metres, deeper than Everest is tall.

The Caspian Sea is the largest lake on Earth, even though its water is salty. Lake Baikal in Russia is the deepest lake, about 1,642 metres, and it holds the most fresh water. Lake Superior in North America has the widest surface of any freshwater lake.

Which is the largest sea? Many old books say the South China Sea. Measured by area, the Philippine Sea is bigger, at about 5.7 million square kilometres. The Sea of Marmara in Türkiye is usually called the smallest sea.

The shore of the Dead Sea, between Jordan and the West Bank, is the lowest dry land on Earth, about 430 metres below sea level.

The Gulf of Mexico is the largest gulf, and the Bay of Bengal is the largest bay. The United States now calls the gulf the Gulf of America, but most of the world still uses the old name. The Ganges and the Brahmaputra build the largest delta, shared by Bangladesh and India.

Now the land. Greenland is the largest island and the Arabian Peninsula is the largest peninsula. Asia is the largest continent and Australia the smallest.

The Tibetan Plateau is the highest and largest plateau, the roof of the world. The Himalayas are the highest mountain range, while the Andes in South America are the longest.

Mauna Loa in Hawaii is the largest active volcano. In 2020 scientists showed that Puhahonu, an old volcano under the sea nearby, is even bigger, but it is long dead.

Mount Wycheproof in Australia is often called the smallest mountain. It rises only about 43 metres above the plain around it.

Some places hold weather records. Mawsynram in India, close to Bangladesh, is the wettest place, with nearly 12,000 millimetres of rain in a year. Death Valley in the United States holds the hottest air temperature ever recorded, 56.7 degrees Celsius, in 1913.

Khone Falls on the Mekong in Laos is the widest waterfall, more than 10 kilometres across. The highest lake is a small crater lake on Ojos del Salado, a volcano on the border of Chile and Argentina, at about 6,390 metres. Lake Titicaca is the highest lake that big boats sail on.

Look up too. Uranus has the coldest temperature measured on any planet, about minus 224 degrees Celsius, even though Neptune is farther from the Sun.

Then the living records. The blue whale is the largest animal that has ever lived. On land the African bush elephant is the biggest and the giraffe is the tallest.

The cheetah is the fastest runner. The peregrine falcon, diving for its prey at more than 300 kilometres an hour, is the fastest bird and the fastest animal of all. The ostrich is the largest bird, and the wandering albatross, with wings up to about 3.5 metres wide, is the largest seabird.

The largest single flower is Rafflesia arnoldii, from the forests of Sumatra and Borneo. It can grow almost 1 metre across, and it smells like rotting meat to attract flies.

These records are not just numbers. The Himalayas and the Tibetan Plateau store the ice that feeds our rivers, and the monsoon that soaks Mawsynram is the same monsoon that waters Pakistan. Learn the records of nature and you learn how our own region works.`,
    keyPoints: [
      `Pacific: largest and deepest ocean. Mariana Trench almost 11,000 m.`,
      `Caspian Sea: largest lake (salty). Baikal: deepest lake, about 1,642 m, most fresh water. Superior: largest freshwater lake by surface.`,
      `Largest sea: the Philippine Sea, about 5.7 million km². Older lists say the South China Sea (about 3.5 million km²). Smallest sea: Sea of Marmara.`,
      `Dead Sea shore: lowest land, about 430 m below sea level. Largest gulf: Gulf of Mexico. Largest bay: Bay of Bengal. Largest delta: Ganges-Brahmaputra.`,
      `Greenland largest island, Arabia largest peninsula, Asia largest continent, Australia smallest.`,
      `Tibetan Plateau highest plateau. Himalayas highest range. Andes longest range.`,
      `Mauna Loa: largest active volcano. Pūhāhonu (extinct, under the sea) is bigger overall.`,
      `Wettest: Mawsynram, India. Hottest air temperature: Death Valley, 56.7 °C (1913). Widest waterfall: Khone Falls, Laos.`,
      `Highest lake: crater lake on Ojos del Salado, about 6,390 m. Titicaca is the highest navigable lake.`,
      `Coldest planet: Uranus (about minus 224 °C measured), not Neptune.`,
      `Blue whale largest animal. Bush elephant largest land animal. Giraffe tallest. Cheetah fastest on land. Peregrine falcon fastest bird. Ostrich largest bird. Wandering albatross largest seabird. Rafflesia arnoldii largest flower.`,
    ],
    remember: `Pacific deepest ocean, Caspian largest lake, Baikal deepest lake, Philippine Sea largest sea, Greenland largest island, Uranus coldest planet, blue whale largest animal, peregrine falcon fastest.`,
    whyIssb: `The ice of the Himalayas and the Tibetan Plateau feeds the Indus, and the same monsoon that makes Mawsynram the wettest place waters our crops. Records about nature are really facts about the water, weather and land our region depends on.`,
    sources: [
      { title: `NOAA Ocean Explorer: How deep is the Mariana Trench?`, url: `https://oceanexplorer.noaa.gov/facts/mariana-trench.html` },
      { title: `Britannica: Lake Baikal`, url: `https://www.britannica.com/place/Lake-Baikal` },
      { title: `Britannica: Caspian Sea`, url: `https://www.britannica.com/place/Caspian-Sea` },
      { title: `Britannica: Philippine Sea`, url: `https://www.britannica.com/place/Philippine-Sea` },
      { title: `Britannica: Dead Sea`, url: `https://www.britannica.com/place/Dead-Sea` },
      { title: `USGS: Geology and history of Mauna Loa`, url: `https://www.usgs.gov/volcanoes/mauna-loa/science/geology-and-history-mauna-loa` },
      { title: `University of Hawaii: Largest, hottest shield volcano discovered (Pūhāhonu, 15 May 2020)`, url: `https://www.hawaii.edu/news/2020/05/15/largest-hottest-shield-volcano/` },
      { title: `Guinness World Records: Highest average annual rainfall (Mawsynram)`, url: `https://www.guinnessworldrecords.com/world-records/highest-average-annual-rainfall` },
      { title: `WMO: World weather and climate extremes archive (Death Valley, 56.7 °C)`, url: `https://wmo.asu.edu/content/world-highest-temperature` },
      { title: `NASA Science: Uranus facts (coldest planetary atmosphere)`, url: `https://science.nasa.gov/uranus/facts/` },
      { title: `Britannica: Ojos del Salado`, url: `https://www.britannica.com/place/Ojos-del-Salado` },
      { title: `Britannica: Peregrine falcon`, url: `https://www.britannica.com/animal/peregrine-falcon` },
      { title: `Britannica: Rafflesia`, url: `https://www.britannica.com/plant/Rafflesia` },
    ],
  },
  {
    id: 'world-records-man-made',
    category: 'world',
    title: `World records built by people, tallest, longest and largest`,
    teaser: `Burj Khalifa, Gotthard, Hubballi and a new tallest dam in 2026. Records move, so learn the year too.`,
    summary: `People keep breaking their own records. A building that is the tallest today may be second in 10 years. That is why a smart candidate gives the record and the year.

Start with height. Burj Khalifa in Dubai is still the tallest building, 828 metres. Jeddah Tower in Saudi Arabia is rising toward more than 1,000 metres and should open in late 2028.

Tokyo Skytree, 634 metres, is the tallest tower. A tower is not a building that people live or work in. King Fahd's Fountain in Jeddah throws water up to about 312 metres, the tallest fountain on Earth.

The tallest minaret stands at Djamaa el Djazair, the Great Mosque of Algiers, about 265 metres high.

Faith has its own records. Masjid al Haram in Makkah is the largest mosque. Angkor Wat in Cambodia is the largest religious monument. Saint Peter's Basilica in Vatican City is the largest church. Old books call it a cathedral, but strictly it is a basilica.

Wadi al Salam in Najaf, Iraq, is the largest cemetery. The Ramanathaswamy Temple in Rameswaram, India, has the longest temple corridor. The Mahabharata, the old epic of India, is the longest epic poem.

Museums changed recently. For years the Louvre in Paris was called the biggest museum. Then the Grand Egyptian Museum near the Giza pyramids opened fully in November 2025. It covers about 500,000 square metres, more than the Louvre. The Louvre is still the largest art museum. The Library of Congress in Washington is the largest library.

Now travel. The Trans Siberian Railway, about 9,289 kilometres from Moscow to Vladivostok, is the longest railway line. The Gotthard Base Tunnel in Switzerland, 57 kilometres, is the longest railway tunnel.

The Danyang Kunshan Grand Bridge in China, about 164 kilometres, is the longest bridge. The Grand Canal of China, about 1,800 kilometres, is the longest canal. The Great Wall of China, more than 21,000 kilometres with all its branches, is the longest wall.

The Airbus A380 is the biggest passenger plane. Daocheng Yading Airport in Sichuan, China, at 4,411 metres, is the highest airport.

Roads moved twice. Khardung La in Ladakh was famous for years. Then Umling La took the Guinness record in 2021 at 5,798 metres. In October 2025 India's Border Roads Organisation opened a road over Mig La, about 5,913 metres, and called it the new highest road.

Hubballi station in India has the longest railway platform, 1,507 metres, a Guinness record since 2023. Grand Central Terminal in New York has the most platforms, 44.

The Narendra Modi Stadium in Ahmedabad, with about 132,000 seats, is the largest stadium. Istana Nurul Iman in Brunei is the largest palace that is lived in. Northeast Greenland National Park is the largest national park.

The Cullinan, found in South Africa in 1905, is the largest gem diamond ever found, 3,106 carats. Pieces of it sit in the British Crown Jewels.

Dams tell a Pakistan story. Tarbela is still the largest earth and rock fill dam by volume. Three Gorges in China makes the most power. The tallest dam changed in 2026. Shuangjiangkou in China, 315 metres, began making power in June 2026 and passed Jinping I, at 305 metres.

High cities are next. La Paz in Bolivia is the highest seat of government, about 3,650 metres. El Alto next door is higher, and La Rinconada in Peru, about 5,100 metres, is the highest town where people live all year. India also has the highest cinema, a small inflatable theatre in Ladakh opened in 2021.

2 people records changed too. India passed China as the most populous country in April 2023, says the UN. In November 2025 the UN named Jakarta the largest city, with about 42 million people, ahead of Dhaka and Tokyo. It used a new way of drawing city limits. The same report expects Karachi to enter the top 10 by 2030. Russia is still the largest country by area.

Look closely and you see a pattern. Many new records come from Asia, from China, India and the Gulf. Pakistan's own Tarbela still stands on the list. The lesson is simple. Build big, but build what your people really need.`,
    keyPoints: [
      `Tallest building: Burj Khalifa, Dubai, 828 m. Jeddah Tower (planned 1,000 m+) targets late 2028.`,
      `Tallest tower: Tokyo Skytree, 634 m. Tallest fountain: King Fahd's Fountain, Jeddah, about 312 m. Tallest minaret: Djamaa el Djazaïr, Algiers, about 265 m.`,
      `Largest mosque: Masjid al-Haram. Largest religious monument: Angkor Wat. Largest church: St Peter's Basilica (a basilica, not a cathedral). Largest cemetery: Wadi al-Salam, Najaf.`,
      `Largest museum: Grand Egyptian Museum (about 500,000 m², fully open November 2025). Largest art museum: the Louvre. Largest library: Library of Congress.`,
      `Longest railway line: Trans-Siberian, about 9,289 km. Longest rail tunnel: Gotthard Base, 57 km. Longest bridge: Danyang-Kunshan, about 164 km. Longest canal: Grand Canal of China. Longest wall: Great Wall, 21,196 km (2012 survey).`,
      `Biggest passenger plane: Airbus A380. Highest airport: Daocheng Yading, 4,411 m.`,
      `Highest road: Umling La, 5,798 m (Guinness, 2021). India says Mig La, about 5,913 m (October 2025), is now higher. Khardung La is no longer the answer.`,
      `Longest platform: Hubballi, India, 1,507 m (Guinness, 2023). Most platforms: Grand Central Terminal, 44.`,
      `Largest stadium: Narendra Modi Stadium, about 132,000. Largest residential palace: Istana Nurul Iman, Brunei. Largest national park: Northeast Greenland.`,
      `Largest gem diamond: Cullinan, 3,106 carats (1905).`,
      `Dams: Tarbela largest by volume. Three Gorges most power. Tallest: Shuangjiangkou, 315 m (first power June 2026), passing Jinping-I (305 m).`,
      `Highest capital (seat of government): La Paz, about 3,650 m. Highest town: La Rinconada, Peru, about 5,100 m.`,
      `Most populous country: India (since April 2023). Largest city: Jakarta, about 42 million (UN, November 2025). Largest country: Russia.`,
    ],
    remember: `Burj Khalifa tallest building, Skytree tallest tower, Gotthard longest rail tunnel, Danyang Kunshan longest bridge, Hubballi longest platform, Shuangjiangkou tallest dam, India most people, Jakarta biggest city.`,
    whyIssb: `Records built by people show who is investing in the future. Most new ones come from Asia and the Gulf, and Pakistan still holds one with Tarbela. Knowing the latest record, and the year it changed, shows you follow the world instead of repeating an old book.`,
    sources: [
      { title: `AGBI: World's tallest tower to open in Jeddah in late 2028 (October 2026)`, url: `https://www.agbi.com/real-estate/2026/10/worlds-tallest-tower-to-open-in-jeddah-in-late-2028/` },
      { title: `Guinness World Records: Tallest tower (Tokyo Skytree)`, url: `https://www.guinnessworldrecords.com/world-records/tallest-tower` },
      { title: `Arab News: King Fahd's Fountain, the tallest in the world`, url: `https://www.arabnews.com/saudi-arabia/theplace-king-fahds-fountain-in-jeddah-the-tallest-in-the-world-1541131` },
      { title: `BBC: Egypt's Grand Museum opens (November 2025)`, url: `https://www.bbc.com/news/articles/ckg4q403rpzo` },
      { title: `Guinness World Records: Largest art museum (Louvre)`, url: `https://www.guinnessworldrecords.com/world-records/656406-largest-art-museum` },
      { title: `Guinness World Records: Longest railway platform (Hubballi, 2023)`, url: `https://www.guinnessworldrecords.com/world-records/longest-railway-platform` },
      { title: `Guinness World Records: Highest altitude road (Umling La, 2021)`, url: `https://www.guinnessworldrecords.com/world-records/62927-highest-road` },
      { title: `The Statesman: BRO completes highest motorable road at Mig La (4 October 2025)`, url: `https://www.thestatesman.com/india/bro-completes-worlds-highest-motorable-road-at-mig-la-pass-surpassing-umling-la-1503494955.html` },
      { title: `Guinness World Records: Highest airport (Daocheng Yading)`, url: `https://www.guinnessworldrecords.com/world-records/63153-highest-airport` },
      { title: `China Energy: World's tallest dam hydropower station puts three units into operation (August 2026)`, url: `https://www.chnenergy.com.cn/gjnyjtwwEn/xwzx/202609/afda6f5d338445d7b4fb7eb903d7c61a.shtml` },
      { title: `UN DESA: World Urbanization Prospects 2025, Jakarta most populous city (18 November 2025)`, url: `https://www.un.org/en/desa/WUP-2025` },
      { title: `UN DESA: India to overtake China as most populous country in April 2023`, url: `https://www.un.org/en/desa/india-overtake-china-world-most-populous-country-april-2023-united-nations-projects` },
      { title: `Britannica: Trans-Siberian Railroad`, url: `https://www.britannica.com/topic/Trans-Siberian-Railroad` },
      { title: `Britannica: Cullinan diamond`, url: `https://www.britannica.com/topic/Cullinan-diamond` },
      { title: `NASA Earth Observatory: The highest settlement in the world (La Rinconada)`, url: `https://science.nasa.gov/earth/earth-observatory/the-highest-settlement-in-the-world-145864/` },
    ],
  },
  {
    id: 'world-rivers',
    category: 'geography',
    title: `Major rivers of the world`,
    teaser: `Where the Nile, Amazon, Yangtze, Danube and 25 more begin and end, and why people fight over them.`,
    summary: `Almost every great city and old civilisation grew beside a river. Learn where a river starts, where it ends, and who depends on it, and you understand half of world politics.

Begin in Africa. The Nile is usually called the longest river, about 6,650 kilometres. The White Nile comes from the Lake Victoria region and the Blue Nile from Lake Tana in Ethiopia. They meet at Khartoum and flow north through Egypt into the Mediterranean Sea.

In September 2025 Ethiopia opened its giant Renaissance Dam on the Blue Nile. Egypt, which gets almost all its water from the Nile, still fears for its share.

The Congo is the deepest river in the world. It crosses the equator twice before it reaches the Atlantic. The Niger curves through West Africa to the Gulf of Guinea. The Zambezi drops over Victoria Falls and ends in the Indian Ocean, and the Orange runs west across southern Africa to the Atlantic.

Cross to South America. The Amazon carries more water than any other river, about a fifth of all the river water that reaches the oceans. It flows across Brazil into the Atlantic. Some experts say it is longer than the Nile too.

The Parana, joined by the Paraguay and the Uruguay, ends in the wide Rio de la Plata between Argentina and Uruguay. The Sao Francisco is the longest river that stays wholly inside Brazil.

In North America the Mississippi, fed by the Missouri, the Ohio and the Arkansas, ends in the Gulf of Mexico. The Colorado carved the Grand Canyon. The Rio Grande marks part of the border between the United States and Mexico.

The St Lawrence carries the water of the Great Lakes to the Atlantic, and the Mackenzie in Canada runs north to the Arctic Ocean.

Now Asia. The Yangtze, about 6,300 kilometres, is the longest river in Asia and the 3rd longest in the world. It ends near Shanghai and turns the turbines of the Three Gorges Dam.

The Huang He, or Yellow River, is named for the yellow silt it carries and is called the cradle of Chinese civilisation. The Mekong runs through 6 countries, from China to a huge delta in Vietnam.

Closer to home, the Indus rises in Tibet and crosses Pakistan to the Arabian Sea. The Ganges flows across north India. The Brahmaputra begins in Tibet as the Yarlung Tsangpo, where China began a giant dam in 2025. The Ganges and the Brahmaputra meet in Bangladesh and pour into the Bay of Bengal.

In Siberia the Ob, the Yenisey and the Lena flow north into the Arctic Ocean. The Amur forms a long stretch of the border between Russia and China.

Then Europe. The Volga is Europe's longest river and ends in the Caspian Sea. The Danube flows through 10 countries, more than any other river, and past 4 capitals, Vienna, Bratislava, Budapest and Belgrade, before it reaches the Black Sea.

The Rhine carries barges to Rotterdam on the North Sea. The Dnipro flows through Kyiv to the Black Sea, and the Don ends in the Sea of Azov. The Ural is often used as part of the line between Europe and Asia, and it too ends in the Caspian.

Last, Australia. The Murray and its partner the Darling form the country's biggest river system, which feeds its main farming lands.

Notice one thing. Rivers do not respect borders. The Nile, the Mekong, the Brahmaputra and our own Indus all cross several countries, and dams upstream worry the people downstream. Pakistan knows this story well. Water shared fairly keeps the peace.`,
    keyPoints: [
      `Nile (about 6,650 km): White Nile from the Lake Victoria region + Blue Nile from Lake Tana meet at Khartoum → Mediterranean. Ethiopia inaugurated the GERD on the Blue Nile in September 2025.`,
      `Congo: deepest river, crosses the equator twice → Atlantic. Niger → Gulf of Guinea. Zambezi (Victoria Falls) → Indian Ocean. Orange → Atlantic.`,
      `Amazon: largest by water, about one fifth of all river flow to the oceans → Atlantic. Paraná + Paraguay + Uruguay → Río de la Plata. São Francisco: longest wholly in Brazil.`,
      `Mississippi (with Missouri, Ohio, Arkansas) → Gulf of Mexico. Colorado: Grand Canyon. Rio Grande: US-Mexico border. St Lawrence: Great Lakes → Atlantic. Mackenzie → Arctic Ocean.`,
      `Yangtze (about 6,300 km): longest in Asia, 3rd in the world, ends near Shanghai, Three Gorges Dam. Huang He: Yellow River. Mekong: 6 countries, delta in Vietnam.`,
      `Indus: Tibet → Arabian Sea. Brahmaputra = Yarlung Tsangpo in Tibet (China began a giant dam there in July 2025). Ganges + Brahmaputra → Bay of Bengal via Bangladesh.`,
      `Ob, Yenisey, Lena → Arctic Ocean. Amur: Russia-China border.`,
      `Volga: longest in Europe → Caspian. Danube: 10 countries, 4 capitals → Black Sea. Rhine → North Sea (Rotterdam). Dnipro → Black Sea. Don → Sea of Azov. Ural → Caspian.`,
      `Murray-Darling: Australia's largest river system.`,
    ],
    remember: `Nile longest, Amazon most water, Congo deepest, Yangtze longest in Asia, Volga longest in Europe, Danube 10 countries. Ob, Yenisey and Lena run north to the Arctic.`,
    whyIssb: `Shared rivers are one of the biggest causes of tension between neighbours, from the Nile to the Mekong to our own Indus. Knowing where each river starts and ends shows you why an upstream dam can become a national security question downstream.`,
    sources: [
      { title: `Map: Major rivers of the world (mapsforupsc.com), as shared by the user`, url: `https://mapsforupsc.com/` },
      { title: `Britannica: Nile River`, url: `https://www.britannica.com/place/Nile-River` },
      { title: `Britannica: Amazon River`, url: `https://www.britannica.com/place/Amazon-River` },
      { title: `Britannica: Congo River`, url: `https://www.britannica.com/place/Congo-River` },
      { title: `Britannica: Yangtze River`, url: `https://www.britannica.com/place/Yangtze-River` },
      { title: `Britannica: Mekong River`, url: `https://www.britannica.com/place/Mekong-River` },
      { title: `Britannica: Danube River`, url: `https://www.britannica.com/place/Danube-River` },
      { title: `Britannica: Volga River`, url: `https://www.britannica.com/place/Volga-River` },
      { title: `Britannica: Mississippi River`, url: `https://www.britannica.com/place/Mississippi-River` },
      { title: `Britannica: Brahmaputra River`, url: `https://www.britannica.com/place/Brahmaputra-River` },
      { title: `Reuters: China starts construction on world's largest hydropower dam in Tibet (21 July 2025)`, url: `https://www.reuters.com/sustainability/climate-energy/china-starts-construction-worlds-largest-hydropower-dam-tibet-2025-07-21/` },
      { title: `Reuters: Ethiopia opens Africa's largest hydroelectric dam to Egyptian protest (9 September 2025)`, url: `https://www.reuters.com/sustainability/boards-policy-regulation/ethiopia-opens-africas-largest-hydroelectric-dam-egyptian-protest-2025-09-09/` },
    ],
  },
];
