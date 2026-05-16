// src/admin/Orders/OrderDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { api } from "@/core/api/axios";
import type { Order, OrderStatus } from "@/features/orders/model/order.types";
import { OrdersApi } from "@/features/orders/api/orders.api";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending:    { label: "Очікує",       color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30", icon: "⏳" },
  paid:       { label: "Оплачено",     color: "bg-blue-500/20 text-blue-300 border-blue-500/30",       icon: "✅" },
  processing: { label: "Обробляється", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: "⚙️" },
  shipped:    { label: "Відправлено",  color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30", icon: "🚚" },
  delivered:  { label: "Доставлено",   color: "bg-green-500/20 text-green-300 border-green-500/30",    icon: "📦" },
  cancelled:  { label: "Скасовано",    color: "bg-red-500/20 text-red-300 border-red-500/30",          icon: "❌" },
};

const PAYMENT_LABELS: Record<string, string> = {
  card:     "💳 Картка онлайн",
  monobank: "🟡 Monobank",
  cash:     "💵 Накладений платіж",
};

const ALL_STATUSES: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<Order>(`/api/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError("Не вдалося завантажити замовлення"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: OrderStatus) {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await OrdersApi.updateOrderStatus(order._id, newStatus);
      if (res.order) setOrder(res.order);
      else setOrder((prev) => prev ? { ...prev, status: newStatus } : prev);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } catch {
      setError("Не вдалося оновити статус");
    } finally {
      setUpdating(false);
    }
  }

  if (!id) return <div className="text-red-400 p-6">Невірний ID замовлення</div>;
  if (loading) return <div className="text-neutral-400 p-6 animate-pulse">Завантаження…</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;
  if (!order) return null;

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const user = order.user;
  const userName = typeof user === "object" ? (user?.name || user?.email || "—") : (user || "—");
  const userEmail = typeof user === "object" ? (user?.email || "—") : "—";

  return (
    <>
      <MetaTags title={`Замовлення #${id.slice(-8).toUpperCase()}`} />

      <div className="max-w-3xl mx-auto space-y-5 p-6 text-white">
        {/* Back */}
        <Link to="/admin/orders" className="text-sm text-neutral-400 hover:text-white flex items-center gap-1">
          ← Всі замовлення
        </Link>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Замовлення #{order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {new Date(order.createdAt).toLocaleString("uk-UA", {
                day: "2-digit", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${statusCfg.color}`}>
            {statusCfg.icon} {statusCfg.label}
          </span>
        </div>

        {statusSuccess && (
          <div className="bg-green-500/15 border border-green-500/30 text-green-300 rounded-xl px-4 py-2 text-sm">
            ✅ Статус оновлено
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Customer */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 space-y-2">
            <h2 className="font-semibold text-neutral-300 text-sm uppercase tracking-wide">Покупець</h2>
            <p className="text-white font-medium">{userName}</p>
            <p className="text-neutral-400 text-sm">{userEmail}</p>
            {order.address && (
              <p className="text-neutral-400 text-sm">📍 {order.address}</p>
            )}
            {order.paymentMethod && (
              <p className="text-neutral-400 text-sm">
                {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 space-y-2">
            <h2 className="font-semibold text-neutral-300 text-sm uppercase tracking-wide">Підсумок</h2>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-400">Товарів</span>
              <span>{order.items?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-neutral-800 pt-2 mt-2">
              <span className="text-neutral-400 font-medium">Загальна сума</span>
              <span className="text-yellow-400 font-bold text-base">{order.total?.toFixed(2)} ₴</span>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5">
          <h2 className="font-semibold text-neutral-300 text-sm uppercase tracking-wide mb-3">Товари</h2>
          {order.items?.length ? (
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-neutral-800 last:border-0">
                  <span className="text-neutral-300">
                    {typeof item.product === "object"
                      ? (item.product as any).name
                      : `ID: ${String(item.product).slice(-8)}`}
                  </span>
                  <span className="text-neutral-500">× {item.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-sm">Немає товарів</p>
          )}
        </div>

        {/* Status change */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5">
          <h2 className="font-semibold text-neutral-300 text-sm uppercase tracking-wide mb-3">Змінити статус</h2>
          <div className="flex flex-wrap gap-2">
            {ALL_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const isActive = order.status === s;
              return (
                <button
                  key={s}
                  disabled={updating || isActive}
                  onClick={() => handleStatusChange(s)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                    ${isActive
                      ? `${cfg.color} cursor-default`
                      : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white"
                    }`}
                >
                  {cfg.icon} {cfg.label}
                  {isActive && <span className="text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
