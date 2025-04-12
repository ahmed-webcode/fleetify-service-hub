
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Fuel, Plus, Calendar, FileText, Check, Clock } from "lucide-react";
import { FuelRecordForm } from "@/components/fuel/FuelRecordForm";
import { FuelServiceRequestDialog } from "@/components/fuel/FuelServiceRequestDialog";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";

const fuelRequests = [
  {
    id: "FR-2023",
    vehicle: "Toyota Land Cruiser (AAU-3201)",
    requestDate: "2025-03-14",
    amount: "45",
    fuelType: "Diesel",
    status: "pending",
    requestedBy: "Dr. Abebe Kebede"
  },
  {
    id: "FR-2022",
    vehicle: "Nissan Patrol (AAU-1450)",
    requestDate: "2025-03-13",
    amount: "35",
    fuelType: "Gasoline",
    status: "approved",
    requestedBy: "Dr. Tigist Haile"
  },
  {
    id: "FR-2021",
    vehicle: "Toyota Hilux (AAU-8742)",
    requestDate: "2025-03-12",
    amount: "30",
    fuelType: "Diesel",
    status: "completed",
    requestedBy: "Dr. Samuel Gebre"
  },
  {
    id: "FR-2020",
    vehicle: "Toyota Corolla (AAU-5214)",
    requestDate: "2025-03-10",
    amount: "25",
    fuelType: "Gasoline",
    status: "rejected",
    requestedBy: "Dr. Hiwot Tesfaye"
  }
];

const fuelRecords = [
  {
    id: "FT-4532",
    vehicle: "Toyota Land Cruiser (AAU-3201)",
    date: "2025-03-13",
    amount: "42.5",
    fuelType: "Diesel",
    totalCost: "127.50",
    odometer: "45,230"
  },
  {
    id: "FT-4531",
    vehicle: "Nissan Patrol (AAU-1450)",
    date: "2025-03-12",
    amount: "38.2",
    fuelType: "Gasoline",
    totalCost: "114.60",
    odometer: "28,450"
  },
  {
    id: "FT-4530",
    vehicle: "Toyota Hilux (AAU-8742)",
    date: "2025-03-10",
    amount: "35.0",
    fuelType: "Diesel",
    totalCost: "105.00",
    odometer: "32,680"
  },
  {
    id: "FT-4529",
    vehicle: "Toyota Corolla (AAU-5214)",
    date: "2025-03-08",
    amount: "28.5",
    fuelType: "Gasoline",
    totalCost: "85.50",
    odometer: "15,780"
  }
];

export default function FuelManagement() {
  const [activeTab, setActiveTab] = useState("requests");
  const [isFuelRecordFormOpen, setIsFuelRecordFormOpen] = useState(false);
  const [isFuelRequestFormOpen, setIsFuelRequestFormOpen] = useState(false);
  const [requestsView, setRequestsView] = useState("all");
  
  const { hasPermission } = useAuth();
  const canRequestFuel = hasPermission("request_fuel");
  const canApprove = hasPermission("approve_normal_fuel") || hasPermission("approve_special_fuel");
  
  const filteredRequests = fuelRequests.filter(request => {
    if (requestsView === "all") return true;
    return request.status === requestsView;
  });
  
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Fuel Management</h1>
            <p className="text-muted-foreground">Track fuel consumption and manage fuel requests</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {canRequestFuel && (
              <Button 
                onClick={() => setIsFuelRequestFormOpen(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                New Fuel Request
              </Button>
            )}
            
            <Button 
              onClick={() => setIsFuelRecordFormOpen(true)}
              className="gap-2 bg-gray-600 hover:bg-gray-700 text-white w-full sm:w-auto"
            >
              <Fuel className="h-4 w-4" />
              Add Fuel Record
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Fuel Consumption</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              345.8 <span className="text-base text-muted-foreground font-normal">Liters</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Fuel Expenses</CardTitle>
              <CardDescription>Last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              $1,037.40
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pending Requests</CardTitle>
              <CardDescription>Awaiting approval</CardDescription>
            </CardHeader>
            <CardContent className="text-3xl font-bold">
              12
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="requests" className="px-4">
                <FileText className="w-4 h-4 mr-2" />
                Fuel Requests
              </TabsTrigger>
              <TabsTrigger value="records" className="px-4">
                <Calendar className="w-4 h-4 mr-2" />
                Fuel Records
              </TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
          
          <TabsContent value="requests" className="space-y-4">
            {activeTab === "requests" && (
              <div>
                <div className="flex overflow-x-auto pb-2 mb-4">
                  <Button
                    variant={requestsView === "all" ? "default" : "ghost"}
                    size="sm"
                    className="mr-2 whitespace-nowrap"
                    onClick={() => setRequestsView("all")}
                  >
                    All Requests
                  </Button>
                  <Button
                    variant={requestsView === "pending" ? "default" : "ghost"}
                    size="sm"
                    className="mr-2 whitespace-nowrap"
                    onClick={() => setRequestsView("pending")}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Pending
                  </Button>
                  <Button
                    variant={requestsView === "approved" ? "default" : "ghost"}
                    size="sm"
                    className="mr-2 whitespace-nowrap"
                    onClick={() => setRequestsView("approved")}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approved
                  </Button>
                  <Button
                    variant={requestsView === "completed" ? "default" : "ghost"}
                    size="sm"
                    className="mr-2 whitespace-nowrap"
                    onClick={() => setRequestsView("completed")}
                  >
                    Completed
                  </Button>
                  <Button
                    variant={requestsView === "rejected" ? "default" : "ghost"}
                    size="sm"
                    className="whitespace-nowrap"
                    onClick={() => setRequestsView("rejected")}
                  >
                    Rejected
                  </Button>
                </div>
                
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                          <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">{request.id}</td>
                            <td className="py-3 px-4">{request.vehicle}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{request.requestDate}</td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              {request.amount} L ({request.fuelType})
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                request.status === 'completed' 
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : request.status === 'approved'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                  : request.status === 'pending'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Details</Button>
                                {canApprove && request.status === "pending" && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hidden sm:inline-flex"
                                  >
                                    Approve
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" className="sm:hidden">
                                  ...
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="records" className="space-y-4">
            {activeTab === "records" && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">Transaction ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Odometer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Amount</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {fuelRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-medium">{record.id}</td>
                          <td className="py-3 px-4">{record.vehicle}</td>
                          <td className="py-3 px-4 hidden md:table-cell">{record.date}</td>
                          <td className="py-3 px-4 hidden md:table-cell">{record.odometer} km</td>
                          <td className="py-3 px-4 hidden lg:table-cell">
                            {record.amount} L ({record.fuelType})
                          </td>
                          <td className="py-3 px-4 text-right">${record.totalCost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <FuelRecordForm 
          isOpen={isFuelRecordFormOpen} 
          onClose={() => setIsFuelRecordFormOpen(false)} 
        />
        
        <FuelServiceRequestDialog
          isOpen={isFuelRequestFormOpen}
          onClose={() => setIsFuelRequestFormOpen(false)}
        />
      </div>
    </PageLayout>
  );
}
