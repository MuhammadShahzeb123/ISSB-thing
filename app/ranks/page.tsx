import type { Metadata } from 'next';
import Link from 'next/link';
import OfficerRanksBrowser from '../components/OfficerRanksBrowser';

export const metadata: Metadata = {
  title: 'Officer Ranks (Army · AF · Navy) - ISSB Prep',
  description:
    'Unified Pakistan Army, Air Force and Navy officer rank equivalents in one hierarchy table, plus next-rank recall practice.',
};

export default function UnifiedRanksPage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Preparation area</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">Officer ranks</h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
          One merged hierarchy for commissioned officers only — Army, Air Force and Navy side by side — then quiz
          yourself on what comes next.
        </p>
        <div className="prep-page mt-8 !p-0 text-left">
          <OfficerRanksBrowser />
        </div>
        <p className="mt-8 text-sm font-semibold text-slate-600">
          Service shortcuts (same officer table):{' '}
          <Link className="text-blue-800 underline" href="/ranks/army">
            Army
          </Link>
          {' · '}
          <Link className="text-blue-800 underline" href="/ranks/airforce">
            Air Force
          </Link>
          {' · '}
          <Link className="text-blue-800 underline" href="/ranks/navy">
            Navy
          </Link>
        </p>
      </div>
    </div>
  );
}
