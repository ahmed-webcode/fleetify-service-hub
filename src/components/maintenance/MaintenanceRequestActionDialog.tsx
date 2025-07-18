import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { MaintenanceRequestFull, MaintenanceRequestAction } from "@/types/maintenance";

interface MaintenanceRequestActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: MaintenanceRequestFull | null;
    onActionComplete: () => void;
}

export function MaintenanceRequestActionDialog({
    isOpen,
    onClose,
    request,
    onActionComplete,
}: MaintenanceRequestActionDialogProps) {
    const [action, setAction] = useState<"APPROVE" | "REJECT" | undefined>(undefined);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!request || !action) {
            toast.error("Please select an action.");
            return;
        }
        if (action === "REJECT" && !reason.trim()) {
            toast.error("Reason is required for rejection.");
            return;
        }

        setLoading(true);
        try {
            const actionData: MaintenanceRequestAction = {
                action: action,
                actionNote: reason || undefined,
            };
            await apiClient.maintenance.requests.act(request.id, actionData);
            toast.success(`Maintenance request ${action.toLowerCase()}ed successfully.`);
            onActionComplete();
            handleClose();
        } catch (error: any) {
            toast.error("Failed to process request: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setAction(undefined);
        setReason("");
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Maintenance Request #{request.id}</DialogTitle>
                    <DialogDescription>
                        Approve or reject the maintenance request: "{request.title}" for vehicle{" "}
                        {request.vehicle.plateNumber}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="action">Action</Label>
                        <Select
                            onValueChange={(value) => setAction(value as "APPROVE" | "REJECT")}
                            value={action}
                        >
                            <SelectTrigger id="action">
                                <SelectValue placeholder="Select an action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="APPROVE">Approve</SelectItem>
                                <SelectItem value="REJECT">Reject</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {action === "APPROVE" && (
                        <div>
                            <Label htmlFor="reason">Note / Reason (Optional)</Label>
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Add an optional note for approval"
                            />
                        </div>
                    )}

                    {action === "REJECT" && (
                        <div>
                            <Label htmlFor="reason">Reason (Required)</Label>
                            <Textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Provide a reason for your action"
                            />
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={loading || !action}>
                        {loading ? "Processing..." : "Submit Action"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
