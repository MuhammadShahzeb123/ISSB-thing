import DimensionOverview from "@/app/components/DimensionOverview";
import MethodologyNote from "@/app/components/psychological-tests/MethodologyNote";

export default function PsychologicalOverviewPage() {
  return (
    <DimensionOverview
      dimension="psychological"
      title="Psychological tests"
      summary="Word association, picture stories, sentence completion, self-reflection and mechanical aptitude. Timed sessions use fixed deadlines and save drafts automatically."
    >
      <div className="mt-8 max-w-3xl">
        <MethodologyNote>
          Official format facts shown inside each simulator are limited to
          details published on the ISSB Selection System page. App-specific
          prompt counts, content, timing choices, and interactions are
          explicitly labeled as practice methodology.
        </MethodologyNote>
      </div>
    </DimensionOverview>
  );
}
