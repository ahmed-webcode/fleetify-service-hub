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
import { Textarea } from "@/components/ui/textarea";
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
import { MaintenanceRequestCreate } from "@/types/maintenance";
import { VehicleDto } from "@/types/vehicle";
import { useState } from "react";

const formSchema = z.object({
    vehicleId: z.number().min(1, "Vehicle is required"),
    title: z.string().min(3, "Title is required"),
    description: z.string().min(5, "Description is required"),
});

interface MaintenanceRequestDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function MaintenanceRequestDialog({
    open,
    onOpenChange,
    onSuccess,
}: MaintenanceRequestDialogProps) {
    const [loading, setLoading] = useState(false);
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery({
        queryKey: ["vehicles", "all"],
        queryFn: () => apiClient.vehicles.getAll({ size: 1000 }),
    });
    const vehicles: VehicleDto[] = vehiclesData?.content || [];

    const form = useForm<MaintenanceRequestCreate>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleId: 0,
            title: "",
            description: "",
        },
    });

    const handleSubmit = async (values: MaintenanceRequestCreate) => {
        setLoading(true);
        try {
            await apiClient.maintenance.requests.create(values);
            toast.success("Maintenance request submitted successfully.");
            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            toast.error("Failed to submit request: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Maintenance Request</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="vehicleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vehicle</FormLabel>
                                    <Select
                                        value={field.value ? String(field.value) : ""}
                                        onValueChange={(value) => field.onChange(Number(value))}
                                        disabled={isLoadingVehicles || loading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingVehicles
                                                            ? "Loading vehicles..."
                                                            : "Select vehicle"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {vehicles.map((v) => (
                                                <SelectItem key={v.id} value={String(v.id)}>
                                                    {v.plateNumber} - {v.model}
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter request title" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe the maintenance needed"
                                            {...field}
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
                                {loading ? "Submitting..." : "Submit Request"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
