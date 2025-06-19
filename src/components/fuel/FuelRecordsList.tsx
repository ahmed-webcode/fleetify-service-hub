
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FuelRecordFullDto } from "@/types/fuel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";

interface FuelRecordsListProps {
    records: FuelRecordFullDto[];
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    onPageChange: (p: number) => void;
    refetch: () => void;
}

export function FuelRecordsList({ records, total, page, pageSize, pageCount, onPageChange, refetch }: FuelRecordsListProps) {
    const { user } = useAuth();
    const [receiveDialog, setReceiveDialog] = useState<{ open: boolean, record?: FuelRecordFullDto }>({ open: false });
    const [processing, setProcessing] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Fuel Records</CardTitle>
                    <CardDescription>Detailed history of all fuel issuances, receptions, and transactions.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="overflow-x-auto px-0">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead>#</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Fuel Type</TableHead>
                            <TableHead>Issued By</TableHead>
                            <TableHead>Issued Amount</TableHead>
                            <TableHead>Issued At</TableHead>
                            <TableHead>Received By</TableHead>
                            <TableHead>Received Amount</TableHead>
                            <TableHead>Received At</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} className="text-center py-6 text-muted-foreground">
                                    No fuel records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            records.map((r, i) => (
                                <TableRow key={r.id} className="text-sm">
                                    <TableCell>{page * pageSize + i + 1}</TableCell>
                                    <TableCell>{r.recordType}</TableCell>
                                    <TableCell>{r.vehicle?.plateNumber || "-"}</TableCell>
                                    <TableCell>{r.fuelType?.name || "-"}</TableCell>
                                    <TableCell>{`${r.issuedBy.firstName} ${r.issuedBy.lastName}`}</TableCell>
                                    <TableCell>{r.issuedAmount}</TableCell>
                                    <TableCell>{r.issuedAt ? new Date(r.issuedAt).toLocaleString() : "-"}</TableCell>
                                    <TableCell>{r.receivedBy ? `${r.receivedBy.firstName} ${r.receivedBy.lastName}` : "-"}</TableCell>
                                    <TableCell>{r.receivedAmount ?? "-"}</TableCell>
                                    <TableCell>{r.receivedAt ? new Date(r.receivedAt).toLocaleString() : "-"}</TableCell>
                                    <TableCell>
                                        {/* Show receive button if current user is receiver and not yet received */}
                                        {!r.receivedAt && r.receivedBy && user && r.receivedBy.id === user.id && (
                                            <Button size="sm" variant="outline" onClick={() => setReceiveDialog({ open: true, record: r })}>
                                                Receive
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row sm:items-center">
                <div className="flex-1">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => {
                                        if (page > 0) onPageChange(page - 1);
                                    }}
                                    aria-disabled={page === 0}
                                    className={page === 0 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                            {Array.from({ length: pageCount }, (_, idx) => (
                                <PaginationItem key={idx}>
                                    <PaginationLink
                                        isActive={idx === page}
                                        onClick={() => onPageChange(idx)}
                                    >
                                        {idx + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => {
                                        if (page < pageCount - 1) onPageChange(page + 1);
                                    }}
                                    aria-disabled={page === pageCount - 1 || pageCount === 0}
                                    className={page === pageCount - 1 || pageCount === 0 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
                <span className="ml-auto text-xs text-muted-foreground pt-2 sm:pt-0">
                    {`Showing ${records.length} of ${total} records`}
                </span>
            </CardFooter>
            {/* Receive Dialog */}
            <Dialog open={receiveDialog.open} onOpenChange={open => setReceiveDialog({ open, record: open ? receiveDialog.record : undefined })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Fuel Reception</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs">Issued Amount:</label>
                            <div>{receiveDialog.record?.issuedAmount ?? "-"}</div>
                        </div>
                        <div>
                            <label htmlFor="receivedAmount" className="text-xs">Received Amount</label>
                            <Input
                                id="receivedAmount"
                                type="number"
                                step="0.01"
                                min={0.01}
                                max={receiveDialog.record?.issuedAmount}
                                defaultValue={receiveDialog.record?.issuedAmount}
                                disabled={processing}
                                className="mt-1"
                                onKeyDown={e => {
                                    if (e.key === "Enter") {
                                        (e.target as HTMLInputElement).blur();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setReceiveDialog({ open: false })}
                                disabled={processing}
                            >Cancel</Button>
                            <Button
                                onClick={async () => {
                                    if (!receiveDialog.record) return;
                                    const amountInput = document.getElementById("receivedAmount") as HTMLInputElement;
                                    const val = amountInput.value ? parseFloat(amountInput.value) : 0;
                                    if (val <= 0 || val > (receiveDialog.record.issuedAmount ?? 0)) {
                                        toast.error("Please enter a valid received amount (<= issued amount)");
                                        return;
                                    }
                                    setProcessing(true);
                                    try {
                                        await apiClient.fuel.records.receive(receiveDialog.record.id, { receivedAmount: val });
                                        toast.success("Fuel received successfully!");
                                        setReceiveDialog({ open: false });
                                        refetch();
                                    } catch (e) {
                                        toast.error("Failed to receive fuel.");
                                    } finally {
                                        setProcessing(false);
                                    }
                                }}
                                disabled={processing}
                            >Receive</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

export default FuelRecordsList;
