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
import { Plus, PlusCircle, AlertTriangle } from "lucide-react";
import { HasPermission } from "@/components/auth/HasPermission";
import { FuelRequestForm } from "@/components/fuel/FuelRequestForm";
import { FuelRequestsList } from "@/components/fuel/FuelRequestsList";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import FuelRecordsTab from "@/components/fuel/FuelRecordsTab";
import FuelList from "@/components/fuel/FuelList";
import FuelReportsTab from "@/components/fuel/FuelReportsTab";

export default function FuelManagement() {
  const { hasPermission, selectedRole } = useAuth();
  
  const [requestFuelOpen, setRequestFuelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Fetch fuel requests with pagination
  const {
    data: fuelRequestsData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["fuelRequests", currentPage, itemsPerPage],
    queryFn: async () => {
      // Operational Director (id: 7) or Officier (id: 9) can only see their own requests
      if (selectedRole && selectedRole.id === 7 || selectedRole.id === 9) {
        return apiClient.fuel.requests.getMy({
          page: currentPage,
          size: itemsPerPage,
          sortBy: "requestedAt",
          direction: "DESC"
        });
      } else {
        return apiClient.fuel.requests.getAll({
          page: currentPage,
          size: itemsPerPage,
          sortBy: "requestedAt",
          direction: "DESC"
        });
      }
    }
  });

  // Filter requests by search query (client-side filtering)
  const filteredRequests = fuelRequestsData?.content.filter(request => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      request.requestedBy.toLowerCase().includes(searchLower) ||
      request.levelName.toLowerCase().includes(searchLower) ||
      (request.vehiclePlateNumber && request.vehiclePlateNumber.toLowerCase().includes(searchLower)) ||
      request.fuelTypeName.toLowerCase().includes(searchLower)
    );
  }) || [];

  // Component that shows when user doesn't have access
  const AccessRestricted = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
      <p className="text-muted-foreground text-center max-w-md">
        You don't have permission to access the Fuel Management page.
        Please contact your administrator for assistance.
      </p>
    </div>
  );

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = fuelRequestsData?.totalPages || 1;
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 0; i < totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={0}>
          <PaginationLink 
            isActive={0 === currentPage}
            onClick={() => setCurrentPage(0)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if current page is 4 or greater
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show pages around current page
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages - 2, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => setCurrentPage(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis if current page is totalPages-4 or less
      if (currentPage < totalPages - 3) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink 
            isActive={totalPages - 1 === currentPage}
            onClick={() => setCurrentPage(totalPages - 1)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  return (
    <div className="page-container space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Management</h1>
          <p className="text-muted-foreground">
            Track and manage fuel consumption across your fleet
          </p>
        </div>

        {/* Only users with permission to request fuel see the button */}
        <HasPermission 
          permission="request_fuel" 
          fallback={null}
        >
          <Button className="gap-1.5" onClick={() => setRequestFuelOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Request Fuel</span>
          </Button>
        </HasPermission>
      </div>

      {/* Only users with view_fuel permission see the main content */}
      {!hasPermission("view_fuel") ? (
        <AccessRestricted />
      ) : (
        <>
          {/* Stats Cards */}
          {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Consumption
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248 L</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Cost
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.73</div>
                <p className="text-xs text-muted-foreground">
                  Per liter in current month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fuelRequestsData?.content.filter(r => r.status === 'PENDING').length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Active Vehicle
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 1 0 7h5" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Toyota Hiace</div>
                <p className="text-xs text-muted-foreground">
                  328 liters consumed
                </p>
              </CardContent>
            </Card>
          </div> */}

          {/* Fuel Management Tabs */}
          <Tabs defaultValue={hasPermission("view_only_fuel_records") ? "records" : "requests"} className="space-y-4">
            <HasPermission permission="manage_fuel" fallback={null}>
              <TabsList>
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                  <TabsTrigger value="records">Records</TabsTrigger>
                  <HasPermission permission="manage_fuel_types" fallback={null}>
                    <TabsTrigger value="fuels">Fuels</TabsTrigger>
                  </HasPermission>
                  <HasPermission permission="generate_fuel_report" fallback={null}>
                    <TabsTrigger value="reports">Reports</TabsTrigger>
                  </HasPermission>
              </TabsList>
            </HasPermission>
            
            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle>Fuel Requests</CardTitle>
                      <CardDescription>
                        Manage and track fuel requests
                      </CardDescription>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center p-8">
                      <p>Loading fuel requests...</p>
                    </div>
                  ) : isError ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">Error loading fuel requests. Please try again.</p>
                    </div>
                  ) : filteredRequests.length === 0 && !searchQuery ? (
                    <div className="rounded-md border border-dashed p-8">
                      <div className="flex flex-col items-center justify-center text-center">
                        <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                        <h3 className="text-lg font-medium mb-1">No requests yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          There are no fuel requests at the moment.
                        </p>
                        <HasPermission 
                          permission="request_fuel" 
                          fallback={null}
                        >
                          <Button onClick={() => setRequestFuelOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Fuel Request
                          </Button>
                        </HasPermission>
                      </div>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="rounded-md border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">No matching fuel requests found</p>
                    </div>
                  ) : (
                    <>
                      <FuelRequestsList requests={filteredRequests} onRefresh={refetch} />
                      
                      {/* Pagination */}
                      {fuelRequestsData && fuelRequestsData.totalPages > 1 && !searchQuery && (
                        <div className="mt-6">
                          <Pagination>
                            <PaginationContent>
                              <PaginationItem>
                                <PaginationPrevious 
                                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                  aria-disabled={currentPage === 0}
                                  className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                                />
                              </PaginationItem>
                              
                              {renderPaginationItems()}
                              
                              <PaginationItem>
                                <PaginationNext 
                                  onClick={() => setCurrentPage(Math.min(fuelRequestsData.totalPages - 1, currentPage + 1))}
                                  aria-disabled={currentPage === fuelRequestsData.totalPages - 1}
                                  className={currentPage === fuelRequestsData.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
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
                    {fuelRequestsData && (
                      `Showing ${filteredRequests.length} of ${fuelRequestsData.totalElements} requests`
                    )}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="records" className="space-y-4">
              <FuelRecordsTab />
            </TabsContent>

            <TabsContent value="fuels" className="space-y-4">
              <FuelList />
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              {/* Fuel Reports Tab */}
              <FuelReportsTab />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Fuel Request Dialog */}
      <Dialog open={requestFuelOpen} onOpenChange={setRequestFuelOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Fuel Request</DialogTitle>
          </DialogHeader>
          <FuelRequestForm 
            onSuccess={() => {
              setRequestFuelOpen(false);
              refetch();
            }}
            onCancel={() => setRequestFuelOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
