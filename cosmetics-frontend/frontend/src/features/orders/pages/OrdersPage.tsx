// src/features/orders/pages/OrdersPage.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MetaTags } from "@/app/seo/MetaTags";
import { useOrders } from "@/features/orders/store/useOrders";
import type { Order, OrderStatus } from "@/features/orders/model/order.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending:    { label: "Очікує підтвердження", color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30", icon: "⏳" },
  paid:       { label: "Оплачено",             color: "bg-blue-500/15 text-blue-300 border-blue-500/30",       icon: "✅" },
  processing: { label: "Обробляється",          color: "bg-purple-500/15 text-purple-300 border-purple-500/30", icon: "⚙️" },
  shipped:    { label: "Відправлено",           color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", icon: "🚚" },
  delivered:  { label: "Доставлено",            color: "bg-green-500/15 text-green-300 border-green-500/30",    icon: "📦" },
  cancelled:  { label: "Скасовано",             color: "bg-red-500/15 text-red-300 border-red-500/30",          icon: "❌" },
};

const PAYMENT_LABELS: Record<string, string> = {
  card:      "💳 Картка онлайн",
  monobank:  "🟡 Monobank",
  cash:      "💵 Накладений платіж",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: "bg-neutral-700 text-neutral-300 border-neutral-600", icon: "•" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

// Прогрес-бар статусу
const STATUS_STEPS: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered"];

function StatusProgress({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return null;
  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-3">
      {STATUS_STEPS.map((step, idx) => {
        const cfg = STATUS_CONFIG[step];
        const isCompleted = idx <= currentIndex;
        return (
          <React.Fragment key={step}>
            <div className={`flex flex-col items-center ${idx === 0 ? "" : ""}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 transition-colors ${
                isCompleted
                  ? "bg-yellow-500 border-yellow-500 text-black"
                  : "bg-neutral-800 border-neutral-700 text-neutral-600"
              }`}>
                {isCompleted ? "✓" : idx + 1}
              </div>
              <span className={`text-[9px] mt-1 text-center w-14 leading-tight ${
                isCompleted ? "text-yellow-400" : "text-neutral-600"
              }`}>
                {cfg.label}
              </span>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 transition-colors ${
                idx < currentIndex ? "bg-yellow-500" : "bg-neutral-700"
              }`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function OrdersPage() {
  const { orders, loading, error, fetchOrders } = useOrders();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const toggleExpand = (id: string) => setExpanded((prev) => prev === id ? null : id);

  return (
    <>
      <MetaTags title="Мої замовлення" />

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gold-300">Мої замовлення</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {!loading && `${orders.length} замовлен${orders.length === 1 ? "ня" : "ь"}`}
            </p>
          </div>
          <Link
            to="/shop"
            className="text-sm text-neutral-400 hover:text-white border border-neutral-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            До каталогу →
          </Link>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-900 rounded-2xl h-28 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-neutral-900/60 border border-neutral-800 rounded-2xl">
            <div className="text-5xl mb-3">📦</div>
            <h2 className="text-lg font-semibold text-neutral-300 mb-2">Замовлень ще немає</h2>
            <p className="text-sm text-neutral-500 mb-6">Оформіть перше замовлення в каталозі</p>
            <Link
              to="/shop"
              className="inline-block bg-yellow-500 text-black px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors"
            >
              Перейти до каталогу
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order: Order) => {
            const isExpanded = expanded === order._id;
            const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

            return (
              <div
                key={order._id}
                className="border border-neutral-800 bg-neutral-900/60 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div
                  className="flex items-start justify-between gap-3 p-5 cursor-pointer hover:bg-neutral-800/30 transition-colors"
                  onClick={() => toggleExpand(order._id)}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        Замовлення #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                      <span>
                        📅 {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                          day: "2-digit", month: "long", year: "numeric",
                        })}
                      </span>
                      {order.paymentMethod && (
                        <span>{PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}</span>
                      )}
                      <span>📌 {order.items?.length || 0} товар{
                        (order.items?.length || 0) === 1 ? "" :
                        (order.items?.length || 0) < 5 ? "и" : "ів"
                      }</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-yellow-400 text-base">
                      {order.total?.toFixed(2)} ₴
                    </span>
                    <span className="text-neutral-500 text-sm">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-neutral-800 px-5 pb-5 space-y-4">
                    {/* Progress */}
                    <StatusProgress status={order.status} />

                    {/* Address */}
                    {order.address && (
                      <div className="text-sm">
                        <span className="text-neutral-500 text-xs uppercase tracking-wide block mb-1">Адреса доставки</span>
                        <span className="text-neutral-300">📍 {order.address}</span>
                      </div>
                    )}

                    {/* Items */}
                    {order.items && order.items.length > 0 && (
                      <div>
                        <span className="text-neutral-500 text-xs uppercase tracking-wide block mb-2">Товари</span>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                              <span className="text-neutral-300">
                                {typeof item.product === "object"
                                  ? (item.product as any).name
                                  : `Товар ${String(item.product).slice(-6)}`
                                }
                              </span>
                              <span className="text-neutral-500">× {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                      <span className="text-sm text-neutral-400">Загальна сума</span>
                      <span className="font-bold text-yellow-400 text-lg">{order.total?.toFixed(2)} ₴</span>
                    </div>

                    {/* Cancel button for pending orders */}
                    {order.status === "pending" && (
                      <p className="text-xs text-neutral-500">
                        Щоб скасувати замовлення — зв'яжіться з підтримкою.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
