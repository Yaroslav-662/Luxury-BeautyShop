// ✅ src/core/auth/tokenStore.ts
const TOKEN_KEYS = {
  ACCESS: "access_token",
  REFRESH: "refresh_token",
};

type SetTokensPayload =
  | { accessToken: string; refreshToken: string }
  | { access: string; refresh: string };

export const tokenStore = {
  getAccessToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
  },

  // підтримує і {accessToken, refreshToken}, і {access, refresh}
  setTokens(payload: SetTokensPayload) {
    const accessToken =
      "accessToken" in payload ? payload.accessToken : payload.access;
    const refreshToken =
      "refreshToken" in payload ? payload.refreshToken : payload.refresh;

    localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken);
  },

  clear() {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
  },
};
