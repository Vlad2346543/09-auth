import { cookies } from 'next/headers';
import { api } from './api';
import { User } from '@/types/user';


export const fetchNotes = async (p0: { page: number; perPage: number; tag: string | undefined; }) => {
  const cookieStore = cookies();

  const res = await api.get('/notes', {
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