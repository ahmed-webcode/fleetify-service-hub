import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  Position,
  // CreatePositionDto, // Not used in this component directly
  // UpdatePositionDto, // Not used in this component directly
  PositionQueryParams,
  // PageResponse // Type inference handles this
} from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Plus,
  Edit,
  Trash2,
  ArrowUpDown, // Added for sorting
  ChevronUp,   // Added for sorting
  ChevronDown, // Added for sorting
  AlertTriangle, // Added for error state
  Inbox, // Added for empty state
  Settings2, // Example for another icon, if needed for table controls
} from "lucide-react";
import { toast } from "sonner";
import { fetchAndStoreLevels } from "@/lib/levelService";
import { AddPositionDialog } from "@/components/positions/AddPositionDialog";
import { EditPositionDialog } from "@/components/positions/EditPositionDialog";
import { ConfirmDeleteDialog } from "@/components/positions/ConfirmDeleteDialog";

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 10;

const PositionsManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [queryParams, setQueryParams] = useState<PositionQueryParams>({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    sortBy: 'createdAt',
    direction: 'DESC',
  });

  const queryClient = useQueryClient();

  const {
    data: positionsResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['positions', queryParams],
    queryFn: () => apiClient.positions.getAll(queryParams),
  });

  const positions: Position[] = positionsResponse?.content || [];
  const totalPages = positionsResponse?.totalPages || 0;
  const currentPage = positionsResponse?.number || 0; // API is 0-indexed

  useEffect(() => {
    fetchAndStoreLevels();
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.positions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success("Position deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete position: ${error.message}`);
    },
  });

  const handleEdit = (position: Position) => {
    setSelectedPosition(position);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (position: Position) => {
    setSelectedPosition(position);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPosition) {
      deleteMutation.mutate(selectedPosition.id);
    }
  };

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setQueryParams((prev) => ({ ...prev, size: newSize, page: 0 })); // Reset to first page on size change
  };

  const handleSortChange = (sortBy: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sortBy,
      direction: prev.sortBy === sortBy && prev.direction === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3; // Adjusted for a more compact look
    const pageBuffer = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(0, currentPage - pageBuffer);
    let endPage = Math.min(totalPages - 1, currentPage + pageBuffer);

    // Adjust start and end if near boundaries
    if (currentPage - pageBuffer < 0) {
        endPage = Math.min(totalPages - 1, maxVisiblePages - 1);
    }
    if (currentPage + pageBuffer >= totalPages) {
        startPage = Math.max(0, totalPages - maxVisiblePages);
    }
    
    // Always show first page if not in current range
    if (startPage > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(0)} aria-label="Go to first page">
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 1) { // Ellipsis if there's a gap after first page
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={currentPage === i} onClick={() => handlePageChange(i)}>
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page if not in current range
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) { // Ellipsis if there's a gap before last page
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => handlePageChange(totalPages - 1)} aria-label="Go to last page">
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  const SortableHeader = ({ label, columnKey }: { label: string; columnKey: string }) => (
    <TableHead
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSortChange(columnKey)}
    >
      <div className="flex items-center gap-2">
        {label}
        {queryParams.sortBy === columnKey ? (
          queryParams.direction === 'ASC' ? (
            <ChevronUp size={16} className="text-primary" />
          ) : (
            <ChevronDown size={16} className="text-primary" />
          )
        ) : (
          <ArrowUpDown size={16} className="text-muted-foreground" />
        )}
      </div>
    </TableHead>
  );

  return (
    <>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Positions Management
          </h1>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
            <Plus size={18} className="mr-2" />
            Add New Position
          </Button>
        </div>

        <div className="bg-card text-card-foreground shadow-sm rounded-lg border">
          {/* Table Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 border-b">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show</span>
              <select
                className="h-9 appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={queryParams.size}
                onChange={handlePageSizeChange}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="text-muted-foreground">entries</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {positionsResponse?.totalElements != null
                ? `Showing ${positionsResponse.numberOfElements > 0 ? currentPage * queryParams.size! + 1 : 0} to ${Math.min(
                    (currentPage + 1) * queryParams.size!,
                    positionsResponse.totalElements
                  )} of ${positionsResponse.totalElements} entries`
                : 'Loading entries...'}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center">
                <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent mb-4"></div>
                <p className="text-muted-foreground">Loading positions...</p>
              </div>
            ) : error ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center p-6 bg-destructive/10 m-4 rounded-md border border-destructive/30">
                <AlertTriangle size={48} className="text-destructive mb-3" />
                <p className="text-lg font-semibold text-destructive mb-1">
                  Failed to load positions
                </p>
                <p className="text-sm text-destructive/80 text-center">
                  There was an issue fetching the data. Please try refreshing the page.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <SortableHeader label="Name" columnKey="name" />
                    <SortableHeader label="Level" columnKey="levelName" />
                    <SortableHeader label="Fuel Quota (L)" columnKey="fuelQuota" />
                    <TableHead>Vehicle Entitlement</TableHead>
                    <TableHead>Policy Reference</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Inbox size={48} className="text-muted-foreground/70" />
                          <p className="text-lg font-medium text-muted-foreground">
                            No positions found.
                          </p>
                          <p className="text-sm text-muted-foreground/80">
                            Get started by adding a new position.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    positions.map((position) => (
                      <TableRow key={position.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium text-foreground">
                          {position.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{position.levelName}</TableCell>
                        <TableCell className="text-muted-foreground">{position.fuelQuota}</TableCell>
                        <TableCell>
                          {position.vehicleEntitlement ? (
                            <span className="px-2.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-700/20 dark:text-green-400 rounded-full text-xs font-medium">
                              Yes
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-700/20 dark:text-red-400 rounded-full text-xs font-medium">
                              No
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground truncate max-w-xs">{position.policyReference}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                              onClick={() => handleEdit(position)}
                              aria-label="Edit position"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                              disabled // This was in the original, kept as per instruction
                              onClick={() => handleDelete(position)}
                              aria-label="Delete position"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && !error && totalPages > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4">
              <div className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                      aria-disabled={currentPage === 0}
                      className={currentPage === 0 ? 'pointer-events-none opacity-60' : undefined}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                      aria-disabled={currentPage >= totalPages - 1}
                      className={currentPage >= totalPages - 1 ? 'pointer-events-none opacity-60' : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <AddPositionDialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />

      {selectedPosition && (
        <>
          <EditPositionDialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            position={selectedPosition}
          />
          <ConfirmDeleteDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={confirmDelete}
            positionName={selectedPosition.name}
            isDeleting={deleteMutation.isPending}
          />
        </>
      )}
    </>
  );
};

export default PositionsManagement;