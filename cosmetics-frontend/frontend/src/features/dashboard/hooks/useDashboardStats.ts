// src/features/dashboard/hooks/useDashboardStats.ts

import { create } from "zustand";
import { api } from "@/core/api/axios";

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  income: number;
}

interface DashboardStatsState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;

  fetchStats: () => Promise<void>;
}

export const useDashboardStats = create<DashboardStatsState>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const [usersRes, ordersRes, productsRes] = await Promise.all([
        api.get("/api/users"),
        api.get("/api/orders"),
        api.get("/api/products"),
      ]);

      const orders = ordersRes.data || [];
      const income = orders.reduce(
        (sum: number, o: any) => sum + (o.total || 0),
        0
      );

      set({
        stats: {
          totalUsers: usersRes.data.length,
          totalOrders: orders.length,
          totalProducts: productsRes.data.length,
          income,
        },
        loading: false,
      });
    } catch (err: any) {
      set({
        error: "Не вдалося завантажити статистику.",
        loading: false,
      });
    }
  },
}));
