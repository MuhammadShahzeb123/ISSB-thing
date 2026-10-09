import type { Metadata } from "next";
import EssayPractice from "@/app/components/psychological-tests/EssayPractice";

export const metadata: Metadata = {
  title: "Essay Writing Practice - ISSB Prep",
  description:
    "Learn to write an essay with a 16-lesson audio course, then plan and write a 30 minute ISSB-style essay with a live word counter and AI marking against a proven essay method.",
};

export default function EssayPage() {
  return <EssayPractice />;
}
