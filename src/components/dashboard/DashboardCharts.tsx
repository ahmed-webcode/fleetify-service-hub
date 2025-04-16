
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Sample data for charts
const vehicleUsageData = [
  { month: 'Jan', trips: 65, distance: 400 },
  { month: 'Feb', trips: 80, distance: 500 },
  { month: 'Mar', trips: 78, distance: 480 },
  { month: 'Apr', trips: 95, distance: 600 },
  { month: 'May', trips: 85, distance: 550 },
  { month: 'Jun', trips: 92, distance: 590 },
  { month: 'Jul', trips: 100, distance: 680 },
];

const fuelConsumptionData = [
  { month: 'Jan', diesel: 420, gasoline: 240 },
  { month: 'Feb', diesel: 380, gasoline: 220 },
  { month: 'Mar', diesel: 450, gasoline: 260 },
  { month: 'Apr', diesel: 420, gasoline: 250 },
  { month: 'May', diesel: 500, gasoline: 290 },
  { month: 'Jun', diesel: 480, gasoline: 270 },
  { month: 'Jul', diesel: 520, gasoline: 300 },
];

const maintenanceData = [
  { name: "Preventive", value: 58 },
  { name: "Corrective", value: 27 },
  { name: "Emergency", value: 15 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehicle Usage</CardTitle>
          <CardDescription>Trips and distance per month</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={vehicleUsageData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="trips" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="distance" 
                stroke="#82ca9d" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fuel Consumption</CardTitle>
          <CardDescription>Monthly fuel usage by type (liters)</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={fuelConsumptionData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="diesel" name="Diesel" fill="#8884d8" />
              <Bar dataKey="gasoline" name="Gasoline" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Maintenance Types</CardTitle>
          <CardDescription>Distribution of maintenance requests</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={maintenanceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {maintenanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Service Request Status</CardTitle>
          <CardDescription>Monthly request volume by status</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={[
                { month: 'Jan', completed: 18, pending: 7, rejected: 2 },
                { month: 'Feb', completed: 25, pending: 9, rejected: 3 },
                { month: 'Mar', completed: 22, pending: 12, rejected: 5 },
                { month: 'Apr', completed: 30, pending: 11, rejected: 3 },
                { month: 'May', completed: 27, pending: 14, rejected: 4 },
                { month: 'Jun', completed: 32, pending: 8, rejected: 2 },
                { month: 'Jul', completed: 35, pending: 10, rejected: 1 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#4ade80" />
              <Bar dataKey="pending" name="Pending" stackId="a" fill="#facc15" />
              <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
