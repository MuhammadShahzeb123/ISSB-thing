import {
  OFFICIAL_SELECTION_SYSTEM_URL,
} from "@/app/lib/psychological-tests/content";

type MethodologyNoteProps = {
  children: React.ReactNode;
};

export default function MethodologyNote({
  children,
}: MethodologyNoteProps) {
  return (
    <aside className="border-2 border-slate-950 bg-amber-100 p-5 text-sm font-semibold leading-6 text-slate-800">
      <p>{children}</p>
      <p className="mt-3">
        Source for format facts:{" "}
        <a
          className="font-black text-blue-800 underline decoration-2 underline-offset-4"
          href={OFFICIAL_SELECTION_SYSTEM_URL}
          rel="noreferrer"
          target="_blank"
        >
          ISSB Selection System
        </a>
        .
      </p>
      <p className="mt-3">
        Unofficial practice only. This tool does not diagnose personality,
        provide ideal answers, or predict selection.
      </p>
    </aside>
  );
}
