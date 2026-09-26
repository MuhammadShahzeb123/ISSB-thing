import type { Metadata } from 'next';
import LibraryHub from '../components/library/LibraryHub';
import '../library.css';

export const metadata: Metadata = {
  title: 'Practice library - ISSB Prep',
  description: 'Every test and study note from the ISSB study photos, sorted into timed practice and revision sets with instant feedback.',
};

export default function LibraryPage() {
  return <LibraryHub />;
}
