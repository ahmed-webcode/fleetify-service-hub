import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/apiClient";
import { CreatePositionDto, PositionStatus } from "@/types/position";
import { getFlattenedLevels } from "@/lib/levelService";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import { LevelSelector } from "@/components/positions/LevelSelector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddPositionDialogProps {
    open: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    fuelQuota: z.number().min(0, { message: "Fuel quota must be a positive number" }),
    vehicleEntitlement: z.boolean(),
    policyReference: z.string().min(1, { message: "Policy reference is required" }),
    levelId: z.number().min(1, { message: "Level selection is required" }),
    status: z.nativeEnum(PositionStatus),
});

export const AddPositionDialog = ({ open, onClose }: AddPositionDialogProps) => {
    const [useProjects, setUseProjects] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            fuelQuota: 0,
            vehicleEntitlement: false,
            policyReference: "",
            levelId: 0,
            status: PositionStatus.ACTIVE,
        },
    });

    // Get flattened levels from localStorage - exclude structural levels
    const flattenedLevels = getFlattenedLevels(false);

    // --- Add this filter right here to ensure only non-structural levels are listed ---
    const nonStructuralLevels = flattenedLevels.filter(level => !level.isStructural);

    // Create mutation
    const createMutation = useMutation({
        mutationFn: (data: CreatePositionDto) => apiClient.positions.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            toast.success("Position created successfully");
            form.reset();
            onClose();
        },
        onError: (error: any) => {
            toast.error(`Failed to create position: ${error.message}`);
        },
    });

    // Handle form submission
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        createMutation.mutate(values as CreatePositionDto);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Position</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Position name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fuelQuota"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Weekly Fuel Quota (Liters)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                placeholder="Fuel quota in liters"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(parseInt(e.target.value) || 0)
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Position description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="vehicleEntitlement"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Vehicle Entitlement
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="policyReference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Policy Reference</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Policy reference" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* ORGANIZATIONAL LEVEL as SHADCN SELECT */}
                            <FormField
                                control={form.control}
                                name="levelId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Organizational Level</FormLabel>
                                        <Select
                                            value={field.value ? String(field.value) : ""}
                                            onValueChange={value => field.onChange(Number(value))}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {nonStructuralLevels.map(level => (
                                                    <SelectItem key={level.id} value={String(level.id)}>
                                                        {level.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* STATUS as SHADCN SELECT */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select
                                            value={field.value}
                                            onValueChange={value => field.onChange(value as PositionStatus)}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(PositionStatus).map(status => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={createMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? "Creating..." : "Create Position"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
