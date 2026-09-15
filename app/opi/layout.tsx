import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work-Behavior Self-Reflection Practice',
  description:
    'An unvalidated, local-only work-behavior self-reflection practice with transparent methodology.',
};

export default function OpiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
