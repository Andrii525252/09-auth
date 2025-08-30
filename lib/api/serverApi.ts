import type { Note } from '@/types/note';
import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  perPage: number = 12,
  search: string = '',
  tag?: string
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      ...(tag && tag.toLowerCase() !== 'all' ? { tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNoteByIdServer = async (id: string) => {
  const cookieStore = cookies();
  const options = {
    headers: { Cookie: cookieStore.toString() },
  };
  const res = await api.get<Note>(`/notes/${id}`, options);
  return res.data;
};

export const checkServerSession = async () => {
  const cookieStore = cookies();
  const res = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const cookieStore = cookies();
    const res = await api.get<User>('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch (error) {
    console.error('Failed to fetch user on server:', error);
    return null;
  }
};
