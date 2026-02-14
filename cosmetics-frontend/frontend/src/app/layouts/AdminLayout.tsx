// src/app/layouts/AdminLayout.tsx
import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

const navItemBase =
  "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-colors";
const navItemInactive = "text-zinc-300 hover:text-gold-200 hover:bg-white/5";
const navItemActive = "text-gold-200 bg-white/5 border border-gold-500/30";

export default function AdminLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* TOPBAR */}
      <header className="sticky top-0 z-50 border-b border-gold-500/20 bg-black/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <NavLink to="/" className="font-extrabold tracking-wide">
              <span className="text-gold-200">Admin</span>{" "}
              <span className="text-white">BeautyShop</span>
            </NavLink>

            <span className="hidden sm:inline text-xs text-zinc-500">
              Панель керування
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-zinc-400 max-w-[240px] truncate">
              {user?.email}
            </span>

            <NavLink
              to="/"
              className="text-sm font-semibold px-3 py-2 rounded-xl border border-gold-500/30 hover:bg-white/5 text-gold-200"
            >
              На сайт
            </NavLink>

            <button
              onClick={logout}
              className="text-sm font-semibold px-3 py-2 rounded-xl bg-gold-500/20 border border-gold-500/30 hover:bg-gold-500/30 text-gold-200"
            >
              Вийти
            </button>
          </div>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="mx-auto max-w-7xl px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* SIDEBAR */}
        <aside className="border border-gold-500/20 rounded-3xl bg-zinc-950/40 p-3 h-fit">
          <div className="px-3 py-2 text-xs font-bold text-gold-200 uppercase tracking-wider">
            Меню адміна
          </div>

          <nav className="flex flex-col gap-2 mt-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Products
            </NavLink>

            <NavLink
              to="/admin/categories"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Categories
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Orders
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Users
            </NavLink>

            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Reviews
            </NavLink>

            <NavLink
              to="/admin/files"
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemInactive}`
              }
            >
              Files
            </NavLink>
          </nav>

          <div className="mt-4 px-3 py-3 rounded-2xl border border-gold-500/15 bg-black/40">
            <div className="text-xs text-zinc-400">Доступ:</div>
            <div className="text-sm font-bold text-gold-200">Admin</div>
            <div className="text-xs text-zinc-500 mt-1">
              REST: повний CRUD • WS: order:updateStatus, whoami
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="border border-gold-500/20 rounded-3xl bg-zinc-950/30 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
