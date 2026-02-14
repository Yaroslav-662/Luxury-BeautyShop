import { create } from "zustand";
import { AuthApi } from "../api/auth.api";
import type { AuthUser, LoginPayload, RegisterPayload } from "./auth.types";
import { tokenStore } from "@/core/auth/tokenStore";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;

  // derived
  isAuthenticated: boolean;
  isAdmin: boolean;

  // actions
  setUser: (user: AuthUser | null) => void;
  loadProfile: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  initialized: false,
  isAuthenticated: false,
  isAdmin: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
    }),

  loadProfile: async () => {
    if (!tokenStore.getAccessToken()) {
      set({ initialized: true });
      return;
    }

    set({ loading: true, error: null });

    try {
      const profile = await AuthApi.getProfile();
      set({
        user: profile,
        isAuthenticated: true,
        isAdmin: profile.role === "admin",
        initialized: true,
        loading: false,
      });
    } catch {
      tokenStore.clear();
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        initialized: true,
        loading: false,
      });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: null });

    try {
      const res = await AuthApi.login(payload);
      set({
        user: res.user,
        isAuthenticated: true,
        isAdmin: res.user.role === "admin",
        loading: false,
      });
      return true;
    } catch (e: any) {
      set({
        error:
          e?.response?.data?.message ||
          "Не вдалося увійти. Перевірте дані.",
        loading: false,
      });
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      await AuthApi.register(payload);
      set({ loading: false });
      return true;
    } catch (e: any) {
      set({
        error:
          e?.response?.data?.message ||
          "Не вдалося зареєструватися.",
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      const refreshToken = tokenStore.getRefreshToken();
      await AuthApi.logout(refreshToken || undefined);
    } finally {
      tokenStore.clear();
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
      });
    }
  },

  logoutAll: async () => {
    set({ loading: true });
    try {
      await AuthApi.logoutAll();
    } finally {
      tokenStore.clear();
      set({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
      });
    }
  },
}));
