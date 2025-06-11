import { PageResponse } from "./common";

// Types for Vehicle Management
export interface VehicleDto {
    id: number;
    plateNumber: string;
    isPrivate: boolean;
    vehicleType: VehicleType;
    status: VehicleStatus;
    model: string;
    fuelTypeName: string;
    madeYear: number;
    workEnvironment: string;
    kmReading: number;
    color: string;
    imgSrc: string | null;
    libreSrc: string | null;
    madeIn: string;
    chassisNumber: string;
    motorNumber: string;
    horsePower: number;
    singleWeight: number;
    totalWeight: number;
    axleCount: number | null;
    cylinderCount: number;
    seatsCount: number;
    fuelConsumptionRate: number;
    insuranceCompany: string | null;
    lastQuotaRefuel: string | null;
    insuranceEndDate: string | null;
    boloEndDate: string | null;
    responsibleStaffName: string;
    driverName: string | null;
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
    chassisNumber: string;
    motorNumber: string;
    color: string;
    madeYear: number;
    responsibleStaffId: number;
    madeIn: string;
    horsePower: number;
    singleWeight: number;
    totalWeight: number;
    axleCount?: number;
    cylinderCount: number;
    seatsCount: number;
    kmReading: number;
    workEnvironment: string;
    fuelConsumptionRate: number;
    driverId?: number;
    insuranceCompany?: string;
    insuranceEndDate?: string;
    boloEndDate?: string;
    lastQuotaRefuel?: string;
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
    chassisNumber?: string;
    motorNumber?: string;
    color?: string;
    madeYear?: number;
    responsibleStaffId?: number;
    madeIn?: string;
    horsePower?: number;
    singleWeight?: number;
    totalWeight?: number;
    axleCount?: number;
    cylinderCount?: number;
    seatsCount?: number;
    kmReading?: number;
    workEnvironment: string;
    fuelConsumptionRate: number;
    driverId?: number;
    insuranceCompany?: string;
    insuranceEndDate?: string;
    boloEndDate?: string;
    lastQuotaRefuel?: string;
    vehicleImg?: File;
    libreImg?: File;
}

export interface VehicleQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}
