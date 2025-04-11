
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ListFilter, Clock } from "lucide-react";

const ServiceRequests = () => {
  const [view, setView] = useState("new");
  const location = useLocation();
  
  // Set the default service type based on URL
  const getServiceTypeFromUrl = () => {
    if (location.pathname.includes("/fleet")) return "fleet";
    if (location.pathname.includes("/fuel")) return "fuel";
    if (location.pathname.includes("/maintenance")) return "maintenance";
    return "fleet"; // Default
  };
  
  // Pass selected service type to the form
  const [selectedServiceType, setSelectedServiceType] = useState(getServiceTypeFromUrl());
  
  useEffect(() => {
    // Update service type when route changes
    setSelectedServiceType(getServiceTypeFromUrl());
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="service-container page-container">
        <div className="page-title-container">
          <h1 className="page-title">Service Requests</h1>
          <p className="page-description">Submit and manage service requests for your fleet</p>
        </div>
        
        <div className="card-uniform section-spacing">
          <Tabs 
            defaultValue="new" 
            value={view} 
            onValueChange={setView}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="new" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Request
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Request History
                </TabsTrigger>
              </TabsList>
              
              {view === "history" && (
                <Button variant="outline" size="sm" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  Filter
                </Button>
              )}
            </div>
            
            <TabsContent value="new" className="animate-fade-in">
              <ServiceRequestForm defaultServiceType={selectedServiceType} />
            </TabsContent>
            
            <TabsContent value="history" className="animate-fade-in">
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full responsive-table">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { id: 'SR-2310', type: 'Fleet', vehicle: 'Toyota Land Cruiser (AAU-3201)', date: '2023-06-18', status: 'pending' },
                      { id: 'SR-2309', type: 'Maintenance', vehicle: 'Nissan Patrol (AAU-1450)', date: '2023-06-17', status: 'approved' },
                      { id: 'SR-2308', type: 'Fuel', vehicle: 'Toyota Hilux (AAU-8742)', date: '2023-06-15', status: 'completed' },
                      { id: 'SR-2307', type: 'Fleet', vehicle: 'Toyota Corolla (AAU-5214)', date: '2023-06-14', status: 'rejected' },
                      { id: 'SR-2306', type: 'Maintenance', vehicle: 'Hyundai H-1 (AAU-6390)', date: '2023-06-13', status: 'completed' },
                      { id: 'SR-2305', type: 'Fuel', vehicle: 'Mitsubishi L200 (AAU-7195)', date: '2023-06-12', status: 'completed' },
                    ].map((request) => (
                      <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">
                          {request.id}
                        </td>
                        <td className="py-3 px-4">
                          {request.type}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          {request.vehicle}
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          {request.date}
                        </td>
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
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm">Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ServiceRequests;
