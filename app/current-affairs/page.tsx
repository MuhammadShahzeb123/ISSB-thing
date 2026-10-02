import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeDisclaimer from '../components/PracticeDisclaimer';
import CurrentAffairsBrowser from '../components/CurrentAffairsBrowser';
import { currentAffairs, regionPrimer, researchAsOf } from '../lib/currentAffairs';

export const metadata: Metadata = {
  title: 'World Affairs & Wars - ISSB Prep',
  description:
    'Compact, sourced current-affairs briefings for ISSB interviews: Middle East conflicts, Asia, Saudi-Türkiye-Pakistan defence ties, India-Pakistan, and Afghanistan.',
};

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

export default function CurrentAffairsPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">Current affairs</p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">World affairs &amp; wars</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
          Card grid for ISSB general knowledge and the Deputy President interview — same style as General Knowledge.
          Focus: Middle East, Asia, Saudi Arabia–Türkiye–Pakistan defence ties, India–Pakistan, and Afghanistan. Dated
          study snapshot (cutoff {formatDate(researchAsOf)}), not a live ticker. {currentAffairs.length} briefings ·{' '}
          {regionPrimer.length} primers.
        </p>

        <p className="mt-4">
          <Link href="/interview?tab=affairs">Open interactive interview practice →</Link>
        </p>

        <div className="mt-8">
          <CurrentAffairsBrowser />
        </div>

        <div className="mt-8 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
