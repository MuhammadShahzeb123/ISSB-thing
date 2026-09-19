import type { Metadata } from 'next';
import { Suspense } from 'react';
import RevisionMode from './RevisionMode';

export const metadata: Metadata = {
  title: 'Revision Mode - ISSB Prep',
  description: 'Pick specific ISSB practice tests to review and track what you have covered.',
};

export default function RevisionPage() {
  return <Suspense fallback={null}><RevisionMode /></Suspense>;
}
