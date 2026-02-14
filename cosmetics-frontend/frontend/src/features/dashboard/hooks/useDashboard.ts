// src/features/dashboard/hooks/useDashboard.ts

import { create } from "zustand";

interface DashboardState {
  dateRange: "day" | "week" | "month";
  setRange: (r: DashboardState["dateRange"]) => void;
}

export const useDashboard = create<DashboardState>((set) => ({
  dateRange: "week",
  setRange: (r) => set({ dateRange: r }),
}));
