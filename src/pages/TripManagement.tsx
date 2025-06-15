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
import { TripRequestForm } from "@/components/trips/TripRequestForm";
import { TripRequestsList } from "@/components/trips/TripRequestsList";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TripRecordsTab from "@/components/trips/TripRecordsTab";

export default function TripManagement() {
  const { hasPermission } = useAuth();
  
  const [requestTripOpen, setRequestTripOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // Fetch trip requests with pagination
  const {
    data: tripRequestsData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["tripRequests", currentPage, itemsPerPage],
    queryFn: async () => {
      return apiClient.trips.requests.getAll({
        page: currentPage,
        size: itemsPerPage,
        sortBy: "requestedAt",
        direction: "DESC"
      });
    }
  });

  // Filter requests by search query (client-side filtering)
  const filteredRequests = tripRequestsData?.content.filter(request => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      request.requestedBy.toLowerCase().includes(searchLower) ||
      request.levelName.toLowerCase().includes(searchLower) ||
      (request.vehiclePlateNumber && request.vehiclePlateNumber.toLowerCase().includes(searchLower)) ||
      request.destination.toLowerCase().includes(searchLower)
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
        You don't have permission to access the Trip Management page.
        Please contact your administrator for assistance.
      </p>
    </div>
  );

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = tripRequestsData?.totalPages || 1;
    
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trip Management</h1>
          <p className="text-muted-foreground">
            Track and manage trip requests across your organization
          </p>
        </div>

        {/* Only users with permission to request trip see the button */}
        <HasPermission permission="request_trip" fallback={null}>
          <Button className="gap-1.5" onClick={() => setRequestTripOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Request Trip</span>
          </Button>
        </HasPermission>
      </div>

      {/* Only users with view_trip_request permission see the main content */}
      {!hasPermission("view_trip_request") ? (
        <AccessRestricted />
      ) : (
        <>
          {/* Stats Cards */}
          {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Trips
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Distance
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
                <div className="text-2xl font-bold">1.73 km</div>
                <p className="text-xs text-muted-foreground">
                  Per trip in current month
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
                <div className="text-2xl font-bold">{tripRequestsData?.content.filter(r => r.status === 'PENDING').length || 0}</div>
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
                  328 trips completed
                </p>
              </CardContent>
            </Card>
          </div> */}

          {/* Trip Management Tabs */}
          <Tabs defaultValue="requests" className="space-y-4">
            <TabsList>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <CardTitle>Trip Requests</CardTitle>
                      <CardDescription>
                        Manage and track trip requests
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
                      <p>Loading trip requests...</p>
                    </div>
                  ) : isError ? (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-700">Error loading trip requests. Please try again.</p>
                    </div>
                  ) : filteredRequests.length === 0 && !searchQuery ? (
                    <div className="rounded-md border border-dashed p-8">
                      <div className="flex flex-col items-center justify-center text-center">
                        <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                        <h3 className="text-lg font-medium mb-1">No requests yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          There are no trip requests at the moment. Create one to get started.
                        </p>
                        <HasPermission permission="request_trip">
                          <Button onClick={() => setRequestTripOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Trip Request
                          </Button>
                        </HasPermission>
                      </div>
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div className="rounded-md border border-dashed p-8 text-center">
                      <p className="text-muted-foreground">No matching trip requests found</p>
                    </div>
                  ) : (
                    <>
                      <TripRequestsList requests={filteredRequests} onRefresh={refetch} />
                      
                      {/* Pagination */}
                      {tripRequestsData && tripRequestsData.totalPages > 1 && !searchQuery && (
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
                                  onClick={() => setCurrentPage(Math.min(tripRequestsData.totalPages - 1, currentPage + 1))}
                                  aria-disabled={currentPage === tripRequestsData.totalPages - 1}
                                  className={currentPage === tripRequestsData.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
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
                    {tripRequestsData && (
                      `Showing ${filteredRequests.length} of ${tripRequestsData.totalElements} requests`
                    )}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="records" className="space-y-4">
              <TripRecordsTab />
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Trip Reports</CardTitle>
                  <CardDescription>
                    Download and analyze trip reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Monthly Trip Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed breakdown of trips by vehicle for the current month
                      </p>
                      <Button variant="outline">Download Report</Button>
                    </div>
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Quarterly Distance Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Analysis of distances traveled for the last quarter
                      </p>
                      <Button variant="outline">Download Report</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="w-full">
                    Generate Custom Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Trip Request Dialog */}
      <Dialog open={requestTripOpen} onOpenChange={setRequestTripOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Trip Request</DialogTitle>
          </DialogHeader>
          <TripRequestForm 
            onSuccess={() => {
              setRequestTripOpen(false);
              refetch();
            }}
            onCancel={() => setRequestTripOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
