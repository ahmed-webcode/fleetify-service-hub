import { VehicleStatus, VehicleType } from "@/lib/apiClient"; // Assuming these enums are in apiClient or a shared types file

// Base DTO for vehicle properties that can be updated.
// All fields are optional for PATCH requests.
export interface UpdateVehicleDto {
    id: number; // ID is required to know which vehicle to update
    plateNumber?: string;
    vehicleType?: VehicleType;
    model?: string;
    fuelTypeId?: number;
    status?: VehicleStatus;
    isPrivate?: boolean;
    chassisNumber?: string;
    motorNumber?: string;
    color?: string;
    madeYear?: number;
    responsibleStaffId?: number;
    madeIn?: string;
    lastQuotaRefuel?: string; // Assuming string for date ISO format
    horsePower?: number;
    singleWeight?: number;
    totalWeight?: number;
    axleCount?: number;
    cylinderCount?: number;
    seatsCount?: number;
    kmReading?: number;
    workEnvironment?: string;
    fuelConsumptionRate?: number;
    driverId?: number;
    insuranceCompany?: string;
    insuranceEndDate?: string; // Assuming string for date ISO format
    boloEndDate?: string; // Assuming string for date ISO format
    // MultipartFile fields will be handled as FormData entries, not directly in this DTO type for client-side state.
    // vehicleImg?: File;
    // libreImg?: File;
}

// Props for the EditVehicleForm component
export interface EditVehicleFormProps {
    vehicle: VehicleDto; // The vehicle data to pre-fill the form
    onSubmit: (id: number, data: FormData) => Promise<{ success: boolean; error?: any }>;
    onCancel: () => void;
    // You'll also need to pass lists for dropdowns like fuel types, users (for staff/driver) etc.
    // e.g., fuelTypes: FuelTypeDto[]; users: UserSelectionDto[];
}

// Assuming VehicleDto is already defined in apiClient.ts or a shared types file
// If not, you would define it here as well, similar to the backend VehicleDto structure
// For example:
/*
export interface VehicleDto {
    id: number;
    plateNumber: string;
    isPrivate: boolean;
    vehicleType: VehicleType;
    status: VehicleStatus;
    model: string;
    fuelTypeName: string;
    madeYear: number;
    workEnvironment?: string;
    kmReading?: number;
    color?: string;
    imgSrc?: string;
    libreSrc?: string;
    madeIn?: string;
    chassisNumber?: string;
    motorNumber?: string;
    horsePower?: number;
    singleWeight?: number;
    totalWeight?: number;
    axleCount?: number;
    cylinderCount?: number;
    seatsCount?: number;
    fuelConsumptionRate?: number;
    insuranceCompany?: string;
    lastQuotaRefuel?: string; 
    insuranceEndDate?: string;
    boloEndDate?: string;
    responsibleStaffName?: string;
    driverName?: string;
    createdAt: string;
    updatedAt: string;
}
*/
