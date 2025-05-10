
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  apiClient, 
  Position,
  CreatePositionDto,
  UpdatePositionDto 
} from "@/lib/apiClient";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { fetchAndStoreLevels } from "@/lib/levelService";
import { AddPositionDialog } from "@/components/positions/AddPositionDialog";
import { EditPositionDialog } from "@/components/positions/EditPositionDialog";
import { ConfirmDeleteDialog } from "@/components/positions/ConfirmDeleteDialog";

const PositionsManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const queryClient = useQueryClient();

  // Fetch positions
  const { 
    data: positions = [] as Position[], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['positions'],
    queryFn: () => apiClient.positions.getAll(),
  });

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

  return (
    <PageLayout>
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

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
            Failed to load positions. Please try again later.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Fuel Quota (L)</TableHead>
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
          </div>
        )}
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
    </PageLayout>
  );
};

export default PositionsManagement;
