// ✅ src/core/api/interceptors.ts
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../auth/tokenStore";

type RefreshResponse = { access: string; refresh: string };

function isAuthUrl(url?: string) {
  if (!url) return false;
  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/register") ||
    url.includes("/api/auth/verify") ||
    url.includes("/api/auth/forgot") ||
    url.includes("/api/auth/reset") ||
    url.includes("/api/auth/refresh")
  );
}

export function applyInterceptors(api: AxiosInstance) {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

      if (!original) return Promise.reject(error);

      // ✅ refresh only for non-auth endpoints
      if (status === 401 && !original._retry && !isAuthUrl(original.url)) {
        const refreshToken = tokenStore.getRefreshToken();
        if (!refreshToken) {
          tokenStore.clear();
          return Promise.reject(error);
        }

        try {
          original._retry = true;

          const { data } = await api.post<RefreshResponse>("/api/auth/refresh", { refreshToken });

          tokenStore.setTokens({
            accessToken: data.access,
            refreshToken: data.refresh,
          });

          const newAccess = tokenStore.getAccessToken();
          original.headers = original.headers ?? {};
          if (newAccess) original.headers.Authorization = `Bearer ${newAccess}`;

          return api.request(original);
        } catch (e) {
          tokenStore.clear();
          return Promise.reject(e);
        }
      }

      return Promise.reject(error);
    }
  );
}
