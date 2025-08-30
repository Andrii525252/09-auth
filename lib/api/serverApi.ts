import type { Note } from '@/types/note';
import { api } from './api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';

interface NoteResponse {
  notes: Note[];
  page?: number;
  perPage?: number;
  totalPages: number;
}

export async function fetchNotesServer(
  query: string,
  page: number,
  perPage = 12,
  tag?: string
): Promise<NoteResponse> {
  const cookieStore = cookies();
  const options = {
    params: {
      ...(query.trim() !== '' && { search: query }),
      page,
      perPage,
      tag,
    },
    headers: { Cookie: cookieStore.toString() },
  };
  const response = await api.get<NoteResponse>('/notes', options);

  return response.data;
}

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
