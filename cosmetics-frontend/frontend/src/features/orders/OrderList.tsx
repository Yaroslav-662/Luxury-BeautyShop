// src/features/orders/OrderList.tsx
import React from "react";
import type { Order } from "@/features/orders/model/order.types";

export function OrderList({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return <div className="text-neutral-400">Замовлень поки немає.</div>;
  }

  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div
          key={o._id}
          className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-white font-semibold">Замовлення #{o._id.slice(-6)}</div>
              <div className="text-xs text-neutral-500">
                {new Date(o.createdAt).toLocaleString("uk-UA")}
                {" · "}
                {o.paymentMethod || "—"}
                {" · "}
                {o.address || "—"}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-neutral-400">Статус: </span>
              <span className="text-gold-300 font-semibold">{o.status}</span>
            </div>
          </div>

          <div className="text-xs text-neutral-400 mt-2">
            Позицій: {o.items?.length || 0} · Сума: {o.total} ₴
          </div>
        </div>
      ))}
    </div>
  );
}
