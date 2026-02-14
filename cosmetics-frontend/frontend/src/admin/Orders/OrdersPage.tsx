import React, { useEffect, useMemo, useState } from "react";
import { MetaTags } from "@/app/seo/MetaTags";
import Select from "@/shared/ui/Select";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { AdminShell } from "@/admin/_ui/AdminShell";
import { adminGetOrders, adminUpdateOrderStatus, OrderDTO } from "@/admin/api/admin.api";
import { useSocket } from "@/app/providers/SocketProvider";

const STATUSES = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"] as const;

export default function OrdersPage() {
  const { socket } = useSocket();

  const [items, setItems] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [savingId, setSavingId] = useState<string>("");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await adminGetOrders();
      setItems(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // ✅ WS: якщо бек емiтить події — оновлюємо список (назви евентів можна підправити)
  useEffect(() => {
    if (!socket) return;

    const handler = (payload: any) => {
      const order = payload?.order || payload;
      if (!order?._id) return;
      setItems((prev) => {
        const i = prev.findIndex((x) => x._id === order._id);
        if (i === -1) return [order, ...prev];
        const copy = [...prev];
        copy[i] = { ...copy[i], ...order };
        return copy;
      });
    };

    socket.on("order:updated", handler);
    socket.on("orders:updated", handler);
    socket.on("orderStatusUpdated", handler);

    return () => {
      socket.off("order:updated", handler);
      socket.off("orders:updated", handler);
      socket.off("orderStatusUpdated", handler);
    };
  }, [socket]);

  async function onChangeStatus(id: string, status: string) {
    setSavingId(id);
    try {
      await adminUpdateOrderStatus(id, status);
      // оптимістично або перезавантажити
      setItems((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } finally {
      setSavingId("");
    }
  }

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;

    return items.filter((o) => {
      const id = o._id?.toLowerCase() || "";
      const email =
        (typeof o.user === "string" ? o.user : o.user?.email || "").toLowerCase();
      const status = (o.status || "").toLowerCase();
      return id.includes(query) || email.includes(query) || status.includes(query);
    });
  }, [items, q]);

  return (
    <>
      <MetaTags title="Admin — Orders" />
      <AdminShell
        title="Orders"
        subtitle="GET /api/orders (admin all) + PUT /api/orders/:id { status }"
        right={<Button variant="outline" onClick={load}>Refresh</Button>}
      >
        <div className="flex flex-col md:flex-row gap-3 md:items-end mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search by order id / user email / status…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="text-sm text-neutral-400">
            Count: <span className="text-white font-semibold">{filtered.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="text-neutral-400">Завантаження…</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-neutral-400">
                <tr className="border-b border-neutral-800">
                  <th className="text-left py-3">Order</th>
                  <th className="text-left py-3">User</th>
                  <th className="text-left py-3">Total / Items</th>
                  <th className="text-left py-3">Payment</th>
                  <th className="text-left py-3">Status</th>
                  <th className="text-right py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const userEmail =
                    typeof o.user === "string" ? o.user : o.user?.email || "—";
                  const total = o.total ?? 0;
                  const count = o.items?.reduce((s, it) => s + (it.quantity || 0), 0) || 0;

                  return (
                    <tr key={o._id} className="border-b border-neutral-900">
                      <td className="py-3 text-white font-medium">
                        <div className="flex flex-col">
                          <span>#{o._id.slice(-6)}</span>
                          <span className="text-xs text-neutral-500">{o._id}</span>
                        </div>
                      </td>
                      <td className="py-3 text-neutral-200">{userEmail}</td>
                      <td className="py-3 text-neutral-200">
                        {total} ₴ <span className="text-neutral-500">· {count} items</span>
                      </td>
                      <td className="py-3 text-neutral-200">{o.paymentMethod || "—"}</td>
                      <td className="py-3">
                        <Select
                          value={o.status || "pending"}
                          disabled={savingId === o._id}
                          onChange={(e) => onChangeStatus(o._id, e.target.value)}
                          aria-label="Order status"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => navigator.clipboard.writeText(o._id)}
                          >
                            Copy ID
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-6 text-neutral-400">
                      Немає замовлень.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </>
  );
}