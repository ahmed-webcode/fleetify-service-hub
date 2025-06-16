
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TripRequest = {
  id: string;
  requestedAt: string;
  status?: string;
};

interface TripRequestsChartProps {
  tripRequests: TripRequest[];
}

function groupByMonth(requests: TripRequest[]) {
  // Group trips by year and month, get monthly counts
  const counts: Record<string, number> = {};
  requests.forEach(req => {
    const date = new Date(req.requestedAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // e.g. "2024-06"
    counts[key] = (counts[key] || 0) + 1;
  });
  // Map to array with month labels
  return Object.entries(counts)
    .map(([key, count]) => ({
      month: key,
      count,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function TripRequestsChart({ tripRequests }: TripRequestsChartProps) {
  const data = groupByMonth(tripRequests);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Trip Requests: Monthly Trend</CardTitle>
        <CardDescription>Number of trip requests created per month</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" name="Trip Requests" stroke="#3b82f6" strokeWidth={2} dot />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
