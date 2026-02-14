// src/features/dashboard/ui/AnalyticsChart.tsx

import React from "react";
import { Line } from "react-chartjs-2";

export const AnalyticsChart: React.FC = () => {
  const data = {
    labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"],
    datasets: [
      {
        label: "Замовлення за тиждень",
        data: [4, 6, 5, 9, 12, 7, 3],
        borderColor: "rgb(255, 193, 7)",
        backgroundColor: "rgba(255, 193, 7, 0.2)",
      },
    ],
  };

  return (
    <div className="bg-neutral-800 rounded-xl p-6 shadow-lg">
      <Line data={data} />
    </div>
  );
};
