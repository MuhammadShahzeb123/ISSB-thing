import DimensionOverview from '../components/DimensionOverview';

export default function GtoOverviewPage() {
  return (
    <DimensionOverview
      dimension="gto"
      title="Group Testing Officer"
      summary="Indoor planning, discussion and lecture tasks, plus the outdoor individual obstacles. Outdoor tasks now live here instead of in a separate physical section."
      resources={[
        { label: 'Outdoor obstacles', href: '/gto/outdoor', description: 'Animated, step-by-step technique for all nine individual obstacles.' },
        { label: 'Indoor practice room', href: '/gto/indoor', description: 'Lecture topics, discussion motions and planning problems in one place.' },
        { label: 'ISSB group planning', href: '/gto/indoor?tab=planning', description: 'Ten sketch-map tasks. Each briefing includes a 15 minute limit. The worked plan stays hidden until you open it.' },
      ]}
    >
      <section className="prep-panel mt-8" aria-labelledby="gto-hssc">
        <h2 id="gto-hssc">HSSC / ISSB exam facts (keep it this short)</h2>
        <div className="gk-tile-grid mt-4">
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Indoor GTO set</strong>
            <span className="gk-tile-teaser">Group Discussion, Lecturette, and Group Planning / Progressive Group Tasks. Speak clearly; give reasons and one real example.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Outdoor set</strong>
            <span className="gk-tile-teaser">Individual Obstacles (commonly nine), Command Task, and group outdoor tasks. Technique and safety matter more than showing off.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">What assessors watch</strong>
            <span className="gk-tile-teaser">Leadership, teamwork, initiative, and calm planning — not the loudest voice. Invite quieter members in; disagree with ideas, not people.</span>
          </article>
          <article className="gk-tile gk-tile--qa" style={{ cursor: 'default' }}>
            <strong className="gk-tile-title">Beyond exam depth</strong>
            <span className="gk-tile-teaser">Do not invent secret marking schemes or obstacle heights as official ISSB law. Use the site’s labelled practice notes only.</span>
          </article>
        </div>
      </section>
    </DimensionOverview>
  );
}
