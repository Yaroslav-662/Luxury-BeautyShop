// src/features/orders/api/orders.api.ts
import { api } from "@/core/api/axios";
import type { Order, OrderStatus } from "@/features/orders/model/order.types";

export const OrdersApi = {
  async getOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>("/api/orders");
    return data;
  },

  async createOrder(payload: {
    items: { product: string; quantity: number }[];
    address: string;
    paymentMethod: string;
  }): Promise<{ message?: string; order?: Order }> {
    const { data } = await api.post("/api/orders", payload);
    return data;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<{ message?: string; order?: Order }> {
    const { data } = await api.put(`/api/orders/${orderId}`, { status });
    return data;
  },
};
