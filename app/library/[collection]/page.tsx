import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CollectionView, { type SetSummary } from '../../components/library/CollectionView';
import { collections, getAllCardsSet, getCollection, getSets, itemsLabel, modeLabels, type LibrarySet } from '../../lib/library';
import '../../library.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((collection) => ({ collection: collection.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const collection = getCollection((await params).collection);
  return { title: collection ? `${collection.title} - Practice library` : 'Practice library' };
}

function summarise(set: LibrarySet, featured = false): SetSummary {
  return { id: set.id, title: set.title, subtitle: set.subtitle, mode: set.mode, modeLabel: modeLabels[set.mode], itemsLabel: itemsLabel(set), count: set.items.length, language: set.language, featured };
}

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const collection = getCollection((await params).collection);
  if (!collection) notFound();
  const all = getAllCardsSet(collection.slug);
  const sets = [...(all ? [summarise(all, true)] : []), ...getSets(collection.slug).map((set) => summarise(set))];
  return <CollectionView collection={collection} sets={sets} />;
}
