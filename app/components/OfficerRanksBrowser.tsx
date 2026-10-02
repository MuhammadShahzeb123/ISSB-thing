'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  nextRankPrompts,
  officerRankRows,
  serviceLabels,
  type RecallPrompt,
  type ServiceKey,
} from '../lib/officerRanks';

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function OfficerRanksBrowser() {
  const [mode, setMode] = useState<'table' | 'recall'>('table');
  const [serviceFilter, setServiceFilter] = useState<ServiceKey | 'all'>('all');
  const [deck, setDeck] = useState<RecallPrompt[]>(() => shuffle([...nextRankPrompts]));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ right: 0, seen: 0 });

  const filteredPrompts = useMemo(
    () =>
      serviceFilter === 'all'
        ? nextRankPrompts
        : nextRankPrompts.filter((p) => p.service === serviceFilter),
    [serviceFilter],
  );

  useEffect(() => {
    setDeck(shuffle([...filteredPrompts]));
    setIndex(0);
    setRevealed(false);
    setScore({ right: 0, seen: 0 });
  }, [filteredPrompts]);

  const current = deck[index];

  const mark = (knewIt: boolean) => {
    setScore((s) => ({ right: s.right + (knewIt ? 1 : 0), seen: s.seen + 1 }));
    if (index >= deck.length - 1) {
      setDeck(shuffle([...filteredPrompts]));
      setIndex(0);
    } else {
      setIndex((i) => i + 1);
    }
    setRevealed(false);
  };

  return (
    <div className="ranks-unified">
      <section className="prep-panel">
        <h2>Unified officer ranks — Army · Air Force · Navy</h2>
        <p>
          Officer ranks only (no soldiers, NCOs, JCOs, or warrant ranks). The table shows each grade with its
          exact equivalents across the three services. Use recall cards to practise “what comes next?”
        </p>
      </section>

      <div className="prep-tabs" role="tablist" aria-label="Ranks study mode">
        <button type="button" role="tab" aria-selected={mode === 'table'} aria-pressed={mode === 'table'} onClick={() => setMode('table')}>
          Hierarchy table
        </button>
        <button type="button" role="tab" aria-selected={mode === 'recall'} aria-pressed={mode === 'recall'} onClick={() => setMode('recall')}>
          Next-rank recall ({filteredPrompts.length})
        </button>
      </div>

      {mode === 'table' ? (
        <section className="ranks-table-wrap" aria-label="Officer rank equivalents">
          <table className="ranks-table">
            <thead>
              <tr>
                <th scope="col">NATO</th>
                <th scope="col">Army</th>
                <th scope="col">Air Force</th>
                <th scope="col">Navy</th>
                <th scope="col">Cue</th>
              </tr>
            </thead>
            <tbody>
              {officerRankRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span className="ranks-nato">{row.natoCode}</span>
                    <span className="ranks-stars" aria-hidden="true">
                      {'★'.repeat(Math.min(row.stars, 5))}
                      {row.stars > 5 ? '+' : ''}
                    </span>
                  </td>
                  <td>
                    <strong>{row.army}</strong>
                  </td>
                  <td>
                    <strong>{row.airforce}</strong>
                  </td>
                  <td>
                    <strong>{row.navy}</strong>
                  </td>
                  <td>
                    <span className="ranks-cue">{row.cue}</span>
                    {row.note && <span className="ranks-note">{row.note}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="prep-muted mt-4">
            Source pattern: PAF inter-services ranks chart (Army ↔ Air Force ↔ Navy). Five-star ranks are honorary.
          </p>
        </section>
      ) : (
        <section className="ranks-recall">
          <div className="gk-status-chips" role="group" aria-label="Filter by service">
            {(
              [
                ['all', 'All services'],
                ['army', 'Army'],
                ['airforce', 'Air Force'],
                ['navy', 'Navy'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={serviceFilter === value}
                onClick={() => setServiceFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="prep-muted mb-4" role="status">
            Card {Math.min(index + 1, deck.length)} of {deck.length}
            {score.seen > 0 ? ` · session ${score.right}/${score.seen} correct` : ''}
          </p>

          {current ? (
            <div className="ranks-recall-card">
              <p className="gk-tile-kicker">{serviceLabels[current.service]} · next rank?</p>
              <h3 className="ranks-recall-prompt">{current.promptRank}</h3>
              <p className="prep-muted">Which rank comes <strong>after</strong> this one in the same service?</p>

              {!revealed ? (
                <button type="button" className="prep-button" onClick={() => setRevealed(true)}>
                  Reveal next rank
                </button>
              ) : (
                <div className="ranks-recall-answer">
                  <p className="ranks-recall-next">
                    Next: <strong>{current.nextRank}</strong>
                  </p>
                  <p className="prep-muted">
                    Equivalents at that grade — Army: <strong>{current.equivalents.army}</strong> · AF:{' '}
                    <strong>{current.equivalents.airforce}</strong> · Navy:{' '}
                    <strong>{current.equivalents.navy}</strong> ({current.natoCode})
                  </p>
                  <div className="prep-actions mt-4">
                    <button type="button" className="prep-button prep-button-secondary" onClick={() => mark(false)}>
                      Missed it
                    </button>
                    <button type="button" className="prep-button" onClick={() => mark(true)}>
                      Got it
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="prep-panel">No recall prompts for this filter.</p>
          )}
        </section>
      )}
    </div>
  );
}
