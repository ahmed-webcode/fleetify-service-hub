import { useState, useEffect } from "react";
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
import { TripRequestDto, TripRequestActionDto } from "@/types/trip";
import { ActionType } from "@/types/common";
import { useQuery } from "@tanstack/react-query";
import { VehicleDto } from "@/types/vehicle";
import { UserDto } from "@/types/user";

interface TripRequestActionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: TripRequestDto | null;
    onActionComplete: () => void;
}

export function TripRequestActionDialog({
    isOpen,
    onClose,
    request,
    onActionComplete,
}: TripRequestActionDialogProps) {
    const [action, setAction] = useState<ActionType | undefined>(undefined);
    const [reason, setReason] = useState("");
    const [vehicleId, setVehicleId] = useState<number | undefined>(undefined);
    const [driverId, setDriverId] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);

    const { data: vehiclesData, isLoading: vehiclesLoading } = useQuery({
        queryKey: ["vehiclesForTrip"],
        queryFn: () => apiClient.vehicles.getAll({ size: 1000 }), // Fetch all available vehicles
        enabled: isOpen && action === ActionType.APPROVE,
    });

    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ["usersForTrip"],
        queryFn: () => apiClient.users.getAll(), // Fetch all users
        enabled: isOpen && action === ActionType.APPROVE,
        select: (data) => data.filter((user) => user.roles.includes("DRIVER")), // Filter for drivers
    });

    const handleSubmit = async () => {
        if (!request || !action) {
            toast.error("Please select an action.");
            return;
        }
        if (action === ActionType.REJECT && !reason.trim()) {
            toast.error("Reason is required for rejection.");
            return;
        }

        if (action === ActionType.APPROVE && (!vehicleId || !driverId)) {
            toast.error("Vehicle and Driver are required for approval.");
            return;
        }

        setLoading(true);
        try {
            const actionData: TripRequestActionDto = {
                action: action,
                actionReason: reason || undefined,
                vehicleId: vehicleId,
                driverId: driverId,
            };
            await apiClient.trips.requests.act(request.id, actionData);
            toast.success(`Trip request ${action.toLowerCase()}ed successfully.`);
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
        setVehicleId(undefined);
        setDriverId(undefined);
        onClose();
    };

    if (!request) return null;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Review Trip Request #{request.id}</DialogTitle>
                    <DialogDescription>
                        Approve or reject the trip request for: {request.purpose}
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
                                <Label htmlFor="vehicle">Vehicle</Label>
                                <Select
                                    onValueChange={(value) => setVehicleId(Number(value))}
                                    value={vehicleId?.toString()}
                                    disabled={vehiclesLoading}
                                >
                                    <SelectTrigger id="vehicle">
                                        <SelectValue placeholder="Select a vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehiclesData?.content.map((vehicle: VehicleDto) => (
                                            <SelectItem
                                                key={vehicle.id}
                                                value={vehicle.id.toString()}
                                            >
                                                {vehicle.plateNumber} - {vehicle.model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="driver">Driver</Label>
                                <Select
                                    onValueChange={(value) => setDriverId(Number(value))}
                                    value={driverId?.toString()}
                                    disabled={usersLoading}
                                >
                                    <SelectTrigger id="driver">
                                        <SelectValue placeholder="Select a driver" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {usersData?.map((user: UserDto) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>
                                                {user.fullName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
