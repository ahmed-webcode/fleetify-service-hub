
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { FuelRecordFullDto, RecordType } from "@/types/fuel";
import { HasPermission } from "@/components/auth/HasPermission";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

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

    // Table rendering, with actions
    return (
        <Card>
            <CardHeader>
                <CardTitle>Fuel Records</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto px-0">
                <table className="min-w-full divide-y">
                    <thead>
                        <tr className="text-xs text-muted-foreground">
                            <th className="px-2 py-2 text-left font-semibold">#</th>
                            <th className="px-2 py-2 text-left font-semibold">Type</th>
                            <th className="px-2 py-2 text-left font-semibold">Vehicle</th>
                            <th className="px-2 py-2 text-left font-semibold">Fuel Type</th>
                            <th className="px-2 py-2 text-left font-semibold">Issued By</th>
                            <th className="px-2 py-2 text-left font-semibold">Issued Amount</th>
                            <th className="px-2 py-2 text-left font-semibold">Issued At</th>
                            <th className="px-2 py-2 text-left font-semibold">Received By</th>
                            <th className="px-2 py-2 text-left font-semibold">Received Amount</th>
                            <th className="px-2 py-2 text-left font-semibold">Received At</th>
                            <th className="px-2 py-2 text-left font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length === 0 && (
                            <tr>
                                <td colSpan={11} className="text-center text-muted-foreground py-6">
                                    No fuel records found.
                                </td>
                            </tr>
                        )}
                        {records.map((r, i) => (
                            <tr key={r.id} className="border-b hover:bg-muted/30 text-sm">
                                <td className="px-2 py-2">{page * pageSize + i + 1}</td>
                                <td className="px-2 py-2">{r.recordType}</td>
                                <td className="px-2 py-2">{r.vehicle?.plateNumber || "-"}</td>
                                <td className="px-2 py-2">{r.fuelType?.name || "-"}</td>
                                <td className="px-2 py-2">{`${r.issuedBy.firstName} ${r.issuedBy.lastName}`}</td>
                                <td className="px-2 py-2">{r.issuedAmount}</td>
                                <td className="px-2 py-2">{r.issuedAt ? new Date(r.issuedAt).toLocaleString() : "-"}</td>
                                <td className="px-2 py-2">{r.receivedBy ? `${r.receivedBy.firstName} ${r.receivedBy.lastName}` : "-"}</td>
                                <td className="px-2 py-2">{r.receivedAmount ?? "-"}</td>
                                <td className="px-2 py-2">{r.receivedAt ? new Date(r.receivedAt).toLocaleString() : "-"}</td>
                                <td className="px-2 py-2">
                                    {/* Show receive button if current user is receiver, and not yet received */}
                                    {/* Fix: Compare user.username with receivedBy.email */}
                                    {!r.receivedAt && r.receivedBy && user && r.receivedBy.email === user.username && (
                                        <Button size="sm" variant="outline" onClick={() => setReceiveDialog({ open: true, record: r })}>
                                            Receive
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
            {/* Pagination */}
            <CardFooter>
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => onPageChange(Math.max(0, page - 1))}
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
                                onClick={() => onPageChange(Math.min(pageCount - 1, page + 1))}
                                aria-disabled={page === pageCount - 1}
                                className={page === pageCount - 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
                <span className="ml-auto text-xs text-muted-foreground">
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
