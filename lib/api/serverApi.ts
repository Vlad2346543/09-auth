import { cookies, headers } from 'next/headers';
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

export async function getServerMe(): Promise<User | null> {
  const cookieStore = cookies();
  const headersList = headers();

  const host = (await headersList).get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const cookieHeader = (await cookieStore)
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${protocol}://${host}/api/users/me`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export const checkSession = async () => {
  const cookieStore = cookies();

  const res = await api.get<User | null>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
};