import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TripRequestDto } from "@/types/trip";
import { RequestStatus } from "@/types/common";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TripRequestDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: TripRequestDto | null;
}

const DetailItem = ({
    label,
    value,
}: {
    label: string;
    value?: string | number | boolean | React.ReactNode | null;
}) =>
    value !== null && value !== undefined && value !== "" ? (
        <div className="grid grid-cols-3 gap-2 py-1.5">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className="text-sm col-span-2">
                {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
            </dd>
        </div>
    ) : null;

export function TripRequestDetailsDialog({
    isOpen,
    onClose,
    request,
}: TripRequestDetailsDialogProps) {
    if (!request) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
        } catch (e) {
            return dateString;
        }
    };

    const renderStatusBadge = (status: RequestStatus) => {
        switch (status) {
            case RequestStatus.PENDING:
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                        Pending
                    </Badge>
                );
            case RequestStatus.APPROVED:
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                        Approved
                    </Badge>
                );
            case RequestStatus.REJECTED:
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    >
                        Rejected
                    </Badge>
                );
            case RequestStatus.CANCELLED:
                return (
                    <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                    >
                        Cancelled
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Trip Request Details - ID: {request.id}</DialogTitle>
                    <DialogDescription>
                        Viewing details for trip: "{request.purpose}"
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                        <DetailItem label="Status" value={renderStatusBadge(request.status)} />
                        <DetailItem label="Purpose" value={request.purpose} />
                        <DetailItem label="Description" value={request.description} />
                        <DetailItem label="Start Time" value={formatDate(request.startTime)} />
                        <DetailItem label="End Time" value={formatDate(request.endTime)} />
                        <DetailItem label="Start Location" value={request.startLocation} />
                        <DetailItem label="End Location" value={request.endLocation} />
                        <DetailItem label="Round Trip" value={request.isRoundTrip} />
                        <DetailItem label="Passengers" value={request.passengerCount} />
                        <DetailItem label="Requested By" value={request.requestedBy} />
                        <DetailItem label="Requested At" value={formatDate(request.requestedAt)} />

                        {/* Assignment Details */}
                        {request.vehiclePlateNumber && (
                            <DetailItem
                                label="Assigned Vehicle"
                                value={request.vehiclePlateNumber}
                            />
                        )}
                        {request.driverName && (
                            <DetailItem label="Assigned Driver" value={request.driverName} />
                        )}

                        {/* Action Details */}
                        {request.actedBy && (
                            <>
                                <DetailItem label="Action By" value={request.actedBy} />
                                <DetailItem label="Action At" value={formatDate(request.actedAt)} />
                                <DetailItem label="Action Note" value={request.actionNote} />
                            </>
                        )}
                        {/* <DetailItem label="Created At" value={formatDate(request.createdAt)} />
                        <DetailItem label="Last Updated" value={formatDate(request.updatedAt)} /> */}
                    </dl>
                </div>
                <div className="pt-4 flex justify-end">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
