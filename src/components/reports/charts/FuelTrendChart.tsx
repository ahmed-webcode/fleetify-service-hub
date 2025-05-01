
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Mock data for fuel trend
const data = [
  { month: "Jan", consumption: 560 },
  { month: "Feb", consumption: 620 },
  { month: "Mar", consumption: 590 },
  { month: "Apr", consumption: 670 },
  { month: "May", consumption: 700 },
  { month: "Jun", consumption: 610 },
];

export function FuelTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value) => `${Number(value).toLocaleString()} L`} />
        <Line 
          type="monotone" 
          dataKey="consumption" 
          name="Fuel Consumption (L)"
          stroke="#8884d8" 
          strokeWidth={2} 
          dot={{ r: 4 }} 
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
