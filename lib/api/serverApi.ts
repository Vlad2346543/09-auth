import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';



export const fetchNotes = async (): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = cookies();

  const res = await api.get<{ notes: Note[]; totalPages: number }>('/notes', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res.data;
};


export const fetchNoteById = async (id: string) => {
  const cookieStore = cookies();

  const res = await api.get(`/notes/${id}`, {
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