// src/shared/charts/BarChart.tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import type { ChartDataItem } from "./types.ts";

interface Props {
  data: ChartDataItem[];
}

export default function BarChartComponent({ data }: Props) {
  return (
    <BarChart width={500} height={250} data={data}>
      <XAxis dataKey="name" stroke="#aaa" />
      <YAxis stroke="#aaa" />
      <Tooltip />
      <Bar dataKey="value" fill="#facc15" />
    </BarChart>
  );
}
