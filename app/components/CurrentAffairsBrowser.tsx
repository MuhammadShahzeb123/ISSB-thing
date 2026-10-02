'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  currentAffairs,
  regionPrimer,
  researchAsOf,
  researchCaveat,
  type AffairsBrief,
} from '../lib/currentAffairs';

const regionFilters = ['All', 'Asia', 'Pakistan', 'Middle East', 'Russia and Ukraine'] as const;

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

function teaserFrom(brief: AffairsBrief) {
  const raw = brief.summary.replace(/\s+/g, ' ').trim();
  if (raw.length <= 140) return raw;
  const cut = raw.slice(0, 137);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function AffairsModal({
  brief,
  onClose,
}: {
  brief: AffairsBrief;
  onClose: () => void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="gk-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <article className="gk-modal-body">
          <p className="gk-tile-kicker">
            {brief.region} · <time dateTime={brief.date}>{formatDate(brief.date)}</time>
          </p>
          <div className="prep-ask-block">
            <p className="prep-ask-label">Interview question</p>
            <h2 id={titleId} className="prep-ask">
              {brief.question}
            </h2>
          </div>
          <p className="prep-muted">Context · {brief.title}</p>
          <p className="gk-modal-summary">{brief.summary}</p>
          <p>
            <strong>Why Pakistan: </strong>
            {brief.whyPakistan}
          </p>
          <h3>Answer points</h3>
          <ul>
            {brief.answerPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <h3>Watch next</h3>
          <ul>
            {brief.watch.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h3>Sources</h3>
          <ul className="gk-modal-sources">
            {brief.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>{' '}
                <time dateTime={source.publishedAt}>({source.publishedAt})</time>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

type Primer = (typeof regionPrimer)[number];

function PrimerModal({ country, onClose }: { country: Primer; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="gk-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <article className="gk-modal-body">
          <p className="gk-tile-kicker">Country primer · HSSC geography</p>
          <h2 id={titleId}>{country.country}</h2>
          <p>
            <strong>Capital: </strong>
            {country.capital}
          </p>
          <p className="gk-modal-summary">{country.whyItMatters}</p>
          <a href={country.source} target="_blank" rel="noopener noreferrer">
            Background source
          </a>
        </article>
      </div>
    </div>
  );
}

export default function CurrentAffairsBrowser({
  showDownload = false,
  onDownload,
}: {
  showDownload?: boolean;
  onDownload?: () => void;
}) {
  const [region, setRegion] = useState<(typeof regionFilters)[number]>('All');
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<AffairsBrief | null>(null);
  const [primer, setPrimer] = useState<Primer | null>(null);
  const [stale, setStale] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setStale(Date.now() - Date.parse(`${researchAsOf}T00:00:00Z`) > 7 * 86400000),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  const briefs = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return currentAffairs
      .filter((brief) => (region === 'All' || brief.region === region) && (!q || `${brief.title} ${brief.summary} ${brief.question} ${brief.region}`.toLocaleLowerCase().includes(q)))
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [region, query]);

  return (
    <>
      <section className="prep-panel">
        <h2>How to use these cards</h2>
        <p>
          <strong>Research cutoff: {formatDate(researchAsOf)}.</strong> Tap a card for a short popup — same pattern as
          General Knowledge. Facts stay HSSC / interview level: who, what, where, why Pakistan, then stop.
        </p>
        <div className="prep-note">
          {stale
            ? 'This snapshot is more than a week old. Check fresh reporting before relying on it in an interview.'
            : 'Conflicts change quickly. Recheck each briefing’s watch list before an interview.'}
        </div>
        <details className="prep-details mt-3">
          <summary>Evidence rules</summary>
          <p>{researchCaveat}</p>
        </details>
        {showDownload && onDownload ? (
          <button type="button" className="prep-button prep-button-secondary mt-4" onClick={onDownload}>
            Download report
          </button>
        ) : null}
      </section>

      <div className="prep-filters">
        <label className="prep-field">
          Region
          <select value={region} onChange={(event) => setRegion(event.target.value as (typeof regionFilters)[number])}>
            {regionFilters.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="prep-field">
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="India, defence pact, Hormuz…"
          />
        </label>
      </div>

      <p className="prep-muted mb-4" role="status">
        {briefs.length} briefing cards · {regionPrimer.length} country primers · tap to open
      </p>

      {!briefs.length ? <div className="prep-panel">No briefing matches. Try a broader search.</div> : null}

      <div className="gk-tile-grid">
        {briefs.map((brief) => (
          <button
            key={brief.id}
            type="button"
            className="gk-tile gk-tile--topic"
            onClick={() => setModal(brief)}
            id={brief.id}
          >
            <span className="gk-tile-meta">
              <span className="gk-tile-kicker">{brief.region}</span>
              <span className="gk-badge gk-badge--source">
                <time dateTime={brief.date}>{brief.date}</time>
              </span>
            </span>
            <strong className="gk-tile-title">{brief.title}</strong>
            <span className="gk-tile-teaser">{teaserFrom(brief)}</span>
            <span className="prep-ask-label" style={{ marginTop: '0.35rem' }}>
              Interview question
            </span>
            <span className="gk-tile-teaser" style={{ fontWeight: 700, color: 'var(--ink)' }}>
              {brief.question}
            </span>
            <span className="gk-tile-cta">Open briefing →</span>
          </button>
        ))}
      </div>

      <section className="prep-panel mt-10" aria-labelledby="primers">
        <h2 id="primers">Country primers</h2>
        <p>Background geography only (capital + why it matters). Inclusion does not mean a country is at war.</p>
        <div className="gk-tile-grid mt-5">
          {regionPrimer.map((country) => (
            <button
              key={country.country}
              type="button"
              className="gk-tile gk-tile--qa"
              onClick={() => setPrimer(country)}
            >
              <span className="gk-tile-meta">
                <span className="gk-badge gk-badge--source">Primer</span>
              </span>
              <strong className="gk-tile-title">{country.country}</strong>
              <span className="gk-tile-teaser">Capital: {country.capital}</span>
              <span className="gk-tile-cta">Open primer →</span>
            </button>
          ))}
        </div>
      </section>

      {modal ? <AffairsModal brief={modal} onClose={() => setModal(null)} /> : null}
      {primer ? <PrimerModal country={primer} onClose={() => setPrimer(null)} /> : null}
    </>
  );
}
