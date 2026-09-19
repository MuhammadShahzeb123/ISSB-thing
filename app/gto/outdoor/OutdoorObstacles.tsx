'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import DimensionNav from '../../components/DimensionNav';
import { obstacleModuleId } from '../../lib/practiceModules';
import { usePracticeProgress } from '../../lib/practiceProgress';
import ObstaclePlayer from './ObstaclePlayer';
import { obstacleSources, outdoorObstacles } from './obstacles';

export default function OutdoorObstacles() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progress, toggleReviewed } = usePracticeProgress();
  const selected = outdoorObstacles.find((item) => item.id === searchParams.get('obstacle')) ?? outdoorObstacles[0];
  const reviewedCount = outdoorObstacles.filter((item) => progress.modules[obstacleModuleId(item.id)]?.reviewedAt).length;
  const isReviewed = !!progress.modules[obstacleModuleId(selected.id)]?.reviewedAt;

  const select = (id: string) => router.replace(`/gto/outdoor?obstacle=${id}`, { scroll: false });

  return (
    <div className="neo-page neo-page--leadership prep-page"><div className="prep-shell">
      <DimensionNav active="gto" />
      <header className="prep-header">
        <h1>Outdoor obstacles</h1>
        <p>The nine individual obstacles from the GTO outdoor series. Each animation shows the technique one step at a time. Pause it, step through it, or switch on key positions to compare poses.</p>
      </header>
      <div className="prep-note">
        Obstacle lists, heights and widths come from candidate forums and preparation guides, not from ISSB. They change between boards and entries, so follow the GTO’s briefing on the day. <Link className="prep-source-link" href="/gto">Back to GTO overview</Link>
      </div>

      <div className="prep-status">
        <p className="prep-muted" role="status">{reviewedCount} of {outdoorObstacles.length} obstacles marked as reviewed</p>
        <Link className="prep-button prep-button-secondary" href="/practice/start?d=gto">Random GTO test</Link>
      </div>

      <nav className="obstacle-picker" aria-label="Choose an obstacle">
        {outdoorObstacles.map((item, index) => {
          const reviewed = !!progress.modules[obstacleModuleId(item.id)]?.reviewedAt;
          return (
            <button key={item.id} type="button" aria-pressed={item.id === selected.id} onClick={() => select(item.id)}>
              <span className="obstacle-picker-number">{index + 1}</span>
              <span className="obstacle-picker-name">{item.name}</span>
              {reviewed && <span className="obstacle-picker-done" aria-label="reviewed">✓</span>}
            </button>
          );
        })}
      </nav>

      <div className="prep-split mt-6">
        <section className="prep-panel" aria-labelledby="obstacle-heading">
          <h2 id="obstacle-heading">{selected.name}</h2>
          <p>{selected.summary}</p>
          <ObstaclePlayer key={selected.id} obstacle={selected} />
        </section>
        <aside className="prep-panel">
          <h2>What it looks like</h2>
          <ul>{selected.layout.map((line) => <li key={line}>{line}</li>)}</ul>
          <h3>Common mistakes</h3>
          <ul>{selected.mistakes.map((line) => <li key={line}>{line}</li>)}</ul>
          <h3>Safety</h3>
          <p>Practise on soft ground under supervision. Never attempt an obstacle you have not been briefed on, and stop if you feel pain.</p>
          <label className="prep-checklist mt-5 flex">
            <input type="checkbox" checked={isReviewed} onChange={() => toggleReviewed(obstacleModuleId(selected.id))} />
            I have studied this technique
          </label>
          <p className="prep-muted">Progress is saved in this browser only.</p>
        </aside>
      </div>

      <details className="prep-details">
        <summary>Where the obstacle details come from</summary>
        <ul>{obstacleSources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a></li>)}</ul>
        <p className="prep-muted">The official ISSB selection-system page describes GTO outdoor tasks only in general terms. The animations are original illustrations, not official demonstrations.</p>
      </details>
    </div></div>
  );
}
