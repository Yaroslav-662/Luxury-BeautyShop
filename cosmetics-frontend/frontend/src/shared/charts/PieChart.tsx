// src/shared/charts/PieChart.tsx
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import type { ChartDataItem } from "./types";

const COLORS = ["#facc15", "#fbbf24", "#f59e0b"];

interface Props {
  data: ChartDataItem[];
}

export default function PieChartComponent({ data }: Props) {
  return (
    <PieChart width={300} height={300}>
      <Pie
        data={data}
        dataKey="value"
        cx={150}
        cy={150}
        outerRadius={100}
        label
      >
        {data.map((_, i) => (
          <Cell key={i} fill={COLORS[i % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
