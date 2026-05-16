// src/features/orders/OrderList.tsx
import React from "react";
import { Link } from "react-router-dom";
import type { Order, OrderStatus } from "@/features/orders/model/order.types";

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pending:    { label: "Очікує",       color: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30", icon: "⏳" },
  paid:       { label: "Оплачено",     color: "bg-blue-500/15 text-blue-300 border-blue-500/30",       icon: "✅" },
  processing: { label: "Обробляється", color: "bg-purple-500/15 text-purple-300 border-purple-500/30", icon: "⚙️" },
  shipped:    { label: "Відправлено",  color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", icon: "🚚" },
  delivered:  { label: "Доставлено",   color: "bg-green-500/15 text-green-300 border-green-500/30",    icon: "📦" },
  cancelled:  { label: "Скасовано",    color: "bg-red-500/15 text-red-300 border-red-500/30",          icon: "❌" },
};

interface Props {
  orders: Order[];
}

export const OrderList: React.FC<Props> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-3">📦</div>
        <p className="text-neutral-400 text-sm">У вас ще немає замовлень.</p>
        <Link to="/shop" className="text-sm text-yellow-400 hover:underline mt-2 block">
          Перейти до каталогу →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
        return (
          <div
            key={order._id}
            className="border border-neutral-800 bg-neutral-900/60 rounded-xl p-4 flex justify-between items-start gap-4 hover:border-neutral-700 transition-colors"
          >
            {/* Ліва частина */}
            <div className="space-y-1.5 min-w-0">
              <p className="text-xs text-neutral-500">
                #{order._id.slice(-8).toUpperCase()}
              </p>
              <p className="text-lg font-bold text-yellow-400">
                {order.total?.toFixed(2)} ₴
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                  day: "2-digit", month: "long", year: "numeric",
                })}
              </p>
              {order.address && (
                <p className="text-xs text-neutral-500 truncate max-w-xs">
                  📍 {order.address}
                </p>
              )}
            </div>

            {/* Права частина */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
                {cfg.icon} {cfg.label}
              </span>
              <p className="text-xs text-neutral-500">
                {order.items?.length || 0} товар
                {(order.items?.length || 0) === 1 ? "" : (order.items?.length || 0) < 5 ? "и" : "ів"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
