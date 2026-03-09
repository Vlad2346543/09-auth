'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import css from './NotesPage.module.css';
import { fetchNotes } from '@/lib/api/clientApi';
import { useState } from 'react';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import { NoteTag } from '@/types/note';
import Link from 'next/link';

interface NotesClientProps {
  tag?: NoteTag;
}
const NotesClient = ({ tag }: NotesClientProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  const handleSearch = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
    setCurrentPage(1);
  }, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', debouncedQuery, currentPage, tag],
    queryFn: () =>
      fetchNotes({
        search: debouncedQuery,
        page: currentPage,
        perPage: 12,
        tag,
      }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const notes = data?.notes ?? [];
  const totalPages = data ? Math.ceil(data.total / data.perPage) : 0;

  if (isLoading && !data) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      {notes.length > 0 ? (
        <>
          <NoteList notes={notes} />

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              page={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      ) : (
        <p>No notes found</p>
      )}
    </div>
  );
};

export default NotesClient;