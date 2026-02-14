// src/features/dashboard/ui/DashboardStats.tsx

import React from "react";
import { useDashboardStats } from "../hooks/useDashboardStats";

export const DashboardStats: React.FC = () => {
  const { stats, loading } = useDashboardStats();

  if (loading || !stats)
    return <p className="text-neutral-400">Завантаження статистики...</p>;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Box label="Користувачі" value={stats.totalUsers} />
      <Box label="Замовлення" value={stats.totalOrders} />
      <Box label="Товари" value={stats.totalProducts} />
      <Box label="Дохід" value={`${stats.income} ₴`} />
    </div>
  );
};

const Box = ({ label, value }: any) => (
  <div className="p-6 bg-neutral-800 rounded-xl text-center shadow-md">
    <p className="text-neutral-400 text-sm">{label}</p>
    <p className="text-3xl font-bold text-white mt-2">{value}</p>
  </div>
);
