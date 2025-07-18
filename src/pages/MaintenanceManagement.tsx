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
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { MaintenanceRequestQueryParams } from "@/types/maintenance";
import { RequestStatus } from "@/types/common";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { MaintenanceRequestDialog } from "@/components/maintenance/MaintenanceRequestDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MaintenanceRecordsList } from "@/components/maintenance/MaintenanceRecordsList";
import { MaintenanceRecordDialog } from "@/components/maintenance/MaintenanceRecordDialog";
import { MaintenanceCompaniesList } from "@/components/maintenance/MaintenanceCompaniesList";
import { MaintenanceItemsList } from "@/components/maintenance/MaintenanceItemsList";
import { MaintenanceItemIssueDialog } from "@/components/maintenance/MaintenanceItemIssueDialog";

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
                sortBy: "requestedAt",
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
                request.vehicle.plateNumber.toLowerCase().includes(searchLower) ||
                request.requestedBy.fullName.toLowerCase().includes(searchLower) ||
                request.status.toLowerCase().includes(searchLower)
            );
        }) || [];

    const [recordDialogOpen, setRecordDialogOpen] = useState(false);
    const [currentRecordsPage, setCurrentRecordsPage] = useState(0);
    const recordsPerPage = 10;

    const {
        data: maintenanceRecordsData,
        isLoading: isLoadingRecords,
        isError: isErrorRecords,
        refetch: refetchRecords,
    } = useQuery({
        queryKey: ["maintenanceRecords", currentRecordsPage, recordsPerPage],
        queryFn: async () => {
            return apiClient.maintenance.records.getAll({
                page: currentRecordsPage,
                size: recordsPerPage,
                sortBy: "createdAt",
                direction: "DESC",
            });
        },
    });
    const filteredRecords = maintenanceRecordsData?.content || [];

    const {
        data: companiesData,
        isLoading: isLoadingCompanies,
        isError: isErrorCompanies,
        refetch: refetchCompanies,
    } = useQuery({
        queryKey: ["maintenanceCompanies"],
        queryFn: () => apiClient.maintenance.companies.getAll(),
    });
    const companies = companiesData || [];

    const {
        data: itemsData,
        isLoading: isLoadingItems,
        isError: isErrorItems,
        refetch: refetchItems,
    } = useQuery({
        queryKey: ["maintenanceItems"],
        queryFn: () => apiClient.maintenance.items.getAll({ size: 50 }),
    });
    const items = itemsData?.content || [];

    const AccessRestricted = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-muted p-4 mb-4">
                <AlertTriangle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
            <p className="text-muted-foreground text-center max-w-md">
                You don't have permission to access Maintenance Management. Please contact your
                administrator.
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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(0);
    };

    const pendingRequestsCount =
        maintenanceRequestsData?.content.filter((r) => r.status === RequestStatus.PENDING).length ||
        0;
    // const underMaintenanceCount = 0; // This would require fetching vehicle statuses or a different API

    const [issueDialogOpen, setIssueDialogOpen] = useState(false);

    return (
        <div className="space-y-6 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Maintenance Management</h1>
                    <p className="text-muted-foreground">
                        Track and manage vehicle maintenance requests and schedules.
                    </p>
                </div>
                <HasPermission permission="view_maintenance_request" fallback={null}>
                    <Button className="gap-1.5" onClick={() => setRequestMaintenanceOpen(true)}>
                        <Plus className="h-4 w-4" />
                        <span>Request Maintenance</span>
                    </Button>
                </HasPermission>
            </div>
            <Tabs defaultValue="requests" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
                    <TabsTrigger value="records">Records</TabsTrigger>
                    <TabsTrigger value="companies">Companies</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
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
                                <div className="flex justify-center p-8">
                                    <p>Loading maintenance requests...</p>
                                </div>
                            ) : isError ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700">
                                        Error loading requests. Please try again.
                                    </p>
                                </div>
                            ) : filteredRequests.length === 0 &&
                              !searchQuery &&
                              maintenanceRequestsData?.totalElements === 0 ? (
                                <div className="rounded-md border border-dashed p-8">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                                        <h3 className="text-lg font-medium mb-1">
                                            No maintenance requests
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Get started by creating a new maintenance request.
                                        </p>
                                        <HasPermission
                                            permission="view_maintenance_request"
                                            fallback={null}
                                        >
                                            <Button onClick={() => setRequestMaintenanceOpen(true)}>
                                                <Plus className="mr-2 h-4 w-4" />
                                                New Maintenance Request
                                            </Button>
                                        </HasPermission>
                                    </div>
                                </div>
                            ) : filteredRequests.length === 0 && searchQuery ? (
                                <div className="rounded-md border border-dashed p-8 text-center">
                                    <p className="text-muted-foreground">
                                        No matching requests found for "{searchQuery}"
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <MaintenanceRequestsList
                                        requests={filteredRequests}
                                        onRefresh={refetch}
                                    />
                                    {maintenanceRequestsData &&
                                        maintenanceRequestsData.totalPages > 1 && (
                                            <div className="mt-6">
                                                <Pagination>
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href="#"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setCurrentPage(
                                                                        Math.max(0, currentPage - 1)
                                                                    );
                                                                }}
                                                                aria-disabled={currentPage === 0}
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
                                                                            maintenanceRequestsData.totalPages -
                                                                                1,
                                                                            currentPage + 1
                                                                        )
                                                                    );
                                                                }}
                                                                aria-disabled={
                                                                    currentPage ===
                                                                    maintenanceRequestsData.totalPages -
                                                                        1
                                                                }
                                                                className={
                                                                    currentPage ===
                                                                    maintenanceRequestsData.totalPages -
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
                                {maintenanceRequestsData &&
                                    `Showing ${filteredRequests.length} of ${maintenanceRequestsData.totalElements} requests`}
                            </p>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="records" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle>Maintenance Records</CardTitle>
                                <CardDescription>
                                    All completed maintenance work and history.
                                </CardDescription>
                            </div>
                            <HasPermission permission="manage_maintenance" fallback={null}>
                                <Button
                                    className="gap-1.5"
                                    onClick={() => setRecordDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Record</span>
                                </Button>
                            </HasPermission>
                        </CardHeader>
                        <CardContent>
                            {isLoadingRecords ? (
                                <div className="flex justify-center p-8">
                                    <p>Loading maintenance records...</p>
                                </div>
                            ) : isErrorRecords ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700">
                                        Error loading records. Please try again.
                                    </p>
                                </div>
                            ) : (
                                <MaintenanceRecordsList
                                    records={filteredRecords}
                                    onRefresh={refetchRecords}
                                />
                            )}
                        </CardContent>
                        <CardFooter className="border-t py-3 px-6">
                            <p className="text-xs text-muted-foreground">
                                {maintenanceRecordsData &&
                                    `Showing ${filteredRecords.length} of ${maintenanceRecordsData.totalElements} records`}
                            </p>
                        </CardFooter>
                    </Card>
                    <MaintenanceRecordDialog
                        open={recordDialogOpen}
                        onOpenChange={setRecordDialogOpen}
                        onSuccess={() => {
                            setRecordDialogOpen(false);
                            refetchRecords();
                        }}
                    />
                </TabsContent>

                <TabsContent value="companies" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Maintenance Companies</CardTitle>
                            <CardDescription>
                                List of all maintenance service providers.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoadingCompanies ? (
                                <div className="flex justify-center p-8">
                                    <p>Loading companies...</p>
                                </div>
                            ) : isErrorCompanies ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700">
                                        Error loading companies. Please try again.
                                    </p>
                                </div>
                            ) : (
                                <MaintenanceCompaniesList companies={companies} />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-3">
                            <div>
                                <CardTitle>Maintenance Items</CardTitle>
                                <CardDescription>
                                    All issued and received maintenance items.
                                </CardDescription>
                            </div>
                            <HasPermission permission="manage_item" fallback={null}>
                                <Button
                                    className="gap-1.5"
                                    onClick={() => setIssueDialogOpen(true)}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Issue Item</span>
                                </Button>
                            </HasPermission>
                        </CardHeader>
                        <CardContent>
                            {isLoadingItems ? (
                                <div className="flex justify-center p-8">
                                    <p>Loading items...</p>
                                </div>
                            ) : isErrorItems ? (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                    <p className="text-red-700">
                                        Error loading items. Please try again.
                                    </p>
                                </div>
                            ) : (
                                <MaintenanceItemsList items={items} onRefresh={refetchItems} />
                            )}
                        </CardContent>
                    </Card>
                    <MaintenanceItemIssueDialog
                        open={issueDialogOpen}
                        onOpenChange={setIssueDialogOpen}
                        onSuccess={() => {
                            setIssueDialogOpen(false);
                            refetchItems();
                        }}
                    />
                </TabsContent>
            </Tabs>

            {/* Maintenance Request Dialog */}
            <MaintenanceRequestDialog
                open={requestMaintenanceOpen}
                onOpenChange={setRequestMaintenanceOpen}
                onSuccess={() => {
                    setRequestMaintenanceOpen(false);
                    refetch();
                }}
            />
        </div>
    );
}
