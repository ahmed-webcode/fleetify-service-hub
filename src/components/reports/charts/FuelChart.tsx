
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FuelChartProps {
  data: Array<{
    id: string;
    vehicle: string;
    totalFuel: number;
    totalKm: number;
  }>;
}

export function FuelChart({ data }: FuelChartProps) {
  const chartData = data.map(item => ({
    name: item.vehicle.split(' ')[0] + ' ' + item.vehicle.split(' ')[1], // Shortened name
    fuel: item.totalFuel,
    km: item.totalKm
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 65, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip formatter={(value) => `${Number(value).toLocaleString()}`} />
        <Bar dataKey="fuel" name="Fuel (Liters)" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}
