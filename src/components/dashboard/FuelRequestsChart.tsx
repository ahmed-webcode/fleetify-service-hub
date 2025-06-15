
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type FuelRequest = {
  id: string;
  createdAt: string;
  status?: string;
};

interface FuelRequestsChartProps {
  fuelRequests: FuelRequest[];
}

function groupByMonth(requests: FuelRequest[]) {
  // Group by year-month, count per group
  const counts: Record<string, number> = {};
  requests.forEach(req => {
    const date = new Date(req.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  // Map to array for recharts
  return Object.entries(counts)
    .map(([key, count]) => ({
      month: key,
      count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function FuelRequestsChart({ fuelRequests }: FuelRequestsChartProps) {
  const data = groupByMonth(fuelRequests);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fuel Requests: Monthly Trend</CardTitle>
        <CardDescription>Number of fuel requests created per month</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="Fuel Requests" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
