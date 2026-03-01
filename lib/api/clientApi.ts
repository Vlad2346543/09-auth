import { api } from "../../app/api/api";
import { User } from "@/types/user";

export const register = async (data: { email: string; password: string }) => {
  const res = await api.post<User>("/auth/register", data);
  return res.data;
};

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const checkSession = async () => {
  const res = await api.get<User | null>("/auth/session");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get<User>("/users/me");
  return res.data;
};

export const updateMe = async (data: { username: string }) => {
  const res = await api.patch<User>("/users/me", data);
  return res.data;
};