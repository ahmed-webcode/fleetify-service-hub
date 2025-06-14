
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
import { VehicleStaffAndOwnership } from "./form-sections/VehicleStaffAndOwnership";
import { VehicleFileUploads } from "./form-sections/VehicleFileUploads";

const editVehicleSchema = z.object({
    plateNumber: z.string().min(2, "License plate is required."),
    vehicleType: z.nativeEnum(VehicleType, { required_error: "Vehicle type is required" }),
    model: z.string().min(2, "Model must be at least 2 characters."),
    fuelTypeId: z.coerce.number().min(1, "Fuel type is required."),
    status: z.nativeEnum(VehicleStatus, { required_error: "Status is required" }),
    isPrivate: z.boolean().default(false),
    chassisNumber: z.string().min(2, "Chassis number is required."),
    motorNumber: z.string().min(2, "Motor number is required."),
    color: z.string().min(1, "Color is required."),
    madeYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
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
});

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    canDrive: boolean;
    roles: { id: number; name: string }[];
}

export function EditVehicleForm({ vehicle, onSubmit, onCancel }: EditVehicleFormProps) {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [libreFile, setLibreFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [insuranceEndDate, setInsuranceEndDate] = useState<Date | undefined>();
    const [boloEndDate, setBoloEndDate] = useState<Date | undefined>();

    const { data: fuelTypes } = useQuery({
        queryKey: ["fuelTypes"],
        queryFn: () => apiClient.fuel.getFuelTypes() as any,
    });

    const { data: users = [], isLoading: isLoadingUsers } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            try {
                return (await apiClient.users.getAll()) as any;
            } catch (error) {
                toast.error("Failed to load users");
                return [];
            }
        },
    });

    const form = useForm({
        resolver: zodResolver(editVehicleSchema),
        defaultValues: {},
    });

    useEffect(() => {
        if (vehicle && users.length > 0 && fuelTypes) {
            form.reset({
                ...vehicle,
                fuelTypeId: fuelTypes.find(ft => ft.name === vehicle.fuelTypeName)?.id,
                responsibleStaffId: users.find(u => `${u.firstName} ${u.lastName}` === vehicle.responsibleStaffName)?.id,
                driverId: users.find(u => `${u.firstName} ${u.lastName}` === vehicle.driverName)?.id,
            });
            if (vehicle.insuranceEndDate) setInsuranceEndDate(new Date(vehicle.insuranceEndDate));
            if (vehicle.boloEndDate) setBoloEndDate(new Date(vehicle.boloEndDate));
        }
    }, [vehicle, users, fuelTypes, form]);

    const responsibleStaffId = form.watch("responsibleStaffId");
    const selectedStaff = users.find((user) => user.id === Number(responsibleStaffId));
    const showDriverField = selectedStaff && !selectedStaff.canDrive;

    const availableDrivers = users.filter((user) => user.canDrive);
    const staffUsers = users.filter((user) => user.roles?.some((role) => role.name.toLowerCase() === "staff"));

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setImageFile(e.target.files[0]);
    };

    const handleLibreUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setLibreFile(e.target.files[0]);
    };

    const handleSubmit = async (values: z.infer<typeof editVehicleSchema>) => {
        setUploading(true);
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });

        if (imageFile) formData.append("vehicleImg", imageFile);
        if (libreFile) formData.append("libreImg", libreFile);
        
        if (vehicle?.id) {
           await onSubmit(vehicle.id, formData);
        }
        setUploading(false);
    };

    if (!vehicle) return <p>Loading vehicle data...</p>;

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <VehicleFileUploads
                        handleImageUpload={handleImageUpload}
                        handleLibreUpload={handleLibreUpload}
                        imageFile={imageFile}
                        libreFile={libreFile}
                    />
                    {vehicle.imgSrc && !imageFile && (
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Current Image</label>
                           <img src={vehicle.imgSrc} alt="Current vehicle" className="mt-2 h-20 w-auto rounded-md border" />
                        </div>
                    )}
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
