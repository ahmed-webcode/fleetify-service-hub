import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { VehicleStatus, VehicleType } from "@/types/vehicle";
import { VehicleBasicInfo } from "./form-sections/VehicleBasicInfo";
import { VehicleTechnicalDetails } from "./form-sections/VehicleTechnicalDetails";
import { VehicleInsuranceInfo } from "./form-sections/VehicleInsuranceInfo";
import { VehicleStaffAndOwnership } from "./form-sections/VehicleStaffAndOwnership";
import { VehicleFileUploads } from "./form-sections/VehicleFileUploads";

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
    roles: { id: number; name: string; }[];
}

export function AddVehicleForm({ onSubmit }) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [libreFile, setLibreFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [insuranceEndDate, setInsuranceEndDate] = useState<Date | undefined>();
    const [boloEndDate, setBoloEndDate] = useState<Date | undefined>();

    // Mock fuel types until we have an API endpoint
    // const fuelTypes = [
    //   { id: 1, name: "Diesel" },
    //   { id: 2, name: "Petrol" },
    //   { id: 3, name: "Electric" },
    //   { id: 4, name: "Hybrid" },
    // ];

    const { data: fuelTypes } = useQuery({
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
    
    // Filter users to only show those with "staff" role
    const staffUsers = users.filter((user) => 
        user.roles && user.roles.some((role) => role.name.toLowerCase() === "staff")
    );

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

            // Add all form values to FormData with date formatting
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });

            // Add formatted dates
            if (insuranceEndDate) {
                formData.append("insuranceEndDate", format(insuranceEndDate, "yyyy-MM-dd"));
            }
            if (boloEndDate) {
                formData.append("boloEndDate", format(boloEndDate, "yyyy-MM-dd"));
            }

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
                setInsuranceEndDate(undefined);
                setBoloEndDate(undefined);
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
                <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>
                <VehicleBasicInfo control={form.control} fuelTypes={fuelTypes} />

                <h3 className="text-xl font-semibold border-b pb-2 pt-4">Technical Details</h3>
                <VehicleTechnicalDetails control={form.control} />
                
                <h3 className="text-xl font-semibold border-b pb-2 pt-4">Insurance Information</h3>
                <VehicleInsuranceInfo
                    form={form}
                    insuranceEndDate={insuranceEndDate}
                    setInsuranceEndDate={setInsuranceEndDate}
                    boloEndDate={boloEndDate}
                    setBoloEndDate={setBoloEndDate}
                />
                
                <h3 className="text-xl font-semibold border-b pb-2 pt-4">Ownership & Staff</h3>
                <VehicleStaffAndOwnership
                    control={form.control}
                    isLoadingUsers={isLoadingUsers}
                    staffUsers={staffUsers}
                    showDriverField={showDriverField}
                    availableDrivers={availableDrivers}
                />

                <h3 className="text-xl font-semibold border-b pb-2 pt-4">File Uploads</h3>
                <VehicleFileUploads
                    handleImageUpload={handleImageUpload}
                    handleLibreUpload={handleLibreUpload}
                    imageFile={imageFile}
                    libreFile={libreFile}
                />

                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={uploading || !libreFile}>
                        {uploading ? "Adding..." : "Add Vehicle"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
