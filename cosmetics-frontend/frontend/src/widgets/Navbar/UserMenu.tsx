// src/widgets/Navbar/UserMenu.tsx
import { useAuthStore } from "@/store/auth.store";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { user, logout, initialized } = useAuthStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Закрити меню при кліку поза ним
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!initialized) return null;

  if (!user) {
    return (
      <Link
        to="/auth/login"
        className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg text-sm font-semibold transition-colors"
      >
        Увійти
      </Link>
    );
  }

  const avatarUrl = (user as any).avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "U")}&background=random&size=32`;

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-neutral-800 transition-colors"
      >
        <img
          src={avatarUrl}
          alt={user.name}
          className="w-7 h-7 rounded-full object-cover border border-neutral-600"
        />
        <span className="hidden md:block text-sm text-white max-w-[100px] truncate">
          {user.name}
        </span>
        <span className="text-neutral-500 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-neutral-950 border border-neutral-800 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-neutral-800">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-neutral-500 truncate">{(user as any).email}</p>
          </div>

          {/* Links */}
          <div className="py-1">
            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <span>👤</span> Мій профіль
            </Link>
            <Link
              to="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <span>📦</span> Мої замовлення
            </Link>
            <Link
              to="/favorites"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <span>♡</span> Обрані товари
            </Link>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <span>🛒</span> Кошик
            </Link>
          </div>

          {/* Admin */}
          {(user as any).role === "admin" && (
            <div className="border-t border-neutral-800 py-1">
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-yellow-400 font-semibold hover:bg-yellow-500/10 transition-colors"
              >
                <span>⚙️</span> Адмін панель
              </Link>
            </div>
          )}

          {/* Logout */}
          <div className="border-t border-neutral-800 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
            >
              <span>🚪</span> Вийти
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
