import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InsuranceCreate } from "@/types/insurance";
import { VehicleDto } from "@/types/vehicle";
import { apiClient } from "@/lib/apiClient";

const formSchema = z.object({
    vehicleId: z.string({ required_error: "Please select a vehicle" }),
    insurancePolicyNumber: z.string().min(1, "Policy number is required"),
    insuranceCompany: z.string().min(1, "Insurance company is required"),
    policyStartDate: z.date({ required_error: "Start date is required" }),
    policyEndDate: z.date({ required_error: "End date is required" }),
    premiumAmount: z.coerce.number().min(0, "Premium amount must be positive"),
});

interface AddInsurancePolicyFormProps {
    onSubmit: (data: InsuranceCreate) => void;
}

export function AddInsurancePolicyForm({ onSubmit }: AddInsurancePolicyFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vehicleId: "",
            insurancePolicyNumber: "",
            insuranceCompany: "",
            policyStartDate: undefined,
            policyEndDate: undefined,
            premiumAmount: 0,
        },
    });

    const [vehicles, setVehicles] = useState<VehicleDto[]>([]);
    const [loadingVehicles, setLoadingVehicles] = useState(true);

    useEffect(() => {
        async function loadVehicles() {
            setLoadingVehicles(true);
            try {
                const res = await apiClient.vehicles.getAll({ size: 100 });
                setVehicles(res.content);
            } finally {
                setLoadingVehicles(false);
            }
        }
        loadVehicles();
    }, []);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const data: InsuranceCreate = {
            vehicleId: Number(values.vehicleId),
            insuranceCompany: values.insuranceCompany,
            insurancePolicyNumber: values.insurancePolicyNumber,
            policyStartDate: values.policyStartDate.toISOString().slice(0, 10),
            policyEndDate: values.policyEndDate.toISOString().slice(0, 10),
            premiumAmount: values.premiumAmount,
        };
        onSubmit(data);
    };

    const insuranceCompanies = [
        "Awash Insurance",
        "Nyala Insurance",
        "Ethio Insurance",
        "Nile Insurance",
        "United Insurance",
    ];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vehicle</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={loadingVehicles}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            placeholder={
                                                loadingVehicles ? "Loading..." : "Select a vehicle"
                                            }
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {vehicles.map((vehicle) => (
                                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                            {vehicle.plateNumber} ({vehicle.model})
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
                    name="insurancePolicyNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Policy Number</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., INS-1234-5678" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="insuranceCompany"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Insurance Company</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an insurance company" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {insuranceCompanies.map((company) => (
                                        <SelectItem key={company} value={company}>
                                            {company}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="policyStartDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date("2000-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="policyEndDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => date < new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="premiumAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Premium Amount (ETB)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Cancel
                    </Button>
                    <Button type="submit">Save Policy</Button>
                </div>
            </form>
        </Form>
    );
}
