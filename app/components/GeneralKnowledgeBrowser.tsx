'use client';

import { useMemo, useState } from 'react';
import { generalKnowledgeCards, gkCategories, gkCategoryCounts, gkStatusLabels, type GkCategory, type GkCard, type GkStatus } from '../lib/generalKnowledge';

const PAGE_SIZE = 20;
const statusFilters = [
  ['all', 'All statuses'],
  ['corrected', 'Corrected by fact-check'],
  ['disputed', 'Disputed'],
  ['context', 'Verified + context'],
  ['verified', 'Verified'],
  ['reviewed', 'Reviewed study cards'],
] as const;

function Card({ card }: { card: GkCard }) {
  const rtl = card.language === 'ur';
  return (
    <details className="prep-details">
      <summary lang={card.language} dir={rtl ? 'rtl' : 'ltr'}>{card.prompt}</summary>
      <div className="gk-card-meta">
        <span className={`gk-badge gk-badge--${card.status === 'corrected' ? 'corrected' : card.status === 'disputed' ? 'disputed' : card.status === 'dated' || card.status === 'reviewed' ? 'source' : 'verified'}`}>{gkStatusLabels[card.status]}</span>
        <span className="gk-badge gk-badge--source">{gkCategories[card.category].label}</span>
      </div>
      {card.status === 'corrected' && card.factCheck && <p className="gk-correction"><strong>Correct answer: </strong>{card.factCheck}</p>}
      {card.answer && <>
        <p className="prep-muted">{card.status === 'corrected' ? 'Printed in the source (contains the error above)' : card.language === 'ur' ? 'Source answer' : 'Answer'}</p>
        <p lang={card.language} dir={rtl ? 'rtl' : 'ltr'} className="whitespace-pre-line">{card.answer}</p>
      </>}
      {card.status !== 'corrected' && card.factCheck && <p className="prep-note">{card.factCheck}</p>}
      {card.detail && card.status !== 'corrected' && <p className="prep-muted" dir="auto">Transcription note: {card.detail}</p>}
      <a className="prep-source-link" href={card.sourceHref} {...(card.sourceHref.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{card.sourceLabel}</a>
    </details>
  );
}

export default function GeneralKnowledgeBrowser() {
  const [category, setCategory] = useState<GkCategory | 'all'>('all');
  const [status, setStatus] = useState<(typeof statusFilters)[number][0]>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);

  const cards = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return generalKnowledgeCards.filter((card) => (category === 'all' || card.category === category)
      && (status === 'all' || card.status === (status as GkStatus))
      && (!needle || `${card.prompt} ${card.answer ?? ''} ${card.factCheck ?? ''}`.toLocaleLowerCase().includes(needle)));
  }, [category, query, status]);
  const pages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const corrected = generalKnowledgeCards.filter((card) => card.status === 'corrected').length;

  const choose = (next: GkCategory | 'all') => { setCategory(next); setPage(0); };

  return <>
    <section className="prep-panel">
      <h2>General knowledge by category</h2>
      <p>{generalKnowledgeCards.length} cards sorted into {Object.keys(gkCategories).length} categories. Try to answer each one before you open it.</p>
      <div className="prep-note">
        The Urdu Islamic-studies notes were fact-checked item by item. {corrected} printed answers were wrong and show a <strong>correct answer</strong> above the original. Where historians or scholars disagree, the card is marked <strong>disputed</strong> and explains how. For religious rulings, confirm with a qualified scholar.
      </div>
    </section>

    <div className="gk-categories" role="group" aria-label="Categories">
      <button type="button" aria-pressed={category === 'all'} onClick={() => choose('all')}><strong>All categories</strong><span>{generalKnowledgeCards.length} cards</span></button>
      {(Object.keys(gkCategories) as GkCategory[]).map((key) => (
        <button key={key} type="button" aria-pressed={category === key} onClick={() => choose(key)} title={gkCategories[key].description}>
          <strong>{gkCategories[key].label}</strong><span>{gkCategoryCounts[key]} cards</span>
        </button>
      ))}
    </div>

    <div className="prep-filters">
      <label className="prep-field">Fact-check status
        <select value={status} onChange={(event) => { setStatus(event.target.value as typeof status); setPage(0); }}>
          {statusFilters.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="prep-field">Search
        <input type="search" dir="auto" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} placeholder="Badr, K2, capital, UN…" />
      </label>
    </div>

    {category !== 'all' && <p className="prep-muted mb-3">{gkCategories[category].description}</p>}
    <p className="prep-muted mb-5" role="status">{cards.length} cards · page {safePage + 1} of {pages}</p>
    {!cards.length && <p className="prep-panel">No cards match. Clear the search or pick another category.</p>}
    {cards.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE).map((card) => <Card key={card.id} card={card} />)}
    <div className="prep-actions mt-5">
      <button type="button" className="prep-button prep-button-secondary" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Previous page</button>
      <button type="button" className="prep-button" disabled={safePage + 1 >= pages} onClick={() => setPage(safePage + 1)}>Next page</button>
      <a href="/study" className="prep-button prep-button-secondary">Spaced memory practice</a>
    </div>
  </>;
}
