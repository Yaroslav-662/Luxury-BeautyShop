import { create } from "zustand";
import type { Order } from "@/features/orders/model/order.types";
import { OrdersApi } from "@/features/orders/api/orders.api";

type OrdersState = {
  items: Order[];
  loading: boolean;
  error: string | null;

  fetchOrders: () => Promise<void>;

  // ✅ прямі (realtime) апдейти
  addOrderDirect: (order: Order) => void;
  updateOrderDirect: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
};

export const useOrders = create<OrdersState>((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const data = await OrdersApi.getOrders();
      set({ items: data, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err?.response?.data?.message || "Не вдалося завантажити замовлення" });
    }
  },

  addOrderDirect: (order) => {
    set({ items: [order, ...get().items] });
  },

  updateOrderDirect: (order) => {
    set({ items: get().items.map((o) => (o._id === order._id ? order : o)) });
  },

  updateOrderStatus: (orderId, status) => {
    set({
      items: get().items.map((o) =>
        o._id === orderId ? { ...o, status } : o
      ),
    });
  },
}));

