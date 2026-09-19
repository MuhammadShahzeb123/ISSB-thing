'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { dimensionLabels, drawRandomModule, isCoreDimension } from '../../lib/practiceModules';
import { readProgressSnapshot, recordAttempt } from '../../lib/practiceProgress';

export function withDrawnParam(href: string, moduleId: string) {
  const [path, hash = ''] = href.split('#');
  return `${path}${path.includes('?') ? '&' : '?'}drawn=${encodeURIComponent(moduleId)}${hash ? `#${hash}` : ''}`;
}

export default function RandomStart() {
  const router = useRouter();
  const requested = useSearchParams().get('d');
  const dimension = isCoreDimension(requested) ? requested : 'all';
  const [failed, setFailed] = useState(false);
  const drawnRef = useRef(false);

  useEffect(() => {
    // Strict mode runs effects twice in development; draw only once.
    if (drawnRef.current) return;
    drawnRef.current = true;
    try {
      const { module, href } = drawRandomModule(dimension, readProgressSnapshot().recentDraws);
      recordAttempt(module.id, true);
      router.replace(withDrawnParam(href, module.id));
    } catch {
      window.setTimeout(() => setFailed(true), 0);
    }
  }, [dimension, router]);

  return (
    <div className="neo-page prep-page"><div className="prep-shell">
      <section className="prep-panel mt-8" aria-live="polite">
        <h1 className="text-3xl font-black">{failed ? 'Could not draw a test' : 'Drawing a random test…'}</h1>
        <p className="mt-3">{dimension === 'all' ? 'From all three core dimensions.' : `From ${dimensionLabels[dimension]}.`}</p>
        {failed && <p className="mt-3">Choose a test yourself in <Link href="/practice/revision">revision mode</Link>.</p>}
      </section>
    </div></div>
  );
}
