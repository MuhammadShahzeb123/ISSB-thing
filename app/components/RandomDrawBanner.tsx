'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { dimensionLabels, moduleById } from '../lib/practiceModules';

/** Shown on any page reached through a random draw (`?drawn=<module id>`). */
export default function RandomDrawBanner() {
  const pathname = usePathname();
  const drawn = moduleById(useSearchParams().get('drawn') ?? '');
  if (!drawn || pathname.startsWith('/practice/')) return null;
  return (
    <div className="random-banner" role="status">
      <p><span className="random-banner-label">Random test</span> <strong>{drawn.title}</strong> · {dimensionLabels[drawn.dimension]}</p>
      <div className="random-banner-actions">
        <Link href={`/practice/start?d=${drawn.dimension}`}>Draw another</Link>
        <Link href={`/practice/revision?d=${drawn.dimension}`}>Revision mode</Link>
      </div>
    </div>
  );
}
