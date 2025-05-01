
import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

interface InsuranceStatusChartProps {
  active: number;
  expired: number;
}

const COLORS = ["#4ade80", "#f87171"];

export function InsuranceStatusChart({ active, expired }: InsuranceStatusChartProps) {
  const data = [
    { name: "Active Insurance", value: active },
    { name: "Expired Insurance", value: expired },
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
