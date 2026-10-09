import BookTest from "./BookTest";
import ExtraPractice from "./ExtraPractice";

export default function MechanicalAptitudePage() {
  return (
    <main className="neo-page min-h-screen">
      <BookTest />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t-4 border-dashed border-slate-950" />
      </div>
      <ExtraPractice />
    </main>
  );
}
