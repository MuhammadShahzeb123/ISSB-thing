import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeDisclaimer from '../components/PracticeDisclaimer';
import CurrentAffairsBrowser from '../components/CurrentAffairsBrowser';
import { affairsAsOf, affairsStories, formatAffairsDate } from '../lib/affairsStories';
import { regionPrimer } from '../lib/currentAffairs';

export const metadata: Metadata = {
  title: 'Current Affairs - ISSB Prep',
  description:
    'Current affairs told as simple, sourced stories with audio: Pakistan politics, economy and security, India, Afghanistan, Iran, the Gulf, China, the US and world affairs.',
};

export default function CurrentAffairsPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">Current affairs</p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">Pakistan &amp; the world</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
          {affairsStories.length} stories in simple English, each with audio and its sources. Researched up to{' '}
          {formatAffairsDate(affairsAsOf)}. {regionPrimer.length} country primers are at the bottom.
        </p>

        <p className="mt-4">
          <Link href="/deputy-president-interview">Practise these with a live deputy president →</Link>
        </p>

        <div className="prep-page mt-8 !p-0 text-left">
          <CurrentAffairsBrowser showPrimers />
        </div>

        <div className="mt-8 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
