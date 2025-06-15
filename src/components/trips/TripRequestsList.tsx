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
import { TripRequestDto } from "@/types/trip";
import { RequestStatus } from "@/types/common";
import { format } from "date-fns";
import { TripRequestActionDialog } from "./TripRequestActionDialog";
import { TripRequestDetailsDialog } from "./TripRequestDetailsDialog";
import { HasPermission } from "@/components/auth/HasPermission";

interface TripRequestsListProps {
    requests: TripRequestDto[];
    onRefresh: () => void;
}

export function TripRequestsList({ requests, onRefresh }: TripRequestsListProps) {
    const [selectedRequest, setSelectedRequest] = useState<TripRequestDto | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const handleAction = (request: TripRequestDto) => {
        setSelectedRequest(request);
        setActionDialogOpen(true);
    };

    const handleViewDetails = (request: TripRequestDto) => {
        setSelectedRequest(request);
        setDetailsDialogOpen(true);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "MMM dd, yyyy HH:mm");
        } catch (e) {
            return dateString; // Fallback if date is not parsable
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

    if (requests.length === 0) {
        // This specific message is handled by the parent TripManagement component
        // But you can keep a simpler one here if this component is used elsewhere
        return (
            <div className="text-center py-8 text-muted-foreground">
                No trip requests to display for the current filter.
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
                            <TableHead>Purpose</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Requested At</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                        {requests.map((request) => (
                            <TableRow key={request.id} className="hover:bg-muted/30">
                                <TableCell>{request.id}</TableCell>
                                <TableCell
                                    className="font-medium max-w-[200px] truncate"
                                    title={request.purpose}
                                >
                                    {request.purpose}
                                </TableCell>
                                <TableCell>{request.requestedBy}</TableCell>
                                <TableCell>{formatDate(request.startTime)}</TableCell>
                                <TableCell>{formatDate(request.endTime)}</TableCell>
                                <TableCell>{renderStatusBadge(request.status)}</TableCell>
                                <TableCell>{formatDate(request.requestedAt)}</TableCell>
                                <TableCell className="text-right">
                                    <HasPermission
                                        permission="manage_trip_request"
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

            <TripRequestActionDialog
                isOpen={actionDialogOpen}
                onClose={() => setActionDialogOpen(false)}
                request={selectedRequest}
                onActionComplete={() => {
                    setActionDialogOpen(false);
                    onRefresh();
                }}
            />

            <TripRequestDetailsDialog
                isOpen={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                request={selectedRequest}
            />
        </>
    );
}
