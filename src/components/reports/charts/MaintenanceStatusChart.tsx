
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface MaintenanceStatusChartProps {
  completed: number;
  pending: number;
  total: number;
}

const COLORS = ["#4ade80", "#fbbf24", "#94a3b8"];

export function MaintenanceStatusChart({ completed, pending, total }: MaintenanceStatusChartProps) {
  const inProgress = total - (completed + pending);
  
  const data = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress > 0 ? inProgress : 0 },
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
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value} requests`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
