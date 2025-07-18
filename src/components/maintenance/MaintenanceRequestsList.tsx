import { useState } from "react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MaintenanceRequestFull } from "@/types/maintenance";
import { format } from "date-fns";
import { MaintenanceRequestActionDialog } from "./MaintenanceRequestActionDialog";
import { MaintenanceRequestDetailsDialog } from "./MaintenanceRequestDetailsDialog";
import { HasPermission } from "@/components/auth/HasPermission";

interface MaintenanceRequestsListProps {
    requests: MaintenanceRequestFull[];
    onRefresh: () => void;
}

export function MaintenanceRequestsList({ requests, onRefresh }: MaintenanceRequestsListProps) {
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequestFull | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const handleAction = (request: MaintenanceRequestFull) => {
        setSelectedRequest(request);
        setActionDialogOpen(true);
    };

    const handleViewDetails = (request: MaintenanceRequestFull) => {
        setSelectedRequest(request);
        setDetailsDialogOpen(true);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
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

    if (requests.length === 0) {
        // This specific message is handled by the parent MaintenanceManagement component
        return (
            <div className="text-center py-8 text-muted-foreground">
                No maintenance requests to display for the current filter.
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[80px]">ID</TableHead>
                            <TableHead>Vehicle (Plate)</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested At</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                        {requests.map((request) => (
                            <TableRow key={request.id} className="hover:bg-muted/30">
                                <TableCell>{request.id}</TableCell>
                                <TableCell>{request.vehicle.plateNumber}</TableCell>
                                <TableCell>{request.level?.name || "-"}</TableCell>
                                <TableCell
                                    className="font-medium max-w-[250px] truncate"
                                    title={request.title}
                                >
                                    {request.title}
                                </TableCell>
                                <TableCell>{request.requestedBy.fullName}</TableCell>
                                <TableCell>{renderStatusBadge(request.status)}</TableCell>
                                <TableCell>{formatDate(request.requestedAt)}</TableCell>
                                <TableCell className="text-right">
                                    <HasPermission
                                        permission="manage_maintenance_request"
                                        fallback={
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(request)}
                                            >
                                                Details
                                            </Button>
                                        }
                                    >
                                        {request.status === "PENDING" ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAction(request)}
                                            >
                                                Review
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(request)}
                                            >
                                                Details
                                            </Button>
                                        )}
                                    </HasPermission>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <MaintenanceRequestActionDialog
                isOpen={actionDialogOpen}
                onClose={() => setActionDialogOpen(false)}
                request={selectedRequest}
                onActionComplete={() => {
                    setActionDialogOpen(false);
                    onRefresh();
                }}
            />

            <MaintenanceRequestDetailsDialog
                isOpen={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                request={selectedRequest}
            />
        </>
    );
}
