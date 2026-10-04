import type { Metadata } from 'next';
import PracticeDisclaimer from '../components/PracticeDisclaimer';
import MartyrGallery from '../components/MartyrGallery';

export const metadata: Metadata = {
  title: 'Nishan-e-Haider Martyrs - ISSB Prep',
  description:
    'Story cards for all eleven Nishan-e-Haider recipients: rank, unit, place, date, full spoken-style stories, and audio for interview preparation.',
};

export default function NishanEHaiderPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">Gallantry award</p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">Nishan-e-Haider</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
          Pakistan&apos;s highest military gallantry award. Eleven men are honoured at this level (ten Army, one Air
          Force). Each card opens into a full story. No key-point lists. Tap Play beside a name to listen, then tell
          the story in your own words.
        </p>

        <MartyrGallery />

        <section className="prep-panel mt-8" aria-labelledby="image-notes">
          <h2 id="image-notes">Image notes</h2>
          <p>
            All eleven cards use person portraits only. See <code>public/images/martyrs/ATTRIBUTION.json</code> for
            source pages and licence notes. Fair-use Wikipedia/ISPR likenesses are included for educational interview
            prep; do not reuse them commercially without checking the original licence.
          </p>
        </section>

        <div className="mt-8 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
