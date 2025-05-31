import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea"; // Assuming you might need it
import { EditVehicleFormProps, UpdateVehicleDto } from "@/types/vehicle"; // Import new types
import { VehicleDto, VehicleStatus, VehicleType } from "@/lib/apiClient"; // Assuming these enums are in apiClient

// This is a placeholder. You will need to replace this with your actual form structure,
// similar to AddVehicleForm.tsx, but for editing.

export function EditVehicleForm({ vehicle, onSubmit, onCancel }: EditVehicleFormProps) {
    // Initialize form state with the vehicle data
    // For simplicity, using a generic state. You'll want to map vehicle props to form fields.
    const [formData, setFormData] = useState<Partial<UpdateVehicleDto>>({});
    const [vehicleImageFile, setVehicleImageFile] = useState<File | null>(null);
    const [libreImageFile, setLibreImageFile] = useState<File | null>(null);

    useEffect(() => {
        // Populate formData from the vehicle prop when it changes
        // This ensures the form is pre-filled with the correct data
        if (vehicle) {
            setFormData({
                id: vehicle.id,
                plateNumber: vehicle.plateNumber,
                vehicleType: vehicle.vehicleType,
                model: vehicle.model,
                // fuelTypeId: vehicle.fuelTypeId, // You'll need to get this from fuelTypeName or have it in VehicleDto
                status: vehicle.status,
                // isPrivate: vehicle.isPrivate, // Backend UpdateVehicleDto doesn't list this, but CreateDto does. Clarify if editable.
                chassisNumber: vehicle.chassisNumber,
                motorNumber: vehicle.motorNumber,
                color: vehicle.color,
                madeYear: vehicle.madeYear,
                // responsibleStaffId: vehicle.responsibleStaffId, // Need to map from name or get ID
                madeIn: vehicle.madeIn,
                lastQuotaRefuel: vehicle.lastQuotaRefuel,
                horsePower: vehicle.horsePower,
                singleWeight: vehicle.singleWeight,
                totalWeight: vehicle.totalWeight,
                axleCount: vehicle.axleCount,
                cylinderCount: vehicle.cylinderCount,
                seatsCount: vehicle.seatsCount,
                kmReading: vehicle.kmReading,
                workEnvironment: vehicle.workEnvironment,
                fuelConsumptionRate: vehicle.fuelConsumptionRate,
                // driverId: vehicle.driverId, // Need to map from name or get ID
                insuranceCompany: vehicle.insuranceCompany,
                insuranceEndDate: vehicle.insuranceEndDate,
                boloEndDate: vehicle.boloEndDate,
            });
        }
    }, [vehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // @ts-ignore // Basic handling, refine as per your needs
        const isCheckbox =
            type === "checkbox" && e.target instanceof HTMLInputElement && e.target.checked;
        // @ts-ignore
        setFormData((prev) => ({ ...prev, [name]: isCheckbox ? e.target.checked : value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        // Convert to number if it's a field like 'madeYear', 'fuelTypeId', etc.
        const numValueFields = [
            "madeYear",
            "fuelTypeId",
            "responsibleStaffId",
            "driverId" /* add other numeric fields */,
        ];
        const finalValue = numValueFields.includes(name) ? parseInt(value, 10) : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        fileType: "vehicleImg" | "libreImg"
    ) => {
        if (e.target.files && e.target.files[0]) {
            if (fileType === "vehicleImg") {
                setVehicleImageFile(e.target.files[0]);
            } else if (fileType === "libreImg") {
                setLibreImageFile(e.target.files[0]);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();

        // Append non-file fields from formData state
        for (const key in formData) {
            // @ts-ignore
            if (formData[key] !== null && formData[key] !== undefined && key !== "id") {
                // Exclude id from FormData body
                // @ts-ignore
                data.append(key, String(formData[key]));
            }
        }

        // Append file fields if they exist
        if (vehicleImageFile) {
            data.append("vehicleImg", vehicleImageFile);
        }
        if (libreImageFile) {
            data.append("libreImg", libreImageFile);
        }

        // ID is passed separately to onSubmit, not in FormData for PATCH
        if (vehicle && vehicle.id) {
            await onSubmit(vehicle.id, data);
        }
    };

    if (!vehicle) return <p>Loading vehicle data...</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-1">
            <h2 className="text-xl font-semibold">
                Edit Vehicle: {vehicle.model} ({vehicle.plateNumber})
            </h2>

            {/* 
        ADD YOUR FORM FIELDS HERE, similar to AddVehicleForm.tsx.
        Pre-fill them using the `formData` state.
        Example for one field:
      */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="plateNumber">Plate Number</Label>
                    <Input
                        id="plateNumber"
                        name="plateNumber"
                        value={formData.plateNumber || ""}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label htmlFor="model">Model</Label>
                    <Input
                        id="model"
                        name="model"
                        value={formData.model || ""}
                        onChange={handleChange}
                    />
                </div>

                {/* Example for a Select field (assuming VehicleType is an enum/object) */}
                <div>
                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                    <Select
                        name="vehicleType"
                        value={formData.vehicleType || ""}
                        onValueChange={(value) => handleSelectChange("vehicleType", value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.values(VehicleType).map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type.replace(/_/g, " ")}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Example for Image Upload */}
                <div>
                    <Label htmlFor="vehicleImg">Vehicle Image</Label>
                    <Input
                        id="vehicleImg"
                        name="vehicleImg"
                        type="file"
                        onChange={(e) => handleFileChange(e, "vehicleImg")}
                    />
                    {vehicle.imgSrc && !vehicleImageFile && (
                        <img
                            src={vehicle.imgSrc}
                            alt="Current vehicle"
                            className="mt-2 h-20 w-auto"
                        />
                    )}
                </div>
            </div>
            {/* ... Add all other fields from UpdateVehicleDto, pre-filled and with onChange handlers ... */}

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    );
}
