// src/admin/Orders/OrdersList.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { useOrders } from "@/features/orders/store/useOrders";
import { OrdersApi } from "@/features/orders/api/orders.api";
import type { Order, OrderStatus } from "@/features/orders/model/order.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending:    { label: "Очікує",       color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: "⏳" },
  paid:       { label: "Оплачено",     color: "bg-blue-500/20 text-blue-300 border-blue-500/30",       icon: "✅" },
  processing: { label: "Обробляється", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: "⚙️" },
  shipped:    { label: "Відправлено",  color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", icon: "🚚" },
  delivered:  { label: "Доставлено",   color: "bg-green-500/20 text-green-300 border-green-500/30",    icon: "📦" },
  cancelled:  { label: "Скасовано",    color: "bg-red-500/20 text-red-300 border-red-500/30",          icon: "❌" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

const PAYMENT_LABELS: Record<string, string> = {
  card:     "💳 Картка",
  monobank: "🟡 Monobank",
  cash:     "💵 Накладений",
};

function renderUser(u: Order["user"]) {
  if (!u) return "—";
  if (typeof u === "string") return u.slice(-8);
  return u.email || u.name || u._id?.slice(-8) || "—";
}

export default function AdminOrdersList() {
  const { orders, loading, error, fetchOrders, updateStatusRealtime } = useOrders();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Фільтрація
  const filtered = orders.filter((o) => {
    const userStr = renderUser(o.user).toLowerCase();
    const matchSearch = !search ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      userStr.includes(search.toLowerCase()) ||
      (o.address || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Швидка зміна статусу прямо в таблиці
  async function handleQuickStatus(order: Order, newStatus: OrderStatus) {
    setUpdatingId(order._id);
    try {
      await OrdersApi.updateOrderStatus(order._id, newStatus);
      updateStatusRealtime(order._id, newStatus);
    } catch {
      // ігноруємо — можна додати toast
    } finally {
      setUpdatingId(null);
    }
  }

  // Статистика
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <>
      <MetaTags title="Адмін — Замовлення" />

      <div className="p-6 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Замовлення</h1>
          <button
            onClick={() => fetchOrders()}
            className="text-sm text-neutral-400 hover:text-white border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            🔄 Оновити
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Всього", value: stats.total, color: "text-white" },
            { label: "Очікують", value: stats.pending, color: "text-yellow-400" },
            { label: "Відправлено", value: stats.shipped, color: "text-indigo-400" },
            { label: "Дохід", value: `${stats.revenue.toFixed(0)} ₴`, color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-4">
              <p className="text-xs text-neutral-500 mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Пошук</label>
            <input
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white w-56 focus:outline-none focus:ring-1 focus:ring-yellow-500"
              placeholder="ID, email, адреса..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-neutral-400 block mb-1">Статус</label>
            <select
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-yellow-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "")}
            >
              <option value="">Всі статуси</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
          {(search || statusFilter) && (
            <button
              onClick={() => { setSearch(""); setStatusFilter(""); }}
              className="text-xs text-neutral-400 hover:text-white px-3 py-2 border border-neutral-700 rounded-lg transition-colors"
            >
              Скинути
            </button>
          )}
          <span className="text-xs text-neutral-500 ml-auto self-end pb-2">
            {filtered.length} з {orders.length}
          </span>
        </div>

        {loading && (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-neutral-900 rounded-xl h-14 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-x-auto border border-neutral-800 rounded-xl">
            <table className="min-w-full text-sm text-left bg-neutral-900/70">
              <thead className="bg-neutral-900 border-b border-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-neutral-400 font-medium">ID</th>
                  <th className="px-4 py-3 text-neutral-400 font-medium">Покупець</th>
                  <th className="px-4 py-3 text-neutral-400 font-medium">Сума</th>
                  <th className="px-4 py-3 text-neutral-400 font-medium">Оплата</th>
                  <th className="px-4 py-3 text-neutral-400 font-medium">Статус</th>
                  <th className="px-4 py-3 text-neutral-400 font-medium">Дата</th>
                  <th className="px-4 py-3 text-neutral-400 font-medium">Дії</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  const isUpdating = updatingId === order._id;

                  return (
                    <tr key={order._id} className="border-b border-neutral-800 hover:bg-neutral-800/40 transition-colors">
                      {/* ID */}
                      <td className="px-4 py-3 font-mono text-neutral-400 text-xs">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>

                      {/* Покупець */}
                      <td className="px-4 py-3">
                        <div className="text-neutral-200 text-xs">{renderUser(order.user)}</div>
                        {order.address && (
                          <div className="text-neutral-500 text-xs truncate max-w-[160px]" title={order.address}>
                            {order.address}
                          </div>
                        )}
                      </td>

                      {/* Сума */}
                      <td className="px-4 py-3 text-yellow-400 font-semibold">
                        {order.total?.toFixed(2)} ₴
                      </td>

                      {/* Оплата */}
                      <td className="px-4 py-3 text-neutral-400 text-xs">
                        {order.paymentMethod
                          ? PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod
                          : "—"}
                      </td>

                      {/* Статус — dropdown */}
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          disabled={isUpdating}
                          onChange={(e) => handleQuickStatus(order, e.target.value as OrderStatus)}
                          className={`text-xs rounded-lg px-2 py-1 border font-medium focus:outline-none disabled:opacity-50 cursor-pointer ${cfg.color} bg-transparent`}
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s} className="bg-neutral-900 text-white">
                              {STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Дата */}
                      <td className="px-4 py-3 text-neutral-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                        })}
                        <br />
                        {new Date(order.createdAt).toLocaleTimeString("uk-UA", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </td>

                      {/* Дії */}
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="text-xs text-yellow-400 hover:text-yellow-300 border border-yellow-500/30 px-3 py-1.5 rounded-lg transition-colors hover:bg-yellow-500/10"
                        >
                          Деталі →
                        </Link>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-neutral-500">
                      {orders.length === 0 ? "Замовлень ще немає" : "Нічого не знайдено"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
