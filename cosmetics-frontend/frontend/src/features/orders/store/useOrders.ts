// src/features/orders/store/useOrders.ts
import { create } from "zustand";
import type { Order, OrderStatus } from "@/features/orders/model/order.types";
import { OrdersApi } from "@/features/orders/api/orders.api";

type OrdersState = {
  orders: Order[];
  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;

  // realtime
  setOrders: (orders: Order[]) => void;
  updateStatusRealtime: (orderId: string, status: OrderStatus) => void;
};

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const orders = await OrdersApi.getOrders();

      const normalized = orders.map((o) => ({
        ...o,
        total: typeof o.total === "number" ? o.total : 0, // щоб не валилось по типах/рендеру
        items: Array.isArray(o.items) ? o.items : [],
      }));

      set({ orders: normalized, loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || "Не вдалося завантажити замовлення",
      });
    }
  },

  setOrders: (orders) => set({ orders }),

  updateStatusRealtime: (orderId, status) => {
    const updated = get().orders.map((o) => (o._id === orderId ? { ...o, status } : o));
    set({ orders: updated });
  },
}));
