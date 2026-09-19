import DimensionOverview from '../components/DimensionOverview';

export default function DeputyPresidentInterviewOverviewPage() {
  return (
    <DimensionOverview
      dimension="deputy-president-interview"
      title="Deputy President Interview"
      summary="Know your own record, answer quick calculations and explain what is happening in Pakistan and the world. Honest, direct answers matter more than memorised ones."
      resources={[
        { label: 'Biodata practice', href: '/biodata', description: 'Privately organise and review your personal record in this browser.' },
        { label: 'Interview preparation room', href: '/interview', description: 'All interview practice tabs in one place.' },
      ]}
    />
  );
}
