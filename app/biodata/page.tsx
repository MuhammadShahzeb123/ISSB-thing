import type { Metadata } from "next";
import BiodataPractice from "./BiodataPractice";

export const metadata: Metadata = {
  title: "Biodata Practice Organizer | ISSB Preparation",
  description:
    "An unofficial, privacy-conscious organizer for practising broad biodata and self-reflection themes.",
};

export default function BiodataPage() {
  return <BiodataPractice />;
}
