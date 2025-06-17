
import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Plus } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { Position, PositionStatus } from "@/types/position";
import { Level } from "@/types/level";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
// import shadcn select components
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 12;

// Helper to return badge style for each status
function getStatusBadge(status: string | undefined) {
  switch (status) {
    case PositionStatus.ACTIVE:
      return { variant: "success", label: "Active" };
    case PositionStatus.INACTIVE:
      return { variant: "secondary", label: "Inactive" };
    case PositionStatus.ON_HOLD:
      return { variant: "outline", label: "On Hold" };
    default:
      return { variant: "outline", label: status || "N/A" };
  }
}

export default function PositionsTab() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Form states
  const [newPosition, setNewPosition] = useState<{
    name: string;
    description: string;
    fuelQuota: number;
    vehicleEntitlement: boolean;
    policyReference: string;
    levelId?: number;
    status: string;
  }>({
    name: "",
    description: "",
    fuelQuota: 0,
    vehicleEntitlement: false,
    policyReference: "",
    levelId: undefined,
    status: "ACTIVE",
  });
  const [editPosition, setEditPosition] = useState<{
    id?: number;
    name: string;
    description: string;
    fuelQuota: number;
    vehicleEntitlement: boolean;
    policyReference: string;
    levelId?: number;
    status: string;
  }>({
    name: "",
    description: "",
    fuelQuota: 0,
    vehicleEntitlement: false,
    policyReference: "",
    levelId: undefined,
    status: "ACTIVE",
  });

  useEffect(() => {
    fetchPositions();
    fetchLevels();
  }, []);

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.positions.getAll({ size: 200, page: 0 });
      setPositions(res?.content || []);
    } catch (e) {
      toast.error("Failed to load positions.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLevels = async () => {
    try {
      const lvls = await apiClient.levels.getAll();
      setLevels(lvls || []);
    } catch {
      toast.error("Failed to fetch levels.");
    }
  };

  // Filter only non-structural levels to use in both dropdowns
  const nonStructuralLevels = useMemo(
    () => levels.filter((l) => !l.isStructural),
    [levels]
  );

  const filteredPositions = useMemo(
    () =>
      positions.filter(
        (pos) =>
          pos.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          (pos.levelName?.toLowerCase() || "").includes(searchText.toLowerCase())
      ),
    [positions, searchText]
  );

  const paginatedPositions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPositions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPositions, currentPage]);
  const totalPages = Math.max(1, Math.ceil(filteredPositions.length / ITEMS_PER_PAGE));

  // Add
  const handleAdd = async () => {
    if (
      !newPosition.name ||
      !newPosition.description ||
      newPosition.levelId === undefined ||
      !newPosition.policyReference ||
      !newPosition.status
    ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      await apiClient.positions.create({
        name: newPosition.name,
        description: newPosition.description,
        fuelQuota: Number(newPosition.fuelQuota),
        vehicleEntitlement: Boolean(newPosition.vehicleEntitlement),
        policyReference: newPosition.policyReference,
        levelId: newPosition.levelId,
        status: newPosition.status as any,
      });
      toast.success("Position added!");
      setIsAddOpen(false);
      setNewPosition({
        name: "",
        description: "",
        fuelQuota: 0,
        vehicleEntitlement: false,
        policyReference: "",
        levelId: undefined,
        status: "ACTIVE",
      });
      fetchPositions();
    } catch (e: any) {
      toast.error(e.message || "Failed to add position.");
    }
  };

  // Edit
  const openEdit = (pos: Position) => {
    setSelectedPosition(pos);
    setEditPosition({
      id: pos.id,
      name: pos.name,
      description: pos.description,
      fuelQuota: pos.fuelQuota,
      vehicleEntitlement: !!pos.vehicleEntitlement,
      policyReference: pos.policyReference,
      levelId: levels.find((l) => l.name === pos.levelName)?.id ?? undefined,
      status: pos.status || "ACTIVE",
    });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (
      !editPosition.id ||
      !editPosition.name ||
      !editPosition.description ||
      editPosition.levelId === undefined ||
      !editPosition.policyReference ||
      !editPosition.status
    ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      // Only send fields that changed
      const original = positions.find((p) => p.id === editPosition.id);
      if (!original) return;
      const changes: any = { id: editPosition.id };
      if (editPosition.name !== original.name) changes.name = editPosition.name;
      if (editPosition.description !== original.description) changes.description = editPosition.description;
      if (editPosition.levelId !== levels.find((l) => l.name === original.levelName)?.id)
        changes.levelId = editPosition.levelId;
      if (editPosition.fuelQuota !== original.fuelQuota) changes.fuelQuota = editPosition.fuelQuota;
      if (editPosition.vehicleEntitlement !== original.vehicleEntitlement)
        changes.vehicleEntitlement = editPosition.vehicleEntitlement;
      if (editPosition.policyReference !== original.policyReference)
        changes.policyReference = editPosition.policyReference;
      if (editPosition.status !== original.status) changes.status = editPosition.status;

      await apiClient.positions.update(changes);
      toast.success("Position updated!");
      setIsEditOpen(false);
      setSelectedPosition(null);
      fetchPositions();
    } catch (e: any) {
      toast.error(e.message || "Failed to update position.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              placeholder="Search positions or levels..."
              value={searchText}
              onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }}
              className="pl-3"
            />
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Position
          </Button>
        </div>

        <div className="rounded-md border min-h-[150px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Fuel Quota</TableHead>
                <TableHead>Vehicle Entitlement</TableHead>
                <TableHead>Policy Reference</TableHead>
                <TableHead>Organizational Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground h-20">Loading...</TableCell>
                </TableRow>
              ) : paginatedPositions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground h-20">No positions found</TableCell>
                </TableRow>
              ) : (
                paginatedPositions.map(pos => (
                  <TableRow key={pos.id}>
                    <TableCell>{pos.name}</TableCell>
                    <TableCell>{pos.description}</TableCell>
                    <TableCell>{pos.fuelQuota}</TableCell>
                    <TableCell>{pos.vehicleEntitlement ? "Yes" : "No"}</TableCell>
                    <TableCell>{pos.policyReference}</TableCell>
                    <TableCell>{pos.levelName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadge(pos.status).variant as any}>
                        {getStatusBadge(pos.status).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(pos)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        )}

        {/* Add Position Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Position</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAdd();
              }}
              className="space-y-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pos-name">Position Name</Label>
                  <Input
                    id="pos-name"
                    value={newPosition.name}
                    onChange={e => setNewPosition(p => ({ ...p, name: e.target.value }))}
                    placeholder="E.g. Senior Driver"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-description">Description</Label>
                  <Input
                    id="pos-description"
                    value={newPosition.description}
                    onChange={e => setNewPosition(p => ({ ...p, description: e.target.value }))}
                    placeholder="Position description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-fuelquota">Weekly Fuel Quota (Liters)</Label>
                  <Input
                    id="pos-fuelquota"
                    type="number"
                    value={newPosition.fuelQuota}
                    min={0}
                    onChange={e => setNewPosition(p => ({ ...p, fuelQuota: parseInt(e.target.value) || 0 }))}
                    placeholder="Fuel quota in liters"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    id="pos-vehicleEntitlement"
                    type="checkbox"
                    checked={newPosition.vehicleEntitlement}
                    onChange={e => setNewPosition(p => ({ ...p, vehicleEntitlement: e.target.checked }))}
                    className="mr-2"
                  />
                  <Label htmlFor="pos-vehicleEntitlement">Vehicle Entitlement</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-policyReference">Policy Reference</Label>
                  <Input
                    id="pos-policyReference"
                    value={newPosition.policyReference}
                    onChange={e => setNewPosition(p => ({ ...p, policyReference: e.target.value }))}
                    placeholder="Policy reference"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-level">Organizational Level</Label>
                  <Select
                    value={newPosition.levelId ? String(newPosition.levelId) : ""}
                    onValueChange={v =>
                      setNewPosition(p => ({
                        ...p,
                        levelId: v ? Number(v) : undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {nonStructuralLevels.map(l => (
                        <SelectItem key={l.id} value={String(l.id)}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos-status">Status</Label>
                  <Select
                    value={newPosition.status}
                    onValueChange={v =>
                      setNewPosition(p => ({
                        ...p,
                        status: v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Add Position</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Position Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Position</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleEdit();
              }}
              className="space-y-2"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pos-name">Position Name</Label>
                  <Input
                    id="edit-pos-name"
                    value={editPosition.name}
                    onChange={e =>
                      setEditPosition(p => ({ ...p, name: e.target.value }))
                    }
                    placeholder="E.g. Senior Driver"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pos-description">Description</Label>
                  <Input
                    id="edit-pos-description"
                    value={editPosition.description}
                    onChange={e =>
                      setEditPosition(p => ({ ...p, description: e.target.value }))
                    }
                    placeholder="Position description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pos-fuelquota">
                    Weekly Fuel Quota (Liters)
                  </Label>
                  <Input
                    id="edit-pos-fuelquota"
                    type="number"
                    value={editPosition.fuelQuota}
                    min={0}
                    onChange={e =>
                      setEditPosition(p => ({
                        ...p,
                        fuelQuota: parseInt(e.target.value) || 0,
                      }))
                    }
                    placeholder="Fuel quota in liters"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    id="edit-pos-vehicleEntitlement"
                    type="checkbox"
                    checked={editPosition.vehicleEntitlement}
                    onChange={e =>
                      setEditPosition(p => ({
                        ...p,
                        vehicleEntitlement: e.target.checked,
                      }))
                    }
                    className="mr-2"
                  />
                  <Label htmlFor="edit-pos-vehicleEntitlement">
                    Vehicle Entitlement
                  </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pos-policyReference">
                    Policy Reference
                  </Label>
                  <Input
                    id="edit-pos-policyReference"
                    value={editPosition.policyReference}
                    onChange={e =>
                      setEditPosition(p => ({
                        ...p,
                        policyReference: e.target.value,
                      }))
                    }
                    placeholder="Policy reference"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pos-level">Organizational Level</Label>
                  <Select
                    value={editPosition.levelId ? String(editPosition.levelId) : ""}
                    onValueChange={v =>
                      setEditPosition(p => ({
                        ...p,
                        levelId: v ? Number(v) : undefined,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {nonStructuralLevels.map(l => (
                        <SelectItem key={l.id} value={String(l.id)}>
                          {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pos-status">Status</Label>
                  <Select
                    value={editPosition.status}
                    onValueChange={v =>
                      setEditPosition(p => ({
                        ...p,
                        status: v,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
