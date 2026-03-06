import { api } from './api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { User } from '@/types/user';
import { Note } from '@/types/note';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const checkSession = async () => {
  try {
    const headers = await getAuthHeaders();
    return await api.get('/auth/session', { headers });
  } catch {
    return null;
  }
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const headers = await getAuthHeaders();
    const { data } = await api.get<User>('/users/me', { headers });
    return data;
  } catch {
    return null;
  }
};

export const fetchNotesServer = async (
  searchText: string = '',
  page: number = 1,
  tag?: string
) => {
  try {
    const headers = await getAuthHeaders();

    const params: Record<string, string | number | undefined> = {
      search: searchText,
      page,
      perPage: 12,
    };

    if (tag && tag.toLowerCase() !== 'all') {
      params.tag = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
    }

    const { data } = await api.get('/notes', {
      params,
      headers,
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.log('Server API Error:', error.response?.data);
    }
    return null;
  }
};

export const fetchNoteByIdServer = async (id: string): Promise<Note | null> => {
  try {
    const headers = await getAuthHeaders();
    const { data } = await api.get<Note>(`/notes/${id}`, { headers });
    return data;
  } catch {
    return null;
  }
};
