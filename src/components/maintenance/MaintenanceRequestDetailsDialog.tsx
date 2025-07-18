import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MaintenanceRequestFull } from "@/types/maintenance";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface MaintenanceRequestDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: MaintenanceRequestFull | null;
}

const DetailItem = ({
    label,
    value,
    isBadge = false,
}: {
    label: string;
    value?: string | number | boolean | React.ReactNode | null;
    isBadge?: boolean;
}) =>
    value !== null && value !== undefined && value !== "" ? (
        <div className="grid grid-cols-3 gap-2 py-1.5">
            <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
            <dd className={`text-sm col-span-2 ${isBadge ? "" : "whitespace-pre-wrap"}`}>
                {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
            </dd>
        </div>
    ) : null;

export function MaintenanceRequestDetailsDialog({
    isOpen,
    onClose,
    request,
}: MaintenanceRequestDetailsDialogProps) {
    if (!request) return null;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), "MMM dd, yyyy 'at' HH:mm");
        } catch (e) {
            return dateString;
        }
    };

    const renderStatusBadge = (status: MaintenanceRequestFull["status"]) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    >
                        Pending
                    </Badge>
                );
            case "APPROVED":
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    >
                        Approved
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    >
                        Rejected
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
                    <DialogTitle>Maintenance Request Details - ID: {request.id}</DialogTitle>
                    <DialogDescription>
                        Viewing details for: "{request.title}" on vehicle{" "}
                        {request.vehicle.plateNumber}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                        <DetailItem
                            label="Status"
                            value={renderStatusBadge(request.status)}
                            isBadge
                        />
                        <DetailItem label="Vehicle Plate" value={request.vehicle.plateNumber} />
                        <DetailItem label="Level" value={request.level?.name || "-"} />
                        <DetailItem label="Title" value={request.title} />
                        <DetailItem label="Description" value={request.description} />
                        <DetailItem label="Requested By" value={request.requestedBy.fullName} />
                        <DetailItem label="Requested At" value={formatDate(request.requestedAt)} />
                        {request.actedAt && (
                            <>
                                <DetailItem label="Action At" value={formatDate(request.actedAt)} />
                                <DetailItem label="Action Note" value={request.actionNote} />
                            </>
                        )}
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
