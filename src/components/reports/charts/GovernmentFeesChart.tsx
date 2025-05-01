
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface GovernmentFeesChartProps {
  paid: number;
  outstanding: number;
}

const COLORS = ["#4ade80", "#fbbf24"];

export function GovernmentFeesChart({ paid, outstanding }: GovernmentFeesChartProps) {
  const data = [
    { name: "Paid Fees", value: paid },
    { name: "Outstanding Fees", value: outstanding },
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
        <Tooltip formatter={(value) => `${value} vehicles`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
