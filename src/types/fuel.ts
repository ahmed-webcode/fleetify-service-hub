import { ActionType, RequestStatus, TargetType } from "./common";

// Types for Fuel Request Management
export interface CreateFuelRequestDto {
    requestType: TargetType;
    vehicleId?: number;
    fuelTypeId: number;
    requestNote?: string;
    requestedAmount: number;
}

export interface FuelRequestActionDto {
    action: ActionType;
    actedAmount?: number;
    actionNote?: string;
}

export interface FuelRequestDto {
    id: number;
    requestType: TargetType;
    vehiclePlateNumber?: string;
    levelName: string;
    fuelTypeName: string;
    status: FuelRequestStatus;
    requestedBy: string;
    requestedAmount: number;
    requestNote?: string;
    requestedAt: string;
    actedByName?: string;
    actedAt?: string;
    actedAmount?: number;
    actionNote?: string;
    createdAt?: string;
    updatedAt: string;
}

// ----- Record Type Enum -----
export enum RecordType {
    QUOTA = "QUOTA",
    REQUEST = "REQUEST",
    EXTERNAL = "EXTERNAL",
}

// ----- Fuel Issue, Receive, and Record Types -----
export interface FuelIssueDto {
    recordType: RecordType;
    vehicleId?: number;
    receiverId?: number;
    fuelRequestId?: number;
    fuelTypeId: number;
    issuedAmount: number;
}

export interface FuelReceiveDto {
    receivedAmount: number;
}

export interface FuelRecordFullDto {
    id: number;
    recordType: RecordType;
    vehicle?: {
        id: number;
        plateNumber: string;
    } | null;
    fuelRequest?: {
        id: number;
        requestType?: string;
        fuelType?: {
            id: number;
            name: string;
        };
    } | null;
    fuelType: {
        id: number;
        name: string;
    };
    level?: {
        id: number;
        name: string;
    } | null;
    issuedBy: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
    issuedAt: string;
    receivedBy?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    } | null;
    receivedAt?: string | null;
    issuedAmount: number;
    receivedAmount?: number | null;
}

// Add this at the end of the file:
export interface FuelFull {
    id: number;
    fuelType: {
        id: number;
        name: string;
    };
    pricePerLiter: number;
    amount: number;
    updatedAt: string;
}

export enum FuelRequestStatus {
    APPROVED = "APPROVED",
    APPROVED_WITH_MODIFICATION = "APPROVED_WITH_MODIFICATION",
    PENDING = "PENDING",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED",
}
