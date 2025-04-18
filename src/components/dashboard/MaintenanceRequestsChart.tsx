
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', pending: 8, approved: 12, completed: 10, rejected: 2 },
  { month: 'Feb', pending: 12, approved: 8, completed: 9, rejected: 3 },
  { month: 'Mar', pending: 7, approved: 15, completed: 14, rejected: 1 },
  { month: 'Apr', pending: 9, approved: 11, completed: 8, rejected: 2 },
  { month: 'May', pending: 11, approved: 13, completed: 12, rejected: 4 },
  { month: 'Jun', pending: 10, approved: 9, completed: 7, rejected: 1 },
];

export function MaintenanceRequestsChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Maintenance Requests</CardTitle>
        <CardDescription>Monthly maintenance request status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} requests`, '']}
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              <Bar dataKey="approved" fill="#3b82f6" name="Approved" />
              <Bar dataKey="completed" fill="#10b981" name="Completed" />
              <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
