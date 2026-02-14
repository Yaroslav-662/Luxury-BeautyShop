// src/features/dashboard/pages/DashboardPage.tsx

import React, { useEffect } from "react";
import { DashboardStats } from "../ui/DashboardStats";
import { AnalyticsChart } from "../ui/AnalyticsChart";
import { useDashboardStats } from "../hooks/useDashboardStats";

export const DashboardPage: React.FC = () => {
  const { fetchStats } = useDashboardStats();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="p-6 text-white space-y-8">
      <h1 className="text-3xl font-bold">Адмін Панель</h1>

      <DashboardStats />

      <div className="mt-8">
        <AnalyticsChart />
      </div>
    </div>
  );
};
