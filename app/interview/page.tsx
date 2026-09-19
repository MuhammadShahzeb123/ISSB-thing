import type { Metadata } from 'next';
import { Suspense } from 'react';
import InterviewPractice from './InterviewPractice';

export const metadata: Metadata = {
  title: 'Deputy President Interview Practice - ISSB Prep',
  description: 'Introduction practice, mental maths, current affairs, gallantry stories and general knowledge for the interview.',
};

export default function InterviewPage() {
  return <Suspense fallback={null}><InterviewPractice /></Suspense>;
}
