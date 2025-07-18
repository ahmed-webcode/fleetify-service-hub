import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Form,
    FormField,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { apiClient } from '@/lib/apiClient';
import { CreateFuelRequestDto } from '@/types/fuel';
import { TargetType } from '@/types/common';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
    targetType: z.nativeEnum(TargetType),
    vehicleId: z.number().optional().nullable(),
    fuelTypeId: z.number({ required_error: 'Fuel type is required.' }),
    requestNote: z.string().optional(),
    requestedAmount: z
        .number({ required_error: 'Amount is required.' })
        .positive('Amount must be greater than 0'),
});

type FuelFormValues = z.infer<typeof formSchema>;

interface FuelRequestFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function FuelRequestForm({ onSuccess, onCancel }: FuelRequestFormProps) {
    const [loading, setLoading] = useState(false);
    const [targetType, setTargetType] = useState<TargetType>(TargetType.VEHICLE);

    const form = useForm<FuelFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            targetType: TargetType.VEHICLE,
        },
    });

    // Fetch data for dropdowns
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery({
        queryKey: ['vehicles', 'all'],
        queryFn: () => apiClient.vehicles.getAll({ size: 1000 }),
        enabled: targetType === 'VEHICLE',
    });

    const { data: fuelTypes, isLoading: isLoadingFuelTypes } = useQuery({
        queryKey: ['fuelTypes'],
        queryFn: () => apiClient.fuel.getFuelTypes() as any,
    });

    const watchedTargetType = form.watch('targetType');
    useEffect(() => {
        setTargetType(watchedTargetType as TargetType);
        form.setValue('vehicleId', null);
    }, [watchedTargetType, form]);

    const onSubmit = async (data: FuelFormValues) => {
        try {
            setLoading(true);

            const requestData: CreateFuelRequestDto = {
                requestType: data.targetType,
                fuelTypeId: data.fuelTypeId,
                requestedAmount: data.requestedAmount,
                requestNote: data.requestNote,
            };

            if (data.targetType === TargetType.VEHICLE) {
                if (!data.vehicleId) {
                    toast.error('Vehicle is required.');
                    setLoading(false);
                    return;
                }
                requestData.vehicleId = data.vehicleId;
            }

            await apiClient.fuel.requests.create(requestData);
            toast.success('Fuel request submitted successfully');
            form.reset();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error('Failed to submit request: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Responsive two column grid for form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="targetType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Target Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select target type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="VEHICLE">Vehicle</SelectItem>
                                        <SelectItem value="GENERATOR">Generator/Office</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select if fuel is for a vehicle or a generator/office.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {targetType === 'VEHICLE' ? (
                        <FormField
                            control={form.control}
                            name="vehicleId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vehicle</FormLabel>
                                    <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        disabled={isLoadingVehicles}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a vehicle" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {vehiclesData?.content.map((vehicle) => (
                                                <SelectItem
                                                    key={vehicle.id}
                                                    value={vehicle.id.toString()}
                                                >
                                                    {vehicle.model} ({vehicle.plateNumber})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Select the vehicle requiring fuel
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : null}

                    <FormField
                        control={form.control}
                        name="fuelTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel Type</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(parseInt(value))}
                                    disabled={isLoadingFuelTypes}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fuel type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {(fuelTypes as any)?.map((fuelType: any) => (
                                            <SelectItem
                                                key={fuelType.id}
                                                value={fuelType.id.toString()}
                                            >
                                                {fuelType.name}
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
                        name="requestedAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (Liters)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="e.g., 50"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="requestNote"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Request Note (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Add a note to explain this request..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
