// src/features/orders/pages/RealtimeOrdersPage.tsx
import React, { useEffect } from "react";
import { MetaTags } from "@/app/seo/MetaTags";

import { useOrders } from "@/features/orders/store/useOrders";
import { useOrderRealtime } from "@/features/orders/hooks/useOrderRealtime";
import { OrderTable } from "@/features/orders/ui/OrderTable";
import type { OrderStatus } from "@/features/orders/model/order.types";

export default function RealtimeOrdersPage() {
  const orders = useOrders((s) => s.orders);
  const fetchOrders = useOrders((s) => s.fetchOrders);
  const loading = useOrders((s) => s.loading);
  const error = useOrders((s) => s.error);

  useOrderRealtime();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    // тут ми тільки локально міняємо (або можеш викликати api)
    // краще: робити це на адмінці через adminUpdateOrderStatus
    // для юзера зазвичай зміна статусу не потрібна.
    console.log("status change request", orderId, newStatus);
  };

  return (
    <>
      <MetaTags title="Realtime Orders" />

      <div className="p-6 text-white space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Замовлення (Real-time)</h1>
          <p className="text-xs text-neutral-400">
            Нові замовлення та зміни статусів зʼявляються миттєво через WebSocket.
          </p>
        </div>

        {loading && <div className="text-neutral-400">Завантаження…</div>}
        {error && <div className="text-red-300 text-sm">{error}</div>}

        {!loading && !error && (
          <OrderTable orders={orders} onChangeStatus={handleStatusChange} />
        )}
      </div>
    </>
  );
}
