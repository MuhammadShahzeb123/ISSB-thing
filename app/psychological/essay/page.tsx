import type { Metadata } from "next";
import EssayPractice from "@/app/components/psychological-tests/EssayPractice";

export const metadata: Metadata = {
  title: "Essay Writing Practice - ISSB Prep",
  description:
    "Plan and write a 30 minute ISSB-style essay with a step-by-step guide, a live word counter and AI marking against a proven essay method.",
};

export default function EssayPage() {
  return <EssayPractice />;
}
