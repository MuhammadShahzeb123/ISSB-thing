import type { Metadata } from 'next';
import { Suspense } from 'react';
import OutdoorObstacles from './OutdoorObstacles';

export const metadata: Metadata = {
  title: 'GTO Outdoor Obstacles - ISSB Prep',
  description: 'Animated, step-by-step technique for the nine GTO individual obstacles.',
};

export default function OutdoorObstaclesPage() {
  return <Suspense fallback={null}><OutdoorObstacles /></Suspense>;
}
