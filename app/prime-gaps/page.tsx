import type { Metadata } from 'next';
import Link from 'next/link';
import PrimeGapsChart from './PrimeGapsChart';

export const metadata: Metadata = {
  title: 'Prime gaps — ISSB Prep',
  description:
    'Interactive scatter of the first 100,000 primes: Y is the prime, X is the gap to the next prime. Data from Chris K. Caldwell, The PrimePages.',
};

export default function PrimeGapsPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Extra study tool</p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-5xl">First 100,000 primes — gap scatter</h1>
        <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-700">
          Each point is one prime. <strong>Y</strong> = the prime itself. <strong>X</strong> = gap to the next prime
          (p<sub>n+1</sub> − p<sub>n</sub>). Larger gaps sit farther right. Zoom and pan to look for patterns.
        </p>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-600">
          Data: first 100,000 primes from{' '}
          <a
            className="underline decoration-2 underline-offset-2 text-blue-900"
            href="https://primes.utm.edu/lists/small/100000.txt"
            target="_blank"
            rel="noreferrer"
          >
            Chris K. Caldwell, The PrimePages — The First 100,008 Primes
          </a>{' '}
          (also{' '}
          <a
            className="underline decoration-2 underline-offset-2 text-blue-900"
            href="https://t5k.org/lists/small/100000.txt"
            target="_blank"
            rel="noreferrer"
          >
            t5k.org
          </a>
          ). Primes were downloaded from that published list — not generated here. First = 2, last = 1,299,709.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/general-knowledge" className="home-dimension-link">
            ← General knowledge
          </Link>
        </div>

        <div className="mt-8">
          <PrimeGapsChart />
        </div>
      </div>
    </div>
  );
}
