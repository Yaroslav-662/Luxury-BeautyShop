// src/app/layouts/UserLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const linkBase =
  "text-sm font-semibold transition-colors px-3 py-2 rounded-xl";
const linkInactive = "text-zinc-300 hover:text-gold-200 hover:bg-white/5";
const linkActive = "text-gold-200 bg-white/5 border border-gold-500/30";

export default function UserLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-gold-500/20 bg-black/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
          {/* BRAND */}
          <NavLink
            to="/"
            className="flex items-center gap-2 font-extrabold tracking-wide"
          >
            <span className="text-gold-200">Luxury</span>
            <span className="text-white">BeautyShop</span>
          </NavLink>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Головна
            </NavLink>

            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Каталог
            </NavLink>

            <NavLink
              to="/account"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Кабінет
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Мої замовлення
            </NavLink>

            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Кошик
            </NavLink>

            <NavLink
              to="/checkout"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Оформлення
            </NavLink>

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Адмін
              </NavLink>
            )}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-zinc-400 max-w-[220px] truncate">
              {user?.email}
            </span>

            <button
              onClick={logout}
              className="text-sm font-semibold px-3 py-2 rounded-xl border border-gold-500/30 hover:bg-white/5 text-gold-200"
            >
              Вийти
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="md:hidden border-t border-gold-500/10">
          <div className="mx-auto max-w-6xl px-4 py-2 flex items-center gap-2 overflow-x-auto">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Головна
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Каталог
            </NavLink>
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Кабінет
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Замовлення
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Кошик
            </NavLink>
            <NavLink
              to="/checkout"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              Оформлення
            </NavLink>
            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `${linkBase} ${isActive ? linkActive : linkInactive}`
                }
              >
                Адмін
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
