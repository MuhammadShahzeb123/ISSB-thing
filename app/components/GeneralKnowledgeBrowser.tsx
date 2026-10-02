'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  generalKnowledgeCards,
  gkCategories,
  gkCategoryCounts,
  gkStatusLabels,
  type GkCategory,
  type GkCard,
  type GkStatus,
} from '../lib/generalKnowledge';
import { gkTopics, type GkTopic } from '../lib/gkTopics';

const PAGE_SIZE = 24;

const statusFilters = [
  ['all', 'All statuses'],
  ['corrected', 'Corrected'],
  ['disputed', 'Disputed'],
  ['context', 'Verified + context'],
  ['verified', 'Verified'],
  ['reviewed', 'Reviewed'],
  ['dated', 'Dated briefings'],
] as const;

type ModalState =
  | { kind: 'topic'; topic: GkTopic }
  | { kind: 'card'; card: GkCard }
  | null;

function badgeClass(status: GkStatus) {
  if (status === 'corrected') return 'gk-badge gk-badge--corrected';
  if (status === 'disputed') return 'gk-badge gk-badge--disputed';
  if (status === 'dated' || status === 'reviewed') return 'gk-badge gk-badge--source';
  return 'gk-badge gk-badge--verified';
}

function TopicCardButton({
  topic,
  onOpen,
}: {
  topic: GkTopic;
  onOpen: (topic: GkTopic) => void;
}) {
  return (
    <button type="button" className="gk-tile gk-tile--topic" onClick={() => onOpen(topic)}>
      <span className="gk-tile-kicker">{gkCategories[topic.category].label}</span>
      <strong className="gk-tile-title">{topic.title}</strong>
      <span className="gk-tile-teaser">{topic.teaser}</span>
      <span className="gk-tile-cta">Open topic →</span>
    </button>
  );
}

function QaCardButton({
  card,
  onOpen,
}: {
  card: GkCard;
  onOpen: (card: GkCard) => void;
}) {
  const rtl = card.language === 'ur';
  return (
    <button
      type="button"
      className="gk-tile gk-tile--qa"
      onClick={() => onOpen(card)}
      lang={card.language}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <span className="gk-tile-meta">
        <span className={badgeClass(card.status)}>{gkStatusLabels[card.status]}</span>
        <span className="gk-badge gk-badge--source">{gkCategories[card.category].label}</span>
      </span>
      <strong className="gk-tile-title">{card.prompt}</strong>
      <span className="gk-tile-cta">View answer →</span>
    </button>
  );
}

function GkModal({
  state,
  onClose,
}: {
  state: Exclude<ModalState, null>;
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
      <div
        className="gk-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>

        {state.kind === 'topic' ? (
          <article className="gk-modal-body">
            <p className="gk-tile-kicker">{gkCategories[state.topic.category].label}</p>
            <h2 id={titleId}>{state.topic.title}</h2>
            <p className="gk-modal-summary">{state.topic.summary}</p>
            <h3>Key points</h3>
            <ul>
              {state.topic.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <p className="prep-note">
              <strong>Remember: </strong>
              {state.topic.remember}
            </p>
            <p>
              <strong>Why ISSB asks: </strong>
              {state.topic.whyIssb}
            </p>
            {state.topic.watch && state.topic.watch.length > 0 && (
              <>
                <h3>Watch next</h3>
                <ul>
                  {state.topic.watch.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            <h3>Sources</h3>
            <ul className="gk-modal-sources">
              {state.topic.sources.map((source) => (
                <li key={`${source.title}-${source.url ?? 'local'}`}>
                  {source.url ? (
                    <a
                      href={source.url}
                      {...(source.url.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {source.title}
                    </a>
                  ) : (
                    source.title
                  )}
                </li>
              ))}
            </ul>
          </article>
        ) : (
          <article className="gk-modal-body" lang={state.card.language} dir={state.card.language === 'ur' ? 'rtl' : 'ltr'}>
            <div className="gk-card-meta">
              <span className={badgeClass(state.card.status)}>{gkStatusLabels[state.card.status]}</span>
              <span className="gk-badge gk-badge--source">{gkCategories[state.card.category].label}</span>
            </div>
            <h2 id={titleId}>{state.card.prompt}</h2>
            {state.card.status === 'corrected' && state.card.factCheck && (
              <p className="gk-correction">
                <strong>Correct answer: </strong>
                {state.card.factCheck}
              </p>
            )}
            {state.card.answer && (
              <>
                <p className="prep-muted">
                  {state.card.status === 'corrected'
                    ? 'Printed in the source (contains the error above)'
                    : state.card.language === 'ur'
                      ? 'Source answer'
                      : 'Answer'}
                </p>
                <p className="whitespace-pre-line">{state.card.answer}</p>
              </>
            )}
            {state.card.status !== 'corrected' && state.card.factCheck && (
              <p className="prep-note">{state.card.factCheck}</p>
            )}
            {state.card.detail && state.card.status !== 'corrected' && (
              <p className="prep-muted">Transcription note: {state.card.detail}</p>
            )}
            <a
              className="prep-source-link"
              href={state.card.sourceHref}
              {...(state.card.sourceHref.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              {state.card.sourceLabel}
            </a>
          </article>
        )}
      </div>
    </div>
  );
}

export default function GeneralKnowledgeBrowser() {
  const [category, setCategory] = useState<GkCategory | 'all'>('all');
  const [status, setStatus] = useState<(typeof statusFilters)[number][0]>('all');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [modal, setModal] = useState<ModalState>(null);
  const [mode, setMode] = useState<'topics' | 'qa'>('topics');

  const topics = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return gkTopics.filter(
      (topic) =>
        (category === 'all' || topic.category === category) &&
        (!needle ||
          `${topic.title} ${topic.teaser} ${topic.summary} ${topic.keyPoints.join(' ')}`
            .toLocaleLowerCase()
            .includes(needle)),
    );
  }, [category, query]);

  const cards = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return generalKnowledgeCards.filter(
      (card) =>
        (category === 'all' || card.category === category) &&
        (status === 'all' || card.status === (status as GkStatus)) &&
        (!needle ||
          `${card.prompt} ${card.answer ?? ''} ${card.factCheck ?? ''}`
            .toLocaleLowerCase()
            .includes(needle)),
    );
  }, [category, query, status]);

  const pages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const corrected = generalKnowledgeCards.filter((card) => card.status === 'corrected').length;

  const chooseCategory = (next: GkCategory | 'all') => {
    setCategory(next);
    setPage(0);
  };

  const topicCountFor = (key: GkCategory | 'all') =>
    key === 'all' ? gkTopics.length : gkTopics.filter((topic) => topic.category === key).length;

  return (
    <>
      <section className="prep-panel">
        <h2>General knowledge — cards &amp; pop-ups</h2>
        <p>
          {gkTopics.length} compact study topics plus {generalKnowledgeCards.length} Q&amp;A cards across{' '}
          {Object.keys(gkCategories).length} categories. Tap a card to open a pop-up — no drop-downs.
        </p>
        <div className="prep-note">
          Start with the <strong>Study topics</strong> (Indus Waters Treaty, Pakistan geography, Khyber Pass, CPEC,
          and related briefs). Then drill the photo-sourced Q&amp;A. Urdu Islamic-studies answers were fact-checked;{' '}
          {corrected} printed answers were wrong and show a <strong>correct answer</strong> in the pop-up.
        </div>
      </section>

      <div className="prep-tabs" role="tablist" aria-label="General knowledge mode">
        <button type="button" role="tab" aria-selected={mode === 'topics'} aria-pressed={mode === 'topics'} onClick={() => setMode('topics')}>
          Study topics ({topics.length})
        </button>
        <button type="button" role="tab" aria-selected={mode === 'qa'} aria-pressed={mode === 'qa'} onClick={() => setMode('qa')}>
          Quick Q&amp;A ({cards.length})
        </button>
      </div>

      <div className="gk-categories" role="group" aria-label="Categories">
        <button type="button" aria-pressed={category === 'all'} onClick={() => chooseCategory('all')}>
          <strong>All categories</strong>
          <span>
            {mode === 'topics' ? `${gkTopics.length} topics` : `${generalKnowledgeCards.length} cards`}
          </span>
        </button>
        {(Object.keys(gkCategories) as GkCategory[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={category === key}
            onClick={() => chooseCategory(key)}
            title={gkCategories[key].description}
          >
            <strong>{gkCategories[key].label}</strong>
            <span>
              {mode === 'topics'
                ? `${topicCountFor(key)} topics`
                : `${gkCategoryCounts[key]} cards`}
            </span>
          </button>
        ))}
      </div>

      <div className="prep-filters">
        <label className="prep-field">
          Search
          <input
            type="search"
            dir="auto"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(0);
            }}
            placeholder="Indus, CPEC, Khyber, K2, Badr…"
          />
        </label>
      </div>

      {mode === 'qa' && (
        <div className="gk-status-chips" role="group" aria-label="Fact-check status">
          {statusFilters.map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={status === value}
              onClick={() => {
                setStatus(value);
                setPage(0);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {category !== 'all' && <p className="prep-muted mb-3">{gkCategories[category].description}</p>}

      {mode === 'topics' ? (
        <>
          <p className="prep-muted mb-5" role="status">
            {topics.length} study topics · click a card for the compact briefing
          </p>
          {!topics.length && (
            <p className="prep-panel">No topics match. Clear the search or pick another category.</p>
          )}
          <div className="gk-tile-grid">
            {topics.map((topic) => (
              <TopicCardButton key={topic.id} topic={topic} onOpen={(item) => setModal({ kind: 'topic', topic: item })} />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="prep-muted mb-5" role="status">
            {cards.length} Q&amp;A cards · page {safePage + 1} of {pages}
          </p>
          {!cards.length && (
            <p className="prep-panel">No cards match. Clear the search or pick another category.</p>
          )}
          <div className="gk-tile-grid">
            {cards.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE).map((card) => (
              <QaCardButton key={card.id} card={card} onOpen={(item) => setModal({ kind: 'card', card: item })} />
            ))}
          </div>
          <div className="prep-actions mt-5">
            <button
              type="button"
              className="prep-button prep-button-secondary"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
            >
              Previous page
            </button>
            <button
              type="button"
              className="prep-button"
              disabled={safePage + 1 >= pages}
              onClick={() => setPage(safePage + 1)}
            >
              Next page
            </button>
            <a href="/study" className="prep-button prep-button-secondary">
              Spaced memory practice
            </a>
          </div>
        </>
      )}

      {mode === 'topics' && (
        <div className="prep-actions mt-5">
          <button type="button" className="prep-button" onClick={() => setMode('qa')}>
            Drill Quick Q&amp;A →
          </button>
          <a href="/current-affairs" className="prep-button prep-button-secondary">
            World affairs briefings
          </a>
          <a href="/study" className="prep-button prep-button-secondary">
            Spaced memory practice
          </a>
        </div>
      )}

      {modal && <GkModal state={modal} onClose={() => setModal(null)} />}
    </>
  );
}
