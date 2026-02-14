// src/app/router/AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/auth/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
