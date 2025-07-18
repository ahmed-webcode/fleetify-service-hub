import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { MaintenanceItemFull } from "@/types/maintenance";
import { format } from "date-fns";
import { MaintenanceItemReceiveDialog } from "@/components/maintenance/MaintenanceItemReceiveDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MaintenanceItemsListProps {
    items: MaintenanceItemFull[];
    onRefresh: () => void;
}

export function MaintenanceItemsList({ items, onRefresh }: MaintenanceItemsListProps) {
    const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (e) {
            return dateString;
        }
    };

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No maintenance items found.
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
                            <TableHead>Item</TableHead>
                            <TableHead>Maintenance</TableHead>
                            <TableHead>Issued By</TableHead>
                            <TableHead>Received By</TableHead>
                            <TableHead>Issued Qty</TableHead>
                            <TableHead>Received Qty</TableHead>
                            <TableHead>Unit Cost</TableHead>
                            <TableHead>Total Cost</TableHead>
                            <TableHead>Issued At</TableHead>
                            <TableHead>Received At</TableHead>
                            <TableHead className="text-right w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-border">
                        {items.map((item) => (
                            <TableRow key={item.id} className="hover:bg-muted/30">
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.item.name}</TableCell>
                                <TableCell>#{item.maintenanceRecord.id}</TableCell>
                                <TableCell>{item.issuedBy.fullName}</TableCell>
                                <TableCell>{item.receivedBy.fullName}</TableCell>
                                <TableCell>{item.issuedQuantity}</TableCell>
                                <TableCell>{item.receivedQuantity ?? "-"}</TableCell>
                                <TableCell>{item.unitCost ? `$${item.unitCost}` : "N/A"}</TableCell>
                                <TableCell>
                                    {item.totalCost ? `$${item.totalCost}` : "N/A"}
                                </TableCell>
                                <TableCell>{formatDate(item.issuedAt)}</TableCell>
                                <TableCell>
                                    {item.receivedAt ? formatDate(item.receivedAt) : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {!item.receivedAt && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedItemId(item.id);
                                                setReceiveDialogOpen(true);
                                            }}
                                        >
                                            Receive
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <MaintenanceItemReceiveDialog
                open={receiveDialogOpen}
                onOpenChange={setReceiveDialogOpen}
                itemId={selectedItemId}
                onSuccess={() => {
                    setReceiveDialogOpen(false);
                    onRefresh();
                }}
            />
        </>
    );
}
