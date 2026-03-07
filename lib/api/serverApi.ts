import { cookies } from "next/headers";
import { api } from "./api"; 
import { Note } from "@/types/note";
import { User } from "@/types/user";
import axios from "axios";

export const getServerHeaders = async () => {
  const cookieStore = await cookies();
  return { Cookie: cookieStore.toString() };
};

export const fetchNotes = async (params?: {
  search?: string;
  page?: number;
  perPage?: number;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {

  const headers = await getServerHeaders();
  
  const res = await api.get("/notes", {
    params,
    headers,
  });

  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const headers = await getServerHeaders();
  
  const res = await api.get(`/notes/${id}`, {
    headers,
  });

  return res.data;
};


export const getServerMe = async (): Promise<User | null> => {
  try {
    const headers = await getServerHeaders(); 
    const res = await api.get("/users/me", { headers });
    return res.data;
  } catch (error) {
    return null; 
  }
};
export const checkSession = async () => {
  const headers = await getServerHeaders();
  
  const res = await api.get("/auth/session", {
    headers,
  });

  return res;
};