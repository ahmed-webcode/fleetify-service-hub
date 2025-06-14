
import { ActionType, RequestStatus, TargetType } from "./common";

// Types for Fuel Request Management
export interface CreateFuelRequestDto {
    requestType: TargetType;
    vehicleId?: number;
    levelId?: number;
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
    status: RequestStatus;
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
