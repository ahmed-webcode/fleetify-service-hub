import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { MaintenanceRequestQueryParams } from "@/types/maintenance";
import { RequestStatus } from "@/types/common";
import { MaintenanceRequestsList } from "@/components/maintenance/MaintenanceRequestsList";
import { MaintenanceRequestDialog } from "@/components/maintenance/MaintenanceRequestDialog";
import { Plus, PlusCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HasPermission } from "@/components/auth/HasPermission";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface MaintenanceRequestsTabProps {
    requestMaintenanceOpen: boolean;
    setRequestMaintenanceOpen: (open: boolean) => void;
}

export function MaintenanceRequestsTab({
    requestMaintenanceOpen,
    setRequestMaintenanceOpen,
}: MaintenanceRequestsTabProps) {
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
            return apiClient.maintenance.requests.getAll(params);
        },
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

    return (
        <>
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
                            {maintenanceRequestsData && maintenanceRequestsData.totalPages > 1 && (
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
                                                        maintenanceRequestsData.totalPages - 1
                                                    }
                                                    className={
                                                        currentPage ===
                                                        maintenanceRequestsData.totalPages - 1
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
            <MaintenanceRequestDialog
                open={requestMaintenanceOpen}
                onOpenChange={setRequestMaintenanceOpen}
                onSuccess={() => {
                    setRequestMaintenanceOpen(false);
                    refetch();
                }}
            />
        </>
    );
}
