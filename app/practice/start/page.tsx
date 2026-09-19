import type { Metadata } from 'next';
import { Suspense } from 'react';
import RandomStart from './RandomStart';

export const metadata: Metadata = {
  title: 'Random Test - ISSB Prep',
  description: 'Start a randomly selected ISSB practice test.',
};

export default function RandomStartPage() {
  return <Suspense fallback={null}><RandomStart /></Suspense>;
}
