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
import {
    Plus,
    PlusCircle,
    AlertTriangle,
    Route,
    Clock,
    CalendarDays,
    UserCheck,
} from "lucide-react";
import { HasPermission } from "@/components/auth/HasPermission";
import { TripRequestForm } from "@/components/trips/TripRequestForm";
import { TripRequestsList } from "@/components/trips/TripRequestsList";
import { TripRecordsList } from "@/components/trips/TripRecordsList";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { TripRequestDto } from "@/types/trip";
import { RequestStatus } from "@/types/common";
import { TripRecordFullDto } from "@/types/trip";
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

export default function TripManagement() {
    const { hasPermission } = useAuth();

    const [requestTripOpen, setRequestTripOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const itemsPerPage = 10; // Or your preferred default

    // Fetch trip requests with pagination
    const {
        data: tripRequestsData,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["tripRequests", currentPage, itemsPerPage, searchQuery], // Added searchQuery to refetch on search change
        queryFn: async () => {
            // Note: The backend doesn't support search directly in the provided controller.
            // Client-side filtering will be applied after fetching all data for the current page.
            // If server-side search is implemented, pass searchQuery to apiClient.trips.requests.getAll
            return apiClient.trips.requests.getAll({
                page: currentPage,
                size: itemsPerPage,
                sortBy: "requestedAt", // Or "requestedAt" if more appropriate
                direction: "DESC",
            });
        },
        // keepPreviousData: true, // Consider for smoother pagination
    });

    // Filter requests by search query (client-side filtering)
    const filteredRequests =
        tripRequestsData?.content.filter((request) => {
            if (!searchQuery) return true;
            const searchLower = searchQuery.toLowerCase();
            return (
                request.purpose.toLowerCase().includes(searchLower) ||
                (request.description && request.description.toLowerCase().includes(searchLower)) ||
                request.requestedBy.toLowerCase().includes(searchLower) ||
                request.startLocation.toLowerCase().includes(searchLower) ||
                request.endLocation.toLowerCase().includes(searchLower) ||
                request.status.toLowerCase().includes(searchLower)
            );
        }) || [];

    const [recordsPage, setRecordsPage] = useState(0);
    const [recordsPerPage] = useState(10);

    const {
        data: tripRecordsData,
        isLoading: recordsLoading,
        isError: recordsError,
        refetch: refetchTripRecords,
    } = useQuery({
        queryKey: ["tripRecords", recordsPage, recordsPerPage],
        queryFn: () => apiClient.tripRecords.getAll({
            page: recordsPage,
            size: recordsPerPage,
            sortBy: "assignedAt",
            direction: "DESC",
        }),
    });

    const AccessRestricted = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
            <p className="text-muted-foreground text-center max-w-md">
                You don't have permission to access the Trip Management page. Please contact your
                administrator for assistance.
            </p>
        </div>
    );

    const renderPaginationItems = () => {
        const items = [];
        const totalPages = tripRequestsData?.totalPages || 1;

        if (totalPages <= 7) {
            for (let i = 0; i < totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={i === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i);
                            }}
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
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(0);
                        }}
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (currentPage > 2) {
                // Adjusted for 0-indexed pages
                items.push(
                    <PaginationItem key="ellipsis1">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(totalPages - 2, currentPage + 1);
            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            href="#"
                            isActive={i === currentPage}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(i);
                            }}
                        >
                            {i + 1}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
            if (currentPage < totalPages - 3) {
                // Adjusted for 0-indexed pages
                items.push(
                    <PaginationItem key="ellipsis2">
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            items.push(
                <PaginationItem key={totalPages - 1}>
                    <PaginationLink
                        href="#"
                        isActive={totalPages - 1 === currentPage}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages - 1);
                        }}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    // Reset page to 0 when search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0); // Reset to first page on new search
    };

    const pendingRequestsCount =
        tripRequestsData?.content.filter((r) => r.status === RequestStatus.PENDING).length || 0;

    // For Trip Records pagination display
    const renderTripRecordsPagination = () => {
        const totalPages = tripRecordsData?.totalPages || 1;
        const items = [];
        for (let i = 0; i < totalPages; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        href="#"
                        isActive={i === recordsPage}
                        onClick={e => {
                            e.preventDefault();
                            setRecordsPage(i);
                        }}
                    >
                        {i + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        }
        return items;
    };

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Trip Management</h1>
                    <p className="text-muted-foreground">
                        Plan, track, and manage all organizational trips.
                    </p>
                </div>

                <HasPermission permission="create_trip_request" fallback={null}>
                    <Button className="gap-1.5" onClick={() => setRequestTripOpen(true)}>
                        <Plus className="h-4 w-4" />
                        <span>Request Trip</span>
                    </Button>
                </HasPermission>
            </div>

            {!hasPermission("view_trip_management") ? ( // Assuming this permission
                <AccessRestricted />
            ) : (
                <>
                    {/* Stats Cards - Adapt as needed */}
                    {/* <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Trips (Current View)
                                </CardTitle>
                                <Route className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {tripRequestsData?.totalElements || 0}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Overall trips in the system
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pending Requests
                                </CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{pendingRequestsCount}</div>
                                <p className="text-xs text-muted-foreground">Awaiting approval</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Approved Trips (Month)
                                </CardTitle>
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">N/A</div>
                                <p className="text-xs text-muted-foreground">
                                    Placeholder for monthly approved
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Active / Upcoming Trips
                                </CardTitle>
                                <UserCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">N/A</div>
                                <p className="text-xs text-muted-foreground">
                                    Placeholder for active trips
                                </p>
                            </CardContent>
                        </Card>
                    </div> */}

                    <Tabs defaultValue="requests" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="requests">Trip Requests</TabsTrigger>
                            <TabsTrigger value="records">Trip Records</TabsTrigger>
                            <TabsTrigger value="history">Trip History</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                        </TabsList>

                        <TabsContent value="requests" className="space-y-4">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div>
                                            <CardTitle>All Trip Requests</CardTitle>
                                            <CardDescription>
                                                Manage and track all trip requests.
                                            </CardDescription>
                                        </div>
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search by purpose, user, location..."
                                                className="pl-8"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
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
                                            <p className="text-red-700">
                                                Error loading trip requests. Please try again.
                                            </p>
                                        </div>
                                    ) : filteredRequests.length === 0 &&
                                      !searchQuery &&
                                      tripRequestsData?.totalElements === 0 ? (
                                        <div className="rounded-md border border-dashed p-8">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                                                <h3 className="text-lg font-medium mb-1">
                                                    No trip requests yet
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    There are no trip requests at the moment.
                                                </p>
                                                <HasPermission
                                                    permission="create_trip_request"
                                                    fallback={null}
                                                >
                                                    <Button
                                                        onClick={() => setRequestTripOpen(true)}
                                                    >
                                                        <Plus className="mr-2 h-4 w-4" />
                                                        New Trip Request
                                                    </Button>
                                                </HasPermission>
                                            </div>
                                        </div>
                                    ) : filteredRequests.length === 0 && searchQuery ? (
                                        <div className="rounded-md border border-dashed p-8 text-center">
                                            <p className="text-muted-foreground">
                                                No matching trip requests found for "{searchQuery}"
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <TripRequestsList
                                                requests={filteredRequests}
                                                onRefresh={refetch}
                                            />

                                            {tripRequestsData &&
                                                tripRequestsData.totalPages > 1 && ( // Show pagination if more than one page
                                                    <div className="mt-6">
                                                        <Pagination>
                                                            <PaginationContent>
                                                                <PaginationItem>
                                                                    <PaginationPrevious
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setCurrentPage(
                                                                                Math.max(
                                                                                    0,
                                                                                    currentPage - 1
                                                                                )
                                                                            );
                                                                        }}
                                                                        aria-disabled={
                                                                            currentPage === 0
                                                                        }
                                                                        className={
                                                                            currentPage === 0
                                                                                ? "pointer-events-none opacity-50"
                                                                                : ""
                                                                        }
                                                                    />
                                                                </PaginationItem>
                                                                {renderPaginationItems()}
                                                                <PaginationItem>
                                                                    <PaginationNext
                                                                        href="#"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setCurrentPage(
                                                                                Math.min(
                                                                                    tripRequestsData.totalPages -
                                                                                        1,
                                                                                    currentPage + 1
                                                                                )
                                                                            );
                                                                        }}
                                                                        aria-disabled={
                                                                            currentPage ===
                                                                            tripRequestsData.totalPages -
                                                                                1
                                                                        }
                                                                        className={
                                                                            currentPage ===
                                                                            tripRequestsData.totalPages -
                                                                                1
                                                                                ? "pointer-events-none opacity-50"
                                                                                : ""
                                                                        }
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
                                        {tripRequestsData &&
                                            `Showing ${filteredRequests.length} of ${tripRequestsData.totalElements} requests`}
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="records" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trip Records</CardTitle>
                                    <CardDescription>
                                        List of resolved/assigned trip requests.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {recordsLoading ? (
                                        <div className="flex justify-center p-8">
                                            <p>Loading trip records...</p>
                                        </div>
                                    ) : recordsError ? (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                            <p className="text-red-700">Error loading trip records.</p>
                                        </div>
                                    ) : (
                                        <>
                                            <TripRecordsList records={tripRecordsData?.content || []} />
                                            {tripRecordsData && tripRecordsData.totalPages > 1 && (
                                                <div className="mt-6">
                                                    <Pagination>
                                                        <PaginationContent>
                                                            <PaginationItem>
                                                                <PaginationPrevious
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        setRecordsPage(Math.max(0, recordsPage - 1));
                                                                    }}
                                                                    aria-disabled={recordsPage === 0}
                                                                    className={recordsPage === 0 ? "pointer-events-none opacity-50" : ""}
                                                                />
                                                            </PaginationItem>
                                                            {renderTripRecordsPagination()}
                                                            <PaginationItem>
                                                                <PaginationNext
                                                                    href="#"
                                                                    onClick={e => {
                                                                        e.preventDefault();
                                                                        setRecordsPage(
                                                                            Math.min(
                                                                                tripRecordsData.totalPages - 1,
                                                                                recordsPage + 1
                                                                            )
                                                                        );
                                                                    }}
                                                                    aria-disabled={recordsPage === tripRecordsData.totalPages - 1}
                                                                    className={recordsPage === tripRecordsData.totalPages - 1 ? "pointer-events-none opacity-50" : ""}
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
                                        {tripRecordsData &&
                                            `Showing ${tripRecordsData.content?.length || 0} of ${tripRecordsData.totalElements} records`}
                                    </p>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trip History</CardTitle>
                                    <CardDescription>
                                        View completed and past trips. (Placeholder)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pl-2">
                                    <div className="h-[300px] w-full rounded-md border border-dashed flex items-center justify-center">
                                        <p className="text-center text-muted-foreground">
                                            Trip history & analytics will be displayed here.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="reports" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Trip Reports</CardTitle>
                                    <CardDescription>
                                        Generate and download trip reports. (Placeholder)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="rounded-md border p-4">
                                            <h3 className="font-medium mb-2">
                                                Monthly Trip Summary
                                            </h3>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                Detailed breakdown of all trips for the current
                                                month.
                                            </p>
                                            <Button variant="outline" disabled>
                                                Download Report
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </>
            )}

            {/* Trip Request Dialog */}
            <Dialog open={requestTripOpen} onOpenChange={setRequestTripOpen}>
                <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New Trip Request</DialogTitle>
                    </DialogHeader>
                    <TripRequestForm
                        onSuccess={() => {
                            setRequestTripOpen(false);
                            refetch(); // Refetch data after successful creation
                        }}
                        onCancel={() => setRequestTripOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
