import { useState, useEffect, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/apiClient";
import { Position, UpdatePositionDto, PositionStatus } from "@/types/position";
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

interface EditPositionDialogProps {
    open: boolean;
    onClose: () => void;
    position: Position;
}

const formSchema = z.object({
    id: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    fuelQuota: z.number().min(0, { message: "Fuel quota must be a positive number" }),
    vehicleEntitlement: z.boolean(),
    policyReference: z.string().min(1, { message: "Policy reference is required" }),
    levelId: z.number().min(1, { message: "Level selection is required" }),
    status: z.nativeEnum(PositionStatus),
});

// Helper function (can be defined outside or memoized with useCallback if necessary)
// For this use case, defining it inside is fine as long as its dependencies are stable if it were used in a hook's dep array.
const findLevelIdByName = (
    name: string | undefined,
    levels: Array<{ id: number; name: string }>
): number | undefined => {
    if (!name) return undefined;
    const level = levels.find((l) => l.name === name);
    return level?.id;
};

export const EditPositionDialog = ({ open, onClose, position }: EditPositionDialogProps) => {
    const [useProjects, setUseProjects] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const queryClient = useQueryClient();

    // Step 1: Memoize flattenedLevels
    // Assuming getFlattenedLevels() doesn't depend on props/state that change frequently
    // while the dialog is open. If it only relies on localStorage and that's static
    // during the dialog's lifecycle, an empty dependency array for useMemo is fine.
    const flattenedLevels = useMemo(() => getFlattenedLevels(false), []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: position.id,
            name: position.name,
            description: position.description,
            fuelQuota: position.fuelQuota,
            vehicleEntitlement: position.vehicleEntitlement,
            policyReference: position.policyReference,
            // Initialize levelId using the (now memoized) flattenedLevels
            // This ensures the form has the correct levelId from the start if possible
            levelId: findLevelIdByName(position.levelName, flattenedLevels) || 0,
            status: (position.status as PositionStatus) || PositionStatus.ACTIVE,
        },
    });

    // Update form when position prop changes (e.g. if parent component passes a different position)
    // This useEffect will now run less frequently due to memoized flattenedLevels
    // and using form.reset in dependencies.
    useEffect(() => {
        if (position && open) {
            // Ensure position exists and dialog is open
            form.reset({
                id: position.id,
                name: position.name,
                description: position.description,
                fuelQuota: position.fuelQuota,
                vehicleEntitlement: position.vehicleEntitlement,
                policyReference: position.policyReference,
                levelId: findLevelIdByName(position.levelName, flattenedLevels) || 0,
                status: (position.status as PositionStatus) || PositionStatus.ACTIVE,
            });
        }
    }, [position, open, form.reset, flattenedLevels]); // Step 2: Use form.reset in dependencies

    const updateMutation = useMutation({
        mutationFn: (data: UpdatePositionDto) => apiClient.positions.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["positions"] });
            toast.success("Position updated successfully");
            onClose();
        },
        onError: (error: any) => {
            toast.error(`Failed to update position: ${error.message}`);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        updateMutation.mutate(values as UpdatePositionDto);
    };

    return (
        <Dialog open={open} onOpenChange={(isOpenState) => !isOpenState && onClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Position</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        {/* Name and Fuel Quota */}
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
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === "") {
                                                        field.onChange("");
                                                    } else {
                                                        field.onChange(parseInt(value, 10) || 0);
                                                    }
                                                }}
                                                value={
                                                    field.value === 0 &&
                                                    form.getFieldState("fuelQuota").isDirty
                                                        ? "0"
                                                        : field.value || ""
                                                }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Description */}
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

                        {/* Vehicle Entitlement & Policy Reference */}
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

                        {/* Level and Status as SHADCN SELECTS */}
                        <div className="grid grid-cols-2 gap-4">
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
                                                {flattenedLevels.map(level => (
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
                                disabled={updateMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={updateMutation.isPending}>
                                {updateMutation.isPending ? "Updating..." : "Update Position"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
