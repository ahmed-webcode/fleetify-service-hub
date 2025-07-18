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
import { toast } from "sonner";
import { MaintenanceItemReceive } from "@/types/maintenance";
import { useState } from "react";

const formSchema = z.object({
    receivedQuantity: z.coerce.number().min(1, "Received quantity is required"),
});

interface MaintenanceItemReceiveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    itemId: number | null;
    onSuccess: () => void;
}

export function MaintenanceItemReceiveDialog({
    open,
    onOpenChange,
    itemId,
    onSuccess,
}: MaintenanceItemReceiveDialogProps) {
    const [loading, setLoading] = useState(false);
    const form = useForm<MaintenanceItemReceive>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            receivedQuantity: 1,
        },
    });

    const handleSubmit = async (values: MaintenanceItemReceive) => {
        if (!itemId) return;
        setLoading(true);
        try {
            await apiClient.maintenance.items.receive(itemId, values);
            toast.success("Item received successfully.");
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error("Failed to receive item: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Receive Maintenance Item</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="receivedQuantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Received Quantity</FormLabel>
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
                                {loading ? "Submitting..." : "Receive Item"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
