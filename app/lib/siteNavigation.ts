export type PreparationAreaSlug =
  | "physical"
  | "psychological"
  | "gto"
  | "deputy-president-interview"
  | "general-knowledge";

export type PreparationResource = {
  label: string;
  href: string;
  description: string;
};

export type PreparationArea = {
  slug: PreparationAreaSlug;
  label: string;
  href: `/${PreparationAreaSlug}`;
  classification: "core-assessor-dimension" | "preparation-area";
  summary: string;
  resources: readonly PreparationResource[];
};

export const siteNavigation = [
  {
    slug: "physical",
    label: "Physical",
    href: "/physical",
    classification: "preparation-area",
    summary: "Build sustainable fitness, recovery, and readiness habits for selection activities.",
    resources: [],
  },
  {
    slug: "psychological",
    label: "Psychological",
    href: "/psychological",
    classification: "core-assessor-dimension",
    summary: "Practise clear, authentic responses across the psychological assessment formats.",
    resources: [
      {
        label: "Word Association Test",
        href: "/psychological/wat",
        description: "Timed WAT practice with the legacy bank plus photo-transcribed words.",
      },
      {
        label: "Story Writing",
        href: "/psychological/story-writing",
        description: "Practise picture association and opening-sentence stories.",
      },
      {
        label: "Sentence Completion",
        href: "/psychological/sentence-completion",
        description: "Timed completions from the photo-transcribed sets and the original practice bank.",
      },
      {
        label: "OPI self-reflection",
        href: "/opi",
        description: "Use the local-only, non-diagnostic work-behaviour reflection module.",
      },
      {
        label: "Mechanical Aptitude",
        href: "/mechanical-aptitude",
        description: "Practise original mechanical-reasoning questions and diagrams.",
      },
    ],
  },
  {
    slug: "gto",
    label: "GTO",
    href: "/gto",
    classification: "core-assessor-dimension",
    summary: "Prepare for group planning, discussion, command, and outdoor leadership tasks.",
    resources: [
      {
        label: "Indoor GTO practice",
        href: "/gto",
        description: "Lecture topics, group discussion motions, and planning exercises from the study photos.",
      },
    ],
  },
  {
    slug: "deputy-president-interview",
    label: "Deputy President Interview",
    href: "/deputy-president-interview",
    classification: "core-assessor-dimension",
    summary: "Organise your personal record, motivations, awareness, and interview responses.",
    resources: [
      {
        label: "Interview preparation",
        href: "/interview",
        description: "Introduction practice, quick mental maths, sourced current affairs, and gallantry stories.",
      },
      {
        label: "Biodata practice",
        href: "/biodata",
        description: "Privately organise and review your personal record in this browser.",
      },
    ],
  },
  {
    slug: "general-knowledge",
    label: "General Knowledge",
    href: "/general-knowledge",
    classification: "preparation-area",
    summary: "Review Pakistan, world, service, geography, leadership, and current-affairs knowledge.",
    resources: [
      {
        label: "Countries",
        href: "/countries",
        description: "Explore countries and capitals on the existing map.",
      },
      {
        label: "Study",
        href: "/study",
        description: "Spaced-repetition deck including photo-transcribed knowledge cards.",
      },
      {
        label: "Source coverage",
        href: "/sources",
        description: "A text-only index of every supplied study photo and its extracted items.",
      },
      {
        label: "Quiz",
        href: "/quiz",
        description: "Test country and capital recall.",
      },
      {
        label: "Ministers",
        href: "/ministers",
        description: "Review Pakistan leadership and armed-forces appointments.",
      },
      {
        label: "Army ranks",
        href: "/ranks/army",
        description: "Open the existing Pakistan Army rank guide.",
      },
      {
        label: "Air Force ranks",
        href: "/ranks/airforce",
        description: "Open the existing Pakistan Air Force rank guide.",
      },
      {
        label: "Navy ranks",
        href: "/ranks/navy",
        description: "Open the existing Pakistan Navy rank guide.",
      },
    ],
  },
] as const satisfies readonly PreparationArea[];

export function getPreparationArea(slug: PreparationAreaSlug): PreparationArea {
  const area = siteNavigation.find((item) => item.slug === slug);
  if (!area) {
    throw new Error(`Unknown preparation area: ${slug}`);
  }
  return area;
}
