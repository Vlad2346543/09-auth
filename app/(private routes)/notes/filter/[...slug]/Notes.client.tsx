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
  
    staleTime: 60 * 1000, 
  });

  const notes = data?.notes ?? [];
  const totalPages = data ? Math.ceil(data.total / data.perPage) : 0;

  const handleSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, 300);

  if (isLoading && !data) return <p>Loading, please wait...</p>;
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