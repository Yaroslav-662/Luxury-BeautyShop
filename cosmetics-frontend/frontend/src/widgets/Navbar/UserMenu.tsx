import { useAuthStore } from "@/store/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function UserMenu() {
  const { user, logout, initialized} = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // ⏳ чекаємо ініціалізацію auth
  if (!initialized) return null;

  if (!user) {
    return (
      <Link
        to="/auth/login"
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-md font-semibold"
      >
        Увійти
      </Link>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-md"
      >
        👤 {user.name}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-black border border-gray-700 w-48 rounded-md shadow-md z-50">
          <Link
            to="/account"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-yellow-500/20"
          >
            Профіль
          </Link>

          <Link
            to="/orders"
            onClick={() => setOpen(false)}
            className="block px-4 py-2 hover:bg-yellow-500/20"
          >
            Мої замовлення
          </Link>

          {user.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-yellow-500 font-bold hover:bg-yellow-500/10"
            >
              Адмін панель
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-red-500 hover:bg-red-500/20 w-full text-left"
          >
            Вийти
          </button>
        </div>
      )}
    </div>
  );
}
