
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, ListFilter, Clock, CheckCircle, XCircle, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type ServiceType = "fleet" | "fuel" | "maintenance";
type RequestStatus = "pending" | "approved" | "rejected" | "completed";

interface ServiceRequest {
  id: string;
  type: string;
  vehicle: string;
  date: string;
  status: RequestStatus;
  details?: string;
  requestedBy?: string;
}

const ServiceRequests = () => {
  const [view, setView] = useState("new");
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  
  const getServiceTypeFromUrl = (): ServiceType => {
    if (location.pathname.includes("/fleet")) return "fleet";
    if (location.pathname.includes("/fuel")) return "fuel";
    if (location.pathname.includes("/maintenance")) return "maintenance";
    return "fleet"; // Default
  };
  
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([
    { id: 'SR-2310', type: 'Fleet', vehicle: 'Toyota Land Cruiser (AAU-3201)', date: '2023-06-18', status: 'pending', requestedBy: 'John Doe' },
    { id: 'SR-2309', type: 'Maintenance', vehicle: 'Nissan Patrol (AAU-1450)', date: '2023-06-17', status: 'approved', details: 'Engine oil change and filter replacement', requestedBy: 'Mary Johnson' },
    { id: 'SR-2308', type: 'Fuel', vehicle: 'Toyota Hilux (AAU-8742)', date: '2023-06-15', status: 'completed', requestedBy: 'James Smith' },
    { id: 'SR-2307', type: 'Fleet', vehicle: 'Toyota Corolla (AAU-5214)', date: '2023-06-14', status: 'rejected', requestedBy: 'Sarah Williams' },
    { id: 'SR-2306', type: 'Maintenance', vehicle: 'Hyundai H-1 (AAU-6390)', date: '2023-06-13', status: 'pending', details: 'Brake system check and maintenance', requestedBy: 'Robert Brown' },
    { id: 'SR-2305', type: 'Fuel', vehicle: 'Mitsubishi L200 (AAU-7195)', date: '2023-06-12', status: 'completed', requestedBy: 'Elizabeth Davis' },
    { id: 'SR-2304', type: 'Maintenance', vehicle: 'Toyota Land Cruiser (AAU-3555)', date: '2023-06-11', status: 'pending', details: 'Suspension system repair', requestedBy: 'Michael Wilson' },
    { id: 'SR-2303', type: 'Maintenance', vehicle: 'Toyota Hilux (AAU-4298)', date: '2023-06-10', status: 'pending', details: 'Air conditioning system repair', requestedBy: 'Jennifer Taylor' },
  ]);
  
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>(getServiceTypeFromUrl());
  
  useEffect(() => {
    setSelectedServiceType(getServiceTypeFromUrl());
  }, [location.pathname]);

  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    setServiceRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus } 
          : request
      )
    );
    
    toast.success(`Request ${newStatus === 'approved' ? 'approved' : 'rejected'} successfully`);
  };

  const handleRequestSubmit = () => {
    toast.success("Service request submitted successfully");
    setView("history");
  };

  // Filter requests based on user role
  const filteredRequests = serviceRequests.filter(request => {
    if (user?.role === 'mtl') {
      // MTL only sees maintenance requests
      return request.type === 'Maintenance';
    }
    return true;
  });

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Service Requests</h1>
          <p className="page-description">
            {user?.role === 'mtl' 
              ? 'Manage and approve maintenance requests' 
              : 'Submit and manage service requests for your fleet'}
          </p>
        </div>
        
        <div className="card-uniform">
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
                {user?.role === 'mtl' && (
                  <TabsTrigger value="pending" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Pending Approvals
                  </TabsTrigger>
                )}
              </TabsList>
              
              {view === "history" && (
                <Button variant="outline" size="sm" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  Filter
                </Button>
              )}
            </div>
            
            <TabsContent value="new" className="animate-fade-in">
              <ServiceRequestForm 
                defaultServiceType={selectedServiceType} 
                onSubmitSuccess={handleRequestSubmit}
              />
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
                    {filteredRequests.map((request) => (
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
            
            {user?.role === 'mtl' && (
              <TabsContent value="pending" className="animate-fade-in">
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full responsive-table">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Vehicle</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Requested By</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Details</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRequests
                        .filter(request => request.status === 'pending')
                        .map((request) => (
                          <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">
                              {request.id}
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              {request.vehicle}
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              {request.date}
                            </td>
                            <td className="py-3 px-4">
                              {request.requestedBy || 'Unknown'}
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className="line-clamp-1">{request.details || 'No details provided'}</span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleStatusChange(request.id, 'approved')}
                                  className="text-green-600 hover:text-green-700 gap-1"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  onClick={() => handleStatusChange(request.id, 'rejected')}
                                  className="text-red-600 hover:text-red-700 gap-1"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {filteredRequests.filter(request => request.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-2 opacity-20" />
                      <p>No pending maintenance requests</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ServiceRequests;
