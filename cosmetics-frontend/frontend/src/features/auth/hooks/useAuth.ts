// src/features/auth/hooks/useAuth.ts

import { useAuthStore  } from "../model/auth.store";
import type { AuthUser } from "../model/auth.types";

export function useAuth() {
  const {
    user,
    loading,
    error,
    login,
    register,
    logout,
    logoutAll,
    loadProfile,
    setUser,
    initialized,
  } = useAuthStore();

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";

  return {
    user: user as AuthUser | null,
    loading,
    error,
    initialized,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    logoutAll,
    loadProfile,
    setUser,
  };
}
