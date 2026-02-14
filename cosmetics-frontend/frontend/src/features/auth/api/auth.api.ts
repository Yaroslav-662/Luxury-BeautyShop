// ✅ src/features/auth/api/auth.api.ts
import { api } from "@/core/api/axios";
import { tokenStore } from "@/core/auth/tokenStore";
import { API_URL } from "@/core/config/env"; // <-- ДОДАЙ (шлях може бути інший)
import type {
  AuthTokens,
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  SessionInfo,
  LoginHistoryEntry,
  TwoFASetupResponse,
} from "../model/auth.types";

type SwaggerLoginResponse = {
  message?: string;
  access: string;
  refresh: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    isVerified?: boolean;
  };
};

type SwaggerRefreshResponse = {
  access: string;
  refresh: string;
};

export const AuthApi = {
  async register(payload: RegisterPayload) {
    const { data } = await api.post("/api/auth/register", payload);
    return data as { message?: string };
  },

  async verifyEmail(token: string) {
    const { data } = await api.get(`/api/auth/verify/${token}`);
    return data as { message?: string };
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await api.post<SwaggerLoginResponse>("/api/auth/login", payload);

    // ✅ зберігаємо токени правильно
    tokenStore.setTokens({
      accessToken: data.access,
      refreshToken: data.refresh,
    });

    return {
      message: data.message,
      accessToken: data.access,
      refreshToken: data.refresh,
      user: {
        _id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      },
    } as any;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const { data } = await api.post<SwaggerRefreshResponse>("/api/auth/refresh", { refreshToken });

    tokenStore.setTokens({
      accessToken: data.access,
      refreshToken: data.refresh,
    });

    return {
      accessToken: data.access,
      refreshToken: data.refresh,
    } as any;
  },

  async logout(refreshToken?: string) {
    try {
      await api.post("/api/auth/logout", { refreshToken });
    } finally {
      tokenStore.clear();
    }
  },

  async logoutAll() {
    try {
      await api.post("/api/auth/logout/all");
    } finally {
      tokenStore.clear();
    }
  },

  async getSessions(): Promise<SessionInfo[]> {
    const { data } = await api.get<SessionInfo[]>("/api/auth/sessions");
    return data;
  },

  async revokeSession(token: string) {
    const { data } = await api.post("/api/auth/sessions/revoke", { token });
    return data as { message?: string };
  },

  async forgotPassword(email: string) {
    const { data } = await api.post("/api/auth/forgot", { email });
    return data as { message?: string };
  },

  async resetPassword(token: string, password: string) {
    const { data } = await api.post(`/api/auth/reset/${token}`, { password });
    return data as { message?: string };
  },

  async getProfile(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>("/api/auth/profile");
    return data;
  },

  async getLoginHistory(): Promise<LoginHistoryEntry[]> {
    const { data } = await api.get<LoginHistoryEntry[]>("/api/auth/logins");
    return data;
  },

  async setup2FA(): Promise<TwoFASetupResponse> {
    const { data } = await api.post<TwoFASetupResponse>("/api/auth/2fa/setup");
    return data;
  },

  async verify2FA(token: string) {
    const { data } = await api.post("/api/auth/2fa/verify", { token });
    return data as { message?: string };
  },

  // ✅ ОЦЕ ВАЖЛИВО:
  googleLogin() {
    window.location.href = `${API_URL}/api/auth/google`;
  },
};
