
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, BarChart2, Fuel } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelRecordForm } from "@/components/fuel/FuelRecordForm";

export default function FuelManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState("records");
  
  // Mock fuel record data
  const fuelRecords = [
    {
      id: "FR-1238",
      vehicleName: "Toyota Land Cruiser",
      licensePlate: "AAU-3201",
      date: "2025-03-13",
      liters: 45.2,
      cost: 113.00,
      fuelType: "Diesel"
    },
    {
      id: "FR-1237",
      vehicleName: "Nissan Patrol",
      licensePlate: "AAU-1450",
      date: "2025-03-12",
      liters: 42.5,
      cost: 106.25,
      fuelType: "Diesel"
    },
    {
      id: "FR-1236",
      vehicleName: "Toyota Corolla",
      licensePlate: "AAU-5214",
      date: "2025-03-10",
      liters: 35.0,
      cost: 87.50,
      fuelType: "Gasoline"
    },
    {
      id: "FR-1235",
      vehicleName: "Hyundai H-1",
      licensePlate: "AAU-6390",
      date: "2025-03-08",
      liters: 50.5,
      cost: 126.25,
      fuelType: "Diesel"
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Fuel Management</h1>
          <p className="text-muted-foreground">Track and manage fuel consumption across your fleet</p>
        </div>
        
        <Button className="gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Fuel Record
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel This Month</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">173.2L</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost Per Liter</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.50</div>
            <p className="text-xs text-muted-foreground">-0.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost This Month</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$433.00</div>
            <p className="text-xs text-muted-foreground">+3.1% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs 
        defaultValue="records" 
        value={view} 
        onValueChange={setView}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="records">Fuel Records</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="approvals">Approval Requests</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <TabsContent value="records" className="animate-fade-in">
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium">Record ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                  <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Cost</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fuelRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{record.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p>{record.vehicleName}</p>
                        <p className="text-xs text-muted-foreground">{record.licensePlate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      {record.liters.toFixed(1)}L <span className="text-xs text-muted-foreground">({record.fuelType})</span>
                    </td>
                    <td className="py-3 px-4">
                      ${record.cost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Consumption Analytics</CardTitle>
              <CardDescription>Coming soon: Detailed analytics and consumption trends</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">Analytics charts will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approvals" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Fuel Request Approvals</CardTitle>
              <CardDescription>Manage fuel request approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">No pending fuel approval requests</p>
              <Button variant="outline">View Approval History</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FuelRecordForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
