import { ActionType, RequestStatus, TargetType } from "./common";

// Types for Fuel Request Management
export interface CreateFuelRequestDto {
    targetType: TargetType;
    vehicleId?: number;
    levelId?: number;
    projectId?: number;
    fuelTypeId: number;
    requestNote?: string;
    requestedAmount: number;
}

export interface FuelRequestActionDto {
    action: ActionType;
    actedAmount?: number;
    actionReason?: string;
}

export interface FuelRequestDto {
    id: number;
    targetType: TargetType;
    vehiclePlateNumber?: string;
    levelName: string;
    projectName?: string;
    fuelTypeName: string;
    status: RequestStatus;
    requestedBy: string;
    requestedAmount: number;
    requestNote?: string;
    requestedAt: string;
    actedByName?: string;
    actedAt?: string;
    actedAmount?: number;
    actionReason?: string;
    createdAt?: string;
    updatedAt: string;
}
