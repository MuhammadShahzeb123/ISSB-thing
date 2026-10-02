import DimensionOverview from "@/app/components/DimensionOverview";
import MethodologyNote from "@/app/components/psychological-tests/MethodologyNote";
import PsychAudioHeader from "@/app/components/psychological-tests/PsychAudioHeader";

export default function PsychologicalOverviewPage() {
  return (
    <DimensionOverview
      dimension="psychological"
      title="Psychological tests"
      summary="Word association, picture stories, sentence completion, self-reflection and mechanical aptitude. Timed sessions use fixed deadlines and save drafts automatically."
    >
      <div className="mt-6 max-w-3xl">
        <PsychAudioHeader
          narrationId="overview"
          kicker="Listen first"
          title="How these practice tests work"
          summary="Tap Play for a short spoken overview of this dimension before you open a simulator."
        />
        <MethodologyNote>
          Official format facts shown inside each simulator are limited to
          details published on the ISSB Selection System page. App-specific
          prompt counts, content, timing choices, and interactions are
          explicitly labeled as practice methodology.
        </MethodologyNote>
      </div>

      <section className="prep-panel mt-8" aria-labelledby="psych-hssc">
        <h2 id="psych-hssc">HSSC / ISSB exam facts (keep it this short)</h2>
        <div className="gk-tile-grid mt-4">
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">What psych tests are for</strong>
            <span className="gk-tile-teaser">They sample how you think and write under time — not a school marks exam. No “correct story” to memorise.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Main indoor set</strong>
            <span className="gk-tile-teaser">Word Association (WAT), Picture Story Writing, Sentence Completion, and related self-description tasks. Use each simulator’s published timing note.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Safe answer habit</strong>
            <span className="gk-tile-teaser">Be positive, practical, and honest. Use clear Urdu or English. Do not invent heroic fantasies or copy a template story.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Beyond exam depth</strong>
            <span className="gk-tile-teaser">Skip psychologist jargon and scoring theories. ISSB does not publish a public marking key for these practice apps.</span>
          </article>
        </div>
      </section>
    </DimensionOverview>
  );
}
