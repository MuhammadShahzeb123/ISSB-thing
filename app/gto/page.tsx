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
      ]}
    />
  );
}
