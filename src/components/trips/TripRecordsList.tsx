
import { TripRecordFullDto } from "@/types/trip";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TripRecordsListProps {
    records: TripRecordFullDto[];
}

export function TripRecordsList({ records }: TripRecordsListProps) {
    if (!records.length) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No trip records found.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Assigned By</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Assigned At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((rec) => (
                        <TableRow key={rec.id}>
                            <TableCell>{rec.id}</TableCell>
                            <TableCell title={rec.tripRequest?.purpose}>
                                {rec.tripRequest?.purpose}
                            </TableCell>
                            <TableCell>
                                {rec.vehicle?.plateNumber ?? "-"}
                            </TableCell>
                            <TableCell>
                                {rec.driver
                                    ? `${rec.driver.firstName} ${rec.driver.lastName}`
                                    : "-"}
                            </TableCell>
                            <TableCell>
                                {rec.assignedBy
                                    ? `${rec.assignedBy.firstName} ${rec.assignedBy.lastName}`
                                    : "-"}
                            </TableCell>
                            <TableCell>
                                {rec.level?.name ?? "-"}
                            </TableCell>
                            <TableCell>
                                {rec.assignedAt
                                    ? format(new Date(rec.assignedAt), "MMM dd, yyyy HH:mm")
                                    : "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
