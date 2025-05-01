
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface MaintenanceCostChartProps {
  labor: number;
  parts: number;
  outsource: number;
}

const COLORS = ["#a78bfa", "#60a5fa", "#f97316"];

export function MaintenanceCostChart({ labor, parts, outsource }: MaintenanceCostChartProps) {
  const data = [
    { name: "Labor Costs", value: labor },
    { name: "Parts Costs", value: parts },
    { name: "Outsource Costs", value: outsource },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ETB`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
