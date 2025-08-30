'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes, type NoteResponse } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './Notes.module.css';
import Pagination from '@/components/Pagination/Pagination';
import Link from 'next/link';

interface NotesClientProps {
  initialData: NoteResponse;
  initialPage?: number;
  perPage?: number;
  initialSearch?: string;
  tag?: string | undefined;
}

export default function NotesClient({
  initialData,
  initialPage = 1,
  perPage = 12,
  initialSearch = '',
  tag,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, isError } = useQuery<NoteResponse, Error>({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch, tag),
    initialData,
    placeholderData: initialData,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong</p>;
  if (!data) return <p>No notes found.</p>;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create +
        </Link>
      </header>

      {data?.notes?.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        <p>You don’t have any notes here</p>
      )}
    </div>
  );
}
