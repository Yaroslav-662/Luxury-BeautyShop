import React, { useEffect } from "react";
import { api } from "@/core/api/axios";
import { tokenStore } from "@/core/auth/tokenStore";
import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout, setInitialized } = useAuthStore();

  useEffect(() => {
    const token = tokenStore.getAccessToken();
    if (!token) {
      setInitialized(true);
      return;
    }

    api
      .get("/api/auth/profile")
      .then((res) => {
        // якщо бекенд повертає {user:...} — тоді буде res.data.user
        setUser(res.data);
      })
      .catch(() => logout())
      .finally(() => setInitialized(true));
  }, [setUser, logout, setInitialized]);

  return <>{children}</>;
}

