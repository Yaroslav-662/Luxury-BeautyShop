import { useAuthStore } from "@/store/auth.store";
import { Navigate, useLocation } from "react-router-dom";

export default function RoleRouter() {
  const { user } = useAuthStore();
  const location = useLocation();

  // якщо ProtectedRoute передав state.from — повертаємось туди
  const from = (location.state as any)?.from as string | undefined;

  if (!user) return <Navigate to="/" replace />;

  if (from) return <Navigate to={from} replace />;

  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/account" replace />;
}
