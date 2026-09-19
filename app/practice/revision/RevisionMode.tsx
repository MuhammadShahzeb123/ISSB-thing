'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { outdoorObstacles } from '../../gto/outdoor/obstacles';
import { coreDimensions, dimensionLabels, isCoreDimension, obstacleModuleId, practiceModules, type CoreDimension, type PracticeModuleId } from '../../lib/practiceModules';
import { recordAttempt, usePracticeProgress, type ModuleProgress } from '../../lib/practiceProgress';

const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' });

function Status({ entry }: { entry?: ModuleProgress }) {
  if (!entry?.attempts && !entry?.reviewedAt) return <span className="revision-status">Not started</span>;
  return <span className="revision-status revision-status--active">
    {entry.attempts ? `${entry.attempts} ${entry.attempts === 1 ? 'attempt' : 'attempts'}` : ''}
    {entry.lastAttemptAt ? ` · last ${dateFormat.format(new Date(entry.lastAttemptAt))}` : ''}
  </span>;
}

export default function RevisionMode() {
  const router = useRouter();
  const requested = useSearchParams().get('d');
  const filter: CoreDimension | 'all' = isCoreDimension(requested) ? requested : 'all';
  const { progress, toggleReviewed } = usePracticeProgress();
  const shown = coreDimensions.filter((dimension) => filter === 'all' || dimension === filter);

  const setFilter = (value: CoreDimension | 'all') => router.replace(value === 'all' ? '/practice/revision' : `/practice/revision?d=${value}`, { scroll: false });
  const reviewedToggle = (id: PracticeModuleId, label: string) => (
    <label className="revision-reviewed">
      <input type="checkbox" checked={!!progress.modules[id]?.reviewedAt} onChange={() => toggleReviewed(id)} />
      Reviewed<span className="sr-only"> {label}</span>
    </label>
  );

  return (
    <div className="neo-page prep-page"><div className="prep-shell">
      <header className="prep-header">
        <h1>Revision mode</h1>
        <p>Choose a specific test to revisit, or focus on the ones you have not reviewed yet. Practice sessions started from a dimension page are drawn at random. This page is where you pick.</p>
      </header>

      <div className="prep-tabs" aria-label="Filter by dimension">
        <button type="button" aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All dimensions</button>
        {coreDimensions.map((dimension) => <button key={dimension} type="button" aria-pressed={filter === dimension} onClick={() => setFilter(dimension)}>{dimensionLabels[dimension]}</button>)}
      </div>

      {shown.map((dimension) => {
        const modules = practiceModules.filter((item) => item.dimension === dimension);
        const reviewed = modules.filter((item) => progress.modules[item.id]?.reviewedAt).length;
        return (
          <section key={dimension} className="prep-panel" aria-labelledby={`revision-${dimension}`}>
            <div className="prep-status">
              <h2 id={`revision-${dimension}`} className="mb-0">{dimensionLabels[dimension]}</h2>
              <span className="prep-muted">{reviewed} of {modules.length} reviewed</span>
            </div>
            <ul className="revision-list">
              {modules.map((item) => (
                <li key={item.id} className="revision-item">
                  <div className="revision-item-text">
                    <Link href={item.href} onClick={() => recordAttempt(item.id, false)} className="revision-item-title">{item.title}</Link>
                    <p className="prep-muted">{item.description} About {item.minutes} min.</p>
                    <Status entry={progress.modules[item.id]} />
                  </div>
                  {reviewedToggle(item.id, item.title)}
                  {item.id === 'gto-outdoor' && (
                    <ul className="revision-sublist" aria-label="Individual obstacles">
                      {outdoorObstacles.map((obstacle) => {
                        const id = obstacleModuleId(obstacle.id);
                        return (
                          <li key={obstacle.id}>
                            <Link href={`/gto/outdoor?obstacle=${obstacle.id}`} onClick={() => recordAttempt(id, false)}>{obstacle.name}</Link>
                            {reviewedToggle(id, obstacle.name)}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <Link className="prep-button mt-4" href={`/practice/start?d=${dimension}`}>Random {dimensionLabels[dimension]} test</Link>
          </section>
        );
      })}
      <p className="prep-muted">Progress is stored only in this browser. Clearing site data resets it.</p>
    </div></div>
  );
}
