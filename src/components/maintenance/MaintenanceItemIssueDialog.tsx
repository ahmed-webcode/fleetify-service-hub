import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { MaintenanceItemIssue, MaintenanceRecordRef, ItemRef, UserRef } from "@/types/maintenance";
import { useState } from "react";

const formSchema = z.object({
    maintenanceId: z.number().min(1, "Maintenance record is required"),
    itemId: z.number().min(1, "Item is required"),
    issuedQuantity: z.coerce.number().min(1, "Quantity is required"),
    receivedBy: z.number().min(1, "Recipient is required"),
});

interface MaintenanceItemIssueDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function MaintenanceItemIssueDialog({
    open,
    onOpenChange,
    onSuccess,
}: MaintenanceItemIssueDialogProps) {
    const [loading, setLoading] = useState(false);
    const { data: recordsData, isLoading: isLoadingRecords } = useQuery({
        queryKey: ["maintenanceRecords", "forItemIssue"],
        queryFn: () => apiClient.maintenance.records.getAll({ size: 1000 }),
    });
    const { data: itemsData, isLoading: isLoadingItems } = useQuery({
        queryKey: ["allItems"],
        queryFn: () => apiClient.items.getAll({ size: 1000 }),
    });
    const { data: usersData, isLoading: isLoadingUsers } = useQuery({
        queryKey: ["allUsers"],
        queryFn: () => apiClient.users.getAll(),
    });
    const records: MaintenanceRecordRef[] = recordsData?.content || [];
    const items: ItemRef[] = itemsData?.content || [];
    const users: UserRef[] = usersData || [];

    const form = useForm<MaintenanceItemIssue>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maintenanceId: 0,
            itemId: 0,
            issuedQuantity: 1,
            receivedBy: 0,
        },
    });

    const handleSubmit = async (values: MaintenanceItemIssue) => {
        setLoading(true);
        try {
            await apiClient.maintenance.items.issue(values);
            toast.success("Item issued successfully.");
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error("Failed to issue item: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Issue Maintenance Item</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="maintenanceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Maintenance Record</FormLabel>
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={isLoadingRecords || loading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingRecords
                                                            ? "Loading records..."
                                                            : "Select record"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {records.map((r) => (
                                                <SelectItem key={r.id} value={String(r.id)}>
                                                    #{r.id} ({r.startDate} - {r.endDate})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="itemId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Item</FormLabel>
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={isLoadingItems || loading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingItems
                                                            ? "Loading items..."
                                                            : "Select item"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {items.map((i) => (
                                                <SelectItem key={i.id} value={String(i.id)}>
                                                    {i.name} ({i.unit})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="issuedQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Issued Quantity</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            {...field}
                                            value={field.value || ""}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="receivedBy"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Received By</FormLabel>
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={isLoadingUsers || loading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingUsers
                                                            ? "Loading users..."
                                                            : "Select user"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {users.map((u) => (
                                                <SelectItem key={u.id} value={String(u.id)}>
                                                    {u.fullName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Issue Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
