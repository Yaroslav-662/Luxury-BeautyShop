// src/features/orders/OrderList.tsx

import React from "react";
import type { Order } from "@/features/orders/model/order.types";
import { OrderStatusBadge } from "@/features/orders/ui/OrderStatusBadge";


interface Props {
  orders: Order[];
}

export const OrderList: React.FC<Props> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <p className="text-neutral-400 text-sm">
        У вас ще немає замовлень.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border border-neutral-800 bg-neutral-900/60 rounded-xl p-4 flex justify-between gap-4"
        >
          {/* Ліва частина */}
          <div className="space-y-1">
            <p className="text-sm text-neutral-400">
              Замовлення #{order._id.slice(-6)}
            </p>

            <p className="text-lg font-semibold text-white">
              {order.total} ₴
            </p>

            <p className="text-xs text-neutral-500">
              Створено:{" "}
              {new Date(order.createdAt).toLocaleString("uk-UA")}
            </p>
          </div>

          {/* Права частина */}
          <div className="flex flex-col items-end justify-between">
            <OrderStatusBadge status={order.status} />

            <p className="text-xs text-neutral-400 mt-2">
              {order.items.length} товар(и)
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

