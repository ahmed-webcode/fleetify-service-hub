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
import { MaintenanceRequestDto, MaintenanceRequestActionDto } from "@/types/maintenance";
import { ActionType } from "@/types/common";

interface MaintenanceRequestActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: MaintenanceRequestDto | null;
    onActionComplete: () => void;
}

export function MaintenanceRequestActionDialog({
    isOpen,
    onClose,
    request,
    onActionComplete,
}: MaintenanceRequestActionDialogProps) {
    const [action, setAction] = useState<ActionType | undefined>(undefined);
    const [reason, setReason] = useState("");
    const [estimatedCost, setEstimatedCost] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!request || !action) {
            toast.error("Please select an action.");
            return;
        }
        if (action === ActionType.REJECT && !reason.trim()) {
            toast.error("Reason is required for rejection.");
            return;
        }

        setLoading(true);
        try {
            const actionData: MaintenanceRequestActionDto = {
                action: action,
                actionNote: reason || undefined,
                estimatedCost: estimatedCost,
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
        setEstimatedCost(undefined);
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
                        {request.plateNumber}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="action">Action</Label>
                        <Select
                            onValueChange={(value) => setAction(value as ActionType)}
                            value={action}
                        >
                            <SelectTrigger id="action">
                                <SelectValue placeholder="Select an action" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ActionType.APPROVE}>Approve</SelectItem>
                                <SelectItem value={ActionType.REJECT}>Reject</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {action === ActionType.APPROVE && (
                        <>
                            <div>
                                <Label htmlFor="estimatedCost">Estimated Cost (Optional)</Label>
                                <Input
                                    id="estimatedCost"
                                    type="number"
                                    value={estimatedCost || ""}
                                    onChange={(e) =>
                                        setEstimatedCost(
                                            e.target.value ? Number(e.target.value) : undefined
                                        )
                                    }
                                    placeholder="Enter estimated cost"
                                />
                            </div>
                            <div>
                                <Label htmlFor="reason">Note / Reason (Optional)</Label>
                                <Textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Add an optional note for approval"
                                />
                            </div>
                        </>
                    )}

                    {action === ActionType.REJECT && (
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
