import { api } from "./api";
import { User } from "@/types/user";
import { NewNote, Note } from "@/types/note";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username: string;
}

export interface FetchNotesParams {
  search: string;
  page: number;
  perPage: number;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  page: number;
  perPage: number;
  total: number;
}

export const register = async (userData: RegisterRequest): Promise<User> => {
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

export const checkSession = async (): Promise<User> => {
  const { data } = await api.get<User>("/auth/session");
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const updateMe = async (
  userData: UpdateUserRequest
): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", userData);
  return data;
};

export const fetchNotes = async (
  params: FetchNotesParams
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: NewNote): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note);
  return data;
};