'use client';

import { practiceModules, type CoreDimension } from '../lib/practiceModules';
import { usePracticeProgress } from '../lib/practiceProgress';

export default function DimensionProgress({ dimension }: { dimension: CoreDimension }) {
  const { progress } = usePracticeProgress();
  const modules = practiceModules.filter((item) => item.dimension === dimension);
  const attempted = modules.filter((item) => progress.modules[item.id]?.attempts).length;
  const reviewed = modules.filter((item) => progress.modules[item.id]?.reviewedAt).length;
  return (
    <dl className="dimension-progress">
      <div><dt>Tests</dt><dd>{modules.length}</dd></div>
      <div><dt>Attempted</dt><dd>{attempted}</dd></div>
      <div><dt>Reviewed</dt><dd>{reviewed}</dd></div>
    </dl>
  );
}
