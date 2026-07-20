'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';
import SpacedRepetitionDeck from '@/app/components/SpacedRepetitionDeck';

type Country = { country: string; capital: string; continent: string };

const countries: Country[] = [
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

const mapNameAliases: Record<string, string> = {
  'Brunei Darussalam': 'Brunei',
  "Cote d'Ivoire": 'Ivory Coast',
  "Côte d'Ivoire": 'Ivory Coast',
  'Dem. Rep. Korea': 'North Korea',
  'Democratic Republic of the Congo': 'Congo (DRC)',
  'Federated States of Micronesia': 'Micronesia',
  'Lao PDR': 'Laos',
  'Macedonia': 'North Macedonia',
  'Republic of Congo': 'Congo (Republic)',
  'Republic of Korea': 'South Korea',
  'Russian Federation': 'Russia',
  'Swaziland': 'Eswatini',
  'The Gambia': 'Gambia',
  'Timor-Leste': 'East Timor',
};

function normalizeMapName(name: string): string {
  const alias = mapNameAliases[name] ?? (name.toLowerCase().includes('ivoire') ? 'Ivory Coast' : name);
  return alias
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function countryForMapLabel(label: string): Country | undefined {
  const normalized = normalizeMapName(label);
  return countries.find((country) => normalizeMapName(country.country) === normalized);
}

// The SVG labels a country either with a `name="..."` attribute or by putting
// the country name in `class="..."`. Read whichever is present, ignoring the
// styling classes we add ourselves so this stays correct if it runs again.
function labelForPath(path: SVGPathElement): string {
  const name = path.getAttribute('name');
  if (name) return name;
  return (path.getAttribute('class') ?? '')
    .replace(/\b(world-map-country|is-muted|is-selected)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function countryForPath(path: SVGPathElement): Country | undefined {
  return countryForMapLabel(path.dataset.country ?? labelForPath(path));
}

const countryByName = new Map(countries.map((country) => [country.country, country]));

interface WorldAtlasProps {
  selectedCountry: Country | null;
  visibleCountries: Country[];
  onHover: (country: Country | null) => void;
  onSelect: (country: Country) => void;
}

function WorldAtlas({ selectedCountry, visibleCountries, onHover, onSelect }: WorldAtlasProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const [svgMarkup, setSvgMarkup] = useState('');
  const [tooltip, setTooltip] = useState<{ country: Country; x: number; y: number; below: boolean } | null>(null);
  const visibleNames = useMemo(
    () => new Set(visibleCountries.map((country) => country.country)),
    [visibleCountries],
  );

  // The map's interaction listeners are bound ONCE (in the delegation effect
  // below) and must read the latest props at event time rather than closing
  // over stale values. Mirroring them into refs is what keeps hover, click, and
  // filtering working on every country — not just the first one after a
  // re-render, which was the previous bug.
  const visibleNamesRef = useRef(visibleNames);
  const onHoverRef = useRef(onHover);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    visibleNamesRef.current = visibleNames;
    onHoverRef.current = onHover;
    onSelectRef.current = onSelect;
  });

  useEffect(() => {
    let cancelled = false;

    fetch('/world.svg')
      .then((response) => response.text())
      .then((markup) => {
        if (!cancelled) setSvgMarkup(markup);
      })
      .catch(() => {
        if (!cancelled) setSvgMarkup('');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Inject the SVG imperatively and tag every recognized country path: cache
  // its canonical name on the node, mark it interactive, and add a11y metadata.
  //
  // The markup is set via `innerHTML` (not React's `dangerouslySetInnerHTML`) on
  // purpose: once React owns this subtree, any later re-render can reset it back
  // to the raw SVG string, wiping the `data-country` tags and classes added
  // below. That reset was the root cause of the map going inert after the first
  // hover. Owning the subtree ourselves keeps the decoration alive for good.
  useEffect(() => {
    const container = mapRef.current;
    if (!svgMarkup || !container) return;

    if (container.innerHTML !== svgMarkup) {
      container.innerHTML = svgMarkup;
    }

    container.querySelectorAll<SVGPathElement>('path').forEach((path) => {
      const country = countryForPath(path);
      if (!country) return;
      path.dataset.country = country.country;
      path.classList.add('world-map-country');
      path.setAttribute('role', 'button');
      path.setAttribute('tabindex', '0');
      path.setAttribute('aria-label', `${country.country}, capital ${country.capital}`);
    });
  }, [svgMarkup]);

  // Reflect the active filter and selection onto the paths. Kept separate from
  // the event wiring so filtering or selecting never tears down the listeners.
  useEffect(() => {
    const container = mapRef.current;
    if (!svgMarkup || !container) return;

    container.querySelectorAll<SVGPathElement>('path').forEach((path) => {
      const name = path.dataset.country;
      if (!name) return;
      path.classList.toggle('is-muted', !visibleNames.has(name));
      path.classList.toggle('is-selected', name === selectedCountry?.country);
    });
  }, [svgMarkup, visibleNames, selectedCountry]);

  // A single set of delegated listeners on the stable container element.
  // Because they live on the container (not on individual paths) and read live
  // state from refs, they survive every re-render and keep responding to hover
  // indefinitely. The tooltip follows the cursor, PostHog-style.
  useEffect(() => {
    const container = mapRef.current;
    const shell = shellRef.current;
    if (!svgMarkup || !container || !shell) return;

    let activeName: string | null = null;

    const hitFor = (target: EventTarget | null): Country | null => {
      const path = (target as Element | null)?.closest?.('path') as SVGPathElement | null;
      const name = path?.dataset.country;
      if (!name || !visibleNamesRef.current.has(name)) return null;
      return countryByName.get(name) ?? null;
    };

    const showTooltip = (country: Country, x: number, y: number, height: number) => {
      setTooltip({ country, x, y, below: y < height * 0.22 });
    };

    const clear = () => {
      if (activeName !== null) {
        activeName = null;
        onHoverRef.current(null);
      }
      setTooltip(null);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const country = hitFor(event.target);
      if (!country) {
        clear();
        return;
      }
      if (country.country !== activeName) {
        activeName = country.country;
        onHoverRef.current(country);
      }
      const rect = shell.getBoundingClientRect();
      showTooltip(country, event.clientX - rect.left, event.clientY - rect.top, rect.height);
    };

    const handleClick = (event: MouseEvent) => {
      const country = hitFor(event.target);
      if (country) onSelectRef.current(country);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const country = hitFor(event.target);
      if (!country) return;
      const path = (event.target as Element | null)?.closest?.('path') as SVGPathElement | null;
      if (!path) return;
      activeName = country.country;
      onHoverRef.current(country);
      const rect = shell.getBoundingClientRect();
      const pathRect = path.getBoundingClientRect();
      showTooltip(
        country,
        pathRect.left + pathRect.width / 2 - rect.left,
        pathRect.top - rect.top,
        rect.height,
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      const country = hitFor(event.target);
      if (!country) return;
      event.preventDefault();
      onSelectRef.current(country);
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', clear);
    container.addEventListener('click', handleClick);
    container.addEventListener('focusin', handleFocusIn);
    container.addEventListener('focusout', clear);
    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', clear);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('focusin', handleFocusIn);
      container.removeEventListener('focusout', clear);
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [svgMarkup]);

  return (
    <div className="world-map-shell" ref={shellRef} aria-label="Interactive world map">
      {svgMarkup ? (
        <>
          <TransformWrapper
            ref={transformRef}
            minScale={1}
            maxScale={8}
            wheel={{ step: 0.15 }}
            doubleClick={{ mode: 'zoomIn' }}
          >
            <TransformComponent wrapperClass="world-map-transform-wrapper" contentClass="world-map-transform-content">
              <div ref={mapRef} className="world-map-canvas" />
            </TransformComponent>
          </TransformWrapper>
          <div className="world-map-zoom-controls">
            <button type="button" onClick={() => transformRef.current?.zoomIn()} aria-label="Zoom in">+</button>
            <button type="button" onClick={() => transformRef.current?.zoomOut()} aria-label="Zoom out">−</button>
            <button type="button" onClick={() => transformRef.current?.resetTransform()} aria-label="Reset zoom">Reset</button>
          </div>
          {tooltip && (
            <div
              className={tooltip.below ? 'world-map-tooltip is-below' : 'world-map-tooltip'}
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              <p className="world-map-tooltip-country">{tooltip.country.country}</p>
              <p className="world-map-tooltip-capital">Capital &middot; {tooltip.country.capital}</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex min-h-[280px] items-center justify-center text-sm text-slate-500">
          Loading the atlas...
        </div>
      )}
      <p className="world-map-attribution">Map data: SimpleMaps.com · MIT License</p>
    </div>
  );
}

export default function CountriesPage() {
  const [mode, setMode] = useState<'explore' | 'study'>('explore');
  const [search, setSearch] = useState('');
  const [filterContinent, setFilterContinent] = useState('All');
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    countries.find((country) => country.country === 'Pakistan') ?? countries[0],
  );
  const [studyPool, setStudyPool] = useState<Country[]>(countries);

  const continents = useMemo(() => {
    const set = new Set(countries.map((country) => country.continent));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    let result = [...countries];

    if (filterContinent !== 'All') {
      result = result.filter((country) => country.continent === filterContinent);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (country) =>
          country.country.toLowerCase().includes(query) ||
          country.capital.toLowerCase().includes(query),
      );
    }

    return result;
  }, [search, filterContinent]);

  const displayedCountry = hoveredCountry ?? selectedCountry;

  const selectCountry = useCallback((country: Country) => {
    setSelectedCountry(country);
  }, []);

  const openStudyMode = useCallback(() => {
    setStudyPool(filtered.length ? filtered : countries);
    setMode('study');
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-400">
            Active recall atlas
          </p>
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white md:text-5xl">
            World Capitals Map
          </h1>
          <p className="mx-auto max-w-2xl text-slate-400">
            Hover or focus a country to see its capital. Scroll or use the zoom controls to get close
            enough to click any country, no matter how small.
          </p>
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
            <button
              type="button"
              onClick={() => setMode('explore')}
              className={mode === 'explore' ? 'rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950' : 'rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:text-white'}
            >
              Explore map
            </button>
            <button
              type="button"
              onClick={openStudyMode}
              className={mode === 'study' ? 'rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950' : 'rounded-lg px-4 py-2 text-sm text-slate-400 transition hover:text-white'}
            >
              Study cards
            </button>
          </div>
        </div>

        {mode === 'explore' ? (
          <>
            <div className="mb-5 flex flex-col gap-4 md:flex-row">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a country or capital..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-500"
              />
              <select
                value={filterContinent}
                onChange={(event) => setFilterContinent(event.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-500"
              >
                {continents.map((continent) => (
                  <option key={continent} value={continent}>
                    {continent}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-2xl shadow-cyan-950/10">
                <div className="flex flex-col gap-2 border-b border-slate-700 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-white">Explore the atlas</h2>
                    <p className="text-sm text-slate-500">
                      {filtered.length} of {countries.length} countries in view
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-cyan-900/70 bg-cyan-950/40 px-3 py-1 text-xs text-cyan-300">
                    Hover or focus -- scroll to zoom -- click to pin
                  </span>
                </div>
                <WorldAtlas
                  selectedCountry={selectedCountry}
                  visibleCountries={filtered}
                  onHover={setHoveredCountry}
                  onSelect={selectCountry}
                />
              </section>

              <aside className="rounded-2xl border border-cyan-900/60 bg-cyan-950/25 p-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                  Selected country
                </p>
                {displayedCountry ? (
                  <>
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h2 className="text-2xl font-bold text-white">{displayedCountry.country}</h2>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                        {displayedCountry.continent}
                      </span>
                    </div>
                    <p className="mb-1 text-sm text-slate-500">Capital</p>
                    <p className="text-xl font-semibold text-emerald-300">{displayedCountry.capital}</p>
                  </>
                ) : (
                  <p className="text-slate-400">Choose a country on the map.</p>
                )}
                <button
                  type="button"
                  onClick={openStudyMode}
                  className="mt-6 w-full rounded-lg border border-cyan-800/60 px-3 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400 hover:text-cyan-200"
                >
                  Study these on cards ---
                </button>
              </aside>
            </div>
          </>
        ) : (
          <div>
            <p className="mb-5 text-center text-sm text-slate-500">
              Studying {studyPool.length === countries.length ? 'all countries' : studyPool.length + ' filtered countries'}.{' '}
              <button type="button" onClick={() => setMode('explore')} className="text-cyan-400 underline-offset-2 hover:underline">
                Back to the map
              </button>
            </p>
            <SpacedRepetitionDeck
              key="countries"
              storageKey="issb-sm2-countries"
              items={studyPool}
              getId={(country) => country.country}
              accentColor="cyan"
              renderFront={(country) => country.country}
              renderBack={(country) => (
                <>
                  <p className="text-xl font-semibold text-white">{country.capital}</p>
                  <p className="mt-2 text-sm text-slate-400">{country.continent}</p>
                </>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
