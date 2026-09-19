import type { Metadata } from 'next';
import { Suspense } from 'react';
import IndoorGto from './IndoorGto';

export const metadata: Metadata = {
  title: 'GTO Indoor Practice - ISSB Prep',
  description: 'Lecture, group discussion and group planning practice for the GTO dimension.',
};

export default function IndoorGtoPage() {
  return <Suspense fallback={null}><IndoorGto /></Suspense>;
}
