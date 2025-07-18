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
import { MaintenanceRecordFull } from "@/types/maintenance";
import { format } from "date-fns";

interface MaintenanceRecordsListProps {
    records: MaintenanceRecordFull[];
    onRefresh: () => void;
}

export function MaintenanceRecordsList({ records, onRefresh }: MaintenanceRecordsListProps) {
    const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecordFull | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    const handleViewDetails = (record: MaintenanceRecordFull) => {
        setSelectedRecord(record);
        setDetailsDialogOpen(true);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (e) {
            return dateString;
        }
    };

    if (records.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No maintenance records to display for the current filter.
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
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Labor Cost</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                        {records.map((record) => (
                            <TableRow key={record.id} className="hover:bg-muted/30">
                                <TableCell>{record.id}</TableCell>
                                <TableCell>
                                    {record.maintenanceRequest.vehicle.plateNumber}
                                </TableCell>
                                <TableCell>{record.performedBy.name}</TableCell>
                                <TableCell>{formatDate(record.startDate)}</TableCell>
                                <TableCell>{formatDate(record.endDate)}</TableCell>
                                <TableCell>
                                    {record.laborCost ? `$${record.laborCost}` : "N/A"}
                                </TableCell>
                                <TableCell
                                    className="max-w-[200px] truncate"
                                    title={record.description}
                                >
                                    {record.description}
                                </TableCell>
                                <TableCell>{formatDate(record.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleViewDetails(record)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Details dialog skeleton (to be implemented) */}
            {/* <MaintenanceRecordDetailsDialog
                isOpen={detailsDialogOpen}
                onClose={() => setDetailsDialogOpen(false)}
                record={selectedRecord}
            /> */}
        </>
    );
}
