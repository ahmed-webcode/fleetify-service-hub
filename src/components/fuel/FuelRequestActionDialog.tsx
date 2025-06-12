import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ActionType } from "@/types/common";
import { FuelRequestActionDto, FuelRequestDto } from "@/types/fuel";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FuelRequestActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: FuelRequestDto | null;
    onActionComplete?: () => void;
}

// Helper to map our enum to the tab's string value
const getTabValueFromActionType = (type: ActionType): string => {
    switch (type) {
        case ActionType.APPROVE_WITH_MODIFICATION:
            return "modify";
        case ActionType.REJECT:
            return "reject";
        case ActionType.APPROVE:
        default:
            return "approve";
    }
};

export function FuelRequestActionDialog({
    isOpen,
    onClose,
    request,
    onActionComplete,
}: FuelRequestActionDialogProps) {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<ActionType>(ActionType.APPROVE);
    const [actedAmount, setActedAmount] = useState<string>("");
    const [reason, setReason] = useState<string>("");

    // Effect to reset the form state when a new request is loaded
    useEffect(() => {
        if (request) {
            setActionType(ActionType.APPROVE);
            setActedAmount(request.requestedAmount?.toString() || "");
            setReason("");
        }
    }, [request]); // Dependency array ensures this runs when `request` changes

    if (!request) return null;

    const handleClose = () => {
        // No need to call resetForm here as useEffect handles it,
        // but it's good practice for the manual cancel action.
        onClose();
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "PPpp");
        } catch (e) {
            return dateString;
        }
    };

    // Centralized handler for tab changes
    const handleTabChange = (tabValue: string) => {
        setReason(""); // Clear reason when switching tabs for a better user experience
        switch (tabValue) {
            case "modify":
                setActionType(ActionType.APPROVE_WITH_MODIFICATION);
                break;
            case "reject":
                setActionType(ActionType.REJECT);
                break;
            case "approve":
            default:
                setActionType(ActionType.APPROVE);
                break;
        }
    };

    const handleSubmit = async () => {
        if (!actionType || !request) return;

        try {
            setLoading(true);
            const actionData: FuelRequestActionDto = {
                action: actionType,
            };

            if (actionType === ActionType.APPROVE_WITH_MODIFICATION) {
                if (!actedAmount || parseFloat(actedAmount) <= 0) {
                    toast.error("Please enter a valid amount for modification.");
                    setLoading(false); // Make sure to stop loading on validation error
                    return;
                }
                actionData.actedAmount = parseFloat(actedAmount);
            }
            
            if (actionType === ActionType.REJECT && !reason.trim()) {
                toast.error("A reason is required to reject a request.");
                setLoading(false);
                return;
            }

            if (reason.trim()) {
                actionData.actionNote = reason.trim();
            }
            
            await apiClient.fuel.requests.act(request.id, actionData);
            
            toast.success(
                actionType === ActionType.REJECT
                    ? "Request rejected successfully"
                    : "Request approved successfully"
            );

            if (onActionComplete) onActionComplete();
            onClose(); // Close the dialog on success

        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // Dynamic button text for better UX
    const getButtonText = () => {
        if(loading) return "Processing...";
        switch(actionType) {
            case ActionType.APPROVE: return "Approve Request";
            case ActionType.APPROVE_WITH_MODIFICATION: return "Submit Modification";
            case ActionType.REJECT: return "Reject Request";
            default: return "Submit";
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Review Fuel Request</DialogTitle>
                    <DialogDescription>
                        Review and take action on this fuel request
                    </DialogDescription>
                </DialogHeader>

                <Card className="border-0 shadow-none">
                    <CardHeader className="p-0">
                        <CardTitle className="text-base">Request Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 py-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium">Requested By:</div>
                            <div>{request.requestedBy}</div>
                            <div className="font-medium">Department:</div>
                            <div>{request.levelName}</div>
                            <div className="font-medium">Target:</div>
                            <div>
                                {request.requestType === "VEHICLE"
                                    ? `Vehicle (${request.vehiclePlateNumber})`
                                    : "Generator"}
                            </div>
                            <div className="font-medium">Fuel Type:</div>
                            <div>{request.fuelTypeName}</div>
                            <div className="font-medium">Amount:</div>
                            <div>{request.requestedAmount} liters</div>
                            <div className="font-medium">Requested On:</div>
                            <div>{formatDate(request.requestedAt)}</div>
                            {request.requestNote && (
                                <>
                                    <div className="font-medium col-span-2">Note:</div>
                                    <div className="col-span-2 bg-muted/30 p-2 rounded-md text-xs">
                                        {request.requestNote}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* --- FIX IS HERE --- */}
                <Tabs
                    value={getTabValueFromActionType(actionType)}
                    onValueChange={handleTabChange}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-4">
                        {/* No more onClick handlers needed here! */}
                        <TabsTrigger value="approve">Approve</TabsTrigger>
                        <TabsTrigger value="modify">Modify</TabsTrigger>
                        <TabsTrigger value="reject">Reject</TabsTrigger>
                    </TabsList>
                    
                    {/* The content for each tab remains the same */}
                    <TabsContent value="approve">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason (optional)</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="Add a note for approval"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Approving will grant the full requested amount of{" "}
                                {request.requestedAmount} liters.
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="modify">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Modified Amount (Liters)</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    value={actedAmount}
                                    onChange={(e) => setActedAmount(e.target.value)}
                                    placeholder="Enter modified amount"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modifyReason">Reason for Modification (optional)</Label>
                                <Textarea
                                    id="modifyReason"
                                    placeholder="Explain why you're modifying the requested amount"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="reject">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="rejectReason">Rejection Reason (Required)</Label>
                                <Textarea
                                    id="rejectReason"
                                    placeholder="Provide a reason for rejecting this request"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={handleClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {getButtonText()}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}