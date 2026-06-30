'use client';

import { useState, useMemo } from 'react';

const countries: { country: string; capital: string; continent: string }[] = [
  { country: "Afghanistan", capital: "Kabul", continent: "Asia" },
  { country: "Albania", capital: "Tirana", continent: "Europe" },
  { country: "Algeria", capital: "Algiers", continent: "Africa" },
  { country: "Andorra", capital: "Andorra la Vella", continent: "Europe" },
  { country: "Angola", capital: "Luanda", continent: "Africa" },
  { country: "Antigua and Barbuda", capital: "Saint John's", continent: "North America" },
  { country: "Argentina", capital: "Buenos Aires", continent: "South America" },
  { country: "Armenia", capital: "Yerevan", continent: "Asia" },
  { country: "Australia", capital: "Canberra", continent: "Oceania" },
  { country: "Austria", capital: "Vienna", continent: "Europe" },
  { country: "Azerbaijan", capital: "Baku", continent: "Asia" },
  { country: "Bahamas", capital: "Nassau", continent: "North America" },
  { country: "Bahrain", capital: "Manama", continent: "Asia" },
  { country: "Bangladesh", capital: "Dhaka", continent: "Asia" },
  { country: "Barbados", capital: "Bridgetown", continent: "North America" },
  { country: "Belarus", capital: "Minsk", continent: "Europe" },
  { country: "Belgium", capital: "Brussels", continent: "Europe" },
  { country: "Belize", capital: "Belmopan", continent: "North America" },
  { country: "Benin", capital: "Porto-Novo", continent: "Africa" },
  { country: "Bhutan", capital: "Thimphu", continent: "Asia" },
  { country: "Bolivia", capital: "Sucre (constitutional) / La Paz (seat of government)", continent: "South America" },
  { country: "Bosnia and Herzegovina", capital: "Sarajevo", continent: "Europe" },
  { country: "Botswana", capital: "Gaborone", continent: "Africa" },
  { country: "Brazil", capital: "Brasilia", continent: "South America" },
  { country: "Brunei", capital: "Bandar Seri Begawan", continent: "Asia" },
  { country: "Bulgaria", capital: "Sofia", continent: "Europe" },
  { country: "Burkina Faso", capital: "Ouagadougou", continent: "Africa" },
  { country: "Burundi", capital: "Gitega", continent: "Africa" },
  { country: "Cambodia", capital: "Phnom Penh", continent: "Asia" },
  { country: "Cameroon", capital: "Yaounde", continent: "Africa" },
  { country: "Canada", capital: "Ottawa", continent: "North America" },
  { country: "Cape Verde", capital: "Praia", continent: "Africa" },
  { country: "Central African Republic", capital: "Bangui", continent: "Africa" },
  { country: "Chad", capital: "N'Djamena", continent: "Africa" },
  { country: "Chile", capital: "Santiago", continent: "South America" },
  { country: "China", capital: "Beijing", continent: "Asia" },
  { country: "Colombia", capital: "Bogota", continent: "South America" },
  { country: "Comoros", capital: "Moroni", continent: "Africa" },
  { country: "Congo (Republic)", capital: "Brazzaville", continent: "Africa" },
  { country: "Congo (DRC)", capital: "Kinshasa", continent: "Africa" },
  { country: "Costa Rica", capital: "San Jose", continent: "North America" },
  { country: "Croatia", capital: "Zagreb", continent: "Europe" },
  { country: "Cuba", capital: "Havana", continent: "North America" },
  { country: "Cyprus", capital: "Nicosia", continent: "Europe" },
  { country: "Czech Republic", capital: "Prague", continent: "Europe" },
  { country: "Denmark", capital: "Copenhagen", continent: "Europe" },
  { country: "Djibouti", capital: "Djibouti", continent: "Africa" },
  { country: "Dominica", capital: "Roseau", continent: "North America" },
  { country: "Dominican Republic", capital: "Santo Domingo", continent: "North America" },
  { country: "East Timor", capital: "Dili", continent: "Asia" },
  { country: "Ecuador", capital: "Quito", continent: "South America" },
  { country: "Egypt", capital: "Cairo", continent: "Africa" },
  { country: "El Salvador", capital: "San Salvador", continent: "North America" },
  { country: "Equatorial Guinea", capital: "Malabo", continent: "Africa" },
  { country: "Eritrea", capital: "Asmara", continent: "Africa" },
  { country: "Estonia", capital: "Tallinn", continent: "Europe" },
  { country: "Eswatini", capital: "Mbabane (administrative) / Lobamba (legislative)", continent: "Africa" },
  { country: "Ethiopia", capital: "Addis Ababa", continent: "Africa" },
  { country: "Fiji", capital: "Suva", continent: "Oceania" },
  { country: "Finland", capital: "Helsinki", continent: "Europe" },
  { country: "France", capital: "Paris", continent: "Europe" },
  { country: "Gabon", capital: "Libreville", continent: "Africa" },
  { country: "Gambia", capital: "Banjul", continent: "Africa" },
  { country: "Georgia", capital: "Tbilisi", continent: "Asia" },
  { country: "Germany", capital: "Berlin", continent: "Europe" },
  { country: "Ghana", capital: "Accra", continent: "Africa" },
  { country: "Greece", capital: "Athens", continent: "Europe" },
  { country: "Grenada", capital: "St. George's", continent: "North America" },
  { country: "Guatemala", capital: "Guatemala City", continent: "North America" },
  { country: "Guinea", capital: "Conakry", continent: "Africa" },
  { country: "Guinea-Bissau", capital: "Bissau", continent: "Africa" },
  { country: "Guyana", capital: "Georgetown", continent: "South America" },
  { country: "Haiti", capital: "Port-au-Prince", continent: "North America" },
  { country: "Honduras", capital: "Tegucigalpa", continent: "North America" },
  { country: "Hungary", capital: "Budapest", continent: "Europe" },
  { country: "Iceland", capital: "Reykjavik", continent: "Europe" },
  { country: "India", capital: "New Delhi", continent: "Asia" },
  { country: "Indonesia", capital: "Jakarta", continent: "Asia" },
  { country: "Iran", capital: "Tehran", continent: "Asia" },
  { country: "Iraq", capital: "Baghdad", continent: "Asia" },
  { country: "Ireland", capital: "Dublin", continent: "Europe" },
  { country: "Israel", capital: "Jerusalem (declared) / Tel Aviv (recognized)", continent: "Asia" },
  { country: "Italy", capital: "Rome", continent: "Europe" },
  { country: "Ivory Coast", capital: "Yamoussoukro (official) / Abidjan (economic)", continent: "Africa" },
  { country: "Jamaica", capital: "Kingston", continent: "North America" },
  { country: "Japan", capital: "Tokyo", continent: "Asia" },
  { country: "Jordan", capital: "Amman", continent: "Asia" },
  { country: "Kazakhstan", capital: "Astana", continent: "Asia" },
  { country: "Kenya", capital: "Nairobi", continent: "Africa" },
  { country: "Kiribati", capital: "Tarawa", continent: "Oceania" },
  { country: "Kosovo", capital: "Pristina", continent: "Europe" },
  { country: "Kuwait", capital: "Kuwait City", continent: "Asia" },
  { country: "Kyrgyzstan", capital: "Bishkek", continent: "Asia" },
  { country: "Laos", capital: "Vientiane", continent: "Asia" },
  { country: "Latvia", capital: "Riga", continent: "Europe" },
  { country: "Lebanon", capital: "Beirut", continent: "Asia" },
  { country: "Lesotho", capital: "Maseru", continent: "Africa" },
  { country: "Liberia", capital: "Monrovia", continent: "Africa" },
  { country: "Libya", capital: "Tripoli", continent: "Africa" },
  { country: "Liechtenstein", capital: "Vaduz", continent: "Europe" },
  { country: "Lithuania", capital: "Vilnius", continent: "Europe" },
  { country: "Luxembourg", capital: "Luxembourg City", continent: "Europe" },
  { country: "Madagascar", capital: "Antananarivo", continent: "Africa" },
  { country: "Malawi", capital: "Lilongwe", continent: "Africa" },
  { country: "Malaysia", capital: "Kuala Lumpur (official) / Putrajaya (administrative)", continent: "Asia" },
  { country: "Maldives", capital: "Male", continent: "Asia" },
  { country: "Mali", capital: "Bamako", continent: "Africa" },
  { country: "Malta", capital: "Valletta", continent: "Europe" },
  { country: "Marshall Islands", capital: "Majuro", continent: "Oceania" },
  { country: "Mauritania", capital: "Nouakchott", continent: "Africa" },
  { country: "Mauritius", capital: "Port Louis", continent: "Africa" },
  { country: "Mexico", capital: "Mexico City", continent: "North America" },
  { country: "Micronesia", capital: "Palikir", continent: "Oceania" },
  { country: "Moldova", capital: "Chisinau", continent: "Europe" },
  { country: "Monaco", capital: "Monaco", continent: "Europe" },
  { country: "Mongolia", capital: "Ulaanbaatar", continent: "Asia" },
  { country: "Montenegro", capital: "Podgorica", continent: "Europe" },
  { country: "Morocco", capital: "Rabat", continent: "Africa" },
  { country: "Mozambique", capital: "Maputo", continent: "Africa" },
  { country: "Myanmar", capital: "Naypyidaw", continent: "Asia" },
  { country: "Namibia", capital: "Windhoek", continent: "Africa" },
  { country: "Nauru", capital: "Yaren (de facto)", continent: "Oceania" },
  { country: "Nepal", capital: "Kathmandu", continent: "Asia" },
  { country: "Netherlands", capital: "Amsterdam (official) / The Hague (seat of government)", continent: "Europe" },
  { country: "New Zealand", capital: "Wellington", continent: "Oceania" },
  { country: "Nicaragua", capital: "Managua", continent: "North America" },
  { country: "Niger", capital: "Niamey", continent: "Africa" },
  { country: "Nigeria", capital: "Abuja", continent: "Africa" },
  { country: "North Korea", capital: "Pyongyang", continent: "Asia" },
  { country: "North Macedonia", capital: "Skopje", continent: "Europe" },
  { country: "Norway", capital: "Oslo", continent: "Europe" },
  { country: "Oman", capital: "Muscat", continent: "Asia" },
  { country: "Pakistan", capital: "Islamabad", continent: "Asia" },
  { country: "Palau", capital: "Ngerulmud", continent: "Oceania" },
  { country: "Palestine", capital: "Ramallah (administrative) / Jerusalem (claimed)", continent: "Asia" },
  { country: "Panama", capital: "Panama City", continent: "North America" },
  { country: "Papua New Guinea", capital: "Port Moresby", continent: "Oceania" },
  { country: "Paraguay", capital: "Asuncion", continent: "South America" },
  { country: "Peru", capital: "Lima", continent: "South America" },
  { country: "Philippines", capital: "Manila", continent: "Asia" },
  { country: "Poland", capital: "Warsaw", continent: "Europe" },
  { country: "Portugal", capital: "Lisbon", continent: "Europe" },
  { country: "Qatar", capital: "Doha", continent: "Asia" },
  { country: "Romania", capital: "Bucharest", continent: "Europe" },
  { country: "Russia", capital: "Moscow", continent: "Europe/Asia" },
  { country: "Rwanda", capital: "Kigali", continent: "Africa" },
  { country: "Saint Kitts and Nevis", capital: "Basseterre", continent: "North America" },
  { country: "Saint Lucia", capital: "Castries", continent: "North America" },
  { country: "Saint Vincent and the Grenadines", capital: "Kingstown", continent: "North America" },
  { country: "Samoa", capital: "Apia", continent: "Oceania" },
  { country: "San Marino", capital: "San Marino", continent: "Europe" },
  { country: "Sao Tome and Principe", capital: "Sao Tome", continent: "Africa" },
  { country: "Saudi Arabia", capital: "Riyadh", continent: "Asia" },
  { country: "Senegal", capital: "Dakar", continent: "Africa" },
  { country: "Serbia", capital: "Belgrade", continent: "Europe" },
  { country: "Seychelles", capital: "Victoria", continent: "Africa" },
  { country: "Sierra Leone", capital: "Freetown", continent: "Africa" },
  { country: "Singapore", capital: "Singapore", continent: "Asia" },
  { country: "Slovakia", capital: "Bratislava", continent: "Europe" },
  { country: "Slovenia", capital: "Ljubljana", continent: "Europe" },
  { country: "Solomon Islands", capital: "Honiara", continent: "Oceania" },
  { country: "Somalia", capital: "Mogadishu", continent: "Africa" },
  { country: "South Africa", capital: "Pretoria (executive) / Cape Town (legislative) / Bloemfontein (judicial)", continent: "Africa" },
  { country: "South Korea", capital: "Seoul", continent: "Asia" },
  { country: "South Sudan", capital: "Juba", continent: "Africa" },
  { country: "Spain", capital: "Madrid", continent: "Europe" },
  { country: "Sri Lanka", capital: "Sri Jayawardenepura Kotte (legislative) / Colombo (executive)", continent: "Asia" },
  { country: "Sudan", capital: "Khartoum", continent: "Africa" },
  { country: "Suriname", capital: "Paramaribo", continent: "South America" },
  { country: "Sweden", capital: "Stockholm", continent: "Europe" },
  { country: "Switzerland", capital: "Bern", continent: "Europe" },
  { country: "Syria", capital: "Damascus", continent: "Asia" },
  { country: "Taiwan", capital: "Taipei", continent: "Asia" },
  { country: "Tajikistan", capital: "Dushanbe", continent: "Asia" },
  { country: "Tanzania", capital: "Dodoma (official) / Dar es Salaam (former capital)", continent: "Africa" },
  { country: "Thailand", capital: "Bangkok", continent: "Asia" },
  { country: "Togo", capital: "Lome", continent: "Africa" },
  { country: "Tonga", capital: "Nuku'alofa", continent: "Oceania" },
  { country: "Trinidad and Tobago", capital: "Port of Spain", continent: "North America" },
  { country: "Tunisia", capital: "Tunis", continent: "Africa" },
  { country: "Turkey", capital: "Ankara", continent: "Asia/Europe" },
  { country: "Turkmenistan", capital: "Ashgabat", continent: "Asia" },
  { country: "Tuvalu", capital: "Funafuti", continent: "Oceania" },
  { country: "Uganda", capital: "Kampala", continent: "Africa" },
  { country: "Ukraine", capital: "Kyiv", continent: "Europe" },
  { country: "United Arab Emirates", capital: "Abu Dhabi", continent: "Asia" },
  { country: "United Kingdom", capital: "London", continent: "Europe" },
  { country: "United States", capital: "Washington, D.C.", continent: "North America" },
  { country: "Uruguay", capital: "Montevideo", continent: "South America" },
  { country: "Uzbekistan", capital: "Tashkent", continent: "Asia" },
  { country: "Vanuatu", capital: "Port Vila", continent: "Oceania" },
  { country: "Vatican City", capital: "Vatican City", continent: "Europe" },
  { country: "Venezuela", capital: "Caracas", continent: "South America" },
  { country: "Vietnam", capital: "Hanoi", continent: "Asia" },
  { country: "Yemen", capital: "Sana'a", continent: "Asia" },
  { country: "Zambia", capital: "Lusaka", continent: "Africa" },
  { country: "Zimbabwe", capital: "Harare", continent: "Africa" },
];

type SortKey = 'country' | 'capital' | 'continent';

export default function CountriesPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('country');
  const [sortAsc, setSortAsc] = useState(true);
  const [filterContinent, setFilterContinent] = useState('All');

  const continents = useMemo(() => {
    const set = new Set(countries.map(c => c.continent));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    let result = countries;

    if (filterContinent !== 'All') {
      result = result.filter(c => c.continent === filterContinent);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        c => c.country.toLowerCase().includes(q) || c.capital.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      const valA = a[sortKey].toLowerCase();
      const valB = b[sortKey].toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [search, sortKey, sortAsc, filterContinent]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return '↕';
    return sortAsc ? '↑' : '↓';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Countries & Capitals</h1>
        <p className="text-slate-400 text-center mb-6">{countries.length} countries listed. Click column headers to sort.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by country or capital..."
            className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500 transition-colors"
          />
          <select
            value={filterContinent}
            onChange={(e) => setFilterContinent(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white outline-none focus:border-blue-500 transition-colors"
          >
            {continents.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <p className="text-slate-500 text-sm mb-4">Showing {filtered.length} results</p>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th
                    onClick={() => handleSort('country')}
                    className="px-6 py-4 text-left text-blue-400 font-semibold cursor-pointer hover:bg-slate-700/50 transition-colors select-none"
                  >
                    Country {sortIcon('country')}
                  </th>
                  <th
                    onClick={() => handleSort('capital')}
                    className="px-6 py-4 text-left text-blue-400 font-semibold cursor-pointer hover:bg-slate-700/50 transition-colors select-none"
                  >
                    Capital {sortIcon('capital')}
                  </th>
                  <th
                    onClick={() => handleSort('continent')}
                    className="px-6 py-4 text-left text-blue-400 font-semibold cursor-pointer hover:bg-slate-700/50 transition-colors select-none"
                  >
                    Continent {sortIcon('continent')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={item.country}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-3 text-white font-medium">{item.country}</td>
                    <td className="px-6 py-3 text-emerald-400">{item.capital}</td>
                    <td className="px-6 py-3 text-slate-400">{item.continent}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      No countries found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
