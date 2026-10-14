import type { Metadata } from 'next';
import Link from 'next/link';
import QuickMaths from './QuickMaths';

export const metadata: Metadata = {
  title: 'Quick maths drill - Deputy President Interview - ISSB Prep',
  description: 'Rapid-fire mental maths like the deputy president asks: percentages, ages, speed, ratios, interest and more, against the clock.',
};

export default function QuickMathsPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
          <Link href="/deputy-president-interview" className="underline">Deputy President Interview</Link> · Quick maths
        </p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">Quick maths drill</h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">
          The deputy president may fire a quick sum at you mid conversation: a dozen eggs, a discount, a father&apos;s age. Answer in your head, type the number, press Enter.
        </p>
        <QuickMaths />
      </div>
    </div>
  );
}
