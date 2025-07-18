import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { VehicleStatus, VehicleType, EditVehicleFormProps } from "@/types/vehicle";
import { VehicleBasicInfo } from "./form-sections/VehicleBasicInfo";
import { VehicleTechnicalDetails } from "./form-sections/VehicleTechnicalDetails";
import { VehicleInsuranceInfo } from "./form-sections/VehicleInsuranceInfo";
// import { VehicleStaffAndOwnership } from "./form-sections/VehicleStaffAndOwnership";
import { VehicleFileUploads } from "./form-sections/VehicleFileUploads";
import { format } from "date-fns";

const editVehicleSchema = z.object({
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
    workEnvironment: z.string().min(1, "Work environment is required."),
    fuelConsumptionRate: z.coerce.number().min(0),
    insuranceCompany: z.string().optional(),
    insuranceExpiryDate: z.string().optional(),
    boloExpiryDate: z.string().optional(),
});

type EditVehicleValues = z.infer<typeof editVehicleSchema>;

export function EditVehicleForm({ vehicle, onSubmit, onCancel }: EditVehicleFormProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [libreFile, setLibreFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [insuranceExpiryDate, setInsuranceExpiryDate] = useState<Date | undefined>();
    const [boloExpiryDate, setBoloExpiryDate] = useState<Date | undefined>();

    const { data: fuelTypes } = useQuery({
        queryKey: ["fuelTypes"],
        queryFn: () => apiClient.fuel.getFuelTypes() as any,
    });
    // Fetch levels for levelId selection
    const { data: levels = [] } = useQuery({
        queryKey: ["levels"],
        queryFn: async () => (await apiClient.levels.getAll()) as any,
    });

    const form = useForm<EditVehicleValues>({
        resolver: zodResolver(editVehicleSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if (vehicle && fuelTypes && levels.length > 0) {
            form.reset({
                plateNumber: vehicle.plateNumber,
                vehicleType: vehicle.vehicleType,
                model: vehicle.model,
                fuelTypeId: vehicle.fuelType?.id,
                status: vehicle.status,
                isPrivate: vehicle.isPrivate,
                isService: vehicle.isService,
                chassisNumber: vehicle.chassisNumber,
                motorNumber: vehicle.motorNumber,
                color: vehicle.color,
                madeYear: vehicle.madeYear,
                levelId: vehicle.level?.id,
                madeIn: vehicle.madeIn,
                seatsCount: vehicle.seatsCount,
                workEnvironment: vehicle.workEnvironment,
                fuelConsumptionRate: Number(vehicle.fuelConsumptionRate),
                insuranceCompany: vehicle.insuranceCompany || "",
                insuranceExpiryDate: vehicle.insuranceExpiryDate || "",
                boloExpiryDate: vehicle.boloExpiryDate || "",
            });
            if (vehicle.insuranceExpiryDate)
                setInsuranceExpiryDate(new Date(vehicle.insuranceExpiryDate));
            if (vehicle.boloExpiryDate) setBoloExpiryDate(new Date(vehicle.boloExpiryDate));
        }
    }, [vehicle, fuelTypes, levels, form]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setImageFile(e.target.files[0]);
    };

    const handleLibreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setLibreFile(e.target.files[0]);
    };

    const handleSubmit = async (values: z.infer<typeof editVehicleSchema>) => {
        setUploading(true);
        try {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, String(value));
                }
            });
            if (insuranceExpiryDate) {
                formData.append("insuranceExpiryDate", format(insuranceExpiryDate, "yyyy-MM-dd"));
            }
            if (boloExpiryDate) {
                formData.append("boloExpiryDate", format(boloExpiryDate, "yyyy-MM-dd"));
            }
            if (imageFile) formData.append("vehicleImg", imageFile);
            if (libreFile) formData.append("libreImg", libreFile);
            if (vehicle?.id) {
                await onSubmit(vehicle.id, formData);
            }
        } catch (error) {
            console.error("Error submitting vehicle data:", error);
            toast.error("Failed to save vehicle data. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    if (!vehicle) return <p>Loading vehicle data...</p>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                        initialImageUrl={vehicle.imgSrc}
                        initialLibreUrl={vehicle.libreSrc}
                    />
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={uploading}>
                        {uploading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
