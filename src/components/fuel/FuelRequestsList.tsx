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
import { FuelRequestDto } from "@/types/fuel";
import { RequestStatus } from "@/types/common";
import { format } from "date-fns";
import { HasPermission } from "@/components/auth/HasPermission";
import { FuelRequestActionDialog } from "./FuelRequestActionDialog";
import { FuelRequestDetailsDialog } from "./FuelRequestDetailsDialog";

interface FuelRequestsListProps {
    requests: FuelRequestDto[];
    onRefresh: () => void;
}

export function FuelRequestsList({ requests, onRefresh }: FuelRequestsListProps) {
    const [selectedRequest, setSelectedRequest] = useState<FuelRequestDto | null>(null);
    const [actionDialogOpen, setActionDialogOpen] = useState(false);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const handleAction = (request: FuelRequestDto) => {
        setSelectedRequest(request);
        setActionDialogOpen(true);
    };

    const handleViewDetails = (request: FuelRequestDto) => {
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
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    if (requests.length === 0) {
        return (
            <div className="rounded-lg border border-dashed p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No fuel requests found</h3>
                <p className="text-muted-foreground mb-4">There are no fuel requests to display.</p>
            </div>
        );
    }

    return (
        <>
            <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Requested By</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Fuel Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Request Date</TableHead>
                            <HasPermission permission="manage_fuel" fallback={null}>
                                <TableHead className="text-right">Actions</TableHead>
                            </HasPermission>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                        {requests.map((request) => (
                            <TableRow key={request.id} className="hover:bg-muted/30">
                                <TableCell>{request.id}</TableCell>
                                <TableCell>
                                    <div>
                                        <p>{request.requestedBy}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {request.levelName}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {request.requestType === "VEHICLE" ? (
                                        <div>
                                            <p>Vehicle</p>
                                            <p className="text-xs text-muted-foreground">
                                                {request.vehiclePlateNumber}
                                            </p>
                                        </div>
                                    ) : (
                                        "Generator"
                                    )}
                                </TableCell>
                                <TableCell>{request.fuelTypeName}</TableCell>
                                <TableCell>{request.requestedAmount} L</TableCell>
                                <TableCell>{renderStatusBadge(request.status)}</TableCell>
                                <TableCell>{formatDate(request.requestedAt)}</TableCell>
                                <TableCell className="text-right">
                                        {request.status === RequestStatus.PENDING && (
                                        <HasPermission permission="manage_fuel" fallback={null}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAction(request)}
                                            >
                                                Review
                                            </Button>
                                        </HasPermission>
                                        )}
                                        {request.status !== RequestStatus.PENDING && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleViewDetails(request)}
                                            >
                                                Details
                                            </Button>
                                        )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <FuelRequestActionDialog
                isOpen={actionDialogOpen}
                onClose={() => setActionDialogOpen(false)}
                request={selectedRequest}
                onActionComplete={() => {
                    setActionDialogOpen(false);
                    onRefresh();
                }}
            />

            <FuelRequestDetailsDialog
                isOpen={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                request={selectedRequest}
            />
        </>
    );
}
