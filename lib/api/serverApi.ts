import { cookies } from 'next/headers';
import { api } from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';

export const fetchNotes = async (
  params?: {
    search?: string;
    page?: number;
    perPage?: number;
    tag?: string;
  }
): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = cookies();

  const res = await api.get<{ notes: Note[]; totalPages: number }>('/notes', {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = cookies();

  const res = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};

export const getMe = async () => {
  const cookieStore = cookies();

  const res = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};


export const checkSession = async () => {
  const cookieStore = cookies();

  const res = await api.get<User | null>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};