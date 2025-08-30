'use client';

import type { Note, NewNoteData } from '@/types/note';
import { User } from '@/types/user';
import { api } from './api';

export interface NoteResponse {
  notes: Note[];
  page?: number;
  perPage?: number;
  totalPages: number;
}

const cache: Record<string, NoteResponse> = {};

export type AuthRequestData = {
  username: string;
  email: string;
};

type CheckSessionRequest = {
  success: boolean;
};

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = '',
  category?: string
): Promise<NoteResponse> {
  const params: FetchNotesParams = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (category && category.toLowerCase() !== 'all') params.tag = category;

  const cacheKey = JSON.stringify(params);
  if (cache[cacheKey]) return cache[cacheKey];

  const data = await api
    .get<NoteResponse>('/notes', { params })
    .then(res => res.data);
  cache[cacheKey] = data;
  return data;
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
