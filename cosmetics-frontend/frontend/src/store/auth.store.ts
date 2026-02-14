import { create } from "zustand";
import { api } from "@/core/api/axios";
import { tokenStore } from "@/core/auth/tokenStore";
import { useNotificationsStore } from "./notifications.store";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  initialized: boolean;
  loading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;

  login: (payload: { email: string; password: string; twoFactorCode?: string }) => Promise<boolean>;
  register: (payload: { name: string; email: string; password: string }) => Promise<boolean>;

  logout: () => void;
}

type SwaggerLoginResponse = {
  message?: string;
  access: string;
  refresh: string;
  user: { id: string; name: string; email: string; role: "user" | "admin"; isVerified?: boolean };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setInitialized: (value) => set({ initialized: value }),

  login: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<SwaggerLoginResponse>("/api/auth/login", payload);

      tokenStore.setTokens({
        accessToken: data.access,
        refreshToken: data.refresh,
      });

      set({
        user: {
          _id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          isVerified: data.user.isVerified,
        },
        loading: false,
      });

      useNotificationsStore.getState().success(data.message || "Успішний вхід");
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Помилка авторизації";
      set({ loading: false, error: msg });
      useNotificationsStore.getState().error(msg);
      return false;
    }
  },

  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post<{ message?: string }>("/api/auth/register", payload);
      set({ loading: false });
      useNotificationsStore.getState().success(data?.message || "Реєстрація успішна. Перевір email для підтвердження.");
      return true;
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Не вдалося створити акаунт";
      set({ loading: false, error: msg });
      useNotificationsStore.getState().error(msg);
      return false;
    }
  },

  logout: () => {
    tokenStore.clear();
    set({ user: null });
    useNotificationsStore.getState().info("Ви вийшли з системи");
  },
}));