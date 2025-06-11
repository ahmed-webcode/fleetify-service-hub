import { useState } from "react";
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
    CardDescription,
    CardFooter,
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

export function FuelRequestActionDialog({
    isOpen,
    onClose,
    request,
    onActionComplete,
}: FuelRequestActionDialogProps) {
    const [loading, setLoading] = useState(false);
    const [actionType, setActionType] = useState<ActionType | null>(null);
    const [actedAmount, setActedAmount] = useState<string>("");
    const [reason, setReason] = useState<string>("");

    if (!request) return null;

    const resetForm = () => {
        setActionType(null);
        setActedAmount(request.requestedAmount?.toString() || "");
        setReason("");
    };

    const handleClose = () => {
        resetForm();
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

    const handleSubmit = async () => {
        if (!actionType || !request) return;

        try {
            setLoading(true);
            const actionData: FuelRequestActionDto = {
                action: actionType,
            };

            if (actionType === ActionType.APPROVE_WITH_MODIFICATION) {
                if (!actedAmount || parseFloat(actedAmount) <= 0) {
                    toast.error("Please enter a valid amount");
                    return;
                }
                actionData.actedAmount = parseFloat(actedAmount);
            }

            if (reason.trim()) {
                actionData.actionReason = reason.trim();
            }

            await apiClient.fuel.requests.act(request.id, actionData);
            toast.success(
                actionType === ActionType.REJECT
                    ? "Request rejected successfully"
                    : "Request approved successfully"
            );
            if (onActionComplete) onActionComplete();
        } catch (error: any) {
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
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
                                {request.targetType === "VEHICLE"
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

                <Tabs defaultValue="approve" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger
                            value="approve"
                            onClick={() => setActionType(ActionType.APPROVE)}
                        >
                            Approve
                        </TabsTrigger>
                        <TabsTrigger
                            value="modify"
                            onClick={() => setActionType(ActionType.APPROVE_WITH_MODIFICATION)}
                        >
                            Modify
                        </TabsTrigger>
                        <TabsTrigger
                            value="reject"
                            onClick={() => setActionType(ActionType.REJECT)}
                        >
                            Reject
                        </TabsTrigger>
                    </TabsList>

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
                                <Label htmlFor="modifyReason">Reason for Modification</Label>
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
                                <Label htmlFor="rejectReason">Rejection Reason</Label>
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
                    <Button onClick={handleSubmit} disabled={!!actionType || loading}>
                        {loading ? "Processing..." : "Submit"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
