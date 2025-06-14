
import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Plus } from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { Position } from "@/types/position";
import { Level } from "@/types/level";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 12;

export default function PositionsTab() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const [newPosition, setNewPosition] = useState<{ name: string; levelId?: number }>({ name: "", levelId: undefined });
  const [editPosition, setEditPosition] = useState<{ id?: number; name: string; levelId?: number }>({ name: "", levelId: undefined });

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

  const filteredPositions = useMemo(() =>
    positions.filter((pos) =>
      pos.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      (pos.level?.name?.toLowerCase() || "").includes(searchText.toLowerCase())
    ), [positions, searchText]);

  const paginatedPositions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPositions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPositions, currentPage]);
  const totalPages = Math.max(1, Math.ceil(filteredPositions.length / ITEMS_PER_PAGE));

  // Add
  const handleAdd = async () => {
    if (!newPosition.name || !newPosition.levelId) {
      toast.error("Position Name & Organizational Level are required.");
      return;
    }
    try {
      await apiClient.positions.create({ name: newPosition.name, levelId: newPosition.levelId });
      toast.success("Position added!");
      setIsAddOpen(false);
      setNewPosition({ name: "", levelId: undefined });
      fetchPositions();
    } catch (e: any) {
      toast.error(e.message || "Failed to add position.");
    }
  };

  // Edit
  const openEdit = (pos: Position) => {
    setSelectedPosition(pos);
    setEditPosition({ id: pos.id, name: pos.name, levelId: pos.level?.id });
    setIsEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editPosition.id || !editPosition.name || !editPosition.levelId) {
      toast.error("All fields are required.");
      return;
    }
    try {
      await apiClient.positions.update(editPosition.id, {
        name: editPosition.name,
        levelId: editPosition.levelId,
      });
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
                <TableHead>Organizational Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-20">Loading...</TableCell>
                </TableRow>
              ) : paginatedPositions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground h-20">No positions found</TableCell>
                </TableRow>
              ) : (
                paginatedPositions.map(pos => (
                  <TableRow key={pos.id}>
                    <TableCell>{pos.name}</TableCell>
                    <TableCell>{pos.level?.name || "N/A"}</TableCell>
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
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Add Position</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="pos-name">Position Name</Label>
              <Input
                id="pos-name"
                value={newPosition.name}
                onChange={e => setNewPosition(p => ({ ...p, name: e.target.value }))}
                placeholder="E.g. Senior Driver"
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="pos-level">Organizational Level</Label>
              <select
                id="pos-level"
                className="w-full border rounded px-2 py-1"
                value={newPosition.levelId ?? ""}
                onChange={e => setNewPosition(p => ({ ...p, levelId: +e.target.value }))}
              >
                <option value="">Select level</option>
                {levels.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleAdd}>Add Position</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Position Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Edit Position</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="edit-pos-name">Position Name</Label>
              <Input
                id="edit-pos-name"
                value={editPosition.name}
                onChange={e => setEditPosition(p => ({ ...p, name: e.target.value }))}
                placeholder="E.g. Senior Driver"
              />
            </div>
            <div className="space-y-2 mt-2">
              <Label htmlFor="edit-pos-level">Organizational Level</Label>
              <select
                id="edit-pos-level"
                className="w-full border rounded px-2 py-1"
                value={editPosition.levelId ?? ""}
                onChange={e => setEditPosition(p => ({ ...p, levelId: +e.target.value }))}
              >
                <option value="">Select level</option>
                {levels.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" onClick={handleEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
