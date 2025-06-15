import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddVehicleForm } from "@/components/vehicles/AddVehicleForm";
import { EditVehicleForm } from "@/components/vehicles/EditVehicleForm";
import { VehiclesSearch } from "@/components/vehicles/VehiclesSearch";
import { VehiclesGrid } from "@/components/vehicles/VehiclesGrid";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { VehicleDto, VehicleStatus, VehicleQueryParams } from "@/types/vehicle";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface Vehicle {
    id: string;
    name: string;
    type: string;
    model: string;
    year: number;
    licensePlate: string;
    status: "active" | "maintenance" | "outOfService";
    lastLocation?: string;
    mileage: number;
    imgSrc?: string;
    fuelTypeName: string;
}

// Map backend status to UI status
const mapApiStatusToUiStatus = (
    apiStatus: VehicleStatus
): "active" | "maintenance" | "outOfService" => {
    switch (apiStatus) {
        case VehicleStatus.AVAILABLE:
        case VehicleStatus.IN_USE:
            return "active";
        case VehicleStatus.UNDER_MAINTENANCE:
            return "maintenance";
        case VehicleStatus.OUT_OF_SERVICE:
            return "outOfService";
        default:
            return "active";
    }
};

// Map API VehicleDto to UI Vehicle
const mapApiVehicleToUiVehicle = (apiVehicle: VehicleDto): Vehicle => {
    return {
        id: apiVehicle.id.toString(),
        name: `${apiVehicle.vehicleType} ${apiVehicle.model}`,
        type: apiVehicle.vehicleType,
        model: apiVehicle.model,
        year: apiVehicle.madeYear,
        licensePlate: apiVehicle.plateNumber,
        status: mapApiStatusToUiStatus(apiVehicle.status),
        lastLocation: apiVehicle.workEnvironment,
        mileage: apiVehicle.kmReading,
        imgSrc: apiVehicle.imgSrc,
        fuelTypeName: apiVehicle.fuelTypeName,
    };
};

const Vehicles = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [filterPrivate, setFilterPrivate] = useState<string>("all");
    const [addVehicleOpen, setAddVehicleOpen] = useState(false);
    const [editVehicleOpen, setEditVehicleOpen] = useState(false);
    const [selectedVehicleToEdit, setSelectedVehicleToEdit] = useState<VehicleDto | null>(null);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    const { hasPermission } = useAuth();
    const canAddVehicle = hasPermission("manage_vehicle");

    const queryClient = useQueryClient();

    // Fetch vehicles data from the API
    const {
        data: apiData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["vehicles", currentPage, itemsPerPage, searchQuery, filterStatus, filterPrivate],
        queryFn: async () => {
            const params: VehicleQueryParams = {
                page: currentPage,
                size: itemsPerPage,
                sortBy: "createdAt",
                direction: "DESC",
            };
            return apiClient.vehicles.getAll(params);
        },
    });

    useEffect(() => {
        if (apiData) {
            setTotalPages(apiData.totalPages);
        }
    }, [apiData]);

    // Transform API vehicles to UI vehicles
    const vehicles = useMemo(() => {
        if (!apiData || !apiData.content) return [];
        return apiData.content.map(mapApiVehicleToUiVehicle);
    }, [apiData]);

    // Filter vehicles based on search query, status, and "private"/"public"
    const filteredVehicles = useMemo(() => {
        if (!vehicles) return [];

        return vehicles.filter((vehicle) => {
            const matchesSearch =
                vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus;

            let matchesPrivate = true;
            if (filterPrivate === "private") {
                matchesPrivate = (apiData?.content?.find(v => v.id.toString() === vehicle.id)?.isPrivate) === true;
            } else if (filterPrivate === "public") {
                matchesPrivate = (apiData?.content?.find(v => v.id.toString() === vehicle.id)?.isPrivate) === false;
            }

            return matchesSearch && matchesStatus && matchesPrivate;
        });
    }, [vehicles, searchQuery, filterStatus, filterPrivate, apiData]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleAddVehicleClick = () => {
        if (canAddVehicle) {
            setAddVehicleOpen(true);
        } else {
            toast.error("You don't have permission to add vehicles");
        }
    };

    const handleOpenEditDialog = (vehicleId: string) => {
        if (!apiData || !apiData.content) {
            toast.error("Vehicle data is not loaded yet.");
            return;
        }
        const vehicleToEdit = apiData.content.find((v) => v.id.toString() === vehicleId);
        if (vehicleToEdit) {
            setSelectedVehicleToEdit(vehicleToEdit);
            setEditVehicleOpen(true);
        } else {
            toast.error("Could not find vehicle data to edit.");
        }
    };

    const resetFilters = () => {
        setSearchQuery("");
        setFilterStatus("all");
        setFilterPrivate("all");
        setCurrentPage(0);
    };

    const handleFormSubmit = async (vehicleData: FormData) => {
        try {
            setLoading(true);
            await apiClient.vehicles.create(vehicleData);
            setAddVehicleOpen(false);
            toast.success("Vehicle added successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            return { success: true };
        } catch (error: any) {
            toast.error("Failed to add vehicle: " + error.message);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const handleEditFormSubmit = async (id: number, data: FormData): Promise<void> => {
        try {
            setLoading(true);
            await apiClient.vehicles.update(id, data);
            setEditVehicleOpen(false);
            setSelectedVehicleToEdit(null);
            toast.success("Vehicle updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["vehicles"] });
            queryClient.invalidateQueries({ queryKey: ["vehicleDetail", id.toString()] });
        } catch (error: any) {
            toast.error("Failed to update vehicle: " + error.message);
            throw error; // Re-throw to maintain error handling
        } finally {
            setLoading(false);
        }
    };

    // Generate pagination items with ellipsis for large page counts
    const renderPaginationItems = () => {
        const items = [];

        if (totalPages <= 5) {
            // Render all page numbers if total pages is 5 or fewer
            for (let i = 0; i < totalPages; i++) {
                items.push(
                    <PaginationItem key={i}>
                        <PaginationLink
                            isActive={i === currentPage}
                            onClick={() => handlePageChange(i)}
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
                        onClick={() => handlePageChange(0)}
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
                            onClick={() => handlePageChange(i)}
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
                        onClick={() => handlePageChange(totalPages - 1)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };

    // Effect to check for 'edit' query parameter
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const editId = params.get("edit");
        if (editId && apiData?.content) {
            const vehicleToEdit = apiData.content.find((v) => v.id.toString() === editId);
            if (vehicleToEdit) {
                setSelectedVehicleToEdit(vehicleToEdit);
                setEditVehicleOpen(true);
            } else {
                // console.warn(`Vehicle with ID ${editId} not found for editing.`);
            }
        }
    }, [location.search, apiData]);

    if (error) {
        toast.error("Failed to load vehicles");
        return (
            <div className="page-container">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <p className="text-red-700">Error loading vehicles. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="page-container">
                <div className="page-title-container">
                    <h1 className="page-title">Vehicles</h1>
                    <p className="page-description">Manage and monitor your fleet</p>
                </div>

                <div className="card-uniform">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
                        {canAddVehicle && (
                            <Button
                                className="gap-2 w-full md:w-auto"
                                onClick={handleAddVehicleClick}
                            >
                                <Plus className="h-4 w-4" />
                                Add Vehicle
                            </Button>
                        )}

                        <VehiclesSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filterStatus={filterStatus}
                            setFilterStatus={setFilterStatus}
                            filterPrivate={filterPrivate}
                            setFilterPrivate={setFilterPrivate}
                        />
                    </div>

                    <Tabs defaultValue="grid" className="w-full">
                        <TabsList>
                            <TabsTrigger value="grid" className="gap-2">
                                <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                    <div className="bg-current rounded-sm"></div>
                                </div>
                                Grid
                            </TabsTrigger>
                            <TabsTrigger value="list" className="gap-2">
                                <div className="flex flex-col gap-0.5 w-3">
                                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                                </div>
                                List
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="grid" className="animate-fade-in w-full">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <p>Loading vehicles...</p>
                                </div>
                            ) : (
                                <VehiclesGrid
                                    vehicles={filteredVehicles}
                                    resetFilters={resetFilters}
                                    onEdit={handleOpenEditDialog}
                                />
                            )}
                        </TabsContent>

                        <TabsContent value="list" className="animate-fade-in w-full">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <p>Loading vehicles...</p>
                                </div>
                            ) : (
                                <VehiclesList
                                    vehicles={filteredVehicles}
                                    resetFilters={resetFilters}
                                    onEdit={handleOpenEditDialog}
                                />
                            )}
                        </TabsContent>

                        <div className="text-sm text-center text-muted-foreground mt-4 mb-6">
                            Showing {filteredVehicles.length} of {apiData?.totalElements || 0} vehicles
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    handlePageChange(Math.max(0, currentPage - 1))
                                                }
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
                                                onClick={() =>
                                                    handlePageChange(
                                                        Math.min(totalPages - 1, currentPage + 1)
                                                    )
                                                }
                                                aria-disabled={currentPage === totalPages - 1}
                                                className={
                                                    currentPage === totalPages - 1
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </Tabs>
                </div>

                {/* Dialogs for Add/Edit Vehicle */}
                <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
                    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Vehicle</DialogTitle>
                        </DialogHeader>
                        <AddVehicleForm onSubmit={handleFormSubmit} />
                    </DialogContent>
                </Dialog>

                {/* Edit Vehicle Dialog */}
                {selectedVehicleToEdit && (
                    <Dialog
                        open={editVehicleOpen}
                        onOpenChange={(isOpen) => {
                            setEditVehicleOpen(isOpen);
                            if (!isOpen) {
                                setSelectedVehicleToEdit(null);
                            }
                        }}
                    >
                        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Edit Vehicle</DialogTitle>
                            </DialogHeader>
                            <EditVehicleForm
                                vehicle={selectedVehicleToEdit}
                                onSubmit={handleEditFormSubmit}
                                onCancel={() => {
                                    setEditVehicleOpen(false);
                                    setSelectedVehicleToEdit(null);
                                }}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </>
    );
};

export default Vehicles;
