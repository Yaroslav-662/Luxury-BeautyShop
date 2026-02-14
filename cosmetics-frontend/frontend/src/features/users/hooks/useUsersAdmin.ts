// src/features/users/hooks/useUsersAdmin.ts

import { create } from "zustand";
import { UsersApi } from "../api/users.api";
import type { User, UsersQuery, UserRole } from "../model/user.types";

interface UsersAdminState {
  users: User[];
  selected: User | null;
  loading: boolean;
  error: string | null;

  fetchUsers: (query?: UsersQuery) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  changeRole: (id: string, role: UserRole) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsersAdmin = create<UsersAdminState>((set, get) => ({
  users: [],
  selected: null,
  loading: false,
  error: null,

  fetchUsers: async (query) => {
    set({ loading: true, error: null });
    try {
      const users = await UsersApi.getUsers(query);
      set({ users, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося завантажити користувачів",
        loading: false,
      });
    }
  },

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const selected = await UsersApi.getUser(id);
      set({ selected, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Користувача не знайдено",
        loading: false,
      });
    }
  },

  changeRole: async (id, role) => {
    try {
      const updated = await UsersApi.updateUserRole(id, role);
      set({
        users: get().users.map((u) => (u._id === id ? updated : u)),
        selected: get().selected?._id === id ? updated : get().selected,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося змінити роль",
      });
    }
  },

  deleteUser: async (id) => {
    try {
      await UsersApi.deleteUser(id);
      set({
        users: get().users.filter((u) => u._id !== id),
        selected: get().selected?._id === id ? null : get().selected,
      });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося видалити користувача",
      });
    }
  },
}));
