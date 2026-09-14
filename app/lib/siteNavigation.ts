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
        href: "/?practice=wat",
        description: "Timed WAT practice using the existing word bank.",
      },
      {
        label: "Picture stories",
        href: "/picturestest",
        description: "Use the existing picture-based story practice.",
      },
    ],
  },
  {
    slug: "gto",
    label: "GTO",
    href: "/gto",
    classification: "core-assessor-dimension",
    summary: "Prepare for group planning, discussion, command, and outdoor leadership tasks.",
    resources: [],
  },
  {
    slug: "deputy-president-interview",
    label: "Deputy President Interview",
    href: "/deputy-president-interview",
    classification: "core-assessor-dimension",
    summary: "Organise your personal record, motivations, awareness, and interview responses.",
    resources: [],
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
        description: "Review the existing general-knowledge study deck.",
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
