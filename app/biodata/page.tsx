import type { Metadata } from 'next';
import BiodataFormPreview from './BiodataFormPreview';

export const metadata: Metadata = {
  title: 'Bio data - ISSB Prep',
  description: 'A readable preview of the ISSB personal information questionnaire for civilian candidates, plus the events list from item 15. Nothing is submitted to ISSB.',
};

export default function BiodataPage() {
  return <BiodataFormPreview />;
}
