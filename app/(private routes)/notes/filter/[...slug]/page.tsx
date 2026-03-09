import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import type { Metadata } from 'next';
import { NoteTag } from '@/types/note';

interface Props {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const tag = slug?.[0] ?? 'all';
  return {
    title: `Notes: ${tag} | NoteHub`,
    description: `Filtered notes by ${tag}`,
  
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const selectedTag = slug?.[0] ?? 'all';
  const tagForApi = selectedTag !== 'all' ? selectedTag : undefined;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 1, tagForApi],
    queryFn: () =>
      fetchNotes({
        search: '',
        page: 1,
        perPage: 12,
        tag: tagForApi,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tagForApi as NoteTag} />
    </HydrationBoundary>
  );
}