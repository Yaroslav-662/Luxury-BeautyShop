import React, { useEffect } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Card from "@/shared/ui/Card";

import { useOrders } from "@/features/orders/store/useOrders";
import { OrderList } from "@/features/orders/OrderList"; // якщо шлях інший — поправ

export default function OrdersPage() {
  const orders = useOrders((s) => s.orders);
  const loading = useOrders((s) => s.loading);
  const error = useOrders((s) => s.error);
  const fetchOrders = useOrders((s) => s.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  return (
    <>
      <MetaTags title="Мої замовлення" />
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gold-300">Мої замовлення</h1>

        {loading && <div className="text-neutral-400">Завантаження…</div>}
        {error && <div className="text-red-300 text-sm">{error}</div>}

        {!loading && orders.length === 0 && (
          <div className="text-neutral-400">Замовлень поки немає.</div>
        )}

        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="border border-neutral-800 bg-neutral-900/60 rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-white font-semibold">Замовлення #{o._id.slice(-6)}</div>
                  <div className="text-xs text-neutral-500">
                    {new Date(o.createdAt).toLocaleString("uk-UA")} · {o.paymentMethod} · {o.address}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-neutral-400">Статус: </span>
                  <span className="text-gold-300 font-semibold">{o.status}</span>
                </div>
              </div>

              <div className="text-xs text-neutral-400 mt-2">
                Позицій: {o.items?.length || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

