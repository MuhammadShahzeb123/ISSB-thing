import DimensionOverview from '../components/DimensionOverview';

export default function DeputyPresidentInterviewOverviewPage() {
  return (
    <DimensionOverview
      dimension="deputy-president-interview"
      title="Deputy President Interview"
      summary="Know your own record, answer quick calculations and explain what is happening in Pakistan and the world. Honest, direct answers matter more than memorised ones."
      resources={[
        { label: 'Bio data', href: '/biodata', description: 'See every question on the civilian personal information form, plus the 24 events from item 15. A local draft only — nothing is sent to ISSB.' },
        { label: 'Interview preparation room', href: '/interview', description: 'All interview practice tabs in one place.' },
        { label: 'Nishan-e-Haider martyrs', href: '/nishan-e-haider', description: 'Photo cards and compact stories for all eleven recipients.' },
        { label: 'World affairs cards', href: '/current-affairs', description: 'Short card + popup briefings (India–Pakistan, defence pact, Middle East).' },
        { label: 'General Knowledge cards', href: '/general-knowledge', description: 'HSSC-level Pakistan geography, dams, CPEC, IWT, PAF.' },
      ]}
    >
      <section className="prep-panel mt-8" aria-labelledby="dpi-hssc">
        <h2 id="dpi-hssc">HSSC / interview facts (keep answers this short)</h2>
        <div className="gk-tile-grid mt-4">
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Know yourself</strong>
            <span className="gk-tile-teaser">Family, education, sports, hobbies, strengths/weaknesses — honest biodata beats memorised speeches.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Pakistan map facts</strong>
            <span className="gk-tile-teaser">Four provinces + capitals, neighbours, Indus rivers, Tarbela = largest dam, Khyber Pass, CPEC / Gwadar.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Current affairs habit</strong>
            <span className="gk-tile-teaser">Name the issue, one fact, why Pakistan cares, one calm recommendation. Say “I do not know” when you do not.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Beyond exam depth</strong>
            <span className="gk-tile-teaser">Skip conspiracy theories, unverified casualty tallies, and invented treaty clauses.</span>
          </article>
        </div>
      </section>
    </DimensionOverview>
  );
}
