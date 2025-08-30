'use client';

import type { Note, NewNoteData } from '@/types/note';
import { User } from '@/types/user';
import { api } from './api';

interface NoteResponse {
  notes: Note[];
  page?: number;
  perPage?: number;
  totalPages: number;
}

export type AuthRequestData = {
  username: string;
  email: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export async function fetchNotes(
  query: string,
  page: number,
  perPage = 12,
  tag?: string
): Promise<NoteResponse> {
  const options = {
    params: {
      ...(query.trim() !== '' && { search: query }),
      page,
      perPage,
      tag,
    },
  };
  const response = await api.get<NoteResponse>('/notes', options);
  return response.data;
}

export async function createNote(noteData: NewNoteData): Promise<Note> {
  const response = await api.post<Note>('/notes', noteData);
  return response.data;
}

export async function deleteNote(noteId: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${noteId}`);
  return response.data;
}

export const fetchNoteById = async (id: string) => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};

export async function register(payload: AuthRequestData) {
  const res = await api.post<User>('/auth/register', payload);
  return res.data;
}

export async function login(payload: AuthRequestData) {
  const res = await api.post<User>('/auth/login', payload);
  return res.data;
}

export const checkSession = async () => {
  const res = await api.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export async function updateMe(data: Partial<User>) {
  const response = await api.patch<User>('/users/me', data);
  return response.data;
}
