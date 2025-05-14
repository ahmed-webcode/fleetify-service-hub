
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  apiClient, 
  Position,
  CreatePositionDto,
  UpdatePositionDto,
  PositionQueryParams,
  PageResponse 
} from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from "@/components/ui/pagination";
import { Plus, Edit, Trash2 } from "lucide-react";
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
    direction: 'DESC'
  });
  
  const queryClient = useQueryClient();

  // Fetch positions with pagination
  const { 
    data: positionsResponse,
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['positions', queryParams],
    queryFn: () => apiClient.positions.getAll(queryParams),
  });

  // Extract positions array and pagination details
  const positions: Position[] = positionsResponse?.content || [];
  const totalPages = positionsResponse?.totalPages || 0;
  const currentPage = positionsResponse?.number || 0;
  
  // Fetch and store levels in localStorage on component mount
  useEffect(() => {
    fetchAndStoreLevels();
  }, []);

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.positions.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success("Position deleted successfully");
      setIsDeleteDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to delete position: ${error.message}`);
    }
  });

  // Handle edit button click
  const handleEdit = (position: Position) => {
    setSelectedPosition(position);
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDelete = (position: Position) => {
    setSelectedPosition(position);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedPosition) {
      deleteMutation.mutate(selectedPosition.id);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  // Handle page size change
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setQueryParams(prev => ({ ...prev, size: newSize, page: 0 }));
  };

  // Handle sorting change
  const handleSortChange = (sortBy: string) => {
    setQueryParams(prev => ({
      ...prev,
      sortBy,
      direction: prev.sortBy === sortBy && prev.direction === 'ASC' ? 'DESC' : 'ASC'
    }));
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    // Logic for showing limited page numbers with ellipsis
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => handlePageChange(0)} aria-label="Go to first page">
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink 
            onClick={() => handlePageChange(totalPages - 1)}
            aria-label="Go to last page"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Positions Management</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Add Position
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Controls */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Show</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={queryParams.size}
                onChange={handlePageSizeChange}
              >
                {PAGE_SIZE_OPTIONS.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <span className="text-sm text-gray-500">entries</span>
            </div>
            <div className="text-sm text-gray-500">
              {positionsResponse?.totalElements 
                ? `Showing ${currentPage * queryParams.size! + 1} to ${Math.min((currentPage + 1) * queryParams.size!, positionsResponse.totalElements)} of ${positionsResponse.totalElements} entries` 
                : 'No entries'}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
              Failed to load positions. Please try again later.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSortChange('name')}
                  >
                    Name
                    {queryParams.sortBy === 'name' && (
                      <span className="ml-1">{queryParams.direction === 'ASC' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSortChange('levelName')}
                  >
                    Level
                    {queryParams.sortBy === 'levelName' && (
                      <span className="ml-1">{queryParams.direction === 'ASC' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSortChange('fuelQuota')}
                  >
                    Fuel Quota (L)
                    {queryParams.sortBy === 'fuelQuota' && (
                      <span className="ml-1">{queryParams.direction === 'ASC' ? '↑' : '↓'}</span>
                    )}
                  </TableHead>
                  <TableHead>Vehicle Entitlement</TableHead>
                  <TableHead>Policy Reference</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                      No positions found. Add your first position.
                    </TableCell>
                  </TableRow>
                ) : (
                  positions.map((position) => (
                    <TableRow key={position.id}>
                      <TableCell className="font-medium">{position.name}</TableCell>
                      <TableCell>{position.levelName}</TableCell>
                      <TableCell>{position.fuelQuota}</TableCell>
                      <TableCell>
                        {position.vehicleEntitlement ? 
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Yes</span> :
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">No</span>
                        }
                      </TableCell>
                      <TableCell>{position.policyReference}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEdit(position)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(position)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
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

          {/* Pagination */}
          {!isLoading && totalPages > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div>
                <p className="text-sm text-gray-500">
                  Page {currentPage + 1} of {totalPages}
                </p>
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)} 
                      aria-disabled={currentPage === 0} 
                      className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)} 
                      aria-disabled={currentPage === totalPages - 1} 
                      className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      <AddPositionDialog 
        open={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />

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
