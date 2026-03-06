import { api } from "./api";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export const register = async (userData: LoginRequest): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", userData);
  return data;
};

export const login = async (credentials: LoginRequest): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>("/auth/session");
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
};

export const fetchNotes = async (params: {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
}) => {
  const res = await api.get('/notes', { params });
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
};