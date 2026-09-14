import Link from "next/link";
import PracticeDisclaimer from "@/app/components/PracticeDisclaimer";
import MethodologyNote from "@/app/components/psychological-tests/MethodologyNote";

const tests = [
  {
    href: "/psychological/wat",
    title: "Word Association Test",
    label: "Legacy bank available",
    description:
      "Timed writing with the existing original practice word bank isolated behind a versioned content adapter.",
  },
  {
    href: "/psychological/story-writing",
    title: "Story Writing",
    label: "Four pictures + two sentences",
    description:
      "A fixed six-prompt simulation with observation and writing phases. Final picture assets are visibly pending.",
  },
  {
    href: "/psychological/sentence-completion",
    title: "Sentence Completion",
    label: "Practice prompts pending replacement",
    description:
      "Timed sentence completions using the current practice-only set until user-owned final prompts arrive.",
  },
  {
    href: "/opi",
    title: "OPI self-reflection",
    label: "Local-only and non-diagnostic",
    description:
      "Explore disclosed work-behaviour dimensions with a deterministic original practice bank.",
  },
  {
    href: "/mechanical-aptitude",
    title: "Mechanical Aptitude",
    label: "100 original practice questions",
    description:
      "Practise mechanical reasoning across eight categories with explanations and accessible diagrams.",
  },
] as const;

export default function PsychologicalOverviewPage() {
  return (
    <main className="neo-page px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">
            Core assessor dimension
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-6xl">
            Psychological writing practice
          </h1>
          <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
            Direct routes for writing practice, local-only self-reflection, and
            mechanical aptitude. Timed writing sessions use absolute deadlines,
            stable prompt IDs, autosaved drafts, and refresh-safe progress.
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tests.map((test) => (
            <Link
              className="flex border-2 border-slate-950 bg-white p-6 text-slate-950 shadow-[6px_6px_0_#171717] transition hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              href={test.href}
              key={test.href}
            >
              <div className="flex flex-1 flex-col">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-800">
                  {test.label}
                </p>
                <h2 className="mt-3 text-2xl font-black">{test.title}</h2>
                <p className="mt-3 flex-1 leading-7 text-slate-700">
                  {test.description}
                </p>
                <span className="mt-6 font-black uppercase tracking-wide text-blue-800">
                  Open simulation →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <MethodologyNote>
            Official format facts shown inside each simulator are limited to
            details published on the ISSB Selection System page. App-specific
            prompt counts, content, timing choices, and interactions are
            explicitly labeled as practice methodology.
          </MethodologyNote>
          <PracticeDisclaimer />
        </div>
      </div>
    </main>
  );
}
