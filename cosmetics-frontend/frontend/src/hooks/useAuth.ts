import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/model/auth.store";
import { tokenStore } from "@/core/auth/tokenStore";

export const useAuth = () => {
  const {
    user,
    loadProfile,
    logout,
    initialized,
    isAuthenticated,
    isAdmin,
  } = useAuthStore();

  const navigate = useNavigate();
  const token = tokenStore.getAccessToken();

  useEffect(() => {
    if (!token || initialized) return;

    const init = async () => {
      try {
        await loadProfile();
      } catch {
        await logout();
        navigate("/auth/login", { replace: true });
      }
    };

    init();
  }, [token, initialized, loadProfile, logout, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    initialized,
  };
};
