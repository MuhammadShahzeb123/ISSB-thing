'use client';

import { useEffect, useState } from 'react';
import { formatClock } from '../lib/practice';
import { RollingNumber } from './motion/RollingNumber';
import { Swap } from './motion/Swap';

export default function PracticeTimer({ seconds, label = 'Practice timer' }: { seconds: number; label?: string }) {
  const [left, setLeft] = useState(seconds);
  const [deadline, setDeadline] = useState<number | null>(null);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(remaining);
      if (!remaining) setDeadline(null);
    };
    const timer = window.setInterval(tick, 200);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return (
    <div className="prep-timer">
      <div><span className="prep-muted">{label}</span><p role="timer" aria-label={`${label}: ${formatClock(left)}`} className="prep-clock"><RollingNumber value={formatClock(left)} /></p></div>
      <div className="prep-actions">
        <button type="button" className="prep-button" disabled={!left} onClick={() => {
          if (deadline) {
            setLeft(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
            setDeadline(null);
          } else setDeadline(Date.now() + left * 1000);
        }}><Swap id={deadline ? 'pause' : 'start'} morph="width" inline>{deadline ? 'Pause' : 'Start timer'}</Swap></button>
        <button type="button" className="prep-button prep-button-secondary" onClick={() => { setDeadline(null); setLeft(seconds); }}>Reset timer</button>
      </div>
      <span role="status">{left === 0 ? 'Time is up. Finish your sentence and review.' : ''}</span>
    </div>
  );
}
