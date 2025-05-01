import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  ListFilter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  WrenchIcon, 
  UserCircle,
  FileSpreadsheet 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";

type RequestStatus = "pending" | "approved" | "rejected" | "completed";

interface MaintenanceRequest {
  id: string;
  vehicle: string;
  date: string;
  status: RequestStatus;
  details: string;
  requestedBy: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  documentUrls?: string[];
}

const MaintenanceRequests = () => {
  const [view, setView] = useState("new");
  const { user } = useAuth();
  
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([
    { 
      id: 'MR-2310', 
      vehicle: 'Toyota Land Cruiser (AAU-3201)', 
      date: '2023-06-18', 
      status: 'pending', 
      details: 'Engine check and oil change needed',
      requestedBy: 'John Doe',
      priority: 'medium',
      documentUrls: ['maintenance-doc-1.pdf']
    },
    { 
      id: 'MR-2309', 
      vehicle: 'Nissan Patrol (AAU-1450)', 
      date: '2023-06-17', 
      status: 'approved', 
      details: 'Brake system maintenance required',
      requestedBy: 'Mary Johnson',
      priority: 'high',
      estimatedCost: 1200,
      documentUrls: ['maintenance-doc-2.pdf', 'maintenance-doc-3.pdf']
    },
    { 
      id: 'MR-2308', 
      vehicle: 'Toyota Hilux (AAU-8742)', 
      date: '2023-06-15', 
      status: 'completed', 
      details: 'Regular service and tire rotation',
      requestedBy: 'James Smith',
      priority: 'low',
      estimatedCost: 800
    },
    { 
      id: 'MR-2307', 
      vehicle: 'Toyota Corolla (AAU-5214)', 
      date: '2023-06-14', 
      status: 'rejected', 
      details: 'Windshield replacement',
      requestedBy: 'Sarah Williams',
      priority: 'medium',
      estimatedCost: 650
    },
  ]);
  
  const handleStatusChange = (requestId: string, newStatus: RequestStatus) => {
    setMaintenanceRequests(prevRequests => 
      prevRequests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus } 
          : request
      )
    );
    
    toast.success(`Maintenance request ${newStatus}`);
  };

  const handleRequestSubmit = (newRequest: MaintenanceRequest) => {
    setMaintenanceRequests(prev => [
      {
        ...newRequest,
        id: `MR-${2300 + prev.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        requestedBy: user?.fullName || 'Unknown User'
      },
      ...prev
    ]);
    
    toast.success("Maintenance request submitted successfully");
    setView("history");
  };

  // Is user MTL (maintenance team leader)
  const isMTL = user?.role === 'mtl';
  const isDirector = user?.role === 'transport_director';
  
  // Filter requests for MTL - they see all pending maintenance requests
  // Directors see all requests for reports

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Maintenance Requests</h1>
          <p className="page-description">
            {isMTL 
              ? 'Review and manage maintenance requests from users' 
              : isDirector
              ? 'View maintenance reports and request history'
              : 'Submit and track maintenance requests for vehicles'}
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
                {!isDirector && (
                  <TabsTrigger value="new" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    New Request
                  </TabsTrigger>
                )}
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="h-4 w-4" />
                  Request History
                </TabsTrigger>
                {isMTL && (
                  <TabsTrigger value="pending" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Pending Approvals
                  </TabsTrigger>
                )}
                {isDirector && (
                  <TabsTrigger value="reports" className="gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Maintenance Reports
                  </TabsTrigger>
                )}
              </TabsList>
              
              {view !== "new" && (
                <Button variant="outline" size="sm" className="gap-2">
                  <ListFilter className="h-4 w-4" />
                  Filter
                </Button>
              )}
            </div>
            
            {!isDirector && (
              <TabsContent value="new" className="animate-fade-in">
                <MaintenanceRequestForm onSubmitSuccess={handleRequestSubmit} />
              </TabsContent>
            )}
            
            <TabsContent value="history" className="animate-fade-in">
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full responsive-table">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Details</th>
                      <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {maintenanceRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">
                          {request.id}
                        </td>
                        <td className="py-3 px-4">
                          {request.vehicle}
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <span className="line-clamp-1">{request.details}</span>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          {request.date}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`status-badge ${
                            request.priority === 'high' 
                              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : request.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </span>
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
            
            {isMTL && (
              <TabsContent value="pending" className="animate-fade-in">
                <div className="rounded-lg border border-border overflow-hidden">
                  <table className="w-full responsive-table">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Requested By</th>
                        <th className="text-left py-3 px-4 text-sm font-medium">Priority</th>
                        <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Details</th>
                        <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {maintenanceRequests
                        .filter(request => request.status === 'pending')
                        .map((request) => (
                          <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3 px-4 font-medium">
                              {request.id}
                            </td>
                            <td className="py-3 px-4">
                              {request.vehicle}
                            </td>
                            <td className="py-3 px-4 hidden lg:table-cell">
                              {request.date}
                            </td>
                            <td className="py-3 px-4">
                              {request.requestedBy}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`status-badge ${
                                request.priority === 'high' 
                                  ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : request.priority === 'medium'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 hidden md:table-cell">
                              <span className="line-clamp-1">{request.details}</span>
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
                  {maintenanceRequests.filter(request => request.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-2 opacity-20" />
                      <p>No pending maintenance requests</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
            
            {isDirector && (
              <TabsContent value="reports" className="animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Maintenance Report Summary</CardTitle>
                    <CardDescription>Overview of all maintenance activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Requests
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold">{maintenanceRequests.length}</div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Completed
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold">
                              {maintenanceRequests.filter(r => r.status === 'completed').length}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Estimated Cost
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="text-2xl font-bold">
                              ${maintenanceRequests
                                .reduce((sum, req) => sum + (req.estimatedCost || 0), 0)
                                .toLocaleString()}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <h3 className="text-lg font-medium mb-4">Recent Maintenance Activities</h3>
                    <div className="rounded-lg border border-border overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium">Request ID</th>
                            <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                            <th className="text-left py-3 px-4 text-sm font-medium">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                            <th className="text-right py-3 px-4 text-sm font-medium">Est. Cost</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {maintenanceRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-muted/30 transition-colors">
                              <td className="py-3 px-4">{request.id}</td>
                              <td className="py-3 px-4">{request.vehicle}</td>
                              <td className="py-3 px-4">{request.date}</td>
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
                                ${request.estimatedCost?.toLocaleString() || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default MaintenanceRequests;
