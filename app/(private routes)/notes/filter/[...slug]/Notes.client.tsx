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
import Link from 'next/link';

interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
}

interface NotesClientProps {
  initialData?: FetchNotesResponse;
  tag?: NoteTag;
}

const NotesClient = ({ initialData, tag }: NotesClientProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');

  const { data, isLoading, error } = useQuery<FetchNotesResponse>({
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

  const notes = data?.notes ?? [];
  const totalPages = data ? Math.ceil(data.total / data.perPage) : 0;

  const handleSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, 300);

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            page={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <NoteList notes={notes} />
    </div>
  );
};

export default NotesClient;