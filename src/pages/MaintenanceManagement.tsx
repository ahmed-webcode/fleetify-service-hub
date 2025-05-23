import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PlusCircle, AlertTriangle, Wrench, ListChecks, FileText } from "lucide-react";
import { HasPermission } from "@/components/auth/HasPermission";
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";
import { useQuery } from "@tanstack/react-query";
import { apiClient, MaintenanceRequestDto, RequestStatus, MaintenanceRequestQueryParams } from "@/lib/apiClient";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MaintenanceManagement() {
  const { hasPermission } = useAuth();

  const [requestMaintenanceOpen, setRequestMaintenanceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  const {
    data: maintenanceRequestsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["maintenanceRequests", currentPage, itemsPerPage, searchQuery],
    queryFn: async () => {
      const params: MaintenanceRequestQueryParams = {
        page: currentPage,
        size: itemsPerPage,
        sortBy: "createdAt",
        direction: "DESC",
      };
      // If backend supports search, pass searchQuery as a param
      // e.g. if (searchQuery) params.search = searchQuery;
      return apiClient.maintenance.requests.getAll(params);
    },
    // keepPreviousData: true, // Optional: for smoother pagination transitions
  });

  const filteredRequests =
    maintenanceRequestsData?.content.filter((request) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        request.title.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.plateNumber.toLowerCase().includes(searchLower) ||
        request.requestedBy.toLowerCase().includes(searchLower) ||
        request.status.toLowerCase().includes(searchLower)
      );
    }) || [];

  const AccessRestricted = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
      <p className="text-muted-foreground text-center max-w-md">
        You don't have permission to access Maintenance Management.
        Please contact your administrator.
      </p>
    </div>
  );

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = maintenanceRequestsData?.totalPages || 1;

    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={0}>
          <PaginationLink
            href="#"
            isActive={0 === currentPage}
            onClick={(e) => { e.preventDefault(); setCurrentPage(0); }}
          >1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 2) {
        items.push(<PaginationItem key="ellipsis1"><PaginationEllipsis /></PaginationItem>);
      }
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages - 2, currentPage + 1);
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}
            >{i + 1}</PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 3) {
        items.push(<PaginationItem key="ellipsis2"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            href="#"
            isActive={totalPages - 1 === currentPage}
            onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages - 1); }}
          >{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); 
  };
  
  const pendingRequestsCount = maintenanceRequestsData?.content.filter(r => r.status === RequestStatus.PENDING).length || 0;
  // const underMaintenanceCount = 0; // This would require fetching vehicle statuses or a different API

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Maintenance Management
          </h1>
          <p className="text-muted-foreground">
            Track and manage vehicle maintenance requests and schedules.
          </p>
        </div>

        <HasPermission permission="create_maintenance_request" fallback={null}>
          <Button
            className="gap-1.5"
            onClick={() => setRequestMaintenanceOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>Request Maintenance</span>
          </Button>
        </HasPermission>
      </div>

      {!hasPermission("view_maintenance_management") ? (
        <AccessRestricted />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Requests
                </CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maintenanceRequestsData?.totalElements || 0}</div>
                <p className="text-xs text-muted-foreground">
                  All recorded maintenance requests
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <ListChecks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting review or action
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Vehicles Under Maintenance
                </CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div> {/* Placeholder */}
                <p className="text-xs text-muted-foreground">
                  Requires vehicle status integration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overdue Maintenance
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">N/A</div> {/* Placeholder */}
                <p className="text-xs text-muted-foreground">
                  Scheduled vs. actual (future feature)
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="requests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
              <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle>All Maintenance Requests</CardTitle>
                      <CardDescription>
                        View, manage, and track all vehicle maintenance requests.
                      </CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title, plate, user..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-8"><p>Loading maintenance requests...</p></div>
                  ) : isError ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">Error loading requests. Please try again.</p>
                    </div>
                  ) : filteredRequests.length === 0 && !searchQuery && maintenanceRequestsData?.totalElements === 0 ? (
                    <div className="rounded-md border border-dashed p-8">
                      <div className="flex flex-col items-center justify-center text-center">
                        <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                        <h3 className="text-lg font-medium mb-1">No maintenance requests</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Get started by creating a new maintenance request.
                        </p>
                        <HasPermission permission="create_maintenance_request" fallback={null}>
                            <Button onClick={() => setRequestMaintenanceOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Maintenance Request
                            </Button>
                        </HasPermission>
                      </div>
                    </div>
                  ) : filteredRequests.length === 0 && searchQuery ? (
                     <div className="rounded-md border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">No matching requests found for "{searchQuery}"</p>
                    </div>
                  ) : (
                    <>
                      <MaintenanceRequestsList
                        requests={filteredRequests}
                        onRefresh={refetch}
                      />
                      {maintenanceRequestsData && maintenanceRequestsData.totalPages > 1 && (
                          <div className="mt-6">
                            <Pagination>
                              <PaginationContent>
                                <PaginationItem>
                                  <PaginationPrevious
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setCurrentPage(Math.max(0, currentPage - 1));}}
                                    aria-disabled={currentPage === 0}
                                    className={ currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                  <PaginationNext
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setCurrentPage( Math.min( maintenanceRequestsData.totalPages - 1, currentPage + 1 )); }}
                                    aria-disabled={ currentPage === maintenanceRequestsData.totalPages - 1 }
                                    className={ currentPage === maintenanceRequestsData.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                                  />
                                </PaginationItem>
                              </PaginationContent>
                            </Pagination>
                          </div>
                        )}
                    </>
                  )}
                </CardContent>
                <CardFooter className="border-t py-3 px-6">
                  <p className="text-xs text-muted-foreground">
                    {maintenanceRequestsData && (
                      `Showing ${filteredRequests.length} of ${maintenanceRequestsData.totalElements} requests`
                    )}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>
                    View upcoming and scheduled maintenance. (Placeholder)
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full rounded-md border border-dashed flex items-center justify-center">
                    <p className="text-center text-muted-foreground">
                      Maintenance calendar/schedule view will be here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Reports</CardTitle>
                  <CardDescription>
                    Generate and download reports. (Placeholder)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Vehicle Maintenance History</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed report of all maintenance done on a specific vehicle.
                      </p>
                      <Button variant="outline" disabled>Generate Report</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Maintenance Request Dialog */}
      <Dialog open={requestMaintenanceOpen} onOpenChange={setRequestMaintenanceOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Maintenance Request</DialogTitle>
          </DialogHeader>
          <MaintenanceRequestForm
            onSuccess={() => {
              setRequestMaintenanceOpen(false);
              refetch();
            }}
            onCancel={() => setRequestMaintenanceOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}