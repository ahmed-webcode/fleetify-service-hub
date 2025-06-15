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
import { MaintenanceRequestForm } from "@/components/maintenance/MaintenanceRequestForm";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { MaintenanceRequestDto, MaintenanceRequestQueryParams } from "@/types/maintenance";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function MaintenanceManagement() {
  const { hasPermission } = useAuth();

  const [requestMaintenanceOpen, setRequestMaintenanceOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch maintenance requests with pagination
  const {
    data: maintenanceRequestsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["maintenanceRequests", currentPage, itemsPerPage, searchQuery, filterStatus],
    queryFn: async () => {
      const params: MaintenanceRequestQueryParams = {
        page: currentPage,
        size: itemsPerPage,
        sortBy: "requestedAt",
        direction: "DESC",
      };
      if (filterStatus !== "all") {
        (params as any).status = filterStatus;
      }
      return apiClient.maintenance.requests.getAll(params);
    },
  });

  // Filter requests by search query (client-side filtering)
  const filteredRequests = maintenanceRequestsData?.content.filter(request => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      request.requestedBy.toLowerCase().includes(searchLower) ||
      request.title.toLowerCase().includes(searchLower) ||
      request.maintenanceType.toLowerCase().includes(searchLower) ||
      (request.plateNumber && request.plateNumber.toLowerCase().includes(searchLower))
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
        You don't have permission to access the Maintenance Management page.
        Please contact your administrator for assistance.
      </p>
    </div>
  );

  const renderPaginationItems = () => {
    const items = [];
    const totalPages = maintenanceRequestsData?.totalPages || 1;

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
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
          <p className="text-muted-foreground">
            Track and manage maintenance requests for your fleet
          </p>
        </div>

        {/* Only users with permission to request maintenance see the button */}
        <HasPermission
          permission="view_maintenance_request"
          fallback={null}
        >
          <Button className="gap-1.5" onClick={() => setRequestMaintenanceOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Request Maintenance</span>
          </Button>
        </HasPermission>
      </div>

      {/* Only users with view_maintenance permission see the main content */}
      {!hasPermission("view_maintenance") ? (
        <AccessRestricted />
      ) : (
        <>
          {/* Maintenance Requests Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <CardTitle>Maintenance Requests</CardTitle>
                  <CardDescription>
                    Manage and track maintenance requests
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
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Filter by Status:
                </label>
                <select
                  id="status"
                  className="flex h-9 w-auto rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex justify-center p-8">
                  <p>Loading maintenance requests...</p>
                </div>
              ) : isError ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <p className="text-red-700">Error loading maintenance requests. Please try again.</p>
                </div>
              ) : filteredRequests.length === 0 && !searchQuery && filterStatus === "all" ? (
                <div className="rounded-md border border-dashed p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No requests yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      There are no maintenance requests at the moment. Create one to get started.
                    </p>
                    <HasPermission permission="view_maintenance_request">
                      <Button onClick={() => setRequestMaintenanceOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Maintenance Request
                      </Button>
                    </HasPermission>
                  </div>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">No matching maintenance requests found</p>
                </div>
              ) : (
                <>
                  <MaintenanceRequestsList requests={filteredRequests} onRefresh={refetch} />

                  {/* Pagination */}
                  {maintenanceRequestsData && maintenanceRequestsData.totalPages > 1 && !searchQuery && filterStatus === "all" && (
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
                              onClick={() => setCurrentPage(Math.min(maintenanceRequestsData.totalPages - 1, currentPage + 1))}
                              aria-disabled={currentPage === maintenanceRequestsData.totalPages - 1}
                              className={currentPage === maintenanceRequestsData.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
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
        </>
      )}

      {/* Maintenance Request Dialog */}
      <Dialog open={requestMaintenanceOpen} onOpenChange={setRequestMaintenanceOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto">
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
