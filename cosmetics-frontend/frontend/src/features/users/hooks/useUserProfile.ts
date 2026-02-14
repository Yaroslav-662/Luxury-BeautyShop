// src/features/users/hooks/useUserProfile.ts

import { create } from "zustand";
import { UsersApi } from "../api/users.api";
import type { User, ChangePasswordDto } from "../model/user.types";

interface UserProfileState {
  me: User | null;
  loading: boolean;
  error: string | null;
  success: string | null;

  fetchMe: () => Promise<void>;
  updateProfile: (payload: { name?: string; email?: string; file?: File | null }) => Promise<void>;
  changePassword: (dto: ChangePasswordDto) => Promise<void>;
  deactivate: () => Promise<void>;
  sendVerifyEmail: () => Promise<void>;
}

export const useUserProfile = create<UserProfileState>((set, get) => ({
  me: null,
  loading: false,
  error: null,
  success: null,

  fetchMe: async () => {
    set({ loading: true, error: null, success: null });
    try {
      const me = await UsersApi.getMe();
      set({ me, loading: false });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося завантажити профіль",
        loading: false,
      });
    }
  },

  updateProfile: async ({ name, email, file }) => {
    if (!get().me) return;
    set({ loading: true, error: null, success: null });

    const form = new FormData();
    if (name !== undefined) form.append("name", name);
    if (email !== undefined) form.append("email", email);
    if (file) form.append("file", file);

    try {
      const me = await UsersApi.updateMe(form);
      set({ me, loading: false, success: "Профіль оновлено" });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Помилка оновлення профілю",
        loading: false,
      });
    }
  },

  changePassword: async (dto) => {
    set({ loading: true, error: null, success: null });
    try {
      await UsersApi.changeMyPassword(dto);
      set({ loading: false, success: "Пароль змінено" });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Помилка зміни пароля",
        loading: false,
      });
    }
  },

  deactivate: async () => {
    set({ loading: true, error: null, success: null });
    try {
      await UsersApi.deactivateMe();
      set({ loading: false, me: null, success: "Акаунт деактивовано" });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Помилка деактивації акаунта",
        loading: false,
      });
    }
  },

  sendVerifyEmail: async () => {
    set({ loading: true, error: null, success: null });
    try {
      await UsersApi.sendVerifyEmail();
      set({ loading: false, success: "Лист підтвердження надіслано" });
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || "Не вдалося надіслати лист",
        loading: false,
      });
    }
  },
}));
