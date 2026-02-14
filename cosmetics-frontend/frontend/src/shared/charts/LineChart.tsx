// src/shared/charts/LineChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { ChartDataItem } from "./types";

interface Props {
  data: ChartDataItem[];
}

export default function LineChartComponent({ data }: Props) {
  return (
    <LineChart width={500} height={250} data={data}>
      <CartesianGrid stroke="#333" />
      <XAxis dataKey="name" stroke="#aaa" />
      <YAxis stroke="#aaa" />
      <Tooltip />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#facc15"
        strokeWidth={3}
      />
    </LineChart>
  );
}
