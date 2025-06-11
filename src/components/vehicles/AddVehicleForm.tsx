import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { VehicleStatus, VehicleType } from "@/types/vehicle";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Define the schema for vehicle data
const vehicleSchema = z.object({
    plateNumber: z.string().min(2, "License plate is required."),
    vehicleType: z.nativeEnum(VehicleType, { required_error: "Vehicle type is required" }),
    model: z.string().min(2, "Model must be at least 2 characters."),
    fuelTypeId: z.coerce.number().min(1, "Fuel type is required."),
    status: z.nativeEnum(VehicleStatus, { required_error: "Status is required" }),
    isPrivate: z.boolean().default(false),
    chassisNumber: z.string().min(2, "Chassis number is required."),
    motorNumber: z.string().min(2, "Motor number is required."),
    color: z.string().min(1, "Color is required."),
    madeYear: z.coerce
        .number()
        .min(1900)
        .max(new Date().getFullYear() + 1),
    responsibleStaffId: z.coerce.number().min(1, "Responsible staff is required."),
    madeIn: z.string().min(1, "Country of origin is required."),
    horsePower: z.coerce.number().min(0),
    singleWeight: z.coerce.number().min(0),
    totalWeight: z.coerce.number().min(0),
    cylinderCount: z.coerce.number().min(0),
    axleCount: z.coerce.number().min(0).optional(),
    seatsCount: z.coerce.number().min(0),
    kmReading: z.coerce.number().min(0),
    workEnvironment: z.string().min(1, "Work environment is required."),
    fuelConsumptionRate: z.coerce.number().min(0),
    driverId: z.coerce.number().optional(),
    insuranceCompany: z.string().optional(),
    insuranceEndDate: z.string().optional(),
    boloEndDate: z.string().optional(),
    // Files are handled separately
});

interface FuelType {
    id: number;
    name: string;
}

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    canDrive: boolean;
}

export function AddVehicleForm({ onSubmit }) {
    const [imageFile, setImageFile] = useState(null);
    const [libreFile, setLibreFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Mock fuel types until we have an API endpoint
    // const fuelTypes = [
    //   { id: 1, name: "Diesel" },
    //   { id: 2, name: "Petrol" },
    //   { id: 3, name: "Electric" },
    //   { id: 4, name: "Hybrid" },
    // ];

    const { data: fuelTypes, isLoading: isLoadingFuelTypes } = useQuery({
        queryKey: ["fuelTypes"],
        queryFn: async () => {
            return apiClient.fuel.getFuelTypes() as any;
        },
    });

    // Fetch users for responsible staff and driver selection
    const { data: users = [], isLoading: isLoadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            try {
                const u = (await apiClient.users.getAll()) as any;
                return u;
            } catch (error) {
                console.error("Failed to fetch users:", error);
                toast.error("Failed to load users");
                return [];
            }
        },
    });

    const form = useForm({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            plateNumber: "",
            vehicleType: undefined,
            model: "",
            fuelTypeId: 1,
            status: VehicleStatus.AVAILABLE,
            isPrivate: false,
            chassisNumber: "",
            motorNumber: "",
            color: "",
            madeYear: new Date().getFullYear(),
            responsibleStaffId: undefined,
            madeIn: "",
            horsePower: 0,
            singleWeight: 0,
            totalWeight: 0,
            cylinderCount: 0,
            axleCount: 0,
            seatsCount: 0,
            kmReading: 0,
            workEnvironment: "",
            fuelConsumptionRate: 0,
            driverId: undefined,
            insuranceCompany: "",
            insuranceEndDate: "",
            boloEndDate: "",
        },
    });

    // Watch for responsibleStaffId changes to conditionally show driver field
    const responsibleStaffId = form.watch("responsibleStaffId");
    const selectedStaff = users.find((user) => user.id === Number(responsibleStaffId));
    const showDriverField = selectedStaff && !selectedStaff.canDrive;

    // Get available drivers (users who can drive)
    const availableDrivers = users.filter((user) => user.canDrive);

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleLibreUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLibreFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (!libreFile) {
                toast.error("Libre document is required");
                return;
            }

            setUploading(true);

            // Create FormData for multipart/form-data submission
            const formData = new FormData();

            // Add all form values to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            // Add the files
            if (imageFile) {
                formData.append("vehicleImg", imageFile);
            }

            if (libreFile) {
                formData.append("libreImg", libreFile);
            }

            // Submit the form
            const result = await onSubmit(formData);

            if (result.success) {
                form.reset();
                setImageFile(null);
                setLibreFile(null);
            }
        } catch (error) {
            toast.error("Error: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Basic Vehicle Information */}
                    <FormField
                        control={form.control}
                        name="vehicleType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehicle Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(VehicleType).map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
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
                        name="model"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Land Cruiser" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="madeYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="plateNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>License Plate</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. AAU-1234" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="chassisNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chassis Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Chassis Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="motorNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Motor Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Motor Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fuelTypeId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel Type</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value?.toString()}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fuel type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {fuelTypes?.map((fuelType) => (
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
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. White" {...field} />
                                </FormControl>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(VehicleStatus).map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status.replace(/_/g, " ")}
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
                        name="kmReading"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Odometer Reading (km)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="madeIn"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country of Origin</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Japan" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="seatsCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Seats</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Technical Details */}
                    <FormField
                        control={form.control}
                        name="horsePower"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horse Power</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="singleWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Single Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="totalWeight"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Weight (kg)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cylinderCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Cylinders</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="axleCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Number of Axles</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="fuelConsumptionRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fuel Consumption Rate (L/100km)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.1" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="workEnvironment"
                        render={({ field }) => (
                            <FormItem className="col-span-full">
                                <FormLabel>Work Environment</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Where will this vehicle be used?"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Insurance Information */}
                    <FormField
                        control={form.control}
                        name="insuranceCompany"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Insurance Company</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Awash Insurance" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="insuranceEndDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Insurance End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="boloEndDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bolo End Date</FormLabel>
                                <FormControl>
                                    <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Ownership Information */}
                    <FormField
                        control={form.control}
                        name="isPrivate"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-md border">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Private Vehicle</FormLabel>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Staff/Driver Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-muted/20 rounded-md border">
                    <h3 className="text-lg font-medium col-span-full mb-2">Staff Assignment</h3>

                    <FormField
                        control={form.control}
                        name="responsibleStaffId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Responsible Staff</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value?.toString()}
                                    disabled={isLoadingUsers}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select staff member" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {isLoadingUsers ? (
                                            <div className="flex items-center justify-center p-2">
                                                <Loader className="h-4 w-4 animate-spin mr-2" />
                                                Loading...
                                            </div>
                                        ) : (
                                            users.map((user) => (
                                                <SelectItem
                                                    key={user.id}
                                                    value={user.id.toString()}
                                                >
                                                    {user.firstName} {user.lastName} (
                                                    {user.canDrive ? "Can drive" : "Can't drive"})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showDriverField && (
                        <FormField
                            control={form.control}
                            name="driverId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Driver</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value?.toString()}
                                        disabled={isLoadingUsers}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select driver" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {isLoadingUsers ? (
                                                <div className="flex items-center justify-center p-2">
                                                    <Loader className="h-4 w-4 animate-spin mr-2" />
                                                    Loading...
                                                </div>
                                            ) : (
                                                availableDrivers.map((driver) => (
                                                    <SelectItem
                                                        key={driver.id}
                                                        value={driver.id.toString()}
                                                    >
                                                        {driver.firstName} {driver.lastName}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                {/* File Upload Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                        <FormLabel>Vehicle Image</FormLabel>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="cursor-pointer"
                        />
                        {imageFile && (
                            <p className="text-sm text-muted-foreground">
                                Selected: {imageFile.name}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <FormLabel className="flex items-center">
                            Libre Document <span className="text-destructive ml-1">*</span>
                        </FormLabel>
                        <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleLibreUpload}
                            className="cursor-pointer"
                            required
                        />
                        {libreFile && (
                            <p className="text-sm text-muted-foreground">
                                Selected: {libreFile.name}
                            </p>
                        )}
                        {!libreFile && (
                            <p className="text-sm text-destructive">This field is required</p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={uploading || !libreFile}>
                        {uploading ? "Adding..." : "Add Vehicle"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
