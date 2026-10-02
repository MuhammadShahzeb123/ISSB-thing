import type { Metadata } from 'next';
import Link from 'next/link';
import OfficerRanksBrowser from '@/app/components/OfficerRanksBrowser';

export const metadata: Metadata = {
  title: 'Pakistan Air Force officer ranks - ISSB Prep',
  description:
    'Officer-only ranks with Army / Air Force / Navy equivalents in one hierarchy table, plus next-rank recall.',
};

export default function AirForceRanksPage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Officer ranks only</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Pakistan Air Force officer ranks</h1>
        <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-slate-700">
          Non-officer ranks removed. Read the full inter-services table, then practise next-rank recall. Prefer the
          unified hub at <Link className="text-blue-800 underline" href="/ranks">/ranks</Link>.
        </p>
        <div className="prep-page mt-8 !p-0 text-left">
          <OfficerRanksBrowser />
        </div>
      </div>
    </div>
  );
}
