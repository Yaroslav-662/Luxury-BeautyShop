// src/admin/Dashboard/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { AdminShell } from "@/admin/_ui/AdminShell";
import {
  adminGetProducts,
  adminGetCategories,
  adminGetOrders,
  adminGetUsers,
  adminGetReviews,
  adminUpdateOrderStatus,
  type OrderDTO,
} from "@/admin/api/admin.api";
import { useAuthStore } from "@/store/auth.store";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  pending:    { label: "Очікує",       color: "text-yellow-400", icon: "⏳" },
  paid:       { label: "Оплачено",     color: "text-blue-400",   icon: "✅" },
  processing: { label: "Обробляється", color: "text-purple-400", icon: "⚙️" },
  shipped:    { label: "Відправлено",  color: "text-indigo-400", icon: "🚚" },
  delivered:  { label: "Доставлено",   color: "text-green-400",  icon: "📦" },
  cancelled:  { label: "Скасовано",    color: "text-red-400",    icon: "❌" },
};

function renderUser(u: any): string {
  if (!u) return "—";
  if (typeof u === "string") return u.slice(0, 20);
  return u.email || u.name || u._id?.slice(-8) || "—";
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    reviews: 0,
    revenue: 0,
    pendingOrders: 0,
    lowStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState<OrderDTO[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [p, c, o, u, r] = await Promise.all([
          adminGetProducts({ page: 1, q: "" }),
          adminGetCategories(),
          adminGetOrders(),
          adminGetUsers({ page: 1, limit: 1 }),
          adminGetReviews(),
        ]);

        const revenue = o
          .filter((x) => x.status !== "cancelled")
          .reduce((sum, x) => sum + (x.total || 0), 0);

        const pendingOrders = o.filter((x) => x.status === "pending").length;
        const lowStock = (p.products || []).filter((x) => (x.stock ?? 0) <= 5).length;

        setStats({
          products: p.total ?? p.products?.length ?? 0,
          categories: c.length,
          orders: o.length,
          users: u?.total ?? 0,
          reviews: r.length,
          revenue,
          pendingOrders,
          lowStock,
        });

        // Останні 5 замовлень
        setRecentOrders(o.slice(0, 5));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleStatusChange(order: OrderDTO, newStatus: string) {
    setUpdatingId(order._id);
    try {
      await adminUpdateOrderStatus(order._id, newStatus);
      setRecentOrders((prev) =>
        prev.map((o) => (o._id === order._id ? { ...o, status: newStatus } : o))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Доброго ранку" : hour < 18 ? "Доброго дня" : "Доброго вечора";

  return (
    <>
      <MetaTags title="Admin — Dashboard" />

      <div className="space-y-6 text-white">
        {/* Welcome */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gold-300">
              {greeting}, {user?.name?.split(" ")[0] || "Адміне"} 👋
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              {new Date().toLocaleDateString("uk-UA", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-neutral-400 hover:text-white border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            🔄 Оновити
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-neutral-900 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Alerts */}
            {(stats.pendingOrders > 0 || stats.lowStock > 0) && (
              <div className="flex flex-wrap gap-3">
                {stats.pendingOrders > 0 && (
                  <Link
                    to="/admin/orders"
                    className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 rounded-xl px-4 py-2.5 text-sm hover:bg-yellow-500/20 transition-colors"
                  >
                    ⏳ {stats.pendingOrders} нових замовлень очікують підтвердження →
                  </Link>
                )}
                {stats.lowStock > 0 && (
                  <Link
                    to="/admin/products"
                    className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-2.5 text-sm hover:bg-red-500/20 transition-colors"
                  >
                    ⚠️ {stats.lowStock} товарів із залишком ≤5 →
                  </Link>
                )}
              </div>
            )}

            {/* Main stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Загальний дохід", value: `${stats.revenue.toFixed(0)} ₴`, icon: "💰", color: "text-green-400", sub: "без скасованих" },
                { label: "Замовлення", value: stats.orders, icon: "📦", color: "text-yellow-400", sub: `${stats.pendingOrders} очікують` },
                { label: "Товари", value: stats.products, icon: "🛍️", color: "text-blue-400", sub: `${stats.lowStock} мало залишку` },
                { label: "Користувачі", value: stats.users, icon: "👥", color: "text-purple-400", sub: "зареєстровані" },
              ].map((s) => (
                <div key={s.label} className="bg-neutral-900/70 border border-neutral-800 rounded-2xl p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="text-xs text-neutral-600 mt-1">{s.sub}</p>
                    </div>
                    <span className="text-2xl opacity-60">{s.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Категорії", value: stats.categories, icon: "📂", to: "/admin/categories" },
                { label: "Відгуки", value: stats.reviews, icon: "⭐", to: "/admin/reviews" },
                { label: "Файли", value: "—", icon: "🗂️", to: "/admin/files" },
                { label: "Середній чек", value: stats.orders ? `${(stats.revenue / stats.orders).toFixed(0)} ₴` : "—", icon: "📊", to: "/admin/orders" },
              ].map((s) => (
                <Link
                  key={s.label}
                  to={s.to}
                  className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-4 hover:border-neutral-600 hover:bg-neutral-900/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <p className="text-xs text-neutral-500">{s.label}</p>
                      <p className="text-lg font-bold text-white">{s.value}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent orders */}
            <AdminShell
              title="Останні замовлення"
              subtitle="5 найновіших замовлень"
              right={
                <Link
                  to="/admin/orders"
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Всі замовлення →
                </Link>
              }
            >
              {recentOrders.length === 0 ? (
                <p className="text-neutral-500 text-sm">Замовлень ще немає</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 text-neutral-400">
                        <th className="text-left py-2 font-medium">ID</th>
                        <th className="text-left py-2 font-medium">Покупець</th>
                        <th className="text-left py-2 font-medium">Сума</th>
                        <th className="text-left py-2 font-medium">Статус</th>
                        <th className="text-left py-2 font-medium">Дата</th>
                        <th className="text-right py-2 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => {
                        const cfg = STATUS_CONFIG[order.status || "pending"] || STATUS_CONFIG.pending;
                        return (
                          <tr key={order._id} className="border-b border-neutral-800/50 hover:bg-neutral-800/20 transition-colors">
                            <td className="py-3 font-mono text-xs text-neutral-400">
                              #{order._id.slice(-6).toUpperCase()}
                            </td>
                            <td className="py-3 text-neutral-300 text-xs">
                              {renderUser(order.user)}
                            </td>
                            <td className="py-3 text-yellow-400 font-semibold">
                              {(order.total || 0).toFixed(0)} ₴
                            </td>
                            <td className="py-3">
                              <select
                                value={order.status || "pending"}
                                disabled={updatingId === order._id}
                                onChange={(e) => handleStatusChange(order, e.target.value)}
                                className={`text-xs bg-transparent border-0 font-medium focus:outline-none cursor-pointer disabled:opacity-50 ${cfg.color}`}
                              >
                                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                                  <option key={key} value={key} className="bg-neutral-900 text-white">
                                    {val.icon} {val.label}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="py-3 text-neutral-500 text-xs">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString("uk-UA")
                                : "—"}
                            </td>
                            <td className="py-3 text-right">
                              <Link
                                to={`/admin/orders/${order._id}`}
                                className="text-xs text-yellow-400 hover:underline"
                              >
                                Деталі →
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </AdminShell>

            {/* Quick actions */}
            <div>
              <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-3">Швидкі дії</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Додати товар",     icon: "➕", to: "/admin/products/create", color: "hover:border-green-500/50" },
                  { label: "Всі товари",       icon: "🛍️", to: "/admin/products",        color: "hover:border-blue-500/50" },
                  { label: "Замовлення",       icon: "📦", to: "/admin/orders",           color: "hover:border-yellow-500/50" },
                  { label: "Користувачі",      icon: "👥", to: "/admin/users",            color: "hover:border-purple-500/50" },
                  { label: "Категорії",        icon: "📂", to: "/admin/categories",       color: "hover:border-indigo-500/50" },
                  { label: "Відгуки",          icon: "⭐", to: "/admin/reviews",          color: "hover:border-orange-500/50" },
                  { label: "Файли",            icon: "🗂️", to: "/admin/files",            color: "hover:border-neutral-500/50" },
                  { label: "На сайт",          icon: "🌐", to: "/",                       color: "hover:border-teal-500/50" },
                ].map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className={`flex items-center gap-3 bg-neutral-900/40 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-300 hover:text-white transition-all ${action.color}`}
                  >
                    <span className="text-base">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
