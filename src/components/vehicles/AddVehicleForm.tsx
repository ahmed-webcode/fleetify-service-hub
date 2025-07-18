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
// import { VehicleStaffAndOwnership } from "./form-sections/VehicleStaffAndOwnership";
import { VehicleFileUploads } from "./form-sections/VehicleFileUploads";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Updated schema for vehicle data
const vehicleSchema = z.object({
    plateNumber: z.string().min(2, "License plate is required."),
    vehicleType: z.nativeEnum(VehicleType, { required_error: "Vehicle type is required" }),
    model: z.string().min(2, "Model must be at least 2 characters."),
    fuelTypeId: z.coerce.number().min(1, "Fuel type is required."),
    status: z.nativeEnum(VehicleStatus, { required_error: "Status is required" }),
    isPrivate: z.boolean().default(false),
    isService: z.boolean().default(false),
    chassisNumber: z.string().min(2, "Chassis number is required."),
    motorNumber: z.string().min(2, "Motor number is required."),
    color: z.string().min(1, "Color is required."),
    madeYear: z.coerce
        .number()
        .min(1900)
        .max(new Date().getFullYear() + 1),
    levelId: z.coerce.number().min(1, "Level is required."),
    madeIn: z.string().min(1, "Country of origin is required."),
    seatsCount: z.coerce.number().min(0),
    workEnvironment: z.string().optional(),
    fuelConsumptionRate: z.coerce.number().min(0),
    insuranceCompany: z.string().optional(),
    insuranceExpiryDate: z.string().optional(),
    boloExpiryDate: z.string().optional(),
    // Files are handled separately
});

interface FuelType {
    id: number;
    name: string;
}

export function AddVehicleForm({ onSubmit }) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [libreFile, setLibreFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState<Date | undefined>();
    const [boloExpiryDate, setBoloExpiryDate] = useState<Date | undefined>();

    const { data: fuelTypes } = useQuery({
        queryKey: ["fuelTypes"],
        queryFn: async () => apiClient.fuel.getFuelTypes() as any,
    });
    // Fetch levels for levelId selection
    const { data: levels = [] } = useQuery({
        queryKey: ["levels"],
        queryFn: async () => (await apiClient.levels.getAll()) as any,
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
            isService: false,
            chassisNumber: "",
            motorNumber: "",
            color: "",
            madeYear: new Date().getFullYear(),
            levelId: undefined,
            madeIn: "",
            seatsCount: 0,
            workEnvironment: "",
            fuelConsumptionRate: 0,
            insuranceCompany: "",
            insuranceExpiryDate: "",
            boloExpiryDate: "",
        },
    });

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
            setUploading(true);
            // Create FormData for multipart/form-data submission
            const formData = new FormData();
            // Add all form values to FormData
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value.toString());
                }
            });
            // Add formatted insurance and bolo dates
            if (insuranceExpiryDate) {
                formData.append("insuranceExpiryDate", format(insuranceExpiryDate, "yyyy-MM-dd"));
            }
            if (boloExpiryDate) {
                formData.append("boloExpiryDate", format(boloExpiryDate, "yyyy-MM-dd"));
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
                setInsuranceExpiryDate(undefined);
                setBoloExpiryDate(undefined);
            }
        } catch (error) {
            toast.error("Error: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={(e) => {
                    console.log("Form errors:", form.formState.errors);
                    form.handleSubmit(handleSubmit)(e);
                }}
                className="space-y-4"
            >
                <h3 className="text-xl font-semibold border-b pb-2">Basic Information</h3>
                <VehicleBasicInfo control={form.control} fuelTypes={fuelTypes} levels={levels} />
                <h3 className="text-xl font-semibold border-b pb-2 pt-4">Technical Details</h3>
                {/* Remove VehicleTechnicalDetails if all fields are deprecated */}
                {/* <VehicleTechnicalDetails control={form.control} /> */}
                <h3 className="text-xl font-semibold border-b pb-2 pt-4">Insurance Information</h3>
                <VehicleInsuranceInfo
                    form={form}
                    insuranceExpiryDate={insuranceExpiryDate}
                    setInsuranceExpiryDate={setInsuranceExpiryDate}
                    boloExpiryDate={boloExpiryDate}
                    setBoloExpiryDate={setBoloExpiryDate}
                />
                <h3 className="text-xl font-semibold border-b pb-2 pt-4">File Uploads</h3>
                <div className="grid grid-cols-1 gap-4">
                    <VehicleFileUploads
                        handleImageUpload={handleImageUpload}
                        handleLibreUpload={handleLibreUpload}
                        imageFile={imageFile}
                        libreFile={libreFile}
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" disabled={uploading}>
                        {uploading ? "Saving..." : "Add Vehicle"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
