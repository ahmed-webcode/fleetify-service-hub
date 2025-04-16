
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', diesel: 480, petrol: 350, specialFuel: 120 },
  { month: 'Feb', diesel: 520, petrol: 380, specialFuel: 145 },
  { month: 'Mar', diesel: 450, petrol: 320, specialFuel: 130 },
  { month: 'Apr', diesel: 510, petrol: 390, specialFuel: 160 },
  { month: 'May', diesel: 530, petrol: 410, specialFuel: 180 },
  { month: 'Jun', diesel: 490, petrol: 370, specialFuel: 150 },
];

export function FuelConsumptionChart() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Fuel Consumption</CardTitle>
        <CardDescription>Monthly fuel consumption by fuel type (liters)</CardDescription>
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
                formatter={(value) => [`${value} L`, '']}
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Bar dataKey="diesel" fill="#3b82f6" name="Diesel" />
              <Bar dataKey="petrol" fill="#f59e0b" name="Petrol" />
              <Bar dataKey="specialFuel" fill="#8b5cf6" name="Special Fuel" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
