import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SetRunner from '../../../components/library/SetRunner';
import { getAllCardsSet, getCollection, getSet, getSets, itemsLabel, librarySets, modeLabels } from '../../../lib/library';
import '../../../library.css';

export const dynamicParams = false;

export function generateStaticParams() {
  const params = librarySets.map((set) => ({ collection: set.collection, set: set.id }));
  const withAll = [...new Set(librarySets.map((set) => set.collection))].filter((slug) => getAllCardsSet(slug)).map((slug) => ({ collection: slug, set: 'all' }));
  return [...params, ...withAll];
}

type Params = Promise<{ collection: string; set: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { collection, set: id } = await params;
  const set = getSet(collection, id);
  return { title: set ? `${set.title} - ${getCollection(collection)?.short ?? 'Practice'}` : 'Practice library' };
}

export default async function SetPage({ params }: { params: Params }) {
  const { collection: slug, set: id } = await params;
  const collection = getCollection(slug);
  const set = getSet(slug, id);
  if (!collection || !set) notFound();
  const siblings = getSets(collection.slug);
  const position = siblings.findIndex((item) => item.id === set.id);
  const link = (index: number) => (index >= 0 && index < siblings.length ? { href: `/library/${collection.slug}/${siblings[index].id}`, title: siblings[index].title } : undefined);
  return (
    <SetRunner
      set={set}
      collection={collection}
      modeLabel={modeLabels[set.mode]}
      itemsLabel={itemsLabel(set)}
      next={position === -1 ? undefined : link(position + 1)}
      previous={position === -1 ? undefined : link(position - 1)}
    />
  );
}
