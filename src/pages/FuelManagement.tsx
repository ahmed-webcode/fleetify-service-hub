
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ListFilter, Clock, Calendar, Fuel, ArrowRight, MoreVertical } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FuelManagement() {
  const [view, setView] = useState("requests");
  const { hasPermission } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Can approve fuel requests
  const canApprove = hasPermission("approve_normal_fuel") || hasPermission("approve_special_fuel");
  
  // Sample fuel requests data
  const fuelRequests = [
    { id: "FR001", vehicle: "Toyota Land Cruiser (AAU-3201)", requestedBy: "John Doe", amount: 35, date: "2023-06-15", status: "pending" },
    { id: "FR002", vehicle: "Nissan Patrol (AAU-1450)", requestedBy: "Jane Smith", amount: 42, date: "2023-06-14", status: "approved" },
    { id: "FR003", vehicle: "Toyota Hilux (AAU-8742)", requestedBy: "Alex Johnson", amount: 28, date: "2023-06-13", status: "completed" },
    { id: "FR004", vehicle: "Toyota Corolla (AAU-5214)", requestedBy: "Sarah Brown", amount: 18, date: "2023-06-12", status: "rejected" },
  ];

  // Sample fuel consumption data
  const fuelConsumption = [
    { id: "FC001", vehicle: "Toyota Land Cruiser (AAU-3201)", driver: "John Doe", amount: 35, date: "2023-06-10", mileage: 58245 },
    { id: "FC002", vehicle: "Nissan Patrol (AAU-1450)", driver: "Jane Smith", amount: 42, date: "2023-06-08", mileage: 37129 },
    { id: "FC003", vehicle: "Toyota Hilux (AAU-8742)", driver: "Alex Johnson", amount: 28, date: "2023-06-05", mileage: 124756 },
    { id: "FC004", vehicle: "Toyota Corolla (AAU-5214)", driver: "Sarah Brown", amount: 18, date: "2023-06-01", mileage: 95874 },
  ];

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Fuel Management</h1>
          <p className="page-description">Manage fuel requests and consumption records</p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <CardTitle>Fuel Overview</CardTitle>
                <CardDescription>Summary of fuel usage and requests</CardDescription>
              </div>
              
              <ServiceRequestForm 
                defaultServiceType="fuel"
                isDialog={true}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
              />

              {hasPermission("request_fuel") && (
                <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
                  <Fuel className="h-4 w-4" />
                  New Fuel Request
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Consumption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">2,450 L</div>
                    <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                      <ArrowRight className="h-4 w-4" />
                      <span>View Details</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                      <ArrowRight className="h-4 w-4" />
                      <span>Review</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average per Vehicle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">85 L</div>
                    <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                      <ArrowRight className="h-4 w-4" />
                      <span>Analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-0">
            <Tabs defaultValue="requests" value={view} onValueChange={setView}>
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="requests" className="gap-2">
                    <Clock className="h-4 w-4" />
                    Fuel Requests
                  </TabsTrigger>
                  <TabsTrigger value="consumption" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Consumption History
                  </TabsTrigger>
                </TabsList>
              </div>
            
              <div className="mt-6">
                <div className="flex justify-end mb-4">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ListFilter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                <TabsContent value="requests" className="mt-0">
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full responsive-table">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                          <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Requested By</th>
                          <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Amount (L)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {fuelRequests.map((request) => (
                          <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">{request.id}</td>
                            <td className="py-3 px-4">{request.vehicle}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{request.requestedBy}</td>
                            <td className="py-3 px-4 hidden lg:table-cell">{request.date}</td>
                            <td className="py-3 px-4">{request.amount}</td>
                            <td className="py-3 px-4">
                              <span className={`status-badge ${
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
                            <td className="py-2 px-4 text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  {canApprove && request.status === "pending" && (
                                    <>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="text-green-600">
                                        Approve Request
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        Reject Request
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="consumption" className="mt-0">
                  <div className="rounded-lg border overflow-hidden">
                    <table className="w-full responsive-table">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left py-3 px-4 text-sm font-medium">Record ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                          <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Driver</th>
                          <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Amount (L)</th>
                          <th className="text-left py-3 px-4 text-sm font-medium">Mileage (km)</th>
                          <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {fuelConsumption.map((record) => (
                          <tr key={record.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4">{record.id}</td>
                            <td className="py-3 px-4">{record.vehicle}</td>
                            <td className="py-3 px-4 hidden md:table-cell">{record.driver}</td>
                            <td className="py-3 px-4 hidden lg:table-cell">{record.date}</td>
                            <td className="py-3 px-4">{record.amount}</td>
                            <td className="py-3 px-4">{record.mileage.toLocaleString()}</td>
                            <td className="py-2 px-4 text-right">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
        </Card>
      </div>
    </PageLayout>
  );
}
