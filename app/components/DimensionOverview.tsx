import Link from 'next/link';
import type { ReactNode } from 'react';
import { dimensionLabels, practiceModules, type CoreDimension } from '../lib/practiceModules';
import DimensionProgress from './DimensionProgress';
import PracticeDisclaimer from './PracticeDisclaimer';

type Props = {
  dimension: CoreDimension;
  title: string;
  summary: string;
  /** Supporting material that is not itself a test, such as biodata. */
  resources?: readonly { label: string; href: string; description: string }[];
  children?: ReactNode;
};

export default function DimensionOverview({ dimension, title, summary, resources = [], children }: Props) {
  const modules = practiceModules.filter((item) => item.dimension === dimension);
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Core assessor dimension</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">{summary}</p>

        <section className="dimension-start" aria-labelledby="start-heading">
          <div className="min-w-0">
            <h2 id="start-heading" className="text-2xl font-black">Start a practice session</h2>
            <p className="mt-2 leading-7 text-slate-700">
              You get one of the {modules.length} {dimensionLabels[dimension]} tests at random, so you practise without knowing the task in advance. Tests you took recently are skipped first.
            </p>
            <DimensionProgress dimension={dimension} />
          </div>
          <div className="dimension-start-actions">
            <Link href={`/practice/start?d=${dimension}`} className="cta-button">Take random test</Link>
            <Link href={`/practice/revision?d=${dimension}`} className="cta-button cta-button--secondary">Revision mode: choose a test</Link>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="covered-heading">
          <h2 id="covered-heading" className="text-xl font-black">What the random draw covers</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {modules.map((item) => <li key={item.id} className="dimension-chip">{item.title}</li>)}
          </ul>
        </section>

        {resources.length > 0 && (
          <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Supporting material">
            {resources.map((resource) => (
              <Link key={resource.href} href={resource.href} className="border-2 border-slate-950 bg-white p-5 text-slate-950 shadow-[5px_5px_0_#171717] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
                <h2 className="text-xl font-black">{resource.label}</h2>
                <p className="mt-2 leading-7 text-slate-700">{resource.description}</p>
              </Link>
            ))}
          </section>
        )}

        {children}
        <div className="mt-10 max-w-3xl"><PracticeDisclaimer /></div>
      </div>
    </div>
  );
}
