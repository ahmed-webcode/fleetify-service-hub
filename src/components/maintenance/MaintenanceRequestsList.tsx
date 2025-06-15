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
import { MaintenanceRequestDto } from "@/types/maintenance";
import { RequestStatus } from "@/types/common";
import { format } from "date-fns";
import { MaintenanceRequestActionDialog } from "./MaintenanceRequestActionDialog";
import { MaintenanceRequestDetailsDialog } from "./MaintenanceRequestDetailsDialog";
import { HasPermission } from "@/components/auth/HasPermission";

interface MaintenanceRequestsListProps {
    requests: MaintenanceRequestDto[];
    onRefresh: () => void;
}

export function MaintenanceRequestsList({ requests, onRefresh }: MaintenanceRequestsListProps) {
    const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequestDto | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const handleAction = (request: MaintenanceRequestDto) => {
        setSelectedRequest(request);
        setActionDialogOpen(true);
    };

    const handleViewDetails = (request: MaintenanceRequestDto) => {
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
            case RequestStatus.CANCELLED: // Assuming CANCELLED is a possible status for maintenance too
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
                            <TableHead>Title</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Est. Cost</TableHead>
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
                                <TableCell>{request.plateNumber}</TableCell>
                                <TableCell
                                    className="font-medium max-w-[250px] truncate"
                                    title={request.title}
                                >
                                    {request.title}
                                </TableCell>
                                <TableCell>{request.maintenanceType}</TableCell>
                                <TableCell>
                                    {request.estimatedCost ? `$${request.estimatedCost}` : "N/A"}
                                </TableCell>
                                <TableCell>{request.requestedBy}</TableCell>
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
                                        {request.status === RequestStatus.PENDING ? (
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
