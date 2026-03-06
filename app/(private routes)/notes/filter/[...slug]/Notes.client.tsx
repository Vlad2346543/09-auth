'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api/clientApi';
import { useState } from 'react';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import { Note, NoteTag } from '@/types/note';
import { useRouter } from 'next/navigation';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  initialData?: FetchNotesResponse;
  tag?: NoteTag;
}

const NotesClient = ({ initialData, tag }: NotesClientProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const router = useRouter();

 const { data, isLoading, error } = useQuery({
  queryKey: ['notes', query, currentPage, tag],
  queryFn: () =>
    fetchNotes({
      search: query,
      page: currentPage,
      perPage: 12,
      tag,
    }),
  placeholderData: keepPreviousData,
  refetchOnMount: false,
  initialData,
});

  const notes = data?.notes;
  const totalPages = data?.totalPages;

  const handleSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleRedirect = () => {
    router.push('/notes/action/create');
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !notes) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />
        {totalPages && totalPages > 1 && <Pagination totalPages={totalPages} page={currentPage} onPageChange={setCurrentPage} />}
        <button className={css.button} onClick={handleRedirect}>
          Create note +
        </button>
      </header>
      {notes && !isLoading && <NoteList notes={notes} />}
    </div>
  );
};

export default NotesClient;
