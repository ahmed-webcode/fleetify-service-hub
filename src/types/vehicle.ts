import { PageResponse } from "./common";
import { LevelRef } from "./user";

export interface FuelType {
    id: number;
    name: string;
}

// Types for Vehicle Management
export interface VehicleDto {
    id: number;
    plateNumber: string;
    isPrivate: boolean;
    isService: boolean;
    vehicleType: VehicleType;
    status: VehicleStatus;
    model: string;
    fuelType: FuelType;
    level: LevelRef;
    madeYear: number;
    workEnvironment: string;
    color: string;
    imgSrc: string | null;
    libreSrc: string | null;
    madeIn: string;
    chassisNumber: string;
    motorNumber: string;
    seatsCount: number;
    fuelConsumptionRate: number | string;
    insuranceCompany: string | null;
    insuranceExpiryDate: string | null;
    boloExpiryDate: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface VehicleDetail {
    general: VehicleDto;
    maintenances: PageResponse<any>;
    incidents: PageResponse<any>;
    insurances: PageResponse<any>;
}

export enum VehicleType {
    Coaster = "Coaster",
    Bus = "Bus",
    Truck = "Truck",
    Car = "Car",
    Van = "Van",
    Motorcycle = "Motorcycle",
}

export enum VehicleStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE",
    OUT_OF_SERVICE = "OUT_OF_SERVICE",
}

export interface CreateVehicleDto {
    plateNumber: string;
    vehicleType: VehicleType;
    model: string;
    fuelTypeId: number;
    status: VehicleStatus;
    isPrivate: boolean;
    isService: boolean;
    chassisNumber: string;
    motorNumber: string;
    color: string;
    madeYear: number;
    levelId: number;
    madeIn?: string;
    seatsCount?: number;
    workEnvironment?: string;
    fuelConsumptionRate?: number | string;
    insuranceCompany?: string;
    insuranceExpiryDate?: string;
    boloExpiryDate?: string;
    vehicleImg?: File;
    libreImg?: File;
}

export interface UpdateVehicleDto {
    id: number;
    plateNumber?: string;
    vehicleType?: VehicleType;
    model?: string;
    fuelTypeId?: number;
    status?: VehicleStatus;
    isPrivate?: boolean;
    isService?: boolean;
    chassisNumber?: string;
    motorNumber?: string;
    color?: string;
    madeYear?: number;
    levelId?: number;
    madeIn?: string;
    seatsCount?: number;
    workEnvironment?: string;
    fuelConsumptionRate?: number | string;
    insuranceCompany?: string;
    insuranceExpiryDate?: string;
    boloExpiryDate?: string;
    vehicleImg?: File;
    libreImg?: File;
}

export interface VehicleQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}

export interface EditVehicleFormProps {
    vehicle: VehicleDto;
    onSubmit: (id: number, data: FormData) => Promise<void>;
    onCancel: () => void;
}
