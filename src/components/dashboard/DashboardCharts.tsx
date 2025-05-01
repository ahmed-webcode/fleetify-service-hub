
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

// Data aligned with reporting module
const fuelConsumptionData = [
  { month: 'Jan', diesel: 420, gasoline: 240, specialFuel: 120 },
  { month: 'Feb', diesel: 380, gasoline: 220, specialFuel: 110 },
  { month: 'Mar', diesel: 450, gasoline: 260, specialFuel: 130 },
  { month: 'Apr', diesel: 420, gasoline: 250, specialFuel: 125 },
  { month: 'May', diesel: 500, gasoline: 290, specialFuel: 140 },
  { month: 'Jun', diesel: 480, gasoline: 270, specialFuel: 135 },
  { month: 'Jul', diesel: 520, gasoline: 300, specialFuel: 150 },
];

const fleetUsageData = [
  { month: 'Jan', trips: 65, distance: 400, activeVehicles: 28, inactiveVehicles: 12 },
  { month: 'Feb', trips: 80, distance: 500, activeVehicles: 30, inactiveVehicles: 10 },
  { month: 'Mar', trips: 78, distance: 480, activeVehicles: 29, inactiveVehicles: 11 },
  { month: 'Apr', trips: 95, distance: 600, activeVehicles: 32, inactiveVehicles: 8 },
  { month: 'May', trips: 85, distance: 550, activeVehicles: 31, inactiveVehicles: 9 },
  { month: 'Jun', trips: 92, distance: 590, activeVehicles: 33, inactiveVehicles: 7 },
  { month: 'Jul', trips: 100, distance: 680, activeVehicles: 35, inactiveVehicles: 5 },
];

const maintenanceData = [
  { name: "Preventive", value: 58 },
  { name: "Corrective", value: 27 },
  { name: "Emergency", value: 15 }
];

const complianceData = [
  { name: "Insurance Active", value: 32 },
  { name: "Insurance Expired", value: 3 },
  { name: "Govt. Fees Paid", value: 30 },
  { name: "Govt. Fees Due", value: 5 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
const COMPLIANCE_COLORS = ['#4ade80', '#f87171', '#60a5fa', '#facc15'];

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
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
              <Bar dataKey="specialFuel" name="Special Fuel" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fleet Usage</CardTitle>
          <CardDescription>Monthly trips and distance metrics</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={fleetUsageData}
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
                name="Trips" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="distance" 
                name="Distance (km)" 
                stroke="#82ca9d" 
                strokeWidth={2}
              />
            </LineChart>
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
          <CardTitle className="text-lg">Compliance Status</CardTitle>
          <CardDescription>Insurance and government fees status</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={complianceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {complianceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COMPLIANCE_COLORS[index % COMPLIANCE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
